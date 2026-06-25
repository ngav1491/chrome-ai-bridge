/**
 * @fileoverview sự kiệnkiểuđịnh nghĩa
 * @description định nghĩa Record-Replay V3 trongchạysự kiệntrạng thái
 */

import type { JsonObject, JsonValue, UnixMillis } from './json';
import type { EdgeLabel, FlowId, NodeId, RunId } from './ids';
import type { RRError } from './errors';
import type { TriggerFireContext } from './triggers';

/** hủyđăng kýhàmkiểu */
export type Unsubscribe = () => void;

/** Run trạng thái */
export type RunStatus = 'queued' | 'running' | 'paused' | 'succeeded' | 'failed' | 'canceled';

/**
 * sự kiệncơ sởgiao diện
 * @description tất cảsự kiệncông khaitrường
 */
export interface EventBase {
  /**  Run ID */
  runId: RunId;
  /** sự kiệnthời gian */
  ts: UnixMillis;
  /** tăng dần */
  seq: number;
}

/**
 * tạm dừngnguyên nhân
 * @description mô tả Run tạm dừngnguyên nhân
 */
export type PauseReason =
  | { kind: 'breakpoint'; nodeId: NodeId }
  | { kind: 'step'; nodeId: NodeId }
  | { kind: 'command' }
  | { kind: 'policy'; nodeId: NodeId; reason: string };

/** khôi phụcnguyên nhân */
export type RecoveryReason = 'sw_restart' | 'lease_expired';

/**
 * Run sự kiệnkiểu
 * @description tất cảchạysự kiện
 */
export type RunEvent =
  // ===== Run sự kiện =====
  | (EventBase & { type: 'run.queued'; flowId: FlowId })
  | (EventBase & { type: 'run.started'; flowId: FlowId; tabId: number })
  | (EventBase & { type: 'run.paused'; reason: PauseReason; nodeId?: NodeId })
  | (EventBase & { type: 'run.resumed' })
  | (EventBase & {
      type: 'run.recovered';
      /** khôi phụcnguyên nhân */
      reason: RecoveryReason;
      /** khôi phụctrạng thái */
      fromStatus: 'running' | 'paused';
      /** khôi phụctrạng thái */
      toStatus: 'queued';
      /**  ownerId(dùng cho) */
      prevOwnerId?: string;
    })
  | (EventBase & { type: 'run.canceled'; reason?: string })
  | (EventBase & { type: 'run.succeeded'; tookMs: number; outputs?: JsonObject })
  | (EventBase & { type: 'run.failed'; error: RRError; nodeId?: NodeId })

  // ===== Node thực thisự kiện =====
  | (EventBase & { type: 'node.queued'; nodeId: NodeId })
  | (EventBase & { type: 'node.started'; nodeId: NodeId; attempt: number })
  | (EventBase & {
      type: 'node.succeeded';
      nodeId: NodeId;
      tookMs: number;
      next?: { kind: 'edgeLabel'; label: EdgeLabel } | { kind: 'end' };
    })
  | (EventBase & {
      type: 'node.failed';
      nodeId: NodeId;
      attempt: number;
      error: RRError;
      decision: 'retry' | 'continue' | 'stop' | 'goto';
    })
  | (EventBase & { type: 'node.skipped'; nodeId: NodeId; reason: 'disabled' | 'unreachable' })

  // ===== biếnnhật kýsự kiện =====
  | (EventBase & {
      type: 'vars.patch';
      patch: Array<{ op: 'set' | 'delete'; name: string; value?: JsonValue }>;
    })
  | (EventBase & { type: 'artifact.screenshot'; nodeId: NodeId; data: string; savedAs?: string })
  | (EventBase & {
      type: 'log';
      level: 'debug' | 'info' | 'warn' | 'error';
      message: string;
      data?: JsonValue;
    });

/** Run sự kiệnkiểu(kiểutrích xuất) */
export type RunEventType = RunEvent['type'];

/**
 *  Omit(kiểu)
 */
type DistributiveOmit<T, K extends keyof T> = T extends unknown ? Omit<T, K> : never;

/**
 * Run sự kiệnđầu vàokiểu
 * @description seq bắt buộc storage (thông qua RunRecordV3.nextSeq)
 * ts tùy chọn, mặc định Date.now()
 */
export type RunEventInput = DistributiveOmit<RunEvent, 'seq' | 'ts'> & {
  ts?: UnixMillis;
};

/** Run Schema phiên bản */
export const RUN_SCHEMA_VERSION = 3 as const;

/**
 * Run ghi V3
 * @description lưu trữ IndexedDB trong Run ghi
 */
export interface RunRecordV3 {
  /** Schema phiên bản */
  schemaVersion: typeof RUN_SCHEMA_VERSION;
  /** Run mã định danh duy nhất */
  id: RunId;
  /** liên quan Flow ID */
  flowId: FlowId;

  /** hiện tạitrạng thái */
  status: RunStatus;
  /** tạothời gian */
  createdAt: UnixMillis;
  /** cuối cùngcập nhậtthời gian */
  updatedAt: UnixMillis;

  /** bắt đầuthực thithời gian */
  startedAt?: UnixMillis;
  /** kết thúcthời gian */
  finishedAt?: UnixMillis;
  /** (mili giây) */
  tookMs?: number;

  /**  Tab ID( Run độc quyền) */
  tabId?: number;
  /** bắt đầunút ID(nếumặc địnhđiểm vào) */
  startNodeId?: NodeId;
  /** hiện tạithực thinút ID */
  currentNodeId?: NodeId;

  /** hiện tạisố lần thử */
  attempt: number;
  /** số lần thử tối đa */
  maxAttempts: number;

  /** chạytham số */
  args?: JsonObject;
  /** triggerngữ cảnh */
  trigger?: TriggerFireContext;
  /** gỡ lỗicấu hình */
  debug?: { breakpoints?: NodeId[]; pauseOnStart?: boolean };

  /** lỗithông tin(nếuthất bại) */
  error?: RRError;
  /** đầu rakết quả */
  outputs?: JsonObject;

  /** sự kiện(bộ nhớ đệmtrường) */
  nextSeq: number;
}

/**
 * phán đoán Run có/không
 */
export function isTerminalStatus(status: RunStatus): boolean {
  return status === 'succeeded' || status === 'failed' || status === 'canceled';
}

/**
 * phán đoán Run có/khôngđangthực thi
 */
export function isActiveStatus(status: RunStatus): boolean {
  return status === 'running' || status === 'paused';
}
