/**
 * @fileoverview ExecutionKernel giao diệnđịnh nghĩa
 * @description định nghĩa Record-Replay V3 thực thienginegiao diện
 */

import type { JsonObject } from '../../domain/json';
import type { FlowId, NodeId, RunId } from '../../domain/ids';
import type { RRError } from '../../domain/errors';
import type { FlowV3 } from '../../domain/flow';
import type { DebuggerCommand, DebuggerState } from '../../domain/debug';
import type { RunEvent, RunStatus, Unsubscribe } from '../../domain/events';

/**
 * Run khởi độngyêu cầu
 */
export interface RunStartRequest {
  /** Run ID(gọitạo) */
  runId: RunId;
  /** Flow ID */
  flowId: FlowId;
  /** Flow snapshot(thực thisử dụngđầy đủ Flow định nghĩa) */
  flowSnapshot: FlowV3;
  /** chạytham số */
  args?: JsonObject;
  /** bắt đầunút ID(mặc định Flow  entryNodeId) */
  startNodeId?: NodeId;
  /** Tab ID(bắt buộcgọi,  Run độc quyền) */
  tabId: number;
  /** gỡ lỗicấu hình */
  debug?: { breakpoints?: NodeId[]; pauseOnStart?: boolean };
}

/**
 * Run thực thikết quả
 */
export interface RunResult {
  /** Run ID */
  runId: RunId;
  /** trạng thái */
  status: Extract<RunStatus, 'succeeded' | 'failed' | 'canceled'>;
  /** (mili giây) */
  tookMs: number;
  /** lỗithông tin(nếuthất bại) */
  error?: RRError;
  /** đầu rakết quả */
  outputs?: JsonObject;
}

/**
 * Run trạng tháitruy vấnkết quả
 */
export interface RunStatusInfo {
  /** hiện tạitrạng thái */
  status: RunStatus;
  /** hiện tạinút ID */
  currentNodeId?: NodeId;
  /** bắt đầuthời gian */
  startedAt?: number;
  /** cuối cùngcập nhậtthời gian */
  updatedAt: number;
  /** Tab ID */
  tabId?: number;
}

/**
 * ExecutionKernel giao diện
 * @description Record-Replay V3 thực thiengine
 */
export interface ExecutionKernel {
  /**
   * đăng kýsự kiện
   * @param listener sự kiệnlắng nghe
   * @returns hủyđăng kýhàm
   */
  onEvent(listener: (event: RunEvent) => void): Unsubscribe;

  /**
   * khởi động Run
   * @description  Run vào hàng đợibắt đầuthực thi
   */
  startRun(req: RunStartRequest): Promise<void>;

  /**
   * tạm dừng Run
   * @param runId Run ID
   * @param reason tạm dừngnguyên nhân
   */
  pauseRun(runId: RunId, reason?: { kind: 'command' }): Promise<void>;

  /**
   * khôi phục Run
   * @param runId Run ID
   */
  resumeRun(runId: RunId): Promise<void>;

  /**
   * hủy Run
   * @param runId Run ID
   * @param reason hủynguyên nhân
   */
  cancelRun(runId: RunId, reason?: string): Promise<void>;

  /**
   * thực thigỡ lỗilệnh
   * @param runId Run ID
   * @param cmd gỡ lỗilệnh
   */
  debug(
    runId: RunId,
    cmd: DebuggerCommand,
  ): Promise<{ ok: true; state?: DebuggerState } | { ok: false; error: string }>;

  /**
   * lấy Run trạng thái
   * @param runId Run ID
   * @returns Run trạng tháithông tin null(nếukhông tồn tại)
   */
  getRunStatus(runId: RunId): Promise<RunStatusInfo | null>;

  /**
   * khôi phụcthực thi
   * @description  Service Worker gọi, khôi phục Run
   */
  recover(): Promise<void>;
}

/**
 * tạo NotImplemented  ExecutionKernel
 * @description Phase 0 giữ chỗtriển khai
 */
export function createNotImplementedKernel(): ExecutionKernel {
  const notImplemented = () => {
    throw new Error('ExecutionKernel not implemented');
  };

  return {
    onEvent: () => {
      notImplemented();
      return () => {};
    },
    startRun: async () => notImplemented(),
    pauseRun: async () => notImplemented(),
    resumeRun: async () => notImplemented(),
    cancelRun: async () => notImplemented(),
    debug: async () => notImplemented(),
    getRunStatus: async () => notImplemented(),
    recover: async () => notImplemented(),
  };
}
