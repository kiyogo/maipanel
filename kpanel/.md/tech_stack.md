# Kpanel - Công nghệ đề xuất chi tiết

## 🎨 Giao diện người dùng (Frontend)

- **React + TypeScript**: Cung cấp môi trường phát triển hiện đại, mạnh mẽ với khả năng kiểm tra kiểu dữ liệu ở thời gian biên dịch, giảm lỗi runtime. Sử dụng **Vite** để tăng tốc quá trình hot‑module‑replacement (HMR) và build nhanh hơn so với Webpack truyền thống.
- **Ant Design**: Bộ component UI chuyên nghiệp, hỗ trợ dark mode, quốc tế hoá (i18n), và có sẵn các biểu đồ, bảng, modal, form. Giúp UI trông nhất quán và giảm thời gian phát triển.
- **Tailwind CSS (tùy chọn)**: Nếu muốn tùy biến style nhanh, Tailwind cho phép viết class utility trực tiếp trong JSX, giảm lượng CSS thừa.
- **xterm.js**: Terminal web dựa trên WebSocket, cho phép người dùng điều khiển máy chủ qua giao diện mà không cần mở terminal riêng.
- **Chart.js / ECharts**: Dùng để hiển thị biểu đồ thời gian thực (CPU, RAM, network) trong Dashboard.

### Lý do chọn:
- **Hiệu năng**: React + Vite có thời gian khởi động < 200ms cho dự án vừa và lớn.
- **Độ linh hoạt**: Dễ tích hợp WebSocket, GraphQL, REST API.
- **Độ phổ biến**: Cộng đồng rộng, tài liệu phong phú, dễ tuyển dụng.

## ⚙️ Máy chủ (Backend)

- **Node.js (v20) + NestJS**: Kiến trúc modular, hỗ trợ Dependency Injection, WebSocket, GraphQL, và dễ mở rộng thành micro‑service. NestJS còn cung cấp bộ công cụ CLI để tạo module, controller, service nhanh chóng.
- **Fastify** (đối với các service cần tốc độ cực nhanh, ví dụ: Service thu thập metric): Fastify nhẹ, hỗ trợ schema validation và plugin system.
- **Docker + Docker‑Compose**: Mọi service được container hoá, giúp việc triển khai trên Ubuntu (hoặc Kubernetes) trở nên nhất quán.
- **Koa** (nếu muốn một framework nhẹ hơn, tuy nhiên NestJS đã cung cấp hầu hết tính năng).

## 💾 Cơ sở dữ liệu (Database)

- **PostgreSQL**: Hệ quản trị quan hệ mạnh mẽ, hỗ trợ JSONB cho lưu trữ cấu hình linh hoạt, ACID đảm bảo tính nhất quán dữ liệu.
- **Redis**: Dùng làm cache, session store và pub/sub cho realtime notification (ví dụ: cảnh báo CPU quá tải).
- **MongoDB (tùy chọn)**: Lưu trữ cấu hình plugin, metadata phi‑quan hệ, dễ mở rộng.

## 📊 Giám sát & Log

- **Prometheus + Grafana**: Thu thập metric (CPU, RAM, Disk, Network) từ các exporter (node_exporter, cAdvisor). Grafana hiển thị dashboard thời gian thực, cho phép thiết lập alert.
- **ELK Stack (Elasticsearch, Logstash, Kibana)**: Thu thập, lưu trữ, tìm kiếm log từ Nginx, MySQL, ứng dụng. Kibana cung cấp UI tìm kiếm và visualisation, hỗ trợ phân tích log theo thời gian và mức độ.

## 🔐 Bảo mật (Security)

- **NGINX** làm reverse‑proxy, terminating SSL với **Let’s Encrypt** tự động renew.
- **OpenVPN / WireGuard**: Kết nối VPN an toàn tới các VPS, cho phép truy cập nội bộ mà không mở các port công khai.
- **OAuth2 + JWT**: Xác thực API, cung cấp token ngắn hạn, hỗ trợ 2FA (Google Authenticator, SMS).
- **Trivy**: Quét lỗ hổng security cho container images trong CI/CD pipeline.
- **Fail2Ban**: Bảo vệ SSH khỏi brute‑force.

## 📦 Quản lý máy chủ & Dịch vụ

