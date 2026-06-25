/**
 * @fileoverview Định nghĩa giao thức Port RPC
 * @description Định nghĩa các kiểu giao thức giao tiếp qua chrome.runtime.Port
 */

import type { JsonObject, JsonValue } from '../../domain/json';
import type { RunId } from '../../domain/ids';
import type { RunEvent } from '../../domain/events';

/** Tên Port */
export const RR_V3_PORT_NAME = 'rr_v3' as const;

/**
 * Tên phương thức RPC
 */
export type RpcMethod =
  // Phương thức truy vấn
  | 'rr_v3.listRuns'
  | 'rr_v3.getRun'
  | 'rr_v3.getEvents'
  // Phương thức quản lý Flow
  | 'rr_v3.getFlow'
  | 'rr_v3.listFlows'
  | 'rr_v3.saveFlow'
  | 'rr_v3.deleteFlow'
  // Phương thức quản lý bộ kích hoạt
  | 'rr_v3.createTrigger'
  | 'rr_v3.updateTrigger'
  | 'rr_v3.deleteTrigger'
  | 'rr_v3.getTrigger'
  | 'rr_v3.listTriggers'
  | 'rr_v3.enableTrigger'
  | 'rr_v3.disableTrigger'
  | 'rr_v3.fireTrigger'
  // Phương thức quản lý hàng đợi
  | 'rr_v3.enqueueRun'
  | 'rr_v3.listQueue'
  | 'rr_v3.cancelQueueItem'
  // Phương thức điều khiển
  | 'rr_v3.startRun'
  | 'rr_v3.cancelRun'
  | 'rr_v3.pauseRun'
  | 'rr_v3.resumeRun'
  // Phương thức gỡ lỗi
  | 'rr_v3.debug'
  // Phương thức đăng ký
  | 'rr_v3.subscribe'
  | 'rr_v3.unsubscribe';

/**
 * Tin nhắn yêu cầu RPC
 */
export interface RpcRequest {
  type: 'rr_v3.request';
  /** ID yêu cầu (dùng để khớp phản hồi) */
  requestId: string;
  /** Tên phương thức */
  method: RpcMethod;
  /** Tham số */
  params?: JsonObject;
}

/**
 * Phản hồi thành công RPC
 */
export interface RpcResponseOk {
  type: 'rr_v3.response';
  /** ID yêu cầu tương ứng */
  requestId: string;
  ok: true;
  /** Kết quả trả về */
  result: JsonValue;
}

/**
 * Phản hồi lỗi RPC
 */
export interface RpcResponseErr {
  type: 'rr_v3.response';
  /** ID yêu cầu tương ứng */
  requestId: string;
  ok: false;
  /** Thông tin lỗi */
  error: string;
}

/**
 * Phản hồi RPC
 */
export type RpcResponse = RpcResponseOk | RpcResponseErr;

/**
 * Đẩy sự kiện RPC
 */
export interface RpcEventMessage {
  type: 'rr_v3.event';
  /** Dữ liệu sự kiện */
  event: RunEvent;
}

/**
 * Xác nhận đăng ký RPC
 */
export interface RpcSubscribeAck {
  type: 'rr_v3.subscribeAck';
  /** Run ID đã đăng ký (tùy chọn, null nghĩa là đăng ký tất cả) */
  runId: RunId | null;
}

/**
 * Tất cả kiểu tin nhắn RPC
 */
export type RpcMessage =
  | RpcRequest
  | RpcResponseOk
  | RpcResponseErr
  | RpcEventMessage
  | RpcSubscribeAck;

/**
 * Tạo ID yêu cầu duy nhất
 */
export function generateRequestId(): string {
  return `${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;
}

/**
 * Kiểm tra xem tin nhắn có phải là yêu cầu RPC hay không
 */
export function isRpcRequest(msg: unknown): msg is RpcRequest {
  return typeof msg === 'object' && msg !== null && (msg as RpcRequest).type === 'rr_v3.request';
}

/**
 * Kiểm tra xem tin nhắn có phải là phản hồi RPC hay không
 */
export function isRpcResponse(msg: unknown): msg is RpcResponse {
  return typeof msg === 'object' && msg !== null && (msg as RpcResponse).type === 'rr_v3.response';
}

/**
 * Kiểm tra xem tin nhắn có phải là sự kiện RPC hay không
 */
export function isRpcEvent(msg: unknown): msg is RpcEventMessage {
  return typeof msg === 'object' && msg !== null && (msg as RpcEventMessage).type === 'rr_v3.event';
}

/**
 * Tạo yêu cầu RPC
 */
export function createRpcRequest(method: RpcMethod, params?: JsonObject): RpcRequest {
  return {
    type: 'rr_v3.request',
    requestId: generateRequestId(),
    method,
    params,
  };
}

/**
 * Tạo phản hồi thành công
 */
export function createRpcResponseOk(requestId: string, result: JsonValue): RpcResponseOk {
  return {
    type: 'rr_v3.response',
    requestId,
    ok: true,
    result,
  };
}

/**
 * Tạo phản hồi lỗi
 */
export function createRpcResponseErr(requestId: string, error: string): RpcResponseErr {
  return {
    type: 'rr_v3.response',
    requestId,
    ok: false,
    error,
  };
}

/**
 * Tạo tin nhắn sự kiện
 */
export function createRpcEventMessage(event: RunEvent): RpcEventMessage {
  return {
    type: 'rr_v3.event',
    event,
  };
}
