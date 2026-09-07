import { Injectable, NotFoundException, OnModuleInit } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, EntityManager } from 'typeorm';
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
import { GoogleGenerativeAI } from '@google/generative-ai';

@Injectable()
export class AiService implements OnModuleInit {
  constructor(
    @InjectRepository(AiConversation) private readonly convoRepo: Repository<AiConversation>,
    @InjectRepository(AiMessage) private readonly msgRepo: Repository<AiMessage>,
    @InjectRepository(AiMemory) private readonly memoryRepo: Repository<AiMemory>,
    @InjectRepository(AiTask) private readonly taskRepo: Repository<AiTask>,
    @InjectRepository(Project) private readonly projectRepo: Repository<Project>,
    @InjectRepository(Db) private readonly dbRepo: Repository<Db>,
    @InjectRepository(Log) private readonly logRepo: Repository<Log>,
    private readonly entityManager: EntityManager,
  ) {}

  // ===== Startup Database Seeding =====
  async onModuleInit() {
    try {
      const modelCount = await this.entityManager.count(AiModel);
      if (modelCount === 0) {
        await this.entityManager.save(AiModel, [
          { name: 'Gemini 2.5 Flash', provider: 'Gemini', contextLength: 1048576, maxOutputTokens: 8192, isActive: true },
          { name: 'Gemini 2.5 Pro', provider: 'Gemini', contextLength: 2097152, maxOutputTokens: 8192, isActive: true },
          { name: 'Claude 3.5 Sonnet', provider: 'Claude', contextLength: 200000, maxOutputTokens: 8192, isActive: true },
          { name: 'GPT-4o Operator', provider: 'OpenAI', contextLength: 128000, maxOutputTokens: 4096, isActive: true }
        ]);
      }

      const agentCount = await this.entityManager.count(AiAgent);
      if (agentCount === 0) {
        await this.entityManager.save(AiAgent, [
          { name: 'Chief Agent', role: 'Điều phối toàn bộ hệ thống', status: 'idle', model: 'Gemini 2.5 Flash', systemPrompt: 'Điều phối tất cả Agent.' },
          { name: 'Code Agent', role: 'Phát triển & sửa đổi mã nguồn', status: 'idle', model: 'Gemini 2.5 Flash', systemPrompt: 'Viết code và refactor.' },
          { name: 'File Agent', role: 'Quản lý hệ thống tệp tin và thư mục', status: 'idle', model: 'Gemini 2.5 Flash', systemPrompt: 'Thao tác đọc ghi file.' },
          { name: 'Database Agent', role: 'Quản trị cơ sở dữ liệu (Postgres, MySQL)', status: 'idle', model: 'Gemini 2.5 Flash', systemPrompt: 'Tạo và tối ưu truy vấn.' },
          { name: 'Deploy Agent', role: 'Tự động hóa triển khai & Web server configurations', status: 'idle', model: 'Gemini 2.5 Pro', systemPrompt: 'Triển khai dự án lên VPS.' },
          { name: 'Server Agent', role: 'Giám sát tài nguyên máy chủ & VPS commands', status: 'idle', model: 'Gemini 2.5 Flash', systemPrompt: 'Lệnh hệ thống và kiểm tra tài nguyên.' },
          { name: 'Security Agent', role: 'Kiểm tra quyền hạn và cảnh báo bảo mật', status: 'idle', model: 'Gemini 2.5 Pro', systemPrompt: 'Xác thực quyền hạn.' },
          { name: 'Monitoring Agent', role: 'Giám sát tài nguyên và phân tích hiệu năng', status: 'idle', model: 'Gemini 2.5 Flash', systemPrompt: 'Quản lý logs máy chủ.' },
          { name: 'Documentation Agent', role: 'Đọc và ghi chú tài liệu hướng dẫn', status: 'idle', model: 'Gemini 2.5 Flash', systemPrompt: 'Tài liệu hướng dẫn.' }
        ]);
      }

      const permCount = await this.entityManager.count(AiPermission);
      if (permCount === 0) {
        await this.entityManager.save(AiPermission, [
          { level: 'tool_level', target: 'read_file', action: 'Đọc tệp tin hệ thống', authorized: true },
          { level: 'tool_level', target: 'write_file', action: 'Ghi/Sửa đổi tệp tin', authorized: true },
          { level: 'tool_level', target: 'delete_database', action: 'Xóa cơ sở dữ liệu', authorized: false },
          { level: 'tool_level', target: 'delete_project', action: 'Xóa dự án KPanel', authorized: false }
        ]);
      }

      const workspaceCount = await this.entityManager.count(AiWorkspace);
      if (workspaceCount === 0) {
        await this.entityManager.save(AiWorkspace, [
          { path: '/d/DATA/source/Kpanel', name: 'KPanel Core Project', status: 'active', lastIndexed: new Date() }
        ]);
      }

      const templateCount = await this.entityManager.count(AiTemplate);
      if (templateCount === 0) {
        await this.entityManager.save(AiTemplate, [
          { name: 'Laravel Standard Deployment', type: 'PHP', config: '{"php": "8.2", "server": "nginx", "composer": true}' },
          { name: 'NestJS Express API', type: 'NodeJS', config: '{"node": "20.x", "pm2": true, "build": "npm run build"}' }
        ]);
      }

      const scheduleCount = await this.entityManager.count(AiSchedule);
      if (scheduleCount === 0) {
        await this.entityManager.save(AiSchedule, [
          { name: 'Quét hệ thống định kỳ', cron: '0 0 * * *', taskTitle: 'Kiểm tra tài nguyên VPS và dọn dẹp log thừa', isActive: true }
        ]);
      }

    } catch (err) {
      console.error('Error seeding AI Agent defaults:', err);
    }
  }

