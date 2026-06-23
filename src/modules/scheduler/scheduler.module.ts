import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BullModule } from '@nestjs/bullmq';
import { ScheduledTask } from './entities/scheduled-task.entity';
import { Campaign } from './entities/campaign.entity';
import { AutomationFlow } from './entities/automation-flow.entity';
import { SchedulerService } from './services/scheduler.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([ScheduledTask, Campaign, AutomationFlow]),
    BullModule.registerQueue({ name: 'scheduled-tasks' }),
  ],
  providers: [SchedulerService],
  exports: [SchedulerService],
})
export class SchedulerModule {}
