import { BaseEntity } from '../../../common/entities/base.entity';
import { User } from '../../users/entities/user.entity';
import { Customer } from './customer.entity';
export declare enum OrderStatus {
    PENDING = "pending",
    CONFIRMED = "confirmed",
    PROCESSING = "processing",
    SHIPPED = "shipped",
    DELIVERED = "delivered",
    CANCELLED = "cancelled",
    REFUNDED = "refunded",
    ON_HOLD = "on_hold"
}
export declare enum PaymentStatus {
    PENDING = "pending",
    PAID = "paid",
    FAILED = "failed",
    REFUNDED = "refunded",
    PARTIALLY_REFUNDED = "partially_refunded"
}
export declare class Order extends BaseEntity {
    orderNumber: string;
    status: OrderStatus;
    paymentStatus: PaymentStatus;
    subtotal: number;
    tax: number;
    shippingCost: number;
    discount: number;
    total: number;
    currency: string;
    paymentMethod?: string;
    paymentId?: string;
    notes?: string;
    shippingAddress?: string;
    shippingName?: string;
    shippingPhone?: string;
    shippedAt?: Date;
    deliveredAt?: Date;
    user?: User;
    userId?: string;
    customer?: Customer;
    customerId?: string;
    items: OrderItem[];
}
export declare class OrderItem extends BaseEntity {
    quantity: number;
    unitPrice: number;
    total: number;
    sku?: string;
    productName?: string;
    order: Order;
    orderId: string;
}
