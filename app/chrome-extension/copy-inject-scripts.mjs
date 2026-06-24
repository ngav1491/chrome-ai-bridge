#!/usr/bin/env node
// Copy inject-scripts to the WXT output dir after build.
// WXT 0.20 does not preserve viteStaticCopy outputs reliably for
// the `web_accessible_resources` paths declared in the manifest, so
// we copy them here as a deterministic post-build step.
import { promises as fs } from 'node:fs';
import path from 'node:path';

const root = process.cwd();
const srcDir = path.join(root, 'inject-scripts');
const outDirs = [
  path.join(root, '.output', 'chrome-mv3', 'inject-scripts'),
  path.join(root, '.output', 'chrome-mv3-dev', 'inject-scripts'),
  path.join(root, '.output', 'firefox-mv2', 'inject-scripts'),
];

async function exists(p) {
  try {
    await fs.access(p);
    return true;
  } catch {
    return false;
  }
}

async function main() {
  if (!(await exists(srcDir))) {
    console.error(`[copy-inject-scripts] no source dir: ${srcDir}`);
    process.exit(1);
  }
  const entries = await fs.readdir(srcDir, { withFileTypes: true });
  let copied = 0;
  for (const outDir of outDirs) {
    if (!(await exists(outDir))) continue;
    await fs.mkdir(outDir, { recursive: true });
    for (const entry of entries) {
      if (!entry.isFile() || !entry.name.endsWith('.js')) continue;
      const from = path.join(srcDir, entry.name);
      const to = path.join(outDir, entry.name);
      await fs.copyFile(from, to);
      copied += 1;
    }
  }
  console.log(`[copy-inject-scripts] copied ${copied} file(s) to ${outDirs.length} output dir(s)`);
}

main().catch((err) => {
  console.error('[copy-inject-scripts] failed:', err);
  process.exit(1);
});
