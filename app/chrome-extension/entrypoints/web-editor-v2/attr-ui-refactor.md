# Property Panel UI Refactor

## Mục tiêu

Tài liệu này ghi lại kế hoạch và trạng thái refactor UI cho Property Panel trong Web Editor v2. Trọng tâm là thay thế UI cũ trong `attr-ui.html` bằng các component TypeScript nhỏ, dễ bảo trì, có hành vi nhất quán và dễ mở rộng.

## Phạm vi file chính

- **Prototype cũ**: `/attr-ui.html`
- **Shadow host và CSS nền**: `ui/shadow-host.ts`
- **Panel chính**: `ui/property-panel/property-panel.ts`
- **Các control**: `ui/property-panel/controls/*.ts`
- **Component dùng chung**: `ui/property-panel/components/*.ts`

---

## Giai đoạn 0: Sửa lỗi nền tảng

### 0.1 Sửa lỗi hiển thị toolbar

**Vấn đề**: toolbar vẫn chiếm layout khi bị ẩn.

**Nguyên nhân**: CSS dùng `display: flex` hoặc `inline-flex` có thể ghi đè trạng thái `[hidden]`.

**Kết quả**:

- [x] Thêm rule `[hidden] { display: none !important; }` trong `shadow-host.ts`.

### 0.2 Number stepping

**Mục tiêu**:

1. Cho phép tăng giảm giá trị số bằng bàn phím.
2. Giữ nguyên đơn vị CSS khi chỉnh giá trị.

**Kết quả**:

- [x] Thêm `ui/property-panel/controls/number-stepping.ts`.
- [x] Hỗ trợ ArrowUp và ArrowDown.
- [x] Hỗ trợ Shift để tăng 10x và Alt để tăng 0.1x.
- [x] Hỗ trợ đơn vị CSS phổ biến: px, %, rem, em, vh, vw, vmin, vmax.
- [x] Áp dụng keyboard stepping cho:
  - `size-control.ts` - Width/Height
  - `spacing-control.ts` - Margin/Padding
  - `position-control.ts` - Top/Right/Bottom/Left/Z-Index
  - `layout-control.ts` - Gap
  - `typography-control.ts` - Font Size/Line Height
  - `appearance-control.ts` - Opacity/Border Radius/Border Width

---

## Giai đoạn 1: Chuẩn hóa giao diện

### 1.1 Màu sắc và trạng thái focus

| Hạng mục  | Trước              | Sau                    | Trạng thái |
| --------- | ------------------ | ---------------------- | ---------- |
| Nền panel | `#f8f8f8`          | `#ffffff`              | Hoàn tất   |
| Nền input | `#f0f0f0`          | `#f3f3f3`              | Hoàn tất   |
| Hover     | `#e8e8e8`          | border inset `#e0e0e0` | Hoàn tất   |
| Focus     | `box-shadow` ngoài | inset border `#3b82f6` | Hoàn tất   |
| Border    | `#e8e8e8`          | `#e5e5e5`              | Hoàn tất   |

**Kết quả**:

- [x] Cập nhật CSS trong `shadow-host.ts`.
- [x] Dùng inset border cho hover/focus để tránh thay đổi kích thước layout.
- [x] Tăng độ tương phản cho trạng thái nhập liệu.

### 1.2 Typography

| Hạng mục   | Trước    | Sau                     | Trạng thái |
| ---------- | -------- | ----------------------- | ---------- |
| Text chính | `13px`   | `11px`                  | Hoàn tất   |
| Label      | `11px`   | `10px`                  | Hoàn tất   |
| Input      | `12px`   | `11px`                  | Hoàn tất   |
| Font       | mặc định | Inter + system fallback | Hoàn tất   |

**Kết quả**:

- [x] Dùng Inter với fallback hệ thống.
- [x] Đồng bộ kích thước label, input và helper text.
- [x] Giảm mật độ thị giác cho panel nhỏ.

### 1.3 Spacing

| Hạng mục         | Trước       | Sau        | Trạng thái |
| ---------------- | ----------- | ---------- | ---------- |
| Chiều rộng panel | `320px`     | `280px`    | Hoàn tất   |
| Padding header   | `10px 14px` | `8px 12px` | Hoàn tất   |
| Body gap         | `10px`      | `12px`     | Hoàn tất   |

**Kết quả**:

- [x] Cập nhật `.we-panel`, `.we-prop-body`, `.we-field-group`.
- [x] Giảm padding header để panel gọn hơn.

### 1.4 Shadow và radius

| Hạng mục     | Trước        | Sau                              | Trạng thái |
| ------------ | ------------ | -------------------------------- | ---------- |
| Shadow panel | `0 1px 2px`  | tương đương Tailwind `shadow-xl` | Hoàn tất   |
| Radius       | `6px`        | `4px`                            | Hoàn tất   |
| Tab shadow   | chưa đồng bộ | `shadow-sm`                      | Hoàn tất   |

