# MaiPanel

Kho mã nguồn chung cho website dịch vụ cloud, Kpanel và Minepanel. Ba ứng dụng được đặt trong cùng repository để quản lý mã nguồn; hiện chưa có luồng đăng nhập, thanh toán hay cấp phát dịch vụ chung giữa chúng.

## Cấu trúc repository

```text
maipanel/
├── web/                  # Website dịch vụ cloud và dashboard demo
├── kpanel/
│   ├── api/              # API NestJS của Kpanel
│   ├── app/              # Giao diện React của Kpanel
│   └── docker-compose.yml
└── minepanel/
    ├── api/              # API NestJS của Minepanel
    ├── app/              # Giao diện React của Minepanel
    └── docker-compose.yml
```

| Nguồn ban đầu | Vị trí trong repo |
| --- | --- |
| `E:\htdocs\webgioithieudichvucloud` | `web/` |
| `D:\DATA\source\Kpanel\backend` | `kpanel/api/` |
| `D:\DATA\source\Kpanel\frontend` | `kpanel/app/` |
| `D:\DATA\source\Minepanel\backend` | `minepanel/api/` |
| `D:\DATA\source\Minepanel\frontend` | `minepanel/app/` |

Các file cấu hình và tài liệu cấp dự án của Kpanel/Minepanel được giữ trong thư mục tương ứng. Tên `web/`, `kpanel/`, `minepanel/`, `api/`, `app/` ở đây là đường dẫn mã nguồn, không tự cấu hình URL triển khai. Mỗi ứng dụng hiện chạy ở gốc của một origin riêng.

## Ứng dụng và tài liệu

| Thành phần | Trạng thái thực tế | Hướng dẫn |
| --- | --- | --- |
| Web | React 18 + Vite 6; website, giỏ hàng, dashboard khách hàng và quản trị dùng dữ liệu mẫu/localStorage | [Web README](web/README.md) |
| Kpanel | React 18 + Vite 5, NestJS 11 + PostgreSQL; API quản lý dữ liệu, xác thực JWT, AI tùy chọn; nhiều thao tác hạ tầng là mô phỏng | [Kpanel](kpanel/README.md) · [API](kpanel/api/README.md) · [App](kpanel/app/README.md) |
| Minepanel | React 18 + Vite 5, NestJS 11 + PostgreSQL; API auth/users/logs/dashboard; quản lý Minecraft trên UI là mô phỏng | [Minepanel](minepanel/README.md) · [API](minepanel/api/README.md) · [App](minepanel/app/README.md) |

README mô tả hành vi đang có trong source. Các tài liệu ý tưởng/kế hoạch cũ trong `kpanel/.md/`, `PROJECT.md`, `implementation_plan.md` và `ui_design_guidelines.md` là tài liệu tham khảo, có thể chứa đường dẫn cũ hoặc tính năng dự kiến.

## Bắt đầu

Yêu cầu dùng chung: Node.js **22.13+ thuộc nhánh 22.x**, hoặc **24.11+**, cùng npm. Mỗi thư mục `web`, `kpanel/api`, `kpanel/app`, `minepanel/api`, `minepanel/app` có `package.json` và lockfile riêng; không chạy `npm install` ở gốc repo.

```sh
git clone https://github.com/ngdaison/maipanel.git
cd maipanel
```

Chạy website:

```sh
cd web
npm ci
npm run dev
```

Mở `http://localhost:3000`. Web không yêu cầu API hoặc PostgreSQL.

Chạy một panel bằng Docker Compose, từ gốc repo, sau khi khởi động Docker Engine/Docker Desktop với Linux containers:

```sh
docker compose -f kpanel/docker-compose.yml up --build -d
# Hoặc:
docker compose -f minepanel/docker-compose.yml up --build -d
```

Compose dùng cấu hình development và tự tạo dữ liệu mẫu khi API khởi động với database trống. Xem README riêng trước khi chạy trên máy có dữ liệu cần giữ. Hai bộ Compose dùng cổng và tên container riêng, có thể chạy cùng lúc.

