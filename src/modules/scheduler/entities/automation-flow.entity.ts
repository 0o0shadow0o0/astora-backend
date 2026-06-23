import { Entity, Column, ManyToOne, JoinColumn } from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';
import { BaseEntity } from '../../../common/entities/base.entity';
import { User } from '../../users/entities/user.entity';

export enum FlowStatus {
  ACTIVE = 'active',
  INACTIVE = 'inactive',
  DRAFT = 'draft',
}

@Entity('automation_flows')
export class AutomationFlow extends BaseEntity {
  @ApiProperty({ example: 'Welcome Message Flow' })
  @Column()
  name: string;

  @ApiProperty({ example: 'Automated welcome message sequence' })
  @Column({ nullable: true })
  description?: string;

  @ApiProperty({ enum: FlowStatus })
  @Column({
    type: 'enum',
    enum: FlowStatus,
    default: FlowStatus.DRAFT,
  })
  status: FlowStatus;

  @Column({ type: 'jsonb' })
  trigger: Record<string, any>;

  @Column({ type: 'jsonb' })
  actions: Record<string, any>[];

  @Column({ type: 'jsonb', nullable: true })
  conditions?: Record<string, any>[];

  @ApiProperty({ example: 0 })
  @Column({ default: 0 })
  executionsCount: number;

  @ApiProperty({ example: 0 })
  @Column({ default: 0 })
  successCount: number;

  @ApiProperty({ example: 0 })
  @Column({ default: 0 })
  failureCount: number;

  @ManyToOne(() => User, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'user_id' })
  user: User;

  @Column()
  userId: string;
}