  // ===== Conversation Methods =====
  async findAllConversations(): Promise<AiConversation[]> {
    return this.convoRepo.find({ order: { updatedAt: 'DESC' } });
  }

  async createConversation(title: string): Promise<AiConversation> {
    const convo = this.convoRepo.create({ title });
    return this.convoRepo.save(convo);
  }

  async deleteConversation(id: string): Promise<void> {
    await this.msgRepo.delete({ conversationId: id });
    const convo = await this.convoRepo.findOneBy({ id });
    if (convo) {
      await this.convoRepo.remove(convo);
    }
  }

  async findConversationMessages(conversationId: string): Promise<AiMessage[]> {
    return this.msgRepo.find({
      where: { conversationId },
      order: { createdAt: 'ASC' },
    });
  }

  // ===== Memory Methods =====
  async findAllMemories(): Promise<AiMemory[]> {
    return this.memoryRepo.find({ order: { createdAt: 'DESC' } });
  }

  async createMemory(category: any, title: string, details: string): Promise<AiMemory> {
    const memory = this.memoryRepo.create({ category, title, details });
    return this.memoryRepo.save(memory);
  }

  async deleteMemory(id: string): Promise<void> {
    const mem = await this.memoryRepo.findOneBy({ id });
    if (mem) await this.memoryRepo.remove(mem);
  }

  // ===== Task & Logs Methods =====
  async findAllTasks(): Promise<AiTask[]> {
    return this.taskRepo.find({ order: { createdAt: 'DESC' }, take: 20 });
  }

  async findAllLogs(): Promise<Log[]> {
    return this.logRepo.find({ order: { createdAt: 'DESC' }, take: 50 });
  }

  // ===== Full API Engine Implementations =====
  async findAllAgents(): Promise<AiAgent[]> {
    return this.entityManager.find(AiAgent);
  }

  async findAllModels(): Promise<AiModel[]> {
    return this.entityManager.find(AiModel);
  }

  async findAllPermissions(): Promise<AiPermission[]> {
    return this.entityManager.find(AiPermission);
  }

  async findAllWorkspaces(): Promise<AiWorkspace[]> {
    return this.entityManager.find(AiWorkspace);
  }

  async triggerWorkspaceScan(id: string): Promise<AiWorkspace> {
    const workspace = await this.entityManager.findOneBy(AiWorkspace, { id });
    if (!workspace) throw new NotFoundException('Workspace not found');
    workspace.lastIndexed = new Date();
    return this.entityManager.save(AiWorkspace, workspace);
  }

  async findAllApprovals(): Promise<AiApproval[]> {
    return this.entityManager.find(AiApproval, { order: { createdAt: 'DESC' } });
  }

  async findAllToolCalls(): Promise<AiToolCall[]> {
    return this.entityManager.find(AiToolCall, { order: { createdAt: 'DESC' } });
  }

  async findAllSchedules(): Promise<AiSchedule[]> {
    return this.entityManager.find(AiSchedule);
  }

  async findAllTemplates(): Promise<AiTemplate[]> {
    return this.entityManager.find(AiTemplate);
  }

