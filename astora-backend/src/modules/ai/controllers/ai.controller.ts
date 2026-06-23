import {
  Controller,
  Get,
  Post,
  Delete,
  Body,
  Param,
  UseGuards,
  Req,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { AIService, AIResponse } from '../services/ai.service';
import { AuthGuard } from '../../auth/guards/auth.guard';
import { IsString, IsOptional } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

class SendMessageDto {
  @ApiProperty({ example: 'Hello, I need help with my order' })
  @IsString()
  content: string;

  @ApiPropertyOptional({ example: 'You are a helpful assistant...' })
  @IsOptional()
  @IsString()
  systemPrompt?: string;
}

@ApiTags('ai')
@ApiBearerAuth()
@UseGuards(AuthGuard)
@Controller({ path: 'ai', version: '1' })
export class AIController {
  constructor(private readonly aiService: AIService) {}

  @Post('conversations')
  @ApiOperation({ summary: 'Create a new AI conversation' })
  async createConversation(@Req() req: any, @Body('title') title?: string) {
    return this.aiService.createConversation(req.user.id, title);
  }

  @Get('conversations')
  @ApiOperation({ summary: 'Get all AI conversations' })
  async getConversations(@Req() req: any) {
    return this.aiService.getConversations(req.user.id);
  }

  @Get('conversations/:id')
  @ApiOperation({ summary: 'Get conversation by ID' })
  async getConversation(@Param('id') id: string, @Req() req: any) {
    const messages = await this.aiService['getConversationMessages'](id);
    return messages;
  }

  @Post('conversations/:id/messages')
  @ApiOperation({ summary: 'Send message to AI' })
  async sendMessage(
    @Param('id') id: string,
    @Req() req: any,
    @Body() dto: SendMessageDto,
  ): Promise<AIResponse> {
    return this.aiService.sendMessage(
      id,
      req.user.id,
      dto.content,
      dto.systemPrompt,
    );
  }

  @Delete('conversations/:id')
  @ApiOperation({ summary: 'Delete AI conversation' })
  async deleteConversation(@Param('id') id: string, @Req() req: any) {
    await this.aiService.deleteConversation(id, req.user.id);
    return { message: 'Conversation deleted successfully' };
  }

  @Post('conversations/:id/recommend-product')
  @ApiOperation({ summary: 'Generate product recommendation' })
  async recommendProduct(@Param('id') id: string, @Req() req: any) {
    const recommendation = await this.aiService.generateProductRecommendation(id, req.user.id);
    return { recommendation };
  }

  @Post('conversations/:id/analyze-intent')
  @ApiOperation({ summary: 'Analyze customer intent' })
  async analyzeIntent(
    @Param('id') id: string,
    @Req() req: any,
    @Body('message') message: string,
  ) {
    return this.aiService.analyzeCustomerIntent(id, req.user.id, message);
  }
}
