import { Entity, Column, ManyToOne, JoinColumn } from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';
import { BaseEntity } from '../../../common/entities/base.entity';
import { User } from '../../users/entities/user.entity';

export enum TaskType {
  ONE_TIME = 'one_time',
  DAILY = 'daily',
  WEEKLY = 'weekly',
  MONTHLY = 'monthly',
  YEARLY = 'yearly',
  CRON = 'cron',
  RECURRING = 'recurring',
}

export enum TaskStatus {
  PENDING = 'pending',
  RUNNING = 'running',
  COMPLETED = 'completed',
  FAILED = 'failed',
  CANCELLED = 'cancelled',
  PAUSED = 'paused',
}

export enum TaskPriority {
  LOW = 'low',
  NORMAL = 'normal',
  HIGH = 'high',
  CRITICAL = 'critical',
}

@Entity('scheduled_tasks')
export class ScheduledTask extends BaseEntity {
  @ApiProperty({ example: 'Send daily report' })
  @Column()
  name: string;

  @ApiProperty({ example: 'Task description', required: false })
  @Column({ nullable: true })
  description?: string;

  @ApiProperty({ enum: TaskType })
  @Column({
    type: 'enum',
    enum: TaskType,
    default: TaskType.ONE_TIME,
  })
  type: TaskType;

  @ApiProperty({ enum: TaskStatus })
  @Column({
    type: 'enum',
    enum: TaskStatus,
    default: TaskStatus.PENDING,
  })
  status: TaskStatus;

  @ApiProperty({ enum: TaskPriority })
  @Column({
    type: 'enum',
    enum: TaskPriority,
    default: TaskPriority.NORMAL,
  })
  priority: TaskPriority;

  @ApiProperty({ example: '* * * * *' })
  @Column({ nullable: true })
  cronExpression?: string;

  @ApiProperty()
  @Column({ type: 'timestamp with time zone' })
  scheduledAt: Date;

  @ApiProperty({ required: false })
  @Column({ type: 'timestamp with time zone', nullable: true })
  startedAt?: Date;

  @ApiProperty({ required: false })
  @Column({ type: 'timestamp with time zone', nullable: true })
  completedAt?: Date;

  @ApiProperty({ example: 3 })
  @Column({ default: 3 })
  maxRetries: number;

  @ApiProperty({ example: 0 })
  @Column({ default: 0 })
  retryCount: number;

  @ApiProperty({ example: 3600 })
  @Column({ default: 3600 })
  timeoutSeconds: number;

  @Column({ type: 'jsonb' })
  payload: Record<string, any>;

  @ApiProperty({ example: 'Error message', required: false })
  @Column({ nullable: true })
  errorMessage?: string;

  @ApiProperty({ example: false })
  @Column({ default: false })
  isRecurring: boolean;

  @ApiProperty({ required: false })
  @Column({ nullable: true })
  recurringEndDate?: Date;

  @ManyToOne(() => User, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'user_id' })
  user: User;

  @Column()
  userId: string;
}
