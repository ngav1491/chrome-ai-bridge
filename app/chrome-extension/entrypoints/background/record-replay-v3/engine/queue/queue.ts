/**
 * @fileoverview RunQueue giao diệnđịnh nghĩa
 * @description định nghĩa Run hàng đợinoiDungTiengVietquản lýgiao diện
 */

import type { JsonObject, UnixMillis } from '../../domain/json';
import type { FlowId, NodeId, RunId } from '../../domain/ids';
import type { TriggerFireContext } from '../../domain/triggers';

/**
 * RunQueue cấu hình
 */
export interface RunQueueConfig {
  /** tối đanoiDungTiengViet Run noiDungTiengViet */
  maxParallelRuns: number;
  /** lease TTL（mili giây） */
  leaseTtlMs: number;
  /** heartbeatkhoảng cách（mili giây） */
  heartbeatIntervalMs: number;
}

/**
 * mặc địnhhàng đợicấu hình
 */
export const DEFAULT_QUEUE_CONFIG: RunQueueConfig = {
  maxParallelRuns: 3,
  leaseTtlMs: 15_000,
  heartbeatIntervalMs: 5_000,
};

/**
 * mục hàng đợitrạng thái
 */
export type QueueItemStatus = 'queued' | 'running' | 'paused';

/**
 * leasethông tin
 */
export interface Lease {
  /** người giữ ID */
  ownerId: string;
  /** noiDungTiengVietthời gian */
  expiresAt: UnixMillis;
}

/**
 * RunQueue mục hàng đợi
 */
export interface RunQueueItem {
  /** Run ID */
  id: RunId;
  /** Flow ID */
  flowId: FlowId;
  /** trạng thái */
  status: QueueItemStatus;
  /** tạothời gian */
  createdAt: UnixMillis;
  /** cập nhậtthời gian */
  updatedAt: UnixMillis;
  /** độ ưu tiên（sốnoiDungTiengVietđộ ưu tiênnoiDungTiengViet） */
  priority: number;
  /** hiện tạisố lần thử */
  attempt: number;
  /** số lần thử tối đa */
  maxAttempts: number;
  /** Tab ID */
  tabId?: number;
  /** chạytham số */
  args?: JsonObject;
  /** triggerngữ cảnh */
  trigger?: TriggerFireContext;
  /** leasethông tin */
  lease?: Lease;
  /** gỡ lỗicấu hình */
  debug?: { breakpoints?: NodeId[]; pauseOnStart?: boolean };
}

/**
 * vào hàng đợiyêu cầu（noiDungTiengViettự độngtạonoiDungTiengViettrường）
 * - priority mặc địnhnoiDungTiengViet 0
 * - maxAttempts mặc địnhnoiDungTiengViet 1
 */
export type EnqueueInput = Omit<
  RunQueueItem,
  'status' | 'createdAt' | 'updatedAt' | 'attempt' | 'lease' | 'priority' | 'maxAttempts'
> & {
  id: RunId;
  /** độ ưu tiên（sốnoiDungTiengVietđộ ưu tiênnoiDungTiengViet，mặc định 0） */
  priority?: number;
  /** số lần thử tối đa（mặc định 1） */
  maxAttempts?: number;
};

/**
 * RunQueue giao diện
 * @description quản lý Run noiDungTiengViethàng đợinoiDungTiengVietlập lịch
 */
export interface RunQueue {
  /**
   * vào hàng đợi
   * @param input vào hàng đợiyêu cầu
   * @returns mục hàng đợi
   */
  enqueue(input: EnqueueInput): Promise<RunQueueItem>;

  /**
   * noiDungTiengVietthực thinoiDungTiengViet Run
   * @param ownerId noiDungTiengViet ID
   * @param now hiện tạithời gian
   * @returns mục hàng đợinoiDungTiengViet null
   */
  claimNext(ownerId: string, now: UnixMillis): Promise<RunQueueItem | null>;

  /**
   * noiDungTiengVietheartbeat
   * @param ownerId noiDungTiengViet ID
   * @param now hiện tạithời gian
   */
  heartbeat(ownerId: string, now: UnixMillis): Promise<void>;

  /**
   * thu hồinoiDungTiengVietlease
   * @description noiDungTiengViet lease.expiresAt < now noiDungTiengViet running/paused noiDungTiengVietthu hồinoiDungTiengViet queued
   * @param now hiện tạithời gian
   * @returns noiDungTiengVietthu hồinoiDungTiengViet Run ID danh sách
   */
  reclaimExpiredLeases(now: UnixMillis): Promise<RunId[]>;

  /**
   * khôi phụcmồ côilease（SW noiDungTiengVietgọi）
   * @description
   * - noiDungTiengVietmồ côi running noiDungTiengVietthu hồinoiDungTiengViet queued（status -> queued，leasexóa）
   * - noiDungTiengVietmồ côi paused noiDungTiengViettiếp quản（duy trì status=paused，lease ownerId cập nhậtnoiDungTiengViet ownerId）
   * @param ownerId noiDungTiengViet ownerId（hiện tại Service Worker thể hiện）
   * @param now hiện tạithời gian
   * @returns noiDungTiengViet runId danh sách（noiDungTiengViet ownerId dùng chonoiDungTiengViet）
   */
  recoverOrphanLeases(
    ownerId: string,
    now: UnixMillis,
  ): Promise<{
    requeuedRunning: Array<{ runId: RunId; prevOwnerId?: string }>;
    adoptedPaused: Array<{ runId: RunId; prevOwnerId?: string }>;
  }>;

  /**
   * đánh dấu là running
   */
  markRunning(runId: RunId, ownerId: string, now: UnixMillis): Promise<void>;

  /**
   * đánh dấu là paused
   */
  markPaused(runId: RunId, ownerId: string, now: UnixMillis): Promise<void>;

  /**
   * đánh dấu làhoàn tất（noiDungTiengViethàng đợigỡ bỏ）
   */
  markDone(runId: RunId, now: UnixMillis): Promise<void>;

  /**
   * hủy Run
   */
  cancel(runId: RunId, now: UnixMillis, reason?: string): Promise<void>;

  /**
   * lấymục hàng đợi
   */
  get(runId: RunId): Promise<RunQueueItem | null>;

  /**
   * liệt kêmục hàng đợi
   */
  list(status?: QueueItemStatus): Promise<RunQueueItem[]>;
}

/**
 * tạo NotImplemented noiDungTiengViet RunQueue
 * @description Phase 0 giữ chỗtriển khai
 */
export function createNotImplementedQueue(): RunQueue {
  const notImplemented = () => {
    throw new Error('RunQueue not implemented');
  };

  return {
    enqueue: async () => notImplemented(),
    claimNext: async () => notImplemented(),
    heartbeat: async () => notImplemented(),
    reclaimExpiredLeases: async () => notImplemented(),
    recoverOrphanLeases: async () => notImplemented(),
    markRunning: async () => notImplemented(),
    markPaused: async () => notImplemented(),
    markDone: async () => notImplemented(),
    cancel: async () => notImplemented(),
    get: async () => notImplemented(),
    list: async () => notImplemented(),
  };
}
