/**
 * @fileoverview Định nghĩa interface StoragePort
 * @description Định nghĩa interface trừu tượng của lớp lưu trữ, dùng cho injection phụ thuộc
 */

import type { FlowId, RunId, TriggerId } from '../../domain/ids';
import type { FlowV3 } from '../../domain/flow';
import type { RunEvent, RunEventInput, RunRecordV3 } from '../../domain/events';
import type { PersistentVarRecord, PersistentVariableName } from '../../domain/variables';
import type { TriggerSpec } from '../../domain/triggers';
import type { RunQueue } from '../queue/queue';

/**
 * Interface FlowsStore
 */
export interface FlowsStore {
  /** Liệt kê tất cả Flow */
  list(): Promise<FlowV3[]>;
  /** Lấy một Flow */
  get(id: FlowId): Promise<FlowV3 | null>;
  /** Lưu Flow */
  save(flow: FlowV3): Promise<void>;
  /** Xóa Flow */
  delete(id: FlowId): Promise<void>;
}

/**
 * Interface RunsStore
 */
export interface RunsStore {
  /** Liệt kê tất cả bản ghi Run */
  list(): Promise<RunRecordV3[]>;
  /** Lấy một bản ghi Run */
  get(id: RunId): Promise<RunRecordV3 | null>;
  /** Lưu bản ghi Run */
  save(record: RunRecordV3): Promise<void>;
  /** Cập nhật một phần bản ghi Run */
  patch(id: RunId, patch: Partial<RunRecordV3>): Promise<void>;
}

/**
 * Interface EventsStore
 * @description việc cấp phát seq phải được thực hiện nguyên tử bên trong append()
 */
export interface EventsStore {
  /**
   * Thêm sự kiện và cấp phát seq nguyên tử
   * @description Trong một transaction duy nhất: đọc RunRecordV3.nextSeq -> ghi sự kiện -> tăng nextSeq
   * @param event đầu vào sự kiện (không chứa seq)
   * @returns sự kiện đầy đủ (chứa seq và ts đã cấp phát)
   */
  append(event: RunEventInput): Promise<RunEvent>;

  /**
   * Liệt kê sự kiện
   * @param runId Run ID
   * @param opts tùy chọn truy vấn
   */
  list(runId: RunId, opts?: { fromSeq?: number; limit?: number }): Promise<RunEvent[]>;
}

/**
 * Interface PersistentVarsStore
 */
export interface PersistentVarsStore {
  /** Lấy biến bền vững */
  get(key: PersistentVariableName): Promise<PersistentVarRecord | undefined>;
  /** Đặt biến bền vững */
  set(
    key: PersistentVariableName,
    value: PersistentVarRecord['value'],
  ): Promise<PersistentVarRecord>;
  /** Xóa biến bền vững */
  delete(key: PersistentVariableName): Promise<void>;
  /** Liệt kê biến bền vững */
  list(prefix?: PersistentVariableName): Promise<PersistentVarRecord[]>;
}

/**
 * Interface TriggersStore
 */
export interface TriggersStore {
  /** Liệt kê tất cả bộ kích hoạt */
  list(): Promise<TriggerSpec[]>;
  /** Lấy một bộ kích hoạt */
  get(id: TriggerId): Promise<TriggerSpec | null>;
  /** Lưu bộ kích hoạt */
  save(spec: TriggerSpec): Promise<void>;
  /** Xóa bộ kích hoạt */
  delete(id: TriggerId): Promise<void>;
}

/**
 * Interface StoragePort
 * @description Tổng hợp tất cả interface lưu trữ, dùng cho injection phụ thuộc
 */
export interface StoragePort {
  /** Lưu trữ Flows */
  flows: FlowsStore;
  /** Lưu trữ Runs */
  runs: RunsStore;
  /** Lưu trữ Events */
  events: EventsStore;
  /** Lưu trữ Queue */
  queue: RunQueue;
  /** Lưu trữ biến bền vững */
  persistentVars: PersistentVarsStore;
  /** Lưu trữ bộ kích hoạt */
  triggers: TriggersStore;
}

/**
 * Tạo Store NotImplemented
 * @description Tránh Proxy tạo 'then' dẫn đến hành vi thenable
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
 * Tạo StoragePort NotImplemented
 * @description triển khai giữ chỗ Phase 0
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
