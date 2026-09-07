import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Db } from './db.entity';

@Injectable()
export class DatabasesService {
  constructor(@InjectRepository(Db) private repo: Repository<Db>) {}
  findAll()                                { return this.repo.find({ order: { createdAt: 'DESC' } }); }
  async findOne(id: string)               { const d = await this.repo.findOneBy({ id }); if (!d) throw new NotFoundException(); return d; }
  create(data: Partial<Db>)               { return this.repo.save(this.repo.create(data)); }
  async update(id: string, data: Partial<Db>) { return this.repo.save(Object.assign(await this.findOne(id), data)); }
  async remove(id: string)                { await this.repo.remove(await this.findOne(id)); }
}
