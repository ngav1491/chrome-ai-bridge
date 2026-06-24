# Hướng dẫn cài đặt trên Windows 🔧

Các bước cài đặt và cấu hình chi tiết của Chrome MCP Server trên máy tính Windows

## 📋 Cài đặt

1. **Tải xuống tiện ích Chrome mới nhất từ GitHub**

Liên kết tải xuống: https://github.com/hangwin/mcp-chrome/releases

2. **Cài đặt mcp-chrome-bridge trên toàn cục**

Đảm bảo Node đã được cài đặt trên máy tính, nếu chưa cài đặt vui lòng tự cài trước

```bash
npm install -g mcp-chrome-bridge
```

3. **Tải tiện ích Chrome**
   - Mở Chrome và truy cập `chrome://extensions/`
   - Bật "Chế độ nhà phát triển"
   - Nhấp "Tải tiện ích đã giải nén", chọn `your/dowloaded/extension/folder`
   - Nhấp biểu tượng tiện ích để mở plugin, nhấp kết nối để xem cấu hình MCP
     <img width="475" alt="Ảnh chụp màn hình 2025-06-09 15 52 06" src="https://github.com/user-attachments/assets/241e57b8-c55f-41a4-9188-0367293dc5bc" />

4. **Sử dụng trong CherryStudio**

Chọn loại là streamableHttp, url điền `http://127.0.0.1:12306/mcp`

<img width="675" alt="Ảnh chụp màn hình 2025-06-11 15 00 29" src="https://github.com/user-attachments/assets/6631e9e4-57f9-477e-b708-6a285cc0d881" />

Xem danh sách công cụ, nếu có thể liệt kê được các công cụ thì đã có thể sử dụng được

<img width="672" alt="Ảnh chụp màn hình 2025-06-11 15 14 55" src="https://github.com/user-attachments/assets/d08b7e51-3466-4ab7-87fa-3f1d7be9d112" />

```json
{
  "mcpServers": {
    "streamable-mcp-server": {
      "type": "streamable-http",
      "url": "http://127.0.0.1:12306/mcp"
    }
  }
}
```

## 🚀 Sự cố cài đặt và kết nối

### Chẩn đoán nhanh

Nếu gặp sự cố, hãy chạy công cụ chẩn đoán:

```bash
mcp-chrome-bridge doctor
```

Tự động sửa các sự cố thường gặp:

```bash
mcp-chrome-bridge doctor --fix
```

### Nếu nhấp nút kết nối tiện ích nhưng không kết nối thành công

1. **Kiểm tra xem mcp-chrome-bridge đã được cài đặt thành công chưa**, đảm bảo nó được cài đặt toàn cục

```bash
mcp-chrome-bridge -V
```

<img width="612" alt="Ảnh chụp màn hình 2025-06-11 15 09 57" src="https://github.com/user-attachments/assets/59458532-e6e1-457c-8c82-3756a5dbb28e" />

2. **Kiểm tra tệp manifest đã được đặt đúng thư mục chưa**

Đường dẫn: `C:\Users\xxx\AppData\Roaming\Google\Chrome\NativeMessagingHosts`

3. **Kiểm tra nhật ký**

Nhật ký hiện được lưu trữ trong thư mục người dùng: `%LOCALAPPDATA%\mcp-chrome-bridge\logs\`

Ví dụ: `C:\Users\xxx\AppData\Local\mcp-chrome-bridge\logs\`

<img width="804" alt="Ảnh chụp màn hình 2025-06-11 15 09 41" src="https://github.com/user-attachments/assets/ce7b7c94-7c84-409a-8210-c9317823aae1" />

4. **Vấn đề đường dẫn Node.js**

Nếu sử dụng trình quản lý phiên bản Node (nvm-windows, volta, fnm), bạn có thể đặt biến môi trường:

```cmd
set CHROME_MCP_NODE_PATH=C:\path\to\your\node.exe
```

Hoặc chạy `mcp-chrome-bridge doctor --fix` để tự động ghi đường dẫn Node hiện tại.
