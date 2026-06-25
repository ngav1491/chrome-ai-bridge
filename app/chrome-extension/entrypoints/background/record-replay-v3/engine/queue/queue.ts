/**
 * @fileoverview RunQueue giao diệnđịnh nghĩa
 * @description định nghĩa Run hàng đợiquản lýgiao diện
 */

import type { JsonObject, UnixMillis } from '../../domain/json';
import type { FlowId, NodeId, RunId } from '../../domain/ids';
import type { TriggerFireContext } from '../../domain/triggers';

/**
 * RunQueue cấu hình
 */
export interface RunQueueConfig {
  /** tối đa Run  */
  maxParallelRuns: number;
  /** lease TTL(mili giây) */
  leaseTtlMs: number;
  /** heartbeatkhoảng cách(mili giây) */
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
  /** thời gian */
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
  /** độ ưu tiên(sốđộ ưu tiên) */
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
 * vào hàng đợiyêu cầu(tự độngtạotrường)
 * - priority mặc định 0
 * - maxAttempts mặc định 1
 */
export type EnqueueInput = Omit<
  RunQueueItem,
  'status' | 'createdAt' | 'updatedAt' | 'attempt' | 'lease' | 'priority' | 'maxAttempts'
> & {
  id: RunId;
  /** độ ưu tiên(sốđộ ưu tiên, mặc định 0) */
  priority?: number;
  /** số lần thử tối đa(mặc định 1) */
  maxAttempts?: number;
};

/**
 * RunQueue giao diện
 * @description quản lý Run hàng đợilập lịch
 */
export interface RunQueue {
  /**
   * vào hàng đợi
   * @param input vào hàng đợiyêu cầu
   * @returns mục hàng đợi
   */
  enqueue(input: EnqueueInput): Promise<RunQueueItem>;

  /**
   * thực thi Run
   * @param ownerId  ID
   * @param now hiện tạithời gian
   * @returns mục hàng đợi null
   */
  claimNext(ownerId: string, now: UnixMillis): Promise<RunQueueItem | null>;

  /**
   * heartbeat
   * @param ownerId  ID
   * @param now hiện tạithời gian
   */
  heartbeat(ownerId: string, now: UnixMillis): Promise<void>;

  /**
   * thu hồilease
   * @description  lease.expiresAt < now  running/paused thu hồi queued
   * @param now hiện tạithời gian
   * @returns thu hồi Run ID danh sách
   */
  reclaimExpiredLeases(now: UnixMillis): Promise<RunId[]>;

  /**
   * khôi phụcmồ côilease(SW gọi)
   * @description
   * - mồ côi running thu hồi queued(status -> queued, leasexóa)
   * - mồ côi paused tiếp quản(duy trì status=paused, lease ownerId cập nhật ownerId)
   * @param ownerId  ownerId(hiện tại Service Worker thể hiện)
   * @param now hiện tạithời gian
   * @returns  runId danh sách( ownerId dùng cho)
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
   * đánh dấu làhoàn tất(hàng đợigỡ bỏ)
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
 * tạo NotImplemented  RunQueue
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
