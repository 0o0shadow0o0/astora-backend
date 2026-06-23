import { Module } from '@nestjs/common';
import { BullModule } from '@nestjs/bullmq';
import { CallsService } from './services/calls.service';

@Module({
  imports: [BullModule.registerQueue({ name: 'calls' })],
  providers: [CallsService],
  exports: [CallsService],
})
export class CallsModule {}
