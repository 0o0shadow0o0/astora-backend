import { Module } from '@nestjs/common';
import { BullModule } from '@nestjs/bullmq';
import { SmsService } from './services/sms.service';

@Module({
  imports: [BullModule.registerQueue({ name: 'sms-messages' })],
  providers: [SmsService],
  exports: [SmsService],
})
export class SmsModule {}
