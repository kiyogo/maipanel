# Minepanel

Minepanel là giao diện quản trị máy chủ Minecraft kèm API tài khoản, người dùng, nhật ký và thống kê. Mã nguồn hiện tại phục vụ phát triển và trình diễn: các thao tác Minecraft trong giao diện sử dụng dữ liệu mẫu và trạng thái React; chưa có dịch vụ điều khiển máy chủ Minecraft, RCON, hệ thống tệp hoặc sao lưu thực tế.

## Cấu trúc

```text
minepanel/
├── api/                 # NestJS, PostgreSQL, JWT (trước đây: backend)
├── app/                 # React, TypeScript, Vite (trước đây: frontend)
└── docker-compose.yml   # PostgreSQL, Redis, API và Nginx
```

Đọc hướng dẫn chi tiết tại [API](api/README.md) và [ứng dụng web](app/README.md). Tên service Docker vẫn là `backend` và `frontend`; đường dẫn build tương ứng là `./api` và `./app`.

`minepanel/` là đường dẫn trong repository. Ứng dụng hiện chạy tại gốc một origin (`/login`, `/overview`...), chưa cấu hình để phục vụ dưới URL `/minepanel/`. API dùng tiền tố `/api/v1`.

## Chức năng hiện có

| Thành phần | Trạng thái trong mã nguồn |
| --- | --- |
| Đăng nhập, hồ sơ | API xác thực bằng mật khẩu bcrypt và JWT |
| Người dùng | API tạo, xem, cập nhật thông tin/vai trò/trạng thái và xóa |
| Nhật ký, thống kê | API đọc/xóa nhật ký, đếm tài khoản và trả nhật ký gần nhất |
| Tổng quan Minecraft | Giao diện với số liệu và trạng thái mô phỏng |
| Phần mềm, console, cấu hình, người chơi | Giao diện thao tác dữ liệu mẫu trong trình duyệt |
| Plugin, sao lưu, quản lý tệp | Giao diện mô phỏng; chưa nối API vận hành thực tế |
| Redis | Có service trong Compose, chưa được API sử dụng |

Các bản ghi Minecraft/RCON được seed vào PostgreSQL là dữ liệu mẫu, không chứng minh đã kết nối máy chủ trò chơi. Không cần cài Java hoặc Minecraft để xem giao diện hiện tại.

## Chạy phát triển

Yêu cầu Node.js **22.x từ 22.13** hoặc **24.x từ 24.11**, npm và PostgreSQL. Các mốc Node dựa trên `engines` của dependency trong lockfile: API có TypeORM 1.0.0, ứng dụng có Puppeteer 25.4.0. Docker Compose là lựa chọn để chạy PostgreSQL và các service đóng gói.

Từ thư mục gốc repository:

```powershell
cd minepanel
docker compose up -d postgres
cd api
Copy-Item .env.example .env
```

Sửa `api/.env`: khi dùng PostgreSQL của Compose trên máy chủ, đặt `DB_HOST=localhost`, `DB_PORT=5433`, tên database và tài khoản trùng với Compose. Điền `DB_PASSWORD`, `JWT_SECRET` và đặt `PORT=3001`. Sau đó:

```powershell
npm ci
npm run start:dev
```

Mở terminal khác tại gốc repository:

```powershell
cd minepanel/app
'VITE_API_URL=http://localhost:3001/api/v1' | Set-Content .env.local
$env:PUPPETEER_SKIP_DOWNLOAD = 'true'
npm ci
npm run dev
```

