// import { stderr } from 'process';
// import * as fs from 'fs';
// import * as path from 'path';

// // Cài đặt đường dẫn thư mục log
// const LOG_DIR = path.join(
//   '/Users/hang/code/ai/chrome-mcp-server/app/native-server/dist/',
//   '.debug-log',
// ); // Sử dụng thư mục
// const LOG_FILE = path.join(
//   LOG_DIR,
//   `native-host-${new Date().toISOString().replace(/:/g, '-')}.log`,
// );
// // Đảm bảo thư mục log tồn tại
// if (!fs.existsSync(LOG_DIR)) {
//   try {
//     fs.mkdirSync(LOG_DIR, { recursive: true });
//   } catch (err) {
//     stderr.write(`[ERROR] Tạo thư mục log thất bại: ${err}\n`);
//   }
// }

// // Hàm ghi log
// function writeLog(level: string, message: string): void {
//   const timestamp = new Date().toISOString();
//   const logMessage = `[${timestamp}] [${level}] ${message}\n`;

//   // Ghi file
//   try {
//     fs.appendFileSync(LOG_FILE, logMessage);
//   } catch (err) {
//     stderr.write(`[ERROR] Ghi log thất bại: ${err}\n`);
//   }

//   // Xuất ra stderr (không ảnh hưởng giao thức native messaging)
//   stderr.write(logMessage);
// }

// // Hàm log
// export const logger = {
//   debug: (message: string) => writeLog('DEBUG', message),
//   info: (message: string) => writeLog('INFO', message),
//   warn: (message: string) => writeLog('WARN', message),
//   error: (message: string) => writeLog('ERROR', message),
// };
