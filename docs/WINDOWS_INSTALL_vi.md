# Hướng dẫn cài đặt trên Windows

> Tài liệu này đã được hợp nhất vào [`docs/INSTALL_VI.md`](INSTALL_VI.md) (bản tiếng Việt) và [`docs/INSTALL_EN.md`](INSTALL_EN.md) (bản tiếng Anh).
>
> Vui lòng truy cập hai file trên để có hướng dẫn cài đặt đầy đủ, bao gồm cả phần riêng cho Windows (PowerShell, đường dẫn `%LOCALAPPDATA%`, ...) và phần chung cho mọi hệ điều hành.

## Tóm tắt nhanh cho Windows

1. Tải bản release mới nhất từ <https://github.com/ngav1491/chrome-ai-bridge/releases> và giải nén vào một thư mục cố định.
2. Mở Chrome, truy cập `chrome://extensions/`, bật **Developer mode**, nhấp **Load unpacked** rồi chọn thư mục vừa giải nén.
3. Cài đặt native messaging host:

   ```powershell
   git clone https://github.com/ngav1491/chrome-ai-bridge.git
   cd chrome-ai-bridge
   corepack enable
   corepack pnpm install
   corepack pnpm build:native
   node app/native-server/dist/cli.js register
   ```

   Nếu cần đăng ký cho mọi user trên máy, chạy PowerShell với quyền admin rồi gọi `node app/native-server/dist/cli.js register --system`.

4. Nhấp biểu tượng chrome-ai-bridge trên thanh công cụ Chrome, nhấp **Kết nối**, rồi dùng URL `http://127.0.0.1:12306/mcp` trong cấu hình MCP client.

Tra cứu thêm các phần **Cập nhật**, **Gỡ cài** và **Khắc phục sự cố** trong [`INSTALL_VI.md`](INSTALL_VI.md).
