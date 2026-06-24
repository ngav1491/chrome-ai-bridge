/**
 * @fileoverview chiến lượckiểuđịnh nghĩa
 * @description định nghĩa Record-Replay V3 noiDungTiengVietsử dụngnoiDungTiengViethết thời gian、thử lại、lỗixử lýnoiDungTiengVietartifactchiến lược
 */

import type { EdgeLabel, NodeId } from './ids';
import type { RRErrorCode } from './errors';
import type { UnixMillis } from './json';

/**
 * hết thời gianchiến lược
 * @description định nghĩathao tácnoiDungTiengViethết thời gianthời giannoiDungTiengViet
 */
export interface TimeoutPolicy {
  /** hết thời gianthời gian（mili giây） */
  ms: UnixMillis;
  /** hết thời giannoiDungTiengViet：attempt=noiDungTiengVietthử, node=toàn bộnútthực thi */
  scope?: 'attempt' | 'node';
}

/**
 * thử lạichiến lược
 * @description định nghĩathất bạinoiDungTiengVietthử lạihành vi
 */
export interface RetryPolicy {
  /** tối đathử lạinoiDungTiengViet */
  retries: number;
  /** thử lạikhoảng cách（mili giây） */
  intervalMs: UnixMillis;
  /** noiDungTiengVietchiến lược：none=cố địnhkhoảng cách, exp=noiDungTiengViet, linear=noiDungTiengViet */
  backoff?: 'none' | 'exp' | 'linear';
  /** tối đathử lạikhoảng cách（mili giây） */
  maxIntervalMs?: UnixMillis;
  /** noiDungTiengVietchiến lược：none=noiDungTiengViet, full=noiDungTiengVietngẫu nhiên */
  jitter?: 'none' | 'full';
  /** noiDungTiengVietlỗinoiDungTiengVietthử lại */
  retryOn?: ReadonlyArray<RRErrorCode>;
}

/**
 * lỗixử lýchiến lược
 * @description định nghĩanútthực thithất bạinoiDungTiengVietxử lýphương thức
 */
export type OnErrorPolicy =
  | { kind: 'stop' }
  | { kind: 'continue'; as?: 'warning' | 'error' }
  | {
      kind: 'goto';
      target: { kind: 'edgeLabel'; label: EdgeLabel } | { kind: 'node'; nodeId: NodeId };
    }
  | { kind: 'retry'; override?: Partial<RetryPolicy> };

/**
 * artifactchiến lược
 * @description định nghĩaảnh chụp màn hìnhnoiDungTiengVietnhật kýnoiDungTiengViethành vi
 */
export interface ArtifactPolicy {
  /** ảnh chụp màn hìnhchiến lược：never=noiDungTiengViet, onFailure=thất bạinoiDungTiengViet, always=noiDungTiengViet */
  screenshot?: 'never' | 'onFailure' | 'always';
  /** ảnh chụp màn hìnhlưuđường dẫnmẫu */
  saveScreenshotAs?: string;
  /** có/khôngbao gồmđiều khiểnnoiDungTiengVietnhật ký */
  includeConsole?: boolean;
  /** có/khôngbao gồmnoiDungTiengVietyêu cầu */
  includeNetwork?: boolean;
}

/**
 * nútnoiDungTiengVietchiến lược
 * @description đơn lẻnútnoiDungTiengVietthực thichiến lượccấu hình
 */
export interface NodePolicy {
  /** hết thời gianchiến lược */
  timeout?: TimeoutPolicy;
  /** thử lạichiến lược */
  retry?: RetryPolicy;
  /** lỗixử lýchiến lược */
  onError?: OnErrorPolicy;
  /** artifactchiến lược */
  artifacts?: ArtifactPolicy;
}

/**
 * Flow noiDungTiengVietchiến lược
 * @description toàn bộ Flow noiDungTiengVietthực thichiến lượccấu hình
 */
export interface FlowPolicy {
  /** mặc địnhnútchiến lược */
  defaultNodePolicy?: NodePolicy;
  /** noiDungTiengViethỗ trợnútnoiDungTiengVietxử lýchiến lược */
  unsupportedNodePolicy?: OnErrorPolicy;
  /** Run noiDungTiengViethết thời gianthời gian（mili giây） */
  runTimeoutMs?: UnixMillis;
}

/**
 * noiDungTiengVietnútchiến lược
 * @description noiDungTiengViet Flow noiDungTiengVietmặc địnhchiến lượcnoiDungTiengVietnútnoiDungTiengVietchiến lượcnoiDungTiengViet
 */
export function mergeNodePolicy(
  flowDefault: NodePolicy | undefined,
  nodePolicy: NodePolicy | undefined,
): NodePolicy {
  if (!flowDefault) return nodePolicy ?? {};
  if (!nodePolicy) return flowDefault;

  return {
    timeout: nodePolicy.timeout ?? flowDefault.timeout,
    retry: nodePolicy.retry ?? flowDefault.retry,
    onError: nodePolicy.onError ?? flowDefault.onError,
    artifacts: nodePolicy.artifacts
      ? { ...flowDefault.artifacts, ...nodePolicy.artifacts }
      : flowDefault.artifacts,
  };
}
