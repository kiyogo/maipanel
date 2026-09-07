# Implementation Plan – Kpanel Web Management System

## Goal
Xây dựng một ứng dụng web quản lý (giống Aapanel) cho phép người dùng **điều khiển, giám sát và quản lý** nhiều VPS/Server, dự án, cơ sở dữ liệu, nhật ký, tài khoản, ứng dụng, v.v. Ứng dụng sẽ chạy trên Ubuntu, sử dụng Docker‑Compose để dễ triển khai và có khả năng mở rộng sang Kubernetes.

## User Review Required
> [!IMPORTANT]
> Vui lòng xem lại các quyết định sau và trả lời để chúng tôi tiếp tục:
> 1. **Màu accent** – đã chuyển sang **xanh ngọc `#009688`**. Nếu muốn đổi lại, cung cấp mã HEX.
> 2. **Frontend framework** – React + Vite + Ant Design. Bạn có muốn thay đổi (Vue, Svelte, …) không?
> 3. **Backend framework** – NestJS (Node). Nếu muốn sử dụng Go, Django hoặc .NET, hãy cho biết.
> 4. **Triển khai ban đầu** – Docker‑Compose trên một máy Ubuntu. Bạn có muốn chuẩn bị sẵn file Terraform/Ansible để mở rộng không?
> 5. **Cấu hình môi trường** – `.env.example` đã được chuẩn bị, nếu cần thêm biến môi trường, vui lòng chỉ ra.

## Open Questions
- Không có câu hỏi mở nào khác tại thời điểm này.

## Proposed Changes
---
### 1️⃣ Frontend
- **Scaffold**: `npm create vite@latest frontend --template react-ts` (Docker‑file sẽ build). 
- **Dependencies**: `antd`, `@ant-design/icons`, `inter-ui`, `react-router-dom`, `axios`, `zustand` (state mgmt), `xterm.js` (terminal). 
- **Folder structure**:
```
frontend/
 ├─ public/
 ├─ src/
 │   ├─ assets/
 │   ├─ components/
 │   │   ├─ Button/
 │   │   │   ├─ Button.tsx
 │   │   │   └─ Button.module.css
 │   │   ├─ Input/
 │   │   ├─ Card/
 │   │   ├─ Sidebar/
 │   │   ├─ Header/
 │   │   ├─ Dashboard/
 │   │   └─ Terminal/
 │   ├─ pages/
 │   │   ├─ Login.tsx
 │   │   ├─ Dashboard.tsx
 │   │   ├─ Servers.tsx
 │   │   ├─ Projects.tsx
 │   │   └─ Settings.tsx
 │   ├─ routes/
 │   ├─ services/
 │   │   └─ api.ts (axios instance, JWT interceptor)
 │   ├─ App.tsx
 │   └─ main.tsx
```
- **UI Guidelines**: Áp dụng `ui_design_guidelines.md` (font Inter, palette, border‑radius 5‑12px, transition 0.15s). 
- **Key components**: Button, Input, Card, Table, Sidebar, Header, Dashboard widgets, Server list, Project list, Log viewer, Terminal (xterm.js).

### 2️⃣ Backend
- **Scaffold**: `npx -y @nestjs/cli new backend --language ts` (non‑interactive). 
- **Dependencies**: `@nestjs/jwt`, `@nestjs/passport`, `passport-jwt`, `@nestjs/websockets`, `socket.io`, `class-validator`, `class-transformer`, `@nestjs/config`, `@nestjs/typeorm`, `typeorm`, `pg`, `redis`, `ioredis`, `bcrypt`, `otplib` (2FA), `helmet`, `cors`, `rate-limiter-flexible`.
- **Folder structure**:
```
backend/src/
 ├─ auth/ (Login, Register, JWT Guard, 2FA)
 ├─ user/ (RBAC, profile)
 ├─ server/ (CRUD VPS, SSH wrapper, systemctl commands)
 ├─ project/ (Git repo, Docker Compose per project, CI pipeline stub)
 ├─ monitor/ (Prometheus exporter wrapper, health checks)
 ├─ log/ (ELK ingestion service)
 ├─ file/ (WebDAV wrapper, upload/download)
 ├─ terminal/ (WebSocket bridge to xterm.js)
 ├─ app.module.ts
 └─ main.ts
```
- **Database schema** (PostgreSQL): tables `users`, `roles`, `servers`, `projects`, `logs`, `files`, `api_keys`. 
- **Cache**: Redis cho session, JWT blacklist, rate‑limit counters.
- **Security**: Helmet, CORS whitelist, rate‑limiting, JWT + refresh token, 2FA, password hashing bcrypt, password policy.

