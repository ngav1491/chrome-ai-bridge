# Property Panel UI noiDungTiengViet

## noiDungTiengViet

noiDungTiengViet UI noiDungTiengViet `attr-ui.html` noiDungTiengViet。noiDungTiengViet，noiDungTiengViet，noiDungTiengViet。

### noiDungTiengViet

- **noiDungTiengViet**：`/attr-ui.html`
- **noiDungTiengViet**：`ui/shadow-host.ts`
- **noiDungTiengViet**：`ui/property-panel/property-panel.ts`
- **noiDungTiengViet**：`ui/property-panel/controls/*.ts`

---

## noiDungTiengViet（noiDungTiengViet）

### 0.1 noiDungTiengViet Bug noiDungTiengViet ✅

**noiDungTiengViet**：toolbar noiDungTiengViet，noiDungTiengViet，noiDungTiengViet

**noiDungTiengViet**：CSS noiDungTiengViet `display: flex/inline-flex` noiDungTiengViet `[hidden]` noiDungTiengViet `display: none`

**noiDungTiengViet**：

- [x] noiDungTiengViet `shadow-host.ts` noiDungTiengViet `[hidden] { display: none !important; }` noiDungTiengViet

### 0.2 noiDungTiengViet ✅

**noiDungTiengViet**：

1. noiDungTiengViet placeholder noiDungTiengViet
2. Number noiDungTiengViet

**noiDungTiengViet**：

- [x] noiDungTiengViet `ui/property-panel/controls/number-stepping.ts` noiDungTiengViet
  - noiDungTiengViet ArrowUp/ArrowDown noiDungTiengViet
  - noiDungTiengViet Shift (10x)、Alt (0.1x) noiDungTiengViet
  - noiDungTiengViet CSS noiDungTiengViet (px, %, rem, em, vh, vw, vmin, vmax)
- [x] noiDungTiengViet control noiDungTiengViet（inline noiDungTiengViet，fallback noiDungTiengViet computed）
- [x] noiDungTiengViet keyboard stepping noiDungTiengViet：
  - `size-control.ts` - Width/Height
  - `spacing-control.ts` - Margin/Padding
  - `position-control.ts` - Top/Right/Bottom/Left/Z-Index
  - `layout-control.ts` - Gap
  - `typography-control.ts` - Font Size/Line Height
  - `appearance-control.ts` - Opacity/Border Radius/Border Width

---

## noiDungTiengViet：noiDungTiengViet ✅ noiDungTiengViet

### 1.1 noiDungTiengViet ✅

**noiDungTiengViet**：noiDungTiengViet+noiDungTiengViet

| noiDungTiengViet       | noiDungTiengViet              | noiDungTiengViet                              | noiDungTiengViet |
| ---------------------- | ----------------------------- | --------------------------------------------- | ---------------- |
| noiDungTiengViet       | `#f8f8f8`                     | `#ffffff`                                     | ✅               |
| noiDungTiengViet       | `#f0f0f0`                     | `#f3f3f3`                                     | ✅               |
| noiDungTiengViet hover | `#e8e8e8` (bg)                | `border #e0e0e0` (inset)                      | ✅               |
| noiDungTiengViet focus | `box-shadow` noiDungTiengViet | `inset 2px border #3b82f6` + noiDungTiengViet | ✅               |
| noiDungTiengViet       | `#e8e8e8`                     | `#e5e5e5`                                     | ✅               |

**noiDungTiengViet**：

- [x] noiDungTiengViet CSS noiDungTiengViet (`shadow-host.ts:56-97`)
- [x] noiDungTiengViet hover/focus noiDungTiengViet inset border noiDungTiengViet
- [x] noiDungTiengViet

### 1.2 noiDungTiengViet ✅

| noiDungTiengViet | noiDungTiengViet | noiDungTiengViet                  | noiDungTiengViet |
| ---------------- | ---------------- | --------------------------------- | ---------------- |
| noiDungTiengViet | `13px`           | `11px`                            | ✅               |
| noiDungTiengViet | `11px`           | `10px`                            | ✅               |
| noiDungTiengViet | `12px`           | `11px`                            | ✅               |
| noiDungTiengViet | noiDungTiengViet | Inter + noiDungTiengViet fallback | ✅               |

**noiDungTiengViet**：

- [x] noiDungTiengViet Inter noiDungTiengViet（noiDungTiengViet fallback）
- [x] noiDungTiengViet、noiDungTiengViet、noiDungTiengViet
- [x] noiDungTiengViet

### 1.3 noiDungTiengViet ✅

