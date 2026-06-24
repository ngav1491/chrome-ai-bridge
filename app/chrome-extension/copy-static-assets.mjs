#!/usr/bin/env node
/* eslint-env node */
// Copy static asset directories (inject-scripts, _locales, workers)
// from the project root into every WXT output directory. This replaces
// the `viteStaticCopy` plugin so we get deterministic behaviour across
// local builds, CI runners, and WXT upgrades.
import { promises as fs } from 'node:fs';
import path from 'node:path';

const root = process.cwd();

const targets = [
  // [source dir under root, destination dir name inside .output/<browser>]
  ['inject-scripts', 'inject-scripts'],
  ['_locales', '_locales'],
  ['workers', 'workers'],
];

const outRoots = [
  '.output/chrome-mv3',
  '.output/chrome-mv3-dev',
  '.output/firefox-mv2',
];

async function exists(p) {
  try {
    await fs.access(p);
    return true;
  } catch {
    return false;
  }
}

async function copyDir(srcDir, dstDir) {
  const entries = await fs.readdir(srcDir, { withFileTypes: true });
  let copied = 0;
  for (const entry of entries) {
    const from = path.join(srcDir, entry.name);
    const to = path.join(dstDir, entry.name);
    if (entry.isDirectory()) {
      copied += await copyDir(from, to);
    } else if (entry.isFile()) {
      await fs.mkdir(path.dirname(to), { recursive: true });
      await fs.copyFile(from, to);
      copied += 1;
    }
  }
  return copied;
}

async function main() {
  let totalCopied = 0;
  let totalDirs = 0;
  for (const [srcName, dstName] of targets) {
    const srcDir = path.join(root, srcName);
    if (!(await exists(srcDir))) continue;
    for (const outRoot of outRoots) {
      const dstDir = path.join(root, outRoot, dstName);
      if (!(await exists(path.dirname(dstDir)))) continue;
      await fs.mkdir(dstDir, { recursive: true });
      const copied = await copyDir(srcDir, dstDir);
      totalCopied += copied;
      totalDirs += 1;
    }
  }
  console.log(
    `[copy-static-assets] copied ${totalCopied} file(s) across ${totalDirs} output dir(s)`,
  );
}

main().catch((err) => {
  console.error('[copy-static-assets] failed:', err);
  process.exit(1);
});