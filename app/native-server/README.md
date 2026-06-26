# Dịch vụ Chrome Native Messaging bằng Fastify

Đây là một dự án TypeScript dựa trên Fastify, dùng để giao tiếp nguyên sinh (native) với tiện ích Chrome.

## Tính năng

- Giao tiếp hai chiều với tiện ích Chrome thông qua giao thức Chrome Native Messaging
- **Hỗ trợ nhiều trình duyệt**: Chrome và Chromium (bao gồm Linux, macOS và Windows)
- Cung cấp dịch vụ RESTful API
- Phát triển hoàn toàn bằng TypeScript
- Kèm bộ kiểm thử đầy đủ
- Tuân thủ các quy tắc thực hành tốt nhất về chất lượng mã

## Thiết lập môi trường phát triển

### Điều kiện tiên quyết

- Node.js 20+
- npm 8+ hoặc pnpm 8+

### Cài đặt

```bash
git clone https://github.com/ngav1491/chrome-ai-bridge.git
cd chrome-ai-bridge
corepack enable
corepack pnpm install
```

### Phát triển

1. Build và đăng ký native server trên máy

```bash
corepack pnpm --filter chrome-ai-bridge dev
```

2. Khởi động tiện ích Chrome

```bash
corepack pnpm --filter chrome-ai-bridge-extension dev
```

### Build

```bash
corepack pnpm build:native
```

### Đăng ký máy chủ Native Messaging

#### Tự động phát hiện và đăng ký mọi trình duyệt đã cài

```bash
chrome-ai-bridge register --detect
```

#### Đăng ký trình duyệt cụ thể

```bash
# Chỉ đăng ký Chrome
chrome-ai-bridge register --browser chrome

# Chỉ đăng ký Chromium
chrome-ai-bridge register --browser chromium

# Đăng ký mọi trình duyệt được hỗ trợ
chrome-ai-bridge register --browser all
```

#### Cài đặt toàn cục (sẽ tự động đăng ký các trình duyệt được phát hiện)

```bash
npm i -g chrome-ai-bridge
```

#### Trình duyệt được hỗ trợ

| Trình duyệt   | Linux | macOS | Windows |
| ------------- | ----- | ----- | ------- |
| Google Chrome | ✓     | ✓     | ✓       |
| Chromium      | ✓     | ✓     | ✓       |

Vị trí đăng ký:

- **Linux**: `~/.config/[browser-name]/NativeMessagingHosts/`
- **macOS**: `~/Library/Application Support/[Browser]/NativeMessagingHosts/`
- **Windows**: `%APPDATA%\[Browser]\NativeMessagingHosts\`

### Tích hợp với tiện ích Chrome

Dưới đây là ví dụ đơn giản về cách sử dụng dịch vụ này trong tiện ích Chrome:

```javascript
// background.js
let nativePort = null;
let serverRunning = false;

// Khởi động dịch vụ Native Messaging
function startServer() {
  if (nativePort) {
    console.log('Đã kết nối tới máy chủ Native Messaging');
    return;
  }

  try {
    nativePort = chrome.runtime.connectNative('com.chromeaibridge.native_host');

    nativePort.onMessage.addListener((message) => {
      console.log('Nhận tin nhắn Native:', message);

      if (message.type === 'started') {
        serverRunning = true;
        console.log(`Dịch vụ đã khởi động, cổng: ${message.payload.port}`);
      } else if (message.type === 'stopped') {
        serverRunning = false;
        console.log('Dịch vụ đã dừng');
      } else if (message.type === 'error') {
        console.error('Lỗi Native:', message.payload.message);
      }
    });

    nativePort.onDisconnect.addListener(() => {
      console.log('Kết nối Native bị ngắt:', chrome.runtime.lastError);
      nativePort = null;
      serverRunning = false;
    });

    // Khởi động máy chủ
    nativePort.postMessage({ type: 'start', payload: { port: 3000 } });
  } catch (error) {
    console.error('Lỗi khi khởi động Native Messaging:', error);
  }
}

// Dừng máy chủ
function stopServer() {
  if (nativePort && serverRunning) {
    nativePort.postMessage({ type: 'stop' });
  }
}

// Kiểm thử giao tiếp với máy chủ
async function testPing() {
  try {
    const response = await fetch('http://127.0.0.1:12306/ping');
    const data = await response.json();
    console.log('Phản hồi Ping:', data);
    return data;
  } catch (error) {
    console.error('Ping thất bại:', error);
    return null;
  }
}

// Kết nối máy chủ Native khi tiện ích khởi động
chrome.runtime.onStartup.addListener(startServer);

// Xuất API cho popup hoặc content script sử dụng
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.action === 'startServer') {
    startServer();
    sendResponse({ success: true });
  } else if (message.action === 'stopServer') {
    stopServer();
    sendResponse({ success: true });
  } else if (message.action === 'testPing') {
    testPing().then(sendResponse);
    return true; // Báo rằng chúng ta sẽ gửi phản hồi bất đồng bộ
  }
});
```

### Kiểm thử

```bash
npm run test
```

### Giấy phép

MIT
