/**
 * @fileoverview tiện íchđăng ký
 * @description quản lýnúttriggertiện íchđăng kýtruy vấn
 */

import type { NodeKind } from '../../domain/flow';
import type { TriggerKind } from '../../domain/triggers';
import { RR_ERROR_CODES, createRRError } from '../../domain/errors';
import type {
  NodeDefinition,
  TriggerDefinition,
  PluginRegistrationContext,
  RRPlugin,
} from './types';

/**
 * tiện íchđăng ký
 * @description schema, quản lýtất cảđăng kýnúttrigger
 */
export class PluginRegistry implements PluginRegistrationContext {
  private nodes = new Map<NodeKind, NodeDefinition>();
  private triggers = new Map<TriggerKind, TriggerDefinition>();

  /**
   * đăng kýnútđịnh nghĩa
   * @description nếutồn tạinút, bao phủ
   */
  registerNode(def: NodeDefinition): void {
    this.nodes.set(def.kind, def);
  }

  /**
   * đăng kýtriggerđịnh nghĩa
   * @description nếutồn tạitrigger, bao phủ
   */
  registerTrigger(def: TriggerDefinition): void {
    this.triggers.set(def.kind, def);
  }

  /**
   * lấynútđịnh nghĩa
   * @returns nútđịnh nghĩa undefined
   */
  getNode(kind: NodeKind): NodeDefinition | undefined {
    return this.nodes.get(kind);
  }

  /**
   * lấynútđịnh nghĩa(bắt buộctồn tại)
   * @throws RRError nếunútđăng ký
   */
  getNodeOrThrow(kind: NodeKind): NodeDefinition {
    const def = this.nodes.get(kind);
    if (!def) {
      throw createRRError(RR_ERROR_CODES.UNSUPPORTED_NODE, `Node kind "${kind}" is not registered`);
    }
    return def;
  }

  /**
   * lấytriggerđịnh nghĩa
   * @returns triggerđịnh nghĩa undefined
   */
  getTrigger(kind: TriggerKind): TriggerDefinition | undefined {
    return this.triggers.get(kind);
  }

  /**
   * lấytriggerđịnh nghĩa(bắt buộctồn tại)
   * @throws RRError nếutriggerđăng ký
   */
  getTriggerOrThrow(kind: TriggerKind): TriggerDefinition {
    const def = this.triggers.get(kind);
    if (!def) {
      throw createRRError(
        RR_ERROR_CODES.UNSUPPORTED_NODE,
        `Trigger kind "${kind}" is not registered`,
      );
    }
    return def;
  }

  /**
   * kiểm tranútcó/khôngđăng ký
   */
  hasNode(kind: NodeKind): boolean {
    return this.nodes.has(kind);
  }

  /**
   * kiểm tratriggercó/khôngđăng ký
   */
  hasTrigger(kind: TriggerKind): boolean {
    return this.triggers.has(kind);
  }

  /**
   * lấytất cảđăng kýnútkiểu
   */
  listNodeKinds(): NodeKind[] {
    return Array.from(this.nodes.keys());
  }

  /**
   * lấytất cảđăng kýkiểu trigger
   */
  listTriggerKinds(): TriggerKind[] {
    return Array.from(this.triggers.keys());
  }

  /**
   * đăng kýtiện ích
   * @description gọitiện ích register phương thức
   */
  registerPlugin(plugin: RRPlugin): void {
    plugin.register(this);
  }

  /**
   * hàng loạtđăng kýtiện ích
   */
  registerPlugins(plugins: RRPlugin[]): void {
    for (const plugin of plugins) {
      this.registerPlugin(plugin);
    }
  }

  /**
   * làm trốngtất cảđăng ký
   * @description chínhdùng chokiểm thử
   */
  clear(): void {
    this.nodes.clear();
    this.triggers.clear();
  }
}

/** toàn cụctiện íchđăng kýthể hiện */
let globalRegistry: PluginRegistry | null = null;

/**
 * lấytoàn cụctiện íchđăng ký
 */
export function getPluginRegistry(): PluginRegistry {
  if (!globalRegistry) {
    globalRegistry = new PluginRegistry();
  }
  return globalRegistry;
}

/**
 * toàn cụctiện íchđăng ký
 * @description chínhdùng chokiểm thử
 */
export function resetPluginRegistry(): void {
  globalRegistry = null;
}
