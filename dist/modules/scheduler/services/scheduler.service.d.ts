import { ConfigService } from '@nestjs/config';
import { Repository } from 'typeorm';
import { Queue } from 'bullmq';
import { ScheduledTask } from '../entities/scheduled-task.entity';
import { Campaign } from '../entities/campaign.entity';
import { AutomationFlow } from '../entities/automation-flow.entity';
export interface TaskPayload {
    type: string;
    data: Record<string, any>;
    scheduledTaskId?: string;
    retryCount?: number;
}
export declare class SchedulerService {
    private taskRepository;
    private campaignRepository;
    private flowRepository;
    private taskQueue;
    private configService;
    private readonly logger;
    constructor(taskRepository: Repository<ScheduledTask>, campaignRepository: Repository<Campaign>, flowRepository: Repository<AutomationFlow>, taskQueue: Queue, configService: ConfigService);
    private initializeWorkers;
    createTask(userId: string, data: Partial<ScheduledTask>): Promise<ScheduledTask>;
    updateTask(id: string, userId: string, data: Partial<ScheduledTask>): Promise<ScheduledTask>;
    cancelTask(id: string, userId: string): Promise<void>;
    retryTask(id: string, userId: string): Promise<ScheduledTask>;
    getTasks(userId: string, page?: number, limit?: number): Promise<any>;
    getTaskById(id: string, userId: string): Promise<ScheduledTask>;
    getTaskHistory(id: string, userId: string): Promise<any[]>;
    private scheduleTask;
    private processTask;
    private executeTaskAction;
    private scheduleNextRecurring;
    private executeTask;
    createCampaign(userId: string, data: Partial<Campaign>): Promise<Campaign>;
    getCampaigns(userId: string, page?: number, limit?: number): Promise<any>;
    scheduleCampaign(id: string, userId: string, scheduledAt: Date): Promise<Campaign>;
    startCampaign(id: string, userId: string): Promise<Campaign>;
    pauseCampaign(id: string, userId: string): Promise<Campaign>;
    cancelCampaign(id: string, userId: string): Promise<Campaign>;
    createFlow(userId: string, data: Partial<AutomationFlow>): Promise<AutomationFlow>;
    getFlows(userId: string): Promise<AutomationFlow[]>;
    activateFlow(id: string, userId: string): Promise<AutomationFlow>;
    deactivateFlow(id: string, userId: string): Promise<AutomationFlow>;
}
