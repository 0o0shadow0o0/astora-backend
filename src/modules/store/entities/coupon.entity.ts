import { Entity, Column, ManyToOne, JoinColumn } from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';
import { BaseEntity } from '../../../common/entities/base.entity';
import { User } from '../../users/entities/user.entity';

export enum CouponType {
  PERCENTAGE = 'percentage',
  FIXED = 'fixed',
  FREE_SHIPPING = 'free_shipping',
}

@Entity('coupons')
export class Coupon extends BaseEntity {
  @ApiProperty({ example: 'SUMMER20' })
  @Column({ unique: true })
  code: string;

  @ApiProperty({ example: 'Summer Sale 20% off' })
  @Column({ nullable: true })
  description?: string;

  @ApiProperty({ enum: CouponType })
  @Column({
    type: 'enum',
    enum: CouponType,
    default: CouponType.PERCENTAGE,
  })
  type: CouponType;

  @ApiProperty({ example: 20 })
  @Column({ type: 'decimal', precision: 10, scale: 2 })
  value: number;

  @ApiProperty({ example: 100.0 })
  @Column({ type: 'decimal', precision: 10, scale: 2, nullable: true })
  minOrderAmount?: number;

  @ApiProperty({ example: 50.0 })
  @Column({ type: 'decimal', precision: 10, scale: 2, nullable: true })
  maxDiscount?: number;

  @ApiProperty({ example: 100 })
  @Column()
  usageLimit: number;

  @ApiProperty({ example: 50 })
  @Column({ default: 0 })
  usedCount: number;

  @ApiProperty({ example: 1 })
  @Column({ default: 1 })
  perUserLimit: number;

  @ApiProperty()
  @Column({ type: 'timestamp with time zone' })
  startsAt: Date;

  @ApiProperty()
  @Column({ type: 'timestamp with time zone' })
  expiresAt: Date;

  @ApiProperty({ example: true })
  @Column({ default: true })
  isActive: boolean;

  @ApiProperty({ example: false })
  @Column({ default: false })
  isFirstOrderOnly: boolean;

  @ApiProperty({ example: ['product_1', 'product_2'], required: false })
  @Column({ type: 'text', array: true, nullable: true })
  applicableProducts?: string[];

  @ApiProperty({ example: ['category_1'], required: false })
  @Column({ type: 'text', array: true, nullable: true })
  applicableCategories?: string[];

  @ManyToOne(() => User, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'user_id' })
  user: User;

  @Column()
  userId: string;
}
