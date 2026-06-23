import { BaseEntity } from '../../../common/entities/base.entity';
import { User } from '../../users/entities/user.entity';
import { Permission } from '../../permissions/entities/permission.entity';
export declare enum RoleType {
    SUPER_ADMIN = "super_admin",
    ADMIN = "admin",
    MANAGER = "manager",
    AGENT = "agent",
    USER = "user",
    GUEST = "guest"
}
export declare class Role extends BaseEntity {
    name: string;
    slug: string;
    description?: string;
    type: RoleType;
    isActive: boolean;
    isSystem: boolean;
    users: User[];
    permissions: Permission[];
}
