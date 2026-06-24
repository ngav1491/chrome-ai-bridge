/**
 * @fileoverview leasequản lý
 * @description quản lý Run noiDungTiengVietleasenoiDungTiengVietthu hồi
 */

import type { UnixMillis } from '../../domain/json';
import type { RunId } from '../../domain/ids';
import type { RunQueue, RunQueueConfig, Lease } from './queue';

/**
 * leasequản lýnoiDungTiengViet
 * @description quản lýleasenoiDungTiengVietphát hiện
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
   * kiểm tranoiDungTiengVietthu hồinoiDungTiengVietlease
   * @param now hiện tạithời gian
   * @returns noiDungTiengVietthu hồinoiDungTiengViet Run ID danh sách
   */
  reclaimExpiredLeases(now: UnixMillis): Promise<RunId[]>;

  /**
   * phán đoánleasecó/khôngnoiDungTiengViet
   */
  isLeaseExpired(lease: Lease, now: UnixMillis): boolean;

  /**
   * tạonoiDungTiengVietlease
   */
  createLease(ownerId: string, now: UnixMillis): Lease;

  /**
   * dừngtất cảheartbeat
   */
  dispose(): void;
}

/**
 * tạoleasequản lýnoiDungTiengViet
 */
export function createLeaseManager(queue: RunQueue, config: RunQueueConfig): LeaseManager {
  const heartbeatTimers = new Map<string, ReturnType<typeof setInterval>>();

  return {
    startHeartbeat(ownerId: string): void {
      // nếunoiDungTiengVietđịnh thờinoiDungTiengViet，noiDungTiengVietdừng
      this.stopHeartbeat(ownerId);

      // tạonoiDungTiengVietheartbeatđịnh thờinoiDungTiengViet
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
 * tạonoiDungTiengViet owner ID
 * @description dùng chođịnh danhhiện tại Service Worker thể hiện
 */
export function generateOwnerId(): string {
  return `sw_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;
}
