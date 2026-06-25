# Chrome MCP Server 🚀

[![Stars](https://img.shields.io/github/stars/ngav1491/chrome-ai-bridge)](https://img.shields.io/github/stars/ngav1491/chrome-ai-bridge)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.8+-blue.svg)](https://www.typescriptlang.org/)
[![Chrome Extension](https://img.shields.io/badge/Chrome-Extension-green.svg)](https://developer.chrome.com/docs/extensions/)
[![Release](https://img.shields.io/github/v/release/ngav1491/chrome-ai-bridge.svg)](https://img.shields.io/github/v/release/ngav1491/chrome-ai-bridge.svg)

> 🌟 **Biến trình duyệt Chrome của bạn thành trợ lý thông minh** - Để AI kiểm soát trình duyệt của bạn, biến nó thành công cụ tự động hóa mạnh mẽ được điều khiển bởi AI.

**📖 Tài liệu**: [English](README.md) | [Tiếng Việt](README_vi.md)

> Dự án vẫn đang trong giai đoạn đầu và đang được phát triển tích cực. Sẽ có thêm nhiều tính năng, cải thiện độ ổn định và các nâng cấp khác trong tương lai.

---

## 🎯 Chrome MCP Server là gì?

Chrome MCP Server là một **máy chủ Model Context Protocol (MCP)** dựa trên tiện ích mở rộng Chrome, cho phép các trợ lý AI như Claude truy cập vào các chức năng của trình duyệt Chrome của bạn, từ đó thực hiện các tác vụ tự động hóa trình duyệt phức tạp, phân tích nội dung và tìm kiếm ngữ nghĩa. Khác với các công cụ tự động hóa trình duyệt truyền thống (như Playwright), **Chrome MCP Server** sử dụng trực tiếp trình duyệt Chrome hàng ngày của bạn, tận dụng các thói quen, cấu hình và trạng thái đăng nhập hiện có, cho phép các mô hình ngôn ngữ lớn hoặc chatbot khác nhau kiểm soát trình duyệt của bạn và thực sự trở thành trợ lý hàng ngày của bạn.

## ✨ Tính năng mới (2025/12/30)

- **Trình chỉnh sửa trực quan mới dành cho Claude Code & Codex**, để biết chi tiết vui lòng xem: [VisualEditor](docs/VisualEditor.md)

## ✨ Tính năng cốt lõi

- 😁 **Không phụ thuộc chatbot/mô hình**: Cho phép bất kỳ LLM, chatbot client hay agent nào bạn thích tự động hóa trình duyệt của bạn
- ⭐️ **Sử dụng trình duyệt gốc của bạn**: Tích hợp liền mạch với môi trường trình duyệt hiện có của bạn (cấu hình, trạng thái đăng nhập, v.v.)
- 💻 **Hoàn toàn cục bộ**: Máy chủ MCP chạy thuần túy cục bộ, đảm bảo quyền riêng tư của người dùng
- 🚄 **Streamable HTTP**: Phương thức kết nối Streamable HTTP
- 🏎 **Liên thẻ (Cross-tab)**: Ngữ cảnh liên thẻ
- 🧠 **Tìm kiếm ngữ nghĩa**: Cơ sở dữ liệu vector tích hợp để khám phá nội dung thẻ trình duyệt thông minh
- 🔍 **Phân tích nội dung thông minh**: Trích xuất văn bản và so khớp độ tương tự được hỗ trợ bởi AI
- 🌐 **Hơn 20 công cụ**: Hỗ trợ chụp màn hình, giám sát mạng, thao tác tương tác, quản lý dấu trang, lịch sử duyệt web và hơn 20 công cụ khác
- 🚀 **AI tăng tốc SIMD**: Tối ưu hóa WebAssembly SIMD tùy chỉnh, tăng tốc độ tính toán vector nhanh hơn 4-8 lần

## 🆚 So sánh với các dự án tương tự

| Tiêu chí so sánh           | MCP Server dựa trên Playwright                                                                                          | MCP Server dựa trên tiện ích Chrome                                                                              |
| -------------------------- | ----------------------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------- |
| **Sử dụng tài nguyên**     | ❌ Yêu cầu khởi chạy tiến trình trình duyệt độc lập, cài đặt phụ thuộc Playwright, tải xuống nhị phân trình duyệt, v.v. | ✅ Không cần khởi chạy tiến trình trình duyệt độc lập, sử dụng trực tiếp trình duyệt Chrome đã mở của người dùng |
| **Tái sử dụng phiên**      | ❌ Yêu cầu đăng nhập lại                                                                                                | ✅ Tự động sử dụng trạng thái đăng nhập hiện có                                                                  |
| **Môi trường trình duyệt** | ❌ Môi trường sạch, thiếu cài đặt của người dùng                                                                        | ✅ Bảo toàn toàn bộ môi trường của người dùng                                                                    |
| **Quyền truy cập API**     | ⚠️ Giới hạn ở API Playwright                                                                                            | ✅ Truy cập đầy đủ các API gốc của Chrome                                                                        |
| **Tốc độ khởi động**       | ❌ Cần khởi chạy tiến trình trình duyệt                                                                                 | ✅ Chỉ cần kích hoạt tiện ích                                                                                    |
| **Tốc độ phản hồi**        | Giao tiếp giữa các tiến trình 50-200ms                                                                                  | ✅ Nhanh hơn                                                                                                     |

## 🚀 Bắt đầu nhanh

### Yêu cầu môi trường

- Node.js >= 20.0.0 và pnpm/npm
- Trình duyệt Chrome/Chromium

### Các bước cài đặt

1. **Tải xuống tiện ích Chrome mới nhất từ GitHub**

Liên kết tải xuống: https://github.com/ngav1491/chrome-ai-bridge/releases

2. **Cài đặt và đăng ký chrome-ai-bridge trực tiếp từ source**

> Gói npm hiện chưa publish. Tạm thời hãy cài trực tiếp từ repository này.

```bash
git clone https://github.com/ngav1491/chrome-ai-bridge.git
cd chrome-ai-bridge
corepack enable
corepack pnpm install
corepack pnpm build:native
node app/native-server/dist/cli.js register
```

Nếu cần đăng ký Native Messaging ở cấp hệ thống:

```bash
sudo node app/native-server/dist/cli.js register --system
```

Sau khi gói npm được publish, luồng cài đặt toàn cục sẽ là:

```bash
npm install -g chrome-ai-bridge
chrome-ai-bridge register
```

3. **Tải tiện ích Chrome**
   - Mở Chrome và truy cập `chrome://extensions/`
   - Bật "Chế độ nhà phát triển"
   - Nhấp "Tải tiện ích đã giải nén" và chọn `your/dowloaded/extension/folder`
   - Nhấp biểu tượng tiện ích để mở plugin, sau đó nhấp kết nối để xem cấu hình MCP
     <img width="475" alt="Screenshot 2025-06-09 15 52 06" src="https://github.com/user-attachments/assets/241e57b8-c55f-41a4-9188-0367293dc5bc" />

### Sử dụng với các client hỗ trợ giao thức MCP

#### Sử dụng kết nối Streamable HTTP (👍🏻 Khuyến nghị)

Thêm cấu hình sau vào cấu hình MCP client của bạn (ví dụ sử dụng CherryStudio):

> Phương thức kết nối Streamable HTTP được khuyến nghị

```json
{
  "mcpServers": {
    "chrome-mcp-server": {
      "type": "streamableHttp",
      "url": "http://127.0.0.1:12306/mcp"
    }
  }
}
```

#### Sử dụng kết nối STDIO (Phương án thay thế)

Nếu client của bạn chỉ hỗ trợ phương thức kết nối stdio, vui lòng sử dụng phương pháp sau:

1. Build native server từ source, sau đó dùng đường dẫn stdio server đã tạo:

```sh
corepack pnpm build:native
```

Nếu repository của bạn nằm tại `/path/to/chrome-ai-bridge`, đường dẫn stdio server là:

```text
/path/to/chrome-ai-bridge/app/native-server/dist/mcp/mcp-server-stdio.js
```

2. Thay thế cấu hình dưới đây bằng đường dẫn source cục bộ của bạn

```json
{
  "mcpServers": {
    "chrome-mcp-stdio": {
      "command": "npx",
      "args": ["node", "/path/to/chrome-ai-bridge/app/native-server/dist/mcp/mcp-server-stdio.js"]
    }
  }
}
```

Ví dụ: cấu hình trong augment:

<img width="494" alt="Ảnh chụp màn hình 2025-06-22 22 11 25" src="https://github.com/user-attachments/assets/48eefc0c-a257-4d3b-8bbe-d7ff716de2bf" />

## 🛠️ Các công cụ có sẵn

Danh sách công cụ đầy đủ: [Danh sách công cụ đầy đủ](docs/TOOLS.md)

<details>
<summary><strong>📊 Quản lý trình duyệt (6 công cụ)</strong></summary>

- `get_windows_and_tabs` - Liệt kê tất cả cửa sổ và thẻ trình duyệt
- `chrome_navigate` - Điều hướng đến URL và điều khiển khung nhìn
- `chrome_switch_tab` - Chuyển thẻ đang hoạt động hiện tại
- `chrome_close_tabs` - Đóng các thẻ hoặc cửa sổ cụ thể
- `chrome_go_back_or_forward` - Điều khiển điều hướng trình duyệt
- `chrome_inject_script` - Tiêm content script vào các trang web
- `chrome_send_command_to_inject_script` - Gửi lệnh đến các content script đã tiêm
</details>

<details>
<summary><strong>📸 Chụp màn hình & Thị giác (1 công cụ)</strong></summary>

- `chrome_screenshot` - Chụp màn hình nâng cao với khả năng nhắm mục tiêu phần tử, hỗ trợ toàn trang và kích thước tùy chỉnh
</details>

<details>
<summary><strong>🌐 Giám sát mạng (4 công cụ)</strong></summary>

- `chrome_network_capture_start/stop` - Bắt gói tin mạng qua API webRequest
- `chrome_network_debugger_start/stop` - API Debugger bao gồm cả nội dung phản hồi
- `chrome_network_request` - Gửi yêu cầu HTTP tùy chỉnh
</details>

<details>
<summary><strong>🔍 Phân tích nội dung (4 công cụ)</strong></summary>

- `search_tabs_content` - Tìm kiếm ngữ nghĩa được hỗ trợ bởi AI trên các thẻ trình duyệt
- `chrome_get_web_content` - Trích xuất nội dung HTML/văn bản từ các trang
- `chrome_get_interactive_elements` - Tìm các phần tử có thể nhấp
- `chrome_console` - Bắt và lấy đầu ra console từ các thẻ trình duyệt
</details>

<details>
<summary><strong>🎯 Tương tác (3 công cụ)</strong></summary>

- `chrome_click_element` - Nhấp vào các phần tử bằng bộ chọn CSS
- `chrome_fill_or_select` - Điền biểu mẫu và chọn tùy chọn
- `chrome_keyboard` - Mô phỏng nhập bàn phím và phím tắt
</details>

<details>
<summary><strong>📚 Quản lý dữ liệu (5 công cụ)</strong></summary>

- `chrome_history` - Tìm kiếm lịch sử trình duyệt với bộ lọc thời gian
- `chrome_bookmark_search` - Tìm dấu trang theo từ khóa
- `chrome_bookmark_add` - Thêm dấu trang mới với hỗ trợ thư mục
- `chrome_bookmark_delete` - Xóa dấu trang
</details>

## 🧪 Ví dụ sử dụng

### AI giúp bạn tóm tắt nội dung trang web và tự động điều khiển Excalidraw để vẽ

prompt: [excalidraw-prompt](prompt/excalidraw-prompt.md)
Hướng dẫn: Hãy giúp tôi tóm tắt nội dung trang hiện tại, sau đó vẽ sơ đồ để hỗ trợ hiểu bài.
https://www.youtube.com/watch?v=3fBPdUBWVz0

https://github.com/user-attachments/assets/fd17209b-303d-48db-9e5e-3717141df183

### Sau khi phân tích nội dung hình ảnh, LLM tự động điều khiển Excalidraw để tái tạo hình ảnh

prompt: [excalidraw-prompt](prompt/excalidraw-prompt.md)|[content-analize](prompt/content-analize.md)
Hướng dẫn: Trước tiên, phân tích nội dung của hình ảnh, sau đó tái tạo hình ảnh bằng cách kết hợp phân tích với nội dung hình ảnh.
https://www.youtube.com/watch?v=tEPdHZBzbZk

https://github.com/user-attachments/assets/60d12b1a-9b74-40f4-994c-95e8fa1fc8d3

### AI tự động tiêm script và sửa đổi kiểu trang web

prompt: [modify-web-prompt](prompt/modify-web.md)
Hướng dẫn: Hãy giúp tôi sửa đổi kiểu của trang hiện tại và loại bỏ quảng cáo.
https://youtu.be/twI6apRKHsk

https://github.com/user-attachments/assets/69cb561c-2e1e-4665-9411-4a3185f9643e

### AI tự động bắt các yêu cầu mạng cho bạn

truy vấn: Tôi muốn biết API tìm kiếm của Xiaohongshu là gì và cấu trúc phản hồi trông như thế nào

https://youtu.be/1hHKr7XKqnQ

https://github.com/user-attachments/assets/dc7e5cab-b9af-4b9a-97ce-18e4837318d9

### AI giúp phân tích lịch sử duyệt web của bạn

truy vấn: Phân tích lịch sử duyệt web của tôi trong tháng qua

https://youtu.be/jf2UZfrR2Vk

https://github.com/user-attachments/assets/31b2e064-88c6-4adb-96d7-50748b826eae

### Hội thoại trên trang web

truy vấn: Dịch và tóm tắt trang web hiện tại
https://youtu.be/FlJKS9UQyC8

https://github.com/user-attachments/assets/aa8ef2a1-2310-47e6-897a-769d85489396

### AI tự động chụp màn hình cho bạn (chụp màn hình trang web)

truy vấn: Chụp màn hình trang chủ của Hugging Face
https://youtu.be/7ycK6iksWi4

https://github.com/user-attachments/assets/65c6eee2-6366-493d-a3bd-2b27529ff5b3

### AI tự động chụp màn hình cho bạn (chụp màn hình phần tử)

truy vấn: Chụp biểu tượng từ trang chủ của Hugging Face
https://youtu.be/ev8VivANIrk

https://github.com/user-attachments/assets/d0cf9785-c2fe-4729-a3c5-7f2b8b96fe0c

### AI giúp quản lý dấu trang

truy vấn: Thêm trang hiện tại vào dấu trang và đặt vào thư mục phù hợp

https://youtu.be/R_83arKmFTo

https://github.com/user-attachments/assets/15a7d04c-0196-4b40-84c2-bafb5c26dfe0

### Tự động đóng các trang web

truy vấn: Đóng tất cả các trang web liên quan đến shadcn

https://youtu.be/2wzUT6eNVg4

https://github.com/user-attachments/assets/83de4008-bb7e-494d-9b0f-98325cfea592

## 🤝 Đóng góp

Chúng tôi hoan nghênh mọi đóng góp! Vui lòng xem [CONTRIBUTING.md](docs/CONTRIBUTING.md) để biết hướng dẫn chi tiết.

## 🚧 Lộ trình tương lai

Chúng tôi có những kế hoạch thú vị cho sự phát triển tương lai của Chrome MCP Server:

- [ ] Xác thực
- [ ] Ghi và phát lại
- [ ] Tự động hóa quy trình làm việc
- [ ] Hỗ trợ trình duyệt nâng cao (Tiện ích Firefox)

---

**Muốn đóng góp cho bất kỳ tính năng nào trong số này?** Hãy xem [Hướng dẫn đóng góp](docs/CONTRIBUTING.md) và tham gia cộng đồng phát triển của chúng tôi!

## 📄 Giấy phép

Dự án này được cấp phép theo Giấy phép MIT - xem tệp [LICENSE](LICENSE) để biết chi tiết.

## 📚 Thêm tài liệu

- [Thiết kế kiến trúc](docs/ARCHITECTURE.md) - Tài liệu kiến trúc kỹ thuật chi tiết
- [API công cụ](docs/TOOLS.md) - Tài liệu API công cụ đầy đủ
- [Khắc phục sự cố](docs/TROUBLESHOOTING.md) - Giải pháp cho các sự cố thường gặp

## Nhóm trao đổi WeChat

Mục đích của nhóm là để các chuyên gia đã từng gặp sự cố giúp nhau giải đáp câu hỏi. Vì tác giả bận làm việc khác nên có thể không phản hồi kịp thời.

![IMG_6296](https://github.com/user-attachments/assets/ecd2e084-24d2-4038-b75f-3ab020b55594)
