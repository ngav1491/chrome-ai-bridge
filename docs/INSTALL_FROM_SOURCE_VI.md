# Hướng dẫn chi tiết cài đặt chrome-ai-bridge MCP từ source

Tài liệu này hướng dẫn **từng bước** cách build chrome-ai-bridge từ mã nguồn, đăng ký Native Messaging host với Chrome, và kết nối MCP server với các MCP client (Claude Desktop, Cursor, Cherry Studio, ...).

> Nếu chỉ muốn dùng nhanh bản build sẵn, xem [`docs/INSTALL_VI.md`](INSTALL_VI.md) — phần "Cài đặt cho người dùng cuối".

---

## Mục lục

1. [Yêu cầu môi trường](#1-yêu-cầu-môi-trường)
2. [Clone và cài dependency](#2-clone-và-cài-dependency)
3. [Build toàn bộ project](#3-build-toàn-bộ-project)
4. [Đăng ký Native Messaging host](#4-đăng-ký-native-messaging-host)
5. [Load extension vào Chrome](#5-load-extension-vào-chrome)
6. [Cấu hình MCP client](#6-cấu-hình-mcp-client)
7. [Kiểm tra toàn bộ luồng](#7-kiểm-tra-toàn-bộ-luồng)
8. [Cập nhật từ source](#8-cập-nhật-từ-source)
9. [Gỡ cài đặt](#9-gỡ-cài-đặt)
10. [Khắc phục sự cố](#10-khắc-phục-sự-cố)

---

## 1. Yêu cầu môi trường

| Yêu cầu           | Phiên bản tối thiểu                              | Cách kiểm tra      |
| ----------------- | ------------------------------------------------ | ------------------ |
| **Node.js**       | >= 20.0.0                                        | `node -v`          |
| **pnpm**          | >= 9.0 (corepack tự quản lý)                     | `pnpm -v`          |
| **Git**           | bất kỳ                                           | `git --version`    |
| **Google Chrome** | 120+ (hoặc Chromium: Edge, Brave, Arc, Opera...) | `chrome://version` |
| Ổ đĩa trống       | ~200 MB cho build output                         | —                  |

Extension dùng chính profile Chrome hiện tại nên mọi phiên đăng nhập, mật khẩu đã lưu, tiện ích khác đều được giữ nguyên.

### Cài Node.js nếu chưa có

**macOS / Linux** (dùng nvm):

```bash
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.40.0/install.sh | bash
source ~/.bashrc   # hoặc ~/.zshrc
nvm install 20
nvm use 20
node -v   # phải >= 20.x
```

**Windows**: tải installer tại https://nodejs.org/ (chọn LTS 20+), chạy và làm theo hướng dẫn.

### Bật corepack (quản lý pnpm)

```bash
corepack enable
corepack prepare pnpm@latest --activate
```

---

## 2. Clone và cài dependency

```bash
git clone https://github.com/ngav1491/chrome-ai-bridge.git
cd chrome-ai-bridge
```

Cài tất cả dependency của monorepo:

```bash
corepack pnpm install
```

> Nếu cài lại từ lockfile có sẵn (khuyến nghị cho reproducible build):
>
> ```bash
> corepack pnpm install --frozen-lockfile
> ```

Quá trình này tải dependency cho 5 workspace: `packages/shared`, `packages/wasm-simd`, `app/native-server`, `app/chrome-extension`, và root.

---

## 3. Build toàn bộ project

Có hai phạm vi build tùy nhu cầu:

### 3a. Build đầy đủ (extension + native server + shared)

```bash
corepack pnpm build
```

Lệnh này build 3 workspace (bỏ qua `wasm-simd` vì cần Rust):

| Workspace              | Output                                     | Mô tả                                     |
| ---------------------- | ------------------------------------------ | ----------------------------------------- |
| `packages/shared`      | `packages/shared/dist/`                    | Tiện ích TypeScript dùng chung            |
| `app/native-server`    | `app/native-server/dist/`                  | CLI `chrome-ai-bridge` + stdio MCP server |
| `app/chrome-extension` | `app/chrome-extension/.output/chrome-mv3/` | Extension Chrome (WXT) + file zip release |

Sau khi xong, file zip extension sẵn sàng tại:

```
app/chrome-extension/.output/chrome-ai-bridge-extension.zip
```

### 3b. Chỉ build native server (nếu đã có extension zip từ Releases)

Nếu chỉ cần MCP server và đã tải extension zip từ GitHub Releases:

```bash
corepack pnpm build:native
```

Output native server tại `app/native-server/dist/`:

```
app/native-server/dist/
├─ cli.js                          ← CLI chính (register, doctor, ...)
├─ index.js                        ← entry point native host
├─ run_host.sh / run_host.bat      ← script khởi động cho Chrome
├─ node_path.txt                   ← đường dẫn Node.js trên máy này
├─ mcp/
│  └─ mcp-server-stdio.js          ← entry point MCP stdio server
└─ scripts/
   └─ postinstall.js               ← chạy khi npm install -g
```

---

## 4. Đăng ký Native Messaging host

Chrome cần biết "native host" ở đâu để giao tiếp với extension. Bước này tạo tệp manifest đăng ký host với Chrome.

### 4a. Đăng ký cấp người dùng (khuyến nghị, không cần sudo)

```bash
node app/native-server/dist/cli.js register
```

Lệnh này tạo tệp manifest tại:

| OS          | Đường dẫn manifest                                                                                               |
| ----------- | ---------------------------------------------------------------------------------------------------------------- |
| **Windows** | `%APPDATA%\Google\Chrome\NativeMessagingHosts\com.ngav1491.chrome_ai_bridge.nativehost.json`                     |
| **macOS**   | `~/Library/Application Support/Google/Chrome/NativeMessagingHosts/com.ngav1491.chrome_ai_bridge.nativehost.json` |
| **Linux**   | `~/.config/google-chrome/NativeMessagingHosts/com.ngav1491.chrome_ai_bridge.nativehost.json`                     |

Không cần quyền quản trị. Đây là cách khuyến nghị cho hầu hết người dùng.

### 4b. Đăng ký cấp hệ thống (cần quyền admin)

Nếu đăng ký cấp người dùng thất bại (do chính sách IT, quyền thư mục, v.v.):

```bash
# macOS / Linux
sudo node app/native-server/dist/cli.js register --system

# Windows (chạy PowerShell/CMD với quyền Administrator)
node app/native-server\dist\cli.js register --system
```

Manifest cấp hệ thống được tạo tại:

| OS      | Đường dẫn                                            |
| ------- | ---------------------------------------------------- |
| Windows | `%ProgramFiles%\Google\Chrome\NativeMessagingHosts\` |
| macOS   | `/Library/Google/Chrome/NativeMessagingHosts/`       |
| Linux   | `/etc/opt/chrome/native-messaging-hosts/`            |

### 4c. Kiểm tra đăng ký

```bash
node app/native-server/dist/cli.js doctor
```

Lệnh doctor sẽ báo cáo:

- Có tệp manifest hay không
- Nội dung manifest có đúng không
- Đường dẫn `run_host.sh`/`run_host.bat` có tồn tại và có quyền thực thi
- Extension ID được phép kết nối
- Cổng MCP đang lắng nghe

Nếu mọi thứ OK, chuyển sang bước 5.

---

## 5. Load extension vào Chrome

### 5a. Dùng bản build cục bộ (từ bước 3a)

1. Mở Chrome, truy cập `chrome://extensions/`.
2. Bật **Developer mode** (góc trên bên phải).
3. Nhấp **Load unpacked**.
4. Chọn thư mục `app/chrome-extension/.output/chrome-mv3/` (thư mục chứa `manifest.json`).
5. Extension xuất hiện trong danh sách, không có badge lỗi đỏ.

### 5b. Dùng bản zip từ GitHub Releases (từ bước 3b)

1. Tải `chrome-ai-bridge-extension.zip` từ https://github.com/ngav1491/chrome-ai-bridge/releases
2. Giải nén ra vị trí ổn định (ví dụ `~/chrome-ai-bridge`), **không** giải nén vào Downloads/Temp.
3. Lặp lại bước 5a nhưng chọn thư mục vừa giải nén.

### 5c. Ghim extension và kết nối

1. Nhấp biểu tượng mảnh ghép trên thanh công cụ Chrome → ghim **chrome-ai-bridge**.
2. Nhấp biểu tượng extension → popup mở ra.
3. Nhấp **Kết nối**. Trạng thái chuyển xanh "Đã kết nối".
4. Popup hiển thị:
   - Đoạn cấu hình MCP server (JSON)
   - Cổng đang lắng nghe (mặc định `12306`)
   - Extension ID (cần cho bước 4 nếu đăng ký lại)

> **Lưu ý Extension ID**: Extension ID thay đổi theo máy. Nếu đăng ký native host trước khi load extension, có thể cần chạy lại `register` để cập nhật `allowed_origins` cho đúng ID. Lệnh `doctor` sẽ phát hiện mismatch.

---

## 6. Cấu hình MCP client

Extension expose MCP server tại `http://127.0.0.1:12306/mcp` (mặc định). Có hai transport.

### 6a. Streamable HTTP (khuyến nghị)

Thêm vào file cấu hình MCP client:

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

**Vị trí file cấu hình theo client:**

| MCP client         | Vị trí file config                                                                                                                     |
| ------------------ | -------------------------------------------------------------------------------------------------------------------------------------- |
| **Claude Desktop** | `~/Library/Application Support/Claude/claude_desktop_config.json` (macOS) hoặc `%APPDATA%\Claude\claude_desktop_config.json` (Windows) |
| **Cursor**         | Settings → MCP → Add new MCP server, hoặc `~/.cursor/mcp.json`                                                                         |
| **Cherry Studio**  | Settings → MCP Servers → Add                                                                                                           |
| **Augment**        | Settings → MCP → Add server                                                                                                            |

### 6b. STDIO (phương án thay thế)

Một số client chỉ hỗ trợ stdio. Cần đường dẫn tuyệt đối tới entry point:

```bash
# Xác định đường dẫn source của bạn
pwd
# Ví dụ: /home/user/chrome-ai-bridge
```

Đường dẫn stdio server là:

```
<đường-dẫn-source>/app/native-server/dist/mcp/mcp-server-stdio.js
```

Cấu hình:

```json
{
  "mcpServers": {
    "chrome-ai-bridge-stdio": {
      "command": "node",
      "args": ["/home/user/chrome-ai-bridge/app/native-server/dist/mcp/mcp-server-stdio.js"]
    }
  }
}
```

> **Windows**: dùng đường dẫn với backslash hoặc forward slash đều OK:
>
> ```json
> "args": ["C:\\Users\\you\\chrome-ai-bridge\\app\\native-server\\dist\\mcp\\mcp-server-stdio.js"]
> ```

### 6c. Đổi cổng mặc định

Nếu cổng `12306` bị chiếm:

1. Mở popup extension → mục cấu hình → đổi cổng (ví dụ `13000`).
2. Cập nhật URL trong MCP client config thành `http://127.0.0.1:13000/mcp`.
3. Nhấp **Kết nối** lại trong popup.

---

## 7. Kiểm tra toàn bộ luồng

Sau khi hoàn tất bước 4-6, kiểm tra end-to-end:

1. **Popup extension** hiển thị "Đã kết nối" (xanh).

2. **Doctor** từ terminal:

   ```bash
   node app/native-server/dist/cli.js doctor
   ```

   Phải báo cáo: native host OK, extension ID, cổng, manifest đúng.

3. **Gọi tool từ MCP client**: trong Claude Desktop / Cursor / Cherry Studio, thử gọi một tool thuộc `chrome-ai-bridge` (ví dụ `screenshot`, `get_page_content`, `navigate`). Nếu round-trip thành công → toàn bộ luồng Chrome ↔ native host ↔ MCP client đang hoạt động.

4. **Kiểm tra log** nếu cần debug:

   | OS      | Vị trí log                              |
   | ------- | --------------------------------------- |
   | macOS   | `~/Library/Logs/chrome-ai-bridge/`      |
   | Windows | `%LOCALAPPDATA%\chrome-ai-bridge\logs\` |
   | Linux   | `~/.local/state/chrome-ai-bridge/logs/` |

---

## 8. Cập nhật từ source

```bash
cd chrome-ai-bridge
git pull
corepack pnpm install --frozen-lockfile
corepack pnpm build
```

Sau đó:

- Quay lại `chrome://extensions/` → nhấp **Reload** trên thẻ extension.
- Chạy lại `node app/native-server/dist/cli.js register` nếu extension ID thay đổi (doctor sẽ báo).

---

## 9. Gỡ cài đặt

1. `chrome://extensions/` → tìm **chrome-ai-bridge** → **Remove**.
2. Gỡ manifest native host:

   ```bash
   node app/native-server/dist/cli.js unregister
   ```

   Hoặc xóa thủ công tệp manifest tại các đường dẫn ở bước 4.

3. Xóa thư mục source (tùy chọn):

   ```bash
   rm -rf /path/to/chrome-ai-bridge
   ```

4. Xóa thư mục log (tùy chọn) — xem vị trí ở bước 7.

---

## 10. Khắc phục sự cố

### Lỗi "Native host has exited" / "Permission denied"

Thường do `run_host.sh` thiếu quyền thực thi (macOS/Linux):

```bash
node app/native-server/dist/cli.js fix-permissions
# hoặc
node app/native-server/dist/cli.js doctor --fix
```

Hoặc thủ công:

```bash
chmod +x app/native-server/dist/run_host.sh
chmod +x app/native-server/dist/index.js
chmod +x app/native-server/dist/cli.js
```

### MCP client không kết nối được

1. Kiểm tra popup extension có "Đã kết nối" không.
2. Chạy `node app/native-server/dist/cli.js doctor`.
3. Kiểm tra cổng không bị chiếm: `lsof -i :12306` (macOS/Linux) hoặc `netstat -ano | findstr 12306` (Windows).
4. Kiểm tra URL trong MCP client config đúng `http://127.0.0.1:12306/mcp`.

### Extension ID mismatch

Nếu đăng ký native host trước khi load extension, `allowed_origins` trong manifest có thể sai ID:

```bash
# Load extension trước, lấy ID từ chrome://extensions/
# Sau đó đăng ký lại:
node app/native-server/dist/cli.js register
```

Lệnh register tự đọc extension ID hiện tại và cập nhật manifest.

### Build thất bại

- Đảm bảo Node.js >= 20: `node -v`
- Đảm bảo pnpm mới: `corepack prepare pnpm@latest --activate`
- Xóa `node_modules` và cài lại: `corepack pnpm install --force`
- Xóa build output cũ: `corepack pnpm clean:dist`

### Cần hỗ trợ thêm

- Xem [`docs/TROUBLESHOOTING_VI.md`](TROUBLESHOOTING_VI.md) cho luồng chẩn đoán đầy đủ.
- Mở issue tại https://github.com/ngav1491/chrome-ai-bridge/issues kèm: OS, Node version, lệnh đã chạy, thông báo lỗi, output của `doctor`.