### 3️⃣ Containerization & Orchestration
- **docker-compose.yml** (định nghĩa 12 service):
  - `frontend` (node:20‑alpine) – build Vite output, serve via Nginx.
  - `nginx` – reverse‑proxy, SSL termination (Let’s Encrypt certs volume).
  - `backend` (node:20‑alpine) – NestJS API.
  - `postgres` – official postgres:15 image, persistent volume.
  - `redis` – official redis:7 image.
  - `prometheus` – prometheus/prometheus, config `prometheus.yml`.
  - `grafana` – grafana/grafana, datasource prometheus.
  - `elasticsearch` – docker.elastic.co/elasticsearch/elasticsearch:8.10.
  - `logstash` – docker.elastic.co/logstash/logstash:8.10.
  - `kibana` – docker.elastic.co/kibana/kibana:8.10.
  - `node_exporter` – prom/node-exporter.
  - `cAdvisor` – gcr.io/google-containers/cadvisor.
- **Dockerfile.frontend**: multi‑stage – build Vite, copy `dist` to nginx.
- **Dockerfile.backend**: copy source, run `npm run build`.
- **Volumes**: `postgres_data`, `redis_data`, `elasticsearch_data`, `certs` (Let's Encrypt), `nginx_conf`.

### 4️⃣ Nginx & SSL
- **nginx/conf.d/default.conf** (reverse‑proxy `/api` → backend, `/` → frontend, static assets). 
- **Certbot**: script `entrypoint.sh` chạy `certbot certonly --nginx -d $DOMAIN --non-interactive --agree-tos -m $EMAIL`; cron job `0 0 * * * certbot renew --quiet`.

### 5️⃣ Giám sát & Log
- **Prometheus**: scrape `node_exporter`, `cAdvisor`, `backend` (`/metrics` endpoint via `@nestjs/terminus`). 
- **Grafana**: dashboard JSON import (CPU/Memory per server, container stats, API latency). 
- **ELK**: `filebeat` on each container forward logs to Logstash → Elasticsearch; Kibana dashboards cho Nginx, NestJS, PostgreSQL.

### 6️⃣ Bảo mật nâng cao
- **Rate‑limiting**: `rate-limiter-flexible` (IP‑based, 100 req/min). 
- **Content‑Security‑Policy** và **Strict‑Transport‑Security** via Helmet. 
- **Fail2Ban** cấu hình để bảo vệ SSH. 
- **OpenVPN / WireGuard** Docker container (optional) để truy cập nội bộ các VPS. 
- **Trivy** CI step: `trivy image --severity HIGH,CRITICAL $IMAGE`. 
- **Audit log**: mọi hành động admin ghi vào bảng `audit_logs` và gửi tới ELK.

### 7️⃣ Cấu hình môi trường
- `.env.example` (đặt trong root):
```
# General
DOMAIN=example.com
EMAIL=admin@example.com

# PostgreSQL
POSTGRES_USER=admin
POSTGRES_PASSWORD=StrongPass123!
POSTGRES_DB=kpanel

# Redis
REDIS_PASSWORD=StrongPass123!

# JWT
JWT_ACCESS_SECRET=yourAccessSecret
JWT_REFRESH_SECRET=yourRefreshSecret

# OpenVPN / WireGuard (optional)
VPN_NETWORK=10.8.0.0/24
```
- Docker‑compose sẽ tự load `.env`.
- Secrets có thể lưu trong Docker Swarm/Kubernetes secret khi chuyển sang production.

### 8️⃣ Backup & Recovery
- **PostgreSQL**: `pg_dumpall -U $POSTGRES_USER > /backups/pg_dump_$(date +%F).sql` (cron nightly). 
- **Redis**: `redis-cli --rdb /backups/redis_$(date +%F).rdb`. 
- **Elasticsearch**: snapshot repository `s3` hoặc `fs` (daily). 
- **Docker volumes**: backup tar of volume directories.
- Script `backup.sh` sẽ thực hiện toàn bộ, lưu trong `docker/backup.sh` và chạy qua cron.

### 9️⃣ RBAC (Role‑Based Access Control)
- **Roles**: `Administrator`, `Operator`, `Viewer`.
- **Permissions**: CRUD server, CRUD project, view logs, manage users, access terminal.
- **Implementation**: `roles` table + many‑to‑many `user_roles`. Middleware `RolesGuard` trong NestJS.
- **Frontend**: UI sẽ ẩn/hiển thị menu dựa trên role (context provider).

### 🔟 Documentation
- **README.md**: hướng dẫn cài đặt Docker, cấu hình `.env`, chạy `docker-compose up -d`, truy cập UI, tạo admin user.
- **API Reference**: OpenAPI 3.0 spec generated bằng `@nestjs/swagger`; file `openapi.yaml` sẽ được commit.
- **Developer guide**: cách đóng góp, run tests, hot‑reload front‑end (`npm run dev`).
- **Operations guide**: backup/restore, scaling, monitoring.

### 📂 Setup Script (auto)
File `setup.sh` (bash) sẽ thực hiện:
```bash
#!/usr/bin/env bash
set -e
# 1. Kiểm tra Docker, Docker‑Compose
if ! command -v docker &>/dev/null; then echo "Docker not installed"; exit 1; fi
if ! command -v docker-compose &>/dev/null; then echo "docker‑compose not installed"; exit 1; fi
# 2. Copy .env.example → .env (prompt for values)
cp .env.example .env
# 3. Build & start stack
docker-compose pull
docker-compose up -d --build
# 4. Wait for services
echo "Waiting for services to become healthy..."
sleep 15
# 5. Create initial admin user via API
echo "Creating admin user..."
curl -X POST http://localhost/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"username":"admin","email":"admin@example.com","password":"StrongPass123!","role":"Administrator"}'
# 6. Print access info
echo "Setup complete. Access UI at http://$DOMAIN (or http://localhost)"
```
Script sẽ được đặt ở root và có flag `chmod +x setup.sh`.

## Verification Plan
### Automated Tests
- **Backend**: Jest + SuperTest cho mỗi controller, mock DB (typeorm‑testing). Coverage ≥ 80%.
- **Frontend**: React Testing Library cho component, Jest for utils, Cypress (E2E) cho login → dashboard → server actions.
### Manual Testing
1. `docker-compose up -d` → truy cập `http://localhost` → login, tạo server, xem dashboard.
2. Kiểm tra API bằng Postman (CRUD server, project, logs).
3. Kiểm tra Grafana dashboards, Kibana search.
4. Kiểm tra terminal WebSocket (xterm.js) kết nối tới một VPS mẫu.
5. Test 2FA flow (OTP email placeholder).
### Performance
- Load test (`k6` script) 100 concurrent users, đáp ứng < 200 ms cho API.
### Security
- Chạy `trivy` trên toàn bộ images, báo cáo.
- Kiểm tra OWASP ZAP cho XSS/CSRF.
- Kiểm tra rate‑limit hoạt động.

---
## Checklist
- [ ] Thiết lập repo và Docker‑Compose.
- [ ] Scaffold frontend (React + Vite + Ant Design).
- [ ] Scaffold backend (NestJS).
- [ ] Áp dụng UI guidelines (`ui_design_guidelines.md`).
- [ ] Cấu hình Nginx + SSL (Let’s Encrypt).
- [ ] Thiết lập Prometheus, Grafana, ELK stack.
- [ ] Implement RBAC, JWT + 2FA, rate‑limiting, CSP.
- [ ] Viết script backup (`backup.sh`) và cron.
- [ ] Viết `setup.sh` và `.env.example`.
- [ ] Tạo API spec (OpenAPI) và tài liệu README.
- [ ] Viết unit, integration, và E2E tests.
- [ ] Kiểm thử, tối ưu hiệu năng, bảo mật.
- [ ] Deploy và chạy toàn bộ stack.

---
**Lưu ý:** Nội dung này đã được lưu vào file `d:\DATA\source\Kpanel\implementation_plan.md`.
