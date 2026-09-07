import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Server  } from '../servers/server.entity';
import { Project } from '../projects/project.entity';
import { Db      } from '../databases/db.entity';
import { User    } from '../users/user.entity';
import { Log     } from '../logs/log.entity';
import { DashboardController } from './dashboard.controller';

@Module({
  imports:     [TypeOrmModule.forFeature([Server, Project, Db, User, Log])],
  controllers: [DashboardController],
})
export class DashboardModule {}
