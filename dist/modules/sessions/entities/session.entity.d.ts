import { BaseEntity } from '../../../common/entities/base.entity';
import { User } from '../../users/entities/user.entity';
import { Device } from '../../devices/entities/device.entity';
export declare enum SessionStatus {
    ACTIVE = "active",
    EXPIRED = "expired",
    REVOKED = "revoked"
}
export declare class Session extends BaseEntity {
    refreshToken: string;
    status: SessionStatus;
    expiresAt: Date;
    lastActivityAt?: Date;
    ipAddress?: string;
    userAgent?: string;
    user: User;
    userId: string;
    device?: Device;
    deviceId?: string;
}
