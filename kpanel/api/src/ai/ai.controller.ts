import { Controller, Get, Post, Delete, Param, Body } from '@nestjs/common';
import { AiService } from './ai.service';

@Controller('ai')
export class AiController {
  constructor(private readonly aiService: AiService) {}

  // ===== Conversation Endpoints =====
  @Get('conversations')
  async getConversations() {
    return this.aiService.findAllConversations();
  }

  @Post('conversations')
  async createConversation(@Body('title') title: string) {
    return this.aiService.createConversation(title || 'Cuộc hội thoại mới');
  }

  @Delete('conversations/:id')
  async deleteConversation(@Param('id') id: string) {
    await this.aiService.deleteConversation(id);
    return { success: true };
  }

  @Get('conversations/:id/messages')
  async getMessages(@Param('id') id: string) {
    return this.aiService.findConversationMessages(id);
  }

  @Post('conversations/:id/messages')
  async sendMessage(
    @Param('id') id: string,
    @Body('content') content: string,
    @Body('thinking') thinking?: boolean,
  ) {
    return this.aiService.sendMessage(id, content, thinking);
  }

  // ===== Task Endpoints =====
  @Get('tasks')
  async getTasks() {
    return this.aiService.findAllTasks();
  }

  // ===== Agent Endpoints =====
  @Get('agents')
  async getAgents() {
    return this.aiService.findAllAgents();
  }

  // ===== Model Endpoints =====
  @Get('models')
  async getModels() {
    return this.aiService.findAllModels();
  }

  // ===== Permission Endpoints =====
  @Get('permissions')
  async getPermissions() {
    return this.aiService.findAllPermissions();
  }

  // ===== Approval Endpoints =====
  @Get('approvals')
  async getApprovals() {
    return this.aiService.findAllApprovals();
  }

  @Post('messages/:messageId/approve')
  async approveAction(
    @Param('messageId') messageId: string,
    @Body('approvalId') approvalId: string,
    @Body('status') status: 'approved' | 'rejected',
  ) {
    return this.aiService.approveAction(messageId, approvalId, status);
  }

  // ===== Tool Endpoints =====
  @Get('tools')
  async getTools() {
    return [
      { name: 'read_file', description: 'Đọc tệp tin trong workspace', requiresApproval: false },
      { name: 'write_file', description: 'Ghi/Sửa đổi nội dung tệp tin', requiresApproval: false },
      { name: 'create_project', description: 'Tạo dự án mới trên máy chủ', requiresApproval: true },
      { name: 'delete_project', description: 'Xóa vĩnh viễn dự án khỏi hệ thống', requiresApproval: true },
      { name: 'create_database', description: 'Tạo cơ sở dữ liệu mới', requiresApproval: true },
      { name: 'delete_database', description: 'Xóa vĩnh viễn cơ sở dữ liệu', requiresApproval: true },
      { name: 'deploy_project', description: 'Triển khai dự án production', requiresApproval: true },
      { name: 'restart_service', description: 'Khởi động lại các tiến trình hệ thống', requiresApproval: true }
    ];
  }

  // ===== Memory Endpoints =====
  @Get('memories')
  async getMemories() {
    return this.aiService.findAllMemories();
  }

  @Post('memories')
  async createMemory(
    @Body('category') category: string,
    @Body('title') title: string,
    @Body('details') details: string,
  ) {
    return this.aiService.createMemory(category, title, details);
  }

  @Delete('memories/:id')
  async deleteMemory(@Param('id') id: string) {
    await this.aiService.deleteMemory(id);
    return { success: true };
  }

  // ===== Workspace Endpoints =====
  @Get('workspaces')
  async getWorkspaces() {
    return this.aiService.findAllWorkspaces();
  }

  @Post('workspaces/:id/scan')
  async scanWorkspace(@Param('id') id: string) {
    return this.aiService.triggerWorkspaceScan(id);
  }

  // ===== Logs Endpoints =====
  @Get('logs')
  async getLogs() {
    return this.aiService.findAllLogs();
  }
}
