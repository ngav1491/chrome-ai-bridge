/**
 * @fileoverview triggerxử lýnoiDungTiengVietgiao diệnđịnh nghĩa
 * @description định nghĩanoiDungTiengViettriggernoiDungTiengVietgiao diện
 */

import type { TriggerSpec, TriggerKind } from '../../domain/triggers';

/**
 * triggerxử lýnoiDungTiengVietgiao diện
 * @description noiDungTiengVietkiểu triggercầntriển khainoiDungTiengVietgiao diện
 */
export interface TriggerHandler<K extends TriggerKind = TriggerKind> {
  /** kiểu trigger */
  readonly kind: K;

  /**
   * cài đặttrigger
   * @description đăng ký chrome API lắng nghenoiDungTiengViet
   * @param trigger triggerquy tắc
   */
  install(trigger: Extract<TriggerSpec, { kind: K }>): Promise<void>;

  /**
   * gỡ cài đặttrigger
   * @description gỡ bỏ chrome API lắng nghenoiDungTiengViet
   * @param triggerId trigger ID
   */
  uninstall(triggerId: string): Promise<void>;

  /**
   * gỡ cài đặttất cảtrigger
   * @description dọn dẹptất cảnoiDungTiengVietkiểunoiDungTiengViettrigger
   */
  uninstallAll(): Promise<void>;

  /**
   * lấynoiDungTiengVietcài đặtnoiDungTiengViettrigger ID danh sách
   */
  getInstalledIds(): string[];
}

/**
 * triggerkích hoạtcallback
 * @description TriggerManager noiDungTiengViet Handler noiDungTiengVietcallback
 */
export interface TriggerFireCallback {
  /**
   * triggernoiDungTiengVietkích hoạtnoiDungTiengVietgọi
   * @param triggerId trigger ID
   * @param context kích hoạtngữ cảnh
   */
  onFire(
    triggerId: string,
    context: {
      sourceTabId?: number;
      sourceUrl?: string;
    },
  ): Promise<void>;
}

/**
 * triggerxử lýnoiDungTiengVietfactory
 */
export type TriggerHandlerFactory<K extends TriggerKind> = (
  fireCallback: TriggerFireCallback,
) => TriggerHandler<K>;
