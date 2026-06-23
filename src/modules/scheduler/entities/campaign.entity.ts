import { Entity, Column, ManyToOne, JoinColumn } from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';
import { BaseEntity } from '../../../common/entities/base.entity';
import { User } from '../../users/entities/user.entity';
import { WhatsAppAccount } from '../../whatsapp/entities/whatsapp-account.entity';

export enum CampaignType {
  WHATSAPP = 'whatsapp',
  SMS = 'sms',
  BOTH = 'both',
}

export enum CampaignStatus {
  DRAFT = 'draft',
  SCHEDULED = 'scheduled',
  RUNNING = 'running',
  COMPLETED = 'completed',
  PAUSED = 'paused',
  CANCELLED = 'cancelled',
  FAILED = 'failed',
}

@Entity('campaigns')
export class Campaign extends BaseEntity {
  @ApiProperty({ example: 'Summer Sale Campaign' })
  @Column()
  name: string;

  @ApiProperty({ example: 'Campaign description' })
  @Column({ nullable: true })
  description?: string;

  @ApiProperty({ enum: CampaignType })
  @Column({
    type: 'enum',
    enum: CampaignType,
    default: CampaignType.WHATSAPP,
  })
  type: CampaignType;

  @ApiProperty({ enum: CampaignStatus })
  @Column({
    type: 'enum',
    enum: CampaignStatus,
    default: CampaignStatus.DRAFT,
  })
  status: CampaignStatus;

  @ApiProperty({ example: 'Hello! Check out our summer sale...' })
  @Column({ type: 'text' })
  message: string;

  @ApiProperty({ example: 'image.jpg', required: false })
  @Column({ nullable: true })
  mediaUrl?: string;

  @ApiProperty()
  @Column({ type: 'timestamp with time zone', nullable: true })
  scheduledAt?: Date;

  @ApiProperty()
  @Column({ type: 'timestamp with time zone', nullable: true })
  startedAt?: Date;

  @ApiProperty()
  @Column({ type: 'timestamp with time zone', nullable: true })
  completedAt?: Date;

  @ApiProperty({ example: 100 })
  @Column({ default: 0 })
  totalRecipients: number;

  @ApiProperty({ example: 50 })
  @Column({ default: 0 })
  sentCount: number;

  @ApiProperty({ example: 45 })
  @Column({ default: 0 })
  deliveredCount: number;

  @ApiProperty({ example: 40 })
  @Column({ default: 0 })
  readCount: number;

  @ApiProperty({ example: 5 })
  @Column({ default: 0 })
  failedCount: number;

  @ApiProperty({ example: 10 })
  @Column({ default: 0 })
  optedOutCount: number;

  @ManyToOne(() => User, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'user_id' })
  user: User;

  @Column()
  userId: string;

  @ManyToOne(() => WhatsAppAccount, { onDelete: 'SET NULL', nullable: true })
  @JoinColumn({ name: 'whatsapp_account_id' })
  whatsappAccount?: WhatsAppAccount;

  @Column({ nullable: true })
  whatsappAccountId?: string;
}
