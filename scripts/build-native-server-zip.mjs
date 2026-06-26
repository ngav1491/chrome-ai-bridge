#!/usr/bin/env node
/* eslint-env node */
/**
 * Build script: đóng gói native server thành ZIP cho Windows.
 *
 * Output: releases/native-server/latest/chrome-ai-bridge-native-server-windows.zip
 *
 * ZIP chứa:
 *   dist/           — CLI + run_host.bat + mcp/ + scripts/
 *   vendor/         — workspace packages bundled as local file dependencies
 *   package.json    — runtime dependencies for npm install --omit=dev
 *   README.md       — hướng dẫn cài đặt Windows
 *
 * User cần tự cài Node.js 20+ từ https://nodejs.org/ và chạy npm install --omit=dev sau khi giải nén.
 */
import { spawnSync } from 'node:child_process';
import { promises as fs } from 'node:fs';
import path from 'node:path';
import os from 'node:os';

const root = process.cwd();
const nativeServerDir = path.join(root, 'app', 'native-server');
const distDir = path.join(nativeServerDir, 'dist');
const sharedDir = path.join(root, 'packages', 'shared');
const sharedDistDir = path.join(sharedDir, 'dist');
const releasesDir = path.join(root, 'releases', 'native-server', 'latest');
const tmpDir = path.join(os.tmpdir(), `chrome-ai-bridge-native-server-${Date.now()}`);
const tmpZip = path.join(os.tmpdir(), `chrome-ai-bridge-native-server-windows-${Date.now()}.zip`);
const finalZip = path.join(releasesDir, 'chrome-ai-bridge-native-server-windows.zip');

async function exists(p) {
  try {
    await fs.access(p);
    return true;
  } catch {
    return false;
  }
}

async function copyDir(src, dest) {
  await fs.mkdir(dest, { recursive: true });
  const entries = await fs.readdir(src, { withFileTypes: true });
  for (const entry of entries) {
    const srcPath = path.join(src, entry.name);
    const destPath = path.join(dest, entry.name);
    if (entry.isDirectory()) {
      await copyDir(srcPath, destPath);
    } else {
      await fs.copyFile(srcPath, destPath);
    }
  }
}

function buildReleasePackageJson(nativePkg, sharedPkg) {
  const dependencies = { ...nativePkg.dependencies };
  dependencies[sharedPkg.name] = `file:vendor/${sharedPkg.name}`;

  return {
    name: nativePkg.name,
    version: nativePkg.version,
    description: nativePkg.description,
    main: nativePkg.main,
    bin: nativePkg.bin,
    engines: nativePkg.engines,
    preferGlobal: nativePkg.preferGlobal,
    keywords: nativePkg.keywords,
    author: nativePkg.author,
    license: nativePkg.license,
    dependencies,
  };
}

function buildVendoredSharedPackageJson(sharedPkg) {
  return {
    name: sharedPkg.name,
    version: sharedPkg.version,
    main: sharedPkg.main,
    module: sharedPkg.module,
    types: sharedPkg.types,
    exports: sharedPkg.exports,
    dependencies: sharedPkg.dependencies,
  };
}

