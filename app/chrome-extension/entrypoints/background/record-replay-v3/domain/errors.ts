/**
 * @fileoverview Định nghĩa kiểu lỗi
 * @description Định nghĩa mã lỗi và kiểu lỗi sử dụng trong Record-Replay V3
 */

import type { JsonValue } from './json';

/** Hằng số mã lỗi */
export const RR_ERROR_CODES = {
  // ===== Lỗi xác thực =====
  /** Lỗi xác thực chung */
  VALIDATION_ERROR: 'VALIDATION_ERROR',
  /** Kiểu nút không được hỗ trợ */
  UNSUPPORTED_NODE: 'UNSUPPORTED_NODE',
  /** Cấu trúc DAG không hợp lệ */
  DAG_INVALID: 'DAG_INVALID',
  /** DAG tồn tại chu trình */
  DAG_CYCLE: 'DAG_CYCLE',

  // ===== Lỗi runtime =====
  /** Thao tác hết thời gian chờ */
  TIMEOUT: 'TIMEOUT',
  /** Không tìm thấy Tab */
  TAB_NOT_FOUND: 'TAB_NOT_FOUND',
  /** Không tìm thấy Frame */
  FRAME_NOT_FOUND: 'FRAME_NOT_FOUND',
  /** Không tìm thấy phần tử mục tiêu */
  TARGET_NOT_FOUND: 'TARGET_NOT_FOUND',
  /** Phần tử không hiển thị */
  ELEMENT_NOT_VISIBLE: 'ELEMENT_NOT_VISIBLE',
  /** Điều hướng thất bại */
  NAVIGATION_FAILED: 'NAVIGATION_FAILED',
  /** Yêu cầu mạng thất bại */
  NETWORK_REQUEST_FAILED: 'NETWORK_REQUEST_FAILED',

  // ===== Lỗi script/công cụ =====
  /** Thực thi script thất bại */
  SCRIPT_FAILED: 'SCRIPT_FAILED',
  /** Quyền bị từ chối */
  PERMISSION_DENIED: 'PERMISSION_DENIED',
  /** Lỗi thực thi công cụ */
  TOOL_ERROR: 'TOOL_ERROR',

  // ===== Lỗi điều khiển =====
  /** Run bị hủy */
  RUN_CANCELED: 'RUN_CANCELED',
  /** Run bị tạm dừng */
  RUN_PAUSED: 'RUN_PAUSED',

  // ===== Lỗi nội bộ =====
  /** Lỗi nội bộ */
  INTERNAL: 'INTERNAL',
  /** Vi phạm bất biến */
  INVARIANT_VIOLATION: 'INVARIANT_VIOLATION',
} as const;

/** Kiểu mã lỗi */
export type RRErrorCode = (typeof RR_ERROR_CODES)[keyof typeof RR_ERROR_CODES];

/**
 * Giao diện lỗi Record-Replay
 * @description Biểu diễn lỗi thống nhất, hỗ trợ chuỗi lỗi và đánh dấu có thể thử lại
 */
export interface RRError {
  /** Mã lỗi */
  code: RRErrorCode;
  /** Thông điệp lỗi */
  message: string;
  /** Dữ liệu đính kèm */
  data?: JsonValue;
  /** Có thể thử lại hay không */
  retryable?: boolean;
  /** Lỗi nguyên nhân (chuỗi lỗi) */
  cause?: RRError;
}

/**
 * Hàm factory tạo RRError
 */
export function createRRError(
  code: RRErrorCode,
  message: string,
  options?: { data?: JsonValue; retryable?: boolean; cause?: RRError },
): RRError {
  return {
    code,
    message,
    ...(options?.data !== undefined && { data: options.data }),
    ...(options?.retryable !== undefined && { retryable: options.retryable }),
    ...(options?.cause !== undefined && { cause: options.cause }),
  };
}
