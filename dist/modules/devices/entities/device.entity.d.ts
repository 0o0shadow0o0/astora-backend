import { BaseEntity } from '../../../common/entities/base.entity';
import { User } from '../../users/entities/user.entity';
export declare enum DeviceType {
    DESKTOP = "desktop",
    MOBILE = "mobile",
    TABLET = "tablet",
    WEB = "web",
    API = "api"
}
export declare enum DeviceStatus {
    ACTIVE = "active",
    INACTIVE = "inactive",
    BLOCKED = "blocked"
}
export declare class Device extends BaseEntity {
    name: string;
    ipAddress: string;
    userAgent?: string;
    type: DeviceType;
    status: DeviceStatus;
    language?: string;
    os?: string;
    browser?: string;
    isCurrent: boolean;
    user: User;
    userId: string;
}
