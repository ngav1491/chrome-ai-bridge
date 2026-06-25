/**
 * CSS Path Strategy -  DOM đường dẫnbộ chọnchiến lược
 * sử dụng nth-of-type tạođầy đủ CSS đường dẫn
 */

import type { SelectorCandidate, SelectorStrategy } from '../types';

export const cssPathStrategy: SelectorStrategy = {
  id: 'css-path',
  generate(ctx) {
    if (!ctx.options.includeCssPath) return [];

    const { element } = ctx;

    const segments: string[] = [];
    let current: Element | null = element;

    while (current) {
      const tag = current.tagName?.toLowerCase?.() ?? '';
      if (!tag) break;

      let segment = tag;

      const parent = current.parentElement;
      if (parent) {
        const siblings = Array.from(parent.children).filter((c) => c.tagName === current!.tagName);
        if (siblings.length > 1) {
          const index = siblings.indexOf(current) + 1;
          if (index > 0) segment += `:nth-of-type(${index})`;
        }
      }

      segments.unshift(segment);

      if (tag === 'body') break;
      current = parent;
    }

    const selector = segments.length ? segments.join(' > ') : 'body';

    const out: SelectorCandidate[] = [
      { type: 'css', value: selector, source: 'generated', strategy: 'css-path' },
    ];
    return out;
  },
};
