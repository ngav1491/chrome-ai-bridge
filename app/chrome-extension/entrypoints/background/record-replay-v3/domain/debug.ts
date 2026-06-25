/**
 * @fileoverview Định nghĩa kiểu debugger
 * @description Định nghĩa trạng thái và giao thức debugger trong Record-Replay V3
 */

import type { JsonValue } from './json';
import type { NodeId, RunId } from './ids';
import type { PauseReason } from './events';

/**
 * Định nghĩa điểm ngắt
 */
export interface Breakpoint {
  /** ID nút chứa điểm ngắt */
  nodeId: NodeId;
  /** Có bật hay không */
  enabled: boolean;
}

/**
 * Trạng thái debugger
 * @description Mô tả trạng thái kết nối và thực thi hiện tại của debugger
 */
export interface DebuggerState {
  /** Run ID liên quan */
  runId: RunId;
  /** Trạng thái kết nối debugger */
  status: 'attached' | 'detached';
  /** Trạng thái thực thi */
  execution: 'running' | 'paused';
  /** Lý do tạm dừng (chỉ có hiệu lực khi execution='paused') */
  pauseReason?: PauseReason;
  /** ID nút hiện tại */
  currentNodeId?: NodeId;
  /** Danh sách điểm ngắt */
  breakpoints: Breakpoint[];
  /** Chế độ bước đi */
  stepMode?: 'none' | 'stepOver';
}

/**
 * Lệnh debugger
 * @description Lệnh mà client gửi cho debugger
 */
export type DebuggerCommand =
  // ===== Điều khiển kết nối =====
  | { type: 'debug.attach'; runId: RunId }
  | { type: 'debug.detach'; runId: RunId }

  // ===== Điều khiển thực thi =====
  | { type: 'debug.pause'; runId: RunId }
  | { type: 'debug.resume'; runId: RunId }
  | { type: 'debug.stepOver'; runId: RunId }

  // ===== Quản lý điểm ngắt =====
  | { type: 'debug.setBreakpoints'; runId: RunId; nodeIds: NodeId[] }
  | { type: 'debug.addBreakpoint'; runId: RunId; nodeId: NodeId }
  | { type: 'debug.removeBreakpoint'; runId: RunId; nodeId: NodeId }

  // ===== Truy vấn trạng thái =====
  | { type: 'debug.getState'; runId: RunId }

  // ===== Thao tác biến =====
  | { type: 'debug.getVar'; runId: RunId; name: string }
  | { type: 'debug.setVar'; runId: RunId; name: string; value: JsonValue };

/** Kiểu lệnh debugger (trích xuất từ union type) */
export type DebuggerCommandType = DebuggerCommand['type'];

/**
 * Phản hồi lệnh debugger
 */
export type DebuggerResponse =
  | { ok: true; state?: DebuggerState; value?: JsonValue }
  | { ok: false; error: string };

/**
 * Tạo trạng thái debugger ban đầu
 */
export function createInitialDebuggerState(runId: RunId): DebuggerState {
  return {
    runId,
    status: 'detached',
    execution: 'running',
    breakpoints: [],
    stepMode: 'none',
  };
}
