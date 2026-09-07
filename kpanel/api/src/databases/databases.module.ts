import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Db } from './db.entity';
import { DatabasesService }    from './databases.service';
import { DatabasesController } from './databases.controller';

@Module({
  imports:     [TypeOrmModule.forFeature([Db])],
  providers:   [DatabasesService],
  controllers: [DatabasesController],
  exports:     [DatabasesService],
})
export class DatabasesModule {}
