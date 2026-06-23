import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsString, IsOptional, IsEnum, IsBoolean, IsNumber, IsUUID } from 'class-validator';
import { PaginationDto } from '../../../common/dto/common.dto';
import { ChatType, ChatStatus } from '../entities/chat-thread.entity';
import { MessageType, MessageDirection } from '../entities/message.entity';

export class CreateChatThreadDto {
  @ApiProperty({ example: 'chat_123' })
  @IsString()
  externalId: string;

  @ApiPropertyOptional({ enum: ChatType })
  @IsOptional()
  @IsEnum(ChatType)
  type?: ChatType;

  @ApiPropertyOptional({ example: 'Chat Title' })
  @IsOptional()
  @IsString()
  title?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsUUID()
  contactId?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsUUID()
  whatsappAccountId: string;
}

export class UpdateChatThreadDto {
  @ApiPropertyOptional({ enum: ChatStatus })
  @IsOptional()
  @IsEnum(ChatStatus)
  status?: ChatStatus;

  @ApiPropertyOptional()
  @IsOptional()
  @IsBoolean()
  isPinned?: boolean;

  @ApiPropertyOptional()
  @IsOptional()
  @IsBoolean()
  isArchived?: boolean;

  @ApiPropertyOptional()
  @IsOptional()
  @IsBoolean()
  isMuted?: boolean;
}

export class ChatQueryDto extends PaginationDto {
  @ApiPropertyOptional({ enum: ChatType })
  @IsOptional()
  @IsEnum(ChatType)
  type?: ChatType;

  @ApiPropertyOptional({ enum: ChatStatus })
  @IsOptional()
  @IsEnum(ChatStatus)
  status?: ChatStatus;

  @ApiPropertyOptional()
  @IsOptional()
  @IsBoolean()
  isPinned?: boolean;

  @ApiPropertyOptional()
  @IsOptional()
  @IsBoolean()
  isArchived?: boolean;

  @ApiPropertyOptional()
  @IsOptional()
  @IsUUID()
  contactId?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsUUID()
  whatsappAccountId?: string;
}

export class SendChatMessageDto {
  @ApiProperty({ example: '+1234567890' })
  @IsString()
  to: string;

  @ApiProperty({ example: 'Hello, this is a message!' })
  @IsString()
  content: string;

  @ApiPropertyOptional({ enum: MessageType })
  @IsOptional()
  @IsEnum(MessageType)
  type?: MessageType;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  replyToId?: string;
}

export class SendMediaMessageDto {
  @ApiProperty({ example: '+1234567890' })
  @IsString()
  to: string;

  @ApiProperty({ example: 'https://example.com/image.jpg' })
  @IsString()
  mediaUrl: string;

  @ApiProperty({ example: 'image' })
  @IsString()
  type: 'image' | 'video' | 'audio' | 'document';

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  caption?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  filename?: string;
}

export class MessageQueryDto extends PaginationDto {
  @ApiPropertyOptional({ enum: MessageType })
  @IsOptional()
  @IsEnum(MessageType)
  type?: MessageType;

  @ApiPropertyOptional({ enum: MessageDirection })
  @IsOptional()
  @IsEnum(MessageDirection)
  direction?: MessageDirection;

  @ApiPropertyOptional({ enum: ['pending', 'sent', 'delivered', 'read', 'failed'] })
  @IsOptional()
  @IsString()
  status?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  search?: string;
}

export class MarkReadDto {
  @ApiProperty({ example: 'chat_thread_id' })
  @IsString()
  chatThreadId: string;
}

export class ArchiveChatDto {
  @ApiProperty()
  @IsBoolean()
  archive: boolean;
}

export class PinChatDto {
  @ApiProperty()
  @IsBoolean()
  pin: boolean;
}
