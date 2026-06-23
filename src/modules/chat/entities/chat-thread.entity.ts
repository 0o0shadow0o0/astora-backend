import { Entity, Column, ManyToOne, JoinColumn, OneToMany } from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';
import { BaseEntity } from '../../../common/entities/base.entity';
import { User } from '../../users/entities/user.entity';
import { Contact } from '../../contacts/entities/contact.entity';
import { WhatsAppAccount } from '../../whatsapp/entities/whatsapp-account.entity';

export enum ChatType {
  DIRECT = 'direct',
  GROUP = 'group',
  BROADCAST = 'broadcast',
  CHANNEL = 'channel',
}

export enum ChatStatus {
  ACTIVE = 'active',
  ARCHIVED = 'archived',
  PINNED = 'pinned',
  MUTED = 'muted',
  SPAM = 'spam',
}

@Entity('chat_threads')
export class ChatThread extends BaseEntity {
  @ApiProperty({ example: 'chat_123' })
  @Column()
  externalId: string;

  @ApiProperty({ enum: ChatType })
  @Column({
    type: 'enum',
    enum: ChatType,
    default: ChatType.DIRECT,
  })
  type: ChatType;

  @ApiProperty({ enum: ChatStatus })
  @Column({
    type: 'enum',
    enum: ChatStatus,
    default: ChatStatus.ACTIVE,
  })
  status: ChatStatus;

  @ApiProperty({ example: 'Chat Title' })
  @Column({ nullable: true })
  title?: string;

  @ApiProperty({ example: 'group_photo.jpg', required: false })
  @Column({ nullable: true })
  image?: string;

  @ApiProperty({ example: 'Group description', required: false })
  @Column({ nullable: true })
  description?: string;

  @ApiProperty({ example: false })
  @Column({ default: false })
  isReadOnly: boolean;

  @ApiProperty({ example: false })
  @Column({ default: false })
  isMuted: boolean;

  @ApiProperty({ example: false })
  @Column({ default: false })
  isPinned: boolean;

  @ApiProperty({ example: false })
  @Column({ default: false })
  isArchived: boolean;

  @ApiProperty({ example: false })
  @Column({ default: false })
  isSpam: boolean;

  @ApiProperty({ example: 0 })
  @Column({ default: 0 })
  unreadCount: number;

  @ApiProperty({ example: 0 })
  @Column({ default: 0 })
  messageCount: number;

  @ApiProperty({ example: 'last message content', required: false })
  @Column({ nullable: true })
  lastMessage?: string;

  @ApiProperty({ required: false })
  @Column({ type: 'timestamp with time zone', nullable: true })
  lastMessageAt?: Date;

  @ManyToOne(() => User, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'user_id' })
  user: User;

  @Column()
  userId: string;

  @ManyToOne(() => Contact, { onDelete: 'SET NULL', nullable: true })
  @JoinColumn({ name: 'contact_id' })
  contact?: Contact;

  @Column({ nullable: true })
  contactId?: string;

  @ManyToOne(() => WhatsAppAccount, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'whatsapp_account_id' })
  whatsappAccount: WhatsAppAccount;

  @Column()
  whatsappAccountId: string;
}
