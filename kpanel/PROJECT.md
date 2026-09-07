# Project: Kpanel Web Management System

## Architecture
- Frontend: React + Vite + Ant Design (Nginx reverse proxy for production)
- Backend: NestJS API with REST endpoints and WebSocket gateway (xterm.js bridge)
- Database: PostgreSQL with TypeORM
- Cache: Redis
- Operations: Docker-Compose stack, setup.sh, backup.sh
- Monitoring & Logging: Prometheus, Grafana, Node Exporter, ELK Stack

## Milestones
| # | Name | Scope | Dependencies | Status |
|---|------|-------|-------------|--------|
| 1 | Exploration & Codebase Audit | Comprehensive evaluation of frontend, backend, docker, and test setup | none | IN_PROGRESS |
| 2 | E2E Testing Track | Design & implement 4-tier E2E test suite (`TEST_INFRA.md`, `TEST_READY.md`) | M1 | PLANNED |
| 3 | Backend NestJS Completion & Tests | Complete NestJS modules, TypeORM entities, Auth, 2FA, RBAC, WebSockets, Jest tests (>= 80% coverage) | M1 | PLANNED |
| 4 | Frontend React Completion & UI Alignment | Complete React pages, AntD UI guidelines, Axios JWT interceptors, xterm.js SSH, RTL tests | M1 | PLANNED |
| 5 | Docker-Compose & Infra Scripts | Multi-stage Dockerfiles, docker-compose.yml, Nginx, monitoring, setup.sh, backup.sh | M3, M4 | PLANNED |
| 6 | E2E Validation, Coverage Hardening & Victory Audit | Run 100% E2E tests, Tier 5 adversarial testing, Forensic Integrity Audit | M2, M3, M4, M5 | PLANNED |

## Interface Contracts
### Frontend ↔ Backend API
- Base URL: `/api`
- Auth: JWT Bearer in Authorization header
- Refresh Token: `/api/auth/refresh`
- Socket.io Endpoint: `/terminal` for SSH bridge

## Code Layout
- `frontend/src/`: React source code (components, pages, services, routes)
- `backend/src/`: NestJS source code (auth, user, server, project, monitor, log, file, terminal)
- `docker-compose.yml`: Top-level Docker Compose stack specification
