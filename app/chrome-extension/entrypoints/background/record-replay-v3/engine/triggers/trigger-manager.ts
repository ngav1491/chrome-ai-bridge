/**
 * @fileoverview triggerquản lý
 * @description
 * TriggerManager quản lýtất cảtrigger Handler :
 * -  TriggerStore triggercài đặt
 * - xử lýtriggerkích hoạtsự kiện, gọi enqueueRun
 * - chống bão (cooldown + maxQueued)
 *
 * lý do thiết kế:
 * - Orchestrator schema: TriggerManager trực tiếptriển khaitriggerlogic, ủy thác cho per-kind Handler
 * - Handler factoryschema: TriggerManager tạo Handler thể hiện,  fireCallback
 * - chống bão: cooldown (per-trigger) + maxQueued (global best-effort)
 */

import type { UnixMillis } from '../../domain/json';
import type { RunId, TriggerId } from '../../domain/ids';
import type { TriggerFireContext, TriggerKind, TriggerSpec } from '../../domain/triggers';
import type { StoragePort } from '../storage/storage-port';
import type { EventsBus } from '../transport/events-bus';
import type { RunScheduler } from '../queue/scheduler';
import { enqueueRun, type EnqueueRunResult } from '../queue/enqueue-run';
import type { TriggerFireCallback, TriggerHandler, TriggerHandlerFactory } from './trigger-handler';

// ==================== Types ====================

/**
 * Handler factoryánh xạ
 */
export type TriggerHandlerFactories = Partial<{
  [K in TriggerKind]: TriggerHandlerFactory<K>;
}>;

/**
 * chống bãocấu hình
 */
export interface TriggerManagerStormControl {
  /**
   * triggerkích hoạtkhoảng cách (ms)
   * - 0  undefined biểu thịvô hiệu hóa
   */
  cooldownMs?: number;

  /**
   * toàn cụctối đa Run
   * - kích hoạt
   * - undefined biểu thịvô hiệu hóakiểm tra
   * - lưu ý:  best-effort kiểm tra,
   */
  maxQueued?: number;
}

/**
 * TriggerManager phụ thuộc
 */
export interface TriggerManagerDeps {
  /** lưu trữ */
  storage: Pick<StoragePort, 'triggers' | 'flows' | 'runs' | 'queue'>;
  /** sự kiệnbus */
  events: Pick<EventsBus, 'append'>;
  /** bộ lập lịch (tùy chọn) */
  scheduler?: Pick<RunScheduler, 'kick'>;
  /** Handler factoryánh xạ */
  handlerFactories: TriggerHandlerFactories;
  /** chống bãocấu hình */
  storm?: TriggerManagerStormControl;
  /** RunId trình tạo (dùng để kiểm thử tiêm) */
  generateRunId?: () => RunId;
  /** nguồn thời gian (dùng để kiểm thử tiêm) */
  now?: () => UnixMillis;
  /** logger */
  logger?: Pick<Console, 'debug' | 'info' | 'warn' | 'error'>;
}

/**
 * TriggerManager trạng thái
 */
export interface TriggerManagerState {
  /** có/khôngkhởi động */
  started: boolean;
  /** cài đặttrigger ID danh sách */
  installedTriggerIds: TriggerId[];
}

/**
 * TriggerManager giao diện
 */
export interface TriggerManager {
  /** khởi độngquản lý, cài đặttất cảbậttrigger */
  start(): Promise<void>;
  /** dừngquản lý, gỡ cài đặttất cảtrigger */
  stop(): Promise<void>;
  /** làm mớitrigger, lưu trữcài đặt */
  refresh(): Promise<void>;
  /**
   * thủ côngkích hoạttrigger
   * @description  RPC/UI gọi, dùng cho manual trigger
   */
  fire(
    triggerId: TriggerId,
    context?: { sourceTabId?: number; sourceUrl?: string },
  ): Promise<EnqueueRunResult>;
  /** hủyquản lý */
  dispose(): Promise<void>;
  /** lấyhiện tạitrạng thái */
  getState(): TriggerManagerState;
}

// ==================== Utilities ====================

/**
 * xác thực
 */
function normalizeNonNegativeInt(value: unknown, fallback: number, fieldName: string): number {
  if (value === undefined || value === null) return fallback;
  if (typeof value !== 'number' || !Number.isFinite(value)) {
    throw new Error(`${fieldName} must be a finite number`);
  }
  return Math.max(0, Math.floor(value));
}

/**
 * xác thực
 */
