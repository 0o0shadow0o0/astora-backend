import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsString, IsOptional, IsEnum, IsBoolean, IsNumber, IsUrl } from 'class-validator';
import { WhatsAppProvider, WhatsAppStatus } from '../entities/whatsapp-account.entity';

export class CreateWhatsAppAccountDto {
  @ApiProperty({ example: 'My Business WhatsApp' })
  @IsString()
  name: string;

  @ApiPropertyOptional({ enum: WhatsAppProvider })
  @IsOptional()
  @IsEnum(WhatsAppProvider)
  provider?: WhatsAppProvider;

  @ApiPropertyOptional()
  @IsOptional()
  @IsBoolean()
  multiDevice?: boolean;

  @ApiPropertyOptional()
  @IsOptional()
  @IsBoolean()
  autoReconnect?: boolean;

  @ApiPropertyOptional()
  @IsOptional()
  @IsBoolean()
  syncMessages?: boolean;

  @ApiPropertyOptional()
  @IsOptional()
  @IsBoolean()
  syncContacts?: boolean;
}

export class UpdateWhatsAppAccountDto {
  @ApiPropertyOptional({ example: 'Updated Name' })
  @IsOptional()
  @IsString()
  name?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsBoolean()
  autoReconnect?: boolean;

  @ApiPropertyOptional()
  @IsOptional()
  @IsBoolean()
  syncMessages?: boolean;

  @ApiPropertyOptional()
  @IsOptional()
  @IsBoolean()
  syncContacts?: boolean;

  @ApiPropertyOptional()
  @IsOptional()
  @IsBoolean()
  syncPresence?: boolean;
}

export class SendMessageDto {
  @ApiProperty({ example: '+1234567890' })
  @IsString()
  to: string;

  @ApiProperty({ example: 'Hello, this is a test message!' })
  @IsString()
  content: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  replyTo?: string;
}

export class SendMediaDto {
  @ApiProperty({ example: '+1234567890' })
  @IsString()
  to: string;

  @ApiProperty({ example: 'https://example.com/image.jpg' })
  @IsUrl()
  mediaUrl: string;

  @ApiProperty({ example: 'image' })
  @IsString()
  type: 'image' | 'video' | 'audio' | 'document';

  @ApiPropertyOptional({ example: 'Image caption' })
  @IsOptional()
  @IsString()
  caption?: string;

  @ApiPropertyOptional({ example: 'document.pdf' })
  @IsOptional()
  @IsString()
  filename?: string;
}

export class SendLocationDto {
  @ApiProperty({ example: '+1234567890' })
  @IsString()
  to: string;

  @ApiProperty({ example: 40.7128 })
  @IsNumber()
  latitude: number;

  @ApiProperty({ example: -74.0060 })
  @IsNumber()
  longitude: number;

  @ApiPropertyOptional({ example: 'New York, NY' })
  @IsOptional()
  @IsString()
  description?: string;
}

export class WhatsAppWebhookDto {
  @ApiProperty()
  @IsString()
  event: string;

  @ApiProperty()
  data: any;
}
