import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { User } from './user.entity';
import { CreateUserDto, UpdateUserDto } from './user.dto';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly repo: Repository<User>,
  ) {}

  async findAll(): Promise<Omit<User, 'password'>[]> {
    const users = await this.repo.find({ order: { createdAt: 'DESC' } });
    return users.map(({ password: _, ...u }) => u as Omit<User, 'password'>);
  }

  async findOne(id: string): Promise<User> {
    const user = await this.repo.findOneBy({ id });
    if (!user) throw new NotFoundException(`Không tìm thấy người dùng #${id}`);
    return user;
  }

  async findByEmail(email: string): Promise<User | null> {
    return this.repo.findOneBy({ email });
  }

  async create(dto: CreateUserDto): Promise<Omit<User, 'password'>> {
    const existing = await this.findByEmail(dto.email);
    if (existing) throw new ConflictException('Email đã được sử dụng');

    const hash = await bcrypt.hash(dto.password, 10);
    const user = this.repo.create({ ...dto, password: hash });
    const saved = await this.repo.save(user);
    const { password: _, ...result } = saved;
    return result as Omit<User, 'password'>;
  }

  async update(id: string, dto: UpdateUserDto): Promise<Omit<User, 'password'>> {
    const user = await this.findOne(id);
    Object.assign(user, dto);
    const saved = await this.repo.save(user);
    const { password: _, ...result } = saved;
    return result as Omit<User, 'password'>;
  }

  async remove(id: string): Promise<void> {
    const user = await this.findOne(id);
    await this.repo.remove(user);
  }

  async updateLastLogin(id: string): Promise<void> {
    await this.repo.update(id, { lastLoginAt: new Date() });
  }
}
