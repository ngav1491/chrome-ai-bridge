# Chrome MCP Server Extension - Latest Release

## Tải bản mới nhất

### 1. File phát hành

Tải file [chrome-mcp-server-latest.zip](/releases/chrome-extension/latest/chrome-mcp-server-lastest.zip).

### 2. Cài đặt extension

1. Giải nén file zip vừa tải.
2. Mở Chrome.
3. Truy cập `chrome://extensions/`.
4. Bật chế độ Developer mode.
5. Chọn Load unpacked.
6. Chọn thư mục extension đã giải nén.

### 3. Sau khi cài đặt

- Kiểm tra biểu tượng extension trên thanh công cụ Chrome.
- Mở popup của extension để xem trạng thái kết nối.
- Kết nối Native Server nếu cần dùng các công cụ MCP đầy đủ.

## Cấu hình

### Native Server

1. Cài Native Server theo hướng dẫn trong README chính của dự án.
2. Mở popup extension.
3. Kiểm tra trạng thái kết nối. Nếu thấy thông báo chưa chạy service, hãy khởi động lại Native Server.

## Khắc phục sự cố

### Extension không tải được

1. **Kiểm tra thư mục extension**
   - Đảm bảo bạn chọn đúng thư mục đã giải nén.
   - Đảm bảo trong thư mục có file `manifest.json`.

2. **Kiểm tra Native Server**
   - Đảm bảo Native Server đã được cài đặt.
   - Đảm bảo process đang chạy.
   - Thử khởi động lại Chrome sau khi cài Native Server.

3. **Kiểm tra quyền truy cập**
   - Đảm bảo extension được bật.
   - Đảm bảo quyền cần thiết đã được cấp.
   - Xem lỗi trong trang `chrome://extensions/` nếu extension báo lỗi.

## Hỗ trợ

Nếu gặp vấn đề:

1. Đọc README chính và tài liệu troubleshooting.
2. Tìm trong GitHub Issues xem lỗi đã được báo chưa.
3. Tạo Issue mới và đính kèm log, phiên bản Chrome, hệ điều hành và các bước tái hiện.

## Lưu ý

- File phát hành trong thư mục này dành cho cài đặt thủ công.
- Với môi trường phát triển, nên build extension từ mã nguồn để đảm bảo artifact mới nhất.
