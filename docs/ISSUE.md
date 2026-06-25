# Tổng quan Issues

## Thông tin thống kê

- **Tổng số Issue**: 183
- **Đang mở**: 116
- **Đã đóng**: 67
- **Tỷ lệ đóng**: 36.6%
- **Cập nhật lần cuối**: 2025-10-11

## Mục lục

- [Yêu cầu tính năng](#yeu-cau-tinh-nang)
- [Báo cáo bug](#bao-cao-bug)
- [Sự cố cài đặt](#su-co-cai-dat)
- [Sự cố cấu hình](#su-co-cau-hinh)
- [Sự cố tương thích](#su-co-tuong-thich)
- [Cải thiện tài liệu](#cai-thien-tai-lieu)
- [Sự cố đã giải quyết](#su-co-da-giai-quyet)

---

## Yêu cầu tính năng

### Đang mở

- **#215 Dữ liệu lấy từ `chrome_console` không đầy đủ**: cần làm rõ phạm vi dữ liệu console được thu thập và cách biểu diễn object.
- **#207 Ảnh chụp màn hình không thể tự động lưu**: mong muốn ảnh chụp màn hình có thể tự động lưu thay vì phải nhấp thủ công.
- **#205 Hỗ trợ lấy dữ liệu từ clipboard để điền vào ô nhập**: cần cân nhắc quyền clipboard, Inject Script và giới hạn CSP.
- **#202 Sử dụng trong ứng dụng Electron**: cần hướng dẫn tích hợp MCP với ứng dụng Electron.
- **#201 Không lấy được thông tin từ dialog**: cần kiểm tra cách đọc dialog, token và JavaScript runtime.
- **#200 Cách cuộn trang**: cần ví dụ thao tác cuộn bằng `chrome-mcp`, phím Space và lệnh điều hướng.
- **#190 Hỗ trợ tải mô hình cục bộ ngoại tuyến**: cần làm rõ khả năng chạy với mô hình local hoặc Hugging Face.
- **#183 Lưu HTML đang hiển thị trong Chrome**: cần ví dụ lấy HTML hiện tại bằng Chrome MCP.
- **#180 Vấn đề trạng thái kết nối**: cần cải thiện cách hiển thị và diễn giải trạng thái.
- **#178 Browser chạy nền**: mong muốn trình duyệt có thể chạy im lặng trong nền.
- **#177 Tích hợp n8n**: cần tài liệu sử dụng trong workflow n8n.
- **#175 Khởi động MCP server ở chế độ SSE**: cần bổ sung hướng dẫn SSE trong README.
- **#171 Điều khiển nhóm thẻ**: mong muốn tạo, xóa và thêm tab vào tab group.
- **#169 Biến môi trường để tắt công cụ cụ thể**: cần cơ chế cấu hình danh sách tool được bật hoặc tắt.
- **#162 Giới hạn tốc độ khi tool mất kiểm soát**: cần rate limit để bảo vệ trình duyệt thật.
- **#157 Chrome Web Store**: cần kế hoạch phát hành trên Chrome Web Store.
- **#155 Thông minh hơn**: mong muốn MCP tự phân tích mã nguồn trang hiện tại và chọn phương pháp thao tác phù hợp.
- **#153 `chrome_inject_script` không hoạt động trên một số site**: cần hỗ trợ nhiều điểm tiêm script hoặc hướng fallback.
- **#141 Hỗ trợ hover và cô lập MCP đa cửa sổ**: cần bổ sung thao tác hover và quản lý nhiều cửa sổ độc lập.

### Đã đóng

- **#145 Add file upload capability for web forms**: đã thêm khả năng tải tệp cho biểu mẫu web.
- **#107 Support .dxt format**: đã hỗ trợ định dạng `.dxt` để cài đặt thuận tiện hơn.

---

## Báo cáo bug

### Đang mở

- **#215 `chrome_console` trả dữ liệu không đầy đủ**: phản hồi console cần biểu diễn object rõ hơn.
- **#212 Lỗi gọi công cụ**: cần bổ sung thông tin lỗi và cách tái hiện.
- **#209 Ví dụ đầu tiên gọi được MCP nhưng không vẽ**: cần kiểm tra luồng Excalidraw và quyền script.
- **#206 Lỗi request**: MCP session ID cho SSE không hợp lệ hoặc bị thiếu.
- **#204 Mở URL extension bất thường**: Chrome báo không thể truy cập tệp khi mở `chrome-extension://.../true`.
- **#191 `chrome_console` yêu cầu trang hiện tại không mở DevTools**: đây là giới hạn cơ chế của Chrome.
- **#184 Trae timeout 60 giây**: cần kiểm tra timeout và luồng gọi tool.
- **#163 `chrome_screenshot` vượt quá token tối đa**: phản hồi ảnh chụp màn hình quá lớn.
- **#152 Lỗi khi thực thi đồng thời**: cần kiểm tra khóa theo `tabId` và quản lý concurrency.
- **#149 Luôn báo inject script thất bại**: cần thêm log chi tiết cho site bị lỗi.
- **#144 Mở trang rồi chờ đến timeout**: cần cải thiện điều kiện chờ page load.
- **#142 Lỗi với môi trường qweb3 4b**: cần thông tin cấu hình và log.
- **#139 Request timed out after 30000ms**: cần phân loại timeout theo tool.
- **#128 Vấn đề chưa có mô tả đầy đủ**: cần bổ sung bước tái hiện.
- **#122 Timeout sau 30 giây thay vì 10 giây**: cần thống nhất cấu hình timeout.
- **#118 Vấn đề với Cloudflare**: cần lưu ý giới hạn tự động hóa trên trang có bảo vệ bot.
- **#114 Vấn đề với AI, alert và confirm**: cần cải thiện xử lý hộp thoại trình duyệt.
- **#112 `chrome_network_debugger` và `maxRequests`**: cần làm rõ giới hạn mặc định và cấu hình.
- **#111 Lỗi trong Cherry Studio**: `Cannot read properties of undefined (reading 'map')`.
- **#99 `chrome_get_web_content`**: cần kiểm tra cách trích nội dung từ trang có mô tả phức tạp.
- **#92 AI xử lý alert và confirm**: cần tài liệu thao tác với dialog.
- **#67 Windows function call**: cần log môi trường Windows để phân tích.

### Đã đóng

- **#140 Vấn đề đã đóng nhưng thiếu mô tả**: giữ lại để tra cứu lịch sử.
- **#116 Vấn đề đã đóng sau nhiều lần báo lỗi**: cần tham chiếu issue gốc khi cần.
- **#60 Claude Code, emoji và `console.log`**: đã xử lý lỗi liên quan JSON và log.

---

## Sự cố cài đặt

### Đang mở

- **#198 Cài đặt gặp lỗi Node.js**: cần kiểm tra phiên bản Node.js và lệnh cài đặt.
- **#187 Connected, Service Not Started**: Native Server đã kết nối nhưng service chưa chạy.
- **#174 Browser in Docker + Chrome MCP**: cần hướng dẫn chạy Chrome trong Docker.
- **#170 Claude Code integration on WSL**: cần bổ sung cấu hình WSL cho MCP server.
- **#159 WSL Support?**: cần xác nhận phạm vi hỗ trợ WSL.
- **#148 Chrome báo failed**: cần log cài đặt extension.
- **#147 Cài đặt bằng Docker**: cần hướng dẫn Docker rõ ràng hơn.
- **#143 Cài đặt MCP**: cần kiểm tra cấu hình client.
- **#138 Chrome binding tới `0.0.0.0` hoặc `127.0.0.1`**: cần làm rõ host nên dùng.
- **#137 Windows và `run_host.bat`**: cần kiểm tra script chạy trên Windows.
- **#127 Vấn đề cài đặt thiếu mô tả**: cần yêu cầu thêm log.
- **#115 Vấn đề cài đặt thiếu mô tả**: cần yêu cầu thêm thông tin hệ điều hành.
- **#106 Vấn đề cài đặt thiếu mô tả**: cần bổ sung bước tái hiện.
- **#90 `run_hosts.sh` bị treo**: cần thêm timeout hoặc log tiến trình.
- **#88 Failed to install on Apple Silicon Mac**: cần kiểm tra kiến trúc ARM64.
- **#85 Session termination 400**: cần kiểm tra cấu hình session shared.
- **#68 `mcp-chrome-bridge -v` báo `ERR_REQUIRE_ESM`**: cần xác nhận phiên bản Node.js.
- **#65 Mac M4**: cần cập nhật troubleshooting cho macOS mới.
- **#62 Vấn đề cài đặt thiếu mô tả**: cần yêu cầu thêm log.

### Đã đóng

- **#196 Native Messaging không hoạt động trong Chromium**: đã có hướng xử lý qua PR liên quan.
- **#161 Connected, Service Not Started**: đã có hướng khắc phục cho một số môi trường.
- **#154 Chrome thiếu `manifest_version`**: đã xử lý lỗi manifest.
- **#81 Chromium trên Linux và thư mục cấu hình**: đã ghi nhận đường dẫn `.config/chromium`.
- **#69 Firefox**: ngoài phạm vi Chrome extension hiện tại.
- **#64 Linux**: đã đóng sau khi có hướng xử lý.
- **#22 Mac và Native Messaging**: đã đóng sau khi cập nhật hướng dẫn.
- **#16 Server startup**: đã đóng sau khi điều chỉnh cấu hình.

---

## Sự cố cấu hình

### Đang mở

- **#213 Cấu hình Cursor**: cần hướng dẫn cấu hình MCP trong Cursor.
- **#199 Claude Code CLI**: cần làm rõ lệnh và cấu hình server.
- **#188 Windsurf**: lỗi `TransformStream is not defined`.
- **#185 Kiro báo thiếu command**: cần ví dụ cấu hình `streamable-http` cho Kiro.
- **#182 Claude CLI không kết nối tới server trên macOS**: cần kiểm tra host, port và quyền Native Messaging.
- **#173 Claude Code và `streamableHttp`**: cần thống nhất ví dụ cấu hình.
- **#168 Failed to parse MCP servers from JSON**: cần kiểm tra JSON cấu hình.
- **#167 Claude Code MCP**: lỗi `Native connection disconnected`.
- **#160 `multilingual-e5-base`**: cần xác nhận embedding dimension 768D và cấu hình model.
- **#150 README Image not found**: ảnh trong bước cài đặt 3 bị 404.
- **#135 `callTool()`**: cần bổ sung ví dụ gọi tool.
- **#134 Cursor và Chrome MCP**: lỗi `No connection to browser extension`.
- **#132 Trae timeout 60 giây**: cần kiểm tra `chrome_send_command_to_inject_script`.
- **#131 Claude Desktop**: cần ví dụ cấu hình cụ thể.
- **#124 Excalidraw**: cần kiểm tra prompt và thao tác vẽ.
- **#123 AI và Excalidraw**: cần hướng dẫn workflow Excalidraw.
- **#121 Cherry Studio 1.5.3**: cần xác nhận tương thích.
- **#109 Cherry Studio MCP**: cần kiểm tra cấu hình client.
- **#103 HTTP 400 với Claude Code, Gemini CLI, Cursor**: cần so sánh cấu hình từng client.
- **#102 Cherry Studio**: cần thêm hướng dẫn cấu hình.
- **#100 Cursor và Excalidraw**: lỗi khi gọi tool cần log chi tiết.

---

## Sự cố tương thích

- Các issue liên quan WSL, Docker, macOS, Windows, Cherry Studio, Cursor, Claude Desktop, Claude Code, Kiro, Trae, Windsurf và Chromium cần được gom thành ma trận tương thích.
- Mỗi môi trường nên có cấu hình mẫu, phiên bản đã kiểm thử và mục troubleshooting riêng.

## Cải thiện tài liệu

- Bổ sung hướng dẫn SSE và `streamable-http`.
- Bổ sung hướng dẫn Native Server cho macOS, Linux, Windows và WSL.
- Bổ sung ví dụ Excalidraw, screenshot, clipboard, dialog và console.
- Bổ sung phần rate limit, timeout và xử lý lỗi thường gặp.
- Bổ sung hướng dẫn Docker và Chrome headless nếu được hỗ trợ.

## Sự cố đã giải quyết

Các issue đã đóng nên được giữ trong tài liệu như nhật ký tham khảo, nhưng phần mô tả cần ngắn gọn và không chứa placeholder. Khi có PR hoặc commit liên quan, nên bổ sung link tham chiếu để người đọc biết cách khắc phục.
