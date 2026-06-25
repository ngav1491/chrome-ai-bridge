# Hướng dẫn cài đặt chrome-ai-bridge

Tài liệu này mô tả chi tiết quy trình build và đăng ký chrome-ai-bridge Native Messaging host.

> Gói npm hiện chưa publish. Luồng cài đặt khuyến nghị hiện tại là build trực tiếp từ source, sau đó chạy CLI trong thư mục `dist` để đăng ký Native Messaging host.

## Tổng quan quy trình cài đặt từ source

Quy trình build và đăng ký từ source như sau:

```
corepack pnpm build:native
└─ app/native-server/dist/
   ├─ cli.js
   ├─ run_host.sh / run_host.bat
   ├─ node_path.txt
   └─ mcp/mcp-server-stdio.js
node app/native-server/dist/cli.js register
└─ Tạo manifest Native Messaging cấp người dùng (không cần sudo)
   └─ Nếu thất bại ➜ Chạy thủ công với --system bằng quyền quản trị
```

Sơ đồ trên minh họa toàn bộ quá trình từ khi build native server đến khi hoàn tất đăng ký.

## Các bước cài đặt chi tiết

### 1. Build từ source

```bash
git clone https://github.com/ngav1491/chrome-ai-bridge.git
cd chrome-ai-bridge
corepack enable
corepack pnpm install
corepack pnpm build:native
```

Sau khi build xong, đăng ký máy chủ Native Messaging trong thư mục người dùng. Việc này không cần quyền quản trị và là cách cài đặt được khuyến nghị:

```bash
node app/native-server/dist/cli.js register
```

### 2. Đăng ký cấp người dùng

Đăng ký cấp người dùng sẽ tạo tệp manifest tại các vị trí sau:

```
Vị trí tệp manifest
├─ Cấp người dùng (không cần quyền quản trị)
│  ├─ Windows: %APPDATA%\Google\Chrome\NativeMessagingHosts\
│  ├─ macOS:   ~/Library/Application Support/Google/Chrome/NativeMessagingHosts/
│  └─ Linux:   ~/.config/google-chrome/NativeMessagingHosts/
│
└─ Cấp hệ thống (cần quyền quản trị)
   ├─ Windows: %ProgramFiles%\Google\Chrome\NativeMessagingHosts\
   ├─ macOS:   /Library/Google/Chrome/NativeMessagingHosts/
   └─ Linux:   /etc/opt/chrome/native-messaging-hosts/
```

Nếu đăng ký tự động thất bại, hoặc bạn muốn đăng ký thủ công, có thể chạy:

```bash
chrome-ai-bridge register
```

**Khuyến nghị: Chạy công cụ chẩn đoán để kiểm tra vấn đề:**

```bash
chrome-ai-bridge doctor
```

### 3. Đăng ký cấp hệ thống

Nếu đăng ký cấp người dùng thất bại (ví dụ do vấn đề về quyền), bạn có thể thử đăng ký cấp hệ thống. Đăng ký cấp hệ thống cần quyền quản trị, nhưng chúng tôi cung cấp hai cách tiện lợi để hoàn tất quá trình này.

Đăng ký cấp hệ thống có hai cách:

#### Cách 1: Sử dụng tham số `--system` (khuyến nghị)

```bash
# macOS/Linux
sudo chrome-ai-bridge register --system

# Windows (chạy Command Prompt với quyền quản trị)
chrome-ai-bridge register --system
```

Cài đặt cấp hệ thống cần quyền quản trị để ghi vào thư mục hệ thống và registry.

#### Cách 2: Sử dụng trực tiếp quyền quản trị

**Windows**:
Chạy Command Prompt hoặc PowerShell với quyền quản trị, sau đó thực thi:

```
chrome-ai-bridge register
```

**macOS/Linux**:
Sử dụng lệnh sudo:

```
sudo chrome-ai-bridge register
```

## Chi tiết quy trình đăng ký

### Sơ đồ quy trình đăng ký

```
Quy trình đăng ký
├─ Đăng ký cấp người dùng (chrome-ai-bridge register)
│  ├─ Lấy đường dẫn manifest cấp người dùng
│  ├─ Tạo thư mục người dùng
│  ├─ Tạo nội dung manifest
│  ├─ Ghi tệp manifest
│  └─ Nền tảng Windows: tạo mục registry cấp người dùng
│
└─ Đăng ký cấp hệ thống (chrome-ai-bridge register --system)
   ├─ Kiểm tra có quyền quản trị hay không
   │  ├─ Có quyền → Trực tiếp tạo thư mục hệ thống và ghi manifest
   │  └─ Không quyền → Nhắc người dùng chạy với quyền quản trị
   └─ Nền tảng Windows: tạo mục registry cấp hệ thống
```

