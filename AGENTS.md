## Learned User Preferences

- Communicates in Vietnamese; expects all assistant responses in Vietnamese as well.
- Uses "anh"/"em" sibling framing when addressing the assistant.
- Prefers thorough audits that fully replace/remove legacy content rather than partial translations.
- Expects verification (build, parse, JSON validity) after any non-trivial change to the codebase.
- When rebrand/rename work is requested, prefers preserving existing CLI binary/package names for backward compatibility over a clean break.

## Learned Workspace Facts

- Project: Chrome extension + native MCP bridge for AI-assisted browser control.
- GitHub repo: `ngav1491/chrome-ai-bridge` (public). Local clone path: `/app/data/Project/mcp-chrome`.
- Chrome extension default locale is `vi`; locale file lives at `app/chrome-extension/_locales/vi/messages.json`.
- Locales `zh_CN` and `zh_TW` have been removed; only `en`, `vi`, and `ja` remain.
- Docs are bilingual: each `README.md` / `docs/*.md` has a `_vi.md` counterpart; Chinese-only `_zh.md` files have been deleted.
- Prompts also have `_vi.md` versions under `prompt/`; the original `content-analize.md`, `modify-web.md`, and `excalidraw-prompt.md` are kept as the canonical versions.
- The CLI binary is now published as `chrome-ai-bridge`; the legacy `mcp-chrome-bridge` and `chrome-mcp-bridge` names are kept as bin aliases in `app/native-server/package.json` for backwards compatibility. The legacy `mcp-chrome-bridge` log directory on disk is no longer written to by new installs.
- Build command for the full project: `corepack pnpm build` from the repo root.
