import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from '../users/user.entity';
import { Log }  from '../logs/log.entity';
import { DashboardController } from './dashboard.controller';

@Module({
  imports:     [TypeOrmModule.forFeature([User, Log])],
  controllers: [DashboardController],
})
export class DashboardModule {}