### Cấu trúc tệp manifest

```
manifest.json
├─ name: "com.ngav1491.chrome_ai_bridge.nativehost"
├─ description: "chrome-ai-bridge Native Messaging host"
├─ path: "/path/to/run_host.sh"       ← Đường dẫn script khởi động
├─ type: "stdio"                      ← Kiểu giao tiếp
└─ allowed_origins: [                 ← Tiện ích mở rộng được phép kết nối
   "chrome-extension://ID-tiện-ích-mở-rộng/"
]
```

### Quy trình đăng ký cấp người dùng

1. Xác định đường dẫn tệp manifest cấp người dùng
2. Tạo các thư mục cần thiết
3. Tạo nội dung manifest, bao gồm:
   - Tên máy chủ
   - Mô tả
   - Đường dẫn tệp thực thi Node.js
   - Kiểu giao tiếp (stdio)
   - ID tiện ích mở rộng được phép
   - Tham số khởi động
4. Ghi tệp manifest
5. Trên Windows, còn tạo mục registry tương ứng

### Quy trình đăng ký cấp hệ thống

1. Kiểm tra đã có quyền quản trị hay chưa
2. Nếu đã có quyền quản trị:
   - Trực tiếp tạo thư mục cấp hệ thống
   - Ghi tệp manifest
   - Thiết lập quyền phù hợp
   - Trên Windows tạo mục registry cấp hệ thống
3. Nếu không có quyền quản trị:
   - Nhắc người dùng chạy lại lệnh với quyền quản trị
   - macOS/Linux: `sudo chrome-ai-bridge register --system`
   - Windows: Chạy Command Prompt với quyền quản trị

## Xác minh cài đặt

### Sơ đồ quy trình xác minh

```
Xác minh cài đặt
├─ Kiểm tra tệp manifest
│  ├─ Tệp tồn tại → Kiểm tra nội dung có đúng không
│  └─ Tệp không tồn tại → Cài đặt lại
│
├─ Kiểm tra tiện ích mở rộng Chrome
│  ├─ Tiện ích đã cài → Kiểm tra quyền tiện ích
│  └─ Tiện ích chưa cài → Cài đặt tiện ích
│
└─ Kiểm tra kết nối
   ├─ Kết nối thành công → Cài đặt hoàn tất
   └─ Kết nối thất bại → Kiểm tra log lỗi → Tham khảo phần khắc phục sự cố
```

### Các bước xác minh

Sau khi cài đặt xong, bạn có thể xác minh cài đặt có thành công hay không qua các cách sau:

1. Kiểm tra tệp manifest có tồn tại trong thư mục tương ứng
   - Cấp người dùng: kiểm tra tệp manifest trong thư mục người dùng
   - Cấp hệ thống: kiểm tra tệp manifest trong thư mục hệ thống
   - Xác nhận nội dung tệp manifest có đúng không

2. Cài đặt tiện ích mở rộng tương ứng trong Chrome
   - Đảm bảo tiện ích đã được cài đặt đúng
   - Đảm bảo tiện ích có quyền `nativeMessaging`

3. Thử kết nối tới dịch vụ nội bộ thông qua tiện ích mở rộng
   - Sử dụng chức năng kiểm tra của tiện ích để thử kết nối
   - Kiểm tra log tiện ích của Chrome xem có thông báo lỗi không

## Khắc phục sự cố

### Sơ đồ quy trình khắc phục sự cố

```
Khắc phục sự cố
├─ Vấn đề về quyền
│  ├─ Kiểm tra quyền người dùng
│  │  ├─ Đủ quyền → Kiểm tra quyền thư mục
│  │  └─ Không đủ quyền → Thử cài đặt cấp hệ thống
│  │
│  ├─ Vấn đề quyền thực thi (macOS/Linux)
│  │  ├─ Lỗi "Permission denied"
│  │  ├─ Lỗi "Native host has exited"
│  │  └─ Chạy chrome-ai-bridge fix-permissions
│  │
│  └─ Thử chrome-ai-bridge register --system
│
├─ Vấn đề về đường dẫn
│  ├─ Kiểm tra cài đặt Node.js (node -v)
│  └─ Kiểm tra đường dẫn NPM toàn cục (npm root -g)
│
├─ Vấn đề registry (Windows)
│  ├─ Kiểm tra quyền truy cập registry
│  └─ Thử tạo mục registry thủ công
│
└─ Vấn đề khác
   ├─ Kiểm tra thông báo lỗi trong console
   └─ Gửi issue tới kho dự án
```

