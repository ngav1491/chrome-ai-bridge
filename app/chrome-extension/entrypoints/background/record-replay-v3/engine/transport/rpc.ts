/**
 * @fileoverview Port RPC giao thứcđịnh nghĩa
 * @description định nghĩathông qua chrome.runtime.Port noiDungTiengVietgiao thứckiểu
 */

import type { JsonObject, JsonValue } from '../../domain/json';
import type { RunId } from '../../domain/ids';
import type { RunEvent } from '../../domain/events';

/** Port tên */
export const RR_V3_PORT_NAME = 'rr_v3' as const;

/**
 * RPC phương thứctên
 */
export type RpcMethod =
  // truy vấnphương thức
  | 'rr_v3.listRuns'
  | 'rr_v3.getRun'
  | 'rr_v3.getEvents'
  // Flow quản lýphương thức
  | 'rr_v3.getFlow'
  | 'rr_v3.listFlows'
  | 'rr_v3.saveFlow'
  | 'rr_v3.deleteFlow'
  // triggerquản lýphương thức
  | 'rr_v3.createTrigger'
  | 'rr_v3.updateTrigger'
  | 'rr_v3.deleteTrigger'
  | 'rr_v3.getTrigger'
  | 'rr_v3.listTriggers'
  | 'rr_v3.enableTrigger'
  | 'rr_v3.disableTrigger'
  | 'rr_v3.fireTrigger'
  // hàng đợiquản lýphương thức
  | 'rr_v3.enqueueRun'
  | 'rr_v3.listQueue'
  | 'rr_v3.cancelQueueItem'
  // điều khiểnphương thức
  | 'rr_v3.startRun'
  | 'rr_v3.cancelRun'
  | 'rr_v3.pauseRun'
  | 'rr_v3.resumeRun'
  // gỡ lỗiphương thức
  | 'rr_v3.debug'
  // đăng kýphương thức
  | 'rr_v3.subscribe'
  | 'rr_v3.unsubscribe';

/**
 * RPC yêu cầutin nhắn
 */
export interface RpcRequest {
  type: 'rr_v3.request';
  /** yêu cầu ID（dùng chokhớpphản hồi） */
  requestId: string;
  /** phương thứcnoiDungTiengViet */
  method: RpcMethod;
  /** tham số */
  params?: JsonObject;
}

/**
 * RPC thành côngphản hồi
 */
export interface RpcResponseOk {
  type: 'rr_v3.response';
  /** noiDungTiengVietyêu cầu ID */
  requestId: string;
  ok: true;
  /** trả vềkết quả */
  result: JsonValue;
}

/**
 * RPC lỗiphản hồi
 */
export interface RpcResponseErr {
  type: 'rr_v3.response';
  /** noiDungTiengVietyêu cầu ID */
  requestId: string;
  ok: false;
  /** lỗithông tin */
  error: string;
}

/**
 * RPC phản hồi
 */
export type RpcResponse = RpcResponseOk | RpcResponseErr;

/**
 * RPC sự kiệnnoiDungTiengViet
 */
export interface RpcEventMessage {
  type: 'rr_v3.event';
  /** sự kiệndữ liệu */
  event: RunEvent;
}

/**
 * RPC đăng kýxác nhận
 */
export interface RpcSubscribeAck {
  type: 'rr_v3.subscribeAck';
  /** đăng kýnoiDungTiengViet Run ID（tùy chọn，null biểu thịđăng kýtất cả） */
  runId: RunId | null;
}

/**
 * tất cả RPC tin nhắnkiểu
 */
export type RpcMessage =
  | RpcRequest
  | RpcResponseOk
  | RpcResponseErr
  | RpcEventMessage
  | RpcSubscribeAck;

/**
 * tạonoiDungTiengVietyêu cầu ID
 */
export function generateRequestId(): string {
  return `${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;
}

/**
 * phán đoántin nhắncó phải là RPC yêu cầu
 */
export function isRpcRequest(msg: unknown): msg is RpcRequest {
  return typeof msg === 'object' && msg !== null && (msg as RpcRequest).type === 'rr_v3.request';
}

/**
 * phán đoántin nhắncó phải là RPC phản hồi
 */
export function isRpcResponse(msg: unknown): msg is RpcResponse {
  return typeof msg === 'object' && msg !== null && (msg as RpcResponse).type === 'rr_v3.response';
}

/**
 * phán đoántin nhắncó phải là RPC sự kiện
 */
export function isRpcEvent(msg: unknown): msg is RpcEventMessage {
  return typeof msg === 'object' && msg !== null && (msg as RpcEventMessage).type === 'rr_v3.event';
}

/**
 * tạo RPC yêu cầu
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
 * tạothành côngphản hồi
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
 * tạolỗiphản hồi
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
 * tạosự kiệntin nhắn
 */
export function createRpcEventMessage(event: RunEvent): RpcEventMessage {
  return {
    type: 'rr_v3.event',
    event,
  };
}
