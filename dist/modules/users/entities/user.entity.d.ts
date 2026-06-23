import { BaseEntity } from '../../../common/entities/base.entity';
import { Role } from '../../roles/entities/role.entity';
export declare class User extends BaseEntity {
    email: string;
    name: string;
    phone?: string;
    username: string;
    password: string;
    avatar?: string;
    isActive: boolean;
    isVerified: boolean;
    lastLoginIp?: string;
    lastLoginAt?: Date;
    twoFactorSecret?: string;
    twoFactorEnabled: boolean;
    roles: Role[];
    subordinates: User[];
    manager?: User;
}
