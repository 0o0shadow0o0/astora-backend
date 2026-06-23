import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { InjectQueue } from '@nestjs/bullmq';
import { Queue, Worker, Job } from 'bullmq';
import { Cron } from '@nestjs/schedule';
import { ScheduledTask, TaskType, TaskStatus, TaskPriority } from '../entities/scheduled-task.entity';
import { Campaign, CampaignType, CampaignStatus } from '../entities/campaign.entity';
import { AutomationFlow, FlowStatus } from '../entities/automation-flow.entity';

export interface TaskPayload {
  type: string;
  data: Record<string, any>;
  scheduledTaskId?: string;
  retryCount?: number;
}

@Injectable()
export class SchedulerService {
  private readonly logger = new Logger(SchedulerService.name);

  constructor(
    @InjectRepository(ScheduledTask)
    private taskRepository: Repository<ScheduledTask>,
    @InjectRepository(Campaign)
    private campaignRepository: Repository<Campaign>,
    @InjectRepository(AutomationFlow)
    private flowRepository: Repository<AutomationFlow>,
    @InjectQueue('scheduled-tasks')
    private taskQueue: Queue,
    private configService: ConfigService,
  ) {
    this.initializeWorkers();
  }

  private initializeWorkers() {
    const worker = new Worker('scheduled-tasks', async (job: Job) => {
      await this.processTask(job.data as TaskPayload);
    }, {
      connection: {
        host: this.configService.get('REDIS_HOST', 'localhost'),
        port: this.configService.get('REDIS_PORT', 6379),
      },
      retryStrategy: (times) => {
        if (times > 3) return null;
        return Math.min(times * 1000, 30000);
      },
    });

    worker.on('completed', (job) => {
      this.logger.log(`Task ${job.id} completed successfully`);
    });

    worker.on('failed', (job, err) => {
      this.logger.error(`Task ${job?.id} failed:`, err);
    });
  }

  async createTask(userId: string, data: Partial<ScheduledTask>): Promise<ScheduledTask> {
    const task = this.taskRepository.create({
      ...data,
      userId,
      status: TaskStatus.PENDING,
    });

    const savedTask = await this.taskRepository.save(task);

    if (savedTask.scheduledAt <= new Date()) {
      await this.executeTask(savedTask);
    } else {
      await this.scheduleTask(savedTask);
    }

    return savedTask;
  }

  async updateTask(id: string, userId: string, data: Partial<ScheduledTask>): Promise<ScheduledTask> {
    const task = await this.taskRepository.findOne({ where: { id, userId } });
    if (!task) {
      throw new NotFoundException('Task not found');
    }

    Object.assign(task, data);
    const updatedTask = await this.taskRepository.save(task);

    if (updatedTask.status === TaskStatus.PENDING) {
      await this.scheduleTask(updatedTask);
    }

    return updatedTask;
  }

  async cancelTask(id: string, userId: string): Promise<void> {
    const task = await this.taskRepository.findOne({ where: { id, userId } });
    if (!task) {
      throw new NotFoundException('Task not found');
    }

    task.status = TaskStatus.CANCELLED;
    await this.taskRepository.save(task);

    await this.taskQueue.remove(job.id as string);
  }

  async retryTask(id: string, userId: string): Promise<ScheduledTask> {
    const task = await this.taskRepository.findOne({ where: { id, userId } });
    if (!task) {
      throw new NotFoundException('Task not found');
    }

    task.status = TaskStatus.PENDING;
    task.retryCount = 0;
    task.errorMessage = undefined;
    
    return this.taskRepository.save(task);
  }

  async getTasks(userId: string, page = 1, limit = 20): Promise<any> {
    const [data, total] = await this.taskRepository.findAndCount({
      where: { userId },
      order: { scheduledAt: 'DESC' },
      skip: (page - 1) * limit,
      take: limit,
    });

    return {
      data,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    };
  }

  async getTaskById(id: string, userId: string): Promise<ScheduledTask> {
    const task = await this.taskRepository.findOne({ where: { id, userId } });
    if (!task) {
      throw new NotFoundException('Task not found');
    }
    return task;
  }

  async getTaskHistory(id: string, userId: string): Promise<any[]> {
    const task = await this.getTaskById(id, userId);
    return this.taskRepository.find({
      where: { userId },
      order: { createdAt: 'DESC' },
    });
  }

  private async scheduleTask(task: ScheduledTask): Promise<void> {
    const delay = new Date(task.scheduledAt).getTime() - Date.now();
    
    if (task.type === TaskType.CRON && task.cronExpression) {
      // For cron jobs, we'd use a separate cron scheduler
      this.logger.log(`Scheduling cron task: ${task.name}`);
    } else {
      await this.taskQueue.add(
        `task-${task.id}`,
        {
          type: task.type,
          data: task.payload,
          scheduledTaskId: task.id,
        },
        {
          delay: Math.max(0, delay),
          attempts: task.maxRetries,
          timeout: task.timeoutSeconds * 1000,
          backoff: {
            type: 'exponential',
            delay: 1000,
          },
        }
      );
    }
  }

  private async processTask(payload: TaskPayload): Promise<void> {
    const { scheduledTaskId, data } = payload;

    if (scheduledTaskId) {
      const task = await this.taskRepository.findOne({ where: { id: scheduledTaskId } });
      if (!task) return;

      task.status = TaskStatus.RUNNING;
      task.startedAt = new Date();
      await this.taskRepository.save(task);

      try {
        await this.executeTaskAction(task, data);
        
        task.status = TaskStatus.COMPLETED;
        task.completedAt = new Date();
        await this.taskRepository.save(task);

        if (task.isRecurring) {
          await this.scheduleNextRecurring(task);
        }
      } catch (error) {
        task.retryCount += 1;
        task.errorMessage = error.message;
        
        if (task.retryCount >= task.maxRetries) {
          task.status = TaskStatus.FAILED;
        } else {
          task.status = TaskStatus.PENDING;
        }
        
        await this.taskRepository.save(task);
        throw error;
      }
    }
  }

