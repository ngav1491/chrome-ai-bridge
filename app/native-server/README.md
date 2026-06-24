# Fastify Chrome Native MessagingnoiDungTiengViet

noiDungTiengVietFastifynoiDungTiengVietTypeScriptnoiDungTiengViet，noiDungTiengVietChromenoiDungTiengViet。

## noiDungTiengViet

- noiDungTiengVietChrome Native MessagingnoiDungTiengVietChromenoiDungTiengViet
- **noiDungTiengViet**: Chrome noiDungTiengViet Chromium (noiDungTiengViet Linux、macOS noiDungTiengViet Windows)
- noiDungTiengVietRESTful APInoiDungTiengViet
- noiDungTiengVietTypeScriptnoiDungTiengViet
- noiDungTiengViet
- noiDungTiengViet

## noiDungTiengViet

### noiDungTiengViet

- Node.js 20+
- npm 8+ noiDungTiengViet pnpm 8+

### noiDungTiengViet

```bash
git clone https://github.com/your-username/fastify-chrome-native.git
cd fastify-chrome-native
npm install
```

### noiDungTiengViet

1. noiDungTiengVietnative server

```bash
cd app/native-server
npm run dev
```

2. noiDungTiengVietchrome extension

```bash
cd app/chrome-extension
npm run dev
```

### noiDungTiengViet

```bash
npm run build
```

### noiDungTiengVietNative MessagingnoiDungTiengViet

#### noiDungTiengViet

```bash
chrome-ai-bridge register --detect
```

#### noiDungTiengViet

```bash
# noiDungTiengViet Chrome
chrome-ai-bridge register --browser chrome

# noiDungTiengViet Chromium
chrome-ai-bridge register --browser chromium

# noiDungTiengViet
chrome-ai-bridge register --browser all
```

#### noiDungTiengViet（noiDungTiengViet）

```bash
npm i -g chrome-ai-bridge
```

#### noiDungTiengViet

| noiDungTiengViet | Linux | macOS | Windows |
| ---------------- | ----- | ----- | ------- |
| Google Chrome    | ✓     | ✓     | ✓       |
| Chromium         | ✓     | ✓     | ✓       |

noiDungTiengViet：

- **Linux**: `~/.config/[browser-name]/NativeMessagingHosts/`
- **macOS**: `~/Library/Application Support/[Browser]/NativeMessagingHosts/`
- **Windows**: `%APPDATA%\[Browser]\NativeMessagingHosts\`

### noiDungTiengVietChromenoiDungTiengViet

noiDungTiengVietChromenoiDungTiengViet：

```javascript
// background.js
let nativePort = null;
let serverRunning = false;

// noiDungTiengVietNative MessagingnoiDungTiengViet
function startServer() {
  if (nativePort) {
    console.log('noiDungTiengVietNative MessagingnoiDungTiengViet');
    return;
  }

  try {
    nativePort = chrome.runtime.connectNative('com.yourcompany.fastify_native_host');

    nativePort.onMessage.addListener((message) => {
      console.log('noiDungTiengVietNativenoiDungTiengViet:', message);

      if (message.type === 'started') {
        serverRunning = true;
        console.log(`noiDungTiengViet，noiDungTiengViet: ${message.payload.port}`);
      } else if (message.type === 'stopped') {
        serverRunning = false;
        console.log('noiDungTiengViet');
      } else if (message.type === 'error') {
        console.error('NativenoiDungTiengViet:', message.payload.message);
      }
    });

    nativePort.onDisconnect.addListener(() => {
      console.log('NativenoiDungTiengViet:', chrome.runtime.lastError);
      nativePort = null;
      serverRunning = false;
    });

    // noiDungTiengViet
    nativePort.postMessage({ type: 'start', payload: { port: 3000 } });
  } catch (error) {
    console.error('noiDungTiengVietNative MessagingnoiDungTiengViet:', error);
  }
}

// noiDungTiengViet
function stopServer() {
  if (nativePort && serverRunning) {
    nativePort.postMessage({ type: 'stop' });
  }
}

// noiDungTiengViet
async function testPing() {
  try {
    const response = await fetch('http://localhost:3000/ping');
    const data = await response.json();
    console.log('PingnoiDungTiengViet:', data);
    return data;
  } catch (error) {
    console.error('PingnoiDungTiengViet:', error);
    return null;
  }
}

// noiDungTiengVietNativenoiDungTiengViet
chrome.runtime.onStartup.addListener(startServer);

// noiDungTiengVietpopupnoiDungTiengVietAPI
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.action === 'startServer') {
    startServer();
    sendResponse({ success: true });
  } else if (message.action === 'stopServer') {
    stopServer();
    sendResponse({ success: true });
  } else if (message.action === 'testPing') {
    testPing().then(sendResponse);
    return true; // noiDungTiengViet
  }
});
```

### noiDungTiengViet

```bash
npm run test
```

### noiDungTiengViet

MIT
