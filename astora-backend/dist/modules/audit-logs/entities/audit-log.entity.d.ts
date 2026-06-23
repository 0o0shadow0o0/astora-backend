import { BaseEntity } from '../../../common/entities/base.entity';
import { User } from '../../users/entities/user.entity';
export declare enum AuditAction {
    CREATE = "create",
    READ = "read",
    UPDATE = "update",
    DELETE = "delete",
    LOGIN = "login",
    LOGOUT = "logout",
    LOGIN_FAILED = "login_failed",
    PASSWORD_CHANGE = "password_change",
    PERMISSION_CHANGE = "permission_change",
    ROLE_CHANGE = "role_change",
    DEVICE_LINK = "device_link",
    DEVICE_UNLINK = "device_unlink",
    WHATSAPP_CONNECT = "whatsapp_connect",
    WHATSAPP_DISCONNECT = "whatsapp_disconnect",
    MESSAGE_SENT = "message_sent",
    MESSAGE_RECEIVED = "message_received",
    API_ACCESS = "api_access",
    SETTINGS_CHANGE = "settings_change"
}
export declare class AuditLog extends BaseEntity {
    action: AuditAction;
    entityType: string;
    entityId?: string;
    oldValues?: Record<string, any>;
    newValues?: Record<string, any>;
    ipAddress?: string;
    userAgent?: string;
    userId?: string;
    sessionId?: string;
    user?: User;
    metadata?: Record<string, any>;
}