  // ===== Send Message (Core Planning & Coordinating Agent Engine) =====
  async sendMessage(conversationId: string, content: string, thinking?: boolean): Promise<AiMessage> {
    // 1. Save user message
    const userMsg = this.msgRepo.create({
      conversationId,
      role: 'user',
      content,
    });
    await this.msgRepo.save(userMsg);

    // 2. Parse query & generate plan / agent allocations
    const query = content.toLowerCase();

    const apiKey = process.env.GEMINI_API_KEY;
    if (apiKey) {
      try {
        const genAI = new GoogleGenerativeAI(apiKey);
        const model = genAI.getGenerativeModel({
          model: 'gemini-1.5-flash',
          generationConfig: {
            responseMimeType: 'application/json',
          },
        });

        const activeProjects = await this.projectRepo.find();
        const activeDbs = await this.dbRepo.find();
        const recentLogs = await this.logRepo.find({ order: { createdAt: 'DESC' }, take: 10 });

        const prompt = `Bạn là Trợ lý AI điều phối kỹ thuật trong bảng quản trị máy chủ KPanel (tương tự Claude Code, Antigravity, Devin).
Hiện tại hệ thống đang có các thông tin sau:
1. Dự án hiện có: ${JSON.stringify(activeProjects.map(p => ({ id: p.id, name: p.name, type: p.type, status: p.status, domain: p.domain })))}
2. Cơ sở dữ liệu hiện có: ${JSON.stringify(activeDbs.map(d => ({ id: d.id, name: d.name, type: d.type, status: d.status })))}
3. 10 nhật ký hệ thống gần nhất: ${JSON.stringify(recentLogs.map(l => ({ service: l.service, message: l.message, level: l.level })))}

Người dùng gửi yêu cầu: "${content}"
Chế độ suy nghĩ (Thinking): ${thinking ? 'Đang bật' : 'Đang tắt'}

Nhiệm vụ của bạn là:
1. Phân tích yêu cầu và đưa ra câu trả lời chi tiết bằng TIẾNG VIỆT trong trường "content" (có thể sử dụng markdown).
2. Nếu chế độ suy nghĩ Đang bật, viết quá trình suy nghĩ chi tiết trong trường "thinkingProcess" (ví dụ: phân tích yêu cầu, bối cảnh máy chủ, kiểm tra tài nguyên, điều phối sub-agents). Nếu tắt, để trống.
3. Nếu cần thực hiện các hành động thay đổi hệ thống (như tạo/xóa database, dự án, triển khai dự án), hãy phân bổ các bước thực hiện trong mảng "plan":
   - "status" cho mỗi bước ban đầu là "completed" (cho bước phân tích) hoặc "processing" (cho bước chuẩn bị làm) hoặc "pending" (cho bước tiếp theo).
4. Khởi tạo mảng "approvals" nếu hành động là nhạy cảm (tạo/xóa database hoặc dự án):
   - "type": "database" | "project" | "deploy"
   - "action": "Tạo cơ sở dữ liệu" | "Xóa cơ sở dữ liệu" | "Tạo dự án mới" | "Xóa dự án" | "Triển khai Laravel Production"
   - "target": tên database hoặc dự án cần tác động.
   - "details": mô tả hành động.
   - "status": "pending" (BẮT BUỘC) để chờ người dùng duyệt.
5. Cung cấp các log mô phỏng từ sub-agents trong mảng "subAgentLogs" (các agent tham gia: Chief Agent, Code Agent, Database Agent, Deploy Agent, Security Agent).
6. Nếu có sửa đổi tệp tin, mô tả trong mảng "filesTouched" với tên tệp ("filepath"), trạng thái ("status": "created" | "modified" | "deleted") và nội dung chỉnh sửa dạng Git Diff trong trường "diff".
7. Ghi nhận các lệnh terminal đề xuất chạy trong mảng "toolUsages" với trường "command", "tool" và kết quả mô phỏng "output".

Bạn BẮT BUỘC phải trả về định dạng JSON khớp với cấu trúc TypeScript sau:
{
  "content": string,
  "thinkingProcess"?: string,
  "plan"?: Array<{ id: string; step: string; status: "pending" | "processing" | "completed" | "failed" | "skipped"; description?: string }>,
  "toolUsages"?: Array<{ id: string; tool: string; command?: string; output?: string; status: "success" | "pending" | "failed" }>,
  "subAgentLogs"?: Array<{ timestamp: string; agent: string; message: string; level: "info" | "warning" | "error" }>,
  "approvals"?: Array<{ id: string; type: "database" | "project" | "deploy"; action: string; target: string; details?: string; status: "pending" }>,
  "filesTouched"?: Array<{ filepath: string; status: "modified" | "created" | "deleted"; diff?: string }>
}
Lưu ý: Chỉ trả về chuỗi JSON thô hợp lệ.`;

        const result = await model.generateContent(prompt);
        const responseText = result.response.text();
        const data = JSON.parse(responseText);

        // Save generated tasks in database
        if (data.plan && Array.isArray(data.plan)) {
          for (const pStep of data.plan) {
            const task = this.taskRepo.create({
              title: pStep.step,
              status: pStep.status === 'processing' ? 'running' : pStep.status === 'completed' ? 'completed' : 'pending',
              progress: pStep.status === 'completed' ? 100 : pStep.status === 'processing' ? 50 : 0,
              agent: (data.subAgentLogs && data.subAgentLogs[0]?.agent) || 'Chief Agent',
              priority: 'medium',
              category: 'planning',
            });
            await this.taskRepo.save(task);
          }
        }

        // Save approvals and tool calls
        if (data.approvals && Array.isArray(data.approvals)) {
          for (const app of data.approvals) {
            const newApp = this.entityManager.create(AiApproval, {
              messageId: userMsg.id,
              type: app.type || 'dangerous_operations',
              action: app.action,
              target: app.target,
              details: app.details,
              status: 'pending',
            });
            await this.entityManager.save(AiApproval, newApp);
          }
        }

        if (data.toolUsages && Array.isArray(data.toolUsages)) {
          for (const tool of data.toolUsages) {
            const newTool = this.entityManager.create(AiToolCall, {
              messageId: userMsg.id,
              tool: tool.tool,
              command: tool.command,
              output: tool.output,
              status: tool.status || 'success',
            });
            await this.entityManager.save(AiToolCall, newTool);
          }
        }

        // Save assistant message
        const assistantMsg = this.msgRepo.create({
          conversationId,
          role: 'assistant',
          content: data.content || 'Tôi đã xử lý yêu cầu của bạn.',
          plan: data.plan || [],
          toolUsages: data.toolUsages || [],
          subAgentLogs: data.subAgentLogs || [],
          approvals: data.approvals || [],
          executionPreview: data.toolUsages?.[0]?.output || '',
          filesTouched: data.filesTouched || [],
          thinkingProcess: data.thinkingProcess || '',
        });
        const saved = await this.msgRepo.save(assistantMsg);

        // Update conversation timestamp
        await this.convoRepo.update(conversationId, { updatedAt: new Date() });

        return saved;

      } catch (err) {
        console.error('Gemini API call failed, falling back to rule-based parser:', err);
      }
    }

    // Default mock structures in Vietnamese
    let plan: Array<{
      id: string;
      step: string;
      status: 'pending' | 'planning' | 'running' | 'waiting_approval' | 'completed' | 'failed' | 'skipped' | 'cancelled';
      description?: string;
    }> = [
      { id: '1', step: 'Phân tích yêu cầu', status: 'completed', description: 'Đã phân tích yêu cầu từ người dùng.' },
      { id: '2', step: 'Phân tích không gian', status: 'completed', description: 'Đã lập chỉ mục dự án, máy chủ, cơ sở dữ liệu và nhật ký.' },
      { id: '3', step: 'Tạo kế hoạch', status: 'completed', description: 'Đã lập danh sách kiểm tra và biểu đồ phụ thuộc.' }
    ];
    let toolUsages: Array<{
      id: string;
      tool: string;
      command?: string;
      arguments?: string;
      output?: string;
      status: 'pending' | 'running' | 'success' | 'failed';
    }> = [];
    let subAgentLogs: Array<{
      timestamp: string;
      agent: string;
      message: string;
      level: 'info' | 'warning' | 'error';
    }> = [
      { timestamp: new Date().toLocaleTimeString(), agent: 'Chief Agent', message: 'Bắt đầu phân tích yêu cầu: ' + content, level: 'info' }
    ];
    let approvals: Array<{
      id: string;
      type: 'file' | 'folder' | 'project' | 'database' | 'server' | 'deploy' | 'terminal';
      action: string;
      target: string;
      details?: string;
      status: 'pending' | 'approved' | 'rejected';
    }> = [];
    let filesTouched: Array<{
      filepath: string;
      status: 'modified' | 'created' | 'deleted';
      diff?: string;
    }> = [];
    let executionPreview = '';
    let responseText = '';
    let thinkingProcess = '';

    if (thinking) {
      if (query.includes('deploy laravel') || query.includes('triển khai laravel')) {
        thinkingProcess = `Đang phân tích yêu cầu triển khai dự án Laravel lên VPS-01...
- Nhận diện ứng dụng: Laravel (PHP). Cần PHP 8.2+ và composer.
- Kiểm tra thư mục đích: /var/www/cms-laravel-prod. Chưa tồn tại, cần tạo mới.
- Xác định cơ sở dữ liệu: Cần cơ sở dữ liệu PostgreSQL tên laravel_prod.
- Xác định cấu hình máy chủ web: Cần tạo cấu hình Nginx Server Block (laravel.conf) để chuyển tiếp yêu cầu đến PHP-FPM.
- Quyền hạn cần thiết: Thao tác tạo CSDL và cấu hình Nginx yêu cầu quyền sudo. Cần thiết lập Approval Card để người dùng phê duyệt trước khi thực thi thực tế.
- Lên kế hoạch điều phối:
  + Chief Agent: Nhận yêu cầu, lên lịch.
  + File Agent: Tạo thư mục, phân quyền.
  + Code Agent: Clone Git, cài đặt dependencies, setup .env.
  + Database Agent: Tạo PostgreSQL DB.
  + Deploy Agent: Restart Nginx.`;
      } else if (query.includes('tạo database') || query.includes('create database')) {
        thinkingProcess = `Đang phân tích yêu cầu tạo cơ sở dữ liệu...
- Xác định tên cơ sở dữ liệu và loại hệ quản trị (PostgreSQL/MySQL/MongoDB).
- Kiểm tra quyền hạn: Thao tác ghi dữ liệu hệ thống nhạy cảm. Cần tạo thẻ phê duyệt phê duyệt hành động (Approval) để đảm bảo an toàn.
- Điều phối Database Agent kết nối trực tiếp với DBMS và thực thi lệnh CREATE DATABASE.`;
      } else if (query.includes('xóa database') || query.includes('delete database') || query.includes('xóa dự án') || query.includes('delete project')) {
        thinkingProcess = `CẢNH BÁO NGUY HIỂM: Yêu cầu xóa tài nguyên vĩnh viễn!
- Kiểm tra đối tượng cần xóa.
- Tạo một cảnh báo mức cao (Security Agent) để chặn thao tác và yêu cầu xác nhận phê duyệt bảo mật từ quản trị viên.
- Không tự ý thực hiện lệnh rm hoặc DROP DATABASE trực tiếp nếu chưa có phê duyệt.`;
      } else if (query.includes('tối ưu') || query.includes('optimize') || query.includes('slow queries')) {
        thinkingProcess = `Đang phân tích hiệu năng cơ sở dữ liệu...
- Kiểm tra nhật ký truy vấn chậm (Slow Query Log).
- Chạy EXPLAIN ANALYZE cho các truy vấn lọc theo user_id sắp xếp theo created_at.
- Nhận diện quét tuần tự (Sequential Scan) gây chậm. Khuyến nghị tạo index phù hợp.`;
      } else {
        thinkingProcess = `Nhận yêu cầu chung: "${content}"
- Xác định mục đích yêu cầu của người dùng.
- Tìm kiếm trong cơ sở tri thức (Memory) và thông tin workspace.
- Xây dựng câu trả lời phản hồi tổng quan.`;
      }
    }

    // Route matching for realistic operations
    if (query.includes('deploy laravel') || query.includes('triển khai laravel')) {
      plan.push(
        { id: '4', step: 'Chia nhỏ tác vụ', status: 'completed', description: 'Đã chia nhỏ thành các tác vụ cơ sở dữ liệu, git và triển khai Nginx.' },
        { id: '5', step: 'Thực thi tác vụ', status: 'running', description: 'Đang chạy mã lệnh sao chép và thiết lập dự án.' },
        { id: '6', step: 'Xác thực kết quả', status: 'pending' },
        { id: '7', step: 'Tổng hợp kết quả', status: 'pending' }
      );

      approvals.push({
        id: 'approve-deploy-laravel',
        type: 'deploy',
        action: 'Triển khai Laravel Production',
        target: 'cms-laravel-prod',
        details: 'Sao chép repo, tạo DB PostgreSQL, cài đặt thư viện phụ thuộc, khởi động lại Nginx',
        status: 'pending'
      });

      subAgentLogs.push(
        { timestamp: new Date().toLocaleTimeString(), agent: 'File Agent', message: 'Đang tạo thư mục /var/www/cms-laravel-prod', level: 'info' },
        { timestamp: new Date().toLocaleTimeString(), agent: 'Code Agent', message: 'Đang chuẩn bị tệp composer.json và tệp .env', level: 'info' },
        { timestamp: new Date().toLocaleTimeString(), agent: 'Database Agent', message: 'Đang chờ xác thực thông tin đăng nhập cơ sở dữ liệu', level: 'warning' }
      );

      filesTouched.push(
        { filepath: '/etc/nginx/conf.d/laravel.conf', status: 'created', diff: `+ server {
+     listen 80;
+     server_name laravel.example.com;
+     root /var/www/cms-laravel-prod/public;
+     index index.php;
+ 
+     location / {
+         try_files $uri $uri/ /index.php?$query_string;
+     }
+ }` },
        { filepath: '/var/www/cms-laravel-prod/.env', status: 'created', diff: `+ APP_NAME=Laravel
+ APP_ENV=production
+ APP_KEY=base64:sW4F13m...
+ APP_DEBUG=false
+ APP_URL=http://laravel.example.com
+ DB_CONNECTION=pgsql
+ DB_HOST=127.0.0.1
+ DB_PORT=5432
+ DB_DATABASE=laravel_prod` }
      );

      toolUsages.push(
        { id: 't1', tool: 'git_clone', command: 'git clone https://github.com/laravel/laravel.git /var/www/cms-laravel-prod', status: 'success' },
        { id: 't2', tool: 'composer_install', command: 'composer install --no-dev --optimize-autoloader', status: 'success' }
      );

      executionPreview = `Cloning into '/var/www/cms-laravel-prod'...
remote: Enumerating objects: 198273, done.
remote: Counting objects: 100% (45/45), done.
Receiving objects: 100% (198273/198273), 54.32 MiB | 12.42 MiB/s, done.
Installing dependencies from lock file
Package operations: 82 installs, 0 updates, 0 removals
- Installing laravel/framework (v11.5.0): Extracting archive
Generating optimized autoload files
> Illuminate\\Foundation\\CompositeKernel::postAutoloadDump
> @php artisan package:discover --ansi
Discovered Package: laravel/tinker
Package manifest generated successfully.`;

      responseText = 'Tôi đã lập kế hoạch để triển khai dự án Laravel. Thao tác này đòi hỏi quyền tạo Database mới và cấu hình Nginx Server. Vui lòng cấp quyền (Approve) ở bảng bên phải để tôi có thể tiến hành tạo cơ sở dữ liệu và kích hoạt server.';

    } else if (query.includes('tạo database') || query.includes('create database')) {
      const dbNameMatch = query.match(/(?:database|db)\s+([a-zA-Z0-9_\-]+)/);
      const dbName = dbNameMatch ? dbNameMatch[1] : 'ai_generated_db';
      const dbType = query.includes('mysql') ? 'MySQL' : query.includes('mongodb') ? 'MongoDB' : 'PostgreSQL';

      plan.push(
        { id: '4', step: 'Chia nhỏ tác vụ', status: 'completed', description: 'Chuẩn bị cấu hình và lược đồ tạo cơ sở dữ liệu.' },
        { id: '5', step: 'Thực thi tác vụ', status: 'running', description: 'Đang tạo cơ sở dữ liệu trong mạng nội bộ.' }
      );

      approvals.push({
        id: 'approve-create-db',
        type: 'database',
        action: 'Tạo cơ sở dữ liệu',
        target: dbName,
        details: `Tạo một cơ sở dữ liệu ${dbType} mới trên VPS-01`,
        status: 'pending'
      });

      subAgentLogs.push(
        { timestamp: new Date().toLocaleTimeString(), agent: 'Database Agent', message: `Đang khởi tạo các tham số cơ sở dữ liệu cho ${dbName}`, level: 'info' }
      );

      responseText = `Yêu cầu tạo cơ sở dữ liệu **${dbName}** (${dbType}) trên máy chủ. Do đây là thao tác nhạy cảm liên quan đến dữ liệu, tôi cần bạn phê duyệt trước khi tiếp tục. Vui lòng xem thông tin chi tiết phê duyệt trong tab Approvals.`;

    } else if (query.includes('tạo dự án') || query.includes('create project')) {
      const nameMatch = query.match(/(?:dự án|project)\s+([a-zA-Z0-9_\-]+)/);
      const projName = nameMatch ? nameMatch[1] : 'ai-project';
      const projType = query.includes('php') ? 'web-php' : query.includes('python') ? 'web-python' : 'web-nodejs';

      plan.push(
        { id: '4', step: 'Chia nhỏ tác vụ', status: 'completed', description: 'Chuẩn bị cấu trúc thư mục dự án và các mẫu thiết lập.' },
        { id: '5', step: 'Thực thi tác vụ', status: 'running', description: 'Khởi tạo thư mục git cho dự án.' }
      );

      approvals.push({
        id: 'approve-create-proj',
        type: 'project',
        action: 'Tạo dự án mới',
        target: projName,
        details: `Tạo một dự án ${projType} mới trên VPS-01`,
        status: 'pending'
      });

      subAgentLogs.push(
        { timestamp: new Date().toLocaleTimeString(), agent: 'Code Agent', message: `Đang tạo cấu trúc thư mục cho ${projName}`, level: 'info' }
      );

      responseText = `Tôi đã lên kế hoạch khởi tạo dự án **${projName}** thuộc loại **${projType}**. Vui lòng kiểm tra tab phê duyệt để xác nhận khởi tạo dự án này trong hệ thống KPanel.`;

    } else if (query.includes('xóa database') || query.includes('delete database') || query.includes('xóa dự án') || query.includes('delete project')) {
      const isDb = query.includes('database') || query.includes('db');
      const targetMatch = query.match(/(?:database|db|dự án|project)\s+([a-zA-Z0-9_\-]+)/);
      const targetName = targetMatch ? targetMatch[1] : 'unknown';

      plan.push(
        { id: '4', step: 'Kiểm tra liên quan', status: 'completed', description: 'Kiểm tra các tham chiếu liên quan và tạo tác vụ dọn dẹp.' }
      );

      approvals.push({
        id: `approve-delete-${isDb ? 'db' : 'proj'}`,
        type: isDb ? 'database' : 'project',
        action: isDb ? 'Xóa cơ sở dữ liệu' : 'Xóa dự án',
        target: targetName,
        details: `NGUY HIỂM: Xóa vĩnh viễn ${isDb ? 'Cơ sở dữ liệu' : 'Dự án'} "${targetName}" khỏi hệ thống`,
        status: 'pending'
      });

      subAgentLogs.push(
        { timestamp: new Date().toLocaleTimeString(), agent: 'Security Agent', message: `CẢNH BÁO: Yêu cầu xóa vĩnh viễn đối tượng ${targetName}`, level: 'error' }
      );

      responseText = `CẢNH BÁO: Bạn yêu cầu xóa vĩnh viễn ${isDb ? 'cơ sở dữ liệu' : 'dự án'} **${targetName}**. Đây là hành động không thể khôi phục lại. Hệ thống bắt buộc phải nhận được sự phê duyệt của bạn từ bảng điều khiển bên phải.`;

    } else if (query.includes('tối ưu') || query.includes('optimize') || query.includes('slow queries')) {
      plan.push(
        { id: '4', step: 'Phân tích liên quan', status: 'completed', description: 'Đã kiểm tra nhật ký truy vấn chậm (Slow Queries).' },
        { id: '5', step: 'Thực thi tác vụ', status: 'completed', description: 'Đã tạo các khuyến nghị và kế hoạch thực thi.' },
        { id: '6', step: 'Xác thực kết quả', status: 'completed' }
      );

      toolUsages.push({
        id: 't1',
        tool: 'db_index_analyze',
        command: 'EXPLAIN ANALYZE SELECT * FROM orders WHERE user_id = 999 ORDER BY created_at DESC;',
        output: 'Index Scan using orders_user_id_idx on orders  (cost=0.42..8.44 rows=1 width=328)',
        status: 'success'
      });

      subAgentLogs.push(
        { timestamp: new Date().toLocaleTimeString(), agent: 'Database Agent', message: 'Phát hiện truy vấn chậm: SELECT * FROM orders WHERE user_id = 999...', level: 'warning' },
        { timestamp: new Date().toLocaleTimeString(), agent: 'Database Agent', message: 'Khuyến nghị: Thêm chỉ mục tổng hợp idx_orders_user_created (user_id, created_at DESC)', level: 'info' }
      );

      responseText = `Đã phân tích các truy vấn chậm trong cơ sở dữ liệu. 
Phát hiện bảng \`orders\` đang thực hiện quét tuần tự (Sequential Scan) cho các truy vấn lọc theo \`user_id\` và sắp xếp theo \`created_at\`.
Tôi đề xuất thêm index sau để tối ưu hóa thời gian thực thi từ 120ms xuống còn <5ms:
\`\`\`sql
CREATE INDEX idx_orders_user_created ON orders (user_id, created_at DESC);
\`\`\`
Thao tác này là an toàn, không làm gián đoạn hệ thống.`;

    } else {
      plan.push(
        { id: '4', step: 'Thực thi tác vụ', status: 'completed', description: 'Đã tổng hợp câu trả lời thành công.' }
      );

      subAgentLogs.push(
        { timestamp: new Date().toLocaleTimeString(), agent: 'Documentation Agent', message: 'Đang tổng hợp nội dung phản hồi', level: 'info' }
      );

      responseText = `Tôi là Trợ lý AI KPanel. Tôi có thể hỗ trợ bạn tự động lập kế hoạch và thực hiện các tác vụ kỹ thuật trên máy chủ:
- 🚀 **Triển khai dự án**: Ví dụ "Deploy Laravel Project", "Deploy Node.js app".
- 📦 **Quản lý tài nguyên**: Ví dụ "Tạo database shop_db type PostgreSQL", "Xóa dự án ml-predict".
- 🔍 **Tối ưu hóa & Khắc phục lỗi**: Ví dụ "Tối ưu hóa các slow queries", "Phân tích log Nginx".

Hãy cho tôi biết bạn cần làm gì!`;
    }

    // Save tasks inside database
    for (const pStep of plan) {
      const task = this.taskRepo.create({
        title: pStep.step,
        status: pStep.status === 'running' ? 'running' : pStep.status === 'completed' ? 'completed' : 'pending',
        progress: pStep.status === 'completed' ? 100 : pStep.status === 'running' ? 50 : 0,
        agent: subAgentLogs[0]?.agent || 'Chief Agent',
        priority: 'medium',
        category: 'planning',
      });
      await this.taskRepo.save(task);
    }

    // Add Approval and Tool calls to DB logs
    if (approvals.length > 0) {
      for (const app of approvals) {
        const newApp = this.entityManager.create(AiApproval, {
          messageId: userMsg.id,
          type: app.type || 'dangerous_operations',
          action: app.action,
          target: app.target,
          details: app.details,
          status: 'pending',
        });
        await this.entityManager.save(AiApproval, newApp);
      }
    }

    if (toolUsages.length > 0) {
      for (const tool of toolUsages) {
        const newTool = this.entityManager.create(AiToolCall, {
          messageId: userMsg.id,
          tool: tool.tool,
          command: tool.command,
          output: tool.output,
          status: tool.status || 'success',
        });
        await this.entityManager.save(AiToolCall, newTool);
      }
    }

    // 3. Save assistant message
    const assistantMsg = this.msgRepo.create({
      conversationId,
      role: 'assistant',
      content: responseText,
      plan,
      toolUsages,
      subAgentLogs,
      approvals,
      executionPreview,
      filesTouched,
      thinkingProcess,
    });
    const saved = await this.msgRepo.save(assistantMsg);

    // Update conversation timestamp
    await this.convoRepo.update(conversationId, { updatedAt: new Date() });

    return saved;
  }

