# Minepanel API

API NestJS 11 viết bằng TypeScript, dùng PostgreSQL qua TypeORM, bcrypt và JWT. Thư mục này được chuyển từ `Minepanel/backend` sang `minepanel/api`. API hiện quản lý tài khoản, người dùng, nhật ký và thống kê; chưa triển khai điều khiển Minecraft/RCON hay truy cập tệp máy chủ.

## Yêu cầu và khởi chạy

- Node.js 22.x từ 22.13 hoặc 24.x từ 24.11 và npm. Lockfile khóa TypeORM 1.0.0 với yêu cầu Node `^20.19.0 || ^22.13.0 || >=24.11.0`; chọn cùng một phiên bản Node phù hợp cho API và ứng dụng.
- PostgreSQL; Compose của Minepanel sử dụng PostgreSQL 16.
- Redis và khóa Gemini không được mã nguồn API hiện tại sử dụng.

Từ gốc repository:

```powershell
cd minepanel
docker compose up -d postgres
cd api
Copy-Item .env.example .env
```

Điền thông tin kết nối và JWT trong `.env`, rồi:

```powershell
npm ci
npm run start:dev
```

API lắng nghe `http://localhost:3001/api/v1` khi `PORT=3001`. Không có endpoint healthcheck riêng; `GET /api/v1` không phải route đang đăng ký.

## Biến môi trường

Nest dùng `ConfigModule.forRoot({ isGlobal: true })` để đọc `.env` tại thư mục làm việc.

| Biến | Hành vi / giá trị cần cấu hình |
| --- | --- |
| `DB_HOST` | Mặc định `localhost`; trong Compose là `postgres` |
| `DB_PORT` | Mặc định `5432`; chạy API ngoài Docker với PostgreSQL Compose dùng `5433` |
| `DB_USERNAME` | Mặc định `minepanel`; phải khớp tài khoản PostgreSQL |
| `DB_PASSWORD` | Điền mật khẩu database; mã hiện có fallback cố định dành cho phát triển |
| `DB_NAME` | Mặc định `minepanel` |
| `JWT_SECRET` | Đặt khóa ngẫu nhiên riêng; cả bộ ký và bộ xác thực dùng biến này, hiện có fallback cố định |
| `JWT_EXPIRES_IN` | Mặc định `7d` |
| `PORT` | Mặc định `3001` |

Không đưa `.env` hoặc giá trị bí mật vào Git. `api/.env` không tự nạp vào Docker Compose; Compose sử dụng khối `environment` của service `backend`.

## API hiện có

Mọi đường dẫn dưới đây có tiền tố `/api/v1`. Các route có xác thực dùng header `Authorization: Bearer <access_token>`.

| Phương thức | Đường dẫn | Xác thực | Chức năng |
| --- | --- | --- | --- |
| `POST` | `/auth/login` | Không | Nhận `email`, `password`; trả `access_token` và người dùng |
| `GET` | `/auth/profile` | JWT | Trả hồ sơ của người dùng trong token, loại trường mật khẩu |
| `GET` | `/users` | JWT | Danh sách người dùng, loại trường mật khẩu |
| `GET` | `/users/:id` | JWT | Chi tiết người dùng; hiện còn trả trường hash mật khẩu |
| `POST` | `/users` | JWT | Tạo người dùng: `email`, `name`, `password`, `role` tùy chọn |
| `PATCH` | `/users/:id` | JWT | Cập nhật `name`, `role`, `isActive` |
| `DELETE` | `/users/:id` | JWT | Xóa người dùng |
| `GET` | `/logs?limit=100` | JWT | Nhật ký mới nhất, mặc định tối đa 100 bản ghi |
| `DELETE` | `/logs` | JWT | Xóa toàn bộ nhật ký |
| `GET` | `/dashboard/stats` | JWT | Tổng tài khoản, số hoạt động và 5 nhật ký mới nhất |

Vai trò lưu trong database gồm `Administrator`, `Operator`, `Viewer`, mặc định `Viewer`. Hiện controller chỉ dùng `JwtAuthGuard`; chưa có guard giới hạn thao tác theo vai trò. Không có endpoint đăng ký công khai, đổi mật khẩu, refresh token hoặc quản lý Minecraft.

`ValidationPipe` bật `whitelist` và `transform`. Mật khẩu khi đăng nhập/tạo tài khoản tối thiểu 6 ký tự theo DTO. API tạo tài khoản băm mật khẩu bằng bcrypt.

## Database và seed

Các entity chính: `users` và `logs`. TypeORM tự đồng bộ cấu trúc bằng `synchronize: true` mỗi lần khởi động; chưa có migration trong repository.

`SeedService` chạy khi ứng dụng bootstrap. Nếu bảng người dùng trống, service tạo một quản trị viên với thông tin mẫu cố định trong `src/seed.service.ts` và in thông tin đó vào log. Nếu bảng nhật ký trống, service thêm các nhật ký Minecraft/RCON mẫu. Các nhật ký này không xuất phát từ kết nối máy chủ Minecraft thực tế. Chưa có biến môi trường cấu hình/tắt seed.

## Lệnh npm

| Lệnh | Mục đích |
| --- | --- |
| `npm run start:dev` | Chạy Nest và theo dõi thay đổi |
| `npm run start` | Chạy ứng dụng qua Nest CLI |
| `npm run start:debug` | Chạy watch và Node inspector |
| `npm run build` | Biên dịch vào `dist/` |
| `npm run start:prod` | Chạy `node dist/main` sau khi build |
| `npm test -- --runInBand` | Chạy unit test |
| `npm run test:watch` / `npm run test:cov` | Theo dõi test / báo cáo coverage |
| `npm run test:e2e` | Chạy bộ e2e mẫu, cần database riêng cho test |
| `npm run lint` | ESLint với `--fix`, có thể sửa tệp |
| `npm run format` | Prettier, sửa tệp nguồn và test |

Unit test hiện chỉ kiểm tra `AppController` mẫu trả `Hello World!`; không bao phủ API chức năng. E2E mẫu khởi tạo `AppModule`, truy cập database và seed, nhưng vẫn kiểm tra `GET /` dù controller mẫu không được đăng ký. Cần sửa e2e và chỉ chạy với database thử nghiệm.

## Docker và triển khai

Từ `minepanel/`, dùng `docker compose up -d --build backend`. Service `backend` build từ `./api`, chạy cổng nội bộ `3001` và công bố cổng `3002`. Dockerfile dùng Node 22 Alpine, cài dependency bằng `npm ci`, build Nest, rồi chạy `node dist/main` trong image cuối. `.dockerignore` loại các tệp môi trường, dependency và bản build cục bộ khỏi build context.

CORS hiện cho phép HTTP localhost/127.0.0.1 và request không có Origin. Chưa có cấu hình CORS bằng biến môi trường, migration production, kiểm tra vai trò hay giới hạn đăng nhập. Các fallback mật khẩu/JWT, seed quản trị cố định và việc trả hash ở `GET /users/:id` cần xử lý trước khi phục vụ người dùng thật. Xem thêm [README Minepanel](../README.md).
