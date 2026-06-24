/**
 * @fileoverview ID kiểuđịnh nghĩa
 * @description định nghĩa Record-Replay V3 noiDungTiengVietsử dụngnoiDungTiengViet ID kiểu
 */

/** Flow mã định danh duy nhất */
export type FlowId = string;

/** Node mã định danh duy nhất */
export type NodeId = string;

/** Edge mã định danh duy nhất */
export type EdgeId = string;

/** Run mã định danh duy nhất */
export type RunId = string;

/** Trigger mã định danh duy nhất */
export type TriggerId = string;

/** Edge nhãnkiểu */
export type EdgeLabel = string;

/** noiDungTiengVietđịnh nghĩanoiDungTiengViet Edge nhãnnoiDungTiengViet */
export const EDGE_LABELS = {
  /** mặc địnhnoiDungTiengViet */
  DEFAULT: 'default',
  /** lỗixử lýnoiDungTiengViet */
  ON_ERROR: 'onError',
  /** điều kiệnnoiDungTiengViet */
  TRUE: 'true',
  /** điều kiệnnoiDungTiengViet */
  FALSE: 'false',
} as const;

/** Edge nhãnkiểu（noiDungTiengViet） */
export type EdgeLabelValue = (typeof EDGE_LABELS)[keyof typeof EDGE_LABELS];
