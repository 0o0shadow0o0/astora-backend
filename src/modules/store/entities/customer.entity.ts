import { Entity, Column, ManyToOne, JoinColumn, OneToMany } from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';
import { BaseEntity } from '../../../common/entities/base.entity';
import { User } from '../../users/entities/user.entity';

export enum CustomerType {
  INDIVIDUAL = 'individual',
  BUSINESS = 'business',
}

@Entity('customers')
export class Customer extends BaseEntity {
  @ApiProperty({ example: 'John Doe' })
  @Column()
  name: string;

  @ApiProperty({ example: 'john@example.com' })
  @Column({ nullable: true })
  email?: string;

  @ApiProperty({ example: '+1234567890' })
  @Column({ nullable: true })
  phone?: string;

  @ApiProperty({ enum: CustomerType })
  @Column({
    type: 'enum',
    enum: CustomerType,
    default: CustomerType.INDIVIDUAL,
  })
  type: CustomerType;

  @ApiProperty({ example: 'ABC Corp', required: false })
  @Column({ nullable: true })
  company?: string;

  @ApiProperty({ example: '123 Main St', required: false })
  @Column({ nullable: true })
  address?: string;

  @ApiProperty({ example: 'New York', required: false })
  @Column({ nullable: true })
  city?: string;

  @ApiProperty({ example: 'NY', required: false })
  @Column({ nullable: true })
  state?: string;

  @ApiProperty({ example: '10001', required: false })
  @Column({ nullable: true })
  postalCode?: string;

  @ApiProperty({ example: 'USA', required: false })
  @Column({ nullable: true })
  country?: string;

  @ApiProperty({ example: 0 })
  @Column({ type: 'decimal', precision: 10, scale: 2, default: 0 })
  totalSpent: number;

  @ApiProperty({ example: 0 })
  @Column({ default: 0 })
  orderCount: number;

  @ApiProperty({ example: 0 })
  @Column({ default: 0 })
  points: number;

  @ApiProperty({ example: false })
  @Column({ default: false })
  isVip: boolean;

  @ApiProperty({ example: false })
  @Column({ default: false })
  isTaxExempt: boolean;

  @ApiProperty({ example: 'notes', required: false })
  @Column({ type: 'text', nullable: true })
  notes?: string;

  @Column({ type: 'jsonb', nullable: true })
  metadata?: Record<string, any>;

  @ManyToOne(() => User, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'user_id' })
  user: User;

  @Column()
  userId: string;
}
