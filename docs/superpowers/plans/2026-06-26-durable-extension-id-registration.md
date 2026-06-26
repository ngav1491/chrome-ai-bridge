# Durable Extension ID Registration Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Make native-host registration durable for unpacked Chrome extension IDs by accepting an explicit extension ID and preserving the legacy default ID.

**Architecture:** Thread an optional `extensionId` value from CLI commands into manifest generation and doctor validation. Generate `allowed_origins` from a helper that always includes the legacy hardcoded ID and includes the explicit override when supplied.

**Tech Stack:** TypeScript native-server CLI, Commander, Node.js fs/path utilities, Windows Native Messaging manifests, existing release ZIP scripts.

## Global Constraints

- Keep legacy extension ID `hbdgbgagpkpjffpklnamcljpakneikee` working by default.
- Support user-provided unpacked extension ID `jldpoegmnhhdnfahaombbppmpnjfdkki` via `--extension-id` and env fallback.
- Do not require private Chrome extension key.
- Do not remove legacy bin aliases.
- Windows native ZIP install docs must guide users to copy the ID from `chrome://extensions`.

---

### Task 1: Manifest origin helper and register CLI option

**Files:**

- Modify: `app/native-server/src/scripts/utils.ts`
- Modify: `app/native-server/src/cli.ts`

**Interfaces:**

- Produces: `createManifestContent(options?: { extensionId?: string }): Promise<any>`
- Produces: `tryRegisterUserLevelHost(targetBrowsers?: BrowserType[], options?: { extensionId?: string }): Promise<boolean>`
- Consumes: CLI option `.option('--extension-id <id>', 'Chrome extension ID to add to allowed_origins')`

- [ ] Add helper to validate/normalize extension ID: exact 32 lowercase letters `a-p`.
- [ ] Add `resolveAllowedExtensionIds(extensionId?: string): string[]` to include default and override without duplicates.
- [ ] Update `createManifestContent` to emit multiple `allowed_origins`.
- [ ] Pass `options.extensionId` from `register` command into `tryRegisterUserLevelHost`.
- [ ] Include env fallback `CHROME_AI_BRIDGE_EXTENSION_ID`.
- [ ] Verify by building native server and inspecting generated manifest with `--extension-id jldpoegmnhhdnfahaombbppmpnjfdkki`.

### Task 2: Doctor support for extension ID override

**Files:**

- Modify: `app/native-server/src/scripts/doctor.ts`
- Modify: `app/native-server/src/cli.ts`

**Interfaces:**

- Produces: `runDoctor({ json, fix, browser, extensionId })`
- Consumes: same validation/helper logic from utils.

- [ ] Add `--extension-id <id>` to `doctor` command.
- [ ] Thread `extensionId` into `runDoctor`.
- [ ] Change manifest expected origins check from a single expected origin to a required list.
- [ ] Ensure `doctor --fix --extension-id <id>` re-registers using the override ID.
- [ ] Keep existing behavior unchanged when no override is provided.

### Task 3: Release docs and generated README guidance

**Files:**

- Modify: `releases/native-server/README.md`
- Modify: `scripts/build-native-server-zip.mjs`

**Interfaces:**

- Produces: README instructions showing Chrome extension ID copy flow.
- Produces: generated ZIP README that includes `register --extension-id <ID>` and `doctor --fix --extension-id <ID>`.

- [ ] Update native-server release README to explain extension ID mismatch.
- [ ] Add Windows PowerShell example using `jldpoegmnhhdnfahaombbppmpnjfdkki` as placeholder/example.
- [ ] Update generated README content in build script.
- [ ] Warn users not to run bare `register` if using unpacked extension with non-default ID.

### Task 4: Build and verification

**Files:**

- Verify: build outputs in `app/native-server/dist`
- Verify: release ZIP in `releases/native-server/latest`

**Interfaces:**

- Produces: rebuilt native ZIP.

- [ ] Run native type/build command.
- [ ] Run `corepack pnpm build:release:native`.
- [ ] Extract generated ZIP to `/tmp/opencode` and verify runtime help contains `--extension-id`.
- [ ] Run register in temp-safe mode if possible, or inspect compiled CLI output to confirm options are wired.
- [ ] Inspect generated README in ZIP.

## Self-review

- Scope is limited to native registration/doctor/docs. Extension build key signing is out of scope because private key is unavailable.
- No dependency additions required.
- Existing default ID remains supported.
