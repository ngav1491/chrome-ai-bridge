import fs from 'fs';
import path from 'path';
import os from 'os';
import { execSync } from 'child_process';
import { promisify } from 'util';
import { COMMAND_NAME, DESCRIPTION, EXTENSION_ID, HOST_NAME } from './constant';
import { BrowserType, getBrowserConfig, detectInstalledBrowsers } from './browser-config';

export const access = promisify(fs.access);
export const mkdir = promisify(fs.mkdir);
export const writeFile = promisify(fs.writeFile);

export interface ExtensionIdOptions {
  extensionId?: string;
}

const EXTENSION_ID_PATTERN = /^[a-p]{32}$/;

export function normalizeExtensionId(extensionId?: string): string | undefined {
  const value = extensionId?.trim();
  if (!value) return undefined;

  if (!EXTENSION_ID_PATTERN.test(value)) {
    throw new Error(
      `Invalid Chrome extension ID: ${value}. Expected 32 lowercase characters from a-p.`,
    );
  }

  return value;
}

export function getConfiguredExtensionId(extensionId?: string): string | undefined {
  return normalizeExtensionId(extensionId || process.env.CHROME_AI_BRIDGE_EXTENSION_ID);
}

export function resolveAllowedExtensionIds(extensionId?: string): string[] {
  const configured = getConfiguredExtensionId(extensionId);
  return Array.from(new Set([EXTENSION_ID, configured].filter(Boolean) as string[]));
}

export function resolveAllowedOrigins(extensionId?: string): string[] {
  return resolveAllowedExtensionIds(extensionId).map((id) => `chrome-extension://${id}/`);
}

/**
 * Project name (GitHub repo): chrome-ai-bridge.
 * The CLI binary is now published as `chrome-ai-bridge` (the new canonical
 * name). We still keep the legacy `mcp-chrome-bridge` directory layout on
 * disk for existing users, so new logs continue to land in
 * `chrome-ai-bridge/` and any old `mcp-chrome-bridge/` directory is left in
 * place (it is harmless once the Native Messaging manifest has been
 * re-registered with the new host name).
 */

/**
 * Get the log directory path for wrapper scripts.
 * Uses platform-appropriate user directories to avoid permission issues.
 *
 * - macOS: ~/Library/Logs/chrome-ai-bridge
 * - Windows: %LOCALAPPDATA%/chrome-ai-bridge/logs
 * - Linux: $XDG_STATE_HOME/chrome-ai-bridge/logs or ~/.local/state/chrome-ai-bridge/logs
 */
export function getLogDir(): string {
  const homedir = os.homedir();

  if (os.platform() === 'darwin') {
    return path.join(homedir, 'Library', 'Logs', 'chrome-ai-bridge');
  } else if (os.platform() === 'win32') {
    return path.join(
      process.env.LOCALAPPDATA || path.join(homedir, 'AppData', 'Local'),
      'chrome-ai-bridge',
      'logs',
    );
  } else {
    // Linux: XDG_STATE_HOME or ~/.local/state
    const xdgState = process.env.XDG_STATE_HOME || path.join(homedir, '.local', 'state');
    return path.join(xdgState, 'chrome-ai-bridge', 'logs');
  }
}

/**
 * In văn bản màu
 */
export function colorText(text: string, color: string): string {
  const colors: Record<string, string> = {
    red: '\x1b[31m',
    green: '\x1b[32m',
    yellow: '\x1b[33m',
    blue: '\x1b[34m',
    reset: '\x1b[0m',
  };

  return colors[color] + text + colors.reset;
}

/**
 * Get user-level manifest file path
 */
export function getUserManifestPath(): string {
  if (os.platform() === 'win32') {
    // Windows: %APPDATA%\Google\Chrome\NativeMessagingHosts\
    return path.join(
      process.env.APPDATA || path.join(os.homedir(), 'AppData', 'Roaming'),
      'Google',
      'Chrome',
      'NativeMessagingHosts',
      `${HOST_NAME}.json`,
    );
  } else if (os.platform() === 'darwin') {
    // macOS: ~/Library/Application Support/Google/Chrome/NativeMessagingHosts/
    return path.join(
      os.homedir(),
      'Library',
      'Application Support',
      'Google',
      'Chrome',
      'NativeMessagingHosts',
      `${HOST_NAME}.json`,
    );
  } else {
    // Linux: ~/.config/google-chrome/NativeMessagingHosts/
    return path.join(
      os.homedir(),
      '.config',
      'google-chrome',
      'NativeMessagingHosts',
      `${HOST_NAME}.json`,
    );
  }
}

