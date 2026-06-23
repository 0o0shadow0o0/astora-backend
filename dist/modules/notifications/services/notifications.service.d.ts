import { Repository } from 'typeorm';
import { Notification } from '../entities/notification.entity';
export declare class NotificationsService {
    private notificationRepository;
    constructor(notificationRepository: Repository<Notification>);
    createNotification(userId: string, data: Partial<Notification>): Promise<Notification>;
    getNotifications(userId: string, page?: number, limit?: number, unreadOnly?: boolean): Promise<any>;
    markAsRead(id: string, userId: string): Promise<Notification>;
    markAllAsRead(userId: string): Promise<void>;
    deleteNotification(id: string, userId: string): Promise<void>;
    getUnreadCount(userId: string): Promise<number>;
}
