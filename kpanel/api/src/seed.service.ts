import { Injectable, OnApplicationBootstrap } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { User } from './users/user.entity';
import { Server } from './servers/server.entity';
import { Project } from './projects/project.entity';
import { Db } from './databases/db.entity';
import { Log } from './logs/log.entity';

@Injectable()
export class SeedService implements OnApplicationBootstrap {
  constructor(
    @InjectRepository(User)    private readonly userRepo: Repository<User>,
    @InjectRepository(Server)  private readonly serverRepo: Repository<Server>,
    @InjectRepository(Project) private readonly projectRepo: Repository<Project>,
    @InjectRepository(Db)      private readonly dbRepo: Repository<Db>,
    @InjectRepository(Log)     private readonly logRepo: Repository<Log>,
  ) {}

  async onApplicationBootstrap() {
    await this.seedUsers();
    await this.seedServers();
    await this.seedProjects();
    await this.seedDatabases();
    await this.seedLogs();
  }

  private async seedUsers() {
    const count = await this.userRepo.count();
    if (count === 0) {
      const hash = await bcrypt.hash('admin123', 10);
      const admin = this.userRepo.create({
        name: 'Administrator',
        email: 'admin@kpanel.com',
        password: hash,
        role: 'Administrator',
        isActive: true,
      });
      await this.userRepo.save(admin);
      console.log('🌱 [SeedService] Seeded default administrator user.');
    }
  }

  private async seedServers() {
    const count = await this.serverRepo.count();
    if (count < 5) {
      const servers = [
        { name: 'VPS-SG-01', ip: '103.12.45.10', region: 'Singapore', os: 'Ubuntu 22.04', status: 'online' as const, cpu: 42, ram: 61, disk: 38, gpu: 0, temperature: '45°C', uptime: '12d 8h', networkTraffic: '45 Mbps', loadAverage: '0.85' },
        { name: 'VPS-TYO-02', ip: '52.198.12.77', region: 'Tokyo', os: 'Ubuntu 22.04', status: 'online' as const, cpu: 18, ram: 45, disk: 55, gpu: 0, temperature: '42°C', uptime: '8d 3h', networkTraffic: '32 Mbps', loadAverage: '0.42' },
        { name: 'VPS-FRA-03', ip: '35.157.88.211', region: 'Frankfurt', os: 'Debian 11', status: 'warning' as const, cpu: 73, ram: 82, disk: 20, gpu: 1, temperature: '58°C', uptime: '5d 22h', networkTraffic: '120 Mbps', loadAverage: '2.15' },
        { name: 'VPS-US-04', ip: '54.234.11.9', region: 'N. Virginia', os: 'Ubuntu 20.04', status: 'online' as const, cpu: 5, ram: 22, disk: 10, gpu: 0, temperature: '38°C', uptime: '2d 14h', networkTraffic: '8 Mbps', loadAverage: '0.12' },
        { name: 'Dev-Machine', ip: '192.168.1.2', region: 'Local', os: 'Ubuntu 22.04', status: 'offline' as const, cpu: 0, ram: 0, disk: 0, gpu: 0, temperature: '—', uptime: '—', networkTraffic: '—', loadAverage: '—' },
      ];

      for (const s of servers) {
        const exist = await this.serverRepo.findOneBy({ name: s.name });
        if (!exist) await this.serverRepo.save(this.serverRepo.create(s));
      }
      console.log('🌱 [SeedService] Seeded simulated servers data.');
    }
  }

