import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn } from 'typeorm';

// 1. AiAgent
@Entity('ai_agents')
export class AiAgent {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @Column()
  role: string;

  @Column({ default: 'idle' })
  status: string;

  @Column({ default: 'gemini-1.5-flash' })
  model: string;

  @Column({ type: 'text', nullable: true })
  systemPrompt: string;

  @CreateDateColumn()
  createdAt: Date;
}

// 2. AiConversation
@Entity('ai_conversations')
export class AiConversation {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  title: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}

// 3. AiMessage
@Entity('ai_messages')
export class AiMessage {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  conversationId: string;

  @Column({ default: 'user' })
  role: 'user' | 'assistant';

  @Column({ type: 'text' })
  content: string;

  @Column({ type: 'text', nullable: true })
  thinkingProcess: string;

  @Column('simple-json', { nullable: true })
  plan: Array<{
    id: string;
    step: string;
    status: 'pending' | 'planning' | 'running' | 'waiting_approval' | 'completed' | 'failed' | 'skipped' | 'cancelled';
    description?: string;
  }>;

  @Column('simple-json', { nullable: true })
  toolUsages: Array<{
    id: string;
    tool: string;
    command?: string;
    arguments?: string;
    output?: string;
    status: 'pending' | 'running' | 'success' | 'failed';
  }>;

  @Column('simple-json', { nullable: true })
  subAgentLogs: Array<{
    timestamp: string;
    agent: string;
    message: string;
    level: 'info' | 'warning' | 'error';
  }>;

  @Column('simple-json', { nullable: true })
  approvals: Array<{
    id: string;
    type: 'file' | 'folder' | 'project' | 'database' | 'server' | 'deploy' | 'terminal';
    action: string;
    target: string;
    details?: string;
    status: 'pending' | 'approved' | 'rejected';
  }>;

  @Column({ type: 'text', nullable: true })
  executionPreview: string;

  @Column('simple-json', { nullable: true })
  filesTouched: Array<{
    filepath: string;
    status: 'modified' | 'created' | 'deleted';
    diff?: string;
  }>;

  @CreateDateColumn()
  createdAt: Date;
}

// 4. AiTask
@Entity('ai_tasks')
export class AiTask {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  title: string;

  @Column({ default: 'pending' })
  status: 'pending' | 'planning' | 'running' | 'waiting_approval' | 'completed' | 'failed' | 'cancelled';

  @Column({ default: 0 })
  progress: number;

  @Column({ default: 'Chief Agent' })
  agent: string;

  @Column({ default: 'medium' })
  priority: 'low' | 'medium' | 'high';

  @Column({ default: 'general' })
  category: string;

  @CreateDateColumn()
  createdAt: Date;
}

// 5. AiTaskStep
@Entity('ai_task_steps')
export class AiTaskStep {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  taskId: string;

  @Column()
  step: string;

  @Column({ default: 'pending' })
  status: 'pending' | 'running' | 'completed' | 'failed' | 'cancelled';

  @Column({ default: 0 })
  progress: number;

  @Column({ type: 'text', nullable: true })
  description: string;

  @CreateDateColumn()
  createdAt: Date;
}

// 6. AiTaskDependency
@Entity('ai_task_dependencies')
export class AiTaskDependency {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  taskId: string;

  @Column()
  dependencyTaskId: string;

  @CreateDateColumn()
  createdAt: Date;
}

// 7. AiPermission
@Entity('ai_permissions')
export class AiPermission {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ default: 'tool_level' })
  level: string; // 'workspace_level' | 'project_level' | 'tool_level' | 'folder_level' | 'database_level'

  @Column()
  target: string;

  @Column()
  action: string;

  @Column({ default: true })
  authorized: boolean;

  @CreateDateColumn()
  createdAt: Date;
}

// 8. AiApproval
@Entity('ai_approvals')
export class AiApproval {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ nullable: true })
  messageId: string;

  @Column({ default: 'dangerous_operations' })
  type: string; // 'delete_file' | 'delete_folder' | 'delete_database' | 'deploy_production' | 'restart_server' | 'edit_environment' | 'dangerous_operations'

  @Column()
  action: string;

  @Column()
  target: string;

  @Column({ type: 'text', nullable: true })
  details: string;

  @Column({ default: 'pending' })
  status: 'pending' | 'approved' | 'rejected';

  @CreateDateColumn()
  createdAt: Date;
}

