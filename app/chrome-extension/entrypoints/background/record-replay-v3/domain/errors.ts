/**
 * @fileoverview lỗikiểuđịnh nghĩa
 * @description định nghĩa Record-Replay V3 noiDungTiengVietsử dụngnoiDungTiengVietlỗinoiDungTiengVietlỗikiểu
 */

import type { JsonValue } from './json';

/** lỗinoiDungTiengViet */
export const RR_ERROR_CODES = {
  // ===== xác thựclỗi =====
  /** chungxác thựclỗi */
  VALIDATION_ERROR: 'VALIDATION_ERROR',
  /** noiDungTiengViethỗ trợnoiDungTiengVietnútkiểu */
  UNSUPPORTED_NODE: 'UNSUPPORTED_NODE',
  /** DAG cấu trúckhông hợp lệ */
  DAG_INVALID: 'DAG_INVALID',
  /** DAG tồn tạivòng lặp */
  DAG_CYCLE: 'DAG_CYCLE',

  // ===== chạynoiDungTiengVietlỗi =====
  /** thao táchết thời gian */
  TIMEOUT: 'TIMEOUT',
  /** Tab không tìm thấy */
  TAB_NOT_FOUND: 'TAB_NOT_FOUND',
  /** Frame không tìm thấy */
  FRAME_NOT_FOUND: 'FRAME_NOT_FOUND',
  /** mục tiêuphần tửkhông tìm thấy */
  TARGET_NOT_FOUND: 'TARGET_NOT_FOUND',
  /** phần tửnoiDungTiengViet */
  ELEMENT_NOT_VISIBLE: 'ELEMENT_NOT_VISIBLE',
  /** điều hướngthất bại */
  NAVIGATION_FAILED: 'NAVIGATION_FAILED',
  /** noiDungTiengVietyêu cầuthất bại */
  NETWORK_REQUEST_FAILED: 'NETWORK_REQUEST_FAILED',

  // ===== script/công cụlỗi =====
  /** scriptthực thithất bại */
  SCRIPT_FAILED: 'SCRIPT_FAILED',
  /** quyềnnoiDungTiengViet */
  PERMISSION_DENIED: 'PERMISSION_DENIED',
  /** công cụthực thilỗi */
  TOOL_ERROR: 'TOOL_ERROR',

  // ===== điều khiểnlỗi =====
  /** Run noiDungTiengViethủy */
  RUN_CANCELED: 'RUN_CANCELED',
  /** Run noiDungTiengViettạm dừng */
  RUN_PAUSED: 'RUN_PAUSED',

  // ===== bên tronglỗi =====
  /** bên tronglỗi */
  INTERNAL: 'INTERNAL',
  /** noiDungTiengVietbiếnnoiDungTiengViet */
  INVARIANT_VIOLATION: 'INVARIANT_VIOLATION',
} as const;

/** lỗinoiDungTiengVietkiểu */
export type RRErrorCode = (typeof RR_ERROR_CODES)[keyof typeof RR_ERROR_CODES];

/**
 * Record-Replay lỗigiao diện
 * @description noiDungTiengVietlỗibiểu thị，hỗ trợlỗinoiDungTiengVietthử lạinoiDungTiengViet
 */
export interface RRError {
  /** lỗinoiDungTiengViet */
  code: RRErrorCode;
  /** lỗitin nhắn */
  message: string;
  /** noiDungTiengVietdữ liệu */
  data?: JsonValue;
  /** có/khôngnoiDungTiengVietthử lại */
  retryable?: boolean;
  /** nguyên nhânlỗi（lỗinoiDungTiengViet） */
  cause?: RRError;
}

/**
 * tạo RRError noiDungTiengVietfactoryhàm
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
