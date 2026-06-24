# Hướng dẫn đóng góp 🤝

Cảm ơn bạn đã quan tâm đến việc đóng góp cho dự án Chrome MCP Server! Tài liệu này cung cấp hướng dẫn và thông tin cho các cộng tác viên.

## 🎯 Cách đóng góp

Chúng tôi hoan nghênh nhiều hình thức đóng góp:

- 🐛 Báo cáo và sửa lỗi
- ✨ Tính năng và công cụ mới
- 📚 Cải thiện tài liệu
- 🧪 Kiểm thử và tối ưu hóa hiệu năng
- 🌐 Dịch thuật và quốc tế hóa
- 💡 Ý tưởng và đề xuất

## 🚀 Bắt đầu đóng góp

### Yêu cầu môi trường

- **Node.js 20+** và **pnpm** (phiên bản mới nhất)
- Trình duyệt **Chrome/Chromium** để kiểm thử
- **Git** để quản lý phiên bản
- **Rust** (để phát triển WASM, tùy chọn)
- Kiến thức về **TypeScript**

### Thiết lập môi trường phát triển

1. **Fork và sao chép kho mã nguồn**

```bash
git clone https://github.com/YOUR_USERNAME/chrome-mcp-server.git
cd chrome-mcp-server
```

2. **Cài đặt các phụ thuộc**

```bash
pnpm install
```

3. **Khởi động dự án**

```bash
npm run dev
```

4. **Tải tiện ích trong Chrome**
   - Mở `chrome://extensions/`
   - Bật "Chế độ nhà phát triển"
   - Nhấp "Tải tiện ích đã giải nén", chọn `your/extension/dist`

## 🏗️ Cấu trúc dự án

```
chrome-mcp-server/
├── app/
│   ├── chrome-extension/     # Tiện ích Chrome (WXT + Vue 3)
│   │   ├── entrypoints/      # Script nền, popup, content script
│   │   ├── utils/            # Mô hình AI, cơ sở dữ liệu vector, tiện ích
│   │   └── workers/          # Web Workers để xử lý AI
│   └── native-server/        # Máy chủ tin nhắn gốc (Fastify + TypeScript)
│       ├── src/mcp/          # Triển khai giao thức MCP
│       └── src/server/       # Máy chủ HTTP và tin nhắn gốc
├── packages/
│   ├── shared/               # Kiểu và tiện ích chia sẻ
│   └── wasm-simd/           # Hàm toán học WebAssembly được tối ưu hóa SIMD
└── docs/                    # Tài liệu
```

## 🛠️ Quy trình phát triển

### Thêm công cụ mới

1. **Định nghĩa schema công cụ trong `packages/shared/src/tools.ts`**:

```typescript
{
  name: 'your_new_tool',
  description: 'Mô tả chức năng công cụ của bạn',
  inputSchema: {
    type: 'object',
    properties: {
      // Định nghĩa tham số
    },
    required: ['param1']
  }
}
```

2. **Triển khai công cụ trong `app/chrome-extension/entrypoints/background/tools/browser/`**:

```typescript
class YourNewTool extends BaseBrowserToolExecutor {
  name = TOOL_NAMES.BROWSER.YOUR_NEW_TOOL;

  async execute(args: YourToolParams): Promise<ToolResult> {
    // Triển khai
  }
}
```

3. **Xuất công cụ trong `app/chrome-extension/entrypoints/background/tools/browser/index.ts`**

4. **Thêm kiểm thử trong thư mục kiểm thử tương ứng**

### Hướng dẫn phong cách mã

- **TypeScript**: Sử dụng TypeScript nghiêm ngặt với các kiểu phù hợp
- **ESLint**: Tuân theo các quy tắc ESLint đã cấu hình (`pnpm lint`)
- **Prettier**: Sử dụng Prettier để định dạng mã (`pnpm format`)
- **Đặt tên**: Sử dụng tên mô tả và tuân theo các mẫu hiện có
- **Chú thích**: Thêm chú thích JSDoc cho API công khai
- **Xử lý lỗi**: Luôn xử lý lỗi một cách linh hoạt

## 📝 Quy trình Pull Request

1. **Tạo nhánh tính năng**

```bash
git checkout -b feature/your-feature-name
```

2. **Thực hiện thay đổi**
   - Tuân theo hướng dẫn phong cách mã
   - Thêm kiểm thử cho tính năng mới
   - Cập nhật tài liệu nếu cần

3. **Kiểm thử thay đổi của bạn**
   - Đảm bảo tất cả các kiểm thử hiện có đều vượt qua
   - Kiểm thử thủ công tiện ích Chrome
   - Xác nhận tính tương thích của giao thức MCP

4. **Cam kết thay đổi của bạn**

```bash
git add .
git commit -m "feat: thêm mô tả tính năng của bạn"
```