/**
 * Get system-level manifest file path
 */
export function getSystemManifestPath(): string {
  if (os.platform() === 'win32') {
    // Windows: %ProgramFiles%\Google\Chrome\NativeMessagingHosts\
    return path.join(
      process.env.ProgramFiles || 'C:\\Program Files',
      'Google',
      'Chrome',
      'NativeMessagingHosts',
      `${HOST_NAME}.json`,
    );
  } else if (os.platform() === 'darwin') {
    // macOS: /Library/Google/Chrome/NativeMessagingHosts/
    return path.join('/Library', 'Google', 'Chrome', 'NativeMessagingHosts', `${HOST_NAME}.json`);
  } else {
    // Linux: /etc/opt/chrome/native-messaging-hosts/
    return path.join('/etc', 'opt', 'chrome', 'native-messaging-hosts', `${HOST_NAME}.json`);
  }
}

/**
 * Get native host startup script file path
 */
export async function getMainPath(): Promise<string> {
  try {
    const packageDistDir = path.join(__dirname, '..');
    const wrapperScriptName = process.platform === 'win32' ? 'run_host.bat' : 'run_host.sh';
    const absoluteWrapperPath = path.resolve(packageDistDir, wrapperScriptName);
    return absoluteWrapperPath;
  } catch (error) {
    console.log(colorText('Cannot find global package path, using current directory', 'yellow'));
    throw error;
  }
}

/**
 * Write Node.js executable path to node_path.txt for run_host scripts.
 * This ensures the native host uses the same Node.js version that was used during installation,
 * avoiding NODE_MODULE_VERSION mismatch errors with native modules like better-sqlite3.
 *
 * @param distDir - The dist directory where node_path.txt should be written
 * @param nodeExecPath - The Node.js executable path to write (defaults to current process.execPath)
 */
export function writeNodePathFile(distDir: string, nodeExecPath = process.execPath): void {
  try {
    const nodePathFile = path.join(distDir, 'node_path.txt');
    fs.mkdirSync(distDir, { recursive: true });

    console.log(colorText(`Writing Node.js path: ${nodeExecPath}`, 'blue'));
    fs.writeFileSync(nodePathFile, nodeExecPath, 'utf8');
    console.log(colorText('✓ Node.js path written for run_host scripts', 'green'));
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : String(error);
    console.warn(colorText(`⚠️ Failed to write Node.js path: ${message}`, 'yellow'));
  }
}

/**
 * Đảm bảo các tệp quan trọng có quyền thực thi
 */
export async function ensureExecutionPermissions(): Promise<void> {
  try {
    const packageDistDir = path.join(__dirname, '..');

    if (process.platform === 'win32') {
      // Xử lý nền tảng Windows
      await ensureWindowsFilePermissions(packageDistDir);
      return;
    }

    // Xử lý nền tảng Unix/Linux
    const filesToCheck = [
      path.join(packageDistDir, 'index.js'),
      path.join(packageDistDir, 'run_host.sh'),
      path.join(packageDistDir, 'cli.js'),
    ];

    for (const filePath of filesToCheck) {
      if (fs.existsSync(filePath)) {
        try {
          fs.chmodSync(filePath, '755');
          console.log(
            colorText(`✓ Set execution permissions for ${path.basename(filePath)}`, 'green'),
          );
        } catch (err: any) {
          console.warn(
            colorText(
              `⚠️ Unable to set execution permissions for ${path.basename(filePath)}: ${err.message}`,
              'yellow',
            ),
          );
        }
      } else {
        console.warn(colorText(`⚠️ File not found: ${filePath}`, 'yellow'));
      }
    }
  } catch (error: any) {
    console.warn(colorText(`⚠️ Error ensuring execution permissions: ${error.message}`, 'yellow'));
  }
}

/**
 * Xử lý quyền tệp nền tảng Windows
 */