Mở [http://localhost:5008](http://localhost:5008). Vite dùng `strictPort: true`, nên phải giải phóng cổng nếu đã có ứng dụng khác sử dụng. Vite chưa có proxy API; cần `VITE_API_URL` như trên. Biến `PUPPETEER_SKIP_DOWNLOAD` chỉ bỏ bước tải trình duyệt khi cài dependency; giao diện hiện không sử dụng Puppeteer.

Khi bảng người dùng rỗng, API tự tạo một tài khoản quản trị mẫu. Thông tin mẫu được ghi trực tiếp trong `api/src/seed.service.ts` và phần fallback tại `app/src/context/AuthContext.tsx`; đây là tài khoản dành cho thử nghiệm. Frontend có thể tạo phiên giả khi lời gọi đăng nhập thất bại và thông tin nhập trùng mẫu, kể cả trong bản build. Muốn kiểm tra kết nối thật, xác nhận `POST /api/v1/auth/login` trả thành công và `GET /api/v1/auth/profile` chấp nhận JWT vừa nhận.

## Chạy bằng Docker Compose

```powershell
cd minepanel
docker compose config --quiet
docker compose up -d --build
docker compose ps
docker compose logs --tail=100 backend frontend
```

| Dịch vụ | Cổng trên máy chủ | Cổng trong container |
| --- | --- | --- |
| Giao diện Nginx | `3008` | `80` |
| API | `3002` | `3001` |
| PostgreSQL 16 | `5433` | `5432` |
| Redis 7 | `6390` | `6379` |

Giao diện tại [http://localhost:3008](http://localhost:3008); Nginx chuyển `/api/` đến `backend:3001`. API trực tiếp tại `http://localhost:3002/api/v1`. PostgreSQL và Redis lưu dữ liệu trong named volume; `docker compose down` dừng và gỡ container nhưng giữ volume.

Dockerfile dùng Node 22 Alpine và cài dependency bằng `npm ci`. Ứng dụng đặt `PUPPETEER_SKIP_DOWNLOAD=true` trong bước build vì không sử dụng trình duyệt Puppeteer. Các tệp môi trường cục bộ được loại khỏi Docker build context; chỉ giữ mẫu `.env.example`. Cấu hình Compose đã được kiểm tra cú pháp; việc khởi chạy toàn bộ stack cần Docker daemon hoạt động và chưa được xác nhận ở lần nhập mã nguồn này.

`api/.env` được Nest đọc khi chạy tại thư mục API. Compose hiện khai báo biến trong `environment` và không có `env_file`, nên sửa `api/.env` không thay đổi cấu hình container.

## Kiểm tra mã nguồn

```powershell
cd minepanel/api
npm ci
npm run build
npm test -- --runInBand
cd ../app
$env:PUPPETEER_SKIP_DOWNLOAD = 'true'
npm ci
npm run build
npx tsc --noEmit
```

API hiện chỉ có unit test mẫu cho `AppController`. E2E mẫu mong đợi `GET /` trả `Hello World!`, trong khi controller đó không được đăng ký trong `AppModule`; cần cập nhật test trước khi dùng làm tiêu chí nghiệm thu. Build Vite không chạy kiểm tra kiểu TypeScript; lệnh `tsc` là kiểm tra riêng. Ứng dụng chưa có script test hoặc lint.

Kiểm tra TypeScript riêng hiện còn thất bại do lỗi có sẵn trong `custom-ui` và các nơi sử dụng; xem [README app](app/README.md). Không dùng lệnh này như một bước đã đạt trong CI.

## Giới hạn trước khi triển khai thật

- Cấu hình có mật khẩu database/JWT mặc định trong mã nguồn và Compose; cần thay bằng giá trị riêng. Không commit `.env`, khóa API, dữ liệu database hoặc thư mục dependency/build.
- API bật `synchronize: true` và tự seed dữ liệu khi bảng trống; chưa có hệ thống migration hoặc chế độ tắt seed bằng biến môi trường.
- Các endpoint người dùng/nhật ký mới kiểm tra JWT, chưa áp quyền theo vai trò. `GET /users/:id` hiện trả cả trường hash mật khẩu.
- Cần bỏ hoặc giới hạn fallback đăng nhập giả trước khi phát hành. Token đang lưu trong `localStorage`.
- CORS chỉ cho phép origin HTTP `localhost`/`127.0.0.1` và request không có Origin; cấu hình origin/HTTPS cho môi trường triển khai phải được bổ sung.
- Cần bổ sung backend Minecraft thực tế trước khi dùng giao diện để quản lý server, plugin, tệp hoặc bản sao lưu.
