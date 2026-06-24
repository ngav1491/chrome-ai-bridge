/**
 * @fileoverview gỡ lỗinoiDungTiengVietkiểuđịnh nghĩa
 * @description định nghĩa Record-Replay V3 tronggỡ lỗinoiDungTiengViettrạng tháinoiDungTiengVietgiao thức
 */

import type { JsonValue } from './json';
import type { NodeId, RunId } from './ids';
import type { PauseReason } from './events';

/**
 * điểm dừngđịnh nghĩa
 */
export interface Breakpoint {
  /** điểm dừngnoiDungTiengVietnút ID */
  nodeId: NodeId;
  /** có/khôngbật */
  enabled: boolean;
}

/**
 * gỡ lỗinoiDungTiengViettrạng thái
 * @description mô tảgỡ lỗinoiDungTiengViethiện tạinoiDungTiengVietkết nốinoiDungTiengVietthực thitrạng thái
 */
export interface DebuggerState {
  /** liên quan Run ID */
  runId: RunId;
  /** gỡ lỗinoiDungTiengVietkết nốitrạng thái */
  status: 'attached' | 'detached';
  /** thực thitrạng thái */
  execution: 'running' | 'paused';
  /** tạm dừngnguyên nhân（noiDungTiengViet execution='paused' noiDungTiengViet） */
  pauseReason?: PauseReason;
  /** hiện tạinút ID */
  currentNodeId?: NodeId;
  /** điểm dừngdanh sách */
  breakpoints: Breakpoint[];
  /** một bướcschema */
  stepMode?: 'none' | 'stepOver';
}

/**
 * gỡ lỗilệnh
 * @description phía clientgửinoiDungTiengVietgỡ lỗinoiDungTiengVietlệnh
 */
export type DebuggerCommand =
  // ===== kết nốiđiều khiển =====
  | { type: 'debug.attach'; runId: RunId }
  | { type: 'debug.detach'; runId: RunId }

  // ===== thực thiđiều khiển =====
  | { type: 'debug.pause'; runId: RunId }
  | { type: 'debug.resume'; runId: RunId }
  | { type: 'debug.stepOver'; runId: RunId }

  // ===== điểm dừngquản lý =====
  | { type: 'debug.setBreakpoints'; runId: RunId; nodeIds: NodeId[] }
  | { type: 'debug.addBreakpoint'; runId: RunId; nodeId: NodeId }
  | { type: 'debug.removeBreakpoint'; runId: RunId; nodeId: NodeId }

  // ===== trạng tháitruy vấn =====
  | { type: 'debug.getState'; runId: RunId }

  // ===== biếnthao tác =====
  | { type: 'debug.getVar'; runId: RunId; name: string }
  | { type: 'debug.setVar'; runId: RunId; name: string; value: JsonValue };

/** gỡ lỗilệnhkiểu（noiDungTiengVietkiểutrích xuất） */
export type DebuggerCommandType = DebuggerCommand['type'];

/**
 * gỡ lỗilệnhphản hồi
 */
export type DebuggerResponse =
  | { ok: true; state?: DebuggerState; value?: JsonValue }
  | { ok: false; error: string };

/**
 * tạonoiDungTiengVietgỡ lỗinoiDungTiengViettrạng thái
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
