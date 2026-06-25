/**
 * @fileoverview chiến lượckiểuđịnh nghĩa
 * @description định nghĩa Record-Replay V3 sử dụnghết thời gian, thử lại, lỗixử lýartifactchiến lược
 */

import type { EdgeLabel, NodeId } from './ids';
import type { RRErrorCode } from './errors';
import type { UnixMillis } from './json';

/**
 * hết thời gianchiến lược
 * @description định nghĩathao táchết thời gianthời gian
 */
export interface TimeoutPolicy {
  /** hết thời gianthời gian(mili giây) */
  ms: UnixMillis;
  /** hết thời gian: attempt=thử, node=toàn bộnútthực thi */
  scope?: 'attempt' | 'node';
}

/**
 * thử lạichiến lược
 * @description định nghĩathất bạithử lạihành vi
 */
export interface RetryPolicy {
  /** tối đathử lại */
  retries: number;
  /** thử lạikhoảng cách(mili giây) */
  intervalMs: UnixMillis;
  /** chiến lược: none=cố địnhkhoảng cách, exp=, linear= */
  backoff?: 'none' | 'exp' | 'linear';
  /** tối đathử lạikhoảng cách(mili giây) */
  maxIntervalMs?: UnixMillis;
  /** chiến lược: none=, full=ngẫu nhiên */
  jitter?: 'none' | 'full';
  /** lỗithử lại */
  retryOn?: ReadonlyArray<RRErrorCode>;
}

/**
 * lỗixử lýchiến lược
 * @description định nghĩanútthực thithất bạixử lýphương thức
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
 * @description định nghĩaảnh chụp màn hìnhnhật kýhành vi
 */
export interface ArtifactPolicy {
  /** ảnh chụp màn hìnhchiến lược: never=, onFailure=thất bại, always= */
  screenshot?: 'never' | 'onFailure' | 'always';
  /** ảnh chụp màn hìnhlưuđường dẫnmẫu */
  saveScreenshotAs?: string;
  /** có/khôngbao gồmđiều khiểnnhật ký */
  includeConsole?: boolean;
  /** có/khôngbao gồmyêu cầu */
  includeNetwork?: boolean;
}

/**
 * nútchiến lược
 * @description đơn lẻnútthực thichiến lượccấu hình
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
 * Flow chiến lược
 * @description toàn bộ Flow thực thichiến lượccấu hình
 */
export interface FlowPolicy {
  /** mặc địnhnútchiến lược */
  defaultNodePolicy?: NodePolicy;
  /** hỗ trợnútxử lýchiến lược */
  unsupportedNodePolicy?: OnErrorPolicy;
  /** Run hết thời gianthời gian(mili giây) */
  runTimeoutMs?: UnixMillis;
}

/**
 * nútchiến lược
 * @description  Flow mặc địnhchiến lượcnútchiến lược
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
