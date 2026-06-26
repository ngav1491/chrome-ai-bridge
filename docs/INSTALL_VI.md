# Hướng dẫn cài đặt tiện ích Chrome chrome-ai-bridge

Tài liệu này hướng dẫn hai cách thêm tiện ích Chrome chrome-ai-bridge vào trình duyệt:

- **Người dùng cuối** — tải bản build sẵn từ GitHub Releases rồi load vào Chrome.
- **Lập trình viên** — clone repo, build extension trên máy rồi load bản build cục bộ.

Cả hai cách đều dùng luồng **Developer mode → Load unpacked** của Chrome; chỉ khác nhau ở nguồn gốc thư mục unpacked.

> Xem bản tiếng Anh tại [`docs/INSTALL_EN.md`](INSTALL_EN.md).

---

## 1. Yêu cầu môi trường

- **Google Chrome 120+** hoặc trình duyệt Chromium khác (Edge, Brave, Arc, Opera, ...)
- **Node.js 20+** và **pnpm** (chỉ cần khi build từ source)
- **Git** (chỉ cần khi clone repo)
- Khoảng 200 MB trống trên ổ đĩa cho output build

Extension dùng chính profile Chrome hiện tại của bạn nên các phiên đăng nhập, mật khẩu đã lưu và tiện ích khác đều được giữ nguyên.

---

## 2. Cài đặt cho người dùng cuối (khuyến nghị)

### Bước 1 — Tải bản release mới nhất

1. Truy cập trang GitHub Releases của chrome-ai-bridge:
   ```
   https://github.com/ngav1491/chrome-ai-bridge/releases
   ```
2. Tải file `chrome-ai-bridge-<version>.zip` ở bản release bạn muốn cài.
3. Giải nén ZIP ra một vị trí ổn định trên ổ đĩa (ví dụ `~/chrome-ai-bridge`). Không giải nén vào các thư mục tự động dọn như `Downloads`, `Temp`, ...

### Bước 2 — Load extension vào Chrome

1. Mở Chrome và truy cập `chrome://extensions/`.
2. Bật **Developer mode** ở góc trên bên phải.
3. Nhấp **Load unpacked**.
4. Trong hộp chọn file, chọn **thư mục** đã giải nén (thư mục có chứa `manifest.json`).
5. Xác nhận extension xuất hiện trong danh sách và không có badge lỗi màu đỏ.

### Bước 3 — Cài đặt native messaging host

Extension cần một binary nhỏ trên máy để Chrome có thể giao tiếp với MCP server. Gói npm hiện chưa publish, nên hãy build và đăng ký trực tiếp từ source:

```bash
git clone https://github.com/ngav1491/chrome-ai-bridge.git
cd chrome-ai-bridge
corepack enable
corepack pnpm install
corepack pnpm build:native
node app/native-server/dist/cli.js register
```

Sau khi đăng ký thành công, bạn có thể chuyển sang Bước 4.

Khi gói npm được publish, có thể cài đặt toàn cục bằng:

```bash
npm install -g chrome-ai-bridge
chrome-ai-bridge register
```

Đăng ký toàn cục cho mọi user trên máy:

```bash
# macOS / Linux
sudo chrome-ai-bridge register --system

# Windows (chạy từ PowerShell với quyền admin)
chrome-ai-bridge register --system
```

### Bước 4 — Mở extension và kết nối

1. Nhấp biểu tượng chrome-ai-bridge trên thanh công cụ Chrome. Nếu không thấy, nhấp biểu tượng mảnh ghép và ghim chrome-ai-bridge.
2. Nhấp **Kết nối** trong popup.
3. Popup sẽ hiển thị đoạn cấu hình MCP server, cổng đang lắng nghe và chỉ báo trạng thái màu xanh.

---

## 3. Cài đặt cho lập trình viên (build từ source)

Dùng cách này khi bạn muốn sửa extension, đóng góp hoặc kiểm thử bản dev.

### Bước 1 — Clone repo

```bash
git clone https://github.com/ngav1491/chrome-ai-bridge.git
cd chrome-ai-bridge
```

### Bước 2 — Cài dependency và build

Repo có sẵn pnpm lockfile và native messaging host là một workspace package. Chạy build đầy đủ:

```bash
corepack pnpm install --frozen-lockfile
corepack pnpm build
```

Lệnh build chạy 3 workspace:

- `packages/shared` → tiện ích TypeScript đã biên dịch (`dist/`)
- `app/native-server` → binary CLI `chrome-ai-bridge` (`dist/`)
- `app/chrome-extension` → extension build bằng WXT tại `app/chrome-extension/.output/chrome-mv3/`

