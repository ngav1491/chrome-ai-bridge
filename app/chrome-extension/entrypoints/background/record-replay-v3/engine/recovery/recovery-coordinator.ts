/**
 * @fileoverview sậpkhôi phục (P3-06)
 * @description
 * MV3 Service Worker . SW khởi độnghàng đợitrạng thái Run ghi,
 *  Run khôi phụcthực thi.
 *
 * khôi phụcchiến lược:
 * - mồ côi running : thu hồi queued, chờlập lịch()
 * - mồ côi paused : tiếp quản lease, duy trì paused trạng thái
 * -  Run hàng đợi: dọn dẹp
 *
 * gọithời điểm:
 * - bắt buộc scheduler.start() trướcgọi
 * -  SW khởi độnggọimột lần
 */

import type { UnixMillis } from '../../domain/json';
import type { RunId } from '../../domain/ids';
import { isTerminalStatus, type RunStatus } from '../../domain/events';
import type { StoragePort } from '../storage/storage-port';
import type { EventsBus } from '../transport/events-bus';

// ==================== Types ====================

/**
 * khôi phụckết quả
 */
export interface RecoveryResult {
  /** thu hồi queued  running Run ID */
  requeuedRunning: RunId[];
  /** tiếp quản paused Run ID */
  adoptedPaused: RunId[];
  /** dọn dẹp Run ID */
  cleanedTerminal: RunId[];
}

/**
 * khôi phụcphụ thuộc
 */
export interface RecoveryCoordinatorDeps {
  /** lưu trữ */
  storage: StoragePort;
  /** sự kiệnbus */
  events: EventsBus;
  /** hiện tại Service Worker  ownerId */
  ownerId: string;
  /** nguồn thời gian */
  now: () => UnixMillis;
  /** logger */
  logger?: Pick<Console, 'debug' | 'info' | 'warn' | 'error'>;
}

// ==================== Main Function ====================

/**
 * thực thisậpkhôi phục
 * @description
 *  SW khởi độnggọi, hàng đợitrạng thái Run ghi.
 *
 * thực thithứ tự:
 * 1. dọn dẹp: kiểm trahàng đợitrongtất cả, dọn dẹp RunRecord
 * 2. khôi phụcmồ côilease: thu hồi running, tiếp quản paused
 * 3. đồng bộ RunRecord trạng thái: đảm bảo RunRecord hàng đợitrạng thái
 * 4. gửikhôi phụcsự kiện:  requeued running gửi run.recovered sự kiện
 */
