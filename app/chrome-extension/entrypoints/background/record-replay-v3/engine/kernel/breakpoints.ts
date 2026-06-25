/**
 * @fileoverview điểm dừngquản lý
 * @description quản lýgỡ lỗiđiểm dừngthêm, xóaphát hiện
 */

import type { NodeId, RunId } from '../../domain/ids';
import type { Breakpoint, DebuggerState } from '../../domain/debug';

/**
 * điểm dừngquản lý
 * @description quản lýđơn lẻ Run điểm dừng
 */
export class BreakpointManager {
  private breakpoints = new Map<NodeId, Breakpoint>();
  private stepMode: 'none' | 'stepOver' = 'none';

  constructor(initialBreakpoints?: NodeId[]) {
    if (initialBreakpoints) {
      for (const nodeId of initialBreakpoints) {
        this.add(nodeId);
      }
    }
  }

  /**
   * thêmđiểm dừng
   */
  add(nodeId: NodeId): void {
    this.breakpoints.set(nodeId, { nodeId, enabled: true });
  }

  /**
   * xóađiểm dừng
   */
  remove(nodeId: NodeId): void {
    this.breakpoints.delete(nodeId);
  }

  /**
   * cài đặtđiểm dừngdanh sách(tất cảhiện cóđiểm dừng)
   */
  setAll(nodeIds: NodeId[]): void {
    this.breakpoints.clear();
    for (const nodeId of nodeIds) {
      this.add(nodeId);
    }
  }

  /**
   * bậtđiểm dừng
   */
  enable(nodeId: NodeId): void {
    const bp = this.breakpoints.get(nodeId);
    if (bp) {
      bp.enabled = true;
    }
  }

  /**
   * vô hiệu hóađiểm dừng
   */
  disable(nodeId: NodeId): void {
    const bp = this.breakpoints.get(nodeId);
    if (bp) {
      bp.enabled = false;
    }
  }

  /**
   * kiểm tranútcó/khôngbậtđiểm dừng
   */
  hasBreakpoint(nodeId: NodeId): boolean {
    const bp = this.breakpoints.get(nodeId);
    return bp?.enabled ?? false;
  }

  /**
   * kiểm tracó/khôngnúttạm dừng
   * @description điểm dừngmột bướcschema
   */
  shouldPauseAt(nodeId: NodeId): boolean {
    // nếumột bướcschema, tạm dừng
    if (this.stepMode === 'stepOver') {
      return true;
    }
    // kiểm trađiểm dừng
    return this.hasBreakpoint(nodeId);
  }

  /**
   * lấytất cảđiểm dừng
   */
  getAll(): Breakpoint[] {
    return Array.from(this.breakpoints.values());
  }

  /**
   * lấybậtđiểm dừng
   */
  getEnabled(): Breakpoint[] {
    return this.getAll().filter((bp) => bp.enabled);
  }

  /**
   * cài đặtmột bướcschema
   */
  setStepMode(mode: 'none' | 'stepOver'): void {
    this.stepMode = mode;
  }

  /**
   * lấymột bướcschema
   */
  getStepMode(): 'none' | 'stepOver' {
    return this.stepMode;
  }

  /**
   * xóatất cảđiểm dừng
   */
  clear(): void {
    this.breakpoints.clear();
    this.stepMode = 'none';
  }
}

/**
 * điểm dừngquản lýđăng ký
 * @description quản lý Run điểm dừngquản lý
 */
export class BreakpointRegistry {
  private managers = new Map<RunId, BreakpointManager>();

  /**
   * lấytạođiểm dừngquản lý
   */
  getOrCreate(runId: RunId, initialBreakpoints?: NodeId[]): BreakpointManager {
    let manager = this.managers.get(runId);
    if (!manager) {
      manager = new BreakpointManager(initialBreakpoints);
      this.managers.set(runId, manager);
    }
    return manager;
  }

  /**
   * lấyđiểm dừngquản lý
   */
  get(runId: RunId): BreakpointManager | undefined {
    return this.managers.get(runId);
  }

  /**
   * xóađiểm dừngquản lý
   */
  remove(runId: RunId): void {
    this.managers.delete(runId);
  }

  /**
   * làm trốngtất cả
   */
  clear(): void {
    this.managers.clear();
  }
}

/** toàn cụcđiểm dừngđăng ký */
let globalBreakpointRegistry: BreakpointRegistry | null = null;

/**
 * lấytoàn cụcđiểm dừngđăng ký
 */
export function getBreakpointRegistry(): BreakpointRegistry {
  if (!globalBreakpointRegistry) {
    globalBreakpointRegistry = new BreakpointRegistry();
  }
  return globalBreakpointRegistry;
}

/**
 * toàn cụcđiểm dừngđăng ký
 * @description chínhdùng chokiểm thử
 */
export function resetBreakpointRegistry(): void {
  globalBreakpointRegistry = null;
}
