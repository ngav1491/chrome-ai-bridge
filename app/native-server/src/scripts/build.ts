import { execSync } from 'child_process';
import fs from 'fs';
import path from 'path';

const distDir = path.join(__dirname, '..', '..', 'dist');
// dọn dẹpnoiDungTiengVietxây dựng
console.log('dọn dẹpnoiDungTiengVietxây dựng...');
try {
  fs.rmSync(distDir, { recursive: true, force: true });
} catch (err) {
  // bỏ quathư mụckhông tồn tạinoiDungTiengVietlỗi
  console.log(err);
}

// tạodistthư mục
fs.mkdirSync(distDir, { recursive: true });
fs.mkdirSync(path.join(distDir, 'logs'), { recursive: true }); // tạologsthư mục
console.log('dist noiDungTiengViet dist/logs thư mụcnoiDungTiengViettạo/xác nhậntồn tại');

// noiDungTiengVietTypeScript
console.log('noiDungTiengVietTypeScript...');
execSync('tsc', { stdio: 'inherit' });

// sao chépcấu hìnhtệp
console.log('sao chépcấu hìnhtệp...');
const configSourcePath = path.join(__dirname, '..', 'mcp', 'stdio-config.json');
const configDestPath = path.join(distDir, 'mcp', 'stdio-config.json');

try {
  // đảm bảomục tiêuthư mụctồn tại
  fs.mkdirSync(path.dirname(configDestPath), { recursive: true });

  if (fs.existsSync(configSourcePath)) {
    fs.copyFileSync(configSourcePath, configDestPath);
    console.log(`đã stdio-config.json sao chépnoiDungTiengViet ${configDestPath}`);
  } else {
    console.error(`lỗi: cấu hìnhtệpkhông tìm thấy: ${configSourcePath}`);
  }
} catch (error) {
  console.error('sao chépcấu hìnhtệpnoiDungTiengViet:', error);
}

// sao chéppackage.jsonnoiDungTiengVietcập nhậtnoiDungTiengViet
console.log('noiDungTiengVietpackage.json...');
const packageJson = require('../../package.json');

// tạocài đặtnoiDungTiengViet
const readmeContent = `# ${packageJson.name}

noiDungTiengVietChromenoiDungTiengVietNative MessaginghostnoiDungTiengViet。

## cài đặtnoiDungTiengViet

1. đảm bảonoiDungTiengVietcài đặtNode.js
2. toàn cụccài đặtnoiDungTiengViet:
   \`\`\`
   npm install -g ${packageJson.name}
   \`\`\`
3. đăng kýNative Messaginghost:
   \`\`\`
   # noiDungTiengVietcài đặt（khuyến nghị）
   ${packageJson.name} register

   # nếunoiDungTiengVietcài đặtthất bại，noiDungTiengVietthửhệ thốngnoiDungTiengVietcài đặt
   ${packageJson.name} register --system
   # hoặcsử dụngquản lýnoiDungTiengVietquyền
   sudo ${packageJson.name} register
   \`\`\`

## sử dụngphương thức

noiDungTiengVietChromenoiDungTiengViettự độngkhởi động，noiDungTiengVietthủ côngchạy。
`;

fs.writeFileSync(path.join(distDir, 'README.md'), readmeContent);

console.log('sao chépnoiDungTiengVietscript...');
const scriptsSourceDir = path.join(__dirname, '.');
const macOsWrapperSourcePath = path.join(scriptsSourceDir, 'run_host.sh');
const windowsWrapperSourcePath = path.join(scriptsSourceDir, 'run_host.bat');

const macOsWrapperDestPath = path.join(distDir, 'run_host.sh');
const windowsWrapperDestPath = path.join(distDir, 'run_host.bat');

try {
  if (fs.existsSync(macOsWrapperSourcePath)) {
    fs.copyFileSync(macOsWrapperSourcePath, macOsWrapperDestPath);
    console.log(`đã ${macOsWrapperSourcePath} sao chépnoiDungTiengViet ${macOsWrapperDestPath}`);
  } else {
    console.error(
      `lỗi: macOS noiDungTiengVietscriptnoiDungTiengViettệpkhông tìm thấy: ${macOsWrapperSourcePath}`,
    );
  }

  if (fs.existsSync(windowsWrapperSourcePath)) {
    fs.copyFileSync(windowsWrapperSourcePath, windowsWrapperDestPath);
    console.log(
      `đã ${windowsWrapperSourcePath} sao chépnoiDungTiengViet ${windowsWrapperDestPath}`,
    );
  } else {
    console.error(
      `lỗi: Windows noiDungTiengVietscriptnoiDungTiengViettệpkhông tìm thấy: ${windowsWrapperSourcePath}`,
    );
  }
} catch (error) {
  console.error('sao chépnoiDungTiengVietscriptnoiDungTiengViet:', error);
}

// noiDungTiengVietJavaScripttệpnoiDungTiengVietmacOSnoiDungTiengVietscriptthêmnoiDungTiengVietthực thiquyền
console.log('thêmnoiDungTiengVietthực thiquyền...');
const filesToMakeExecutable = ['index.js', 'cli.js', 'run_host.sh']; // cli.js noiDungTiengViet dist noiDungTiengVietthư mục

filesToMakeExecutable.forEach((file) => {
  const filePath = path.join(distDir, file); // filePath noiDungTiengVietmục tiêuđường dẫn
  try {
    if (fs.existsSync(filePath)) {
      fs.chmodSync(filePath, '755');
      console.log(`noiDungTiengViet ${file} thêmnoiDungTiengVietthực thiquyền (755)`);
    } else {
      console.warn(
        `cảnh báo: ${filePath} không tồn tại，không thểthêmnoiDungTiengVietthực thiquyền`,
      );
    }
  } catch (error) {
    console.error(
      `noiDungTiengViet ${file} thêmnoiDungTiengVietthực thiquyềnnoiDungTiengViet:`,
      error,
    );
  }
});

// Write node_path.txt immediately after build to ensure Chrome uses the correct Node.js version.
// This is critical for development mode where dist is deleted on each rebuild.
// The file points to the same Node.js that compiled the native modules (better-sqlite3 etc.)
console.log('ghi node_path.txt...');
const nodePathFile = path.join(distDir, 'node_path.txt');
fs.writeFileSync(nodePathFile, process.execPath, 'utf8');
console.log(`noiDungTiengVietghi Node.js đường dẫn: ${process.execPath}`);

console.log('✅ xây dựnghoàn tất');