> Nếu chỉ cần build lại extension (ví dụ sau khi sửa Vue component), chạy `corepack pnpm --filter chrome-ai-bridge-extension build`.

### Bước 3 — Load bản build cục bộ vào Chrome

1. Mở `chrome://extensions/`.
2. Bật **Developer mode**.
3. Nhấp **Load unpacked**.
4. Chọn thư mục `app/chrome-extension/.output/chrome-mv3/` vừa được build ra.
5. Sau mỗi lần rebuild, quay lại `chrome://extensions/` và nhấp biểu tượng **Reload** trên thẻ extension.

### Bước 4 — Chạy native messaging host cục bộ

Trong quá trình dev, bạn có thể chạy CLI trực tiếp từ output build:

```bash
node app/native-server/dist/cli.js
```

Tương đương với `chrome-ai-bridge` khi cài global, rất tiện khi sửa native host mà không cần cài lại npm package.

---

## 4. Kết nối với MCP client

Extension mặc định expose MCP server tại `http://127.0.0.1:12306/mcp`. Có hai transport được hỗ trợ.

### Streamable HTTP (khuyến nghị)

Thêm entry sau vào cấu hình MCP client:

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

STDIO cần đường dẫn tuyệt đối tới entry point stdio. Trước tiên hãy xác định vị trí:

```bash
npm list -g chrome-ai-bridge
# hoặc
pnpm list -g chrome-ai-bridge
```

Output trông giống:

```
/Users/xxx/Library/pnpm/global/5/node_modules/chrome-ai-bridge
```

Nối thêm `dist/mcp/mcp-server-stdio.js` để có đường dẫn cuối cùng, rồi dùng nó trong client config:

```json
{
  "mcpServers": {
    "chrome-ai-bridge-stdio": {
      "command": "npx",
      "args": [
        "node",
        "/Users/xxx/Library/pnpm/global/5/node_modules/chrome-ai-bridge/dist/mcp/mcp-server-stdio.js"
      ]
    }
  }
}
```

---

## 5. Kiểm tra sau khi cài

1. Mở popup extension và xác nhận trạng thái hiển thị **Đã kết nối**.
2. Từ terminal, chạy nhanh lệnh kiểm tra:

   ```bash
   chrome-ai-bridge doctor
   ```

   Lệnh sẽ báo cáo trạng thái native host, Chrome extension id và cổng đang cấu hình.

3. Trong MCP client (Claude Desktop, Cherry Studio, Cursor, ...), thử gọi một tool thuộc `chrome-ai-bridge`. Nếu round-trip thành công tức là Chrome, native host và MCP client đang nói chuyện đúng với nhau.

---

## 6. Cập nhật

- **Người dùng cuối**: tải bản release ZIP mới, thay thư mục extension cũ bằng thư mục mới, rồi nhấp **Reload** trên thẻ extension tại `chrome://extensions/`. Vì gói npm chưa publish, hãy cập nhật source rồi chạy lại `corepack pnpm install && corepack pnpm build:native && node app/native-server/dist/cli.js register`.
- **Lập trình viên**: `git pull`, rồi chạy lại `corepack pnpm install --frozen-lockfile && corepack pnpm build`, và nhấp **Reload** trên thẻ extension.

---

## 7. Gỡ cài

1. Mở `chrome://extensions/`, tìm **chrome-ai-bridge**, nhấp **Remove**. Xác nhận hộp thoại.
2. Gỡ CLI host toàn cục:

   ```bash
   npm uninstall -g chrome-ai-bridge
   ```

3. Tùy chọn xóa thư mục đã giải nén và thư mục log:
   - macOS: `~/Library/Logs/chrome-ai-bridge/`
   - Windows: `%LOCALAPPDATA%\chrome-ai-bridge\logs\`
   - Linux: `~/.local/state/chrome-ai-bridge/logs/`

---

## 8. Khắc phục sự cố thường gặp

- **Extension báo lỗi sau khi load** — mở nút **Errors** của extension tại `chrome://extensions/`. Hầu hết lỗi load do chọn sai thư mục (ví dụ chọn thư mục cha thay vì thư mục chứa `manifest.json`).
- **MCP client không kết nối được** — chạy `chrome-ai-bridge doctor`. Nếu thiếu native host, chạy lại `chrome-ai-bridge register`.
- **Cổng bị chiếm** — mở popup extension, đổi cổng lắng nghe và cập nhật cấu hình MCP client tương ứng.
- **Cần hỗ trợ thêm** — xem [`docs/TROUBLESHOOTING_VI.md`](TROUBLESHOOTING_VI.md) để có luồng chẩn đoán đầy đủ.
