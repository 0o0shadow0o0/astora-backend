import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BullModule } from '@nestjs/bullmq';
import { WhatsAppAccount } from './entities/whatsapp-account.entity';
import { WhatsAppService } from './services/whatsapp.service';
import { WhatsAppController } from './controllers/whatsapp.controller';

@Module({
  imports: [
    TypeOrmModule.forFeature([WhatsAppAccount]),
    BullModule.registerQueue({ name: 'whatsapp-messages' }),
  ],
  controllers: [WhatsAppController],
  providers: [WhatsAppService],
  exports: [WhatsAppService],
})
export class WhatsAppModule {}
