/**
 * Element Fingerprint - phần tửvân taytạonoiDungTiengVietxác thực
 *
 * vân taydùng chophần tửnoiDungTiengVietkhớpnoiDungTiengVietxác thực，noiDungTiengViet：
 * - bộ chọnkhớpnoiDungTiengVietphần tửnoiDungTiengViet，xác thựccó/khôngnoiDungTiengVietphần tử
 * - HMR noiDungTiengVietphần tửkhôi phục
 * - noiDungTiengViet"noiDungTiengVietbộ chọnnoiDungTiengVietphần tử"noiDungTiengVietkhớp
 */

// =============================================================================
// Constants
// =============================================================================

const FINGERPRINT_TEXT_MAX_LENGTH = 32;
const FINGERPRINT_MAX_CLASSES = 8;
const FINGERPRINT_SEPARATOR = '|';

// =============================================================================
// Types
// =============================================================================

export interface ElementFingerprint {
  tag: string;
  id?: string;
  classes?: string[];
  text?: string;
  raw: string;
}

export interface FingerprintOptions {
  textMaxLength?: number;
  maxClasses?: number;
}

// =============================================================================
// Internal Helpers
// =============================================================================

/**
 * noiDungTiengVietvăn bảnnoiDungTiengViet：noiDungTiengViet
 */
function normalizeText(text: string, maxLength: number): string {
  return text.replace(/\s+/g, ' ').trim().slice(0, maxLength);
}

// =============================================================================
// Core Functions
// =============================================================================

/**
 * noiDungTiengViet DOM phần tửtính toáncấu trúcnoiDungTiengVietvân tay
 *
 * vân tayđịnh dạng: `tag|id=xxx|class=a.b.c|text=xxx`
 *
 * @example
 * ```ts
 * const fp = computeFingerprint(buttonElement);
 * // => "button|id=submit-btn|class=btn.primary|text=Submit"
 * ```
 */
export function computeFingerprint(element: Element, options?: FingerprintOptions): string {
  const textMaxLength = options?.textMaxLength ?? FINGERPRINT_TEXT_MAX_LENGTH;
  const maxClasses = options?.maxClasses ?? FINGERPRINT_MAX_CLASSES;

  const parts: string[] = [];

  // 1. Tag name (bắt buộc)
  const tag = element.tagName?.toLowerCase() ?? 'unknown';
  parts.push(tag);

  // 2. ID (nếutồn tại)
  const id = element.id?.trim();
  if (id) {
    parts.push(`id=${id}`);
  }

  // 3. Class names (noiDungTiengViet maxClasses noiDungTiengViet)
  const classes = Array.from(element.classList).slice(0, maxClasses);
  if (classes.length > 0) {
    parts.push(`class=${classes.join('.')}`);
  }

  // 4. Text content hint (noiDungTiengViet)
  const text = normalizeText(element.textContent ?? '', textMaxLength);
  if (text) {
    parts.push(`text=${text}`);
  }

  return parts.join(FINGERPRINT_SEPARATOR);
}

/**
 * phân tích cú phápvân taychuỗinoiDungTiengVietcấu trúcnoiDungTiengVietđối tượng
 *
 * @example
 * ```ts
 * const fp = parseFingerprint("button|id=submit|class=btn.primary|text=Submit");
 * // => { tag: "button", id: "submit", classes: ["btn", "primary"], text: "Submit", raw: "..." }
 * ```
 */
export function parseFingerprint(fingerprint: string): ElementFingerprint {
  const parts = fingerprint.split(FINGERPRINT_SEPARATOR);
  const result: ElementFingerprint = {
    tag: parts[0] ?? 'unknown',
    raw: fingerprint,
  };

  for (let i = 1; i < parts.length; i++) {
    const part = parts[i];
    if (part.startsWith('id=')) {
      result.id = part.slice(3);
    } else if (part.startsWith('class=')) {
      result.classes = part.slice(6).split('.');
    } else if (part.startsWith('text=')) {
      result.text = part.slice(5);
    }
  }

  return result;
}

