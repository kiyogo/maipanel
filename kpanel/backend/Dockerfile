# ===== Build Stage =====
FROM rust:alpine AS builder

WORKDIR /app

# Cài đặt các thư viện cần thiết cho alpine (musl, openssl, pkgconfig)
RUN apk add --no-cache musl-dev pkgconfig openssl-dev

# Copy mã nguồn và dependencies
COPY Cargo.toml Cargo.lock* ./
COPY migrations ./migrations
COPY src ./src

# Build binary release
RUN cargo build --release

# ===== Runtime Stage =====
FROM alpine:latest

WORKDIR /app

RUN apk add --no-cache libgcc ca-certificates openssl

# Copy binary từ builder stage
COPY --from=builder /app/target/release/kpanel-backend /app/kpanel-backend
COPY --from=builder /app/migrations /app/migrations

ENV PORT=3001
EXPOSE 3001

CMD ["/app/kpanel-backend"]
