import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ChatThread } from './entities/chat-thread.entity';
import { Message } from './entities/message.entity';
import { ChatService } from './services/chat.service';

@Module({
  imports: [TypeOrmModule.forFeature([ChatThread, Message])],
  providers: [ChatService],
  exports: [ChatService],
})
export class ChatModule {}