- **Ansible**: Tự động cấu hình, cài đặt phần mềm, triển khai các playbook cho hàng chục VPS.
- **Terraform (tùy chọn)**: Quản lý hạ tầng dưới dạng code, đặc biệt khi triển khai trên cloud (AWS, GCP, Azure).
- **Systemd**: Quản lý service trên mỗi server, cho phép start/stop/restart nhanh.
- **Kubernetes (sẵn sàng mở rộng)**: Khi cần mở rộng quy mô, các container có thể được chuyển sang cluster Kubernetes; Helm chart sẽ được cung cấp.

## 🗂️ Quản lý tệp

- **WebDAV** + **React‑File‑Manager**: Giao diện duyệt, upload, download, chia sẻ file qua link tạm thời. Hỗ trợ preview ảnh, video, văn bản.
- **MinIO (tùy chọn)**: Object storage S3‑compatible cho lưu trữ lớn, backup.

## 🛠️ Các dịch vụ phụ trợ

- **RabbitMQ** hoặc **NATS**: Hệ thống message queue cho các tác vụ bất đồng bộ như backup, deploy, gửi email cảnh báo.
- **GitLab CI/CD** (hoặc **GitHub Actions**) – pipeline tự động build Docker image, chạy test, push lên registry, và triển khai.
- **Sentry** – giám sát lỗi runtime của backend và frontend, báo cáo chi tiết stack trace.

## 🚀 Triển khai trên Ubuntu

1. **Cài Docker Engine & Docker‑Compose**
   ```bash
   sudo apt‑update && sudo apt‑install -y docker.io docker-compose
   sudo systemctl enable --now docker
   ```
2. **Clone repo** và chạy `docker-compose up -d` để khởi động toàn bộ stack (frontend, backend, DB, Redis, Prometheus, Grafana, ELK).
3. **Cấu hình firewall** chỉ mở cổng 80/443 (HTTPS) và 22 (SSH). Dùng `ufw allow 80,443/tcp && ufw allow 22/tcp && ufw enable`.
4. **Cài Let’s Encrypt**:
   ```bash
   sudo snap install core; sudo snap refresh core
   sudo snap install --classic certbot
   sudo certbot --nginx -d your-domain.com
   ```
5. **Tạo user admin** qua API `/auth/register` với quyền `Administrator`.

## 📄 Tài liệu cấu trúc dự án (đã có trong `project_structure.md`)
- Tổng quan các module, mối quan hệ, flow dữ liệu.
- Các file cấu hình: `docker-compose.yml`, `nginx.conf`, `prometheus.yml`, `grafana.ini`.

## 📦 Các file cấu hình mẫu (được tạo tự động)
- `docker-compose.yml` – định nghĩa 12 service: frontend, api‑gateway, auth‑service, project‑service, monitor‑service, log‑service, file‑service, redis, postgres, prometheus, grafana, elk.
- `ansible/` – playbook cài đặt Docker, thiết lập firewall, tạo user.
- `helm/` – chart cho triển khai trên Kubernetes (sẵn sàng mở rộng).

## 🔄 Khả năng mở rộng & Độ tin cậy
- **Horizontal scaling**: Thêm replica cho các service backend bằng Docker Swarm hoặc Kubernetes.
- **Backup**: PostgreSQL + WAL shipping, Redis + RDB snapshots, MinIO cho backup object.
- **High‑availability**: Deploy Nginx với keepalived, PostgreSQL với Patroni, Redis với Sentinel.

## 💰 Chi phí dự kiến
| Thành phần | Chi phí (USD/tháng) | Ghi chú |
|------------|--------------------|--------|
| VPS (2 CPU, 4 GB RAM) | ~15 | Dùng cho môi trường dev.
| PostgreSQL RDS (tùy chọn) | ~30 | Nếu cần HA.
| Let’s Encrypt | Miễn phí |
| Docker Hub (private repo) | Miễn phí (up to 500 MB) |
| Monitoring (Grafana Cloud) | Miễn phí (up to 5 k series) |
| Backup storage (S3) | ~5 | Tùy vào dung lượng.

## 📚 Tài liệu tham khảo
- React + TypeScript – https://reactjs.org/
- NestJS – https://nestjs.com/
- Prometheus – https://prometheus.io/
- Grafana – https://grafana.com/
- ELK – https://www.elastic.co/what-is/elk-stack
- Ansible – https://www.ansible.com/
- Terraform – https://www.terraform.io/

---
**Kết luận**: Stack trên cung cấp sự cân bằng tối ưu giữa **hiệu năng**, **độ linh hoạt**, **khả năng mở rộng** và **chi phí**. Bạn có thể bắt đầu bằng Docker‑Compose trên một máy Ubuntu, sau đó dễ dàng nâng cấp lên Kubernetes khi dự án tăng trưởng.
