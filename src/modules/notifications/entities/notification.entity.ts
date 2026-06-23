import { Entity, Column, ManyToOne, JoinColumn } from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';
import { BaseEntity } from '../../../common/entities/base.entity';
import { User } from '../../users/entities/user.entity';

export enum NotificationType {
  WHATSAPP_MESSAGE = 'whatsapp_message',
  WHATSAPP_STATUS = 'whatsapp_status',
  SMS = 'sms',
  CALL = 'call',
  ORDER = 'order',
  PAYMENT = 'payment',
  TASK = 'task',
  SYSTEM = 'system',
  MARKETING = 'marketing',
}

export enum NotificationChannel {
  PUSH = 'push',
  EMAIL = 'email',
  SMS = 'sms',
  WHATSAPP = 'whatsapp',
  IN_APP = 'in_app',
}

export enum NotificationStatus {
  PENDING = 'pending',
  SENT = 'sent',
  DELIVERED = 'delivered',
  READ = 'read',
  FAILED = 'failed',
}

@Entity('notifications')
export class Notification extends BaseEntity {
  @ApiProperty({ example: 'New Order Received' })
  @Column()
  title: string;

  @ApiProperty({ example: 'You have received a new order #1234' })
  @Column({ type: 'text' })
  message: string;

  @ApiProperty({ enum: NotificationType })
  @Column({
    type: 'enum',
    enum: NotificationType,
    default: NotificationType.SYSTEM,
  })
  type: NotificationType;

  @ApiProperty({ enum: NotificationChannel, isArray: true })
  @Column({
    type: 'enum',
    enum: NotificationChannel,
    array: true,
    default: [NotificationChannel.IN_APP],
  })
  channels: NotificationChannel[];

  @ApiProperty({ enum: NotificationStatus })
  @Column({
    type: 'enum',
    enum: NotificationStatus,
    default: NotificationStatus.PENDING,
  })
  status: NotificationStatus;

  @ApiProperty({ example: false })
  @Column({ default: false })
  isRead: boolean;

  @ApiProperty({ required: false })
  @Column({ nullable: true })
  readAt?: Date;

  @ApiProperty({ example: 'data_id_123', required: false })
  @Column({ nullable: true })
  referenceId?: string;

  @ApiProperty({ example: 'icon.png', required: false })
  @Column({ nullable: true })
  icon?: string;

  @ApiProperty({ example: '#FF0000', required: false })
  @Column({ nullable: true })
  color?: string;

  @Column({ type: 'jsonb', nullable: true })
  data?: Record<string, any>;

  @ManyToOne(() => User, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'user_id' })
  user: User;

  @Column()
  userId: string;
}
