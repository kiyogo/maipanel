import { Controller, Get, Delete, Query, UseGuards } from '@nestjs/common';
import { LogsService }  from './logs.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@UseGuards(JwtAuthGuard)
@Controller('logs')
export class LogsController {
  constructor(private readonly svc: LogsService) {}

  @Get()
  findAll(@Query('limit') limit?: string) {
    return this.svc.findAll(limit ? parseInt(limit) : 100);
  }

  @Delete()
  clear() {
    return this.svc.clear();
  }
}
