import { BaseEntity } from '../../../common/entities/base.entity';
import { User } from '../../users/entities/user.entity';
export declare enum CouponType {
    PERCENTAGE = "percentage",
    FIXED = "fixed",
    FREE_SHIPPING = "free_shipping"
}
export declare class Coupon extends BaseEntity {
    code: string;
    description?: string;
    type: CouponType;
    value: number;
    minOrderAmount?: number;
    maxDiscount?: number;
    usageLimit: number;
    usedCount: number;
    perUserLimit: number;
    startsAt: Date;
    expiresAt: Date;
    isActive: boolean;
    isFirstOrderOnly: boolean;
    applicableProducts?: string[];
    applicableCategories?: string[];
    user: User;
    userId: string;
}
