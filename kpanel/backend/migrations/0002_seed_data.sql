-- Seed initial admin users (password: admin123)
-- bcrypt hash for 'admin123': $2b$10$hKzK2y9E8wY01V3v8C7jAeO3Oq0J6k7q5C8d2V4b6N9m0L3k5J8p.
INSERT INTO users (email, name, password, role, is_active)
VALUES 
    ('admin@kpanel.com', 'Administrator', '$2b$10$G0N47j5W0cI23EomxZq88OTyqJgQv8y6O9eG6B7F9t4hK1l3N5p6y', 'Administrator', TRUE),
    ('admin@kiyovn.com', 'Administrator', '$2b$10$G0N47j5W0cI23EomxZq88OTyqJgQv8y6O9eG6B7F9t4hK1l3N5p6y', 'Administrator', TRUE)
ON CONFLICT (email) DO NOTHING;

-- Seed simulated servers
INSERT INTO servers (name, ip, region, os, status, cpu, ram, disk, gpu, temperature, uptime, network_traffic, load_average)
VALUES
    ('VPS-SG-01', '103.12.45.10', 'Singapore', 'Ubuntu 22.04', 'online', 42, 61, 38, 0, '45°C', '12d 8h', '45 Mbps', '0.85'),
    ('VPS-TYO-02', '52.198.12.77', 'Tokyo', 'Ubuntu 22.04', 'online', 18, 45, 55, 0, '42°C', '8d 3h', '32 Mbps', '0.42'),
    ('VPS-FRA-03', '35.157.88.211', 'Frankfurt', 'Debian 11', 'warning', 73, 82, 20, 1, '58°C', '5d 22h', '120 Mbps', '2.15'),
    ('VPS-US-04', '54.234.11.9', 'N. Virginia', 'Ubuntu 20.04', 'online', 5, 22, 10, 0, '38°C', '2d 14h', '8 Mbps', '0.12'),
    ('Dev-Machine', '192.168.1.2', 'Local', 'Ubuntu 22.04', 'offline', 0, 0, 0, 0, '—', '—', '—', '—')
ON CONFLICT DO NOTHING;

-- Seed simulated projects
INSERT INTO projects (name, project_type, server, domain, git, status, php_version, node_version, framework, ssl, database)
VALUES
    ('cms-laravel-store', 'web-php', 'VPS-SG-01', 'cms.example.com', 'https://github.com/example/laravel-cms', 'running', '8.2', NULL, 'laravel', TRUE, 'mysql'),
    ('wordpress-blog', 'web-php', 'VPS-TYO-02', 'blog.example.com', 'https://github.com/example/wp-theme', 'running', '8.1', NULL, 'wordpress', TRUE, NULL),
    ('web-shop-react', 'web-nodejs', 'VPS-SG-01', 'shop.example.com', 'https://github.com/example/web-shop', 'running', NULL, '20', NULL, TRUE, NULL),
    ('express-api-gateway', 'web-nodejs', 'VPS-TYO-02', 'api-node.example.com', 'https://github.com/example/express-api', 'running', NULL, '18', NULL, FALSE, NULL),
    ('nginx-proxy-main', 'web-proxy', 'VPS-TYO-02', 'proxy.example.com', '', 'running', NULL, NULL, NULL, TRUE, NULL)
ON CONFLICT DO NOTHING;

-- Seed simulated databases
INSERT INTO databases (name, db_type, server, port, status, size, version, last_backup)
VALUES
    ('shop_db', 'MySQL', 'VPS-SG-01', 3306, 'online', '245 MB', '8.0.32', 'Hôm qua, 02:00'),
    ('main_postgres', 'PostgreSQL', 'VPS-SG-01', 5432, 'online', '1.2 GB', '15.2', 'Hôm nay, 04:00'),
    ('cache_redis', 'Redis', 'VPS-SG-01', 6379, 'online', '64 MB', '7.0.10', 'Hôm qua, 03:00'),
    ('analytics_mongo', 'MongoDB', 'VPS-FRA-03', 27017, 'stopped', '4.8 GB', '6.0.4', '3 ngày trước')
ON CONFLICT DO NOTHING;

-- Seed sample logs
INSERT INTO logs (level, service, message)
VALUES
    ('INFO', 'System', 'Hệ thống Kpanel (Rust + Axum) khởi động thành công.'),
    ('INFO', 'Auth', 'Người dùng admin@kpanel.com đã đăng nhập thành công.'),
    ('WARNING', 'ServerMonitor', 'Máy chủ VPS-FRA-03 CPU vượt quá ngưỡng cảnh báo 70%.'),
    ('INFO', 'Database', 'Đã sao lưu cơ sở dữ liệu shop_db thành công.');