| Thành phần | Kpanel | Minepanel |
| --- | --- | --- |
| App qua Docker | `http://localhost:3006` | `http://localhost:3008` |
| API qua Docker | `http://localhost:3001/api/v1` | `http://localhost:3002/api/v1` |
| PostgreSQL trên máy host | `localhost:5432` | `localhost:5433` |
| Redis trên máy host | `localhost:6389` | `localhost:6390` |
| App Vite khi chạy trực tiếp | `http://localhost:3006` | `http://localhost:5008` |
| API chạy trực tiếp, mặc định | `http://localhost:3001/api/v1` | `http://localhost:3001/api/v1` |

Redis có trong Compose nhưng chưa được các API sử dụng. Khi chạy hai API trực tiếp cùng lúc, đổi `PORT` của một API và `VITE_API_URL` tương ứng. Không chạy app Vite và app Docker của Kpanel cùng cổng 3006.

Hướng dẫn cấu hình `.env`, kết nối Vite tới API và lệnh kiểm tra nằm trong README riêng của từng thành phần. Các file `.env.example` được cung cấp; `.env` thực tế, `node_modules/`, `dist/`, coverage và file làm việc của agent không được đưa vào Git.

## Phạm vi hiện tại

- Web chưa gọi API Kpanel/Minepanel; đăng nhập, thanh toán, API key, terminal và các thao tác cloud là demo trong trình duyệt.
- Kpanel lưu dữ liệu quản lý trong PostgreSQL, nhưng các màn hình/thao tác server, deploy, file, terminal, database và game chưa đồng nghĩa với quản trị hạ tầng thật. AI có thể gọi Gemini nếu được cấu hình khóa hợp lệ.
- Minepanel chưa có API điều khiển Minecraft, RCON hay tiến trình game; trạng thái điều khiển trong giao diện chủ yếu lưu trong React state.
- Hai panel còn cấu hình development: tài khoản seed cố định, thông tin đăng nhập mặc định trong source/Compose và TypeORM `synchronize: true`; riêng Minepanel có cơ chế đăng nhập mock phía app. README riêng liệt kê các giới hạn xác thực/phân quyền liên quan. Cần hoàn thiện trước khi dùng với dữ liệu thật hoặc mở truy cập công khai.

Các giá trị thương hiệu, liên hệ, người dùng, địa chỉ máy chủ và thanh toán đang được viết trực tiếp trong source demo; cần rà soát/thay bằng dữ liệu phù hợp khi triển khai.

## Kết quả kiểm tra khi nhập mã nguồn

Ngày 07/09/2026, trên Windows với Node.js 24.11.1 và npm 11.6.2:

| Kiểm tra | Kết quả |
| --- | --- |
| `npm ci` và `npm run build` trong cả 5 package | Thành công; Minepanel app bỏ tải trình duyệt bằng `PUPPETEER_SKIP_DOWNLOAD=true` |
| Unit test Kpanel API và Minepanel API | Mỗi API đạt 1 test mẫu; chưa bao phủ nghiệp vụ |
| `docker compose config --quiet` cho cả hai panel | Hợp lệ |
| `npx tsc --noEmit` cho hai panel app | Còn lỗi có sẵn về export/props trong `custom-ui` và các nơi sử dụng |
| Khởi chạy toàn stack Docker và e2e nghiệp vụ | Chưa kiểm chứng; Docker daemon chưa hoạt động, e2e hiện còn là test mẫu không khớp ứng dụng |

Khi nhập repo, đường dẫn build Compose đã đổi sang `api/app`; Dockerfile dùng Node 22, API cài theo lockfile bằng `npm ci`, và Docker build loại cấu hình môi trường cục bộ. Lockfile Minepanel API đã được sửa các mục dependency bắc cầu bị lệch để cài mới được. Mã chức năng được giữ từ nguồn gốc; các giới hạn hiện có được ghi lại trong README riêng.
