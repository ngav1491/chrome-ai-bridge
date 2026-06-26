#!/usr/bin/env node
/* eslint-env node */
/**
 * Build script: đóng gói Chrome extension thành ZIP để load unpacked.
 *
 * Output: releases/chrome-extension/latest/chrome-ai-bridge-extension.zip
 *
 * ZIP chứa toàn bộ .output/chrome-mv3/ (manifest.json, background.js,
 * sidepanel, popup, _locales, workers, inject-scripts, icon, ...).
 *
 * Script này chạy SAU khi `pnpm build:extension` đã hoàn tất.
 * Nó chỉ copy ZIP có sẵn từ make-release-zip.mjs vào releases/.
 */
import { promises as fs } from 'node:fs';
import path from 'node:path';

const root = process.cwd();
const sourceZip = path.join(root, 'app', 'chrome-extension', '.output', 'chrome-ai-bridge-extension.zip');
const releasesDir = path.join(root, 'releases', 'chrome-extension', 'latest');
const finalZip = path.join(releasesDir, 'chrome-ai-bridge-extension.zip');

async function exists(p) {
  try {
    await fs.access(p);
    return true;
  } catch {
    return false;
  }
}

async function main() {
  // 1. Kiểm tra ZIP nguồn đã build chưa
  if (!(await exists(sourceZip))) {
    console.error(
      `[build-extension-zip] missing ${sourceZip}; run \`pnpm build:extension\` first`,
    );
    process.exit(1);
  }

  // 2. Tạo releases dir
  await fs.mkdir(releasesDir, { recursive: true });

  // 3. Copy ZIP vào releases
  await fs.copyFile(sourceZip, finalZip);

  const stat = await fs.stat(finalZip);
  console.log(`[build-extension-zip] wrote ${finalZip} (${stat.size} bytes)`);
}

main().catch((err) => {
  console.error('[build-extension-zip] failed:', err);
  process.exit(1);
});