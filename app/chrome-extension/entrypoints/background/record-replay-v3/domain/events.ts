/**
 * @fileoverview sự kiệnkiểuđịnh nghĩa
 * @description định nghĩa Record-Replay V3 trongchạysự kiệnnoiDungTiengViettrạng thái
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
 * @description tất cảsự kiệnnoiDungTiengVietcông khaitrường
 */
export interface EventBase {
  /** noiDungTiengViet Run ID */
  runId: RunId;
  /** sự kiệnthời giannoiDungTiengViet */
  ts: UnixMillis;
  /** noiDungTiengViettăng dầnnoiDungTiengViet */
  seq: number;
}

/**
 * tạm dừngnguyên nhân
 * @description mô tả Run tạm dừngnoiDungTiengVietnguyên nhân
 */
export type PauseReason =
  | { kind: 'breakpoint'; nodeId: NodeId }
  | { kind: 'step'; nodeId: NodeId }
  | { kind: 'command' }
  | { kind: 'policy'; nodeId: NodeId; reason: string };

/** khôi phụcnguyên nhân */
export type RecoveryReason = 'sw_restart' | 'lease_expired';

/**
 * Run sự kiệnnoiDungTiengVietkiểu
 * @description tất cảnoiDungTiengVietchạynoiDungTiengVietsự kiện
 */
export type RunEvent =
  // ===== Run noiDungTiengVietsự kiện =====
  | (EventBase & { type: 'run.queued'; flowId: FlowId })
  | (EventBase & { type: 'run.started'; flowId: FlowId; tabId: number })
  | (EventBase & { type: 'run.paused'; reason: PauseReason; nodeId?: NodeId })
  | (EventBase & { type: 'run.resumed' })
  | (EventBase & {
      type: 'run.recovered';
      /** khôi phụcnguyên nhân */
      reason: RecoveryReason;
      /** khôi phụcnoiDungTiengViettrạng thái */
      fromStatus: 'running' | 'paused';
      /** khôi phụcnoiDungTiengViettrạng thái */
      toStatus: 'queued';
      /** noiDungTiengViet ownerId（dùng chonoiDungTiengViet） */
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

  // ===== biếnnoiDungTiengVietnhật kýsự kiện =====
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

/** Run sự kiệnkiểu（noiDungTiengVietkiểutrích xuất） */
export type RunEventType = RunEvent['type'];

/**
 * noiDungTiengViet Omit（noiDungTiengVietkiểu）
 */
type DistributiveOmit<T, K extends keyof T> = T extends unknown ? Omit<T, K> : never;

/**
 * Run sự kiệnđầu vàokiểu
 * @description seq bắt buộcnoiDungTiengViet storage noiDungTiengViet（thông qua RunRecordV3.nextSeq）
 * ts tùy chọn，mặc địnhnoiDungTiengViet Date.now()
 */
export type RunEventInput = DistributiveOmit<RunEvent, 'seq' | 'ts'> & {
  ts?: UnixMillis;
};

/** Run Schema phiên bản */
export const RUN_SCHEMA_VERSION = 3 as const;

/**
 * Run ghi V3
 * @description lưu trữnoiDungTiengViet IndexedDB trong Run noiDungTiengVietghi
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
  /** noiDungTiengViet（mili giây） */
  tookMs?: number;

  /** noiDungTiengViet Tab ID（noiDungTiengViet Run độc quyền） */
  tabId?: number;
  /** bắt đầunút ID（nếunoiDungTiengVietmặc địnhđiểm vào） */
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

  /** lỗithông tin（nếuthất bại） */
  error?: RRError;
  /** đầu rakết quả */
  outputs?: JsonObject;

  /** noiDungTiengVietsự kiệnnoiDungTiengViet（bộ nhớ đệmtrường） */
  nextSeq: number;
}

/**
 * phán đoán Run có/khôngnoiDungTiengViet
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
