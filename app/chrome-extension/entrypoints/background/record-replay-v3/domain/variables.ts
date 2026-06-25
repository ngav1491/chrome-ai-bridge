/**
 * @fileoverview biếnkiểuđịnh nghĩa
 * @description định nghĩa Record-Replay V3 sử dụngbiếnlưu trữ lâu dàibiến
 */

import type { JsonValue, UnixMillis } from './json';

/** biếntên */
export type VariableName = string;

/** lưu trữ lâu dàibiếntên( $ ) */
export type PersistentVariableName = `$${string}`;

/** biếnphạm vi */
export type VariableScope = 'run' | 'flow' | 'persistent';

/**
 * biến
 * @description trỏ đếnbiến, hỗ trợ JSON path truy cập
 */
export interface VariablePointer {
  /** biếnphạm vi */
  scope: VariableScope;
  /** biếntên */
  name: VariableName;
  /** JSON path(dùng chotruy cậpthuộc tính) */
  path?: ReadonlyArray<string | number>;
}

/**
 * biếnđịnh nghĩa
 * @description Flow biến
 */
export interface VariableDefinition {
  /** biếntên */
  name: VariableName;
  /** hiển thịnhãn */
  label?: string;
  /** mô tả */
  description?: string;
  /** có/khôngnhạy cảm(hiển thị/xuất) */
  sensitive?: boolean;
  /** có/không */
  required?: boolean;
  /** mặc định */
  default?: JsonValue;
  /** phạm vi( persistent, persistent thông qua $ tiền tốphán đoán) */
  scope?: Exclude<VariableScope, 'persistent'>;
}

/**
 * lưu trữ lâu dàibiếnghi
 * @description lưu trữ IndexedDB tronglưu trữ lâu dàibiến
 */
export interface PersistentVarRecord {
  /** biến( $ ) */
  key: PersistentVariableName;
  /** biến */
  value: JsonValue;
  /** cuối cùngcập nhậtthời gian */
  updatedAt: UnixMillis;
  /** phiên bản(tăng dần, dùng cho LWW gỡ lỗi) */
  version: number;
}

/**
 * phán đoánbiếncó phải làlưu trữ lâu dàibiến
 */
export function isPersistentVariable(name: string): name is PersistentVariableName {
  return name.startsWith('$');
}

/**
 * phân tích cú phápbiếnchuỗi
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

  // mặc định run phạm vi
  return {
    scope: 'run',
    name,
    path: path.length > 0 ? path : undefined,
  };
}
