/**
 * @fileoverview Flow kiểuđịnh nghĩa
 * @description định nghĩa Record-Replay V3 trong Flow IR(biểu thị)
 */

import type { ISODateTimeString, JsonObject } from './json';
import type { EdgeId, EdgeLabel, FlowId, NodeId } from './ids';
import type { FlowPolicy, NodePolicy } from './policy';
import type { VariableDefinition } from './variables';

/** Flow Schema phiên bản */
export const FLOW_SCHEMA_VERSION = 3 as const;

/**
 * Edge V3
 * @description DAG trong, kết nốihainút
 */
export interface EdgeV3 {
  /** Edge mã định danh duy nhất */
  id: EdgeId;
  /** nút ID */
  from: NodeId;
  /** mục tiêunút ID */
  to: NodeId;
  /** nhãn(dùng chođiều kiệnnhánhlỗixử lý) */
  label?: EdgeLabel;
}

/** nútkiểu() */
export type NodeKind = string;

/**
 * Node V3
 * @description DAG trongnút, thực thithao tác
 */
export interface NodeV3 {
  /** Node mã định danh duy nhất */
  id: NodeId;
  /** nútkiểu */
  kind: NodeKind;
  /** núttên(dùng chohiển thị) */
  name?: string;
  /** có/khôngvô hiệu hóa */
  disabled?: boolean;
  /** nútchiến lược */
  policy?: NodePolicy;
  /** nútcấu hình(kiểu kind quyết định) */
  config: JsonObject;
  /** UI thông tin */
  ui?: { x: number; y: number };
}

/**
 * Flow dữ liệu
 * @description định nghĩa Flow tên miền/đường dẫn/URL
 */
export interface FlowBinding {
  kind: 'domain' | 'path' | 'url';
  value: string;
}

/**
 * Flow V3
 * @description đầy đủ Flow định nghĩa, bao gồmnút, cấu hình
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

  /** điểm vàonút ID(chỉ định, phụ thuộc) */
  entryNodeId: NodeId;
  /** nútdanh sách */
  nodes: NodeV3[];
  /** danh sách */
  edges: EdgeV3[];

  /** biếnđịnh nghĩa */
  variables?: VariableDefinition[];
  /** Flow chiến lược */
  policy?: FlowPolicy;
  /** dữ liệu */
  meta?: {
    /** nhãn */
    tags?: string[];
    /** quy tắc */
    bindings?: FlowBinding[];
  };
}

/**
 * dựa trên ID nút
 */
export function findNodeById(flow: FlowV3, nodeId: NodeId): NodeV3 | undefined {
  return flow.nodes.find((n) => n.id === nodeId);
}

/**
 * chỉ địnhnúttất cả
 */
export function findEdgesFrom(flow: FlowV3, nodeId: NodeId): EdgeV3[] {
  return flow.edges.filter((e) => e.from === nodeId);
}

/**
 * trỏ đếnchỉ địnhnúttất cả
 */
export function findEdgesTo(flow: FlowV3, nodeId: NodeId): EdgeV3[] {
  return flow.edges.filter((e) => e.to === nodeId);
}
