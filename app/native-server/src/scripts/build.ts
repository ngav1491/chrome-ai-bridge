import { execSync } from 'child_process';
import fs from 'fs';
import path from 'path';

const distDir = path.join(__dirname, '..', '..', 'dist');
// Dọn dẹp kết quả build lần trước
console.log('Đang dọn dẹp kết quả build lần trước...');
try {
  fs.rmSync(distDir, { recursive: true, force: true });
} catch (err) {
  // Bỏ qua khi thư mục không tồn tại, không phải lỗi
  console.log(err);
}

// Tạo thư mục dist
fs.mkdirSync(distDir, { recursive: true });
fs.mkdirSync(path.join(distDir, 'logs'), { recursive: true }); // Tạo thư mục logs
console.log('Đã tạo/xác nhận thư mục dist và dist/logs tồn tại');

// Biên dịch TypeScript
console.log('Đang biên dịch TypeScript...');
execSync('tsc', { stdio: 'inherit' });

// Sao chép tệp cấu hình
console.log('Đang sao chép tệp cấu hình...');
const configSourcePath = path.join(__dirname, '..', 'mcp', 'stdio-config.json');
const configDestPath = path.join(distDir, 'mcp', 'stdio-config.json');

try {
  // Đảm bảo thư mục đích tồn tại
  fs.mkdirSync(path.dirname(configDestPath), { recursive: true });

  if (fs.existsSync(configSourcePath)) {
    fs.copyFileSync(configSourcePath, configDestPath);
    console.log(`Đã sao chép stdio-config.json đến ${configDestPath}`);
  } else {
    console.error(`Lỗi: không tìm thấy tệp cấu hình: ${configSourcePath}`);
  }
} catch (error) {
  console.error('Lỗi sao chép tệp cấu hình:', error);
}

// Sao chép package.json và cập nhật thông tin
console.log('Đang sao chép package.json...');
const packageJson = require('../../package.json');

// Tạo nội dung README
const readmeContent = `# ${packageJson.name}

Tiện ích mở rộng Chrome Native Messaging host.

## Cách cài đặt

1. Đảm bảo đã cài đặt Node.js
2. Cài đặt toàn cục gói này:
   \`\`\`
   npm install -g ${packageJson.name}
   \`\`\`
3. Đăng ký Native Messaging host:
   \`\`\`
   # Cài đặt cấp người dùng (khuyến nghị)
   ${packageJson.name} register

   # Nếu cài đặt cấp người dùng thất bại, thử cài đặt cấp hệ thống
   ${packageJson.name} register --system
   # Hoặc dùng quyền quản trị
   sudo ${packageJson.name} register
   \`\`\`

## Cách sử dụng

Sau khi Chrome mở, tiện ích mở rộng sẽ tự động khởi động host, bạn cũng có thể chạy thủ công.
`;

fs.writeFileSync(path.join(distDir, 'README.md'), readmeContent);

console.log('Đang sao chép script wrapper...');
const scriptsSourceDir = path.join(__dirname, '.');
const macOsWrapperSourcePath = path.join(scriptsSourceDir, 'run_host.sh');
const windowsWrapperSourcePath = path.join(scriptsSourceDir, 'run_host.bat');

const macOsWrapperDestPath = path.join(distDir, 'run_host.sh');
const windowsWrapperDestPath = path.join(distDir, 'run_host.bat');

try {
  if (fs.existsSync(macOsWrapperSourcePath)) {
    fs.copyFileSync(macOsWrapperSourcePath, macOsWrapperDestPath);
    console.log(`Đã sao chép ${macOsWrapperSourcePath} đến ${macOsWrapperDestPath}`);
  } else {
    console.error(`Lỗi: không tìm thấy tệp script wrapper macOS: ${macOsWrapperSourcePath}`);
  }

  if (fs.existsSync(windowsWrapperSourcePath)) {
    fs.copyFileSync(windowsWrapperSourcePath, windowsWrapperDestPath);
    console.log(`Đã sao chép ${windowsWrapperSourcePath} đến ${windowsWrapperDestPath}`);
  } else {
    console.error(`Lỗi: không tìm thấy tệp script wrapper Windows: ${windowsWrapperSourcePath}`);
  }
} catch (error) {
  console.error('Lỗi sao chép script wrapper:', error);
}

// Cấp quyền thực thi cho tệp JavaScript và script macOS
console.log('Đang cấp quyền thực thi...');
const filesToMakeExecutable = ['index.js', 'cli.js', 'run_host.sh']; // cli.js nằm trong thư mục dist

filesToMakeExecutable.forEach((file) => {
  const filePath = path.join(distDir, file); // filePath là đường dẫn đích
  try {
    if (fs.existsSync(filePath)) {
      fs.chmodSync(filePath, '755');
      console.log(`Đã cấp quyền thực thi (755) cho ${file}`);
    } else {
      console.warn(`Cảnh báo: ${filePath} không tồn tại, không thể cấp quyền thực thi`);
    }
  } catch (error) {
    console.error(`Lỗi khi cấp quyền thực thi cho ${file}:`, error);
  }
});

// Write node_path.txt immediately after build to ensure Chrome uses the correct Node.js version.
// This is critical for development mode where dist is deleted on each rebuild.
// The file points to the same Node.js that compiled the native modules (better-sqlite3 etc.)
console.log('Đang ghi node_path.txt...');
const nodePathFile = path.join(distDir, 'node_path.txt');
fs.writeFileSync(nodePathFile, process.execPath, 'utf8');
console.log(`Đã ghi đường dẫn Node.js: ${process.execPath}`);

console.log('✅ Hoàn tất build');
