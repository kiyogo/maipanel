const { Client } = require('pg');

const client = new Client({
  host: 'localhost',
  port: 5432,
  user: 'kpanel',
  password: 'kpanel123',
  database: 'kpanel'
});

async function run() {
  try {
    await client.connect();
    console.log("Connected to PostgreSQL...");

    // 1. Projects for ALL project types
    const projects = [
      { name: 'cms-laravel-store', type: 'web-php', server: 'VPS-SG-01', domain: 'cms.example.com', status: 'running' },
      { name: 'wordpress-blog', type: 'web-php', server: 'VPS-TYO-02', domain: 'blog.example.com', status: 'running' },
      { name: 'web-shop-react', type: 'web-nodejs', server: 'VPS-SG-01', domain: 'shop.example.com', status: 'running' },
      { name: 'express-api-gateway', type: 'web-nodejs', server: 'VPS-TYO-02', domain: 'api-node.example.com', status: 'running' },
      { name: 'nginx-proxy-main', type: 'web-proxy', server: 'VPS-TYO-02', domain: 'proxy.example.com', status: 'running' },
      { name: 'traefik-gateway', type: 'web-proxy', server: 'VPS-FRA-03', domain: 'gateway.example.com', status: 'stopped' },
      { name: 'gin-auth-service', type: 'web-go', server: 'VPS-SG-01', domain: 'auth.go.example.com', status: 'running' },
      { name: 'fiber-microservice', type: 'web-go', server: 'VPS-US-04', domain: 'fiber.example.com', status: 'stopped' },
      { name: 'django-portal', type: 'web-python', server: 'VPS-FRA-03', domain: 'django.example.com', status: 'running' },
      { name: 'fastapi-backend', type: 'web-python', server: 'VPS-SG-01', domain: 'fast.example.com', status: 'running' },
      { name: 'minecraft-survival-server', type: 'game', server: 'VPS-SG-01', domain: 'mc.example.com', status: 'running' },
      { name: 'cs2-competitive-match', type: 'game', server: 'VPS-TYO-02', domain: '', status: 'stopped' },
      { name: 'fivem-roleplay-city', type: 'game', server: 'VPS-FRA-03', domain: '', status: 'running' },
      { name: 'electron-desktop-sync', type: 'app', server: 'VPS-US-04', domain: 'sync.app.example.com', status: 'running' },
      { name: 'flutter-mobile-backend', type: 'app', server: 'VPS-SG-01', domain: 'mobile.example.com', status: 'running' },
      { name: 'llm-rag-pipeline', type: 'data', server: 'VPS-FRA-03', domain: 'ai.example.com', status: 'stopped' },
      { name: 'tensorflow-model-trainer', type: 'data', server: 'VPS-FRA-03', domain: '', status: 'running' },
      { name: 'graphql-federation-gateway', type: 'api', server: 'VPS-SG-01', domain: 'graphql.example.com', status: 'running' },
      { name: 'stripe-payment-service', type: 'api', server: 'VPS-TYO-02', domain: 'pay.example.com', status: 'running' },
      { name: 'docker-registry-private', type: 'docker', server: 'VPS-FRA-03', domain: 'registry.example.com', status: 'stopped' },
      { name: 'k8s-ingress-stack', type: 'docker', server: 'VPS-SG-01', domain: '', status: 'running' },
      { name: 'docs-hugo-site', type: 'static', server: 'VPS-SG-01', domain: 'docs.example.com', status: 'running' },
      { name: 'astro-landing-page', type: 'static', server: 'VPS-TYO-02', domain: 'landing.example.com', status: 'running' },
      { name: 'spring-boot-ecommerce', type: 'java', server: 'VPS-FRA-03', domain: 'spring.example.com', status: 'running' },
      { name: 'quarkus-event-bus', type: 'java', server: 'VPS-US-04', domain: '', status: 'stopped' },
      { name: 'actix-web-highperf', type: 'rust', server: 'VPS-SG-01', domain: 'rust.example.com', status: 'running' },
      { name: 'axum-telemetry-collector', type: 'rust', server: 'VPS-TYO-02', domain: '', status: 'running' },
      { name: 'custom-cron-runner', type: 'other', server: 'VPS-US-04', domain: '', status: 'stopped' }
    ];

    for (const p of projects) {
      await client.query(`
        INSERT INTO projects (id, name, type, server, domain, status, "createdAt", "updatedAt")
        VALUES (gen_random_uuid(), $1, $2, $3, $4, $5, NOW(), NOW())
        ON CONFLICT DO NOTHING
      `, [p.name, p.type, p.server, p.domain, p.status]);
    }
    console.log(`Inserted ${projects.length} mock projects.`);

    // 2. Databases for ALL DB types
    const dbs = [
      { name: 'kpanel_prod', type: 'PostgreSQL', server: 'VPS-SG-01', port: 5432, size: '2.3 GB', status: 'online', version: '16', lastBackup: '2026-06-17 02:00' },
      { name: 'auth_postgres_db', type: 'PostgreSQL', server: 'VPS-TYO-02', port: 5432, size: '850 MB', status: 'online', version: '15', lastBackup: '2026-06-16 02:00' },
      { name: 'shop_db_mysql', type: 'MySQL', server: 'VPS-TYO-02', port: 3306, size: '1.1 GB', status: 'online', version: '8.0', lastBackup: '2026-06-17 02:00' },
      { name: 'wordpress_mysql_prod', type: 'MySQL', server: 'VPS-SG-01', port: 3306, size: '420 MB', status: 'online', version: '8.0', lastBackup: '2026-06-15 02:00' },
      { name: 'analytics_mongo', type: 'MongoDB', server: 'VPS-FRA-03', port: 27017, size: '8.7 GB', status: 'online', version: '7.0', lastBackup: '2026-06-16 02:00' },
      { name: 'user_sessions_mongo', type: 'MongoDB', server: 'VPS-SG-01', port: 27017, size: '1.4 GB', status: 'online', version: '6.0', lastBackup: 'Chưa có' },
      { name: 'cache_redis_main', type: 'Redis', server: 'VPS-SG-01', port: 6379, size: '120 MB', status: 'online', version: '7.2', lastBackup: 'Chưa có' },
      { name: 'session_redis_store', type: 'Redis', server: 'VPS-TYO-02', port: 6379, size: '45 MB', status: 'online', version: '7.0', lastBackup: 'Chưa có' },
      { name: 'mariadb_forum_cluster', type: 'MariaDB', server: 'VPS-US-04', port: 3307, size: '3.1 GB', status: 'online', version: '10.11', lastBackup: '2026-06-17 01:00' },
      { name: 'logs_elasticsearch_db', type: 'Elasticsearch', server: 'VPS-FRA-03', port: 9200, size: '15.2 GB', status: 'online', version: '8.12', lastBackup: '2026-06-17 02:00' },
      { name: 'analytics_clickhouse', type: 'ClickHouse', server: 'VPS-US-04', port: 8123, size: '4.5 GB', status: 'online', version: '24.1', lastBackup: '2026-06-17 03:00' },
      { name: 'mssql_enterprise_erp', type: 'SQL Server', server: 'VPS-FRA-03', port: 1433, size: '18.5 GB', status: 'online', version: '2022', lastBackup: '2026-06-17 00:00' },
      { name: 'sqlite_local_testing', type: 'SQLite', server: 'Dev-Machine', port: 0, size: '48 MB', status: 'stopped', version: '3.45', lastBackup: 'Chưa có' }
    ];

    for (const d of dbs) {
      await client.query(`
        INSERT INTO databases (id, name, type, server, port, status, size, version, "lastBackup", "createdAt")
        VALUES (gen_random_uuid(), $1, $2, $3, $4, $5, $6, $7, $8, NOW())
        ON CONFLICT DO NOTHING
      `, [d.name, d.type, d.server, d.port, d.status, d.size, d.version, d.lastBackup]);
    }
    console.log(`Inserted ${dbs.length} mock databases.`);

  } catch (e) {
    console.error("Error inserting fake data:", e);
  } finally {
    await client.end();
  }
}
run();