| noiDungTiengViet        | noiDungTiengViet | noiDungTiengViet | noiDungTiengViet |
| ----------------------- | ---------------- | ---------------- | ---------------- |
| noiDungTiengViet        | `320px`          | `280px`          | ✅               |
| Header noiDungTiengViet | `10px 14px`      | `8px 12px`       | ✅               |
| Body gap                | `10px`           | `12px`           | ✅               |

**noiDungTiengViet**：

- [x] noiDungTiengViet `.we-panel`, `.we-prop-body`, `.we-field-group` noiDungTiengViet padding/gap
- [x] noiDungTiengViet header noiDungTiengViet padding

### 1.4 noiDungTiengViet ✅

| noiDungTiengViet     | noiDungTiengViet | noiDungTiengViet   | noiDungTiengViet |
| -------------------- | ---------------- | ------------------ | ---------------- |
| noiDungTiengViet     | `0 1px 2px`      | Tailwind shadow-xl | ✅               |
| noiDungTiengViet     | `6px`            | `4px`              | ✅               |
| Tab noiDungTiengViet | noiDungTiengViet | `shadow-sm`        | ✅               |

**noiDungTiengViet**：

- [x] noiDungTiengViet（noiDungTiengViet shadow-xl）
- [x] noiDungTiengViet 4px
- [x] noiDungTiengViet Tab noiDungTiengViet

### 1.5 Group/Section noiDungTiengViet ✅

| noiDungTiengViet         | noiDungTiengViet                    | noiDungTiengViet | noiDungTiengViet |
| ------------------------ | ----------------------------------- | ---------------- | ---------------- |
| Group noiDungTiengViet   | noiDungTiengViet                    | noiDungTiengViet | ✅               |
| Section noiDungTiengViet | noiDungTiengViet                    | noiDungTiengViet | ✅               |
| Header noiDungTiengViet  | noiDungTiengViet + noiDungTiengViet | 11px + #333      | ✅               |

**noiDungTiengViet**：

- [x] noiDungTiengViet `.we-group` noiDungTiengViet
- [x] noiDungTiengViet Section noiDungTiengViet (`border-top`)
- [x] noiDungTiengViet Group header noiDungTiengViet

---

## noiDungTiengViet：noiDungTiengViet ✅ noiDungTiengViet

### 2.1 noiDungTiengViet ✅

**noiDungTiengViet**：noiDungTiengViet input，noiDungTiengViet，noiDungTiengViet：

- noiDungTiengViet（prefix）：noiDungTiengViet、noiDungTiengViet
- noiDungTiengViet（suffix）：noiDungTiengViet、noiDungTiengViet
- noiDungTiengViet hover/focus noiDungTiengViet

**noiDungTiengViet**：

```html
<div class="we-field">
  <span class="we-field-label">Width</span>
  <input class="we-input" />
</div>
```

**noiDungTiengViet**：

```html
<div class="we-field">
  <span class="we-field-label">Position</span>
  <div class="we-input-container">
    <!-- noiDungTiengViet -->
    <span class="we-input-container__prefix">X</span>
    <!-- noiDungTiengViet -->
    <input class="we-input-container__input" />
    <span class="we-input-container__suffix">px</span>
    <!-- noiDungTiengViet -->
  </div>
</div>
```

**noiDungTiengViet**：

- [x] noiDungTiengViet `shadow-host.ts` noiDungTiengViet `.we-input-container` noiDungTiengViet
- [x] noiDungTiengViet `.we-input-container__prefix` noiDungTiengViet `.we-input-container__suffix` noiDungTiengViet
- [x] noiDungTiengViet `ui/property-panel/components/input-container.ts` noiDungTiengViet
- [x] noiDungTiengViet hover/focus noiDungTiengViet（noiDungTiengViet `:focus-within`）

### 2.2 noiDungTiengViet Control noiDungTiengViet ✅ noiDungTiengViet

**noiDungTiengViet**：

- [x] `size-control.ts` - Width/Height（2noiDungTiengViet + W/H noiDungTiengViet + noiDungTiengViet）
- [x] `spacing-control.ts` - Margin/Padding（noiDungTiengViet 2x2 noiDungTiengViet + noiDungTiengViet + noiDungTiengViet）
- [x] `position-control.ts` - Top/Right/Bottom/Left/Z-Index（T/R/B/L noiDungTiengViet + noiDungTiengViet）
- [x] `layout-control.ts` - Gap（noiDungTiengViet + noiDungTiengViet）
- [x] `typography-control.ts` - Font Size/Line Height（noiDungTiengViet，line-height noiDungTiengViet）
- [ ] `appearance-control.ts` - Opacity/Border Radius/Border Width（noiDungTiengViet）

**noiDungTiengViet**：

- [x] noiDungTiengViet `css-helpers.ts` noiDungTiengViet（extractUnitSuffix, hasExplicitUnit, normalizeLength）
- [x] noiDungTiengViet helper，noiDungTiengViet

