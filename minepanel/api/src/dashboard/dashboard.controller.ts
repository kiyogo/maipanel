import { Controller, Get, UseGuards } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { User } from '../users/user.entity';
import { Log }  from '../logs/log.entity';

@UseGuards(JwtAuthGuard)
@Controller('dashboard')
export class DashboardController {
  constructor(
    @InjectRepository(User) private users: Repository<User>,
    @InjectRepository(Log)  private logs:  Repository<Log>,
  ) {}

  @Get('stats')
  async getStats() {
    const [allUsers, recentLogs] = await Promise.all([
      this.users.find(),
      this.logs.find({ order: { createdAt: 'DESC' }, take: 5 }),
    ]);

    return {
      users: {
        total: allUsers.length,
        active: allUsers.filter(u => u.isActive).length,
      },
      recentLogs,
    };
  }
}

