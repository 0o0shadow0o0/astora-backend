import { Entity, Column, ManyToOne, JoinColumn, OneToMany } from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';
import { BaseEntity } from '../../../common/entities/base.entity';
import { User } from '../../users/entities/user.entity';

export enum WhatsAppProvider {
  BAILEYS = 'baileys',
  EVOLUTION_API = 'evolution_api',
  WPP_CONNECT = 'wpp_connect',
  META = 'meta',
}

export enum WhatsAppStatus {
  CONNECTED = 'connected',
  DISCONNECTED = 'disconnected',
  CONNECTING = 'connecting',
  RECONNECTING = 'reconnecting',
  QR_READY = 'qr_ready',
  ERROR = 'error',
}

@Entity('whatsapp_accounts')
export class WhatsAppAccount extends BaseEntity {
  @ApiProperty({ example: 'My Business WhatsApp' })
  @Column()
  name: string;

  @ApiProperty({ enum: WhatsAppProvider })
  @Column({
    type: 'enum',
    enum: WhatsAppProvider,
    default: WhatsAppProvider.BAILEYS,
  })
  provider: WhatsAppProvider;

  @ApiProperty({ enum: WhatsAppStatus })
  @Column({
    type: 'enum',
    enum: WhatsAppStatus,
    default: WhatsAppStatus.DISCONNECTED,
  })
  status: WhatsAppStatus;

  @ApiProperty({ example: '+1234567890' })
  @Column({ nullable: true })
  phoneNumber?: string;

  @ApiProperty({ example: 'Business Account', required: false })
  @Column({ nullable: true })
  businessName?: string;

  @ApiProperty({ example: 'Profile description', required: false })
  @Column({ nullable: true })
  profileDescription?: string;

  @ApiProperty({ example: 'profile.jpg', required: false })
  @Column({ nullable: true })
  profilePicture?: string;

  @ApiProperty({ example: false })
  @Column({ default: false })
  isBusiness: boolean;

  @ApiProperty({ example: false })
  @Column({ default: false })
  multiDevice: boolean;

  @ApiProperty({ example: true })
  @Column({ default: true })
  autoReconnect: boolean;

  @ApiProperty({ example: true })
  @Column({ default: true })
  syncMessages: boolean;

  @ApiProperty({ example: true })
  @Column({ default: true })
  syncContacts: boolean;

  @ApiProperty({ example: true })
  @Column({ default: true })
  syncPresence: boolean;

  @ApiProperty({ example: 30 })
  @Column({ default: 30 })
  reconnectInterval: number;

  @ApiProperty({ example: 5 })
  @Column({ default: 5 })
  maxReconnectAttempts: number;

  @ApiProperty({ required: false })
  @Column({ type: 'text', nullable: true })
  sessionData?: string;

  @ApiProperty({ required: false })
  @Column({ type: 'text', nullable: true })
  qrCode?: string;

  @ApiProperty({ required: false })
  @Column({ type: 'timestamp with time zone', nullable: true })
  qrExpiresAt?: Date;

  @ApiProperty({ required: false })
  @Column({ type: 'timestamp with time zone', nullable: true })
  lastConnectedAt?: Date;

  @ApiProperty({ required: false })
  @Column({ type: 'timestamp with time zone', nullable: true })
  lastDisconnectedAt?: Date;

  @ApiProperty({ example: 'Error message', required: false })
  @Column({ nullable: true })
  errorMessage?: string;

  @ManyToOne(() => User, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'user_id' })
  user: User;

  @Column()
  userId: string;

  @ManyToOne(() => User, { nullable: true })
  @JoinColumn({ name: 'assigned_to_id' })
  assignedTo?: User;

  @Column({ nullable: true })
  assignedToId?: string;
}
