/**
 * DOM Path - DOM đường dẫntính toánnoiDungTiengVietđịnh vị
 *
 * DOM đường dẫnnoiDungTiengVietphần tửnoiDungTiengViet DOM noiDungTiengViettrongchỉ mụcđường dẫn，dùng cho：
 * - phần tửnoiDungTiengViettheo dõi
 * - bộ chọnnoiDungTiengVietkhôi phục
 * - phần tửnoiDungTiengVietxác thực
 */

// =============================================================================
// Types
// =============================================================================

/**
 * DOM đường dẫn：noiDungTiengVietmục tiêuphần tửnoiDungTiengVietphần tửchỉ mụcmảng
 *
 * @example
 * ```
 * [0, 2, 1] biểu thị:
 * root
 *  └─ children[0]
 *      └─ children[2]
 *          └─ children[1]  <- mục tiêuphần tử
 * ```
 */
export type DomPath = number[];

// =============================================================================
// Core Functions
// =============================================================================

/**
 * tính toánphần tửnoiDungTiengViet DOM noiDungTiengViettrongđường dẫn
 *
 * noiDungTiengVietmục tiêuphần tửnoiDungTiengVietnút（Document noiDungTiengViet ShadowRoot），
 * ghinoiDungTiengVietphần tử children trongchỉ mục。
 *
 * @example
 * ```ts
 * const path = computeDomPath(button);
 * // => [0, 2, 1] - noiDungTiengViet body/shadowRoot bắt đầunoiDungTiengVietđường dẫn
 * ```
 */
export function computeDomPath(element: Element): DomPath {
  const path: DomPath = [];
  let current: Element | null = element;

  while (current) {
    const parent: Element | null = current.parentElement;

    if (parent) {
      // noiDungTiengVietphần tử
      const siblings = Array.from(parent.children);
      const index = siblings.indexOf(current);
      if (index >= 0) {
        path.unshift(index);
      }
      current = parent;
      continue;
    }

    // kiểm tracó/khôngnoiDungTiengViet ShadowRoot noiDungTiengViet Document noiDungTiengViettrực tiếpnoiDungTiengVietphần tử
    const parentNode = current.parentNode;
    if (parentNode instanceof ShadowRoot || parentNode instanceof Document) {
      const children = Array.from(parentNode.children);
      const index = children.indexOf(current);
      if (index >= 0) {
        path.unshift(index);
      }
    }

    // noiDungTiengVietnút，dừngnoiDungTiengViet
    break;
  }

  return path;
}

/**
 * dựa trên DOM đường dẫnđịnh vịphần tử
 *
 * @param root - truy vấnnoiDungTiengVietnút（Document noiDungTiengViet ShadowRoot）
 * @param path - DOM đường dẫn
 * @returns noiDungTiengVietphần tử，nếuđường dẫnkhông hợp lệnoiDungTiengViettrả về null
 *
 * @example
 * ```ts
 * const element = locateByDomPath(document, [0, 2, 1]);
 * // => trả về body > children[0] > children[2] > children[1]
 * ```
 */
export function locateByDomPath(root: Document | ShadowRoot, path: DomPath): Element | null {
  if (path.length === 0) {
    return null;
  }

  let current: Element | null = root.children[path[0]] ?? null;

  for (let i = 1; i < path.length && current; i++) {
    const index = path[i];
    current = current.children[index] ?? null;
  }

  return current;
}

/**
 * noiDungTiengViethai DOM đường dẫn
 *
 * @returns bao gồmcó/khôngnoiDungTiengVietcông khaitiền tốđộ dàinoiDungTiengVietkết quả
 *
 * @example
 * ```ts
 * const result = compareDomPaths([0, 2, 1], [0, 2, 3]);
 * // => { same: false, commonPrefixLength: 2 }
 * ```
 */
export function compareDomPaths(
  a: DomPath,
  b: DomPath,
): { same: boolean; commonPrefixLength: number } {
  const minLen = Math.min(a.length, b.length);
  let commonPrefixLength = 0;

  for (let i = 0; i < minLen; i++) {
    if (a[i] === b[i]) {
      commonPrefixLength++;
    } else {
      break;
    }
  }

  const same = a.length === b.length && commonPrefixLength === a.length;

  return { same, commonPrefixLength };
}

/**
 * kiểm trađường dẫn A có/khôngnoiDungTiengVietđường dẫn B noiDungTiengViettổ tiên
 *
 * @example
 * ```ts
 * isAncestorPath([0, 2], [0, 2, 1]); // true
 * isAncestorPath([0, 2, 1], [0, 2]); // false
 * ```
 */
export function isAncestorPath(ancestor: DomPath, descendant: DomPath): boolean {
  if (ancestor.length >= descendant.length) {
    return false;
  }

  for (let i = 0; i < ancestor.length; i++) {
    if (ancestor[i] !== descendant[i]) {
      return false;
    }
  }

  return true;
}

/**
 * lấynoiDungTiengViettổ tiênđường dẫnnoiDungTiengVietđường dẫnnoiDungTiengVietđường dẫn
 *
 * @example
 * ```ts
 * getRelativePath([0, 2], [0, 2, 1, 3]); // [1, 3]
 * ```
 */
export function getRelativePath(ancestor: DomPath, descendant: DomPath): DomPath | null {
  if (!isAncestorPath(ancestor, descendant)) {
    return null;
  }

  return descendant.slice(ancestor.length);
}
