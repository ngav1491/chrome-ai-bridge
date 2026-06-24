# Tham chiếu API Chrome MCP Server 📚

Tham chiếu đầy đủ về tất cả các công cụ có sẵn và tham số của chúng.

## 📋 Mục lục

- [Quản lý trình duyệt](#quản-lý-trình-duyệt)
- [Chụp màn hình & Thị giác](#chụp-màn-hình--thị-giác)
- [Giám sát mạng](#giám-sát-mạng)
- [Phân tích nội dung](#phân-tích-nội-dung)
- [Tương tác](#tương-tác)
- [Quản lý dữ liệu](#quản-lý-dữ-liệu)
- [Định dạng phản hồi](#định-dạng-phản-hồi)

## 📊 Quản lý trình duyệt

### `get_windows_and_tabs`

Liệt kê tất cả các cửa sổ và thẻ trình duyệt đang mở.

**Tham số**: Không

**Phản hồi**:

```json
{
  "windowCount": 2,
  "tabCount": 5,
  "windows": [
    {
      "windowId": 123,
      "tabs": [
        {
          "tabId": 456,
          "url": "https://example.com",
          "title": "Trang ví dụ",
          "active": true
        }
      ]
    }
  ]
}
```

### `chrome_navigate`

Điều hướng đến URL được chỉ định, có thể tùy chọn điều khiển khung nhìn.

**Tham số**:

- `url` (chuỗi, bắt buộc): URL cần điều hướng đến
- `newWindow` (boolean, tùy chọn): Tạo cửa sổ mới (mặc định: false)
- `width` (số, tùy chọn): Chiều rộng khung nhìn (pixel, mặc định: 1280)
- `height` (số, tùy chọn): Chiều cao khung nhìn (pixel, mặc định: 720)

**Ví dụ**:

```json
{
  "url": "https://example.com",
  "newWindow": true,
  "width": 1920,
  "height": 1080
}
```

### `chrome_close_tabs`

Đóng các thẻ hoặc cửa sổ được chỉ định.

**Tham số**:

- `tabIds` (mảng, tùy chọn): Mảng ID thẻ cần đóng
- `windowIds` (mảng, tùy chọn): Mảng ID cửa sổ cần đóng

**Ví dụ**:

```json
{
  "tabIds": [123, 456],
  "windowIds": [789]
}
```

### `chrome_switch_tab`

Chuyển sang thẻ trình duyệt được chỉ định.

**Tham số**:

- `tabId` (số, bắt buộc): ID của thẻ cần chuyển đến.
- `windowId` (số, tùy chọn): ID của cửa sổ chứa thẻ.

**Ví dụ**:

```json
{
  "tabId": 456,
  "windowId": 123
}
```

### `chrome_go_back_or_forward`

Điều hướng lịch sử trình duyệt.

**Tham số**:

- `direction` (chuỗi, bắt buộc): "back" hoặc "forward"
- `tabId` (số, tùy chọn): ID thẻ cụ thể (mặc định: thẻ đang hoạt động)

**Ví dụ**:

```json
{
  "direction": "back",
  "tabId": 123
}
```

## 📸 Chụp màn hình & Thị giác

### `chrome_screenshot`

Chụp màn hình nâng cao với nhiều tùy chọn.

**Tham số**:

- `name` (chuỗi, tùy chọn): Tên tệp ảnh chụp màn hình
- `selector` (chuỗi, tùy chọn): Bộ chọn CSS cho ảnh chụp phần tử
- `width` (số, tùy chọn): Chiều rộng (pixel, mặc định: 800)
- `height` (số, tùy chọn): Chiều cao (pixel, mặc định: 600)
- `storeBase64` (boolean, tùy chọn): Trả về dữ liệu base64 (mặc định: false)
- `fullPage` (boolean, tùy chọn): Chụp toàn bộ trang (mặc định: true)

**Ví dụ**:

```json
{
  "selector": ".main-content",
  "fullPage": true,
  "storeBase64": true,
  "width": 1920,
  "height": 1080
}
```

**Phản hồi**:

```json
{
  "success": true,
  "base64": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAA...",
  "dimensions": {
    "width": 1920,
    "height": 1080
  }
}
```

## 🌐 Giám sát mạng

### `chrome_network_capture_start`

Bắt đầu bắt các yêu cầu mạng bằng API webRequest.

**Tham số**:

- `url` (chuỗi, tùy chọn): URL cần điều hướng và bắt
- `maxCaptureTime` (số, tùy chọn): Thời gian bắt tối đa (mili giây, mặc định: 30000)
- `inactivityTimeout` (số, tùy chọn): Thời gian dừng sau khi không hoạt động (mili giây, mặc định: 3000)
- `includeStatic` (boolean, tùy chọn): Bao gồm tài nguyên tĩnh (mặc định: false)

**Ví dụ**:

```json
{
  "url": "https://api.example.com",
  "maxCaptureTime": 60000,
  "includeStatic": false
}
```

### `chrome_network_capture_stop`

Dừng bắt mạng và trả về dữ liệu đã thu thập.

**Tham số**: Không

**Phản hồi**:

```json
{
  "success": true,
  "capturedRequests": [
    {
      "url": "https://api.example.com/data",
      "method": "GET",
      "status": 200,
      "requestHeaders": {...},
      "responseHeaders": {...},
      "responseTime": 150
    }
  ],
  "summary": {
    "totalRequests": 15,
    "captureTime": 5000
  }
}
```

### `chrome_network_debugger_start`

Bắt đầu bắt bằng Chrome Debugger API (bao gồm cả nội dung phản hồi).

**Tham số**:

- `url` (chuỗi, tùy chọn): URL cần điều hướng và bắt

### `chrome_network_debugger_stop`

Dừng bắt debugger và trả về dữ liệu bao gồm cả nội dung phản hồi.

### `chrome_network_request`

Gửi yêu cầu HTTP tùy chỉnh.

**Tham số**:

- `url` (chuỗi, bắt buộc): URL yêu cầu
- `method` (chuỗi, tùy chọn): Phương thức HTTP (mặc định: "GET")
- `headers` (đối tượng, tùy chọn): Header yêu cầu
- `body` (chuỗi, tùy chọn): Body yêu cầu

**Ví dụ**:

```json
{
  "url": "https://api.example.com/data",
  "method": "POST",
  "headers": {
    "Content-Type": "application/json"
  },
  "body": "{\"key\": \"value\"}"
}
```

## 🔍 Phân tích nội dung

### `search_tabs_content`

Tìm kiếm ngữ nghĩa được hỗ trợ bởi AI trên các thẻ trình duyệt.

**Tham số**:

- `query` (chuỗi, bắt buộc): Truy vấn tìm kiếm

**Ví dụ**:

```json
{
  "query": "hướng dẫn học máy"
}
```

**Phản hồi**:

```json
{
  "success": true,
  "totalTabsSearched": 10,
  "matchedTabsCount": 3,
  "vectorSearchEnabled": true,
  "indexStats": {
    "totalDocuments": 150,
    "totalTabs": 10,
    "semanticEngineReady": true
  },
  "matchedTabs": [
    {
      "tabId": 123,
      "url": "https://example.com/ml-tutorial",
      "title": "Hướng dẫn học máy",
      "semanticScore": 0.85,
      "matchedSnippets": ["Giới thiệu về học máy..."],
      "chunkSource": "content"
    }
  ]
}
```

### `chrome_get_web_content`

Trích xuất nội dung HTML hoặc văn bản từ trang web.

**Tham số**:

- `format` (chuỗi, tùy chọn): "html" hoặc "text" (mặc định: "text")
- `selector` (chuỗi, tùy chọn): Bộ chọn CSS cho phần tử cụ thể
- `tabId` (số, tùy chọn): ID thẻ cụ thể (mặc định: thẻ đang hoạt động)

**Ví dụ**:

```json
{
  "format": "text",
  "selector": ".article-content"
}
```

### `chrome_get_interactive_elements`

Tìm các phần tử có thể nhấp và tương tác trên trang.

**Tham số**:

- `tabId` (số, tùy chọn): ID thẻ cụ thể (mặc định: thẻ đang hoạt động)

**Phản hồi**:

```json
{
  "elements": [
    {
      "selector": "#submit-button",
      "type": "button",
      "text": "Gửi",
      "visible": true,
      "clickable": true
    }
  ]
}
```

## 🎯 Tương tác

### `chrome_click_element`

Nhấp vào phần tử bằng bộ chọn CSS.

**Tham số**:

- `selector` (chuỗi, bắt buộc): Bộ chọn CSS của phần tử đích
- `tabId` (số, tùy chọn): ID thẻ cụ thể (mặc định: thẻ đang hoạt động)

**Ví dụ**:

```json
{
  "selector": "#submit-button"
}
```

### `chrome_fill_or_select`

Điền vào trường biểu mẫu hoặc chọn tùy chọn.

**Tham số**:

- `selector` (chuỗi, bắt buộc): Bộ chọn CSS của phần tử đích
- `value` (chuỗi, bắt buộc): Giá trị cần điền hoặc chọn
- `tabId` (số, tùy chọn): ID thẻ cụ thể (mặc định: thẻ đang hoạt động)

**Ví dụ**:

```json
{
  "selector": "#email-input",
  "value": "user@example.com"
}
```

### `chrome_keyboard`

Mô phỏng nhập bàn phím và phím tắt.

**Tham số**:

- `keys` (chuỗi, bắt buộc): Tổ hợp phím (ví dụ: "Ctrl+C", "Enter")
- `selector` (chuỗi, tùy chọn): Bộ chọn phần tử đích
- `delay` (số, tùy chọn): Độ trễ giữa các lần nhấn phím (mili giây, mặc định: 0)

**Ví dụ**:

```json
{
  "keys": "Ctrl+A",
  "selector": "#text-input",
  "delay": 100
}
```

## 📚 Quản lý dữ liệu

### `chrome_history`

Tìm kiếm lịch sử trình duyệt với bộ lọc.

**Tham số**:

- `text` (chuỗi, tùy chọn): Tìm văn bản trong URL/tiêu đề
- `startTime` (chuỗi, tùy chọn): Ngày bắt đầu (định dạng ISO)
- `endTime` (chuỗi, tùy chọn): Ngày kết thúc (định dạng ISO)
- `maxResults` (số, tùy chọn): Số kết quả tối đa (mặc định: 100)
- `excludeCurrentTabs` (boolean, tùy chọn): Loại trừ các thẻ hiện tại (mặc định: true)

**Ví dụ**:

```json
{
  "text": "github",
  "startTime": "2024-01-01",
  "maxResults": 50
}
```

### `chrome_bookmark_search`

Tìm dấu trang theo từ khóa.

**Tham số**:

- `query` (chuỗi, tùy chọn): Từ khóa tìm kiếm
- `maxResults` (số, tùy chọn): Số kết quả tối đa (mặc định: 100)
- `folderPath` (chuỗi, tùy chọn): Tìm trong thư mục cụ thể

**Ví dụ**:

```json
{
  "query": "tài liệu",
  "maxResults": 20,
  "folderPath": "Công việc/Tài nguyên"
}
```

### `chrome_bookmark_add`

Thêm dấu trang mới với hỗ trợ thư mục.

**Tham số**:

- `url` (chuỗi, tùy chọn): URL cần đánh dấu (mặc định: thẻ hiện tại)
- `title` (chuỗi, tùy chọn): Tiêu đề dấu trang (mặc định: tiêu đề trang)
- `parentId` (chuỗi, tùy chọn): ID hoặc đường dẫn thư mục cha
- `createFolder` (boolean, tùy chọn): Tạo thư mục nếu không tồn tại (mặc định: false)

**Ví dụ**:

```json
{
  "url": "https://example.com",
  "title": "Trang web ví dụ",
  "parentId": "Công việc/Tài nguyên",
  "createFolder": true
}
```

### `chrome_bookmark_delete`

Xóa dấu trang theo ID hoặc URL.

**Tham số**:

- `bookmarkId` (chuỗi, tùy chọn): ID dấu trang cần xóa
- `url` (chuỗi, tùy chọn): URL cần tìm và xóa

**Ví dụ**:

```json
{
  "url": "https://example.com"
}
```

## 📋 Định dạng phản hồi

Tất cả các công cụ đều trả về phản hồi theo định dạng sau:

```json
{
  "content": [
    {
      "type": "text",
      "text": "Chuỗi JSON chứa dữ liệu phản hồi thực tế"
    }
  ],
  "isError": false
}
```

Đối với lỗi:

```json
{
  "content": [
    {
      "type": "text",
      "text": "Thông báo lỗi mô tả nguyên nhân lỗi"
    }
  ],
  "isError": true
}
```

## 🔧 Ví dụ sử dụng

### Ví dụ quy trình làm việc hoàn chỉnh

```javascript
// 1. Điều hướng đến trang
await callTool('chrome_navigate', {
  url: 'https://example.com',
});

// 2. Chụp màn hình
const screenshot = await callTool('chrome_screenshot', {
  fullPage: true,
  storeBase64: true,
});

// 3. Bắt đầu giám sát mạng
await callTool('chrome_network_capture_start', {
  maxCaptureTime: 30000,
});

// 4. Tương tác với trang
await callTool('chrome_click_element', {
  selector: '#load-data-button',
});

// 5. Tìm kiếm ngữ nghĩa nội dung
const searchResults = await callTool('search_tabs_content', {
  query: 'phân tích dữ liệu người dùng',
});

// 6. Dừng bắt mạng
const networkData = await callTool('chrome_network_capture_stop');

// 7. Lưu dấu trang
await callTool('chrome_bookmark_add', {
  title: 'Trang phân tích dữ liệu',
  parentId: 'Công việc/Phân tích',
});
```

API này cung cấp khả năng tự động hóa trình duyệt toàn diện, với tính năng phân tích nội dung và tìm kiếm ngữ nghĩa được tăng cường bởi AI.
