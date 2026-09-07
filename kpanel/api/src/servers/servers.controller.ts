import { Controller, Get, Post, Patch, Delete, Param, Body, UseGuards } from '@nestjs/common';
import { ServersService } from './servers.service';
import { JwtAuthGuard }   from '../auth/jwt-auth.guard';

@UseGuards(JwtAuthGuard)
@Controller('servers')
export class ServersController {
  constructor(private readonly svc: ServersService) {}

  @Get()                          findAll()                        { return this.svc.findAll(); }
  @Get('summary')                 summary()                        { return this.svc.getSummary(); }
  @Get(':id')                     findOne(@Param('id') id: string) { return this.svc.findOne(id); }
  @Post()                         create(@Body() b: any)           { return this.svc.create(b); }
  @Patch(':id')                   update(@Param('id') id: string, @Body() b: any) { return this.svc.update(id, b); }
  @Delete(':id')                  remove(@Param('id') id: string)  { return this.svc.remove(id); }
}
