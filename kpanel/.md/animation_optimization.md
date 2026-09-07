# Kế hoạch tối ưu hiệu ứng — Siêu mượt, hiệu ứng đẹp

Mục tiêu: đạt trải nghiệm animation mượt nhất có thể (60–120 FPS ở mục tiêu), giảm jank, và giữ tiêu chí thẩm mỹ đồng nhất.

1) Audit nhanh (1 day)
- Liệt kê tất cả nơi có animation/effects (transitions, modals, toasts, charts, list updates, page nav, hover effects, parallax)
- Ghi lại hiện trạng: loại animation, trigger, duration, CSS vs JS, lib dùng, rendering cost
- Chụp trace performance mẫu (DevTools Performance, FPS meter)

2) Đặt mục tiêu & KPI (0.5 day)
- Target: 60 FPS min trên desktop, 60 FPS trên mobile tầm trung (hoặc 120 FPS nếu có màn 120Hz)
- Percentile targets: 95th percentile frame time < 16ms
- Key metrics: FPS, Long Frames count, Main-thread CPU %, Time to Interactive

3) Nguyên tắc kỹ thuật (immediate)
- Animate composite-only properties: `transform` và `opacity` ưu tiên. Tránh animate `width`, `height`, `top`, `left`, `margin`, `padding`, `border-radius` (trừ khi được canvas/WebGL xử lý).
- Sử dụng `will-change: transform, opacity` một cách thận trọng (chỉ trước animation, remove sau khi xong).
- Promote layers to GPU bằng `transform: translateZ(0)` hoặc `will-change`, nhưng giám sát memory/layers count.
- Thay đổi DOM ít nhất: group DOM updates, batch style reads/writes (rAF), tránh layout thrashing.
- Dùng `requestAnimationFrame` cho JS-driven animations; throttle/debounce events (scroll, resize).
- Prefer CSS transitions/animations over JS when logic đơn giản.

4) Patterns & libraries (1-2 days)
- Lightweight: use CSS keyframes + transition for simple effects.
- For React: consider `framer-motion` hoặc `react-spring` for physics-based, with `layout` animations sparingly.
- For vector animations: `lottie-web` (render SVG/Canvas) for complex illustrations.
- For heavy particle/3D effects: offload to WebGL (three.js) or Canvas with offscreen rendering.

5) Rendering optimization
- Minimize paint regions: avoid large box-shadows and backdrop-filter; use pseudo-elements for shadows where possible.
- Reduce expensive CSS (filter, backdrop-filter, complex shadows, CSS variables computed each frame).
- Use `contain: paint` / `contain: layout` where supported to limit reflow.
- Avoid animating large images; use sprites or transform within a container.

6) Accessibility & prefs
- Respect `prefers-reduced-motion` — provide reduced/no animation variants.
- Ensure keyboard focus states remain visible if animations suppressed.

7) Instrumentation & testing (continuous)
- Add perf traces to CI for critical routes (Lightweight: Lighthouse CI for perf & accessibility)
- Use Chrome DevTools FPS meter, Performance profiler, and Web Vitals
- Automate smoke tests measuring frame drops on recorded scenarios (puppeteer + trace)

8) Implementation plan (Sprint-sized tasks)
- Sprint 0 (setup + audit): audit animations, add perf harness, define KPIs — 3 days
- Sprint 1 (core fixes): convert costly animations to `transform/opacity`, batch DOM updates, implement will-change lifecycle helpers — 2 weeks
- Sprint 2 (enhancements): integrate framer-motion/lottie for complex UX, improve charts animation (canvas/WebGL) — 2 weeks
- Sprint 3 (polish): theme-aware animations, add reduce-motion support, finalize tests & rollout — 1 week

9) Quick actionable checklist (developer guide)
- Audit every animated component: list property, frames cost, replace non-composite properties
- Add helper utility: `useSmoothAnimation()` to lifecycle `will-change` + rAF batching
- Use `prefers-reduced-motion` CSS and JS branches
- Avoid forcing synchronous layout reads inside animation loops
- Limit simultaneous active layers; merge children where possible

10) Measurement recipes
- Real-time: use `PerformanceObserver` to collect long tasks and frame timing
- Lab: Lighthouse CI, Puppeteer traces, compare before/after
- Manual: DevTools Rendering > Paint flashing, Layers panel, FPS overlay

---
Ghi chú: muốn mình bắt tay vào "Audit hiện trạng" (mình sẽ liệt kê components có animation và chụp trace sample), hay bắt đầu implement helper `useSmoothAnimation()` và chỉnh vài component mẫu? Chọn `audit` hoặc `implement`.