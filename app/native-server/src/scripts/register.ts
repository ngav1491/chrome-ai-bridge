#!/usr/bin/env node
import path from 'path';
import { COMMAND_NAME } from './constant';
import { colorText, registerWithElevatedPermissions, writeNodePathFile } from './utils';

/**
 * noiDungTiengViethàm
 */
async function main(): Promise<void> {
  console.log(colorText(`đangđăng ký ${COMMAND_NAME} Native Messaginghost...`, 'blue'));

  try {
    // Write Node.js path before registration
    writeNodePathFile(path.join(__dirname, '..'));

    await registerWithElevatedPermissions();
    console.log(
      colorText(
        'đăng kýthành công！noiDungTiengVietChromenoiDungTiengVietthông quaNative MessagingnoiDungTiengVietcục bộdịch vụnoiDungTiengViet。',
        'green',
      ),
    );
  } catch (error: any) {
    console.error(colorText(`đăng kýthất bại: ${error.message}`, 'red'));
    process.exit(1);
  }
}

// thực thinoiDungTiengViethàm
main();
