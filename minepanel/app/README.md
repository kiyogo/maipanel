# Minepanel App

Giao diện quản trị Minecraft viết bằng React 18, TypeScript và Vite 5. Thư mục này được chuyển từ `Minepanel/frontend` sang `minepanel/app`.

Ứng dụng dùng bộ component riêng trong `src/custom-ui`, biểu tượng Ant Design, React Router và Axios. Giao diện Minecraft, console, cấu hình, người chơi, plugin, sao lưu và quản lý tệp hiện hoạt động với dữ liệu mẫu/trạng thái trong trình duyệt; chưa gửi thao tác đến máy chủ Minecraft thực tế.

## Cài đặt và phát triển

Yêu cầu Node.js 22.x từ 22.13 hoặc 24.x từ 24.11 để dùng cùng API. Riêng Puppeteer 25.4.0 trong lockfile yêu cầu Node >=22.12.0. Puppeteer đang là dependency nhưng chưa được mã giao diện sử dụng.

Từ gốc repository:

```powershell
cd minepanel/app
'VITE_API_URL=http://localhost:3001/api/v1' | Set-Content .env.local
$env:PUPPETEER_SKIP_DOWNLOAD = 'true'
npm ci
npm run dev
```

Mở [http://localhost:5008](http://localhost:5008). Cổng được đặt trong `vite.config.ts` với `strictPort: true`; Vite không tự đổi cổng nếu `5008` đang bận. API phải chạy riêng theo [hướng dẫn API](../api/README.md). Nếu dùng API của Docker Compose, đổi URL sang `http://localhost:3002/api/v1`.

Biến `PUPPETEER_SKIP_DOWNLOAD` bỏ tải trình duyệt trong bước cài đặt dependency. Có thể bỏ thiết lập này nếu chủ động sử dụng Puppeteer và cần trình duyệt đi kèm.

## Kết nối API và đăng nhập

`src/api/axios.ts` dùng biến Vite `VITE_API_URL`, mặc định `/api/v1`. Biến Vite được đọc khi chạy dev/build, không phải cấu hình runtime của Nginx.

| Môi trường | `VITE_API_URL` |
| --- | --- |
| API chạy native tại cổng 3001 | `http://localhost:3001/api/v1` |
| API Compose công bố cổng 3002 | `http://localhost:3002/api/v1` |
| Giao diện Nginx trong Compose | Để mặc định `/api/v1`; Nginx proxy `/api/` |

Vite hiện không cấu hình proxy; bỏ biến khi chạy dev sẽ gửi API về chính cổng `5008`. Với bản đóng gói Docker, không đưa `.env.local` của máy phát triển vào build và giữ URL tương đối để sử dụng Nginx proxy.

Phiên đăng nhập lưu `minepanel_token` và `minepanel_user` trong `localStorage`. Axios gắn Bearer token vào request; khi gặp 401 ngoài trang đăng nhập, ứng dụng xóa phiên và chuyển sang `/login`.

`AuthContext.tsx` còn có fallback: khi gọi API đăng nhập thất bại và nhập đúng tài khoản mẫu ghi trong tệp, ứng dụng tạo token giả để xem giao diện. Fallback này chưa giới hạn theo chế độ development và vẫn có trong bản build. Token giả không được API chấp nhận. Vì vậy, việc mở được giao diện không chứng minh API/database hoạt động; cần kiểm tra response đăng nhập và hồ sơ thật.

## Các màn hình

| Route | Màn hình |
| --- | --- |
| `/login` | Đăng nhập |
| `/overview` | Tổng quan và trạng thái Minecraft mẫu |
| `/software` | Lựa chọn/phần mềm máy chủ |
| `/console` | Console mô phỏng |
| `/config` | Trình chỉnh sửa cấu hình mẫu |
| `/players`, `/players/:playerKey` | Danh sách/chi tiết người chơi mẫu |
| `/plugins` | Danh mục plugin mẫu |
| `/backups` | Bản sao lưu mẫu |
| `/files` | Trình quản lý tệp mô phỏng |

Các route quản trị đều dùng `MinecraftPanel.tsx`; màn hình tệp sử dụng `Files.tsx` với `mockFileSystem`. Chỉ số CPU/RAM/TPS được sinh trong trình duyệt, thao tác khởi động/dừng dùng timer. Giao diện không cài plugin, sửa tệp hay tạo bản sao lưu trên máy chủ thật.

Ứng dụng có hệ thống bản dịch tiếng Việt, Anh, Nhật và Trung; một số nhãn hiện vẫn được viết cố định bằng tiếng Việt. Ảnh nhân vật Minecraft được tải từ `mc-heads.net`; texture vật phẩm dùng jsDelivr nên một số ảnh cần kết nối Internet.

## Build và kiểm tra

```powershell
npm run build
npx tsc --noEmit
npm run preview -- --host 127.0.0.1 --port 4173
```

`npm run build` chạy `vite build` và tạo `dist/`. Vite chuyển đổi TypeScript nhưng không chạy kiểm tra kiểu; `npx tsc --noEmit` là kiểm tra riêng và có thể phát hiện lỗi dù build thành công. Repository hiện chưa có script lint hoặc test frontend. `npm run preview` dùng để xem bản build, cần `VITE_API_URL` đúng ngay ở bước build nếu không có reverse proxy.

Tại lần nhập mã nguồn ngày 07/09/2026, `npm ci` (với `PUPPETEER_SKIP_DOWNLOAD=true`) và `npm run build` đã thành công trên Node.js 24.11.1/npm 11.6.2. `npx tsc --noEmit` còn thất bại với lỗi có sẵn như thiếu export `MenuProps`/`UploadProps` và kiểu props của `custom-ui` chưa khớp. Build có cảnh báo bundle lớn; kết quả build không xác nhận các thao tác Minecraft đã có backend thực tế.

`vite-runner.js` là script gọi Vite riêng; script npm chính thức `dev` gọi trực tiếp `vite`.

## Docker và URL triển khai

Compose build ứng dụng từ `./app`, service vẫn tên `frontend`. Nginx phục vụ `dist/` trên cổng container `80` (máy chủ `3008`), fallback SPA về `index.html` và proxy `/api/` đến `http://backend:3001`.

Dockerfile dùng `node:22-alpine` cho bước build, `npm ci` để cài dependency theo lockfile và `PUPPETEER_SKIP_DOWNLOAD=true` để bỏ tải trình duyệt không dùng. `.dockerignore` loại tệp môi trường cục bộ, `node_modules` và `dist` khỏi build context; chỉ giữ mẫu `.env.example`.

Router dùng `BrowserRouter` không có `basename`, Vite không cấu hình `base`, và chuyển hướng đăng nhập dùng đường dẫn tuyệt đối `/login`. Thư mục repository `minepanel/app` không có nghĩa ứng dụng tự chạy tại URL `/minepanel/app` hoặc `/minepanel`; muốn dùng URL con cần chỉnh đồng bộ router, đường dẫn asset, API và reverse proxy. Xem [README Minepanel](../README.md) để biết giới hạn của toàn hệ thống.
