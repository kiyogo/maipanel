import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule }      from './auth/auth.module';
import { UsersModule }     from './users/users.module';
import { LogsModule }      from './logs/logs.module';
import { DashboardModule } from './dashboard/dashboard.module';

import { User } from './users/user.entity';
import { Log } from './logs/log.entity';
import { SeedService } from './seed.service';

@Module({
  imports: [
    // Biến môi trường toàn cục
    ConfigModule.forRoot({ isGlobal: true }),

    // Kết nối PostgreSQL qua TypeORM
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (config: ConfigService) => ({
        type: 'postgres',
        host:     config.get('DB_HOST',     'localhost'),
        port:     config.get<number>('DB_PORT', 5432),
        username: config.get('DB_USERNAME', 'minepanel'),
        password: config.get('DB_PASSWORD', 'minepanel123'),
        database: config.get('DB_NAME',     'minepanel'),
        autoLoadEntities: true,
        synchronize: true, // Chỉ dùng development – production dùng migration
      }),
      inject: [ConfigService],
    }),

    TypeOrmModule.forFeature([User, Log]),

    AuthModule,
    UsersModule,
    LogsModule,
    DashboardModule,
  ],
  providers: [SeedService],
})
export class AppModule {}
