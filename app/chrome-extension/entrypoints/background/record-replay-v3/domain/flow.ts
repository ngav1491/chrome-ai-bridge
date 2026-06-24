/**
 * @fileoverview Flow kiểuđịnh nghĩa
 * @description định nghĩa Record-Replay V3 trong Flow IR（noiDungTiengVietbiểu thị）
 */

import type { ISODateTimeString, JsonObject } from './json';
import type { EdgeId, EdgeLabel, FlowId, NodeId } from './ids';
import type { FlowPolicy, NodePolicy } from './policy';
import type { VariableDefinition } from './variables';

/** Flow Schema phiên bản */
export const FLOW_SCHEMA_VERSION = 3 as const;

/**
 * Edge V3
 * @description DAG trongnoiDungTiengViet，kết nốihainút
 */
export interface EdgeV3 {
  /** Edge mã định danh duy nhất */
  id: EdgeId;
  /** noiDungTiengVietnút ID */
  from: NodeId;
  /** mục tiêunút ID */
  to: NodeId;
  /** noiDungTiengVietnhãn（dùng chođiều kiệnnhánhnoiDungTiengVietlỗixử lý） */
  label?: EdgeLabel;
}

/** nútkiểu（noiDungTiengViet） */
export type NodeKind = string;

/**
 * Node V3
 * @description DAG trongnút，noiDungTiengVietthực thinoiDungTiengVietthao tác
 */
export interface NodeV3 {
  /** Node mã định danh duy nhất */
  id: NodeId;
  /** nútkiểu */
  kind: NodeKind;
  /** núttên（dùng chohiển thị） */
  name?: string;
  /** có/khôngvô hiệu hóa */
  disabled?: boolean;
  /** nútnoiDungTiengVietchiến lược */
  policy?: NodePolicy;
  /** nútcấu hình（kiểunoiDungTiengViet kind quyết định） */
  config: JsonObject;
  /** UI noiDungTiengVietthông tin */
  ui?: { x: number; y: number };
}

/**
 * Flow noiDungTiengVietdữ liệunoiDungTiengViet
 * @description định nghĩa Flow noiDungTiengViettên miền/đường dẫn/URL noiDungTiengViet
 */
export interface FlowBinding {
  kind: 'domain' | 'path' | 'url';
  value: string;
}

/**
 * Flow V3
 * @description đầy đủ Flow định nghĩa，bao gồmnút、noiDungTiengVietcấu hình
 */
export interface FlowV3 {
  /** Schema phiên bản */
  schemaVersion: typeof FLOW_SCHEMA_VERSION;
  /** Flow mã định danh duy nhất */
  id: FlowId;
  /** Flow tên */
  name: string;
  /** Flow mô tả */
  description?: string;
  /** tạothời gian */
  createdAt: ISODateTimeString;
  /** cập nhậtthời gian */
  updatedAt: ISODateTimeString;

  /** điểm vàonút ID（noiDungTiengVietchỉ định，noiDungTiengVietphụ thuộcnoiDungTiengViet） */
  entryNodeId: NodeId;
  /** nútdanh sách */
  nodes: NodeV3[];
  /** noiDungTiengVietdanh sách */
  edges: EdgeV3[];

  /** biếnđịnh nghĩa */
  variables?: VariableDefinition[];
  /** Flow noiDungTiengVietchiến lược */
  policy?: FlowPolicy;
  /** noiDungTiengVietdữ liệu */
  meta?: {
    /** nhãn */
    tags?: string[];
    /** noiDungTiengVietquy tắc */
    bindings?: FlowBinding[];
  };
}

/**
 * dựa trên ID noiDungTiengVietnút
 */
export function findNodeById(flow: FlowV3, nodeId: NodeId): NodeV3 | undefined {
  return flow.nodes.find((n) => n.id === nodeId);
}

/**
 * noiDungTiengVietchỉ địnhnútnoiDungTiengViettất cảnoiDungTiengViet
 */
export function findEdgesFrom(flow: FlowV3, nodeId: NodeId): EdgeV3[] {
  return flow.edges.filter((e) => e.from === nodeId);
}

/**
 * noiDungTiengViettrỏ đếnchỉ địnhnútnoiDungTiengViettất cảnoiDungTiengViet
 */
export function findEdgesTo(flow: FlowV3, nodeId: NodeId): EdgeV3[] {
  return flow.edges.filter((e) => e.to === nodeId);
}