### Các bước giải quyết vấn đề thường gặp

Nếu gặp vấn đề trong quá trình cài đặt, hãy thử các bước sau:

1. Đảm bảo Node.js đã được cài đặt đúng
   - Chạy `node -v` và `npm -v` để kiểm tra phiên bản
   - Đảm bảo phiên bản Node.js >= 20.x

2. Kiểm tra có đủ quyền tạo tệp và thư mục hay không
   - Cài đặt cấp người dùng cần quyền ghi vào thư mục người dùng
   - Cài đặt cấp hệ thống cần quyền quản trị/root

3. **Khắc phục vấn đề quyền thực thi**

   **Nền tảng macOS/Linux**:

   **Mô tả vấn đề**:
   - npm thường giữ nguyên quyền tệp khi cài đặt, nhưng pnpm có thể không
   - Có thể gặp lỗi "Permission denied" hoặc "Native host has exited"
   - Tiện ích Chrome không thể khởi động tiến trình native host

   **Giải pháp**:

   a) **Sử dụng lệnh sửa chữa tích hợp (khuyến nghị)**:

   ```bash
   chrome-ai-bridge fix-permissions
   ```

   b) **Chạy công cụ chẩn đoán để tự động sửa chữa**:

   ```bash
   chrome-ai-bridge doctor --fix
   ```

   c) **Thiết lập quyền thủ công**:

   ```bash
   # Tìm đường dẫn cài đặt
   npm list -g chrome-ai-bridge
   # Hoặc với pnpm
   pnpm list -g chrome-ai-bridge

   # Thiết lập quyền thực thi (thay bằng đường dẫn thực tế)
   chmod +x /path/to/node_modules/chrome-ai-bridge/run_host.sh
   chmod +x /path/to/node_modules/chrome-ai-bridge/index.js
   chmod +x /path/to/node_modules/chrome-ai-bridge/cli.js
   ```

   **Nền tảng Windows**:

   **Mô tả vấn đề**:
   - Trên Windows, tệp `.bat` thường không cần quyền thực thi, nhưng có thể gặp vấn đề khác
   - Tệp có thể bị đánh dấu là chỉ đọc
   - Có thể gặp lỗi "Access denied" hoặc tệp không thể thực thi

   **Giải pháp**:

   a) **Sử dụng lệnh sửa chữa tích hợp (khuyến nghị)**:

   ```cmd
   chrome-ai-bridge fix-permissions
   ```

   b) **Chạy công cụ chẩn đoán để tự động sửa chữa**:

   ```cmd
   chrome-ai-bridge doctor --fix
   ```

   c) **Kiểm tra thuộc tính tệp thủ công**:

   ```cmd
   # Tệp build nằm trong source
   dir app\native-server\dist

   # Kiểm tra thuộc tính tệp (trong File Explorer, nhấp chuột phải -> Properties)
   # Đảm bảo run_host.bat không phải là tệp chỉ đọc
   ```

   d) **Cài đặt lại và ép buộc quyền**:

   ```bash
   # Build lại từ source
   corepack pnpm build:native

   # Nếu vẫn còn vấn đề, chạy sửa chữa quyền trực tiếp từ dist
   node app/native-server/dist/cli.js fix-permissions
   ```

4. Trên Windows, đảm bảo truy cập registry không bị hạn chế
   - Kiểm tra xem có thể truy cập `HKCU\Software\Google\Chrome\NativeMessagingHosts\` hay không
   - Đối với cấp hệ thống, kiểm tra `HKLM\Software\Google\Chrome\NativeMessagingHosts\`

5. Thử sử dụng cài đặt cấp hệ thống
   - Sử dụng lệnh `chrome-ai-bridge register --system`
   - Hoặc chạy trực tiếp với quyền quản trị

6. Kiểm tra thông báo lỗi trong console
   - Thông báo lỗi chi tiết thường chỉ ra vấn đề
   - Có thể thêm tham số `--verbose` để lấy thêm thông tin log

Nếu vấn đề vẫn còn, hãy gửi issue tới kho dự án và đính kèm các thông tin sau:

- Phiên bản hệ điều hành
- Phiên bản Node.js
- Lệnh cài đặt
- Thông báo lỗi
- Các cách giải quyết đã thử
