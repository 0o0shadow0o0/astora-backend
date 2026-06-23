import { Entity, Column, ManyToOne, JoinColumn, OneToMany } from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';
import { BaseEntity } from '../../../common/entities/base.entity';
import { User } from '../../users/entities/user.entity';
import { WhatsAppAccount } from '../../whatsapp/entities/whatsapp-account.entity';

export enum ContactType {
  PERSONAL = 'personal',
  BUSINESS = 'business',
  UNKNOWN = 'unknown',
}

@Entity('contacts')
export class Contact extends BaseEntity {
  @ApiProperty({ example: '+1234567890' })
  @Column()
  phone: string;

  @ApiProperty({ example: 'John Doe' })
  @Column()
  name: string;

  @ApiProperty({ example: 'john_profile.jpg', required: false })
  @Column({ nullable: true })
  profilePicture?: string;

  @ApiProperty({ example: 'Business', required: false })
  @Column({ nullable: true })
  businessName?: string;

  @ApiProperty({ example: 'business@example.com', required: false })
  @Column({ nullable: true })
  email?: string;

  @ApiProperty({ example: 'New York, USA', required: false })
  @Column({ nullable: true })
  address?: string;

  @ApiProperty({ example: 'Software Engineer', required: false })
  @Column({ nullable: true })
  about?: string;

  @ApiProperty({ example: 'Company Inc', required: false })
  @Column({ nullable: true })
  company?: string;

  @ApiProperty({ example: '+1234567890', required: false })
  @Column({ nullable: true })
  website?: string;

  @ApiProperty({ enum: ContactType })
  @Column({
    type: 'enum',
    enum: ContactType,
    default: ContactType.UNKNOWN,
  })
  type: ContactType;

  @ApiProperty({ example: false })
  @Column({ default: false })
  isBlocked: boolean;

  @ApiProperty({ example: false })
  @Column({ default: false })
  isMuted: boolean;

  @ApiProperty({ example: false })
  @Column({ default: false })
  isStarred: boolean;

  @ApiProperty({ example: false })
  @Column({ default: false })
  isArchived: boolean;

  @ApiProperty({ example: true })
  @Column({ default: true })
  isContact: boolean;

  @ApiProperty({ example: 'NOTES', required: false })
  @Column({ nullable: true })
  description?: string;

  @ManyToOne(() => User, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'user_id' })
  user: User;

  @Column()
  userId: string;

  @ManyToOne(() => WhatsAppAccount, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'whatsapp_account_id' })
  whatsappAccount: WhatsAppAccount;

  @Column()
  whatsappAccountId: string;
}
