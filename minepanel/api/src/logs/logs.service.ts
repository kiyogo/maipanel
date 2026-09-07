import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Log } from './log.entity';

@Injectable()
export class LogsService {
  constructor(@InjectRepository(Log) private repo: Repository<Log>) {}

  findAll(limit = 100) {
    return this.repo.find({ order: { createdAt: 'DESC' }, take: limit });
  }

  // Ghi log từ các service khác
  write(level: Log['level'], service: string, message: string, meta?: object) {
    const log = this.repo.create({ level, service, message, meta: meta ? JSON.stringify(meta) : undefined });
    return this.repo.save(log);
  }

  clear() {
    return this.repo.clear();
  }
}
