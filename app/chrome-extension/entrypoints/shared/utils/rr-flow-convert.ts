/**
 * @fileoverview V2/V3 Flow hai chiềuchuyển đổicông cụ
 * @description noiDungTiengViet Builder V2 Flow kiểunoiDungTiengViet V3 RPC FlowV3 kiểu
 *
 * ghi chú thiết kế:
 * - Builder store noiDungTiengVietsử dụng V2 kiểu (type, version, steps)
 * - RPC noiDungTiengVietsử dụng V3 kiểu (kind, schemaVersion, entryNodeId)
 * - noiDungTiengViet UI noiDungTiengVietkiểuchuyển đổi，noiDungTiengVietchuyển đổinoiDungTiengViet
 */

import type { Flow as FlowV2 } from '@/entrypoints/background/record-replay/types';
import type { FlowV3 } from '@/entrypoints/background/record-replay-v3/domain/flow';
import {
  convertFlowV2ToV3,
  convertFlowV3ToV2,
} from '@/entrypoints/background/record-replay-v3/storage/import/v2-to-v3';

// ==================== Types ====================

export interface FlowConversionResult<T> {
  flow: T;
  warnings: string[];
}

// ==================== V2 -> V3 (for RPC calls) ====================

/**
 * noiDungTiengViet V2 Flow chuyển đổi thành V3 định dạng，dùng cho RPC lưu
 * @param flowV2 Builder store trong V2 Flow
 * @returns V3 Flow noiDungTiengVietcảnh báothông tin
 * @throws chuyển đổithất bạinoiDungTiengVietlỗi
 */
export function flowV2ToV3ForRpc(flowV2: FlowV2): FlowConversionResult<FlowV3> {
  const result = convertFlowV2ToV3(flowV2 as unknown as Parameters<typeof convertFlowV2ToV3>[0]);

  if (!result.success || !result.data) {
    const errorMsg =
      result.errors.length > 0 ? result.errors.join('; ') : 'Unknown conversion error';
    throw new Error(`V2→V3 conversion failed: ${errorMsg}`);
  }

  return {
    flow: result.data,
    warnings: result.warnings,
  };
}

// ==================== V3 -> V2 (for Builder display) ====================

/**
 * noiDungTiengViet V3 Flow chuyển đổi thành V2 định dạng，dùng cho Builder hiển thịnoiDungTiengVietchỉnh sửa
 * @param flowV3 noiDungTiengViet RPC lấynoiDungTiengViet V3 Flow
 * @returns V2 Flow noiDungTiengVietcảnh báothông tin
 * @throws chuyển đổithất bạinoiDungTiengVietlỗi
 */
export function flowV3ToV2ForBuilder(flowV3: FlowV3): FlowConversionResult<FlowV2> {
  const result = convertFlowV3ToV2(flowV3);

  if (!result.success || !result.data) {
    const errorMsg =
      result.errors.length > 0 ? result.errors.join('; ') : 'Unknown conversion error';
    throw new Error(`V3→V2 conversion failed: ${errorMsg}`);
  }

  return {
    flow: result.data as unknown as FlowV2,
    warnings: result.warnings,
  };
}

// ==================== Type Guards ====================

/**
 * phán đoáncó phải là V3 Flow
 * @description dùng chonhậpnoiDungTiengVietphán đoán JSON định dạng
 */
export function isFlowV3(value: unknown): value is FlowV3 {
  if (!value || typeof value !== 'object' || Array.isArray(value)) {
    return false;
  }

  const obj = value as Record<string, unknown>;
  return (
    obj.schemaVersion === 3 &&
    typeof obj.id === 'string' &&
    typeof obj.name === 'string' &&
    typeof obj.entryNodeId === 'string' &&
    Array.isArray(obj.nodes)
  );
}

/**
 * phán đoáncó phải là V2 Flow
 * @description dùng chonhậpnoiDungTiengVietphán đoán JSON định dạng
 */
export function isFlowV2(value: unknown): value is FlowV2 {
  if (!value || typeof value !== 'object' || Array.isArray(value)) {
    return false;
  }

  const obj = value as Record<string, unknown>;
  return (
    typeof obj.id === 'string' &&
    typeof obj.name === 'string' &&
    // V2 noiDungTiengViet version trường（số），noiDungTiengVietkhông có schemaVersion
    typeof obj.version === 'number' &&
    obj.schemaVersion === undefined &&
    // V2 noiDungTiengViet steps noiDungTiengViet nodes
    (Array.isArray(obj.steps) || Array.isArray(obj.nodes))
  );
}

// ==================== Import Helpers ====================

/**
 * noiDungTiengVietnhậpnoiDungTiengViet JSON noiDungTiengViettrích xuất Flow ứng viêndanh sách
 * @description hỗ trợđơn lẻ Flow、Flow mảng、noiDungTiengViet { flows: Flow[] } định dạng
 */
export function extractFlowCandidates(parsed: unknown): unknown[] {
  // mảngđịnh dạng
  if (Array.isArray(parsed)) {
    return parsed;
  }

  // đối tượngđịnh dạng
  if (parsed && typeof parsed === 'object') {
    const obj = parsed as Record<string, unknown>;

    // { flows: [...] } định dạng
    if (Array.isArray(obj.flows)) {
      return obj.flows;
    }

    // đơn lẻ Flow đối tượng
    if (obj.id && (Array.isArray(obj.steps) || Array.isArray(obj.nodes))) {
      return [obj];
    }
  }

  return [];
}
