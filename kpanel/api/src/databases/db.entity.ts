import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn } from 'typeorm';

@Entity('databases')
export class Db {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @Column()
  type: string; // PostgreSQL | MySQL | MongoDB | Redis

  @Column({ nullable: true })
  server: string;

  @Column({ nullable: true })
  port: number;

  @Column({ default: 'stopped' })
  status: 'online' | 'stopped';

  @Column({ nullable: true })
  size: string;

  @Column({ nullable: true })
  version: string;

  @Column({ nullable: true })
  lastBackup: string;

  @CreateDateColumn()
  createdAt: Date;
}
