# UI Design Guidelines – Kpanel

## 🎯 Mục tiêu thiết kế
- **Đơn giản, sạch sẽ, dễ dùng**: Người dùng có thể truy cập và thao tác mà không bị rối mắt.
- **Chuyên nghiệp, hiện đại**: Giao diện trông vừa *minimalistic* vừa có cảm giác tin cậy.
- **Tối thiểu màu sắc & viền**: Sử dụng **1‑2 màu chủ đạo** và **không dùng hiệu ứng mờ, viền màu**.
- **Bo tròn nhẹ**: Các khối (card, button, input) có **border‑radius 5px**; nếu muốn bo tròn toàn bộ, có thể tăng tới **12px** cho hình chữ nhật.
- **Hiệu ứng nhẹ**: Chỉ dùng **transition** đơn giản (0.15‑0.2s) cho hover/focus, không có blur hoặc shadow mạnh.

---

## 🖌️ Bảng màu (Palette)
| Vai trò | Mã màu | Mô tả |
|---------|--------|-------|
| **Màu nền chính** | `#FDFDFD` (trắng gần) | Nền sạch, giảm mắt.
| **Màu nền phụ** | `#F5F5F5` | Dùng cho các panel, card, sidebar nhẹ.
| **Màu nhấn (accent)** | `#009688` (xanh ngọc) | Nút, link, highlight.
| **Màu văn bản** | `#212121` (đen đậm) | Đọc tốt trên nền sáng.
| **Màu phụ nhẹ** | `#999999` | Text phụ, placeholder.

> **Lưu ý**: Không dùng gradient hay màu pastel quá nhiều; tuân thủ tối đa **3 màu** trong một màn hình.

---

## 🔤 Kiểu chữ (Typography)
- **Font chữ**: `Inter` (Google Font) – hiện đại, độ đọc tốt, hỗ trợ đa ngôn ngữ.
- **Cỡ chữ**:
  - Body: `14px`
  - Heading 1: `24px`
  - Heading 2: `20px`
  - Heading 3: `18px`
- **Độ dày**: `400` cho body, `600` cho tiêu đề.
- **Khoảng cách dòng**: `1.5` (150%).
- **Khoảng cách chữ**: `0` (không cần tracking).

---

## 📐 Khoảng cách & Layout
- **Container padding**: `24px` xung quanh nội dung chính.
- **Gutters (khoảng cách giữa các cột)**: `16px`.
- **Margin giữa các khối**: `24px` (đối với card, section).
- **Grid system**: 12‑cột, mỗi cột `1fr`; sử dụng CSS Grid hoặc Flexbox.

---

## 🖱️ Thành phần UI chính
### 1. Nút (Button)
```css
.button {
  background-color: #0066FF;
  color: #ffffff;
  border: none;            /* Không viền */
  border-radius: 5px;      /* Bo góc nhẹ */
  padding: 8px 16px;
  cursor: pointer;
  transition: background-color 0.15s ease;
}
.button:hover {
  background-color: #0055DD; /* Độ sáng nhẹ hơn */
}
```
- **Kích thước**: Small (32px cao), Normal (40px), Large (48px).
- **Không shadow**; chỉ có thay đổi màu nền khi hover.

### 2. Ô nhập (Input)
```css
.input {
  width: 100%;
  padding: 8px 12px;
  border: 1px solid #E0E0E0; /* Viền nhẹ, màu xám rất nhạt */
  border-radius: 5px;
  background-color: #FDFDFD;
  color: #212121;
  transition: border-color 0.15s ease;
}
.input:focus {
  border-color: #0066FF;
  outline: none;
}
```
- **Placeholder**: `#999999`.
- **Không border‑shadow**.

### 3. Card / Panel
```css
.card {
  background-color: #FFFFFF;
  border: 1px solid #E0E0E0; /* Viền siêu mỏng */
  border-radius: 8px;          /* Bo tròn nhẹ hơn */
  padding: 20px;
  transition: box-shadow 0.15s ease;
}
.card:hover {
  box-shadow: 0 1px 3px rgba(0,0,0,0.08); /* Shadow siêu nhẹ */
}
```
- **Không gradient**, không viền màu nổi.

### 4. Bảng (Table)
```css
.table {
  width: 100%;
  border-collapse: collapse;
}
.table th,
.table td {
  padding: 12px 8px;
  border-bottom: 1px solid #E0E0E0; /* Đường kẻ nhạt */
  text-align: left;
  font-size: 14px;
}
.table th {
  background-color: #F5F5F5; /* Header nhẹ */
  font-weight: 600;
}
```
- **Không zebra‑stripe**, chỉ có đường phân cách nhẹ.

### 5. Sidebar (Thanh bên)
```css
.sidebar {
  width: 240px;
  background-color: #F5F5F5; /* Màu nền phụ */
  padding: 24px 0;
}
.sidebar a {
  display: block;
  padding: 10px 20px;
  color: #212121;
  text-decoration: none;
  border-radius: 5px;
  transition: background 0.15s;
}
.sidebar a:hover {
  background-color: #EAEAEA;
}
```
- **Không viền**, chỉ có highlight màu nền nhẹ khi hover.

---

## ✨ Hiệu ứng (Animations)
- **Transition**: dùng `transition: all 0.15s ease` cho hầu hết các tương tác.
- **Không blur**, không shadow mạnh.
- **Không animation phức tạp** như carousel, chỉ có fade‑in nhanh khi component xuất hiện.

---

## 📏 Bo góc (Border‑Radius)
- **Button / Input / Sidebar link**: `5px` (đặc trưng). 
- **Card / Modal**: `8‑12px`. 
- **Nếu muốn bo tròn toàn bộ (circular)**: dùng `border-radius: 9999px` cho các hình tròn (avatar, badge).

---

## 📁 Cấu trúc file CSS (được đề xuất) 
```
src/
 ├─ assets/          # Ảnh, icon
 ├─ components/      # Các component React (Button.tsx, Input.tsx …)
 │   ├─ Button/
 │   │   ├─ Button.tsx
 │   │   └─ Button.module.css
 │   └─ …
 ├─ styles/
 │   ├─ reset.css          # CSS reset (normalize)
 │   ├─ variables.css      # --color-primary, --radius-sm ...
 │   ├─ typography.css
 │   └─ layout.css
 └─ App.tsx
```
- **variables.css** chứa các biến màu, radius, spacing để duy trì nhất quán.

---

## 📋 Checklist cuối cùng
- [ ] Sử dụng **Inter** làm font chính.
- [ ] Áp dụng **palette** 3 màu (trắng, xám nhạt, xanh đậm).
- [ ] Bo góc **5px** cho hầu hết thành phần; **8‑12px** cho card, modal.
- [ ] Loại bỏ mọi **shadow mạnh**, **blur**, **border màu**.
- [ ] Kiểm tra trên **dark mode**: chuyển nền sang `#212121` và text sang `#FFFFFF` – vẫn giữ *minimal*.
- [ ] Đảm bảo **responsive**: các component tự co lại trên màn hình < 768px.

---

## 🎉 Kết luận
Với những nguyên tắc trên, giao diện Kpanel sẽ đạt được *độ sạch, chuyên nghiệp, và tối thiểu* mà bạn mong muốn, đồng thời vẫn đủ tính năng để người dùng thao tác nhanh chóng mà không bị rối mắt.

---

> **Lưu ý**: Tất cả nội dung này đã được lưu vào tệp `d:\DATA\source\Kpanel\ui_design_guidelines.md`.