function createWindowsInstallScript() {
  return `@echo off
setlocal
cd /d "%~dp0"

set "EXTENSION_ID=%~1"
set "EXTENSION_ID_ARGS="
if not "%EXTENSION_ID%"=="" set "EXTENSION_ID_ARGS=--extension-id %EXTENSION_ID%"

echo [chrome-ai-bridge] Installing runtime dependencies...

set "NODE_EXE=%ProgramFiles%\\nodejs\\node.exe"
set "NPM_CMD=%ProgramFiles%\\nodejs\\npm.cmd"

if exist "%NPM_CMD%" goto install
for %%I in (npm.cmd) do set "NPM_CMD=%%~$PATH:I"
if defined NPM_CMD goto install

echo [chrome-ai-bridge] ERROR: npm.cmd not found.
echo Install Node.js LTS from https://nodejs.org/, then reopen PowerShell and run install.bat again.
exit /b 1

:install
echo [chrome-ai-bridge] Using npm: %NPM_CMD%
call "%NPM_CMD%" install --omit=dev
if errorlevel 1 exit /b %errorlevel%

echo [chrome-ai-bridge] Resetting MCP stdio port to 12306...
if exist "dist\cli.js" (
  node dist\cli.js update-port 12306
  if errorlevel 1 exit /b %errorlevel%
  if "%EXTENSION_ID%"=="" (
    echo [chrome-ai-bridge] No extension ID argument supplied. If using an unpacked extension, rerun: install.bat YOUR_EXTENSION_ID
  )
  node dist\cli.js doctor --fix %EXTENSION_ID_ARGS%
  exit /b %errorlevel%
)

echo [chrome-ai-bridge] ERROR: dist\\cli.js not found. Are you running install.bat from the extracted ZIP root?
exit /b 1
`;
}

