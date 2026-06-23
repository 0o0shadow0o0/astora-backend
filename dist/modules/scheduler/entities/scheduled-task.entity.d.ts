import { BaseEntity } from '../../../common/entities/base.entity';
import { User } from '../../users/entities/user.entity';
export declare enum TaskType {
    ONE_TIME = "one_time",
    DAILY = "daily",
    WEEKLY = "weekly",
    MONTHLY = "monthly",
    YEARLY = "yearly",
    CRON = "cron",
    RECURRING = "recurring"
}
export declare enum TaskStatus {
    PENDING = "pending",
    RUNNING = "running",
    COMPLETED = "completed",
    FAILED = "failed",
    CANCELLED = "cancelled",
    PAUSED = "paused"
}
export declare enum TaskPriority {
    LOW = "low",
    NORMAL = "normal",
    HIGH = "high",
    CRITICAL = "critical"
}
export declare class ScheduledTask extends BaseEntity {
    name: string;
    description?: string;
    type: TaskType;
    status: TaskStatus;
    priority: TaskPriority;
    cronExpression?: string;
    scheduledAt: Date;
    startedAt?: Date;
    completedAt?: Date;
    maxRetries: number;
    retryCount: number;
    timeoutSeconds: number;
    payload: Record<string, any>;
    errorMessage?: string;
    isRecurring: boolean;
    recurringEndDate?: Date;
    user: User;
    userId: string;
}
