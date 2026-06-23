import { BaseEntity } from '../../../common/entities/base.entity';
import { Role } from '../../roles/entities/role.entity';
export declare enum PermissionResource {
    USERS = "users",
    ROLES = "roles",
    PERMISSIONS = "permissions",
    DEVICES = "devices",
    SESSIONS = "sessions",
    WHATSAPP = "whatsapp",
    CONTACTS = "contacts",
    CHATS = "chats",
    MESSAGES = "messages",
    SCHEDULER = "scheduler",
    SMS = "sms",
    CALLS = "calls",
    AI = "ai",
    STORE = "store",
    NOTIFICATIONS = "notifications",
    AUDIT_LOGS = "audit_logs"
}
export declare enum PermissionAction {
    CREATE = "create",
    READ = "read",
    UPDATE = "update",
    DELETE = "delete",
    MANAGE = "manage"
}
export declare class Permission extends BaseEntity {
    name: string;
    slug: string;
    resource: PermissionResource;
    action: PermissionAction;
    description?: string;
    isActive: boolean;
    roles: Role[];
}