/**
 * xác thựcphần tửcó/khôngkhớpnoiDungTiengVietvân tay
 *
 * xác thựcquy tắc：
 * - tag bắt buộcnoiDungTiengVietkhớp
 * - nếulưu trữnoiDungTiengVietvân taynoiDungTiengViet id，hiện tạiphần tửnoiDungTiengViet id bắt buộckhớp
 * - class noiDungTiengViet text noiDungTiengVietbắt buộckhớp（dùng chotính toánnoiDungTiengViet）
 *
 * @example
 * ```ts
 * const stored = computeFingerprint(element);
 * // ... trangthay đổinoiDungTiengViet
 * const stillMatches = verifyFingerprint(element, stored);
 * ```
 */
export function verifyFingerprint(element: Element, fingerprint: string): boolean {
  const stored = parseFingerprint(fingerprint);
  const currentTag = element.tagName?.toLowerCase() ?? 'unknown';

  // Tag bắt buộckhớp
  if (stored.tag !== currentTag) {
    return false;
  }

  // nếulưu trữnoiDungTiengVietvân taynoiDungTiengViet id，hiện tạiphần tửbắt buộcnoiDungTiengViet id
  if (stored.id) {
    const currentId = element.id?.trim();
    if (stored.id !== currentId) {
      return false;
    }
  }

  return true;
}

/**
 * tính toánhaivân taynoiDungTiengViet
 *
 * @returns noiDungTiengViet 0-1，1 biểu thịnoiDungTiengVietkhớp
 *
 * @example
 * ```ts
 * const score = fingerprintSimilarity(fpA, fpB);
 * if (score > 0.8) {
 *   // noiDungTiengViet，noiDungTiengVietphần tử
 * }
 * ```
 */
export function fingerprintSimilarity(a: string, b: string): number {
  const fpA = parseFingerprint(a);
  const fpB = parseFingerprint(b);

  let score = 0;
  let weights = 0;

  // Tag khớp (trọng số 0.4)
  const tagWeight = 0.4;
  weights += tagWeight;
  if (fpA.tag === fpB.tag) {
    score += tagWeight;
  } else {
    // Tag noiDungTiengVietkhớp，trực tiếptrả về 0
    return 0;
  }

  // ID khớp (trọng số 0.3)
  const idWeight = 0.3;
  if (fpA.id || fpB.id) {
    weights += idWeight;
    if (fpA.id === fpB.id) {
      score += idWeight;
    }
  }

  // Class khớp (trọng số 0.2) - sử dụng Jaccard noiDungTiengViet
  const classWeight = 0.2;
  if ((fpA.classes?.length ?? 0) > 0 || (fpB.classes?.length ?? 0) > 0) {
    weights += classWeight;
    const setA = new Set(fpA.classes ?? []);
    const setB = new Set(fpB.classes ?? []);
    const intersection = [...setA].filter((c) => setB.has(c)).length;
    const union = new Set([...(fpA.classes ?? []), ...(fpB.classes ?? [])]).size;
    if (union > 0) {
      score += classWeight * (intersection / union);
    }
  }

  // Text khớp (trọng số 0.1) - noiDungTiengVietbao gồmkiểm tra
  const textWeight = 0.1;
  if (fpA.text || fpB.text) {
    weights += textWeight;
    if (fpA.text && fpB.text) {
      // kiểm tracó/khôngnoiDungTiengViet
      const textA = fpA.text.toLowerCase();
      const textB = fpB.text.toLowerCase();
      if (textA === textB) {
        score += textWeight;
      } else if (textA.includes(textB) || textB.includes(textA)) {
        score += textWeight * 0.5;
      }
    }
  }

  return weights > 0 ? score / weights : 0;
}

/**
 * kiểm trahaivân taycó/khôngbiểu thịnoiDungTiengVietphần tử
 *
 * noiDungTiengVietphán đoán，mặc địnhnoiDungTiengViet 0.7
 */
export function fingerprintMatches(
  a: string,
  b: string,
  threshold = 0.7,
): { match: boolean; score: number } {
  const score = fingerprintSimilarity(a, b);
  return {
    match: score >= threshold,
    score,
  };
}