async function main() {
  // 1. Kiểm tra dist/ đã build chưa
  if (!(await exists(distDir))) {
    console.error(`[build-native-server-zip] missing ${distDir}; run \`pnpm build:native\` first`);
    process.exit(1);
  }
  if (!(await exists(sharedDistDir))) {
    console.error(`[build-native-server-zip] missing ${sharedDistDir}; run \`pnpm build:shared\` first`);
    process.exit(1);
  }

  // 2. Tạo thư mục tạm để đóng gói
  console.log(`[build-native-server-zip] preparing temp dir: ${tmpDir}`);
  await fs.mkdir(tmpDir, { recursive: true });

  // 3. Copy dist/ vào temp
  console.log('[build-native-server-zip] copying dist/...');
  await copyDir(distDir, path.join(tmpDir, 'dist'));

  // 4. Copy package.json đầy đủ runtime dependencies và trỏ workspace shared package về vendor/
  const pkg = JSON.parse(await fs.readFile(path.join(nativeServerDir, 'package.json'), 'utf8'));
  const sharedPkg = JSON.parse(await fs.readFile(path.join(sharedDir, 'package.json'), 'utf8'));
  const releasePkg = buildReleasePackageJson(pkg, sharedPkg);
  await fs.writeFile(path.join(tmpDir, 'package.json'), JSON.stringify(releasePkg, null, 2));

  // 5. Bundle workspace package chrome-ai-bridge-shared dưới dạng local file dependency.
  const vendoredSharedDir = path.join(tmpDir, 'vendor', sharedPkg.name);
  await copyDir(sharedDistDir, path.join(vendoredSharedDir, 'dist'));
  await fs.writeFile(
    path.join(vendoredSharedDir, 'package.json'),
    JSON.stringify(buildVendoredSharedPackageJson(sharedPkg), null, 2),
  );

  await fs.writeFile(path.join(tmpDir, 'install.bat'), createWindowsInstallScript());
  // 6. Tạo README hướng dẫn cài đặt Windows
  const readme = `# Chrome AI Bridge — Native Server (Windows)

Phần native messaging host cho Chrome extension chrome-ai-bridge.
Server lắng nghe trên port 12306, bind 0.0.0.0 (LAN accessible).

## Yêu cầu

- **Node.js 20+**: tải từ https://nodejs.org/ (chọn LTS)
- **Google Chrome** hoặc Chromium
- Windows 10/11

## Cài đặt

1. Giải nén ZIP này vào vị trí cố định, ví dụ \`C:\\chrome-ai-bridge\\\`
2. Mở PowerShell tại thư mục vừa giải nén
3. Load Chrome extension trước, mở \`chrome://extensions\`, bật Developer mode, copy dòng **ID** của extension chrome-ai-bridge.
4. Cài dependencies runtime và đăng ký native host với đúng extension ID:

   \`\`\`powershell
   .\\install.bat jldpoegmnhhdnfahaombbppmpnjfdkki
   \`\`\`

   Nếu muốn chạy thủ công thay cho script:

   \`\`\`powershell
   npm.cmd install --omit=dev
   node dist\\cli.js update-port 12306
   node dist\\cli.js doctor --fix --extension-id jldpoegmnhhdnfahaombbppmpnjfdkki
   \`\`\`

4. Kiểm tra cài đặt:

   \`\`\`powershell
   node dist\\cli.js doctor --extension-id jldpoegmnhhdnfahaombbppmpnjfdkki
   \`\`\`

5. Đăng ký Native Messaging host:

   \`\`\`powershell
   # Cấp người dùng (khuyến nghị, không cần admin)
   node dist\\cli.js register --extension-id jldpoegmnhhdnfahaombbppmpnjfdkki

   # Hoặc cấp hệ thống (cần admin)
   node dist\\cli.js register --system --extension-id jldpoegmnhhdnfahaombbppmpnjfdkki
   \`\`\`

## Đổi port hoặc host

Đặt biến môi trường trước khi chạy:

\`\`\`powershell
# Đổi port
$env:CHROME_MCP_PORT=13000; node dist\\cli.js register

# Giới hạn chỉ loopback (mặc định là 0.0.0.0 cho LAN)
$env:SERVER_HOST=127.0.0.1; node dist\\cli.js register
\`\`\`

## Cấu hình MCP client

Thêm vào file cấu hình MCP client (Claude Desktop, Cursor, Cherry Studio, ...):

\`\`\`json
{
  "mcpServers": {
    "chrome-ai-bridge": {
      "type": "streamableHttp",
      "url": "http://127.0.0.1:12306/mcp"
    }
  }
}
\`\`\`

Nếu MCP client chạy trên máy khác trong LAN, thay \`127.0.0.1\` bằng IP máy chủ.

## Gỡ cài đặt

\`\`\`powershell
node dist\\cli.js unregister
\`\`\`

Hoặc xóa thủ công:
- File manifest: \`%APPDATA%\\Google\\Chrome\\NativeMessagingHosts\\com.ngav1491.chrome_ai_bridge.nativehost.json\`
- Registry key: \`HKCU\\Software\\Google\\Chrome\\NativeMessagingHosts\\com.ngav1491.chrome_ai_bridge.nativehost\`

## Khắc phục sự cố

- **Cannot find module 'fastify', 'commander' hoặc dependency khác**: chạy \`.\\install.bat\` tại thư mục gốc vừa giải nén
- **Node.js not found**: chạy \`node dist\\cli.js doctor --fix\` hoặc set \`$env:CHROME_MCP_NODE_PATH\` trỏ tới \`node.exe\`
- **Port bị chiếm**: đổi port qua \`$env:CHROME_MCP_PORT\`
- **Extension ID mismatch**: mở \`chrome://extensions\`, copy dòng ID rồi chạy \`node dist\\cli.js register --extension-id ID_CUA_EXTENSION\` hoặc \`node dist\\cli.js doctor --fix --extension-id ID_CUA_EXTENSION\`
`;
  await fs.writeFile(path.join(tmpDir, 'README.md'), readme);

  // 7. Tạo releases dir
  await fs.mkdir(releasesDir, { recursive: true });

  // 8. Zip
  console.log('[build-native-server-zip] creating zip...');
  const result = spawnSync('zip', ['-r', tmpZip, '.'], { cwd: tmpDir, stdio: 'inherit' });
  if (result.status !== 0) {
    console.error(`[build-native-server-zip] zip exited with status ${result.status}`);
    process.exit(1);
  }

  // 9. Copy zip to releases
  await fs.copyFile(tmpZip, finalZip);
  await fs.unlink(tmpZip);

  // 10. Cleanup temp
  await fs.rm(tmpDir, { recursive: true, force: true });

  const stat = await fs.stat(finalZip);
  console.log(`[build-native-server-zip] wrote ${finalZip} (${stat.size} bytes)`);
}

main().catch((err) => {
  console.error('[build-native-server-zip] failed:', err);
  process.exit(1);
});