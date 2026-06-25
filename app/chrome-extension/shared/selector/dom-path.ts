/**
 * DOM Path - DOM đường dẫntính toánđịnh vị
 *
 * DOM đường dẫnphần tử DOM trongchỉ mụcđường dẫn, dùng cho:
 * - phần tửtheo dõi
 * - bộ chọnkhôi phục
 * - phần tửxác thực
 */

// =============================================================================
// Types
// =============================================================================

/**
 * DOM đường dẫn: mục tiêuphần tửphần tửchỉ mụcmảng
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
 * tính toánphần tử DOM trongđường dẫn
 *
 * mục tiêuphần tửnút(Document  ShadowRoot),
 * ghiphần tử children trongchỉ mục.
 *
 * @example
 * ```ts
 * const path = computeDomPath(button);
 * // => [0, 2, 1] -  body/shadowRoot bắt đầuđường dẫn
 * ```
 */
export function computeDomPath(element: Element): DomPath {
  const path: DomPath = [];
  let current: Element | null = element;

  while (current) {
    const parent: Element | null = current.parentElement;

    if (parent) {
      // phần tử
      const siblings = Array.from(parent.children);
      const index = siblings.indexOf(current);
      if (index >= 0) {
        path.unshift(index);
      }
      current = parent;
      continue;
    }

    // kiểm tracó/không ShadowRoot  Document trực tiếpphần tử
    const parentNode = current.parentNode;
    if (parentNode instanceof ShadowRoot || parentNode instanceof Document) {
      const children = Array.from(parentNode.children);
      const index = children.indexOf(current);
      if (index >= 0) {
        path.unshift(index);
      }
    }

    // nút, dừng
    break;
  }

  return path;
}

/**
 * dựa trên DOM đường dẫnđịnh vịphần tử
 *
 * @param root - truy vấnnút(Document  ShadowRoot)
 * @param path - DOM đường dẫn
 * @returns phần tử, nếuđường dẫnkhông hợp lệtrả về null
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
 * hai DOM đường dẫn
 *
 * @returns bao gồmcó/khôngcông khaitiền tốđộ dàikết quả
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
 * kiểm trađường dẫn A có/khôngđường dẫn B tổ tiên
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
 * lấytổ tiênđường dẫnđường dẫnđường dẫn
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
