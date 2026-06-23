import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AIService } from './services/ai.service';
import { AIController } from './controllers/ai.controller';
import { AIConversation, AIMessage } from './entities/ai-conversation.entity';

@Module({
  imports: [TypeOrmModule.forFeature([AIConversation, AIMessage])],
  controllers: [AIController],
  providers: [AIService],
  exports: [AIService],
})
export class AiModule {}