  private async executeTaskAction(task: ScheduledTask, data: Record<string, any>): Promise<void> {
    const action = task.payload?.action;
    
    switch (action) {
      case 'send_whatsapp':
        this.logger.log(`Executing WhatsApp send for task ${task.id}`);
        break;
      case 'send_sms':
        this.logger.log(`Executing SMS send for task ${task.id}`);
        break;
      case 'send_email':
        this.logger.log(`Executing email send for task ${task.id}`);
        break;
      case 'webhook':
        this.logger.log(`Executing webhook for task ${task.id}`);
        break;
      case 'ai_response':
        this.logger.log(`Executing AI response for task ${task.id}`);
        break;
      default:
        this.logger.log(`Executing generic task ${task.id}`);
    }
  }

  private async scheduleNextRecurring(task: ScheduledTask): Promise<void> {
    let nextDate: Date;

    switch (task.type) {
      case TaskType.DAILY:
        nextDate = new Date(task.scheduledAt);
        nextDate.setDate(nextDate.getDate() + 1);
        break;
      case TaskType.WEEKLY:
        nextDate = new Date(task.scheduledAt);
        nextDate.setDate(nextDate.getDate() + 7);
        break;
      case TaskType.MONTHLY:
        nextDate = new Date(task.scheduledAt);
        nextDate.setMonth(nextDate.getMonth() + 1);
        break;
      default:
        return;
    }

    if (task.recurringEndDate && nextDate > task.recurringEndDate) {
      task.status = TaskStatus.COMPLETED;
      await this.taskRepository.save(task);
      return;
    }

    task.scheduledAt = nextDate;
    task.status = TaskStatus.PENDING;
    await this.taskRepository.save(task);

    await this.scheduleTask(task);
  }

  private async executeTask(task: ScheduledTask): Promise<void> {
    await this.taskQueue.add(
      `task-${task.id}`,
      {
        type: task.type,
        data: task.payload,
        scheduledTaskId: task.id,
      },
      {
        attempts: task.maxRetries,
        timeout: task.timeoutSeconds * 1000,
      }
    );
  }

  // Campaign Management
  async createCampaign(userId: string, data: Partial<Campaign>): Promise<Campaign> {
    const campaign = this.campaignRepository.create({
      ...data,
      userId,
      status: CampaignStatus.DRAFT,
    });
    return this.campaignRepository.save(campaign);
  }

  async getCampaigns(userId: string, page = 1, limit = 20): Promise<any> {
    const [data, total] = await this.campaignRepository.findAndCount({
      where: { userId },
      order: { createdAt: 'DESC' },
      skip: (page - 1) * limit,
      take: limit,
    });

    return { data, total, page, limit, totalPages: Math.ceil(total / limit) };
  }

  async scheduleCampaign(id: string, userId: string, scheduledAt: Date): Promise<Campaign> {
    const campaign = await this.campaignRepository.findOne({ where: { id, userId } });
    if (!campaign) {
      throw new NotFoundException('Campaign not found');
    }

    campaign.status = CampaignStatus.SCHEDULED;
    campaign.scheduledAt = scheduledAt;
    await this.campaignRepository.save(campaign);

    await this.taskQueue.add(
      `campaign-${id}`,
      { campaignId: id },
      { delay: scheduledAt.getTime() - Date.now() }
    );

    return campaign;
  }

  async startCampaign(id: string, userId: string): Promise<Campaign> {
    const campaign = await this.campaignRepository.findOne({ where: { id, userId } });
    if (!campaign) {
      throw new NotFoundException('Campaign not found');
    }

    campaign.status = CampaignStatus.RUNNING;
    campaign.startedAt = new Date();
    return this.campaignRepository.save(campaign);
  }

  async pauseCampaign(id: string, userId: string): Promise<Campaign> {
    const campaign = await this.campaignRepository.findOne({ where: { id, userId } });
    if (!campaign) {
      throw new NotFoundException('Campaign not found');
    }

    campaign.status = CampaignStatus.PAUSED;
    return this.campaignRepository.save(campaign);
  }

  async cancelCampaign(id: string, userId: string): Promise<Campaign> {
    const campaign = await this.campaignRepository.findOne({ where: { id, userId } });
    if (!campaign) {
      throw new NotFoundException('Campaign not found');
    }

    campaign.status = CampaignStatus.CANCELLED;
    return this.campaignRepository.save(campaign);
  }

  // Automation Flows
  async createFlow(userId: string, data: Partial<AutomationFlow>): Promise<AutomationFlow> {
    const flow = this.flowRepository.create({
      ...data,
      userId,
      status: FlowStatus.DRAFT,
    });
    return this.flowRepository.save(flow);
  }

  async getFlows(userId: string): Promise<AutomationFlow[]> {
    return this.flowRepository.find({ where: { userId } });
  }

  async activateFlow(id: string, userId: string): Promise<AutomationFlow> {
    const flow = await this.flowRepository.findOne({ where: { id, userId } });
    if (!flow) {
      throw new NotFoundException('Flow not found');
    }

    flow.status = FlowStatus.ACTIVE;
    return this.flowRepository.save(flow);
  }

  async deactivateFlow(id: string, userId: string): Promise<AutomationFlow> {
    const flow = await this.flowRepository.findOne({ where: { id, userId } });
    if (!flow) {
      throw new NotFoundException('Flow not found');
    }

    flow.status = FlowStatus.INACTIVE;
    return this.flowRepository.save(flow);
  }
}
