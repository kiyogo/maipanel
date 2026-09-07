import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AiController } from './ai.controller';
import { AiService } from './ai.service';
import {
  AiAgent,
  AiConversation,
  AiMessage,
  AiTask,
  AiTaskStep,
  AiTaskDependency,
  AiPermission,
  AiApproval,
  AiLog,
  AiMemory,
  AiKnowledge,
  AiToolCall,
  AiModel,
  AiWorkspace,
  AiProject,
  AiContext,
  AiSchedule,
  AiTemplate,
  AiEmbedding,
  AiVectorChunk,
} from './ai.entity';
import { Project } from '../projects/project.entity';
import { Db } from '../databases/db.entity';
import { Log } from '../logs/log.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      AiAgent,
      AiConversation,
      AiMessage,
      AiTask,
      AiTaskStep,
      AiTaskDependency,
      AiPermission,
      AiApproval,
      AiLog,
      AiMemory,
      AiKnowledge,
      AiToolCall,
      AiModel,
      AiWorkspace,
      AiProject,
      AiContext,
      AiSchedule,
      AiTemplate,
      AiEmbedding,
      AiVectorChunk,
      Project,
      Db,
      Log,
    ]),
  ],
  controllers: [AiController],
  providers: [AiService],
  exports: [AiService],
})
export class AiModule {}
