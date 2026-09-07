import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn } from 'typeorm';

@Entity('logs')
export class Log {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ default: 'INFO' })
  level: 'INFO' | 'WARNING' | 'ERROR' | 'DEBUG';

  @Column()
  service: string;

  @Column()
  message: string;

  @Column({ nullable: true })
  meta: string; // JSON string

  @CreateDateColumn()
  createdAt: Date;
}
