/**
 * @fileoverview V2 dữ liệuđọc
 * @description đọc V2 định dạngdữ liệu(giữ chỗtriển khai)
 */

/**
 * V2 dữ liệuđọcgiao diện
 * @description Phase 5+ triển khai
 */
export interface V2Reader {
  /** đọc V2 Flows */
  readFlows(): Promise<unknown[]>;
  /** đọc V2 Runs */
  readRuns(): Promise<unknown[]>;
  /** đọc V2 Triggers */
  readTriggers(): Promise<unknown[]>;
  /** đọc V2 Schedules */
  readSchedules(): Promise<unknown[]>;
}

/**
 * tạo NotImplemented  V2Reader
 */
export function createNotImplementedV2Reader(): V2Reader {
  const notImplemented = async () => {
    throw new Error('V2Reader not implemented');
  };

  return {
    readFlows: notImplemented,
    readRuns: notImplemented,
    readTriggers: notImplemented,
    readSchedules: notImplemented,
  };
}
