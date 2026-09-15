use sqlx::PgPool;
use uuid::Uuid;

pub async fn seed_database(pool: &PgPool) -> Result<(), anyhow::Error> {
    // 1. Seed Users nếu chưa có admin
    let user_count: (i64,) = sqlx::query_as("SELECT COUNT(*) FROM users")
        .fetch_one(pool)
        .await
        .unwrap_or((0,));

    if user_count.0 == 0 {
        let password_hash = bcrypt::hash("admin123", 10)?;
        sqlx::query(
            r#"
            INSERT INTO users (id, email, name, password, role, is_active)
            VALUES 
                ($1, 'admin@kpanel.com', 'Administrator', $2, 'Administrator', TRUE),
                ($3, 'admin@kiyovn.com', 'Administrator', $2, 'Administrator', TRUE)
            ON CONFLICT (email) DO NOTHING
            "#,
        )
        .bind(Uuid::new_v4())
        .bind(&password_hash)
        .bind(Uuid::new_v4())
        .execute(pool)
        .await?;
        tracing::info!("Seeded initial admin users (password: admin123).");
    }

    // 2. Seed Servers nếu trống
    let server_count: (i64,) = sqlx::query_as("SELECT COUNT(*) FROM servers")
        .fetch_one(pool)
        .await
        .unwrap_or((0,));

    if server_count.0 == 0 {
        let servers = vec![
            ("VPS-SG-01", "103.12.45.10", "Singapore", "Ubuntu 22.04", "online", 42, 61, 38, 0, "45°C", "12d 8h", "45 Mbps", "0.85"),
            ("VPS-TYO-02", "52.198.12.77", "Tokyo", "Ubuntu 22.04", "online", 18, 45, 55, 0, "42°C", "8d 3h", "32 Mbps", "0.42"),
            ("VPS-FRA-03", "35.157.88.211", "Frankfurt", "Debian 11", "warning", 73, 82, 20, 1, "58°C", "5d 22h", "120 Mbps", "2.15"),
            ("VPS-US-04", "54.234.11.9", "N. Virginia", "Ubuntu 20.04", "online", 5, 22, 10, 0, "38°C", "2d 14h", "8 Mbps", "0.12"),
            ("Dev-Machine", "192.168.1.2", "Local", "Ubuntu 22.04", "offline", 0, 0, 0, 0, "—", "—", "—", "—"),
        ];

        for s in servers {
            sqlx::query(
                r#"
                INSERT INTO servers (id, name, ip, region, os, status, cpu, ram, disk, gpu, temperature, uptime, network_traffic, load_average)
                VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14)
                "#
            )
            .bind(Uuid::new_v4())
            .bind(s.0)
            .bind(s.1)
            .bind(s.2)
            .bind(s.3)
            .bind(s.4)
            .bind(s.5)
            .bind(s.6)
            .bind(s.7)
            .bind(s.8)
            .bind(s.9)
            .bind(s.10)
            .bind(s.11)
            .bind(s.12)
            .execute(pool)
            .await?;
        }
        tracing::info!("Seeded sample servers.");
    }

    // 3. Seed Projects nếu trống
    let project_count: (i64,) = sqlx::query_as("SELECT COUNT(*) FROM projects")
        .fetch_one(pool)
        .await
        .unwrap_or((0,));

    if project_count.0 == 0 {
        let projects = vec![
            ("cms-laravel-store", "web-php", "VPS-SG-01", "cms.example.com", "https://github.com/example/laravel-cms", "running", Some("8.2"), None, Some("laravel"), true, Some("mysql")),
            ("wordpress-blog", "web-php", "VPS-TYO-02", "blog.example.com", "https://github.com/example/wp-theme", "running", Some("8.1"), None, Some("wordpress"), true, None),
            ("web-shop-react", "web-nodejs", "VPS-SG-01", "shop.example.com", "https://github.com/example/web-shop", "running", None, Some("20"), None, true, None),
            ("express-api-gateway", "web-nodejs", "VPS-TYO-02", "api-node.example.com", "https://github.com/example/express-api", "running", None, Some("18"), None, false, None),
            ("nginx-proxy-main", "web-proxy", "VPS-TYO-02", "proxy.example.com", "", "running", None, None, None, true, None),
        ];

        for p in projects {
            sqlx::query(
                r#"
                INSERT INTO projects (id, name, project_type, server, domain, git, status, php_version, node_version, framework, ssl, database)
                VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12)
                "#
            )
            .bind(Uuid::new_v4())
            .bind(p.0)
            .bind(p.1)
            .bind(p.2)
            .bind(p.3)
            .bind(p.4)
            .bind(p.5)
            .bind(p.6)
            .bind(p.7)
            .bind(p.8)
            .bind(p.9)
            .bind(p.10)
            .execute(pool)
            .await?;
        }
        tracing::info!("Seeded sample projects.");
    }

    // 4. Seed Databases nếu trống
    let db_count: (i64,) = sqlx::query_as("SELECT COUNT(*) FROM databases")
        .fetch_one(pool)
        .await
        .unwrap_or((0,));

    if db_count.0 == 0 {
        let databases = vec![
            ("shop_db", "MySQL", "VPS-SG-01", 3306, "online", "245 MB", "8.0.32", "Hôm qua, 02:00"),
            ("main_postgres", "PostgreSQL", "VPS-SG-01", 5432, "online", "1.2 GB", "15.2", "Hôm nay, 04:00"),
            ("cache_redis", "Redis", "VPS-SG-01", 6379, "online", "64 MB", "7.0.10", "Hôm qua, 03:00"),
            ("analytics_mongo", "MongoDB", "VPS-FRA-03", 27017, "stopped", "4.8 GB", "6.0.4", "3 ngày trước"),
        ];

        for d in databases {
            sqlx::query(
                r#"
                INSERT INTO databases (id, name, db_type, server, port, status, size, version, last_backup)
                VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
                "#
            )
            .bind(Uuid::new_v4())
            .bind(d.0)
            .bind(d.1)
            .bind(d.2)
            .bind(d.3)
            .bind(d.4)
            .bind(d.5)
            .bind(d.6)
            .bind(d.7)
            .execute(pool)
            .await?;
        }
        tracing::info!("Seeded sample databases.");
    }

    // 5. Seed Logs nếu trống
    let log_count: (i64,) = sqlx::query_as("SELECT COUNT(*) FROM logs")
        .fetch_one(pool)
        .await
        .unwrap_or((0,));

    if log_count.0 == 0 {
        sqlx::query(
            r#"
            INSERT INTO logs (id, level, service, message)
            VALUES 
                ($1, 'INFO', 'System', 'Hệ thống Kpanel (Rust + Axum + SQLx) khởi động thành công.'),
                ($2, 'INFO', 'Auth', 'Người dùng admin@kpanel.com đã đăng nhập thành công.'),
                ($3, 'WARNING', 'ServerMonitor', 'Máy chủ VPS-FRA-03 CPU vượt quá ngưỡng cảnh báo 70%.'),
                ($4, 'INFO', 'Database', 'Đã sao lưu cơ sở dữ liệu shop_db thành công.')
            "#,
        )
        .bind(Uuid::new_v4())
        .bind(Uuid::new_v4())
        .bind(Uuid::new_v4())
        .bind(Uuid::new_v4())
        .execute(pool)
        .await?;
        tracing::info!("Seeded sample logs.");
    }

    // 6. Seed AI agents nếu trống
    let agent_count: (i64,) = sqlx::query_as("SELECT COUNT(*) FROM ai_agents")
        .fetch_one(pool)
        .await
        .unwrap_or((0,));

    if agent_count.0 == 0 {
        sqlx::query(
            r#"
            INSERT INTO ai_agents (id, name, role, status, model, system_prompt)
            VALUES 
                ($1, 'Kiyo Devops AI', 'Chuyên gia Hạ tầng & DevOps', 'idle', 'gemini-1.5-pro', 'Bạn là trợ lý AI chuyên nghiệp về DevOps của Kpanel.'),
                ($2, 'Security Auditor', 'Kiểm thử & Bảo mật hệ thống', 'idle', 'gemini-1.5-flash', 'Bạn là trợ lý bảo mật hệ thống máy chủ Kpanel.')
            "#
        )
        .bind(Uuid::new_v4())
        .bind(Uuid::new_v4())
        .execute(pool)
        .await?;
    }

    Ok(())
}
