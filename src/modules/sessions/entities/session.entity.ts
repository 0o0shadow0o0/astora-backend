import { Entity, Column, ManyToOne, JoinColumn } from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';
import { BaseEntity } from '../../../common/entities/base.entity';
import { User } from '../../users/entities/user.entity';
import { Device } from '../../devices/entities/device.entity';

export enum SessionStatus {
  ACTIVE = 'active',
  EXPIRED = 'expired',
  REVOKED = 'revoked',
}

@Entity('sessions')
export class Session extends BaseEntity {
  @ApiProperty()
  @Column()
  refreshToken: string;

  @ApiProperty({ enum: SessionStatus })
  @Column({
    type: 'enum',
    enum: SessionStatus,
    default: SessionStatus.ACTIVE,
  })
  status: SessionStatus;

  @ApiProperty()
  @Column({ type: 'timestamp with time zone' })
  expiresAt: Date;

  @ApiProperty({ required: false })
  @Column({ type: 'timestamp with time zone', nullable: true })
  lastActivityAt?: Date;

  @ApiProperty({ example: '192.168.1.1' })
  @Column({ nullable: true })
  ipAddress?: string;

  @ApiProperty({ example: 'en-US', required: false })
  @Column({ nullable: true })
  userAgent?: string;

  @ManyToOne(() => User, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'user_id' })
  user: User;

  @Column()
  userId: string;

  @ManyToOne(() => Device, { onDelete: 'SET NULL', nullable: true })
  @JoinColumn({ name: 'device_id' })
  device?: Device;

  @Column({ nullable: true })
  deviceId?: string;
}