async function ensureWindowsFilePermissions(packageDistDir: string): Promise<void> {
  const filesToCheck = [
    path.join(packageDistDir, 'index.js'),
    path.join(packageDistDir, 'run_host.bat'),
    path.join(packageDistDir, 'cli.js'),
  ];

  for (const filePath of filesToCheck) {
    if (fs.existsSync(filePath)) {
      try {
        // Kiểm tra tệp có phải là chỉ đọc hay không, nếu phải thì gỡ bỏ thuộc tính chỉ đọc
        const stats = fs.statSync(filePath);
        if (!(stats.mode & parseInt('200', 8))) {
          // Kiểm tra quyền ghi
          // Thử gỡ bỏ thuộc tính chỉ đọc
          fs.chmodSync(filePath, stats.mode | parseInt('200', 8));
          console.log(
            colorText(`✓ Removed read-only attribute from ${path.basename(filePath)}`, 'green'),
          );
        }

        // Xác thực tệp có thể đọc
        fs.accessSync(filePath, fs.constants.R_OK);
        console.log(
          colorText(`✓ Verified file accessibility for ${path.basename(filePath)}`, 'green'),
        );
      } catch (err: any) {
        console.warn(
          colorText(
            `⚠️ Unable to verify file permissions for ${path.basename(filePath)}: ${err.message}`,
            'yellow',
          ),
        );
      }
    } else {
      console.warn(colorText(`⚠️ File not found: ${filePath}`, 'yellow'));
    }
  }
}

/**
 * Create Native Messaging host manifest content
 */
export async function createManifestContent(options: ExtensionIdOptions = {}): Promise<any> {
  const mainPath = await getMainPath();

  return {
    name: HOST_NAME,
    description: DESCRIPTION,
    path: mainPath, // Đường dẫn tệp thực thi Node.js
    type: 'stdio',
    allowed_origins: resolveAllowedOrigins(options.extensionId),
  };
}

/**
 * Xác thực mục đăng ký Windows có tồn tại và trỏ đến đúng đường dẫn hay không
 */
function verifyWindowsRegistryEntry(registryKey: string, expectedPath: string): boolean {
  if (os.platform() !== 'win32') {
    return true; // Bỏ qua xác thực trên nền tảng không phải Windows
  }

  const normalizeForCompare = (filePath: string): string => path.normalize(filePath).toLowerCase();

  try {
    const output = execSync(`reg query "${registryKey}" /ve`, {
      encoding: 'utf8',
      stdio: 'pipe',
    });
    const lines = output
      .split(/\r?\n/)
      .map((l) => l.trim())
      .filter(Boolean);

    for (const line of lines) {
      const match = line.match(/REG_SZ\s+(.*)$/i);
      if (!match?.[1]) continue;
      const actualPath = match[1].trim();
      return normalizeForCompare(actualPath) === normalizeForCompare(expectedPath);
    }
  } catch {
    // ignore
  }

  return false;
}

/**
 * Write node_path.txt and then register user-level Native Messaging host.
 * This is the recommended entry point for development and production registration,
 * as it ensures the Node.js path is captured before registration.
 *
 * @param browsers - Optional list of browsers to register for
 * @returns true if at least one browser was registered successfully
 */
export async function registerUserLevelHostWithNodePath(
  browsers?: BrowserType[],
  options: ExtensionIdOptions = {},
): Promise<boolean> {
  writeNodePathFile(path.join(__dirname, '..'));
  return tryRegisterUserLevelHost(browsers, options);
}

/**
 * Thử đăng ký Native Messaging host cấp người dùng
 */
