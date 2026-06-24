#!/usr/bin/env node
/* eslint-env node */
// Build a user-facing zip that contains the full .output directory
// for unpacked install (Chrome > Extensions > Load unpacked).
// This is the file we publish as the GitHub release asset.
//
// Why not just `wxt zip`? WXT's zip is optimized for the Chrome
// Web Store upload (it skips web-accessible resources that the store
// ignores). End users installing from GitHub need the full output
// directory, including inject-scripts/, _locales/, workers/, etc.
import { spawnSync } from 'node:child_process';
import { promises as fs } from 'node:fs';
import path from 'node:path';
import os from 'node:os';

const root = process.cwd();
const outDir = path.join(root, '.output', 'chrome-mv3');
const tmpZip = path.join(os.tmpdir(), `chrome-ai-bridge-extension-${Date.now()}.zip`);
const finalZip = path.join(root, '.output', 'chrome-ai-bridge-extension.zip');

async function exists(p) {
  try {
    await fs.access(p);
    return true;
  } catch {
    return false;
  }
}

async function main() {
  if (!(await exists(outDir))) {
    console.error(`[make-release-zip] missing ${outDir}; run \`pnpm build\` first`);
    process.exit(1);
  }

  // Use the system `zip` so we keep the directory layout intact.
  const result = spawnSync('zip', ['-r', tmpZip, '.'], { cwd: outDir, stdio: 'inherit' });
  if (result.status !== 0) {
    console.error(`[make-release-zip] zip exited with status ${result.status}`);
    process.exit(1);
  }

  await fs.copyFile(tmpZip, finalZip);
  await fs.unlink(tmpZip);

  const stat = await fs.stat(finalZip);
  console.log(`[make-release-zip] wrote ${finalZip} (${stat.size} bytes)`);
}

main().catch((err) => {
  console.error('[make-release-zip] failed:', err);
  process.exit(1);
});