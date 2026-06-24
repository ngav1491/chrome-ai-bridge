// CLI binary and npm package name. Aliased to the legacy
// `mcp-chrome-bridge` and `chrome-mcp-bridge` commands in package.json
// `bin` so users on either name keep working.
export const COMMAND_NAME = 'chrome-ai-bridge';

// Chrome assigns a fixed 32-char id the first time the extension is
// loaded. We keep the original id here so existing installations
// (already registered) keep their Native Messaging working. The plan
// for migrating to a new id is documented in
// docs/EXTENSION_ID_MIGRATION.md.
export const EXTENSION_ID = 'hbdgbgagpkpjffpklnamcljpakneikee';

// Native Messaging host id. Derived from the reverse-DNS convention
// of the Chrome Web Store extension id. Update both at the same time
// if the extension id is ever rotated.
export const HOST_NAME = 'com.ngav1491.chrome_ai_bridge.nativehost';

export const DESCRIPTION = 'chrome-ai-bridge Native Messaging host';
