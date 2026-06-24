/**
 * @fileoverview ExecutionKernel giao diệnđịnh nghĩa
 * @description định nghĩa Record-Replay V3 noiDungTiengVietthực thienginegiao diện
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
  /** Run ID（noiDungTiengVietgọinoiDungTiengViettạo） */
  runId: RunId;
  /** Flow ID */
  flowId: FlowId;
  /** Flow snapshot（thực thinoiDungTiengVietsử dụngnoiDungTiengVietđầy đủ Flow định nghĩa） */
  flowSnapshot: FlowV3;
  /** chạytham số */
  args?: JsonObject;
  /** bắt đầunút ID（mặc địnhnoiDungTiengViet Flow noiDungTiengViet entryNodeId） */
  startNodeId?: NodeId;
  /** Tab ID（bắt buộcnoiDungTiengVietgọinoiDungTiengViet，noiDungTiengViet Run độc quyền） */
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
  /** noiDungTiengViettrạng thái */
  status: Extract<RunStatus, 'succeeded' | 'failed' | 'canceled'>;
  /** noiDungTiengViet（mili giây） */
  tookMs: number;
  /** lỗithông tin（nếuthất bại） */
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
 * @description Record-Replay V3 noiDungTiengVietthực thiengine
 */
export interface ExecutionKernel {
  /**
   * đăng kýsự kiệnnoiDungTiengViet
   * @param listener sự kiệnlắng nghenoiDungTiengViet
   * @returns hủyđăng kýhàm
   */
  onEvent(listener: (event: RunEvent) => void): Unsubscribe;

  /**
   * khởi động Run
   * @description noiDungTiengViet Run noiDungTiengVietvào hàng đợinoiDungTiengVietbắt đầuthực thi
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
   * @returns Run trạng tháithông tinnoiDungTiengViet null（nếukhông tồn tại）
   */
  getRunStatus(runId: RunId): Promise<RunStatusInfo | null>;

  /**
   * khôi phụcthực thi
   * @description noiDungTiengViet Service Worker noiDungTiengVietgọi，khôi phụcnoiDungTiengViet Run
   */
  recover(): Promise<void>;
}

/**
 * tạo NotImplemented noiDungTiengViet ExecutionKernel
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