export async function tryRegisterUserLevelHost(
  targetBrowsers?: BrowserType[],
  options: ExtensionIdOptions = {},
): Promise<boolean> {
  try {
    console.log(colorText('Attempting to register user-level Native Messaging host...', 'blue'));

    // 1. Đảm bảo quyền thực thi
    await ensureExecutionPermissions();

    // 2. Xác nhận các trình duyệt muốn đăng ký
    const browsersToRegister = targetBrowsers || detectInstalledBrowsers();
    if (browsersToRegister.length === 0) {
      // Nếu không phát hiện trình duyệt, mặc định đăng ký Chrome và Chromium
      browsersToRegister.push(BrowserType.CHROME, BrowserType.CHROMIUM);
      console.log(
        colorText('No browsers detected, registering for Chrome and Chromium by default', 'yellow'),
      );
    } else {
      console.log(colorText(`Detected browsers: ${browsersToRegister.join(', ')}`, 'blue'));
    }

    // 3. Tạo nội dung manifest
    const manifest = await createManifestContent(options);

    let successCount = 0;
    const results: { browser: string; success: boolean; error?: string }[] = [];

    // 4. Lần lượt đăng ký cho từng trình duyệt
    for (const browserType of browsersToRegister) {
      const config = getBrowserConfig(browserType);
      console.log(colorText(`\nRegistering for ${config.displayName}...`, 'blue'));

      try {
        // Đảm bảo thư mục tồn tại
        await mkdir(path.dirname(config.userManifestPath), { recursive: true });

        // Ghi tệp manifest
        await writeFile(config.userManifestPath, JSON.stringify(manifest, null, 2));
        console.log(colorText(`✓ Manifest written to ${config.userManifestPath}`, 'green'));

        // Windows cần tạo mục đăng ký
        if (os.platform() === 'win32' && config.registryKey) {
          try {
            // Lưu ý: không cần tự viết kép dấu gạch chéo ngược, lệnh reg xử lý đúng đường dẫn Windows
            const regCommand = `reg add "${config.registryKey}" /ve /t REG_SZ /d "${config.userManifestPath}" /f`;
            execSync(regCommand, { stdio: 'pipe' });

            if (verifyWindowsRegistryEntry(config.registryKey, config.userManifestPath)) {
              console.log(colorText(`✓ Registry entry created for ${config.displayName}`, 'green'));
            } else {
              throw new Error('Registry verification failed');
            }
          } catch (error: any) {
            throw new Error(`Registry error: ${error.message}`);
          }
        }

        successCount++;
        results.push({ browser: config.displayName, success: true });
        console.log(colorText(`✓ Successfully registered ${config.displayName}`, 'green'));
      } catch (error: any) {
        results.push({ browser: config.displayName, success: false, error: error.message });
        console.log(
          colorText(`✗ Failed to register ${config.displayName}: ${error.message}`, 'red'),
        );
      }
    }

    // 5. Báo cáo kết quả
    console.log(colorText('\n===== Registration Summary =====', 'blue'));
    for (const result of results) {
      if (result.success) {
        console.log(colorText(`✓ ${result.browser}: Success`, 'green'));
      } else {
        console.log(colorText(`✗ ${result.browser}: Failed - ${result.error}`, 'red'));
      }
    }

    return successCount > 0;
  } catch (error) {
    console.log(
      colorText(
        `User-level registration failed: ${error instanceof Error ? error.message : String(error)}`,
        'yellow',
      ),
    );
    return false;
  }
}

// Nhập gói is-admin (chỉ dùng trên nền tảng Windows)
let isAdmin: () => boolean = () => false;
if (process.platform === 'win32') {
  try {
    isAdmin = require('is-admin');
  } catch (error) {
    console.warn(
      'Thiếu dependency is-admin, trên nền tảng Windows có thể không phát hiện đúng quyền quản trị',
    );
    console.warn(error);
  }
}

/**
 * Dùng quyền nâng cao để đăng ký manifest cấp hệ thống
 */
