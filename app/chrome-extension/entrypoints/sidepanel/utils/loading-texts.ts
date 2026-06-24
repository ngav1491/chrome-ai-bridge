/**
 * ngẫu nhiên Loading văn bản
 * dùng cho TimelineStatusStep noiDungTiengVietchờgợi ý
 */

const loadingTexts = [
  // noiDungTiengViet
  'noiDungTiengViet',
  'noiDungTiengViet',
  'noiDungTiengViet，nhưngnoiDungTiengViet',
  'noiDungTiengViet',
  'noiDungTiengViet',
  'đangnoiDungTiengViet',
  'noiDungTiengViet',
  'noiDungTiengViet，noiDungTiengViet（noiDungTiengViettệpnoiDungTiengViet）',
  'đangnoiDungTiengViet',
  'CPU noiDungTiengViet',
  // noiDungTiengViet
  'noiDungTiengViet，noiDungTiengVietcầnthời gian',
  'noiDungTiengViet',
  'noiDungTiengViet，noiDungTiengViet',
  'đangnoiDungTiengViet',
  'noiDungTiengViet',
  'noiDungTiengViet',
  'đangnoiDungTiengVietngôn ngữnoiDungTiengViet',
  // noiDungTiengViet
  'noiDungTiengViet',
  'noiDungTiengViet',
  'noiDungTiengViet',
  'đangnoiDungTiengViet',
  'noiDungTiengViet',
  'đangnoiDungTiengViet 0 noiDungTiengViet 1 noiDungTiengViet',
  'đangnoiDungTiengViet',
  'noiDungTiengViet，noiDungTiengViet',
  'noiDungTiengViet',
  // noiDungTiengViet
  'đangnoiDungTiengViet，noiDungTiengViet',
  'noiDungTiengViet',
  'đangkết nốinoiDungTiengViet',
  'noiDungTiengViet，đangnoiDungTiengViet',
  'noiDungTiengViet',
  'đangnoiDungTiengVietphân tích cú phápnoiDungTiengViet',
  'noiDungTiengViet，noiDungTiengViet',
  // noiDungTiengViet
  'noiDungTiengViet',
  'noiDungTiengViet，noiDungTiengViet',
  'noiDungTiengViet',
  'đangnoiDungTiengViet',
  'noiDungTiengVietcuối cùngnoiDungTiengViet',
  'noiDungTiengViet',
  'noiDungTiengViet',
  'mục tiêunoiDungTiengViet',
];

/**
 * lấyngẫu nhiên Loading văn bản
 */
export function getRandomLoadingText(): string {
  return loadingTexts[Math.floor(Math.random() * loadingTexts.length)];
}
