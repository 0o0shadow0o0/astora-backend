import { BaseEntity } from '../../../common/entities/base.entity';
import { User } from '../../users/entities/user.entity';
export declare enum CustomerType {
    INDIVIDUAL = "individual",
    BUSINESS = "business"
}
export declare class Customer extends BaseEntity {
    name: string;
    email?: string;
    phone?: string;
    type: CustomerType;
    company?: string;
    address?: string;
    city?: string;
    state?: string;
    postalCode?: string;
    country?: string;
    totalSpent: number;
    orderCount: number;
    points: number;
    isVip: boolean;
    isTaxExempt: boolean;
    notes?: string;
    metadata?: Record<string, any>;
    user: User;
    userId: string;
}
