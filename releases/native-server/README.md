# Chrome AI Bridge — Native Server (Windows)

Phần native messaging host cho Chrome extension **chrome-ai-bridge**.
Server lắng nghe trên port `12306`, bind `0.0.0.0` (LAN accessible).

## Yêu cầu

| Yêu cầu           | Phiên bản     | Cách kiểm tra      |
| ----------------- | ------------- | ------------------ |
| **Node.js**       | >= 20.0.0     | `node -v`          |
| **Google Chrome** | 120+          | `chrome://version` |
| **OS**            | Windows 10/11 | —                  |

Tải Node.js LTS từ https://nodejs.org/

## Cài đặt

### Bước 1 — Giải nén

Giải nén ZIP `chrome-ai-bridge-native-server-windows.zip` vào vị trí cố định, ví dụ:

```
C:\chrome-ai-bridge\
├── dist\
│   ├── cli.js
│   ├── index.js
│   ├── run_host.bat
│   ├── node_path.txt
│   ├── mcp\
│   │   └── mcp-server-stdio.js
│   └── scripts\
│       └── postinstall.js
├── package.json
├── vendor\
│   └── chrome-ai-bridge-shared\
├── install.bat
└── README.md
```

> **Lưu ý**: Không giải nén vào `Downloads` hoặc `Temp` — các thư mục này có thể bị dọn tự động.

### Bước 2 — Cài dependencies runtime

Mở `chrome://extensions`, bật Developer mode, copy dòng **ID** của extension chrome-ai-bridge. Sau đó mở **PowerShell** tại thư mục vừa giải nén (`C:\chrome-ai-bridge\`) rồi chạy:

```powershell
.\install.bat jldpoegmnhhdnfahaombbppmpnjfdkki
```

Script này cài `commander`, `fastify`, `better-sqlite3` và các dependency runtime khác, reset MCP port về `12306`, rồi chạy `doctor --fix`. Gói workspace `chrome-ai-bridge-shared` đã được bundle sẵn trong thư mục `vendor\`.

Nếu không truyền ID, script vẫn cài dependencies nhưng native manifest chỉ dùng ID legacy; với extension load unpacked, hãy truyền đúng ID như ví dụ trên.

Nếu muốn chạy thủ công thay cho script:

```powershell
npm.cmd install --omit=dev
node dist\cli.js update-port 12306
node dist\cli.js doctor --fix --extension-id jldpoegmnhhdnfahaombbppmpnjfdkki
```

### Bước 3 — Kiểm tra

```powershell
node dist\cli.js doctor --extension-id jldpoegmnhhdnfahaombbppmpnjfdkki
```

Output phải báo: native host OK, extension ID, port 12306, manifest đúng.

### Bước 4 — Đăng ký Native Messaging host

Mở **PowerShell** tại thư mục vừa giải nén (`C:\chrome-ai-bridge\`):

```powershell
# Cấp người dùng (khuyến nghị, không cần admin)
node dist\cli.js register --extension-id jldpoegmnhhdnfahaombbppmpnjfdkki

# Hoặc cấp hệ thống (cần chạy PowerShell as Administrator)
node dist\cli.js register --system --extension-id jldpoegmnhhdnfahaombbppmpnjfdkki
```

Lệnh này tạo:

- File manifest tại `%APPDATA%\Google\Chrome\NativeMessagingHosts\com.ngav1491.chrome_ai_bridge.nativehost.json`
- Registry key `HKCU\Software\Google\Chrome\NativeMessagingHosts\com.ngav1491.chrome_ai_bridge.nativehost`

## Cấu hình MCP client

Thêm vào file cấu hình MCP client (Claude Desktop, Cursor, Cherry Studio, ...):

### Streamable HTTP (khuyến nghị)

```json
{
  "mcpServers": {
    "chrome-ai-bridge": {
      "type": "streamableHttp",
      "url": "http://127.0.0.1:12306/mcp"
    }
  }
}
```

### STDIO (phương án thay thế)

```json
{
  "mcpServers": {
    "chrome-ai-bridge-stdio": {
      "command": "node",
      "args": ["C:\\chrome-ai-bridge\\dist\\mcp\\mcp-server-stdio.js"]
    }
  }
}
```

### Kết nối từ máy khác trong LAN

Server bind `0.0.0.0:12306` nên MCP client từ máy khác trong cùng LAN có thể kết nối. Thay `127.0.0.1` bằng IP máy chủ:

```json
{
  "mcpServers": {
    "chrome-ai-bridge": {
      "type": "streamableHttp",
      "url": "http://192.168.1.100:12306/mcp"
    }
  }
}
```

## Đổi port hoặc host

Đặt biến môi trường trước khi đăng ký:

```powershell
# Đổi port (mặc định 12306)
$env:CHROME_MCP_PORT = "13000"
node dist\cli.js register

# Giới hạn chỉ loopback (mặc định 0.0.0.0 cho LAN)
$env:SERVER_HOST = "127.0.0.1"
node dist\cli.js register
```

## Vị trí log

```
%LOCALAPPDATA%\chrome-ai-bridge\logs\
```

## Gỡ cài đặt

```powershell
# Gỡ đăng ký native host
node dist\cli.js unregister

# Xóa thư mục (tùy chọn)
Remove-Item -Recurse -Force C:\chrome-ai-bridge
```

Hoặc xóa thủ công:

- File manifest: `%APPDATA%\Google\Chrome\NativeMessagingHosts\com.ngav1491.chrome_ai_bridge.nativehost.json`
- Registry key: `HKCU\Software\Google\Chrome\NativeMessagingHosts\com.ngav1491.chrome_ai_bridge.nativehost`

## Khắc phục sự cố

| Lỗi                                            | Cách xử lý                                                                                                                                                                            |
| ---------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Cannot find module 'fastify' / 'commander'** | Bạn chưa cài dependencies runtime; chạy `.\install.bat` ở thư mục gốc vừa giải nén                                                                                                    |
| **Node.js not found**                          | Chạy `node dist\cli.js doctor --fix` hoặc set `$env:CHROME_MCP_NODE_PATH` trỏ tới `node.exe`                                                                                          |
| **Port 12306 bị chiếm**                        | Đổi port: `$env:CHROME_MCP_PORT = "13000"; node dist\cli.js register`                                                                                                                 |
| **Extension ID mismatch**                      | Mở `chrome://extensions`, copy dòng **ID**, rồi chạy `node dist\cli.js register --extension-id ID_CUA_EXTENSION` hoặc `node dist\cli.js doctor --fix --extension-id ID_CUA_EXTENSION` |
| **Native host has exited**                     | Chạy `node dist\cli.js fix-permissions`                                                                                                                                               |
| **MCP client không kết nối**                   | Kiểm tra popup extension "Đã kết nối", chạy `node dist\cli.js doctor`                                                                                                                 |

## Cần hỗ trợ thêm

- Xem [docs/TROUBLESHOOTING_vi.md](../../docs/TROUBLESHOOTING_vi.md) cho luồng chẩn đoán đầy đủ
- Mở issue tại https://github.com/ngav1491/chrome-ai-bridge/issues kèm: OS, Node version, lệnh đã chạy, output của `doctor`