function normalizePositiveInt(value: unknown, fieldName: string): number {
  if (typeof value !== 'number' || !Number.isFinite(value)) {
    throw new Error(`${fieldName} must be a finite number`);
  }
  const intValue = Math.floor(value);
  if (intValue < 1) {
    throw new Error(`${fieldName} must be >= 1`);
  }
  return intValue;
}

// ==================== Implementation ====================

/**
 * tạo TriggerManager
 */
export function createTriggerManager(deps: TriggerManagerDeps): TriggerManager {
  const logger = deps.logger ?? console;
  const now = deps.now ?? (() => Date.now());

  // chống bãotham số
  const cooldownMs = normalizeNonNegativeInt(deps.storm?.cooldownMs, 0, 'storm.cooldownMs');
  const maxQueued =
    deps.storm?.maxQueued === undefined || deps.storm?.maxQueued === null
      ? undefined
      : normalizePositiveInt(deps.storm.maxQueued, 'storm.maxQueued');

  // trạng thái
  const installed = new Map<TriggerId, TriggerSpec>();
  const lastFireAt = new Map<TriggerId, UnixMillis>();
  let started = false;
  let inFlightEnqueues = 0;

  //  refresh
  let refreshPromise: Promise<void> | null = null;
  let pendingRefresh = false;

  // Handler thể hiện
  const handlers = new Map<TriggerKind, TriggerHandler<TriggerKind>>();

  // kích hoạtcallback
  const fireCallback: TriggerFireCallback = {
    onFire: async (triggerId, context) => {
      // tất cảngoại lệ, tránh chrome API lắng nghe
      try {
        await handleFire(triggerId as TriggerId, context);
      } catch (e) {
        logger.error('[TriggerManager] onFire failed:', e);
      }
    },
  };

  // khởi tạo Handler thể hiện
  for (const [kind, factory] of Object.entries(deps.handlerFactories) as Array<
    [TriggerKind, TriggerHandlerFactory<TriggerKind> | undefined]
  >) {
    if (!factory) continue; // Skip undefined factory values

    const handler = factory(fireCallback) as TriggerHandler<TriggerKind>;
    if (handler.kind !== kind) {
      throw new Error(
        `[TriggerManager] Handler kind mismatch: factory key is "${kind}", but handler.kind is "${handler.kind}"`,
      );
    }
    handlers.set(kind, handler);
  }

  /**
   * xử lýtriggerkích hoạt(bên trongphương thức)
   * @param throwOnDrop nếu true,  cooldown/maxQueued lỗi
   * @returns EnqueueRunResult  null()
   */
  async function handleFire(
    triggerId: TriggerId,
    context: { sourceTabId?: number; sourceUrl?: string },
    options?: { throwOnDrop?: boolean },
  ): Promise<EnqueueRunResult | null> {
    if (!started) {
      if (options?.throwOnDrop) {
        throw new Error('TriggerManager is not started');
      }
      return null;
    }

    const trigger = installed.get(triggerId);
    if (!trigger) {
      if (options?.throwOnDrop) {
        throw new Error(`Trigger "${triggerId}" is not installed`);
      }
      return null;
    }

    const t = now();

    // Per-trigger cooldown kiểm tra
    const prevLastFireAt = lastFireAt.get(triggerId);
    if (cooldownMs > 0 && prevLastFireAt !== undefined && t - prevLastFireAt < cooldownMs) {
      logger.debug(`[TriggerManager] Dropping trigger "${triggerId}" (cooldown ${cooldownMs}ms)`);
      if (options?.throwOnDrop) {
        throw new Error(`Trigger "${triggerId}" dropped (cooldown ${cooldownMs}ms)`);
      }
      return null;
    }

    // Global maxQueued kiểm tra (best-effort)
    // lưu ý:  cooldown cài đặtkiểm tra, tránh maxQueued drop  cooldown
    if (maxQueued !== undefined) {
      const queued = await deps.storage.queue.list('queued');
      if (queued.length + inFlightEnqueues >= maxQueued) {
        logger.warn(
          `[TriggerManager] Dropping trigger "${triggerId}" (queued=${queued.length}, inFlight=${inFlightEnqueues}, maxQueued=${maxQueued})`,
        );
        if (options?.throwOnDrop) {
          throw new Error(`Trigger "${triggerId}" dropped (maxQueued=${maxQueued})`);
        }
        return null;
      }
    }

    // cài đặt lastFireAt kích hoạt( maxQueued kiểm trathông qua)
    if (cooldownMs > 0) {
      lastFireAt.set(triggerId, t);
    }

    // xây dựngkích hoạtngữ cảnh
    const triggerContext: TriggerFireContext = {
      triggerId: trigger.id,
      kind: trigger.kind,
      firedAt: t,
      sourceTabId: context.sourceTabId,
      sourceUrl: context.sourceUrl,
    };

    inFlightEnqueues += 1;
    try {
      const result = await enqueueRun(
        {
          storage: deps.storage,
          events: deps.events,
          scheduler: deps.scheduler,
          generateRunId: deps.generateRunId,
          now,
        },
        {
          flowId: trigger.flowId,
          args: trigger.args,
          trigger: triggerContext,
        },
      );
      return result;
    } catch (e) {
      // vào hàng đợithất bạikhôi phục cooldown
      if (cooldownMs > 0) {
        if (prevLastFireAt === undefined) {
          lastFireAt.delete(triggerId);
        } else {
          lastFireAt.set(triggerId, prevLastFireAt);
        }
      }
      const msg = e instanceof Error ? e.message : String(e);
      logger.error(`[TriggerManager] enqueueRun failed for trigger "${triggerId}":`, e);
      if (options?.throwOnDrop) {
        throw new Error(`enqueueRun failed for trigger "${triggerId}": ${msg}`);
      }
      return null;
    } finally {
      inFlightEnqueues -= 1;
    }
  }

  /**
   * thủ côngkích hoạttrigger()
   * @description dùng cho RPC/UI gọi, lỗi
   */
  async function fire(
    triggerId: TriggerId,
    context: { sourceTabId?: number; sourceUrl?: string } = {},
  ): Promise<EnqueueRunResult> {
    const result = await handleFire(triggerId, context, { throwOnDrop: true });
    if (!result) {
      throw new Error(`Trigger "${triggerId}" did not enqueue a run`);
    }
    return result;
  }

  /**
   * thực thilàm mới
   */
  async function doRefresh(): Promise<void> {
    const triggers = await deps.storage.triggers.list();
    if (!started) return;

    // gỡ cài đặttất cả, cài đặt (chiến lược, )
    // Best-effort: đơn lẻ handler gỡ cài đặtthất bạikhông ảnh hưởngkhác
    for (const handler of handlers.values()) {
      try {
        await handler.uninstallAll();
      } catch (e) {
        logger.warn(`[TriggerManager] Error during uninstallAll for kind "${handler.kind}":`, e);
      }
    }
    installed.clear();

    // cài đặtbậttrigger
    for (const trigger of triggers) {
      if (!started) return;
      if (!trigger.enabled) continue;

      const handler = handlers.get(trigger.kind);
      if (!handler) {
        logger.warn(`[TriggerManager] No handler registered for kind "${trigger.kind}"`);
        continue;
      }

      try {
        await handler.install(trigger as Parameters<typeof handler.install>[0]);
        installed.set(trigger.id, trigger);
      } catch (e) {
        logger.error(`[TriggerManager] Failed to install trigger "${trigger.id}":`, e);
      }
    }
  }

  /**
   * làm mớitrigger (gọi)
   */
  async function refresh(): Promise<void> {
    if (!started) {
      throw new Error('TriggerManager is not started');
    }

    pendingRefresh = true;
    if (!refreshPromise) {
      refreshPromise = (async () => {
        while (started && pendingRefresh) {
          pendingRefresh = false;
          await doRefresh();
        }
      })().finally(() => {
        refreshPromise = null;
      });
    }

    return refreshPromise;
  }

  /**
   * khởi độngquản lý
   */
  async function start(): Promise<void> {
    if (started) return;
    started = true;
    await refresh();
  }

  /**
   * dừngquản lý
   */
  async function stop(): Promise<void> {
    if (!started) return;

    started = false;
    pendingRefresh = false;

    // chờtrong refresh hoàn tất
    if (refreshPromise) {
      try {
        await refreshPromise;
      } catch {
        // bỏ qua refresh lỗi
      }
    }

    // gỡ cài đặttất cảtrigger
    for (const handler of handlers.values()) {
      try {
        await handler.uninstallAll();
      } catch (e) {
        logger.warn('[TriggerManager] Error uninstalling handler:', e);
      }
    }
    installed.clear();
    lastFireAt.clear();
  }

  /**
   * hủyquản lý
   */
  async function dispose(): Promise<void> {
    await stop();
  }

  /**
   * lấytrạng thái
   */
  function getState(): TriggerManagerState {
    return {
      started,
      installedTriggerIds: Array.from(installed.keys()),
    };
  }

  return { start, stop, refresh, fire, dispose, getState };
}
