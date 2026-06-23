"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
var SchedulerService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.SchedulerService = void 0;
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const bullmq_1 = require("@nestjs/bullmq");
const bullmq_2 = require("bullmq");
const scheduled_task_entity_1 = require("../entities/scheduled-task.entity");
const campaign_entity_1 = require("../entities/campaign.entity");
const automation_flow_entity_1 = require("../entities/automation-flow.entity");
let SchedulerService = SchedulerService_1 = class SchedulerService {
    constructor(taskRepository, campaignRepository, flowRepository, taskQueue, configService) {
        this.taskRepository = taskRepository;
        this.campaignRepository = campaignRepository;
        this.flowRepository = flowRepository;
        this.taskQueue = taskQueue;
        this.configService = configService;
        this.logger = new common_1.Logger(SchedulerService_1.name);
        this.initializeWorkers();
    }
    initializeWorkers() {
        const worker = new bullmq_2.Worker('scheduled-tasks', async (job) => {
            await this.processTask(job.data);
        }, {
            connection: {
                host: this.configService.get('REDIS_HOST', 'localhost'),
                port: this.configService.get('REDIS_PORT', 6379),
            },
            retryStrategy: (times) => {
                if (times > 3)
                    return null;
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
    async createTask(userId, data) {
        const task = this.taskRepository.create({
            ...data,
            userId,
            status: scheduled_task_entity_1.TaskStatus.PENDING,
        });
        const savedTask = await this.taskRepository.save(task);
        if (savedTask.scheduledAt <= new Date()) {
            await this.executeTask(savedTask);
        }
        else {
            await this.scheduleTask(savedTask);
        }
        return savedTask;
    }
    async updateTask(id, userId, data) {
        const task = await this.taskRepository.findOne({ where: { id, userId } });
        if (!task) {
            throw new common_1.NotFoundException('Task not found');
        }
        Object.assign(task, data);
        const updatedTask = await this.taskRepository.save(task);
        if (updatedTask.status === scheduled_task_entity_1.TaskStatus.PENDING) {
            await this.scheduleTask(updatedTask);
        }
        return updatedTask;
    }
    async cancelTask(id, userId) {
        const task = await this.taskRepository.findOne({ where: { id, userId } });
        if (!task) {
            throw new common_1.NotFoundException('Task not found');
        }
        task.status = scheduled_task_entity_1.TaskStatus.CANCELLED;
        await this.taskRepository.save(task);
        await this.taskQueue.remove(job.id);
    }
    async retryTask(id, userId) {
        const task = await this.taskRepository.findOne({ where: { id, userId } });
        if (!task) {
            throw new common_1.NotFoundException('Task not found');
        }
        task.status = scheduled_task_entity_1.TaskStatus.PENDING;
        task.retryCount = 0;
        task.errorMessage = undefined;
        return this.taskRepository.save(task);
    }
    async getTasks(userId, page = 1, limit = 20) {
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
    async getTaskById(id, userId) {
        const task = await this.taskRepository.findOne({ where: { id, userId } });
        if (!task) {
            throw new common_1.NotFoundException('Task not found');
        }
        return task;
    }
    async getTaskHistory(id, userId) {
        const task = await this.getTaskById(id, userId);
        return this.taskRepository.find({
            where: { userId },
            order: { createdAt: 'DESC' },
        });
    }
    async scheduleTask(task) {
        const delay = new Date(task.scheduledAt).getTime() - Date.now();
        if (task.type === scheduled_task_entity_1.TaskType.CRON && task.cronExpression) {
            this.logger.log(`Scheduling cron task: ${task.name}`);
        }
        else {
            await this.taskQueue.add(`task-${task.id}`, {
                type: task.type,
                data: task.payload,
                scheduledTaskId: task.id,
            }, {
                delay: Math.max(0, delay),
                attempts: task.maxRetries,
                timeout: task.timeoutSeconds * 1000,
                backoff: {
                    type: 'exponential',
                    delay: 1000,
                },
            });
        }
    }
    async processTask(payload) {
        const { scheduledTaskId, data } = payload;
        if (scheduledTaskId) {
            const task = await this.taskRepository.findOne({ where: { id: scheduledTaskId } });
            if (!task)
                return;
            task.status = scheduled_task_entity_1.TaskStatus.RUNNING;
            task.startedAt = new Date();
            await this.taskRepository.save(task);
            try {
                await this.executeTaskAction(task, data);
                task.status = scheduled_task_entity_1.TaskStatus.COMPLETED;
                task.completedAt = new Date();
                await this.taskRepository.save(task);
                if (task.isRecurring) {
                    await this.scheduleNextRecurring(task);
                }
            }
            catch (error) {
                task.retryCount += 1;
                task.errorMessage = error.message;
                if (task.retryCount >= task.maxRetries) {
                    task.status = scheduled_task_entity_1.TaskStatus.FAILED;
                }
                else {
                    task.status = scheduled_task_entity_1.TaskStatus.PENDING;
                }
                await this.taskRepository.save(task);
                throw error;
            }
        }
    }
    async executeTaskAction(task, data) {
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
    async scheduleNextRecurring(task) {
        let nextDate;
        switch (task.type) {
            case scheduled_task_entity_1.TaskType.DAILY:
                nextDate = new Date(task.scheduledAt);
                nextDate.setDate(nextDate.getDate() + 1);
                break;
            case scheduled_task_entity_1.TaskType.WEEKLY:
                nextDate = new Date(task.scheduledAt);
                nextDate.setDate(nextDate.getDate() + 7);
                break;
            case scheduled_task_entity_1.TaskType.MONTHLY:
                nextDate = new Date(task.scheduledAt);
                nextDate.setMonth(nextDate.getMonth() + 1);
                break;
            default:
                return;
        }
        if (task.recurringEndDate && nextDate > task.recurringEndDate) {
            task.status = scheduled_task_entity_1.TaskStatus.COMPLETED;
            await this.taskRepository.save(task);
            return;
        }
        task.scheduledAt = nextDate;
        task.status = scheduled_task_entity_1.TaskStatus.PENDING;
        await this.taskRepository.save(task);
        await this.scheduleTask(task);
    }
    async executeTask(task) {
        await this.taskQueue.add(`task-${task.id}`, {
            type: task.type,
            data: task.payload,
            scheduledTaskId: task.id,
        }, {
            attempts: task.maxRetries,
            timeout: task.timeoutSeconds * 1000,
        });
    }
    async createCampaign(userId, data) {
        const campaign = this.campaignRepository.create({
            ...data,
            userId,
            status: campaign_entity_1.CampaignStatus.DRAFT,
        });
        return this.campaignRepository.save(campaign);
    }
    async getCampaigns(userId, page = 1, limit = 20) {
        const [data, total] = await this.campaignRepository.findAndCount({
            where: { userId },
            order: { createdAt: 'DESC' },
            skip: (page - 1) * limit,
            take: limit,
        });
        return { data, total, page, limit, totalPages: Math.ceil(total / limit) };
    }
    async scheduleCampaign(id, userId, scheduledAt) {
        const campaign = await this.campaignRepository.findOne({ where: { id, userId } });
        if (!campaign) {
            throw new common_1.NotFoundException('Campaign not found');
        }
        campaign.status = campaign_entity_1.CampaignStatus.SCHEDULED;
        campaign.scheduledAt = scheduledAt;
        await this.campaignRepository.save(campaign);
        await this.taskQueue.add(`campaign-${id}`, { campaignId: id }, { delay: scheduledAt.getTime() - Date.now() });
        return campaign;
    }
    async startCampaign(id, userId) {
        const campaign = await this.campaignRepository.findOne({ where: { id, userId } });
        if (!campaign) {
            throw new common_1.NotFoundException('Campaign not found');
        }
        campaign.status = campaign_entity_1.CampaignStatus.RUNNING;
        campaign.startedAt = new Date();
        return this.campaignRepository.save(campaign);
    }
    async pauseCampaign(id, userId) {
        const campaign = await this.campaignRepository.findOne({ where: { id, userId } });
        if (!campaign) {
            throw new common_1.NotFoundException('Campaign not found');
        }
        campaign.status = campaign_entity_1.CampaignStatus.PAUSED;
        return this.campaignRepository.save(campaign);
    }
    async cancelCampaign(id, userId) {
        const campaign = await this.campaignRepository.findOne({ where: { id, userId } });
        if (!campaign) {
            throw new common_1.NotFoundException('Campaign not found');
        }
        campaign.status = campaign_entity_1.CampaignStatus.CANCELLED;
        return this.campaignRepository.save(campaign);
    }
    async createFlow(userId, data) {
        const flow = this.flowRepository.create({
            ...data,
            userId,
            status: automation_flow_entity_1.FlowStatus.DRAFT,
        });
        return this.flowRepository.save(flow);
    }
    async getFlows(userId) {
        return this.flowRepository.find({ where: { userId } });
    }
    async activateFlow(id, userId) {
        const flow = await this.flowRepository.findOne({ where: { id, userId } });
        if (!flow) {
            throw new common_1.NotFoundException('Flow not found');
        }
        flow.status = automation_flow_entity_1.FlowStatus.ACTIVE;
        return this.flowRepository.save(flow);
    }
    async deactivateFlow(id, userId) {
        const flow = await this.flowRepository.findOne({ where: { id, userId } });
        if (!flow) {
            throw new common_1.NotFoundException('Flow not found');
        }
        flow.status = automation_flow_entity_1.FlowStatus.INACTIVE;
        return this.flowRepository.save(flow);
    }
};
exports.SchedulerService = SchedulerService;
exports.SchedulerService = SchedulerService = SchedulerService_1 = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(scheduled_task_entity_1.ScheduledTask)),
    __param(1, (0, typeorm_1.InjectRepository)(campaign_entity_1.Campaign)),
    __param(2, (0, typeorm_1.InjectRepository)(automation_flow_entity_1.AutomationFlow)),
    __param(3, (0, bullmq_1.InjectQueue)('scheduled-tasks')),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository,
        bullmq_2.Queue,
        config_1.ConfigService])
], SchedulerService);
//# sourceMappingURL=scheduler.service.js.map