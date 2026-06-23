import { Entity, Column, ManyToMany } from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';
import { BaseEntity } from '../../../common/entities/base.entity';
import { Role } from '../../roles/entities/role.entity';

export enum PermissionResource {
  USERS = 'users',
  ROLES = 'roles',
  PERMISSIONS = 'permissions',
  DEVICES = 'devices',
  SESSIONS = 'sessions',
  WHATSAPP = 'whatsapp',
  CONTACTS = 'contacts',
  CHATS = 'chats',
  MESSAGES = 'messages',
  SCHEDULER = 'scheduler',
  SMS = 'sms',
  CALLS = 'calls',
  AI = 'ai',
  STORE = 'store',
  NOTIFICATIONS = 'notifications',
  AUDIT_LOGS = 'audit_logs',
}

export enum PermissionAction {
  CREATE = 'create',
  READ = 'read',
  UPDATE = 'update',
  DELETE = 'delete',
  MANAGE = 'manage',
}

@Entity('permissions')
export class Permission extends BaseEntity {
  @ApiProperty({ example: 'Create Users' })
  @Column()
  name: string;

  @ApiProperty({ example: 'create_users' })
  @Column({ unique: true })
  slug: string;

  @ApiProperty({ enum: PermissionResource })
  @Column({
    type: 'enum',
    enum: PermissionResource,
  })
  resource: PermissionResource;

  @ApiProperty({ enum: PermissionAction })
  @Column({
    type: 'enum',
    enum: PermissionAction,
  })
  action: PermissionAction;

  @ApiProperty({ example: 'Permission to create users' })
  @Column({ nullable: true })
  description?: string;

  @ApiProperty({ example: true })
  @Column({ default: true })
  isActive: boolean;

  @ManyToMany(() => Role, (role) => role.permissions)
  roles: Role[];
}
