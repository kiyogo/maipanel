import { Injectable, OnApplicationBootstrap } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { User } from './users/user.entity';
import { Log } from './logs/log.entity';

@Injectable()
export class SeedService implements OnApplicationBootstrap {
  constructor(
    @InjectRepository(User) private readonly userRepo: Repository<User>,
    @InjectRepository(Log)  private readonly logRepo: Repository<Log>,
  ) {}

  async onApplicationBootstrap() {
    await this.seedUsers();
    await this.seedLogs();
  }

  private async seedUsers() {
    const count = await this.userRepo.count();
    if (count > 0) return;

    const hash = await bcrypt.hash('admin123', 10);
    const admin = this.userRepo.create({
      name: 'Administrator',
      email: 'admin@minepanel.com',
      password: hash,
      role: 'Administrator',
      isActive: true,
    });
    await this.userRepo.save(admin);
    console.log('🌱 [SeedService] Seeded default administrator user: admin@minepanel.com / admin123');
  }

  private async seedLogs() {
    const count = await this.logRepo.count();
    if (count > 0) return;

    const logs = [
      { level: 'INFO' as const, service: 'minecraft', message: 'Máy chủ Minecraft Paper 1.20.4 đã khởi động thành công' },
      { level: 'INFO' as const, service: 'rcon', message: 'Kết nối RCON đã được thiết lập thành công' },
      { level: 'INFO' as const, service: 'system', message: 'Sao lưu tự động thế giới world_nether hoàn tất' },
      { level: 'WARNING' as const, service: 'minecraft', message: 'Cảnh báo TPS giảm dưới 18.5 trong 30 giây' },
      { level: 'INFO' as const, service: 'plugin', message: 'Plugin EssentialsX v2.20.1 đã được tải thành công' },
    ];

    for (const l of logs) {
      await this.logRepo.save(this.logRepo.create(l));
    }
    console.log('🌱 [SeedService] Seeded initial logs data.');
  }
}

