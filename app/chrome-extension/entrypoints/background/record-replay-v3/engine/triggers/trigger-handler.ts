/**
 * @fileoverview triggerxử lýgiao diệnđịnh nghĩa
 * @description định nghĩatriggergiao diện
 */

import type { TriggerSpec, TriggerKind } from '../../domain/triggers';

/**
 * triggerxử lýgiao diện
 * @description kiểu triggercầntriển khaigiao diện
 */
export interface TriggerHandler<K extends TriggerKind = TriggerKind> {
  /** kiểu trigger */
  readonly kind: K;

  /**
   * cài đặttrigger
   * @description đăng ký chrome API lắng nghe
   * @param trigger triggerquy tắc
   */
  install(trigger: Extract<TriggerSpec, { kind: K }>): Promise<void>;

  /**
   * gỡ cài đặttrigger
   * @description gỡ bỏ chrome API lắng nghe
   * @param triggerId trigger ID
   */
  uninstall(triggerId: string): Promise<void>;

  /**
   * gỡ cài đặttất cảtrigger
   * @description dọn dẹptất cảkiểutrigger
   */
  uninstallAll(): Promise<void>;

  /**
   * lấycài đặttrigger ID danh sách
   */
  getInstalledIds(): string[];
}

/**
 * triggerkích hoạtcallback
 * @description TriggerManager  Handler callback
 */
export interface TriggerFireCallback {
  /**
   * triggerkích hoạtgọi
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
 * triggerxử lýfactory
 */
export type TriggerHandlerFactory<K extends TriggerKind> = (
  fireCallback: TriggerFireCallback,
) => TriggerHandler<K>;
