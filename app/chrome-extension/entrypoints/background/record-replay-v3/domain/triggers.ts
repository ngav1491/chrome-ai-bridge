/**
 * @fileoverview kiểu triggerđịnh nghĩa
 * @description định nghĩa Record-Replay V3 trongtriggerquy tắc
 */

import type { JsonObject, UnixMillis } from './json';
import type { FlowId, TriggerId } from './ids';

/** kiểu trigger */
export type TriggerKind =
  | 'manual'
  | 'url'
  | 'cron'
  | 'interval'
  | 'once'
  | 'command'
  | 'contextMenu'
  | 'dom';

/**
 * triggercơ sởgiao diện
 */
export interface TriggerSpecBase {
  /** trigger ID */
  id: TriggerId;
  /** kiểu trigger */
  kind: TriggerKind;
  /** có/khôngbật */
  enabled: boolean;
  /** liên quan Flow ID */
  flowId: FlowId;
  /** truyền cho Flow noiDungTiengViettham số */
  args?: JsonObject;
}

/**
 * URL khớpquy tắc
 */
export interface UrlMatchRule {
  kind: 'url' | 'domain' | 'path';
  value: string;
}

/**
 * triggerquy tắcnoiDungTiengVietkiểu
 */
export type TriggerSpec =
  // thủ côngkích hoạt
  | (TriggerSpecBase & { kind: 'manual' })

  // URL kích hoạt
  | (TriggerSpecBase & {
      kind: 'url';
      match: UrlMatchRule[];
    })

  // Cron định thờikích hoạt
  | (TriggerSpecBase & {
      kind: 'cron';
      cron: string;
      timezone?: string;
    })

  // Interval định thờikích hoạt（cố địnhkhoảng cáchlặp lại）
  | (TriggerSpecBase & {
      kind: 'interval';
      /** khoảng cáchphútnoiDungTiengViet，noiDungTiengViet 1 */
      periodMinutes: number;
    })

  // Once định thờikích hoạt（chỉ địnhthời giankích hoạtmột lầnnoiDungTiengViettự độngvô hiệu hóa）
  | (TriggerSpecBase & {
      kind: 'once';
      /** kích hoạtthời giannoiDungTiengViet (Unix milliseconds) */
      whenMs: UnixMillis;
    })

  // phím tắtkích hoạt
  | (TriggerSpecBase & {
      kind: 'command';
      commandKey: string;
    })

  // menu chuột phảikích hoạt
  | (TriggerSpecBase & {
      kind: 'contextMenu';
      title: string;
      contexts?: ReadonlyArray<string>;
    })

  // DOM phần tửnoiDungTiengVietkích hoạt
  | (TriggerSpecBase & {
      kind: 'dom';
      selector: string;
      appear?: boolean;
      once?: boolean;
      debounceMs?: UnixMillis;
    });

/**
 * triggerkích hoạtngữ cảnh
 * @description mô tảtriggernoiDungTiengVietkích hoạtnoiDungTiengVietngữ cảnhthông tin
 */
export interface TriggerFireContext {
  /** trigger ID */
  triggerId: TriggerId;
  /** kiểu trigger */
  kind: TriggerKind;
  /** kích hoạtthời gian */
  firedAt: UnixMillis;
  /** nguồn Tab ID */
  sourceTabId?: number;
  /** nguồn URL */
  sourceUrl?: string;
}

/**
 * dựa trênkiểu triggerlấykiểunoiDungTiengViettriggerquy tắc
 */
export type TriggerSpecByKind<K extends TriggerKind> = Extract<TriggerSpec, { kind: K }>;

/**
 * phán đoántriggercó/khôngbật
 */
export function isTriggerEnabled(trigger: TriggerSpec): boolean {
  return trigger.enabled;
}

/**
 * tạotriggerkích hoạtngữ cảnh
 */
export function createTriggerFireContext(
  trigger: TriggerSpec,
  options?: { sourceTabId?: number; sourceUrl?: string },
): TriggerFireContext {
  return {
    triggerId: trigger.id,
    kind: trigger.kind,
    firedAt: Date.now(),
    sourceTabId: options?.sourceTabId,
    sourceUrl: options?.sourceUrl,
  };
}
