import { Controller, Get, UseGuards } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { Server  } from '../servers/server.entity';
import { Project } from '../projects/project.entity';
import { Db      } from '../databases/db.entity';
import { User    } from '../users/user.entity';
import { Log     } from '../logs/log.entity';

@UseGuards(JwtAuthGuard)
@Controller('dashboard')
export class DashboardController {
  constructor(
    @InjectRepository(Server)  private servers:   Repository<Server>,
    @InjectRepository(Project) private projects:  Repository<Project>,
    @InjectRepository(Db)      private databases: Repository<Db>,
    @InjectRepository(User)    private users:     Repository<User>,
    @InjectRepository(Log)     private logs:      Repository<Log>,
  ) {}

  @Get('stats')
  async getStats() {
    const [allServers, allProjects, allDbs, allUsers, recentLogs] = await Promise.all([
      this.servers.find(),
      this.projects.find(),
      this.databases.find(),
      this.users.find(),
      this.logs.find({ order: { createdAt: 'DESC' }, take: 5 }),
    ]);

    return {
      servers: {
        total:   allServers.length,
        online:  allServers.filter(s => s.status === 'online').length,
        offline: allServers.filter(s => s.status === 'offline').length,
        warning: allServers.filter(s => s.status === 'warning').length,
      },
      projects: {
        total:   allProjects.length,
        running: allProjects.filter(p => p.status === 'running').length,
        stopped: allProjects.filter(p => p.status === 'stopped').length,
        summary: allProjects.reduce((acc: Record<string, number>, p) => { acc[p.type] = (acc[p.type] || 0) + 1; return acc; }, {} as Record<string, number>),
      },
      databases: {
        total:  allDbs.length,
        online: allDbs.filter(d => d.status === 'online').length,
        summary: allDbs.reduce((acc: Record<string, number>, d) => { acc[d.type] = (acc[d.type] || 0) + 1; return acc; }, {} as Record<string, number>),
      },
      users: {
        total: allUsers.length,
        active: allUsers.filter(u => u.isActive).length,
      },
      recentLogs,
    };
  }
}
