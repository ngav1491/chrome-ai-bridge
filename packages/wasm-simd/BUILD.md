# WASM SIMD Build Guide

## Tổng quan

Gói `packages/wasm-simd` chứa phần Rust/WASM dùng cho các tác vụ tính toán có thể hưởng lợi từ SIMD. Tài liệu này mô tả cách cài công cụ, build package và tích hợp artifact vào Chrome extension.

## Cài đặt công cụ

```bash
# Cài Rust
curl --proto '=https' --tlsv1.2 -sSf https://sh.rustup.rs | sh

# Cài wasm-pack
curl https://rustwasm.github.io/wasm-pack/installer/init.sh -sSf | sh
```

## Build

1. **Build WASM cho Chrome extension**:

   ```bash
   # Build WASM và copy artifact sang extension
   npm run build:wasm
   ```

2. **Build riêng package WASM**:

   ```bash
   # Chạy trong packages/wasm-simd
   npm run build

   # Hoặc dùng pnpm filter từ repo root
   pnpm --filter @chrome-mcp/wasm-simd build
   ```

3. **Build chế độ phát triển**:

   ```bash
   npm run build:dev  # build nhanh hơn, phù hợp khi đang phát triển
   ```

## Artifact đầu ra

Sau khi build, thư mục `pkg/` sẽ chứa:

- `simd_math.js` - JavaScript glue code.
- `simd_math_bg.wasm` - WebAssembly binary.
- `simd_math.d.ts` - TypeScript declarations.
- `package.json` - metadata cho package npm nội bộ.

## Tích hợp trong Chrome extension

WASM được copy vào `app/chrome-extension/workers/`. Trong Chrome extension, load module bằng URL runtime:

```typescript
// Load WASM từ Chrome extension runtime
const wasmUrl = chrome.runtime.getURL('workers/simd_math.js');
const wasmModule = await import(wasmUrl);
```

## Quy trình phát triển

1. Sửa mã Rust trong `src/lib.rs`.
2. Chạy `npm run build` trong package hoặc `npm run build:wasm` từ repo root.
3. Kiểm tra Chrome extension với artifact WASM mới.

## Benchmark

```bash
# Chạy benchmark trong ngữ cảnh Chrome extension
import { runSIMDBenchmark } from './utils/simd-benchmark';
await runSIMDBenchmark();
```
