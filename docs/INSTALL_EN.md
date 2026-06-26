# Installing chrome-ai-bridge Chrome Extension

This guide explains two ways to add the chrome-ai-bridge Chrome extension to your browser:

- **End users** — load a prebuilt extension from GitHub Releases.
- **Developers** — clone the repository, build the extension locally, and load the unpacked output.

Both paths use Chrome's **Developer mode → Load unpacked** workflow; the only difference is where the unpacked folder comes from.

> Looking for an existing Vietnamese version of this guide? See [`docs/INSTALL_VI.md`](INSTALL_VI.md).

---

## 1. Requirements

- **Google Chrome** 120+ or any Chromium-based browser (Edge, Brave, Arc, Opera, ...)
- **Node.js 20+** and **pnpm** (only required if you build from source)
- **Git** (only required if you clone the repo)
- ~200 MB of free disk space for the build output

The extension uses your existing Chrome profile, so any logged-in sites, saved passwords, and extensions are preserved.

---

## 2. End-user install (recommended for most people)

### Step 1 — Download the latest release

1. Open the GitHub Releases page for chrome-ai-bridge:
   ```
   https://github.com/ngav1491/chrome-ai-bridge/releases
   ```
2. Download the latest `chrome-ai-bridge-<version>.zip` asset from the release you want to install.
3. Extract the ZIP to a stable location on disk (for example `~/chrome-ai-bridge`). Do not extract it to a folder that gets cleaned up automatically (Downloads, Temp, ...).

### Step 2 — Load the extension into Chrome

1. Open Chrome and navigate to `chrome://extensions/`.
2. Toggle **Developer mode** on (top-right corner of the page).
3. Click **Load unpacked**.
4. In the file picker, select the extracted extension folder (the one that contains `manifest.json`).
5. Confirm the extension appears in the list. Make sure there are no red error badges.

### Step 3 — Install the native messaging host

The extension requires a small native host binary on your machine so Chrome can communicate with the MCP server. The npm package has not been published yet, so build and register directly from source:

```bash
git clone https://github.com/ngav1491/chrome-ai-bridge.git
cd chrome-ai-bridge
corepack enable
corepack pnpm install
corepack pnpm build:native
node app/native-server/dist/cli.js register
```

After registration succeeds, you can move to Step 4.

After the npm package is published, the global install flow will be:

```bash
npm install -g chrome-ai-bridge
chrome-ai-bridge register
```

To register globally for all users on the machine:

```bash
# macOS / Linux
sudo chrome-ai-bridge register --system

# Windows (run from an elevated PowerShell)
chrome-ai-bridge register --system
```

### Step 4 — Open the extension and connect

1. Click the chrome-ai-bridge icon in Chrome's toolbar. If you do not see it, click the puzzle-piece icon and pin chrome-ai-bridge.
2. Click **Connect** in the popup.
3. The popup should now show the MCP server configuration snippet, the listening port, and a green status indicator.

---

## 3. Developer install (build from source)

Use this path if you want to modify the extension, contribute fixes, or test a development build.

### Step 1 — Clone the repository

```bash
git clone https://github.com/ngav1491/chrome-ai-bridge.git
cd chrome-ai-bridge
```

### Step 2 — Install dependencies and build

The repository ships with a pnpm lockfile and a native messaging bridge that is published as a workspace package. Run a full build:

```bash
corepack pnpm install --frozen-lockfile
corepack pnpm build
```

The build runs three workspace projects:

- `packages/shared` → compiled TypeScript utilities (`dist/`)
- `app/native-server` → the `chrome-ai-bridge` CLI binary (`dist/`)
- `app/chrome-extension` → the WXT-built extension at `app/chrome-extension/.output/chrome-mv3/`

> If you only need to rebuild the extension (for example after editing Vue components), run `corepack pnpm --filter chrome-ai-bridge-extension build`.

### Step 3 — Load the local build into Chrome

1. Open `chrome://extensions/`.
2. Enable **Developer mode**.
3. Click **Load unpacked**.
4. Select the `app/chrome-extension/.output/chrome-mv3/` folder produced by the build.
5. After every rebuild, return to `chrome://extensions/` and click the **Reload** icon on the extension card.

### Step 4 — Run the native messaging host locally

For local development you can run the CLI directly from the build output:

```bash
node app/native-server/dist/cli.js
```

This is equivalent to `chrome-ai-bridge` when installed globally, and is useful when iterating on the native host without re-installing the npm package.

---

## 4. Connecting an MCP client

The extension exposes the MCP server on `http://127.0.0.1:12306/mcp` by default. Two transport modes are supported.

### Streamable HTTP (recommended)

Add the following entry to your MCP client configuration:

```json
{
  "mcpServers": {
    "chrome-ai-bridge": {
      "type": "streamableHttp",
      "url": "http://127.0.0.1:12306/mcp"
    }
  }
}
```

### STDIO (alternative)

STDIO requires the absolute path to the bundled stdio entry. Locate it first:

```bash
npm list -g chrome-ai-bridge
# or
pnpm list -g chrome-ai-bridge
```

The output looks similar to:

```
/Users/xxx/Library/pnpm/global/5/node_modules/chrome-ai-bridge
```

Append `dist/mcp/mcp-server-stdio.js` to get the final path, then use it in your client config:

```json
{
  "mcpServers": {
    "chrome-ai-bridge-stdio": {
      "command": "npx",
      "args": [
        "node",
        "/Users/xxx/Library/pnpm/global/5/node_modules/chrome-ai-bridge/dist/mcp/mcp-server-stdio.js"
      ]
    }
  }
}
```

---

## 5. Verifying the install

1. Open the extension popup and confirm the status pill says **Connected**.
2. From a terminal, run a quick health check:

   ```bash
   chrome-ai-bridge doctor
   ```

   The command should report the native host, the Chrome extension id, and the configured port.

3. In your MCP client (Claude Desktop, Cherry Studio, Cursor, ...), trigger a tool call against `chrome-ai-bridge`. A successful round-trip confirms that Chrome, the native host, and the MCP client are all talking to each other.

---

## 6. Updating

- **End users**: download the latest release ZIP, replace the old extension folder with the new one, then click **Reload** on the extension card at `chrome://extensions/`. Because the npm package has not been published yet, update the source and run `corepack pnpm install && corepack pnpm build:native && node app/native-server/dist/cli.js register`.
- **Developers**: `git pull`, then re-run `corepack pnpm install --frozen-lockfile && corepack pnpm build`, and click **Reload** on the extension card.

---

## 7. Uninstalling

1. Open `chrome://extensions/`, find **chrome-ai-bridge**, and click **Remove**. Confirm the dialog.
2. Remove the global CLI host:

   ```bash
   npm uninstall -g chrome-ai-bridge
   ```

3. Optionally delete the extracted folder and any log directory:
   - macOS: `~/Library/Logs/chrome-ai-bridge/`
   - Windows: `%LOCALAPPDATA%\chrome-ai-bridge\logs\`
   - Linux: `~/.local/state/chrome-ai-bridge/logs/`

---

## 8. Troubleshooting

- **Extension shows an error after loading** — open the extension's **Errors** button at `chrome://extensions/`. Most loading errors are caused by selecting the wrong folder (e.g. selecting the parent folder instead of the folder that contains `manifest.json`).
- **MCP client cannot connect** — run `chrome-ai-bridge doctor`. If the native host is missing, run `chrome-ai-bridge register` again.
- **Port already in use** — open the extension popup, change the listening port, and update the MCP client config accordingly.
- **Need more help** — see [`docs/TROUBLESHOOTING.md`](TROUBLESHOOTING.md) for the full diagnostic flow.
