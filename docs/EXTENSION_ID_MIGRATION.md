# Migrating chrome-ai-bridge to a new Chrome Extension ID

The Chrome Web Store assigns a fixed, 32-character ID to every extension
the first time it is uploaded. That ID is then used by Native Messaging
manifests (`allowed_origins`) to identify which extension may launch
the host binary.

The original `mcp-chrome-bridge` extension ID is:

```
hbdgbgagpkpjffpklnamcljpakneikee
```

It is hard-coded in two places:

- `app/native-server/src/scripts/constant.ts` (`EXTENSION_ID`)
- Every user machine that has previously run
  `mcp-chrome-bridge register` (and now `chrome-ai-bridge register`).

If we ever want to publish under a fresh Chrome Web Store listing, we
need a new extension ID. This document describes the exact steps to
follow so the migration does not break existing installs.

## 1. Get the new ID

After uploading the new `chrome-ai-bridge` zip to the Chrome Web Store
the first time, the dashboard will show an "ID" field, e.g.

```
kjdhfklsdjfhksdjfhksdjfhksdjfh
```

Note this value — it cannot be changed later.

## 2. Update the source

In `app/native-server/src/scripts/constant.ts`:

```ts
export const EXTENSION_ID = '<new 32-char id>';
export const HOST_NAME = '<reverse-DNS form of the new id>';
```

The `HOST_NAME` follows the reverse-DNS form that matches the
extension id (e.g. `abcdefghijklmnopabcdefghijklmnop` becomes
`com.example.abcdefghijklmnopabcdefghijklmnop.nativehost`). Picking
a stable mapping convention now means future code can derive the
host name from the extension id without manual edits.

## 3. Publish a transitional release

Ship `chrome-ai-bridge@0.3.0` that contains the new `EXTENSION_ID`. The
`register` command in this version will write Native Messaging
manifests with `allowed_origins: ["chrome-extension://<new-id>/"]`.

It MUST also continue to write the legacy manifest under the legacy
host name (`com.chromemcp.nativehost`) for users on the old extension
id. Implement this in `register.ts` by writing both manifests when
the new id is non-empty.

## 4. Bump the install guide

Update `docs/INSTALL_EN.md` and `docs/INSTALL_VI.md` to tell users
who have just installed the new Chrome Web Store listing to run:

```bash
chrome-ai-bridge register --new
```

(or whatever flag the new register command recognises) so their
manifest is updated.

## 5. Notify and deprecate

After a grace period (recommend 6 months):

1. Remove the legacy code path in `register.ts`.
2. Remove the legacy `bin` aliases in `app/native-server/package.json`.
3. Bump to `chrome-ai-bridge@1.0.0`.
4. Publish a final unpublish notice on the old Web Store listing.

## 6. Roll back if needed

If a regression slips through, ship a patch release that keeps both
ids accepted by the host. Do not delete the legacy constants
`EXTENSION_ID`/`HOST_NAME` in `constant.ts` until the grace period
ends — they are load-bearing for the "still works" claim in the
README.