  private async seedProjects() {
    const projects = [
      // Web PHP
      { name: 'cms-laravel-store', type: 'web-php', server: 'VPS-SG-01', domain: 'cms.example.com', status: 'running' as const, git: 'https://github.com/example/laravel-cms', phpVersion: '8.2', framework: 'laravel', ssl: true, database: 'mysql' },
      { name: 'wordpress-blog', type: 'web-php', server: 'VPS-TYO-02', domain: 'blog.example.com', status: 'running' as const, git: 'https://github.com/example/wp-theme', phpVersion: '8.1', framework: 'wordpress', ssl: true },
      
      // Web Node.js
      { name: 'web-shop-react', type: 'web-nodejs', server: 'VPS-SG-01', domain: 'shop.example.com', status: 'running' as const, git: 'https://github.com/example/web-shop', nodeVersion: '20', ssl: true },
      { name: 'express-api-gateway', type: 'web-nodejs', server: 'VPS-TYO-02', domain: 'api-node.example.com', status: 'running' as const, git: 'https://github.com/example/express-api', nodeVersion: '18' },
      
      // Reverse Proxy
      { name: 'nginx-proxy-main', type: 'web-proxy', server: 'VPS-TYO-02', domain: 'proxy.example.com', status: 'running' as const, git: '', ssl: true },
      { name: 'traefik-gateway', type: 'web-proxy', server: 'VPS-FRA-03', domain: 'gateway.example.com', status: 'stopped' as const, git: '' },
      
      // Web Go
      { name: 'gin-auth-service', type: 'web-go', server: 'VPS-SG-01', domain: 'auth.go.example.com', status: 'running' as const, git: 'https://github.com/example/gin-auth' },
      { name: 'fiber-microservice', type: 'web-go', server: 'VPS-US-04', domain: 'fiber.example.com', status: 'stopped' as const, git: 'https://github.com/example/fiber-service' },

      // Web Python
      { name: 'django-portal', type: 'web-python', server: 'VPS-FRA-03', domain: 'django.example.com', status: 'running' as const, git: 'https://github.com/example/django-portal', pythonVersion: '3.12', framework: 'django' },
      { name: 'fastapi-backend', type: 'web-python', server: 'VPS-SG-01', domain: 'fast.example.com', status: 'running' as const, git: 'https://github.com/example/fastapi', pythonVersion: '3.11', framework: 'fastapi' },

      // Game Server
      { name: 'minecraft-survival-server', type: 'game', server: 'VPS-SG-01', domain: 'mc.example.com', status: 'running' as const, git: '' },
      { name: 'cs2-competitive-match', type: 'game', server: 'VPS-TYO-02', domain: '', status: 'stopped' as const, git: '' },
      { name: 'fivem-roleplay-city', type: 'game', server: 'VPS-FRA-03', domain: '', status: 'running' as const, git: '' },

      // Application
      { name: 'electron-desktop-sync', type: 'app', server: 'VPS-US-04', domain: 'sync.app.example.com', status: 'running' as const, git: '' },
      { name: 'flutter-mobile-backend', type: 'app', server: 'VPS-SG-01', domain: 'mobile.example.com', status: 'running' as const, git: '' },

      // AI / Data
      { name: 'llm-rag-pipeline', type: 'data', server: 'VPS-FRA-03', domain: 'ai.example.com', status: 'stopped' as const, git: 'https://github.com/example/rag-pipeline', pythonVersion: '3.11' },
      { name: 'tensorflow-model-trainer', type: 'data', server: 'VPS-FRA-03', domain: '', status: 'running' as const, git: '' },

      // API Service
      { name: 'graphql-federation-gateway', type: 'api', server: 'VPS-SG-01', domain: 'graphql.example.com', status: 'running' as const, git: 'https://github.com/example/graphql-mw', ssl: true },
      { name: 'stripe-payment-service', type: 'api', server: 'VPS-TYO-02', domain: 'pay.example.com', status: 'running' as const, git: '' },

      // Docker
      { name: 'docker-registry-private', type: 'docker', server: 'VPS-FRA-03', domain: 'registry.example.com', status: 'stopped' as const, git: 'https://github.com/example/registry' },
      { name: 'k8s-ingress-stack', type: 'docker', server: 'VPS-SG-01', domain: '', status: 'running' as const, git: '' },

      // Static Site
      { name: 'docs-hugo-site', type: 'static', server: 'VPS-SG-01', domain: 'docs.example.com', status: 'running' as const, git: 'https://github.com/example/docs' },
      { name: 'astro-landing-page', type: 'static', server: 'VPS-TYO-02', domain: 'landing.example.com', status: 'running' as const, git: '' },

      // Java / Spring
      { name: 'spring-boot-ecommerce', type: 'java', server: 'VPS-FRA-03', domain: 'spring.example.com', status: 'running' as const, git: 'https://github.com/example/spring-shop' },
      { name: 'quarkus-event-bus', type: 'java', server: 'VPS-US-04', domain: '', status: 'stopped' as const, git: '' },

      // Rust
      { name: 'actix-web-highperf', type: 'rust', server: 'VPS-SG-01', domain: 'rust.example.com', status: 'running' as const, git: 'https://github.com/example/actix-app' },
      { name: 'axum-telemetry-collector', type: 'rust', server: 'VPS-TYO-02', domain: '', status: 'running' as const, git: '' },

      // Other
      { name: 'custom-cron-runner', type: 'other', server: 'VPS-US-04', domain: '', status: 'stopped' as const, git: '' },
    ];

    for (const p of projects) {
      const exist = await this.projectRepo.findOneBy({ name: p.name });
      if (!exist) {
        await this.projectRepo.save(this.projectRepo.create(p));
      }
    }
    console.log('🌱 [SeedService] Seeded simulated projects data for all categories.');
  }

