import { Entity, Column, ManyToOne, JoinColumn } from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';
import { BaseEntity } from '../../../common/entities/base.entity';
import { User } from '../../users/entities/user.entity';
import { ChatThread } from './chat-thread.entity';

export enum MessageType {
  TEXT = 'text',
  IMAGE = 'image',
  VIDEO = 'video',
  AUDIO = 'audio',
  DOCUMENT = 'document',
  STICKER = 'sticker',
  LOCATION = 'location',
  CONTACT = 'contact',
  VOICE = 'voice',
  POLL = 'poll',
  TEMPLATE = 'template',
  BUTTON = 'button',
  REACTION = 'reaction',
  SYSTEM = 'system',
}

export enum MessageStatus {
  PENDING = 'pending',
  SENT = 'sent',
  DELIVERED = 'delivered',
  READ = 'read',
  FAILED = 'failed',
}

export enum MessageDirection {
  INCOMING = 'incoming',
  OUTGOING = 'outgoing',
}

@Entity('messages')
export class Message extends BaseEntity {
  @ApiProperty({ example: 'msg_123' })
  @Column()
  externalId: string;

  @ApiProperty({ enum: MessageType })
  @Column({
    type: 'enum',
    enum: MessageType,
    default: MessageType.TEXT,
  })
  type: MessageType;

  @ApiProperty({ enum: MessageStatus })
  @Column({
    type: 'enum',
    enum: MessageStatus,
    default: MessageStatus.PENDING,
  })
  status: MessageStatus;

  @ApiProperty({ enum: MessageDirection })
  @Column({
    type: 'enum',
    enum: MessageDirection,
    default: MessageDirection.OUTGOING,
  })
  direction: MessageDirection;

  @ApiProperty({ example: 'Hello, how are you?' })
  @Column({ type: 'text' })
  content: string;

  @ApiProperty({ example: 'caption', required: false })
  @Column({ nullable: true })
  caption?: string;

  @ApiProperty({ example: 'media_url.jpg', required: false })
  @Column({ nullable: true })
  mediaUrl?: string;

  @ApiProperty({ example: 'media_mime_type', required: false })
  @Column({ nullable: true })
  mediaMimeType?: string;

  @ApiProperty({ example: 'filename.pdf', required: false })
  @Column({ nullable: true })
  mediaFileName?: string;

  @ApiProperty({ example: 1024, required: false })
  @Column({ type: 'bigint', nullable: true })
  mediaSize?: number;

  @ApiProperty({ example: false })
  @Column({ default: false })
  isDeleted: boolean;

  @ApiProperty({ example: false })
  @Column({ default: false })
  isEdited: boolean;

  @ApiProperty({ example: false })
  @Column({ default: false })
  isForwarded: boolean;

  @ApiProperty({ example: false })
  @Column({ default: false })
  isStarred: boolean;

  @ApiProperty({ example: 0 })
  @Column({ default: 0 })
  replyCount: number;

  @ApiProperty({ example: 'reply_to_msg_id', required: false })
  @Column({ nullable: true })
  replyToId?: string;

  @ManyToOne(() => User, { onDelete: 'SET NULL', nullable: true })
  @JoinColumn({ name: 'user_id' })
  user?: User;

  @Column({ nullable: true })
  userId?: string;

  @ManyToOne(() => ChatThread, (thread) => thread.messages, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'chat_thread_id' })
  chatThread: ChatThread;

  @Column()
  chatThreadId: string;
}
