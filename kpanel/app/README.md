# Kpanel App

Giao diện quản trị Kpanel dùng React 18, TypeScript, Vite 5 và React Router 6. Thành phần giao diện nằm trong `src/custom-ui`, sử dụng biểu tượng `@ant-design/icons`; dự án không khai báo thư viện `antd` trong dependencies.

Thư mục này được chuyển từ `Kpanel/frontend` sang `kpanel/app`. Xem [tổng quan Kpanel](../README.md) và [API](../api/README.md).

## Chạy trên máy

Yêu cầu Node.js 22.x từ 22.13 hoặc 24.x từ 24.11, npm và API Kpanel đang chạy. Từ thư mục gốc repository:

```sh
cd kpanel/app
npm ci
```

Tạo `.env.local` từ mẫu, trên PowerShell:

```powershell
Copy-Item .env.example .env.local
```

Đặt URL API trong `.env.local`:

```dotenv
VITE_API_URL=http://localhost:3001/api/v1
```

```sh
npm run dev
```

Mở `http://localhost:3006`. Vite khai báo cổng `3006`; nếu cổng bận, xem URL thực tế trong terminal. Có thể dùng `npm run dev -- --strictPort` để báo lỗi khi cổng đã bị chiếm.

Axios mặc định gọi `/api/v1` nếu không có `VITE_API_URL`. Vite hiện không cấu hình proxy API nên phát triển bằng hai tiến trình cần URL tuyệt đối như trên. Dùng host HTTP `localhost` hoặc `127.0.0.1` để phù hợp CORS mặc định của API. Đăng nhập bằng tài khoản đã được API khởi tạo; thông tin tài khoản demo được khai báo trong [seed.service.ts](../api/src/seed.service.ts).

## Build và phục vụ

```sh
npm run build
npm run preview
```

Build nằm trong `dist/`. `preview` phục vụ thử build tại URL Vite thông báo; đây không phải máy chủ production và không có proxy API. Nếu build để xem bằng preview, đặt URL API tuyệt đối trước khi build.

`VITE_API_URL` được nhúng vào bundle khi Vite build. Đổi biến môi trường của container Nginx sau khi build không thay URL đã được nhúng. Không đưa khóa bí mật vào biến `VITE_*`.

Dockerfile build bằng Node.js 22, sau đó phục vụ tệp tĩnh bằng Nginx. Cấu hình [nginx.conf](nginx.conf) xử lý fallback của React Router và chuyển `/api/` sang `backend:3001`, là tên service API trong Compose. Với cách chạy Compose chuẩn, để Axios sử dụng URL tương đối `/api/v1`; các tệp môi trường cục bộ cần được loại khỏi build context.

Giao diện hiện giả định được phục vụ tại gốc domain (`/`): Vite chưa có `base` riêng, Router chưa có `basename`, và xử lý lỗi 401 chuyển tới `/login`. Đường dẫn mã nguồn `kpanel/app` không tự tạo URL `/kpanel/app`; triển khai dưới subpath cần chỉnh các cấu hình này và proxy tương ứng.

## Màn hình và phạm vi kết nối

| Nhóm | Route chính | Trạng thái |
| --- | --- | --- |
| Đăng nhập | `/login` | Gọi API đăng nhập, lưu JWT/user trong `localStorage` |
| Tổng quan | `/` | Thống kê từ API |
| Máy chủ | `/monitor`, `/servers` | Danh sách/bản ghi máy chủ từ API |
| Dự án | `/projects`, `/projects/:category/:id` | Quản lý dữ liệu dự án; nhiều tab cấu hình còn là giao diện mẫu |
| Database | `/database`, `/database/:type` | Quản lý bản ghi database |
| Tài khoản, nhật ký | `/accounts`, `/logs` | Gọi API tài khoản và log |
| AI Center | `/ai` | Hội thoại, bộ nhớ, tác vụ và phê duyệt qua API |
| Files, terminal, bảo mật, ứng dụng | `/files`, `/terminal`, `/security`, `/apps` | Có dữ liệu/trạng thái mô phỏng; không tương đương vận hành máy chủ thật |
| Minecraft | `/game/minecraft` và các tab con | Giao diện demo với dữ liệu/trạng thái mô phỏng |
| Cài đặt, demo bảng | `/settings`, `/table-demo` | Cấu hình UI và màn hình demo |

Ngôn ngữ được khai báo gồm tiếng Việt, Anh, Nhật và Trung. `src/api/endpoints.ts` là nơi định nghĩa client API. Việc một hàm client tồn tại không đảm bảo API có endpoint tương ứng: nhóm Security và Backup chưa có controller ở API hiện tại.

## Cấu trúc và kiểm tra

```text
src/
├── api/          # Axios, JWT interceptor, client endpoints
├── components/   # Bảng, animation và tab cấu hình dự án
├── context/      # Đăng nhập và ngôn ngữ
├── custom-ui/    # Bộ thành phần giao diện và theme
├── pages/        # Các màn hình quản trị
└── App.tsx       # Layout và routes
```

`package.json` chỉ khai báo `dev`, `build`, `preview`; chưa có script unit test, e2e hoặc lint. `npm run build` kiểm tra khả năng bundle bằng Vite, không chạy TypeScript type checking. Nếu thay đổi kiểu dữ liệu, kiểm tra TypeScript riêng và xử lý các lỗi hiện có trước khi dùng kiểm tra đó làm điều kiện CI.

Tại lần nhập mã nguồn ngày 07/09/2026, `npm ci` và `npm run build` đã chạy thành công trên Node.js 24.11.1/npm 11.6.2. Kiểm tra riêng bằng `npx tsc --noEmit` còn thất bại với lỗi có sẵn như `MenuProps` chưa export và các props của `custom-ui` chưa khớp nơi sử dụng. Build có cảnh báo bundle lớn; chưa có kiểm thử vận hành toàn bộ giao diện/API.

Phiên đăng nhập nằm trong `localStorage`; khi API trả 401, client xóa phiên và đưa về `/login`. UI bảo vệ route bằng trạng thái đăng nhập, còn việc kiểm soát truy cập dữ liệu phải được API thực hiện.