  private async seedDatabases() {
    const dbs = [
      { name: 'kpanel_prod', type: 'PostgreSQL', server: 'VPS-SG-01', port: 5432, size: '2.3 GB', status: 'online' as const, version: '16', lastBackup: '2026-06-17 02:00' },
      { name: 'auth_postgres_db', type: 'PostgreSQL', server: 'VPS-TYO-02', port: 5432, size: '850 MB', status: 'online' as const, version: '15', lastBackup: '2026-06-16 02:00' },
      
      { name: 'shop_db_mysql', type: 'MySQL', server: 'VPS-TYO-02', port: 3306, size: '1.1 GB', status: 'online' as const, version: '8.0', lastBackup: '2026-06-17 02:00' },
      { name: 'wordpress_mysql_prod', type: 'MySQL', server: 'VPS-SG-01', port: 3306, size: '420 MB', status: 'online' as const, version: '8.0', lastBackup: '2026-06-15 02:00' },

      { name: 'analytics_mongo', type: 'MongoDB', server: 'VPS-FRA-03', port: 27017, size: '8.7 GB', status: 'online' as const, version: '7.0', lastBackup: '2026-06-16 02:00' },
      { name: 'user_sessions_mongo', type: 'MongoDB', server: 'VPS-SG-01', port: 27017, size: '1.4 GB', status: 'online' as const, version: '6.0', lastBackup: 'Chưa có' },

      { name: 'cache_redis_main', type: 'Redis', server: 'VPS-SG-01', port: 6379, size: '120 MB', status: 'online' as const, version: '7.2', lastBackup: 'Chưa có' },
      { name: 'session_redis_store', type: 'Redis', server: 'VPS-TYO-02', port: 6379, size: '45 MB', status: 'online' as const, version: '7.0', lastBackup: 'Chưa có' },

      { name: 'mariadb_forum_cluster', type: 'MariaDB', server: 'VPS-US-04', port: 3307, size: '3.1 GB', status: 'online' as const, version: '10.11', lastBackup: '2026-06-17 01:00' },

      { name: 'logs_elasticsearch_db', type: 'Elasticsearch', server: 'VPS-FRA-03', port: 9200, size: '15.2 GB', status: 'online' as const, version: '8.12', lastBackup: '2026-06-17 02:00' },

      { name: 'analytics_clickhouse', type: 'ClickHouse', server: 'VPS-US-04', port: 8123, size: '4.5 GB', status: 'online' as const, version: '24.1', lastBackup: '2026-06-17 03:00' },

      { name: 'mssql_enterprise_erp', type: 'SQL Server', server: 'VPS-FRA-03', port: 1433, size: '18.5 GB', status: 'online' as const, version: '2022', lastBackup: '2026-06-17 00:00' },

      { name: 'sqlite_local_testing', type: 'SQLite', server: 'Dev-Machine', port: 0, size: '48 MB', status: 'stopped' as const, version: '3.45', lastBackup: 'Chưa có' },
    ];

    for (const d of dbs) {
      const exist = await this.dbRepo.findOneBy({ name: d.name });
      if (!exist) {
        await this.dbRepo.save(this.dbRepo.create(d));
      }
    }
    console.log('🌱 [SeedService] Seeded simulated databases data for all types.');
  }

  private async seedLogs() {
    const count = await this.logRepo.count();
    if (count < 5) {
      const logs = [
        { level: 'INFO' as const, service: 'postgres', message: 'Backup PostgreSQL hoàn tất' },
        { level: 'WARNING' as const, service: 'system', message: 'CPU VPS-FRA-03 vượt ngưỡng 70%' },
        { level: 'INFO' as const, service: 'nginx', message: "SSL Let's Encrypt tự động gia hạn thành công" },
        { level: 'ERROR' as const, service: 'backend', message: 'Kết nối tới Redis bị từ chối' },
        { level: 'INFO' as const, service: 'nginx', message: 'Deploy "web-shop-react" hoàn tất' },
      ];

      for (const l of logs) {
        await this.logRepo.save(this.logRepo.create(l));
      }
      console.log('🌱 [SeedService] Seeded simulated logs data.');
    }
  }
}