export async function recoverFromCrash(deps: RecoveryCoordinatorDeps): Promise<RecoveryResult> {
  const logger = deps.logger ?? console;

  if (!deps.ownerId) {
    throw new Error('ownerId is required');
  }

  const now = deps.now();

  // lý do thiết kế: khôi phụcbắt buộc"dọn dẹptiếp quản/thu hồi",  Run thực thi
  const cleanedTerminalSet = new Set<RunId>();

  // ==================== Step 1: dọn dẹp ====================
  // kiểm trahàng đợitrongtất cả, dọn dẹp RunRecord
  try {
    const items = await deps.storage.queue.list();
    for (const item of items) {
      const runId = item.id;
      const run = await deps.storage.runs.get(runId);

      // phòng thủdọn dẹp:  RunRecord mục hàng đợikhông thểthực thi
      if (!run) {
        try {
          await deps.storage.queue.markDone(runId, now);
          cleanedTerminalSet.add(runId);
          logger.debug(`[Recovery] Cleaned orphan queue item without RunRecord: ${runId}`);
        } catch (e) {
          logger.warn('[Recovery] markDone for missing RunRecord failed:', runId, e);
        }
        continue;
      }

      // dọn dẹp Run(SW  runner hoàn tất, scheduler markDone sập)
      if (isTerminalStatus(run.status)) {
        try {
          await deps.storage.queue.markDone(runId, now);
          cleanedTerminalSet.add(runId);
          logger.debug(`[Recovery] Cleaned terminal queue item: ${runId} (status=${run.status})`);
        } catch (e) {
          logger.warn('[Recovery] markDone for terminal run failed:', runId, e);
        }
      }
    }
  } catch (e) {
    logger.warn('[Recovery] Pre-clean failed:', e);
  }

  // ==================== Step 2: khôi phụcmồ côilease ====================
  // Best-effort: thất bạikhởi động
  let requeuedRunning: Array<{ runId: RunId; prevOwnerId?: string }> = [];
  let adoptedPaused: Array<{ runId: RunId; prevOwnerId?: string }> = [];
  try {
    const result = await deps.storage.queue.recoverOrphanLeases(deps.ownerId, now);
    requeuedRunning = result.requeuedRunning;
    adoptedPaused = result.adoptedPaused;
  } catch (e) {
    logger.error('[Recovery] recoverOrphanLeases failed:', e);
    // tiếp tụcthực thi, khởi động
  }

  // ==================== Step 3: đồng bộ RunRecord trạng thái ====================
  const requeuedRunningIds: RunId[] = [];
  for (const entry of requeuedRunning) {
    const runId = entry.runId;
    requeuedRunningIds.push(runId);

    //  Step 1 dọn dẹp
    if (cleanedTerminalSet.has(runId)) {
      continue;
    }

    try {
      const run = await deps.storage.runs.get(runId);
      if (!run) {
        // RunRecord không tồn tại, dọn dẹpmục hàng đợi(phòng thủ)
        try {
          await deps.storage.queue.markDone(runId, now);
          cleanedTerminalSet.add(runId);
        } catch (markDoneErr) {
          logger.warn(
            '[Recovery] markDone for missing RunRecord in Step3 failed:',
            runId,
            markDoneErr,
          );
        }
        continue;
      }

      //  Run(khôi phụckháclogiccập nhật)
      // dọn dẹpmục hàng đợi,
      if (isTerminalStatus(run.status)) {
        try {
          await deps.storage.queue.markDone(runId, now);
          cleanedTerminalSet.add(runId);
          logger.debug(
            `[Recovery] Cleaned terminal queue item in Step3: ${runId} (status=${run.status})`,
          );
        } catch (markDoneErr) {
          logger.warn('[Recovery] markDone for terminal run in Step3 failed:', runId, markDoneErr);
        }
        continue;
      }

      // cập nhật RunRecord trạng thái queued
      await deps.storage.runs.patch(runId, { status: 'queued', updatedAt: now });

      // gửikhôi phụcsự kiện(best-effort, thất bạikhông ảnh hưởngkhôi phụcquy trình)
      try {
        const fromStatus: 'running' | 'paused' = run.status === 'paused' ? 'paused' : 'running';
        await deps.events.append({
          runId,
          type: 'run.recovered',
          reason: 'sw_restart',
          fromStatus,
          toStatus: 'queued',
          prevOwnerId: entry.prevOwnerId,
          ts: now,
        });
        logger.info(`[Recovery] Requeued orphan running run: ${runId} (from=${fromStatus})`);
      } catch (eventErr) {
        logger.warn('[Recovery] Failed to emit run.recovered event:', runId, eventErr);
        // tiếp tụcthực thi, không ảnh hưởngkhôi phụcquy trình
      }
    } catch (e) {
      logger.warn('[Recovery] Reconcile requeued running failed:', runId, e);
    }
  }

  // ==================== Step 4: đồng bộ adopted paused  RunRecord ====================
  const adoptedPausedIds: RunId[] = [];
  for (const entry of adoptedPaused) {
    const runId = entry.runId;
    adoptedPausedIds.push(runId);

    //  Step 1 dọn dẹp
    if (cleanedTerminalSet.has(runId)) {
      continue;
    }

    try {
      const run = await deps.storage.runs.get(runId);
      if (!run) {
        // RunRecord không tồn tại, dọn dẹpmục hàng đợi(phòng thủ)
        try {
          await deps.storage.queue.markDone(runId, now);
          cleanedTerminalSet.add(runId);
        } catch (markDoneErr) {
          logger.warn(
            '[Recovery] markDone for missing RunRecord in Step4 failed:',
            runId,
            markDoneErr,
          );
        }
        continue;
      }

      //  Run, dọn dẹpmục hàng đợi
      if (isTerminalStatus(run.status)) {
        try {
          await deps.storage.queue.markDone(runId, now);
          cleanedTerminalSet.add(runId);
          logger.debug(
            `[Recovery] Cleaned terminal queue item in Step4: ${runId} (status=${run.status})`,
          );
        } catch (markDoneErr) {
          logger.warn('[Recovery] markDone for terminal run in Step4 failed:', runId, markDoneErr);
        }
        continue;
      }

      // nếu RunRecord trạng thái paused, đồng bộcập nhật
      if (run.status !== 'paused') {
        await deps.storage.runs.patch(runId, { status: 'paused' as RunStatus, updatedAt: now });
      }

      logger.info(`[Recovery] Adopted orphan paused run: ${runId}`);
    } catch (e) {
      logger.warn('[Recovery] Reconcile adopted paused failed:', runId, e);
    }
  }

  const result: RecoveryResult = {
    requeuedRunning: requeuedRunningIds,
    adoptedPaused: adoptedPausedIds,
    cleanedTerminal: Array.from(cleanedTerminalSet),
  };

  logger.info('[Recovery] Complete:', {
    requeuedRunning: result.requeuedRunning.length,
    adoptedPaused: result.adoptedPaused.length,
    cleanedTerminal: result.cleanedTerminal.length,
  });

  return result;
}
