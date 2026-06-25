/**
 * @fileoverview Interval Trigger Handler (M3.1)
 * @description
 * Sử dụng periodInMinutes của chrome.alarms để triển khai kích hoạt khoảng thời gian cố định.
 *
 * Chiến lược:
 * - Mỗi trigger tương ứng với một alarm lặp lại
 * - Dùng delayInMinutes để lần kích hoạt đầu tiên sau khoảng thời gian đã cấu hình
 */

import type { TriggerId } from '../../domain/ids';
import type { TriggerSpecByKind } from '../../domain/triggers';
import type { TriggerFireCallback, TriggerHandler, TriggerHandlerFactory } from './trigger-handler';

// ==================== Types ====================

type IntervalTriggerSpec = TriggerSpecByKind<'interval'>;

export interface IntervalTriggerHandlerDeps {
  logger?: Pick<Console, 'debug' | 'info' | 'warn' | 'error'>;
}

interface InstalledIntervalTrigger {
  spec: IntervalTriggerSpec;
  periodMinutes: number;
  version: number;
}

// ==================== Constants ====================

const ALARM_PREFIX = 'rr_v3_interval_';

// ==================== Utilities ====================

/**
 * Xác thực và chuẩn hóa periodMinutes
 */
function normalizePeriodMinutes(value: unknown): number {
  if (typeof value !== 'number' || !Number.isFinite(value)) {
    throw new Error('periodMinutes must be a finite number');
  }
  if (value < 1) {
    throw new Error('periodMinutes must be >= 1');
  }
  return value;
}

/**
 * Tạo tên alarm
 */
function alarmNameForTrigger(triggerId: TriggerId): string {
  return `${ALARM_PREFIX}${triggerId}`;
}

/**
 * Phân tích triggerId từ tên alarm
 */
function parseTriggerIdFromAlarmName(name: string): TriggerId | null {
  if (!name.startsWith(ALARM_PREFIX)) return null;
  const id = name.slice(ALARM_PREFIX.length);
  return id ? (id as TriggerId) : null;
}

// ==================== Handler Implementation ====================

/**
 * Tạo factory xử lý trigger khoảng thời gian
 */
export function createIntervalTriggerHandlerFactory(
  deps?: IntervalTriggerHandlerDeps,
): TriggerHandlerFactory<'interval'> {
  return (fireCallback) => createIntervalTriggerHandler(fireCallback, deps);
}

/**
 * Tạo bộ xử lý trigger khoảng thời gian
 */
export function createIntervalTriggerHandler(
  fireCallback: TriggerFireCallback,
  deps?: IntervalTriggerHandlerDeps,
): TriggerHandler<'interval'> {
  const logger = deps?.logger ?? console;

  const installed = new Map<TriggerId, InstalledIntervalTrigger>();
  const versions = new Map<TriggerId, number>();
  let listening = false;

  /**
   * Tăng phiên bản để làm hiệu lực các thao tác đang chờ
   */
  function bumpVersion(triggerId: TriggerId): number {
    const next = (versions.get(triggerId) ?? 0) + 1;
    versions.set(triggerId, next);
    return next;
  }

  /**
   * Xóa alarm chỉ định
   */
  async function clearAlarmByName(name: string): Promise<void> {
    if (!chrome.alarms?.clear) return;
    try {
      await Promise.resolve(chrome.alarms.clear(name));
    } catch (e) {
      logger.debug('[IntervalTriggerHandler] alarms.clear failed:', e);
    }
  }

  /**
   * Xóa tất cả alarm khoảng thời gian
   */
  async function clearAllIntervalAlarms(): Promise<void> {
    if (!chrome.alarms?.getAll || !chrome.alarms?.clear) return;
    try {
      const alarms = await Promise.resolve(chrome.alarms.getAll());
      const list = Array.isArray(alarms) ? alarms : [];
      await Promise.all(
        list.filter((a) => a?.name?.startsWith(ALARM_PREFIX)).map((a) => clearAlarmByName(a.name)),
      );
    } catch (e) {
      logger.debug('[IntervalTriggerHandler] alarms.getAll failed:', e);
    }
  }

  /**
   * Lập lịch alarm
   */
  async function schedule(triggerId: TriggerId, expectedVersion: number): Promise<void> {
    if (!chrome.alarms?.create) {
      logger.warn('[IntervalTriggerHandler] chrome.alarms.create is unavailable');
      return;
    }

    const entry = installed.get(triggerId);
    if (!entry || entry.version !== expectedVersion) return;

    const name = alarmNameForTrigger(triggerId);
    const periodInMinutes = entry.periodMinutes;

    try {
      // Sử dụng delayInMinutes và periodInMinutes để tạo alarm lặp lại
      // Lần kích hoạt đầu tiên sau periodInMinutes, sau đó kích hoạt mỗi periodInMinutes
      await Promise.resolve(
        chrome.alarms.create(name, {
          delayInMinutes: periodInMinutes,
          periodInMinutes,
        }),
      );
    } catch (e) {
      logger.error(`[IntervalTriggerHandler] alarms.create failed for trigger "${triggerId}":`, e);
    }
  }

  /**
   * Xử lý sự kiện Alarm
   */
  const onAlarm = (alarm: chrome.alarms.Alarm): void => {
    const triggerId = parseTriggerIdFromAlarmName(alarm?.name ?? '');
    if (!triggerId) return;

    const entry = installed.get(triggerId);
    if (!entry) return;

    // Kích hoạt callback
    Promise.resolve(
      fireCallback.onFire(triggerId, {
        sourceTabId: undefined,
        sourceUrl: undefined,
      }),
    ).catch((e) => {
      logger.error(`[IntervalTriggerHandler] onFire failed for trigger "${triggerId}":`, e);
    });
  };

  /**
   * Đảm bảo đang lắng nghe sự kiện alarm
   */
  function ensureListening(): void {
    if (listening) return;
    if (!chrome.alarms?.onAlarm?.addListener) {
      logger.warn('[IntervalTriggerHandler] chrome.alarms.onAlarm is unavailable');
      return;
    }
    chrome.alarms.onAlarm.addListener(onAlarm);
    listening = true;
  }

  /**
   * Dừng lắng nghe sự kiện alarm
   */
  function stopListening(): void {
    if (!listening) return;
    try {
      chrome.alarms.onAlarm.removeListener(onAlarm);
    } catch (e) {
      logger.debug('[IntervalTriggerHandler] removeListener failed:', e);
    } finally {
      listening = false;
    }
  }

  return {
    kind: 'interval',

    async install(trigger: IntervalTriggerSpec): Promise<void> {
      const periodMinutes = normalizePeriodMinutes(trigger.periodMinutes);

      const version = bumpVersion(trigger.id);
      installed.set(trigger.id, {
        spec: { ...trigger, periodMinutes },
        periodMinutes,
        version,
      });

      ensureListening();
      await schedule(trigger.id, version);
    },

    async uninstall(triggerId: string): Promise<void> {
      const id = triggerId as TriggerId;
      bumpVersion(id);
      installed.delete(id);
      await clearAlarmByName(alarmNameForTrigger(id));

      if (installed.size === 0) {
        stopListening();
      }
    },

    async uninstallAll(): Promise<void> {
      for (const id of installed.keys()) {
        bumpVersion(id);
      }
      installed.clear();
      await clearAllIntervalAlarms();
      stopListening();
    },

    getInstalledIds(): string[] {
      return Array.from(installed.keys());
    },
  };
}