export async function registerWithElevatedPermissions(
  options: ExtensionIdOptions = {},
): Promise<void> {
  try {
    console.log(colorText('Attempting to register system-level manifest...', 'blue'));

    // 1. Đảm bảo quyền thực thi
    await ensureExecutionPermissions();

    // 2. Chuẩn bị nội dung manifest
    const manifest = await createManifestContent(options);

    // 3. Lấy đường dẫn manifest cấp hệ thống
    const manifestPath = getSystemManifestPath();

    // 4. Tạo tệp manifest tạm
    const tempManifestPath = path.join(os.tmpdir(), `${HOST_NAME}.json`);
    await writeFile(tempManifestPath, JSON.stringify(manifest, null, 2));

    // 5. Phát hiện đã có quyền quản trị hay chưa
    const isRoot = process.getuid && process.getuid() === 0; // Unix/Linux/Mac
    const hasAdminRights = process.platform === 'win32' ? isAdmin() : false; // Nền tảng Windows phát hiện quyền quản trị
    const hasElevatedPermissions = isRoot || hasAdminRights;

    // Chuẩn bị lệnh
    const command =
      os.platform() === 'win32'
        ? `if not exist "${path.dirname(manifestPath)}" mkdir "${path.dirname(manifestPath)}" && copy "${tempManifestPath}" "${manifestPath}"`
        : `mkdir -p "${path.dirname(manifestPath)}" && cp "${tempManifestPath}" "${manifestPath}" && chmod 644 "${manifestPath}"`;

    if (hasElevatedPermissions) {
      // Đã có quyền quản trị, thực thi lệnh trực tiếp
      try {
        // Tạo thư mục
        if (!fs.existsSync(path.dirname(manifestPath))) {
          fs.mkdirSync(path.dirname(manifestPath), { recursive: true });
        }

        // Sao chép tệp
        fs.copyFileSync(tempManifestPath, manifestPath);

        // Cài đặt quyền (nền tảng không phải Windows)
        if (os.platform() !== 'win32') {
          fs.chmodSync(manifestPath, '644');
        }

        console.log(colorText('System-level manifest registration successful!', 'green'));
      } catch (error: any) {
        console.error(
          colorText(`System-level manifest installation failed: ${error.message}`, 'red'),
        );
        throw error;
      }
    } else {
      // Không có quyền quản trị, in gợi ý thao tác thủ công
      console.log(
        colorText('⚠️ Administrator privileges required for system-level installation', 'yellow'),
      );
      console.log(
        colorText(
          'Please run one of the following commands with administrator privileges:',
          'blue',
        ),
      );

      if (os.platform() === 'win32') {
        console.log(colorText('  1. Open Command Prompt as Administrator and run:', 'blue'));
        console.log(colorText(`     ${command}`, 'cyan'));
      } else {
        console.log(colorText('  1. Run with sudo:', 'blue'));
        console.log(colorText(`     sudo ${command}`, 'cyan'));
      }

      console.log(
        colorText('  2. Or run the registration command with elevated privileges:', 'blue'),
      );
      console.log(colorText(`     sudo ${COMMAND_NAME} register --system`, 'cyan'));

      throw new Error('Administrator privileges required for system-level installation');
    }

    // 6. Xử lý đặc biệt Windows - cài đặt mục đăng ký hệ thống
    if (os.platform() === 'win32') {
      const registryKey = `HKLM\\Software\\Google\\Chrome\\NativeMessagingHosts\\${HOST_NAME}`;
      // Lưu ý: không cần tự viết kép dấu gạch chéo ngược, lệnh reg xử lý đúng đường dẫn Windows
      const regCommand = `reg add "${registryKey}" /ve /t REG_SZ /d "${manifestPath}" /f`;

      console.log(colorText(`Creating system registry entry: ${registryKey}`, 'blue'));
      console.log(colorText(`Manifest path: ${manifestPath}`, 'blue'));

      if (hasElevatedPermissions) {
        // Đã có quyền quản trị, thực thi lệnh đăng ký trực tiếp
        try {
          execSync(regCommand, { stdio: 'pipe' });

          // Xác thực mục đăng ký đã tạo thành công
          if (verifyWindowsRegistryEntry(registryKey, manifestPath)) {
            console.log(colorText('Windows registry entry created successfully!', 'green'));
          } else {
            console.log(colorText('⚠️ Registry entry created but verification failed', 'yellow'));
          }
        } catch (error: any) {
          console.error(
            colorText(`Windows registry entry creation failed: ${error.message}`, 'red'),
          );
          console.error(colorText(`Command: ${regCommand}`, 'red'));
          throw error;
        }
      } else {
        // Không có quyền quản trị, in gợi ý thao tác thủ công
        console.log(
          colorText(
            '⚠️ Administrator privileges required for Windows registry modification',
            'yellow',
          ),
        );
        console.log(colorText('Please run the following command as Administrator:', 'blue'));
        console.log(colorText(`  ${regCommand}`, 'cyan'));
        console.log(colorText('Or run the registration command with elevated privileges:', 'blue'));
        console.log(
          colorText(
            `  Run Command Prompt as Administrator and execute: ${COMMAND_NAME} register --system`,
            'cyan',
          ),
        );

        throw new Error('Administrator privileges required for Windows registry modification');
      }
    }
  } catch (error: any) {
    console.error(colorText(`Đăng ký thất bại: ${error.message}`, 'red'));
    throw error;
  }
}
