# Chrome AI Bridge — Extension (Chrome)

Phần Chrome extension cho **chrome-ai-bridge**.
Extension giao tiếp với native server qua Chrome Native Messaging, expose MCP server trên port 12306.

## Yêu cầu

| Yêu cầu           | Phiên bản                                           |
| ----------------- | --------------------------------------------------- |
| **Google Chrome** | 120+ (hoặc Chromium: Edge, Brave, Arc, Opera...)    |
| **Native Server** | Đã cài đặt (xem `releases/native-server/README.md`) |

## Cài đặt

### Bước 1 — Giải nén

Giải nén ZIP `chrome-ai-bridge-extension.zip` vào vị trí cố định, ví dụ:

```
C:\chrome-ai-bridge-extension\
├── manifest.json
├── background.js
├── sidepanel.html
├── popup.html
├── _locales\
│   ├── de\messages.json
│   ├── en\messages.json
│   ├── ja\messages.json
│   ├── ko\messages.json
│   └── vi\messages.json
├── workers\
├── inject-scripts\
└── icon\
```

> **Lưu ý**: Không giải nén vào `Downloads` hoặc `Temp` — Chrome cần đường dẫn ổn định.

### Bước 2 — Load vào Chrome

1. Mở Chrome, truy cập `chrome://extensions/`
2. Bật **Developer mode** (góc trên bên phải)
3. Nhấp **Load unpacked**
4. Chọn thư mục vừa giải nén (thư mục chứa `manifest.json`)
5. Extension xuất hiện trong danh sách, không có badge lỗi đỏ

### Bước 3 — Ghim và kết nối

1. Nhấp biểu tượng mảnh ghép trên thanh công cụ Chrome → ghim **chrome-ai-bridge**
2. Nhấp biểu tượng extension → popup mở ra
3. Nhấp **Kết nối**
4. Trạng thái chuyển xanh "Đã kết nối"
5. Popup hiển thị:
   - Đoạn cấu hình MCP server (JSON)
   - Cổng đang lắng nghe (mặc định `12306`)
   - Extension ID (cần cho native server registration)

> **Lưu ý Extension ID**: Extension ID thay đổi theo máy. Nếu đăng ký native host trước khi load extension, có thể cần chạy lại `register` để cập nhật `allowed_origins` cho đúng ID.

## Sau khi cài đặt

- Kiểm tra biểu tượng extension trên thanh công cụ Chrome
- Mở popup để xem trạng thái kết nối
- Nếu thấy thông báo "chưa chạy service", đảm bảo native server đã cài và chạy

## Cập nhật

1. Tải ZIP mới từ GitHub Releases
2. Giải nén đè lên thư mục cũ (hoặc xóa thư mục cũ rồi giải nén mới)
3. Vào `chrome://extensions/` → nhấp **Reload** trên thẻ extension

## Gỡ cài đặt

1. Vào `chrome://extensions/`
2. Tìm **chrome-ai-bridge** → nhấp **Remove**
3. Xác nhận hộp thoại

## Khắc phục sự cố

### Extension không tải được

1. **Kiểm tra thư mục extension** — đảm bảo chọn đúng thư mục chứa `manifest.json`
2. **Kiểm tra native server** — đảm bảo đã cài đặt và process đang chạy
3. **Kiểm tra quyền** — đảm bảo extension được bật, xem lỗi trong `chrome://extensions/`

### Extension báo lỗi sau khi load

Mở nút **Errors** của extension tại `chrome://extensions/`. Hầu hết lỗi load do chọn sai thư mục (chọn thư mục cha thay vì thư mục chứa `manifest.json`).

### MCP client không kết nối được

1. Kiểm tra popup extension có "Đã kết nối" không
2. Chạy `node dist\cli.js doctor` trên native server
3. Kiểm tra cổng không bị chiếm: `netstat -ano | findstr 12306`
4. Kiểm tra URL trong MCP client config đúng `http://127.0.0.1:12306/mcp`

## Cần hỗ trợ thêm

- Xem [docs/TROUBLESHOOTING_vi.md](../../docs/TROUBLESHOOTING_vi.md) cho luồng chẩn đoán đầy đủ
- Mở issue tại https://github.com/ngav1491/chrome-ai-bridge/issues kèm: OS, Chrome version, lỗi hiển thị, output của `doctor`
