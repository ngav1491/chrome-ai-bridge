import type { NodeBase } from '@/entrypoints/background/record-replay/types';
import { STEP_TYPES } from 'chrome-mcp-shared';

export function validateNode(n: NodeBase): string[] {
  const errs: string[] = [];
  const c: any = n.config || {};

  switch (n.type) {
    case STEP_TYPES.CLICK:
    case STEP_TYPES.DBLCLICK:
    case 'fill': {
      const hasCandidate = !!c?.target?.candidates?.length;
      if (!hasCandidate) errs.push('thiếumục tiêubộ chọnứng viên');
      if (n.type === 'fill' && (!('value' in c) || c.value === undefined))
        errs.push('thiếuđầu vào');
      break;
    }
    case STEP_TYPES.WAIT: {
      if (!c?.condition) errs.push('thiếuchờđiều kiện');
      break;
    }
    case STEP_TYPES.ASSERT: {
      if (!c?.assert) errs.push('thiếukhẳng địnhđiều kiện');
      break;
    }
    case STEP_TYPES.NAVIGATE: {
      if (!c?.url) errs.push('thiếu URL');
      break;
    }
    case STEP_TYPES.HTTP: {
      if (!c?.url) errs.push('HTTP: thiếu URL');
      if (c?.assign && typeof c.assign === 'object') {
        const pathRe = /^[A-Za-z0-9_]+(?:\.[A-Za-z0-9_]+|\[\d+\])*$/;
        for (const v of Object.values(c.assign)) {
          const s = String(v);
          if (!pathRe.test(s)) errs.push(`Assign: đường dẫn ${s}`);
        }
      }
      break;
    }
    case STEP_TYPES.HANDLE_DOWNLOAD: {
      // filenameContains tùy chọn
      break;
    }
    case STEP_TYPES.EXTRACT: {
      if (!c?.saveAs) errs.push('Extract: cần điềnlưubiến');
      if (!c?.selector && !c?.js) errs.push('Extract: cần cung cấp selector  js');
      break;
    }
    case STEP_TYPES.SWITCH_TAB: {
      if (!c?.tabId && !c?.urlContains && !c?.titleContains)
        errs.push('SwitchTab: cần cung cấp tabId  URL/tiêu đềbao gồm');
      break;
    }
    case STEP_TYPES.SCREENSHOT: {
      // selector (/), bắt buộc
      break;
    }
    case STEP_TYPES.TRIGGER_EVENT: {
      const hasCandidate = !!c?.target?.candidates?.length;
      if (!hasCandidate) errs.push('thiếumục tiêubộ chọnứng viên');
      if (!String(c?.event || '').trim()) errs.push('cần cung cấpsự kiệnkiểu');
      break;
    }
    case STEP_TYPES.IF: {
      const arr = Array.isArray(c?.branches) ? c.branches : [];
      if (arr.length === 0) errs.push('thêmđiều kiệnnhánh');
      for (let i = 0; i < arr.length; i++) {
        if (!String(arr[i]?.expr || '').trim())
          errs.push(`nhánh${i + 1}: cần điềnđiều kiệnbiểu thức`);
      }
      break;
    }
    case STEP_TYPES.SET_ATTRIBUTE: {
      const hasCandidate = !!c?.target?.candidates?.length;
      if (!hasCandidate) errs.push('thiếumục tiêubộ chọnứng viên');
      if (!String(c?.name || '').trim()) errs.push('cần cung cấpthuộc tính');
      break;
    }
    case STEP_TYPES.LOOP_ELEMENTS: {
      if (!String(c?.selector || '').trim()) errs.push('cần cung cấpphần tửbộ chọn');
      if (!String(c?.subflowId || '').trim()) errs.push('cần cung cấp ID');
      break;
    }
    case STEP_TYPES.SWITCH_FRAME: {
      // Both index/urlContains optional; empty means switch back to top frame
      break;
    }
    case STEP_TYPES.EXECUTE_FLOW: {
      if (!String(c?.flowId || '').trim()) errs.push('thực thiquy trình làm việc');
      break;
    }
    case STEP_TYPES.CLOSE_TAB: {
      // (đónghiện tạinhãn), bắt buộc
      break;
    }
    case STEP_TYPES.SCRIPT: {
      // cấu hình saveAs/assign,  code
      const hasAssign = c?.assign && Object.keys(c.assign).length > 0;
      if ((c?.saveAs || hasAssign) && !String(c?.code || '').trim())
        errs.push('Script: cấu hìnhlưu/ánh xạthiếu');
      if (hasAssign) {
        const pathRe = /^[A-Za-z0-9_]+(?:\.[A-Za-z0-9_]+|\[\d+\])*$/;
        for (const v of Object.values(c.assign || {})) {
          const s = String(v);
          if (!pathRe.test(s)) errs.push(`Assign: đường dẫn ${s}`);
        }
      }
      break;
    }
  }
  return errs;
}

export function validateFlow(nodes: NodeBase[]): {
  totalErrors: number;
  nodeErrors: Record<string, string[]>;
} {
  const nodeErrors: Record<string, string[]> = {};
  let totalErrors = 0;
  for (const n of nodes) {
    const e = validateNode(n);
    if (e.length) {
      nodeErrors[n.id] = e;
      totalErrors += e.length;
    }
  }
  return { totalErrors, nodeErrors };
}
