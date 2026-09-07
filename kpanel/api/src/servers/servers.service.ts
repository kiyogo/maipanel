import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Server } from './server.entity';

@Injectable()
export class ServersService {
  constructor(
    @InjectRepository(Server)
    private readonly repo: Repository<Server>,
  ) {}

  findAll()                           { return this.repo.find({ order: { createdAt: 'DESC' } }); }
  async findOne(id: string)          {
    const s = await this.repo.findOneBy({ id });
    if (!s) throw new NotFoundException(`Không tìm thấy server #${id}`);
    return s;
  }
  create(data: Partial<Server>)      { return this.repo.save(this.repo.create(data)); }
  async update(id: string, data: Partial<Server>) {
    const s = await this.findOne(id);
    return this.repo.save(Object.assign(s, data));
  }
  async remove(id: string)           { await this.repo.remove(await this.findOne(id)); }

  // Thống kê tổng hợp cho Dashboard
  async getSummary() {
    const all = await this.repo.find();
    return {
      total:   all.length,
      online:  all.filter(s => s.status === 'online').length,
      offline: all.filter(s => s.status === 'offline').length,
      warning: all.filter(s => s.status === 'warning').length,
    };
  }
}
