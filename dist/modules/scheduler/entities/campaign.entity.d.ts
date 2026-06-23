import { BaseEntity } from '../../../common/entities/base.entity';
import { User } from '../../users/entities/user.entity';
import { WhatsAppAccount } from '../../whatsapp/entities/whatsapp-account.entity';
export declare enum CampaignType {
    WHATSAPP = "whatsapp",
    SMS = "sms",
    BOTH = "both"
}
export declare enum CampaignStatus {
    DRAFT = "draft",
    SCHEDULED = "scheduled",
    RUNNING = "running",
    COMPLETED = "completed",
    PAUSED = "paused",
    CANCELLED = "cancelled",
    FAILED = "failed"
}
export declare class Campaign extends BaseEntity {
    name: string;
    description?: string;
    type: CampaignType;
    status: CampaignStatus;
    message: string;
    mediaUrl?: string;
    scheduledAt?: Date;
    startedAt?: Date;
    completedAt?: Date;
    totalRecipients: number;
    sentCount: number;
    deliveredCount: number;
    readCount: number;
    failedCount: number;
    optedOutCount: number;
    user: User;
    userId: string;
    whatsappAccount?: WhatsAppAccount;
    whatsappAccountId?: string;
}
