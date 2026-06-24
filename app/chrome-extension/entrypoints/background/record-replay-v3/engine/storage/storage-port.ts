/**
 * @fileoverview StoragePort giao diệnđịnh nghĩa
 * @description định nghĩa Storage noiDungTiengVietgiao diện，dùng chophụ thuộcnoiDungTiengViet
 */

import type { FlowId, RunId, TriggerId } from '../../domain/ids';
import type { FlowV3 } from '../../domain/flow';
import type { RunEvent, RunEventInput, RunRecordV3 } from '../../domain/events';
import type { PersistentVarRecord, PersistentVariableName } from '../../domain/variables';
import type { TriggerSpec } from '../../domain/triggers';
import type { RunQueue } from '../queue/queue';

/**
 * FlowsStore giao diện
 */
export interface FlowsStore {
  /** liệt kêtất cả Flow */
  list(): Promise<FlowV3[]>;
  /** lấyđơn lẻ Flow */
  get(id: FlowId): Promise<FlowV3 | null>;
  /** lưu Flow */
  save(flow: FlowV3): Promise<void>;
  /** xóa Flow */
  delete(id: FlowId): Promise<void>;
}

/**
 * RunsStore giao diện
 */
export interface RunsStore {
  /** liệt kêtất cả Run ghi */
  list(): Promise<RunRecordV3[]>;
  /** lấyđơn lẻ Run ghi */
  get(id: RunId): Promise<RunRecordV3 | null>;
  /** lưu Run ghi */
  save(record: RunRecordV3): Promise<void>;
  /** noiDungTiengVietcập nhật Run ghi */
  patch(id: RunId, patch: Partial<RunRecordV3>): Promise<void>;
}

/**
 * EventsStore giao diện
 * @description seq noiDungTiengVietbắt buộcnoiDungTiengViet append() bên trongnoiDungTiengViethoàn tất
 */
export interface EventsStore {
  /**
   * noiDungTiengVietsự kiệnnoiDungTiengViet seq
   * @description noiDungTiengVietđơn lẻnoiDungTiengViet：đọc RunRecordV3.nextSeq -> ghisự kiện -> tăng dần nextSeq
   * @param event sự kiệnđầu vào（noiDungTiengViet seq）
   * @returns đầy đủsự kiện（noiDungTiengViet seq noiDungTiengViet ts）
   */
  append(event: RunEventInput): Promise<RunEvent>;

  /**
   * liệt kêsự kiện
   * @param runId Run ID
   * @param opts truy vấntùy chọn
   */
  list(runId: RunId, opts?: { fromSeq?: number; limit?: number }): Promise<RunEvent[]>;
}

/**
 * PersistentVarsStore giao diện
 */
export interface PersistentVarsStore {
  /** lấylưu trữ lâu dàibiến */
  get(key: PersistentVariableName): Promise<PersistentVarRecord | undefined>;
  /** cài đặtlưu trữ lâu dàibiến */
  set(
    key: PersistentVariableName,
    value: PersistentVarRecord['value'],
  ): Promise<PersistentVarRecord>;
  /** xóalưu trữ lâu dàibiến */
  delete(key: PersistentVariableName): Promise<void>;
  /** liệt kêlưu trữ lâu dàibiến */
  list(prefix?: PersistentVariableName): Promise<PersistentVarRecord[]>;
}

/**
 * TriggersStore giao diện
 */
export interface TriggersStore {
  /** liệt kêtất cảtrigger */
  list(): Promise<TriggerSpec[]>;
  /** lấyđơn lẻtrigger */
  get(id: TriggerId): Promise<TriggerSpec | null>;
  /** lưutrigger */
  save(spec: TriggerSpec): Promise<void>;
  /** xóatrigger */
  delete(id: TriggerId): Promise<void>;
}

/**
 * StoragePort giao diện
 * @description noiDungTiengViettất cảlưu trữgiao diện，dùng chophụ thuộcnoiDungTiengViet
 */
export interface StoragePort {
  /** Flows lưu trữ */
  flows: FlowsStore;
  /** Runs lưu trữ */
  runs: RunsStore;
  /** Events lưu trữ */
  events: EventsStore;
  /** Queue lưu trữ */
  queue: RunQueue;
  /** lưu trữ lâu dàibiếnlưu trữ */
  persistentVars: PersistentVarsStore;
  /** triggerlưu trữ */
  triggers: TriggersStore;
}

/**
 * tạo NotImplemented noiDungTiengViet Store
 * @description tránh Proxy tạo 'then' noiDungTiengViet thenable hành vi
 */
function createNotImplementedStore<T extends object>(name: string): T {
  const target = {} as T;
  return new Proxy(target, {
    get(_, prop) {
      // Avoid thenable behavior by returning undefined for 'then'
      if (prop === 'then') {
        return undefined;
      }
      return async () => {
        throw new Error(`${name}.${String(prop)} not implemented`);
      };
    },
  });
}

/**
 * tạo NotImplemented noiDungTiengViet StoragePort
 * @description Phase 0 giữ chỗtriển khai
 */
export function createNotImplementedStoragePort(): StoragePort {
  return {
    flows: createNotImplementedStore<FlowsStore>('FlowsStore'),
    runs: createNotImplementedStore<RunsStore>('RunsStore'),
    events: createNotImplementedStore<EventsStore>('EventsStore'),
    queue: createNotImplementedStore<RunQueue>('RunQueue'),
    persistentVars: createNotImplementedStore<PersistentVarsStore>('PersistentVarsStore'),
    triggers: createNotImplementedStore<TriggersStore>('TriggersStore'),
  };
}
