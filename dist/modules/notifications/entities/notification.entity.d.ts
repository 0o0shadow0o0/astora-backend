import { BaseEntity } from '../../../common/entities/base.entity';
import { User } from '../../users/entities/user.entity';
export declare enum NotificationType {
    WHATSAPP_MESSAGE = "whatsapp_message",
    WHATSAPP_STATUS = "whatsapp_status",
    SMS = "sms",
    CALL = "call",
    ORDER = "order",
    PAYMENT = "payment",
    TASK = "task",
    SYSTEM = "system",
    MARKETING = "marketing"
}
export declare enum NotificationChannel {
    PUSH = "push",
    EMAIL = "email",
    SMS = "sms",
    WHATSAPP = "whatsapp",
    IN_APP = "in_app"
}
export declare enum NotificationStatus {
    PENDING = "pending",
    SENT = "sent",
    DELIVERED = "delivered",
    READ = "read",
    FAILED = "failed"
}
export declare class Notification extends BaseEntity {
    title: string;
    message: string;
    type: NotificationType;
    channels: NotificationChannel[];
    status: NotificationStatus;
    isRead: boolean;
    readAt?: Date;
    referenceId?: string;
    icon?: string;
    color?: string;
    data?: Record<string, any>;
    user: User;
    userId: string;
}
