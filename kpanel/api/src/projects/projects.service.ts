import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Project } from './project.entity';

@Injectable()
export class ProjectsService {
  constructor(@InjectRepository(Project) private repo: Repository<Project>) {}

  findAll()                                    { return this.repo.find({ order: { createdAt: 'DESC' } }); }
  async findOne(id: string)                   { const p = await this.repo.findOneBy({ id }); if (!p) throw new NotFoundException(); return p; }
  create(data: Partial<Project>)               { return this.repo.save(this.repo.create(data)); }
  async update(id: string, data: Partial<Project>) { return this.repo.save(Object.assign(await this.findOne(id), data)); }
  async remove(id: string)                    { await this.repo.remove(await this.findOne(id)); }

  async getSummary() {
    const all = await this.repo.find();
    return {
      total:   all.length,
      running: all.filter(p => p.status === 'running').length,
      stopped: all.filter(p => p.status === 'stopped').length,
    };
  }
}