**Kết quả**:

- [x] Dùng shadow rõ hơn cho panel nổi.
- [x] Chuẩn hóa radius về 4px.
- [x] Đồng bộ shadow cho tab.

### 1.5 Group và section

| Hạng mục | Trước           | Sau             | Trạng thái |
| -------- | --------------- | --------------- | ---------- |
| Group    | rời rạc         | có cấu trúc rõ  | Hoàn tất   |
| Section  | thiếu phân tách | có `border-top` | Hoàn tất   |
| Header   | chưa nổi bật    | 11px + `#333`   | Hoàn tất   |

**Kết quả**:

- [x] Chuẩn hóa `.we-group`.
- [x] Dùng `border-top` để tách section.
- [x] Làm rõ group header.

---

## Giai đoạn 2: Input container và control

### 2.1 Input container

**Mục tiêu**: gom label, input, prefix và suffix vào một component nhất quán.

**Ví dụ cũ**:

```html
<div class="we-field">
  <span class="we-field-label">Width</span>
  <input class="we-input" />
</div>
```

**Ví dụ mới**:

```html
<div class="we-field">
  <span class="we-field-label">Position</span>
  <div class="we-input-container">
    <!-- Prefix -->
    <span class="we-input-container__prefix">X</span>
    <!-- Input -->
    <input class="we-input-container__input" />
    <span class="we-input-container__suffix">px</span>
    <!-- Suffix -->
  </div>
</div>
```

**Kết quả**:

- [x] Thêm CSS `.we-input-container` trong `shadow-host.ts`.
- [x] Thêm style cho `.we-input-container__prefix` và `.we-input-container__suffix`.
- [x] Thêm `ui/property-panel/components/input-container.ts`.
- [x] Dùng `:focus-within` để đồng bộ trạng thái hover/focus.

### 2.2 Control dùng input container

**Kết quả**:

- [x] `size-control.ts` - Width/Height với label W/H và suffix đơn vị.
- [x] `spacing-control.ts` - Margin/Padding theo lưới 2x2.
- [x] `position-control.ts` - Top/Right/Bottom/Left/Z-Index.
- [x] `layout-control.ts` - Gap.
- [x] `typography-control.ts` - Font Size/Line Height.
- [ ] `appearance-control.ts` - Opacity/Border Radius/Border Width cần rà soát thêm.

**Helper**:

- [x] Thêm `css-helpers.ts` với `extractUnitSuffix`, `hasExplicitUnit`, `normalizeLength`.
- [x] Tái sử dụng helper để tránh xử lý đơn vị lặp lại.

---

## Giai đoạn 3: Section và tab

### 3.1 Tổ chức tab

**Hiện trạng**: prototype có 4 tab: Design, CSS, Props, DOM.

**Đề xuất**: giữ 2 tab chính trong panel nhỏ: Design và CSS. Props/DOM có thể chuyển sang chế độ nâng cao hoặc inspector riêng.

**Phương án**:

- **A**: giữ 4 tab để đầy đủ chức năng.
- **B**: ẩn Props/DOM khỏi panel chính để giảm nhiễu.
- **C**: giữ 4 tab nhưng gom nội dung ít dùng vào Advanced.

**Việc còn lại**:

- [ ] Chốt chiến lược tab.
- [ ] Cập nhật navigation và trạng thái active.

---

## Giai đoạn 4: Layout controls

### 4.1 Flow direction

**Nguồn prototype**: `attr-ui.html:133-156`

**Mục tiêu**: hỗ trợ 4 giá trị `flex-direction`.

```text
[->] Row
[↓] Column
[<-] Row Reverse
[↑] Column Reverse
```

**Kết quả**:

- [x] Thêm `ui/property-panel/components/icon-button-group.ts`.
- [x] Thêm CSS `.we-icon-button-group` trong `shadow-host.ts`.
- [x] Tích hợp Direction select vào `layout-control.ts`.
- [x] Thêm SVG cho row, column, row-reverse và column-reverse.

### 4.2 Alignment

**Nguồn prototype**: `attr-ui.html:166-208`

**Mục tiêu**: điều khiển `justify-content` và `align-items` bằng lưới 3x3.

```text
[↖][↑][↗]
[←][·][→]
[↙][↓][↘]
```

**Kết quả**:

- [x] Thêm `ui/property-panel/components/alignment-grid.ts`.
- [x] Thêm CSS `.we-alignment-grid` trong `shadow-host.ts`.
- [x] Tích hợp Justify/Align select vào `layout-control.ts`.
- [x] Dùng `beginMultiStyle` để cập nhật nhiều style cùng lúc.

### 4.3 Color picker

**Mục tiêu**:

- Gọi `showPicker()` an toàn bằng try/catch.
- Hỗ trợ giá trị `var(--xxx)`.
- Chuẩn bị đường mở rộng cho alpha.

**Kết quả**:

- [x] Thêm fallback khi `showPicker()` lỗi hoặc không được hỗ trợ.
- [x] Hiển thị placeholder theo computed value cho `var()`.
- [ ] Hỗ trợ alpha bằng RGBA/HSLA.
- [ ] Cân nhắc color picker nâng cao như `@simonwep/pickr`.

---

## Giai đoạn 5: Effect controls

### 5.1 Shadow và blur

**Nguồn prototype**: `attr-ui.html:396-425`

**CSS liên quan**:

- `box-shadow`
- `filter: blur()`
- `backdrop-filter: blur()`

**Kết quả**:

- [x] Thêm `ui/property-panel/controls/effects-control.ts`.
- [x] Hỗ trợ `box-shadow`.
- [x] Hỗ trợ `filter`.
- [x] Hỗ trợ `backdrop-filter`.
- [x] Tích hợp vào property panel.
- [ ] Bổ sung preset shadow và blur.

### 5.2 Gradient

**Nguồn prototype**: `attr-ui.html:269-325`

**CSS liên quan**:

- `background-image: linear-gradient(...)`
- `background-image: radial-gradient(...)`

**Kết quả**:

- [x] Thêm `ui/property-panel/controls/gradient-control.ts`.
- [x] Parse CSS gradient thành state đơn giản.
- [x] Hỗ trợ linear và radial.
- [x] Hỗ trợ tối thiểu 2 color stop.
- [x] Tích hợp vào property panel.
- [ ] Bổ sung slider chỉnh góc và vị trí.
- [ ] Bổ sung thêm, xóa và sắp xếp color stop.

### 5.3 Token pill

**Nguồn prototype**: `attr-ui.html:374-384`

**Mục tiêu**: hiển thị CSS token dạng pill để người dùng nhận biết giá trị biến.

**Việc còn lại**:

- [ ] Nhận diện `var(--xxx)`.
- [ ] Hiển thị pill cho token.
- [ ] Bổ sung token picker.

---

## Giai đoạn 6: Dọn dẹp kỹ thuật

### 6.1 CSS

- [x] Gom CSS trùng lặp.
- [ ] Tách token màu và spacing.
- [ ] Giảm inline style trong `shadow-host.ts`.

### 6.2 Component

- [ ] Chuẩn hóa thư mục `ui/property-panel/components/`.
- [ ] Tách component dùng chung khỏi control cụ thể.
- [ ] Chuẩn hóa trạng thái disabled/enabled.

### 6.3 TypeScript

- [ ] Rà soát type cho control props.
- [ ] Loại bỏ code lặp.
- [ ] Giảm dùng `any`.

---

## Bảng trạng thái

| Giai đoạn | Nội dung           | Trạng thái        | Ghi chú                       |
| --------- | ------------------ | ----------------- | ----------------------------- |
| 0.1       | Sửa lỗi toolbar ẩn | Hoàn tất          | Thêm rule `[hidden]`          |
| 0.2       | Number stepping    | Hoàn tất          | `number-stepping.ts` + helper |
| 1.1       | Màu sắc            | Hoàn tất          | Nền, border, inset focus      |
| 1.2       | Typography         | Hoàn tất          | 11px + Inter fallback         |
| 1.3       | Spacing            | Hoàn tất          | Panel gọn hơn                 |
| 1.4       | Shadow và radius   | Hoàn tất          | shadow-xl + radius 4px        |
| 1.5       | Group/Section      | Hoàn tất          | Section rõ ràng hơn           |
| 2.1       | Input container    | Hoàn tất          | Prefix, suffix, focus state   |
| 2.2       | Control migration  | Hoàn tất một phần | Còn `appearance-control.ts`   |
| 3.1       | Tab strategy       | Chưa chốt         | Cần quyết định UX             |
| 4.1       | Flow direction     | Hoàn tất          | `icon-button-group.ts`        |
| 4.2       | Alignment          | Hoàn tất          | `alignment-grid.ts`           |
| 4.3       | Color picker       | Hoàn tất một phần | Cần alpha nâng cao            |
| 5.1       | Shadow và blur     | Hoàn tất một phần | Cần preset                    |
| 5.2       | Gradient           | Hoàn tất một phần | Cần slider và quản lý stop    |
| 5.3       | Token pill         | Chưa làm          | Cần token picker              |

## Nguyên tắc tiếp theo

1. Ưu tiên hoàn thiện các control đã có trước khi thêm control mới.
2. Giữ API component nhỏ và rõ ràng.
3. Mỗi control chỉ xử lý một nhóm style liên quan.
4. Tránh làm panel phụ thuộc trực tiếp vào DOM prototype cũ.
