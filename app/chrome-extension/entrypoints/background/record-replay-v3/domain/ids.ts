/**
 * @fileoverview ID kiểuđịnh nghĩa
 * @description định nghĩa Record-Replay V3 sử dụng ID kiểu
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

/** định nghĩa Edge nhãn */
export const EDGE_LABELS = {
  /** mặc định */
  DEFAULT: 'default',
  /** lỗixử lý */
  ON_ERROR: 'onError',
  /** điều kiện */
  TRUE: 'true',
  /** điều kiện */
  FALSE: 'false',
} as const;

/** Edge nhãnkiểu() */
export type EdgeLabelValue = (typeof EDGE_LABELS)[keyof typeof EDGE_LABELS];
