import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn } from 'typeorm';

@Entity('servers')
export class Server {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @Column()
  ip: string;

  @Column({ nullable: true })
  region: string;

  @Column({ nullable: true })
  os: string;

  @Column({ default: 'offline' })
  status: 'online' | 'offline' | 'warning';

  @Column({ type: 'int', default: 0 })
  cpu: number;

  @Column({ type: 'int', default: 0 })
  ram: number;

  @Column({ type: 'int', default: 0 })
  disk: number;

  @Column({ nullable: true })
  sshPort: number;

  @Column({ nullable: true })
  notes: string;

  @Column({ type: 'int', default: 0 })
  gpu: number;

  @Column({ nullable: true })
  temperature: string;

  @Column({ nullable: true })
  uptime: string;

  @Column({ nullable: true })
  networkTraffic: string;

  @Column({ nullable: true })
  loadAverage: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
