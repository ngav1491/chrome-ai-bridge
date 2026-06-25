# Detailed guide: install chrome-ai-bridge MCP from source

This guide walks through **every step** of building chrome-ai-bridge from source, registering the Native Messaging host with Chrome, and connecting the MCP server to MCP clients (Claude Desktop, Cursor, Cherry Studio, ...).

> If you just want to use a prebuilt release quickly, see [`docs/INSTALL_EN.md`](INSTALL_EN.md) — "End-user install" section.

---

## Table of contents

1. [Prerequisites](#1-prerequisites)
2. [Clone and install dependencies](#2-clone-and-install-dependencies)
3. [Build the project](#3-build-the-project)
4. [Register the Native Messaging host](#4-register-the-native-messaging-host)
5. [Load the extension into Chrome](#5-load-the-extension-into-chrome)
6. [Configure your MCP client](#6-configure-your-mcp-client)
7. [Verify the full loop](#7-verify-the-full-loop)
8. [Updating from source](#8-updating-from-source)
9. [Uninstalling](#9-uninstalling)
10. [Troubleshooting](#10-troubleshooting)

---

## 1. Prerequisites

| Requirement       | Minimum version                                | Check command      |
| ----------------- | ---------------------------------------------- | ------------------ |
| **Node.js**       | >= 20.0.0                                      | `node -v`          |
| **pnpm**          | >= 9.0 (managed by corepack)                   | `pnpm -v`          |
| **Git**           | any                                            | `git --version`    |
| **Google Chrome** | 120+ (or Chromium: Edge, Brave, Arc, Opera...) | `chrome://version` |
| Free disk space   | ~200 MB for build output                       | —                  |

The extension uses your existing Chrome profile, so logins, saved passwords, and other extensions are preserved.

### Install Node.js if missing

**macOS / Linux** (via nvm):

```bash
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.40.0/install.sh | bash
source ~/.bashrc   # or ~/.zshrc
nvm install 20
nvm use 20
node -v   # must be >= 20.x
```

**Windows**: download the installer from https://nodejs.org/ (pick LTS 20+), run it and follow the prompts.

### Enable corepack (manages pnpm)

```bash
corepack enable
corepack prepare pnpm@latest --activate
```

---

## 2. Clone and install dependencies

```bash
git clone https://github.com/ngav1491/chrome-ai-bridge.git
cd chrome-ai-bridge
```

Install all monorepo dependencies:

```bash
corepack pnpm install
```

> For a reproducible install from the committed lockfile:
>
> ```bash
> corepack pnpm install --frozen-lockfile
> ```

This pulls dependencies for 5 workspaces: `packages/shared`, `packages/wasm-simd`, `app/native-server`, `app/chrome-extension`, and the root.

---

## 3. Build the project

There are two build scopes depending on your needs.

### 3a. Full build (extension + native server + shared)

```bash
corepack pnpm build
```

This builds 3 workspaces (skips `wasm-simd` which needs Rust):

| Workspace              | Output                                     | Description                               |
| ---------------------- | ------------------------------------------ | ----------------------------------------- |
| `packages/shared`      | `packages/shared/dist/`                    | Shared TypeScript utilities               |
| `app/native-server`    | `app/native-server/dist/`                  | `chrome-ai-bridge` CLI + stdio MCP server |
| `app/chrome-extension` | `app/chrome-extension/.output/chrome-mv3/` | WXT-built Chrome extension + release zip  |

When done, the extension zip is ready at:

```
app/chrome-extension/.output/chrome-ai-bridge-extension.zip
```

### 3b. Build only the native server (if you already have the extension zip from Releases)

If you only need the MCP server and already downloaded the extension zip from GitHub Releases:

```bash
corepack pnpm build:native
```

The native server output lives in `app/native-server/dist/`:

```
app/native-server/dist/
├─ cli.js                          ← main CLI (register, doctor, ...)
├─ index.js                        ← native host entry point
├─ run_host.sh / run_host.bat      ← launch script Chrome invokes
├─ node_path.txt                   ← Node.js path on this machine
├─ mcp/
│  └─ mcp-server-stdio.js          ← MCP stdio server entry point
└─ scripts/
   └─ postinstall.js               ← runs on npm install -g
```

---

## 4. Register the Native Messaging host

Chrome needs to know where the native host is so it can talk to the extension. This step creates the manifest file that registers the host with Chrome.

### 4a. User-level registration (recommended, no sudo)

```bash
node app/native-server/dist/cli.js register
```

This creates the manifest at:

| OS          | Manifest path                                                                                                    |
| ----------- | ---------------------------------------------------------------------------------------------------------------- |
| **Windows** | `%APPDATA%\Google\Chrome\NativeMessagingHosts\com.ngav1491.chrome_ai_bridge.nativehost.json`                     |
| **macOS**   | `~/Library/Application Support/Google/Chrome/NativeMessagingHosts/com.ngav1491.chrome_ai_bridge.nativehost.json` |
| **Linux**   | `~/.config/google-chrome/NativeMessagingHosts/com.ngav1491.chrome_ai_bridge.nativehost.json`                     |

No admin privileges needed. This is the recommended path for most users.

### 4b. System-level registration (requires admin)

If user-level registration fails (IT policy, folder permissions, etc.):

```bash
# macOS / Linux
sudo node app/native-server/dist/cli.js register --system

# Windows (run PowerShell/CMD as Administrator)
node app\native-server\dist\cli.js register --system
```

System-level manifest is created at:

| OS      | Path                                                 |
| ------- | ---------------------------------------------------- |
| Windows | `%ProgramFiles%\Google\Chrome\NativeMessagingHosts\` |
| macOS   | `/Library/Google/Chrome/NativeMessagingHosts/`       |
| Linux   | `/etc/opt/chrome/native-messaging-hosts/`            |

### 4c. Verify registration

```bash
node app/native-server/dist/cli.js doctor
```

The doctor command reports:

- Whether the manifest file exists
- Whether the manifest content is correct
- Whether `run_host.sh`/`run_host.bat` exists and is executable
- The allowed extension ID
- The configured MCP port

If everything is OK, proceed to step 5.

---

## 5. Load the extension into Chrome

### 5a. Using your local build (from step 3a)

1. Open Chrome and go to `chrome://extensions/`.
2. Enable **Developer mode** (top-right toggle).
3. Click **Load unpacked**.
4. Select the `app/chrome-extension/.output/chrome-mv3/` folder (the one containing `manifest.json`).
5. The extension appears in the list with no red error badges.

### 5b. Using the release zip (from step 3b)

1. Download `chrome-ai-bridge-extension.zip` from https://github.com/ngav1491/chrome-ai-bridge/releases
2. Extract it to a stable location (e.g. `~/chrome-ai-bridge`). Do **not** extract into Downloads/Temp.
3. Repeat step 5a but select the extracted folder.

### 5c. Pin the extension and connect

1. Click the puzzle-piece icon in Chrome's toolbar → pin **chrome-ai-bridge**.
2. Click the extension icon → the popup opens.
3. Click **Connect**. The status turns green ("Connected").
4. The popup shows:
   - The MCP server config snippet (JSON)
   - The listening port (default `12306`)
   - The extension ID (needed in step 4 if you re-register)

> **Extension ID note**: the extension ID is machine-specific. If you registered the native host before loading the extension, you may need to run `register` again so `allowed_origins` matches the actual ID. The `doctor` command detects mismatches.

---

## 6. Configure your MCP client

The extension exposes the MCP server at `http://127.0.0.1:12306/mcp` (default). Two transports are supported.

### 6a. Streamable HTTP (recommended)

Add this to your MCP client config file:

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

**Config file location per client:**

| MCP client         | Config file location                                                                                                                 |
| ------------------ | ------------------------------------------------------------------------------------------------------------------------------------ |
| **Claude Desktop** | `~/Library/Application Support/Claude/claude_desktop_config.json` (macOS) or `%APPDATA%\Claude\claude_desktop_config.json` (Windows) |
| **Cursor**         | Settings → MCP → Add new MCP server, or `~/.cursor/mcp.json`                                                                         |
| **Cherry Studio**  | Settings → MCP Servers → Add                                                                                                         |
| **Augment**        | Settings → MCP → Add server                                                                                                          |

### 6b. STDIO (alternative)

Some clients only support stdio. You need the absolute path to the stdio entry point:

```bash
# Find your source path
pwd
# e.g. /home/user/chrome-ai-bridge
```

The stdio server path is:

```
<source-path>/app/native-server/dist/mcp/mcp-server-stdio.js
```

Config:

```json
{
  "mcpServers": {
    "chrome-ai-bridge-stdio": {
      "command": "node",
      "args": ["/home/user/chrome-ai-bridge/app/native-server/dist/mcp/mcp-server-stdio.js"]
    }
  }
}
```

> **Windows**: backslash or forward slash both work:
>
> ```json
> "args": ["C:\\Users\\you\\chrome-ai-bridge\\app\\native-server\\dist\\mcp\\mcp-server-stdio.js"]
> ```

### 6c. Change the default port

If port `12306` is taken:

1. Open the extension popup → config section → change the port (e.g. `13000`).
2. Update the URL in your MCP client config to `http://127.0.0.1:13000/mcp`.
3. Click **Connect** again in the popup.

---

## 7. Verify the full loop

After completing steps 4-6, verify end-to-end:

1. **Extension popup** shows "Connected" (green).

2. **Doctor** from terminal:

   ```bash
   node app/native-server/dist/cli.js doctor
   ```

   Should report: native host OK, extension ID, port, manifest correct.

3. **Call a tool from your MCP client**: in Claude Desktop / Cursor / Cherry Studio, invoke a `chrome-ai-bridge` tool (e.g. `screenshot`, `get_page_content`, `navigate`). A successful round-trip means Chrome ↔ native host ↔ MCP client are all talking.

4. **Check logs** if debugging:

   | OS      | Log location                            |
   | ------- | --------------------------------------- |
   | macOS   | `~/Library/Logs/chrome-ai-bridge/`      |
   | Windows | `%LOCALAPPDATA%\chrome-ai-bridge\logs\` |
   | Linux   | `~/.local/state/chrome-ai-bridge/logs/` |

---

## 8. Updating from source

```bash
cd chrome-ai-bridge
git pull
corepack pnpm install --frozen-lockfile
corepack pnpm build
```

Then:

- Go back to `chrome://extensions/` → click **Reload** on the extension card.
- Re-run `node app/native-server/dist/cli.js register` if the extension ID changed (doctor will tell you).

---

## 9. Uninstalling

1. `chrome://extensions/` → find **chrome-ai-bridge** → **Remove**.
2. Remove the native host manifest:

   ```bash
   node app/native-server/dist/cli.js unregister
   ```

   Or manually delete the manifest file at the paths in step 4.

3. Delete the source folder (optional):

   ```bash
   rm -rf /path/to/chrome-ai-bridge
   ```

4. Delete the log folder (optional) — see locations in step 7.

---

## 10. Troubleshooting

### "Native host has exited" / "Permission denied"

Usually `run_host.sh` is not executable (macOS/Linux):

```bash
node app/native-server/dist/cli.js fix-permissions
# or
node app/native-server/dist/cli.js doctor --fix
```

Or manually:

```bash
chmod +x app/native-server/dist/run_host.sh
chmod +x app/native-server/dist/index.js
chmod +x app/native-server/dist/cli.js
```

### MCP client cannot connect

1. Check the extension popup says "Connected".
2. Run `node app/native-server/dist/cli.js doctor`.
3. Check the port is not in use: `lsof -i :12306` (macOS/Linux) or `netstat -ano | findstr 12306` (Windows).
4. Verify the URL in the MCP client config is `http://127.0.0.1:12306/mcp`.

### Extension ID mismatch

If you registered the native host before loading the extension, `allowed_origins` in the manifest may have the wrong ID:

```bash
# Load the extension first, get the ID from chrome://extensions/
# Then re-register:
node app/native-server/dist/cli.js register
```

The register command reads the current extension ID and updates the manifest.

### Build fails

- Ensure Node.js >= 20: `node -v`
- Ensure pnpm is fresh: `corepack prepare pnpm@latest --activate`
- Wipe `node_modules` and reinstall: `corepack pnpm install --force`
- Wipe old build output: `corepack pnpm clean:dist`

### Need more help

- See [`docs/TROUBLESHOOTING.md`](TROUBLESHOOTING.md) for the full diagnostic flow.
- Open an issue at https://github.com/ngav1491/chrome-ai-bridge/issues with: OS, Node version, commands run, error messages, and `doctor` output.
