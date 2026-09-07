# Kpanel API

API của Kpanel, xây dựng bằng NestJS 11, TypeScript, TypeORM và PostgreSQL. API lưu trạng thái quản lý tài nguyên, xác thực tài khoản và dữ liệu AI Center. Thư mục này được chuyển từ `Kpanel/backend` sang `kpanel/api` trong repository.

[Tổng quan Kpanel](../README.md) · [Giao diện](../app/README.md).

## Yêu cầu và cấu hình

- Node.js 22.x từ 22.13 hoặc 24.x từ 24.11 và npm; Dockerfile hiện dùng Node.js 22.
- PostgreSQL có sẵn database và tài khoản được phép tạo/sửa bảng; Compose dùng PostgreSQL 16.
- Khóa Gemini chỉ cần nếu muốn bật nhánh gọi Gemini. Không có yêu cầu Redis từ mã API hiện tại.

Từ thư mục gốc repository:

```sh
cd kpanel/api
npm ci
```

Sao chép `.env.example` thành `.env`, thay các giá trị mẫu theo PostgreSQL của bạn. Trên PowerShell:

```powershell
Copy-Item .env.example .env
```

| Biến | Ý nghĩa |
| --- | --- |
| `DB_HOST` | Máy chủ PostgreSQL; mặc định `localhost` |
| `DB_PORT` | Cổng PostgreSQL; mặc định `5432` |
| `DB_USERNAME` | Tài khoản PostgreSQL; mặc định `kpanel` |
| `DB_PASSWORD` | Mật khẩu PostgreSQL; phải khớp tài khoản DB |
| `DB_NAME` | Database PostgreSQL; mặc định `kpanel` |
| `JWT_SECRET` | Khóa ký và xác minh JWT; đặt chuỗi ngẫu nhiên riêng |
| `JWT_EXPIRES_IN` | Thời hạn JWT; mặc định `7d` |
| `PORT` | Cổng HTTP của API; mặc định `3001` |
| `GEMINI_API_KEY` | Tùy chọn; bỏ trống để sử dụng nhánh phản hồi theo luật |

`.env` được đọc từ thư mục làm việc qua `ConfigModule`; chạy lệnh trong `kpanel/api`. Docker Compose truyền biến qua `environment`, không tự đọc `api/.env` vào container. Nếu PostgreSQL chạy bằng Compose còn API chạy trên máy, dùng host `localhost` và thông tin DB khớp `docker-compose.yml`.

## Chạy và build

```sh
npm run start:dev
```

API mặc định ở `http://localhost:3001/api/v1`. NestJS đặt global prefix `api/v1`; đường dẫn repository `kpanel/api` không thay đổi URL này.

```sh
npm run build
npm run start:prod
```

Build tạo `dist/`; `start:prod` chạy `node dist/main`. Lệnh này vẫn dùng cấu hình đồng bộ schema và seed hiện tại, không tự biến ứng dụng thành cấu hình an toàn cho production.

## Dữ liệu khởi tạo

[app.module.ts](src/app.module.ts) bật `synchronize: true`. [SeedService](src/seed.service.ts) chạy khi ứng dụng bootstrap:

- Nếu bảng người dùng rỗng, tạo Administrator với email/mật khẩu demo khai báo trong tệp seed.
- Thêm máy chủ, dự án, cơ sở dữ liệu và nhật ký mẫu; một số bản ghi bị xóa có thể được thêm lại ở lần khởi động sau.
- AI service seed thêm danh mục model, agent, quyền, workspace, template và lịch mẫu khi các bảng tương ứng rỗng.

Chưa có script migration hoặc tùy chọn môi trường để tắt seed/synchronize. Không trỏ bản demo vào cơ sở dữ liệu production.

## Các nhóm API

Tất cả đường dẫn dưới đây có tiền tố `/api/v1`.

| Nhóm | Chức năng | Xác thực trong mã hiện tại |
| --- | --- | --- |
| `POST /auth/login` | Email/mật khẩu → `access_token` và thông tin user | Công khai |
| `GET /auth/profile` | Hồ sơ tài khoản đang đăng nhập | Bearer JWT |
| `/users` | CRUD người dùng | Bearer JWT |
| `/servers` | CRUD và `GET /servers/summary` | Bearer JWT |
| `/projects` | CRUD và `GET /projects/summary` | Bearer JWT |
| `/databases` | CRUD bản ghi database | Bearer JWT |
| `/logs` | Đọc nhật ký, `DELETE /logs` để xóa | Bearer JWT |
| `GET /dashboard/stats` | Tổng hợp tài nguyên và log gần đây | Bearer JWT |
| `/ai` | Hội thoại, tin nhắn, memories, tasks, agents, models, permissions, approvals, tools, workspaces, logs | Chưa có JWT guard |

CRUD máy chủ/dự án/database quản lý bản ghi trong PostgreSQL; chưa thực thi SSH, tạo database engine, backup hay deploy thật. Client có khai báo `/security/*` và `/backup/*`, nhưng API chưa triển khai các controller tương ứng. API chưa có Swagger hoặc health endpoint chuyên dụng.

## AI Center

`GEMINI_API_KEY` bật lời gọi qua `@google/generative-ai`; model gọi trong code hiện là `gemini-1.5-flash`. Danh mục model được seed không điều khiển model sử dụng trong lời gọi này. Việc model có khả dụng còn phụ thuộc tài khoản/dịch vụ bên ngoài.

AI service gửi yêu cầu cùng ngữ cảnh dự án, cơ sở dữ liệu và nhật ký gần đây cho Gemini. Nếu không có khóa hoặc lời gọi lỗi, service dùng nhánh phân tích theo từ khóa. Các log công cụ, lệnh terminal và diff trong phản hồi có phần mô phỏng. Phê duyệt một số hành động có thể tạo/xóa bản ghi thật trong database của panel, nhưng không thực thi lệnh hệ điều hành. Endpoint quét workspace hiện chỉ cập nhật thời điểm đã quét.

## Script và kiểm tra

| Lệnh | Tác dụng |
| --- | --- |
| `npm run start` | Khởi chạy NestJS |
| `npm run start:dev` | Chạy và theo dõi thay đổi |
| `npm run start:debug` | Chạy ở chế độ debug và watch |
| `npm run build` | Biên dịch API |
| `npm run start:prod` | Chạy build trong `dist` |
| `npm test -- --runInBand` | Chạy unit test |
| `npm run test:cov` | Chạy test kèm coverage |
| `npm run test:e2e` | Chạy cấu hình e2e hiện có |
| `npm run lint` | ESLint với `--fix`, có sửa tệp |
| `npm run format` | Prettier, có sửa tệp |

Unit test hiện chỉ kiểm tra `AppController` mẫu. Test e2e đang kỳ vọng `GET /` trả `Hello World!`, trong khi `AppModule` thực tế không đăng ký controller này; test còn khởi tạo DB và seed. Cần sửa test và dùng DB riêng trước khi chạy e2e. Không dùng test mẫu làm bằng chứng rằng các endpoint nghiệp vụ đã được kiểm thử.

## Lưu ý triển khai

API có DB password/JWT secret fallback và tài khoản seed demo. Cần thay chúng, bổ sung migration, xác thực cho AI, phân quyền theo role và giới hạn dữ liệu user trả về trước khi triển khai thật. CORS trong `src/main.ts` chỉ nhận origin HTTP `localhost`/`127.0.0.1` hoặc không có Origin; sửa allowlist nếu sử dụng domain/HTTPS khác. Không commit `.env`, khóa riêng hoặc dữ liệu DB.
