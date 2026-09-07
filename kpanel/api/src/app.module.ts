import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule }      from './auth/auth.module';
import { UsersModule }     from './users/users.module';
import { ServersModule }   from './servers/servers.module';
import { ProjectsModule }  from './projects/projects.module';
import { DatabasesModule } from './databases/databases.module';
import { LogsModule }      from './logs/logs.module';
import { DashboardModule } from './dashboard/dashboard.module';
import { AiModule }        from './ai/ai.module';

import { User } from './users/user.entity';
import { Server } from './servers/server.entity';
import { Project } from './projects/project.entity';
import { Db } from './databases/db.entity';
import { Log } from './logs/log.entity';
import { AiConversation, AiMessage, AiMemory, AiTask } from './ai/ai.entity';
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
        username: config.get('DB_USERNAME', 'kpanel'),
        password: config.get('DB_PASSWORD', 'kpanel123'),
        database: config.get('DB_NAME',     'kpanel'),
        autoLoadEntities: true,
        synchronize: true, // Chỉ dùng development – production dùng migration
      }),
      inject: [ConfigService],
    }),

    TypeOrmModule.forFeature([User, Server, Project, Db, Log, AiConversation, AiMessage, AiMemory, AiTask]),

    AuthModule,
    UsersModule,
    ServersModule,
    ProjectsModule,
    DatabasesModule,
    LogsModule,
    DashboardModule,
    AiModule,
  ],
  providers: [SeedService],
})
export class AppModule {}