// 9. AiLog
@Entity('ai_logs')
export class AiLog {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  timestamp: string;

  @Column()
  agent: string;

  @Column({ type: 'text' })
  message: string;

  @Column({ default: 'info' })
  level: string; // 'info' | 'warning' | 'error'

  @CreateDateColumn()
  createdAt: Date;
}

// 10. AiMemory
@Entity('ai_memories')
export class AiMemory {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ default: 'workspace' })
  category: 'short_term' | 'long_term' | 'workspace' | 'project' | 'style' | 'deployment';

  @Column()
  title: string;

  @Column({ type: 'text' })
  details: string;

  @CreateDateColumn()
  createdAt: Date;
}

// 11. AiKnowledge
@Entity('ai_knowledge')
export class AiKnowledge {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  source: string; // 'Project Files' | 'Documentation' | 'Databases' | 'Logs' | 'Git History'

  @Column({ default: 'file' })
  type: string; // 'code_file' | 'config_file' | 'database_schema' | 'documentation_text'

  @Column({ nullable: true })
  filepath: string;

  @Column({ type: 'text', nullable: true })
  metadata: string;

  @CreateDateColumn()
  createdAt: Date;
}

// 12. AiToolCall
@Entity('ai_tool_calls')
export class AiToolCall {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ nullable: true })
  messageId: string;

  @Column()
  tool: string;

  @Column({ type: 'text', nullable: true })
  command: string;

  @Column({ type: 'text', nullable: true })
  arguments: string;

  @Column({ type: 'text', nullable: true })
  output: string;

  @Column({ default: 'success' })
  status: string; // 'pending' | 'running' | 'success' | 'failed'

  @CreateDateColumn()
  createdAt: Date;
}

// 13. AiModel
@Entity('ai_models')
export class AiModel {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @Column()
  provider: string; // 'Gemini' | 'Claude' | 'OpenAI'

  @Column({ default: 1048576 })
  contextLength: number;

  @Column({ default: 8192 })
  maxOutputTokens: number;

  @Column({ default: true })
  isActive: boolean;

  @CreateDateColumn()
  createdAt: Date;
}

// 14. AiWorkspace
@Entity('ai_workspaces')
export class AiWorkspace {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  path: string;

  @Column()
  name: string;

  @Column({ default: 'active' })
  status: string;

  @Column({ nullable: true })
  lastIndexed: Date;

  @CreateDateColumn()
  createdAt: Date;
}

// 15. AiProject
@Entity('ai_projects')
export class AiProject {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @Column()
  type: string; // 'web-php' | 'web-nodejs' | 'web-python' | 'web-go' | 'web-java'

  @Column({ default: 'stopped' })
  status: string;

  @Column()
  workspacePath: string;

  @CreateDateColumn()
  createdAt: Date;
}

// 16. AiContext
@Entity('ai_contexts')
export class AiContext {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  conversationId: string;

  @Column({ default: 0 })
  tokens: number;

  @Column({ type: 'text', nullable: true })
  cachedKeys: string;

  @Column({ type: 'text', nullable: true })
  data: string;

  @CreateDateColumn()
  createdAt: Date;
}

// 17. AiSchedule
@Entity('ai_schedules')
export class AiSchedule {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @Column()
  cron: string;

  @Column()
  taskTitle: string;

  @Column({ default: true })
  isActive: boolean;

  @CreateDateColumn()
  createdAt: Date;
}

// 18. AiTemplate
@Entity('ai_templates')
export class AiTemplate {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @Column()
  type: string;

  @Column({ type: 'text', nullable: true })
  config: string;

  @CreateDateColumn()
  createdAt: Date;
}

// 19. AiEmbedding
@Entity('ai_embeddings')
export class AiEmbedding {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  knowledgeId: string;

  @Column({ type: 'text' })
  vectorHash: string;

  @CreateDateColumn()
  createdAt: Date;
}

// 20. AiVectorChunk
@Entity('ai_vector_chunks')
export class AiVectorChunk {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  embeddingId: string;

  @Column({ type: 'text' })
  chunkContent: string;

  @Column({ type: 'text', nullable: true })
  metadata: string;

  @CreateDateColumn()
  createdAt: Date;
}
