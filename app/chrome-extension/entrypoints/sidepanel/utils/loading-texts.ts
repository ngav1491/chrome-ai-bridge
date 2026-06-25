/**
 * Văn bản Loading ngẫu nhiên
 * Dùng cho component TimelineStatusStep để hiển thị gợi ý chờ đợi thú vị
 */

const loadingTexts = [
  // Meme kinh điển
  'Lẽ ra phải thong thả tự tại',
  'Giờ thì vội vã lảo đảo',
  'Em biết anh rất gấp, nhưng cứ từ từ đã',
  'Bơi chó dưới đại dương tri thức',
  'Để đạn bay thêm một chút nữa',
  'Đang nhào nặn câu trả lời cho anh đây',
  'Lũ yêu tinh nhỏ vùng Lang-lang sắp tập hợp',
  'Đừng giục, đang viết rồi (vừa tạo xong thư mục)',
  'Đang mồ hôi đầm đìa suy nghĩ',
  'CPU sắp cháy rồi',
  // Hơi ấm cuộc sống
  'Cà phê rang chậm, tinh hoa cần thời gian',
  'Đang lật mặt bánh xèo tri thức',
  'Rót cho mình một ly, xong ngay đây',
  'Đang cho ý tưởng vào lò nướng',
  'Để đáp án ngâm thêm chút nữa',
  'Đang đẩy giá trị cảm xúc lên mức tối đa',
  'Đang đan chiếc áo len ngôn ngữ cho anh',
  // Bay bổng
  'Tế bào thần kinh đang nhảy disco',
  'Con cú thức đêm đang suy nghĩ',
  'Đang tô màu cho đáp án',
  'Đang lục tung kho tri thức',
  'Rạp xiếc não bộ khai mạc',
  'Đang nhào 0 và 1 lại với nhau',
  'Đang nín thở nung đòn đánh lớn',
  'Kính lúp hơi mờ, lau chút đã',
  'Đang cố hiểu cái yêu cầu vô lý này',
  // Kỳ ảo
  'Đang thi triển phép thuật, đừng quấy rầy',
  'Đánh thức người bạn silic',
  'Đang kết nối với tuệ giác không gian cyber',
  'Đạo hữu dừng bước, đang diễn ra',
  'Đang xuyên lỗ đen tri thức',
  'Đang phân giải ngược ý đồ của con người',
  'Quả cầu pha lê hơi mờ, vỗ hai cái',
  // Công sở
  'Mã chạy nhanh hơn cả phóng viên',
  'Người chủ đã lên mạng, xin chờ',
  'Đang phi nước đại tới đây',
  'Đang quang tốc vận chuyển tri thức',
  'Mảnh ghép cuối cùng của bức tranh',
  'Đáp án sắp sát cảnh',
  'Đế ngược phóng chỉ',
  'Đang khóa mục tiêu',
];

/**
 * Lấy văn bản Loading ngẫu nhiên
 */
export function getRandomLoadingText(): string {
  return loadingTexts[Math.floor(Math.random() * loadingTexts.length)];
}