---

## noiDungTiengViet：Section noiDungTiengViet（noiDungTiengViet）

### 3.1 Tab noiDungTiengViet

**noiDungTiengViet**：4 noiDungTiengViet Tab（Design/CSS/Props/DOM）
**noiDungTiengViet**：2 noiDungTiengViet Tab（Design/CSS）

**noiDungTiengViet**：

- **noiDungTiengViet A**：noiDungTiengViet 4 noiDungTiengViet Tab，noiDungTiengViet
- **noiDungTiengViet B**：noiDungTiengViet Props/DOM noiDungTiengViet
- **noiDungTiengViet C**：noiDungTiengViet 4 noiDungTiengViet Tab，noiDungTiengViet

**noiDungTiengViet**：

- [ ] noiDungTiengViet Tab noiDungTiengViet
- [ ] noiDungTiengViet

---

## noiDungTiengViet：noiDungTiengViet（noiDungTiengViet）

### 4.1 Flow noiDungTiengViet ✅ noiDungTiengViet

**noiDungTiengViet**：`attr-ui.html:133-156`
**noiDungTiengViet**：4 noiDungTiengViet `flex-direction`

```
[→] Row
[↓] Column
[←] Row Reverse
[↑] Column Reverse
```

**noiDungTiengViet**：

- [x] noiDungTiengViet `ui/property-panel/components/icon-button-group.ts` noiDungTiengViet
- [x] noiDungTiengViet `shadow-host.ts` noiDungTiengViet `.we-icon-button-group` noiDungTiengViet
- [x] noiDungTiengViet `layout-control.ts` noiDungTiengViet Direction select
- [x] noiDungTiengViet SVG noiDungTiengViet（row/column/row-reverse/column-reverse）

### 4.2 Alignment noiDungTiengViet ✅ noiDungTiengViet

**noiDungTiengViet**：`attr-ui.html:166-208`
**noiDungTiengViet**：3x3 noiDungTiengViet `justify-content` + `align-items`

```
[↖][↑][↗]
[←][·][→]
[↙][↓][↘]
```

**noiDungTiengViet**：

- [x] noiDungTiengViet `ui/property-panel/components/alignment-grid.ts` noiDungTiengViet
- [x] noiDungTiengViet `shadow-host.ts` noiDungTiengViet `.we-alignment-grid` noiDungTiengViet
- [x] noiDungTiengViet `layout-control.ts` noiDungTiengViet Justify/Align select
- [x] noiDungTiengViet `beginMultiStyle` noiDungTiengViet

### 4.3 noiDungTiengViet Color Picker ✅ noiDungTiengViet

**noiDungTiengViet**：

- `showPicker()` noiDungTiengViet try/catch，noiDungTiengViet
- alpha noiDungTiengViet
- token noiDungTiengViet `var(--xxx)` noiDungTiengViet

**noiDungTiengViet**：

- [x] noiDungTiengViet `showPicker()` noiDungTiengViet（try/catch + fallback to click）
- [x] noiDungTiengViet `var()` noiDungTiengViet（noiDungTiengViet placeholder noiDungTiengViet computed value）

**noiDungTiengViet**：

- [ ] noiDungTiengViet alpha noiDungTiengViet（RGBA/HSLA）- noiDungTiengViet color picker
- [ ] noiDungTiengViet color picker（noiDungTiengViet `@simonwep/pickr`）

---

## noiDungTiengViet：noiDungTiengViet（noiDungTiengViet）

### 5.1 Shadow & Blur noiDungTiengViet

**noiDungTiengViet**：`attr-ui.html:396-425`
**noiDungTiengViet**：

- noiDungTiengViet/noiDungTiengViet
- noiDungTiengViet（Drop shadow/Inner shadow/Layer Blur/Backdrop Blur）
- noiDungTiengViet

**CSS noiDungTiengViet**：

- `box-shadow`
- `filter: blur()`
- `backdrop-filter: blur()`

**noiDungTiengViet**：

- [x] noiDungTiengViet `ui/property-panel/controls/effects-control.ts`
- [x] noiDungTiengViet `box-shadow` noiDungTiengViet
- [x] noiDungTiengViet `filter` noiDungTiengViet
- [x] noiDungTiengViet `backdrop-filter` noiDungTiengViet
- [x] noiDungTiengViet UI
- [ ] noiDungTiengViet/noiDungTiengViet（noiDungTiengViet，noiDungTiengViet）

### 5.2 noiDungTiengViet

**noiDungTiengViet**：`attr-ui.html:269-325`
**noiDungTiengViet**：

- Linear/Radial noiDungTiengViet
- noiDungTiengViet（color stops）
- noiDungTiengViet
- noiDungTiengViet

