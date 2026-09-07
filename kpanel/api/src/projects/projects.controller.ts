import { Controller, Get, Post, Patch, Delete, Param, Body, UseGuards } from '@nestjs/common';
import { ProjectsService } from './projects.service';
import { JwtAuthGuard }    from '../auth/jwt-auth.guard';

@UseGuards(JwtAuthGuard)
@Controller('projects')
export class ProjectsController {
  constructor(private readonly svc: ProjectsService) {}
  @Get()          findAll()                        { return this.svc.findAll(); }
  @Get('summary') summary()                        { return this.svc.getSummary(); }
  @Get(':id')     findOne(@Param('id') id: string) { return this.svc.findOne(id); }
  @Post()         create(@Body() b: any)           { return this.svc.create(b); }
  @Patch(':id')   update(@Param('id') id: string, @Body() b: any) { return this.svc.update(id, b); }
  @Delete(':id')  remove(@Param('id') id: string)  { return this.svc.remove(id); }
}
