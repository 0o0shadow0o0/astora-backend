import { Entity, Column, ManyToOne, JoinColumn, OneToMany } from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';
import { BaseEntity } from '../../../common/entities/base.entity';
import { User } from '../../users/entities/user.entity';
import { Category } from './category.entity';

@Entity('products')
export class Product extends BaseEntity {
  @ApiProperty({ example: 'Wireless Headphones' })
  @Column()
  name: string;

  @ApiProperty({ example: 'Premium wireless headphones with noise cancellation' })
  @Column({ type: 'text', nullable: true })
  description?: string;

  @ApiProperty({ example: 'PROD-001' })
  @Column({ unique: true })
  sku: string;

  @ApiProperty({ example: 'wh-headphones-001' })
  @Column({ nullable: true })
  slug?: string;

  @ApiProperty({ example: 99.99 })
  @Column({ type: 'decimal', precision: 10, scale: 2 })
  price: number;

  @ApiProperty({ example: 79.99 })
  @Column({ type: 'decimal', precision: 10, scale: 2, nullable: true })
  salePrice?: number;

  @ApiProperty({ example: 100 })
  @Column({ default: 0 })
  stockQuantity: number;

  @ApiProperty({ example: 10 })
  @Column({ default: 0 })
  lowStockThreshold: number;

  @ApiProperty({ example: 'product.jpg', required: false })
  @Column({ nullable: true })
  image?: string;

  @ApiProperty({ example: ['image1.jpg', 'image2.jpg'], required: false })
  @Column({ type: 'text', array: true, nullable: true })
  images?: string[];

  @ApiProperty({ example: true })
  @Column({ default: true })
  isActive: boolean;

  @ApiProperty({ example: true })
  @Column({ default: true })
  isFeatured: boolean;

  @ApiProperty({ example: false })
  @Column({ default: false })
  isDigital: boolean;

  @ApiProperty({ example: 1.5 })
  @Column({ type: 'decimal', precision: 10, scale: 2, default: 0 })
  weight?: number;

  @ApiProperty({ example: 'cm' })
  @Column({ nullable: true })
  weightUnit?: string;

  @ApiProperty({ example: 100 })
  @Column({ nullable: true })
  width?: number;

  @ApiProperty({ example: 50 })
  @Column({ nullable: true })
  height?: number;

  @ApiProperty({ example: 20 })
  @Column({ nullable: true })
  depth?: number;

  @ApiProperty({ example: 'USD' })
  @Column({ default: 'USD' })
  currency: string;

  @Column({ type: 'jsonb', nullable: true })
  attributes?: Record<string, any>;

  @Column({ type: 'jsonb', nullable: true })
  tags?: string[];

  @ManyToOne(() => User, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'user_id' })
  user: User;

  @Column()
  userId: string;

  @ManyToOne(() => Category, (category) => category.products, { nullable: true })
  @JoinColumn({ name: 'category_id' })
  category?: Category;

  @Column({ nullable: true })
  categoryId?: string;
}
