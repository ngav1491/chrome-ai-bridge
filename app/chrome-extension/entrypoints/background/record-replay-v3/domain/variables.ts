/**
 * @fileoverview biếnkiểuđịnh nghĩa
 * @description định nghĩa Record-Replay V3 noiDungTiengVietsử dụngnoiDungTiengVietbiếnnoiDungTiengVietlưu trữ lâu dàibiến
 */

import type { JsonValue, UnixMillis } from './json';

/** biếntên */
export type VariableName = string;

/** lưu trữ lâu dàibiếntên（noiDungTiengViet $ noiDungTiengViet） */
export type PersistentVariableName = `$${string}`;

/** biếnphạm vi */
export type VariableScope = 'run' | 'flow' | 'persistent';

/**
 * biếnnoiDungTiengViet
 * @description trỏ đếnbiếnnoiDungTiengViet，hỗ trợ JSON path truy cập
 */
export interface VariablePointer {
  /** biếnphạm vi */
  scope: VariableScope;
  /** biếntên */
  name: VariableName;
  /** JSON path（dùng chotruy cậpnoiDungTiengVietthuộc tính） */
  path?: ReadonlyArray<string | number>;
}

/**
 * biếnđịnh nghĩa
 * @description Flow noiDungTiengVietbiến
 */
export interface VariableDefinition {
  /** biếntên */
  name: VariableName;
  /** hiển thịnhãn */
  label?: string;
  /** mô tả */
  description?: string;
  /** có/khôngnhạy cảm（noiDungTiengViethiển thị/xuất） */
  sensitive?: boolean;
  /** có/khôngnoiDungTiengViet */
  required?: boolean;
  /** mặc địnhnoiDungTiengViet */
  default?: JsonValue;
  /** phạm vi（noiDungTiengViet persistent，persistent thông qua $ tiền tốphán đoán） */
  scope?: Exclude<VariableScope, 'persistent'>;
}

/**
 * lưu trữ lâu dàibiếnghi
 * @description lưu trữnoiDungTiengViet IndexedDB tronglưu trữ lâu dàibiến
 */
export interface PersistentVarRecord {
  /** biếnnoiDungTiengViet（noiDungTiengViet $ noiDungTiengViet） */
  key: PersistentVariableName;
  /** biếnnoiDungTiengViet */
  value: JsonValue;
  /** cuối cùngcập nhậtthời gian */
  updatedAt: UnixMillis;
  /** phiên bảnnoiDungTiengViet（noiDungTiengViettăng dần，dùng cho LWW noiDungTiengVietgỡ lỗi） */
  version: number;
}

/**
 * phán đoánbiếnnoiDungTiengVietcó phải làlưu trữ lâu dàibiến
 */
export function isPersistentVariable(name: string): name is PersistentVariableName {
  return name.startsWith('$');
}

/**
 * phân tích cú phápbiếnnoiDungTiengVietchuỗi
 * @example "$user.name" -> { scope: 'persistent', name: '$user', path: ['name'] }
 */
export function parseVariablePointer(ref: string): VariablePointer | null {
  if (!ref) return null;

  const parts = ref.split('.');
  const name = parts[0];
  const path = parts.slice(1);

  if (isPersistentVariable(name)) {
    return {
      scope: 'persistent',
      name,
      path: path.length > 0 ? path : undefined,
    };
  }

  // mặc địnhnoiDungTiengViet run phạm vi
  return {
    scope: 'run',
    name,
    path: path.length > 0 ? path : undefined,
  };
}
