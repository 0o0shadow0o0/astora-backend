import { Entity, Column, ManyToOne, JoinColumn } from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';
import { BaseEntity } from '../../../common/entities/base.entity';
import { User } from '../../users/entities/user.entity';

export enum DeviceType {
  DESKTOP = 'desktop',
  MOBILE = 'mobile',
  TABLET = 'tablet',
  WEB = 'web',
  API = 'api',
}

export enum DeviceStatus {
  ACTIVE = 'active',
  INACTIVE = 'inactive',
  BLOCKED = 'blocked',
}

@Entity('devices')
export class Device extends BaseEntity {
  @ApiProperty({ example: 'Chrome Browser' })
  @Column()
  name: string;

  @ApiProperty({ example: '192.168.1.1' })
  @Column()
  ipAddress: string;

  @ApiProperty({ example: 'Mozilla/5.0...' })
  @Column({ nullable: true })
  userAgent?: string;

  @ApiProperty({ enum: DeviceType })
  @Column({
    type: 'enum',
    enum: DeviceType,
    default: DeviceType.DESKTOP,
  })
  type: DeviceType;

  @ApiProperty({ enum: DeviceStatus })
  @Column({
    type: 'enum',
    enum: DeviceStatus,
    default: DeviceStatus.ACTIVE,
  })
  status: DeviceStatus;

  @ApiProperty({ example: 'en-US' })
  @Column({ nullable: true })
  language?: string;

  @ApiProperty({ example: 'Mac OS X', required: false })
  @Column({ nullable: true })
  os?: string;

  @ApiProperty({ example: 'Chrome 120', required: false })
  @Column({ nullable: true })
  browser?: string;

  @ApiProperty({ example: false })
  @Column({ default: false })
  isCurrent: boolean;

  @ManyToOne(() => User, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'user_id' })
  user: User;

  @Column()
  userId: string;
}