Chúng tôi sử dụng [Conventional Commits](https://www.conventionalcommits.org/):

- `feat:` cho tính năng mới
- `fix:` cho sửa lỗi
- `docs:` cho thay đổi tài liệu
- `test:` cho việc thêm kiểm thử
- `refactor:` cho tái cấu trúc mã

5. **Đẩy và tạo Pull Request**

```bash
git push origin feature/your-feature-name
```

## 🐛 Báo cáo lỗi

Khi báo cáo lỗi, vui lòng bao gồm:

- **Môi trường**: Hệ điều hành, phiên bản Chrome, phiên bản Node.js
- **Các bước tái tạo**: Hướng dẫn từng bước rõ ràng
- **Hành vi mong đợi**: Điều gì sẽ xảy ra
- **Hành vi thực tế**: Điều gì đã xảy ra
- **Ảnh chụp màn hình/Nhật ký**: Nếu có
- **Client MCP**: Client MCP bạn đang sử dụng (Claude Desktop, v.v.)

## 💡 Yêu cầu tính năng

Đối với yêu cầu tính năng, vui lòng cung cấp:

- **Trường hợp sử dụng**: Tại sao cần tính năng này?
- **Giải pháp đề xuất**: Nó nên hoạt động như thế nào?
- **Các phương án thay thế**: Có giải pháp thay thế nào đã xem xét không?
- **Ngữ cảnh bổ sung**: Ảnh chụp màn hình, ví dụ, v.v.

## 🔧 Mẹo phát triển

### Sử dụng WASM SIMD

Nếu bạn muốn đóng góp cho package WASM SIMD:

```bash
cd packages/wasm-simd
# Cài đặt Rust và wasm-pack nếu chưa có
curl --proto '=https' --tlsv1.2 -sSf https://sh.rustup.rs | sh
cargo install wasm-pack

# Xây dựng gói WASM
pnpm build

# Các tệp đã xây dựng sẽ được sao chép vào app/chrome-extension/workers/
```

### Gỡ lỗi tiện ích Chrome

- Sử dụng Chrome DevTools để gỡ lỗi popup và script nền của tiện ích
- Kiểm tra `chrome://extensions/` để xem lỗi tiện ích
- Sử dụng câu lệnh `console.log` để gỡ lỗi
- Giám sát kết nối tin nhắn gốc trong script nền

### Kiểm thử giao thức MCP

- Sử dụng MCP Inspector để gỡ lỗi giao thức
- Kiểm thử với các client MCP khác nhau (Claude Desktop, client tùy chỉnh)
- Xác nhận schema công cụ và phản hồi tuân thủ đặc tả MCP

## 📚 Tài nguyên

- [Đặc tả Model Context Protocol](https://modelcontextprotocol.io/)
- [Phát triển tiện ích Chrome](https://developer.chrome.com/docs/extensions/)
- [Tài liệu framework WXT](https://wxt.dev/)
- [Sổ tay TypeScript](https://www.typescriptlang.org/docs/)

## 🤝 Cộng đồng

- **GitHub Issues**: Dùng cho báo cáo lỗi và yêu cầu tính năng
- **GitHub Discussions**: Dùng cho câu hỏi và thảo luận chung
- **Pull Requests**: Dùng cho đóng góp mã

## 📄 Giấy phép

Bằng việc đóng góp cho Chrome MCP Server, bạn đồng ý rằng đóng góp của bạn sẽ được cấp phép theo Giấy phép MIT.

## 🎯 Hướng dẫn cho người đóng góp

### Người đóng góp mới

Nếu bạn lần đầu đóng góp cho dự án mã nguồn mở:

1. **Bắt đầu từ những việc nhỏ**: Tìm các vấn đề được gắn nhãn "good first issue"
2. **Đọc mã**: Làm quen với cấu trúc dự án và phong cách mã hóa
3. **Đặt câu hỏi**: Đặt câu hỏi trong GitHub Discussions
4. **Học công cụ**: Tìm hiểu Git, GitHub, TypeScript và các công cụ khác

### Người đóng góp có kinh nghiệm

- **Cải tiến kiến trúc**: Đề xuất cải tiến cấp hệ thống
- **Tối ưu hóa hiệu năng**: Xác định và sửa các điểm nghẽn hiệu năng
- **Tính năng mới**: Thiết kế và triển khai các tính năng mới phức tạp
- **Hướng dẫn người mới**: Giúp người đóng góp mới bắt đầu

### Đóng góp tài liệu

- **Tài liệu API**: Cải thiện tài liệu và ví dụ về công cụ
- **Hướng dẫn**: Tạo hướng dẫn sử dụng và thực hành tốt nhất
- **Bản dịch**: Giúp dịch tài liệu sang các ngôn ngữ khác
- **Nội dung video**: Tạo video demo và hướng dẫn

### Đóng góp kiểm thử

- **Kiểm thử đơn vị**: Viết kiểm thử cho các tính năng mới
- **Kiểm thử tích hợp**: Kiểm thử sự tương tác giữa các thành phần
- **Kiểm thử hiệu năng**: Benchmark và phát hiện hồi quy hiệu năng
- **Kiểm thử người dùng**: Kiểm thử chức năng trong các tình huống thực tế

## 🏆 Ghi nhận người đóng góp

Chúng tôi đánh giá mọi đóng góp, dù lớn hay nhỏ. Người đóng góp sẽ được ghi nhận theo các cách sau:

- **Ghi nhận trong README**: Liệt kê người đóng góp trong README của dự án
- **Ghi chú phát hành**: Cảm ơn người đóng góp trong ghi chú phát hành phiên bản
- **Huy hiệu người đóng góp**: Huy hiệu người đóng góp trên hồ sơ GitHub
- **Ghi nhận cộng đồng**: Cảm ơn đặc biệt trong các thảo luận cộng đồng

Cảm ơn bạn đã cân nhắc đóng góp cho Chrome MCP Server! Sự tham gia của bạn giúp dự án này trở nên tốt hơn.