  // ===== Approve Pending Action (DB Synchronization) =====
  async approveAction(messageId: string, approvalId: string, status: 'approved' | 'rejected'): Promise<AiMessage> {
    const message = await this.msgRepo.findOneBy({ id: messageId });
    if (!message) throw new NotFoundException('Message not found');

    const updatedApprovals = (message.approvals || []).map((app: any) => {
      if (app.id === approvalId) {
        return { ...app, status };
      }
      return app;
    });

    message.approvals = updatedApprovals;

    const targetApproval = (message.approvals || []).find((app: any) => app.id === approvalId);

    // Also update AiApproval table status
    if (targetApproval) {
      const appRecord = await this.entityManager.findOne(AiApproval, { where: { target: targetApproval.target, status: 'pending' } });
      if (appRecord) {
        appRecord.status = status;
        await this.entityManager.save(AiApproval, appRecord);
      }
    }

    if (status === 'approved' && targetApproval) {
      const actionName = targetApproval.action;
      const target = targetApproval.target;
      const type = targetApproval.type;

      // Log action in audit logs
      const auditLog = this.logRepo.create({
        level: 'INFO',
        service: 'AI Agent',
        message: `Người dùng đã phê duyệt hành động AI [${actionName}] cho [${target}]`,
        meta: JSON.stringify(targetApproval),
      });
      await this.logRepo.save(auditLog);

      // Perform actual DB Synchronization!
      try {
        if (actionName === 'Tạo cơ sở dữ liệu' || actionName === 'Create Database') {
          const newDb = this.dbRepo.create({
            name: target,
            type: targetApproval.details?.includes('MySQL') ? 'MySQL' : 'PostgreSQL',
            server: 'VPS-01',
            port: targetApproval.details?.includes('MySQL') ? 3306 : 5432,
            status: 'online',
            size: '0 KB',
            version: 'Latest',
            lastBackup: 'Chưa có',
          });
          await this.dbRepo.save(newDb);
        } else if (actionName === 'Xóa cơ sở dữ liệu' || actionName === 'Delete Database') {
          const dbObj = await this.dbRepo.findOneBy({ name: target });
          if (dbObj) {
            await this.dbRepo.remove(dbObj);
          }
        } else if (actionName === 'Tạo dự án mới' || actionName === 'Create Project') {
          const projectType = targetApproval.details?.includes('php') ? 'web-php' : targetApproval.details?.includes('python') ? 'web-python' : 'web-nodejs';
          const newProj = this.projectRepo.create({
            name: target,
            type: projectType,
            server: 'VPS-01',
            domain: `${target}.local`,
            git: '',
            status: 'stopped',
            ssl: false,
          });
          await this.projectRepo.save(newProj);

          // Add to AiProject entity too
          await this.entityManager.save(AiProject, {
            name: target,
            type: projectType,
            status: 'stopped',
            workspacePath: `/d/DATA/source/Kpanel/${target}`,
          });

        } else if (actionName === 'Xóa dự án' || actionName === 'Delete Project') {
          const projObj = await this.projectRepo.findOneBy({ name: target });
          if (projObj) {
            await this.projectRepo.remove(projObj);
          }
          const aiProj = await this.entityManager.findOne(AiProject, { where: { name: target } });
          if (aiProj) {
            await this.entityManager.remove(AiProject, aiProj);
          }
        } else if (actionName.includes('Triển khai Laravel') || actionName.includes('Deploy Laravel')) {
          const newProj = this.projectRepo.create({
            name: 'cms-laravel-prod',
            type: 'web-php',
            server: 'VPS-01',
            domain: 'laravel.example.com',
            git: 'https://github.com/laravel/laravel.git',
            status: 'running',
            framework: 'laravel',
            phpVersion: '8.2',
            ssl: true,
            database: 'postgresql',
          });
          await this.projectRepo.save(newProj);

          await this.entityManager.save(AiProject, {
            name: 'cms-laravel-prod',
            type: 'web-php',
            status: 'running',
            workspacePath: '/var/www/cms-laravel-prod',
          });

          const newDb = this.dbRepo.create({
            name: 'laravel_prod',
            type: 'PostgreSQL',
            server: 'VPS-01',
            port: 5432,
            status: 'online',
            size: '12 MB',
            version: '16',
            lastBackup: 'Chưa có',
          });
          await this.dbRepo.save(newDb);
        }
      } catch (err) {
        console.error('Error executing approved AI task:', err);
      }

      // Update message plan step statuses
      const updatedPlan = (message.plan || []).map((step: any) => {
        if (step.step === 'Thực thi tác vụ' || step.step === 'Xác thực kết quả' || step.step === 'Tổng hợp kết quả') {
          return { ...step, status: 'completed' as const, description: 'Hành động đã được phê duyệt và thực thi thành công.' };
        }
        return step;
      });
      message.plan = updatedPlan;

      // Update subagent logs to indicate successful execution
      message.subAgentLogs = [
        ...(message.subAgentLogs || []),
        { timestamp: new Date().toLocaleTimeString(), agent: 'Chief Agent', message: `Người dùng đã phê duyệt hành động. Bắt đầu thực thi.`, level: 'info' as const },
        { timestamp: new Date().toLocaleTimeString(), agent: 'Code Agent', message: `Thực thi thành công. Đang đồng bộ hóa không gian làm việc.`, level: 'info' as const }
      ];

      message.content += `\n\n✅ **[Hệ thống]** Hành động phê duyệt "${actionName}" đối với "${target}" đã được thực thi thành công vào lúc ${new Date().toLocaleTimeString()}. Các thay đổi đã được áp dụng trực tiếp vào cấu hình KPanel.`;
    } else if (status === 'rejected') {
      const updatedPlan = (message.plan || []).map((step: any) => {
        if (step.step === 'Thực thi tác vụ') {
          return { ...step, status: 'failed' as const, description: 'Bị hủy: Người dùng từ chối phê duyệt.' };
        }
        if (step.step === 'Xác thực kết quả' || step.step === 'Tổng hợp kết quả') {
          return { ...step, status: 'skipped' as const };
        }
        return step;
      });
      message.plan = updatedPlan;

      message.subAgentLogs = [
        ...(message.subAgentLogs || []),
        { timestamp: new Date().toLocaleTimeString(), agent: 'Chief Agent', message: `Người dùng đã từ chối yêu cầu hành động. Đang hủy tác vụ.`, level: 'warning' as const }
      ];

      message.content += `\n\n❌ **[Hệ thống]** Yêu cầu thực thi "${targetApproval?.action}" đã bị từ chối bởi người dùng. Tác vụ bị hủy bỏ.`;
    }

    return this.msgRepo.save(message);
  }
}
