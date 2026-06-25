/**
 * @fileoverview leasequản lý
 * @description quản lý Run leasethu hồi
 */

import type { UnixMillis } from '../../domain/json';
import type { RunId } from '../../domain/ids';
import type { RunQueue, RunQueueConfig, Lease } from './queue';

/**
 * leasequản lý
 * @description quản lýleasephát hiện
 */
export interface LeaseManager {
  /**
   * bắt đầuheartbeat
   * @param ownerId người giữ ID
   */
  startHeartbeat(ownerId: string): void;

  /**
   * dừngheartbeat
   * @param ownerId người giữ ID
   */
  stopHeartbeat(ownerId: string): void;

  /**
   * kiểm trathu hồilease
   * @param now hiện tạithời gian
   * @returns thu hồi Run ID danh sách
   */
  reclaimExpiredLeases(now: UnixMillis): Promise<RunId[]>;

  /**
   * phán đoánleasecó/không
   */
  isLeaseExpired(lease: Lease, now: UnixMillis): boolean;

  /**
   * tạolease
   */
  createLease(ownerId: string, now: UnixMillis): Lease;

  /**
   * dừngtất cảheartbeat
   */
  dispose(): void;
}

/**
 * tạoleasequản lý
 */
export function createLeaseManager(queue: RunQueue, config: RunQueueConfig): LeaseManager {
  const heartbeatTimers = new Map<string, ReturnType<typeof setInterval>>();

  return {
    startHeartbeat(ownerId: string): void {
      // nếuđịnh thời, dừng
      this.stopHeartbeat(ownerId);

      // tạoheartbeatđịnh thời
      const timer = setInterval(async () => {
        try {
          await queue.heartbeat(ownerId, Date.now());
        } catch (error) {
          console.error(`[LeaseManager] Heartbeat failed for ${ownerId}:`, error);
        }
      }, config.heartbeatIntervalMs);

      heartbeatTimers.set(ownerId, timer);
    },

    stopHeartbeat(ownerId: string): void {
      const timer = heartbeatTimers.get(ownerId);
      if (timer) {
        clearInterval(timer);
        heartbeatTimers.delete(ownerId);
      }
    },

    async reclaimExpiredLeases(now: UnixMillis): Promise<RunId[]> {
      // Delegate to the queue implementation which uses the lease_expiresAt index
      // for efficient scanning and updates storage atomically.
      return queue.reclaimExpiredLeases(now);
    },

    isLeaseExpired(lease: Lease, now: UnixMillis): boolean {
      return lease.expiresAt < now;
    },

    createLease(ownerId: string, now: UnixMillis): Lease {
      return {
        ownerId,
        expiresAt: now + config.leaseTtlMs,
      };
    },

    dispose(): void {
      for (const timer of heartbeatTimers.values()) {
        clearInterval(timer);
      }
      heartbeatTimers.clear();
    },
  };
}

/**
 * tạo owner ID
 * @description dùng chođịnh danhhiện tại Service Worker thể hiện
 */
export function generateOwnerId(): string {
  return `sw_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;
}
