# Kpanel

Kpanel là bảng quản trị máy chủ và dự án toàn diện, gồm Backend Rust (Axum + Tokio + SQLx + PostgreSQL), API NestJS kế thừa và giao diện React hiện đại (Ant Design + Custom UI System). Bản hiện tại có xác thực JWT, quản lý bản ghi máy chủ/dự án/cơ sở dữ liệu/tài khoản, dashboard giám sát, nhật ký, AI Center và terminal WebSocket.

## Cấu trúc

```text
kpanel/
├── backend/              # Rust (Axum, Tokio, SQLx, PostgreSQL) - Backend hiệu năng cao
├── app/                  # React 18, Vite 5, Ant Design, Kiyovn Custom UI System
├── api/                  # NestJS, TypeORM (Legacy API)
└── docker-compose.yml    # PostgreSQL, Redis, Rust Backend và Nginx Frontend
```

`backend/` là backend chính bằng Rust; `app/` là giao diện quản trị React; `api/` là backend NestJS kế thừa.
API sử dụng tiền tố `/api/v1`, giao diện dùng các route từ `/`.

Hướng dẫn chi tiết: [Giao diện](app/README.md) · [NestJS API](api/README.md) · [Repository](../README.md).

## Phạm vi đã có

| Thành phần | Hành vi trong mã nguồn |
| --- | --- |
| Đăng nhập | Xác thực email/mật khẩu bằng bcrypt, cấp JWT, đọc hồ sơ |
| Tài nguyên | CRUD bản ghi máy chủ, dự án, cơ sở dữ liệu và tài khoản trong PostgreSQL |
| Dashboard, nhật ký | Thống kê từ các bản ghi đã lưu; có dữ liệu seed mô phỏng |
| AI Center | Lưu hội thoại, tin nhắn, bộ nhớ, tác vụ và phê duyệt; Gemini tùy chọn, có phản hồi theo luật khi không gọi được Gemini |
| Phê duyệt AI | Một số hành động tạo/xóa dự án hoặc cơ sở dữ liệu cập nhật bản ghi quản lý; không tự tạo database engine hay triển khai ứng dụng trên VPS |
| Terminal, Files, Security, ứng dụng, Minecraft | Giao diện và thao tác mô phỏng ở nhiều phần; chưa có SSH, SFTP, firewall hay Minecraft server agent thực tế |

Redis có trong Compose nhưng API hiện chưa có Redis client hoặc cấu hình sử dụng Redis. Các mục model/agent trong AI Center chứa dữ liệu mẫu; không đồng nghĩa tất cả nhà cung cấp hay công cụ đã được tích hợp.

## Chạy bằng Docker Compose

Yêu cầu Docker có hỗ trợ Linux containers và Docker Compose. Chạy từ thư mục gốc repository:

```sh
cd kpanel
docker compose config --quiet
docker compose up -d --build
docker compose ps
```

| Dịch vụ | Địa chỉ/cổng trên máy chủ |
| --- | --- |
| Giao diện | http://localhost:3006 |
| API trực tiếp | http://localhost:3001/api/v1 |
| PostgreSQL | `localhost:5432` |
| Redis | `localhost:6389` |

Nginx chuyển `/api/` đến service `backend:3001`. Tên service Compose vẫn là `backend` và `frontend`; build context lần lượt là `./api` và `./app`.

Compose hiện có cấu hình và thông tin đăng nhập phục vụ demo ngay trong file. `api/.env` không tự được truyền vào container API. Để bổ sung `GEMINI_API_KEY` hoặc thay thông số container, khai báo qua `environment`/`env_file` trong cấu hình Compose riêng. Không đưa khóa thật vào Git.

Khi khởi động, API tự đồng bộ schema và chạy seed. Bảng người dùng rỗng sẽ có tài khoản Administrator theo [seed.service.ts](api/src/seed.service.ts); tệp này khai báo email và mật khẩu demo. Seed còn thêm các bản ghi tài nguyên và AI mẫu. Dùng cơ sở dữ liệu riêng cho bản demo.

```sh
docker compose logs -f backend frontend
docker compose down
```

`docker compose down` giữ dữ liệu trong named volumes. Các cổng `3001`, `5432` cũng có thể được ứng dụng khác sử dụng; đổi ánh xạ cổng nếu cần chạy nhiều bộ panel cùng lúc.

## Phát triển trên máy

Yêu cầu Node.js 22.x từ 22.13 hoặc 24.x từ 24.11, npm và PostgreSQL; Dockerfile hiện dùng Node.js 22 và PostgreSQL 16. Hai ứng dụng có `package-lock.json` riêng, không dùng npm workspace chung.

1. Làm theo [README API](api/README.md) để cấu hình cơ sở dữ liệu và chạy API ở cổng `3001`.
2. Làm theo [README app](app/README.md), đặt `VITE_API_URL=http://localhost:3001/api/v1` rồi chạy Vite ở cổng `3006`.
3. Truy cập `http://localhost:3006` và đăng nhập bằng tài khoản đã seed hoặc được tạo trong cơ sở dữ liệu.

Vite hiện không có proxy `/api`; thiếu `VITE_API_URL` trong chế độ phát triển sẽ khiến request API đi vào Vite thay vì NestJS.

## Kiểm tra

```sh
cd api
npm ci
npm run build
npm test -- --runInBand
cd ../app
npm ci
npm run build
```

Unit test API hiện chỉ kiểm tra controller mẫu. App chưa khai báo script lint/test; Vite build không thay thế kiểm tra kiểu TypeScript. Test e2e API còn là mẫu NestJS và cần được cập nhật trước khi dùng làm kiểm tra toàn hệ thống.

## Giới hạn trước khi triển khai thật

Các điểm sau được ghi nhận trực tiếp từ mã nguồn hiện tại:

- TypeORM đang bật `synchronize: true`, seed tự chạy khi khởi động, chưa có quy trình migration production.
- Có mật khẩu/JWT secret mặc định dành cho demo. Phải thay cấu hình và tài khoản seed trước khi dùng dữ liệu thật.
- Nhóm `/api/v1/ai` chưa gắn JWT guard; các nhóm CRUD khác có JWT guard nhưng chưa có kiểm tra quyền theo role.
- `GET /users/:id` trả về entity người dùng, bao gồm trường hash mật khẩu; cần xử lý trước khi mở API cho người dùng thực.
- CORS chỉ cho phép origin HTTP trên `localhost`/`127.0.0.1` và request không có Origin. Domain triển khai hoặc HTTPS cần cấu hình phù hợp trong API/proxy.
- Chat Gemini có thể gửi nội dung yêu cầu, danh sách dự án/cơ sở dữ liệu và nhật ký gần đây đến nhà cung cấp; chỉ cấu hình khóa khi chấp nhận luồng dữ liệu này.

Đường dẫn workspace cũ trong AI Center và một số dữ liệu Files là metadata/demo; chúng không tạo liên kết tới thư mục trên máy chạy.
