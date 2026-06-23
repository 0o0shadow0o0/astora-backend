import { Entity, Column, ManyToOne, JoinColumn, OneToMany } from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';
import { BaseEntity } from '../../../common/entities/base.entity';
import { User } from '../../users/entities/user.entity';

export enum AIProvider {
  OPENAI = 'openai',
  GEMINI = 'gemini',
  CLAUDE = 'claude',
  DEEPSEEK = 'deepseek',
  OLLAMA = 'ollama',
}

export enum ConversationStatus {
  ACTIVE = 'active',
  ENDED = 'ended',
  ARCHIVED = 'archived',
}

@Entity('ai_conversations')
export class AIConversation extends BaseEntity {
  @ApiProperty({ example: 'Customer Support Chat' })
  @Column()
  title: string;

  @ApiProperty({ enum: AIProvider })
  @Column({
    type: 'enum',
    enum: AIProvider,
    default: AIProvider.OPENAI,
  })
  provider: AIProvider;

  @ApiProperty({ enum: ConversationStatus })
  @Column({
    type: 'enum',
    enum: ConversationStatus,
    default: ConversationStatus.ACTIVE,
  })
  status: ConversationStatus;

  @Column({ type: 'jsonb', nullable: true })
  context?: Record<string, any>;

  @ApiProperty({ example: 0 })
  @Column({ default: 0 })
  messageCount: number;

  @ApiProperty({ example: 'phone_123', required: false })
  @Column({ nullable: true })
  contactPhone?: string;

  @ApiProperty({ example: 'chat_thread_id', required: false })
  @Column({ nullable: true })
  chatThreadId?: string;

  @ManyToOne(() => User, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'user_id' })
  user: User;

  @Column()
  userId: string;
}

@Entity('ai_messages')
export class AIMessage extends BaseEntity {
  @ApiProperty({ example: 'Hello, how can I help you?' })
  @Column({ type: 'text' })
  content: string;

  @ApiProperty({ example: 'user' })
  @Column()
  role: string;

  @ApiProperty({ example: 100 })
  @Column({ type: 'int', nullable: true })
  tokens?: number;

  @Column({ type: 'jsonb', nullable: true })
  metadata?: Record<string, any>;

  @ManyToOne(() => AIConversation, (conv) => conv.messages, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'conversation_id' })
  conversation: AIConversation;

  @Column()
  conversationId: string;
}
