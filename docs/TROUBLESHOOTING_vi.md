## 🚀 Sự cố cài đặt và kết nối

### Chẩn đoán nhanh

Chạy công cụ chẩn đoán để xác định các sự cố thường gặp:

```bash
chrome-ai-bridge doctor
```

Tự động sửa các sự cố thường gặp:

```bash
chrome-ai-bridge doctor --fix
```

### Xuất báo cáo chẩn đoán

Nếu cần gửi Issue, bạn có thể xuất báo cáo chẩn đoán:

```bash
# In báo cáo Markdown ra terminal (sao chép và dán vào GitHub Issue)
chrome-ai-bridge report

# Ghi vào tệp
chrome-ai-bridge report --output mcp-report.md

# Sao chép trực tiếp vào bộ nhớ tạm
chrome-ai-bridge report --copy
```

Theo mặc định, tên người dùng, đường dẫn và token sẽ được ẩn. Nếu bạn cần cung cấp đường dẫn đầy đủ, có thể sử dụng `--no-redact`.

### Các sự cố thường gặp

#### Kết nối thành công nhưng dịch vụ khởi động thất bại

Lỗi khởi động về cơ bản là **vấn đề quyền** hoặc do **node** được cài đặt bằng trình quản lý gói dẫn đến script khởi động không tìm thấy node tương ứng.

**Khuyến nghị chạy công cụ chẩn đoán trước:**

```bash
chrome-ai-bridge doctor
```

Quy trình khắc phục sự cố cốt lõi

1. Sau khi build và đăng ký từ source, xác nhận vị trí của tệp manifest `com.ngav1491.chrome_ai_bridge.nativehost.json`, bên trong có một trường **path** trỏ đến script khởi động trong `app/native-server/dist`:

1.1 **Kiểm tra xem chrome-ai-bridge đã build thành công chưa**

```bash
node app/native-server/dist/cli.js -V
```

<img width="612" alt="Ảnh chụp màn hình 2025-06-11 15 09 57" src="https://github.com/user-attachments/assets/59458532-e6e1-457c-8c82-3756a5dbb28e" />

1.2 **Kiểm tra tệp manifest đã được đặt đúng thư mục chưa**

Đường dẫn Windows: `C:\Users\xxx\AppData\Roaming\Google\Chrome\NativeMessagingHosts`

Đường dẫn Mac: `/Users/xxx/Library/Application\ Support/Google/Chrome/NativeMessagingHosts`

Nếu đăng ký từ source thành công, một tệp `com.ngav1491.chrome_ai_bridge.nativehost.json` sẽ được tạo trong thư mục này

```json
{
  "name": "com.ngav1491.chrome_ai_bridge.nativehost",
  "description": "chrome-ai-bridge Native Messaging host",
  "path": "/path/to/chrome-ai-bridge/app/native-server/dist/run_host.sh",
  "type": "stdio",
  "allowed_origins": ["chrome-extension://hbdgbgagpkpjffpklnamcljpakneikee/"]
}
```

> Nếu phát hiện không có tệp manifest này, bạn có thể thử thực thi dòng lệnh: `node app/native-server/dist/cli.js register`

2. **Kiểm tra nhật ký**

Nhật ký hiện được lưu trữ trong thư mục người dùng có thể ghi:

- **macOS**: `~/Library/Logs/chrome-ai-bridge/`
- **Windows**: `%LOCALAPPDATA%\chrome-ai-bridge\logs\` (ví dụ: `C:\Users\xxx\AppData\Local\chrome-ai-bridge\logs\`)
- **Linux**: `~/.local/state/chrome-ai-bridge/logs/`

<img width="804" alt="Ảnh chụp màn hình 2025-06-11 15 09 41" src="https://github.com/user-attachments/assets/ce7b7c94-7c84-409a-8210-c9317823aae1" />

3. Thông thường có hai nguyên nhân thất bại

3.1. `run_host.sh` (trên Windows là `run_host.bat`) không có quyền thực thi: chạy lệnh sau để sửa:

```bash
chrome-ai-bridge fix-permissions
```

3.2. Script không tìm thấy node: nếu bạn sử dụng công cụ quản lý phiên bản Node (nvm, volta, asdf, fnm), bạn có thể đặt biến môi trường `CHROME_MCP_NODE_PATH`:

```bash
export CHROME_MCP_NODE_PATH=/path/to/your/node
```

Hoặc chạy `chrome-ai-bridge doctor --fix` để ghi đường dẫn Node hiện tại.

3.3 Nếu đã loại trừ hai nguyên nhân trên mà vẫn không được, hãy xem nhật ký trong thư mục nhật ký, sau đó gửi issue

### Vị trí nhật ký

Nhật ký trình bao bọc hiện được lưu trữ ở vị trí người dùng có thể ghi:

- **macOS**: `~/Library/Logs/chrome-ai-bridge/`
- **Windows**: `%LOCALAPPDATA%\chrome-ai-bridge\logs\`
- **Linux**: `~/.local/state/chrome-ai-bridge/logs/`

#### Thực thi công cụ hết thời gian

Có thể khi kết nối trong thời gian dài, session sẽ hết thời gian, lúc này chỉ cần kết nối lại

#### Vấn đề về hiệu quả

Các agent khác nhau, các mô hình khác nhau sử dụng công cụ sẽ có hiệu quả khác nhau, điều này đòi hỏi bạn phải tự thử. Tôi khuyến nghị sử dụng các agent thông minh, ví dụ: augment, claude code, v.v.
