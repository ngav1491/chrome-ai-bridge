/**
 * @fileoverview tiện íchkiểuđịnh nghĩa
 * @description định nghĩa Record-Replay V3 trongnútnoiDungTiengViettriggertiện íchgiao diện
 */

import { z } from 'zod';

import type { JsonObject, JsonValue } from '../../domain/json';
import type { FlowId, NodeId, RunId, TriggerId } from '../../domain/ids';
import type { NodeKind } from '../../domain/flow';
import type { RRError } from '../../domain/errors';
import type { NodePolicy } from '../../domain/policy';
import type { FlowV3, NodeV3 } from '../../domain/flow';
import type { TriggerKind } from '../../domain/triggers';

/**
 * Schema kiểu
 * @description sử dụng Zod noiDungTiengVietcấu hìnhxác thực
 */
export type Schema<T> = z.ZodType<T, z.ZodTypeDef, unknown>;

/**
 * nútthực thingữ cảnh
 * @description noiDungTiengVietnútthực thinoiDungTiengVietchạynoiDungTiengVietngữ cảnh
 */
export interface NodeExecutionContext {
  /** Run ID */
  runId: RunId;
  /** Flow định nghĩa（snapshot） */
  flow: FlowV3;
  /** hiện tạinút ID */
  nodeId: NodeId;

  /** noiDungTiengViet Tab ID（noiDungTiengViet Run độc quyền） */
  tabId: number;
  /** Frame ID（mặc định 0 noiDungTiengViet） */
  frameId?: number;

  /** hiện tạibiếnnoiDungTiengViet */
  vars: Record<string, JsonValue>;

  /**
   * nhật kýghi
   */
  log: (level: 'debug' | 'info' | 'warn' | 'error', message: string, data?: JsonValue) => void;

  /**
   * noiDungTiengViet
   * @description dùng chođiều kiệnnhánhnút
   */
  chooseNext: (label: string) => { kind: 'edgeLabel'; label: string };

  /**
   * artifactthao tác
   */
  artifacts: {
    /** noiDungTiengViethiện tạitrangảnh chụp màn hình */
    screenshot: () => Promise<{ ok: true; base64: string } | { ok: false; error: RRError }>;
  };

  /**
   * lưu trữ lâu dàibiếnthao tác
   */
  persistent: {
    /** lấylưu trữ lâu dàibiến */
    get: (name: `$${string}`) => Promise<JsonValue | undefined>;
    /** cài đặtlưu trữ lâu dàibiến */
    set: (name: `$${string}`, value: JsonValue) => Promise<void>;
    /** xóalưu trữ lâu dàibiến */
    delete: (name: `$${string}`) => Promise<void>;
  };
}

/**
 * biếnnoiDungTiengVietthao tác
 */
export interface VarsPatchOp {
  op: 'set' | 'delete';
  name: string;
  value?: JsonValue;
}

/**
 * nútthực thikết quả
 */
export type NodeExecutionResult =
  | {
      status: 'succeeded';
      /** noiDungTiengVietthực thinoiDungTiengViet */
      next?: { kind: 'edgeLabel'; label: string } | { kind: 'end' };
      /** đầu rakết quả */
      outputs?: JsonObject;
      /** biếnnoiDungTiengViet */
      varsPatch?: VarsPatchOp[];
    }
  | { status: 'failed'; error: RRError };

/**
 * nútđịnh nghĩa
 * @description định nghĩanoiDungTiengVietnútkiểunoiDungTiengVietthực thilogic
 */
export interface NodeDefinition<
  TKind extends NodeKind = NodeKind,
  TConfig extends JsonObject = JsonObject,
> {
  /** nútkiểuđịnh danh */
  kind: TKind;
  /** cấu hìnhxác thực Schema */
  schema: Schema<TConfig>;
  /** mặc địnhchiến lược */
  defaultPolicy?: NodePolicy;
  /**
   * thực thinút
   * @param ctx thực thingữ cảnh
   * @param node nútđịnh nghĩa（noiDungTiengVietcấu hình）
   */
  execute(
    ctx: NodeExecutionContext,
    node: NodeV3 & { kind: TKind; config: TConfig },
  ): Promise<NodeExecutionResult>;
}

/**
 * triggercài đặtngữ cảnh
 */
export interface TriggerInstallContext<
  TKind extends TriggerKind = TriggerKind,
  TConfig extends JsonObject = JsonObject,
> {
  /** trigger ID */
  triggerId: TriggerId;
  /** kiểu trigger */
  kind: TKind;
  /** có/khôngbật */
  enabled: boolean;
  /** liên quan Flow ID */
  flowId: FlowId;
  /** triggercấu hình */
  config: TConfig;
  /** truyền cho Flow noiDungTiengViettham số */
  args?: JsonObject;
}

/**
 * triggerđịnh nghĩa
 * @description định nghĩanoiDungTiengVietkiểu triggernoiDungTiengVietcài đặtnoiDungTiengVietgỡ cài đặtlogic
 */
export interface TriggerDefinition<
  TKind extends TriggerKind = TriggerKind,
  TConfig extends JsonObject = JsonObject,
> {
  /** kiểu triggerđịnh danh */
  kind: TKind;
  /** cấu hìnhxác thực Schema */
  schema: Schema<TConfig>;
  /** cài đặttrigger */
  install(ctx: TriggerInstallContext<TKind, TConfig>): Promise<void> | void;
  /** gỡ cài đặttrigger */
  uninstall(ctx: TriggerInstallContext<TKind, TConfig>): Promise<void> | void;
}

/**
 * tiện íchđăng kýngữ cảnh
 */
export interface PluginRegistrationContext {
  /** đăng kýnútđịnh nghĩa */
  registerNode(def: NodeDefinition): void;
  /** đăng kýtriggerđịnh nghĩa */
  registerTrigger(def: TriggerDefinition): void;
}

/**
 * tiện íchgiao diện
 * @description Record-Replay tiện íchnoiDungTiengVietgiao diện
 */
export interface RRPlugin {
  /** tiện íchtên */
  name: string;
  /** đăng kýtiện íchnoiDungTiengViet */
  register(ctx: PluginRegistrationContext): void;
}
