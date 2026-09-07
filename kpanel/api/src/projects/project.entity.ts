import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn } from 'typeorm';

@Entity('projects')
export class Project {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @Column()
  type: string; // web-php | web-nodejs | web-python | game | app | data | api | other

  @Column({ nullable: true })
  server: string;

  @Column({ nullable: true })
  domain: string;

  @Column({ nullable: true })
  git: string;

  @Column({ default: 'stopped' })
  status: 'running' | 'stopped';

  @Column({ nullable: true })
  notes: string;

  @Column({ nullable: true })
  phpVersion: string;

  @Column({ nullable: true })
  nodeVersion: string;

  @Column({ nullable: true })
  pythonVersion: string;

  @Column({ nullable: true })
  framework: string;

  @Column({ nullable: true })
  branch: string;

  @Column({ nullable: true })
  ssl: boolean;

  @Column({ nullable: true })
  database: string;

  @Column({ nullable: true })
  redis: boolean;

  @Column({ nullable: true })
  env: string;

  @Column({ nullable: true })
  subdomain: string;

  @Column({ nullable: true })
  documentRoot: string;

  @Column({ nullable: true })
  composer: boolean;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
