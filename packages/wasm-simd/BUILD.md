# WASM SIMD noiDungTiengViet

## 🚀 noiDungTiengViet

### noiDungTiengViet

```bash
# noiDungTiengViet Rust
curl --proto '=https' --tlsv1.2 -sSf https://sh.rustup.rs | sh

# noiDungTiengViet wasm-pack
curl https://rustwasm.github.io/wasm-pack/installer/init.sh -sSf | sh
```

### noiDungTiengViet

1. **noiDungTiengViet**（noiDungTiengViet）：

   ```bash
   # noiDungTiengViet WASM noiDungTiengViet Chrome noiDungTiengViet
   npm run build:wasm
   ```

2. **noiDungTiengViet WASM noiDungTiengViet**：

   ```bash
   # noiDungTiengViet packages/wasm-simd noiDungTiengViet
   npm run build

   # noiDungTiengViet pnpm filter
   pnpm --filter @chrome-mcp/wasm-simd build
   ```

3. **noiDungTiengViet**：
   ```bash
   npm run build:dev  # noiDungTiengViet，noiDungTiengViet
   ```

### noiDungTiengViet

noiDungTiengViet，noiDungTiengViet `pkg/` noiDungTiengViet：

- `simd_math.js` - JavaScript noiDungTiengViet
- `simd_math_bg.wasm` - WebAssembly noiDungTiengViet
- `simd_math.d.ts` - TypeScript noiDungTiengViet
- `package.json` - NPM noiDungTiengViet

### noiDungTiengViet Chrome noiDungTiengViet

WASM noiDungTiengViet `app/chrome-extension/workers/` noiDungTiengViet，Chrome noiDungTiengViet：

```typescript
// noiDungTiengViet Chrome noiDungTiengViet
const wasmUrl = chrome.runtime.getURL('workers/simd_math.js');
const wasmModule = await import(wasmUrl);
```

## 🔧 noiDungTiengViet

1. noiDungTiengViet `src/lib.rs` noiDungTiengViet Rust noiDungTiengViet
2. noiDungTiengViet `npm run build` noiDungTiengViet
3. Chrome noiDungTiengViet WASM noiDungTiengViet

## 📊 noiDungTiengViet

```bash
# noiDungTiengViet Chrome noiDungTiengViet
import { runSIMDBenchmark } from './utils/simd-benchmark';
await runSIMDBenchmark();
```