**CSS noiDungTiengViet**：

- `background-image: linear-gradient(...)`
- `background-image: radial-gradient(...)`

**noiDungTiengViet**：

- [x] noiDungTiengViet `ui/property-panel/controls/gradient-control.ts`
- [x] noiDungTiengViet（CSS gradient → noiDungTiengViet）
- [x] noiDungTiengViet/noiDungTiengViet
- [x] noiDungTiengViet 2 noiDungTiengViet
- [x] noiDungTiengViet property-panel（noiDungTiengViet Gradient noiDungTiengViet）
- [ ] noiDungTiengViet slider（noiDungTiengViet，noiDungTiengViet）
- [ ] noiDungTiengViet color stop noiDungTiengViet/noiDungTiengViet/noiDungTiengViet（noiDungTiengViet，noiDungTiengViet）

### 5.3 Token/noiDungTiengViet Pill noiDungTiengViet

**noiDungTiengViet**：`attr-ui.html:374-384`
**noiDungTiengViet**：noiDungTiengViet CSS noiDungTiengViet，noiDungTiengViet pill

**noiDungTiengViet**：

- [ ] noiDungTiengViet `var(--xxx)` noiDungTiengViet
- [ ] noiDungTiengViet pill noiDungTiengViet
- [ ] noiDungTiengViet token picker

---

## noiDungTiengViet：noiDungTiengViet（noiDungTiengViet）

### 6.1 noiDungTiengViet

- [x] noiDungTiengViet CSS noiDungTiengViet（noiDungTiengViet）
- [ ] noiDungTiengViet token
- [ ] noiDungTiengViet inline style，noiDungTiengViet `shadow-host.ts`

### 6.2 noiDungTiengViet

- [ ] noiDungTiengViet `ui/property-panel/components/`
- [ ] noiDungTiengViet
- [ ] noiDungTiengViet disabled/enabled noiDungTiengViet

### 6.3 noiDungTiengViet

- [ ] noiDungTiengViet TypeScript noiDungTiengViet
- [ ] noiDungTiengViet
- [ ] noiDungTiengViet any noiDungTiengViet

---

## noiDungTiengViet

| noiDungTiengViet | noiDungTiengViet                      | noiDungTiengViet    | noiDungTiengViet                                       |
| ---------------- | ------------------------------------- | ------------------- | ------------------------------------------------------ |
| 0.1              | noiDungTiengViet Bug noiDungTiengViet | ✅                  | noiDungTiengViet `[hidden]` noiDungTiengViet           |
| 0.2              | noiDungTiengViet                      | ✅                  | number-stepping + noiDungTiengViet                     |
| 1.1              | noiDungTiengViet                      | ✅                  | noiDungTiengViet + noiDungTiengViet + inset focus      |
| 1.2              | noiDungTiengViet                      | ✅                  | 11px noiDungTiengViet + Inter noiDungTiengViet         |
| 1.3              | noiDungTiengViet                      | ✅                  | noiDungTiengViet                                       |
| 1.4              | noiDungTiengViet                      | ✅                  | shadow-xl + 4px noiDungTiengViet                       |
| 1.5              | Group/Section noiDungTiengViet        | ✅                  | noiDungTiengViet                                       |
| 2.1              | noiDungTiengViet                      | ✅                  | noiDungTiengViet + CSS noiDungTiengViet                |
| 2.2              | noiDungTiengViet Controls             | ✅                  | noiDungTiengViet，noiDungTiengViet css-helpers.ts      |
| 3.1              | Tab noiDungTiengViet                  | noiDungTiengViet    |                                                        |
| 4.1              | Flow noiDungTiengViet                 | ✅                  | icon-button-group.ts + noiDungTiengViet layout-control |
| 4.2              | Alignment noiDungTiengViet            | ✅                  | alignment-grid.ts + noiDungTiengViet layout-control    |
| 4.3              | noiDungTiengViet Color Picker         | ✅ noiDungTiengViet | showPicker noiDungTiengViet + var() noiDungTiengViet   |
| 5.1              | Shadow & Blur                         | ✅                  | effects-control.ts + noiDungTiengViet property-panel   |
| 5.2              | noiDungTiengViet                      | ✅                  | gradient-control.ts + noiDungTiengViet property-panel  |
| 5.3              | Token Pill                            | noiDungTiengViet    |                                                        |

---

## noiDungTiengViet

1. **noiDungTiengViet**：noiDungTiengViet Phase noiDungTiengViet
2. **noiDungTiengViet**：noiDungTiengViet
3. **noiDungTiengViet**：noiDungTiengViet，noiDungTiengViet
4. **noiDungTiengViet**：noiDungTiengViet，noiDungTiengViet DOM noiDungTiengViet
