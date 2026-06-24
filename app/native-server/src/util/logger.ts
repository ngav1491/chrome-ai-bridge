// import { stderr } from 'process';
// import * as fs from 'fs';
// import * as path from 'path';

// // cài đặtnhật kýtệpđường dẫn
// const LOG_DIR = path.join(
//   '/Users/hang/code/ai/chrome-mcp-server/app/native-server/dist/',
//   '.debug-log',
// ); // sử dụngnoiDungTiengVietthư mụcnoiDungTiengViet
// const LOG_FILE = path.join(
//   LOG_DIR,
//   `native-host-${new Date().toISOString().replace(/:/g, '-')}.log`,
// );
// // đảm bảonhật kýthư mụctồn tại
// if (!fs.existsSync(LOG_DIR)) {
//   try {
//     fs.mkdirSync(LOG_DIR, { recursive: true });
//   } catch (err) {
//     stderr.write(`[ERROR] tạonhật kýthư mụcthất bại: ${err}\n`);
//   }
// }

// // nhật kýhàm
// function writeLog(level: string, message: string): void {
//   const timestamp = new Date().toISOString();
//   const logMessage = `[${timestamp}] [${level}] ${message}\n`;

//   // ghinoiDungTiengViettệp
//   try {
//     fs.appendFileSync(LOG_FILE, logMessage);
//   } catch (err) {
//     stderr.write(`[ERROR] ghinhật kýthất bại: ${err}\n`);
//   }

//   // noiDungTiengVietđầu ranoiDungTiengVietstderr（không ảnh hưởngnative messaginggiao thức）
//   stderr.write(logMessage);
// }

// // nhật kýnoiDungTiengViethàm
// export const logger = {
//   debug: (message: string) => writeLog('DEBUG', message),
//   info: (message: string) => writeLog('INFO', message),
//   warn: (message: string) => writeLog('WARN', message),
//   error: (message: string) => writeLog('ERROR', message),
// };
