/**
 * @fileoverview vào hàng đợidịch vụ
 * @description
 *  Run vào hàng đợilogic,  RPC Server  TriggerManager .
 *
 * lý do thiết kế:
 * -  RpcServer vào hàng đợilogicdịch vụ
 * - tránh RPC  TriggerManager hành vi
 * - tham sốxác thực, Run tạo, hàng đợivào hàng đợi, sự kiệnphát hànhquy trình
 */

import type { JsonObject, UnixMillis } from '../../domain/json';
import type { FlowId, NodeId, RunId } from '../../domain/ids';
import type { TriggerFireContext } from '../../domain/triggers';
import { RUN_SCHEMA_VERSION, type RunRecordV3 } from '../../domain/events';
import type { StoragePort } from '../storage/storage-port';
import type { EventsBus } from '../transport/events-bus';
import type { RunScheduler } from './scheduler';

// ==================== Types ====================

/**
 * vào hàng đợidịch vụphụ thuộc
 */
export interface EnqueueRunDeps {
  /** lưu trữ ( flows/runs/queue) */
  storage: Pick<StoragePort, 'flows' | 'runs' | 'queue'>;
  /** sự kiệnbus */
  events: Pick<EventsBus, 'append'>;
  /** bộ lập lịch (tùy chọn) */
  scheduler?: Pick<RunScheduler, 'kick'>;
  /** RunId trình tạo (dùng để kiểm thử tiêm) */
  generateRunId?: () => RunId;
  /** nguồn thời gian (dùng để kiểm thử tiêm) */
  now?: () => UnixMillis;
}

/**
 * vào hàng đợiyêu cầutham số
 */
export interface EnqueueRunInput {
  /** Flow ID () */
  flowId: FlowId;
  /** bắt đầunút ID (tùy chọn, mặc địnhsử dụng Flow  entryNodeId) */
  startNodeId?: NodeId;
  /** độ ưu tiên (mặc định 0) */
  priority?: number;
  /** số lần thử tối đa (mặc định 1) */
  maxAttempts?: number;
  /** truyền cho Flow tham số */
  args?: JsonObject;
  /** kích hoạtngữ cảnh ( TriggerManager cài đặt) */
  trigger?: TriggerFireContext;
  /** gỡ lỗitùy chọn */
  debug?: {
    breakpoints?: NodeId[];
    pauseOnStart?: boolean;
  };
}

/**
 * vào hàng đợikết quả
 */
export interface EnqueueRunResult {
  /** tạo Run ID */
  runId: RunId;
  /** hàng đợitrong (1-based) */
  position: number;
}

// ==================== Utilities ====================

/**
 * mặc định RunId trình tạo
 */
function defaultGenerateRunId(): RunId {
  return `run_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;
}

/**
 * xác thựctham số
 */
function validateInt(
  value: unknown,
  defaultValue: number,
  fieldName: string,
  opts?: { min?: number; max?: number },
): number {
  if (value === undefined || value === null) {
    return defaultValue;
  }
  if (typeof value !== 'number' || !Number.isFinite(value)) {
    throw new Error(`${fieldName} must be a finite number`);
  }
  const intValue = Math.floor(value);
  if (opts?.min !== undefined && intValue < opts.min) {
    throw new Error(`${fieldName} must be >= ${opts.min}`);
  }
  if (opts?.max !== undefined && intValue > opts.max) {
    throw new Error(`${fieldName} must be <= ${opts.max}`);
  }
  return intValue;
}

/**
 * tính toán Run hàng đợitrong
 * @description lập lịchthứ tự: priority DESC + createdAt ASC
 * @returns 1-based position, or -1 if run not found in queued items
 *
 * Note: Due to race conditions (scheduler may claim the run before this is called),
 * position may be -1. Callers should handle this gracefully.
 */
async function computeQueuePosition(
  storage: Pick<StoragePort, 'queue'>,
  runId: RunId,
): Promise<number> {
  const queueItems = await storage.queue.list('queued');
  queueItems.sort((a, b) => {
    if (a.priority !== b.priority) return b.priority - a.priority;
    return a.createdAt - b.createdAt;
  });
  const index = queueItems.findIndex((item) => item.id === runId);
  // Return -1 if not found (run may have been claimed already)
  return index === -1 ? -1 : index + 1;
}

// ==================== Main Function ====================

/**
 * vào hàng đợithực thi Run
 * @description
 * thực thi:
 * 1. tham sốxác thực
 * 2. xác thực Flow tồn tại
 * 3. tạo RunRecordV3 (status=queued)
 * 4. vào hàng đợi RunQueue
 * 5. phát hành run.queued sự kiện
 * 6. kích hoạtlập lịch (best-effort)
 * 7. tính toánhàng đợi
 */
export async function enqueueRun(
  deps: EnqueueRunDeps,
  input: EnqueueRunInput,
): Promise<EnqueueRunResult> {
  const { flowId } = input;
  if (!flowId) {
    throw new Error('flowId is required');
  }

  const now = deps.now ?? (() => Date.now());
  const generateRunId = deps.generateRunId ?? defaultGenerateRunId;

  // tham sốxác thực
  const priority = validateInt(input.priority, 0, 'priority');
  const maxAttempts = validateInt(input.maxAttempts, 1, 'maxAttempts', { min: 1 });

  // xác thực Flow tồn tại
  const flow = await deps.storage.flows.get(flowId);
  if (!flow) {
    throw new Error(`Flow "${flowId}" not found`);
  }

  // xác thực startNodeId tồn tại Flow
  if (input.startNodeId) {
    const nodeExists = flow.nodes.some((n) => n.id === input.startNodeId);
    if (!nodeExists) {
      throw new Error(`startNodeId "${input.startNodeId}" not found in flow "${flowId}"`);
    }
  }

  const ts = now();
  const runId = generateRunId();

  // 1. tạo RunRecordV3
  const runRecord: RunRecordV3 = {
    schemaVersion: RUN_SCHEMA_VERSION,
    id: runId,
    flowId,
    status: 'queued',
    createdAt: ts,
    updatedAt: ts,
    attempt: 0,
    maxAttempts,
    args: input.args,
    trigger: input.trigger,
    debug: input.debug,
    startNodeId: input.startNodeId,
    nextSeq: 0,
  };
  await deps.storage.runs.save(runRecord);

  // 2. vào hàng đợi
  await deps.storage.queue.enqueue({
    id: runId,
    flowId,
    priority,
    maxAttempts,
    args: input.args,
    trigger: input.trigger,
    debug: input.debug,
  });

  // 3. phát hành run.queued sự kiện
  await deps.events.append({
    runId,
    type: 'run.queued',
    flowId,
  });

  // 4. tính toánhàng đợi ( kick trướctính toán, điều kiện position=-1 )
  const position = await computeQueuePosition(deps.storage, runId);

  // 5. kích hoạtlập lịch (best-effort, trả về)
  if (deps.scheduler) {
    void deps.scheduler.kick();
  }

  return { runId, position };
}
