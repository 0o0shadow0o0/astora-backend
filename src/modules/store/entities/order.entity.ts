import { Entity, Column, ManyToOne, JoinColumn, OneToMany } from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';
import { BaseEntity } from '../../../common/entities/base.entity';
import { User } from '../../users/entities/user.entity';
import { Customer } from './customer.entity';

export enum OrderStatus {
  PENDING = 'pending',
  CONFIRMED = 'confirmed',
  PROCESSING = 'processing',
  SHIPPED = 'shipped',
  DELIVERED = 'delivered',
  CANCELLED = 'cancelled',
  REFUNDED = 'refunded',
  ON_HOLD = 'on_hold',
}

export enum PaymentStatus {
  PENDING = 'pending',
  PAID = 'paid',
  FAILED = 'failed',
  REFUNDED = 'refunded',
  PARTIALLY_REFUNDED = 'partially_refunded',
}

@Entity('orders')
export class Order extends BaseEntity {
  @ApiProperty({ example: 'ORD-2024-001' })
  @Column({ unique: true })
  orderNumber: string;

  @ApiProperty({ enum: OrderStatus })
  @Column({
    type: 'enum',
    enum: OrderStatus,
    default: OrderStatus.PENDING,
  })
  status: OrderStatus;

  @ApiProperty({ enum: PaymentStatus })
  @Column({
    type: 'enum',
    enum: PaymentStatus,
    default: PaymentStatus.PENDING,
  })
  paymentStatus: PaymentStatus;

  @ApiProperty({ example: 199.99 })
  @Column({ type: 'decimal', precision: 10, scale: 2 })
  subtotal: number;

  @ApiProperty({ example: 20.0 })
  @Column({ type: 'decimal', precision: 10, scale: 2, default: 0 })
  tax: number;

  @ApiProperty({ example: 10.0 })
  @Column({ type: 'decimal', precision: 10, scale: 2, default: 0 })
  shippingCost: number;

  @ApiProperty({ example: 5.0 })
  @Column({ type: 'decimal', precision: 10, scale: 2, default: 0 })
  discount: number;

  @ApiProperty({ example: 224.99 })
  @Column({ type: 'decimal', precision: 10, scale: 2 })
  total: number;

  @ApiProperty({ example: 'USD' })
  @Column({ default: 'USD' })
  currency: string;

  @ApiProperty({ example: 'card', required: false })
  @Column({ nullable: true })
  paymentMethod?: string;

  @ApiProperty({ example: 'txn_123', required: false })
  @Column({ nullable: true })
  paymentId?: string;

  @ApiProperty({ example: 'Customer notes', required: false })
  @Column({ type: 'text', nullable: true })
  notes?: string;

  @ApiProperty({ example: '123 Main St', required: false })
  @Column({ nullable: true })
  shippingAddress?: string;

  @ApiProperty({ example: 'John Doe', required: false })
  @Column({ nullable: true })
  shippingName?: string;

  @ApiProperty({ example: '+1234567890', required: false })
  @Column({ nullable: true })
  shippingPhone?: string;

  @ApiProperty({ required: false })
  @Column({ type: 'timestamp with time zone', nullable: true })
  shippedAt?: Date;

  @ApiProperty({ required: false })
  @Column({ type: 'timestamp with time zone', nullable: true })
  deliveredAt?: Date;

  @ManyToOne(() => User, { onDelete: 'SET NULL', nullable: true })
  @JoinColumn({ name: 'user_id' })
  user?: User;

  @Column({ nullable: true })
  userId?: string;

  @ManyToOne(() => Customer, (customer) => customer.orders, { nullable: true })
  @JoinColumn({ name: 'customer_id' })
  customer?: Customer;

  @Column({ nullable: true })
  customerId?: string;

  @OneToMany(() => OrderItem, (item) => item.order)
  items: OrderItem[];
}

@Entity('order_items')
export class OrderItem extends BaseEntity {
  @ApiProperty({ example: 2 })
  @Column()
  quantity: number;

  @ApiProperty({ example: 49.99 })
  @Column({ type: 'decimal', precision: 10, scale: 2 })
  unitPrice: number;

  @ApiProperty({ example: 99.98 })
  @Column({ type: 'decimal', precision: 10, scale: 2 })
  total: number;

  @ApiProperty({ example: 'SKU-001' })
  @Column({ nullable: true })
  sku?: string;

  @ApiProperty({ example: 'Product Name', required: false })
  @Column({ nullable: true })
  productName?: string;

  @ManyToOne(() => Order, (order) => order.items, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'order_id' })
  order: Order;

  @Column()
  orderId: string;
}
