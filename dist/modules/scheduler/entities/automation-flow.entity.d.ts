import { BaseEntity } from '../../../common/entities/base.entity';
import { User } from '../../users/entities/user.entity';
export declare enum FlowStatus {
    ACTIVE = "active",
    INACTIVE = "inactive",
    DRAFT = "draft"
}
export declare class AutomationFlow extends BaseEntity {
    name: string;
    description?: string;
    status: FlowStatus;
    trigger: Record<string, any>;
    actions: Record<string, any>[];
    conditions?: Record<string, any>[];
    executionsCount: number;
    successCount: number;
    failureCount: number;
    user: User;
    userId: string;
}
