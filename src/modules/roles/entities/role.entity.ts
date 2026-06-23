import { Entity, Column, ManyToMany, JoinTable } from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';
import { BaseEntity } from '../../../common/entities/base.entity';
import { User } from '../../users/entities/user.entity';
import { Permission } from '../../permissions/entities/permission.entity';

export enum RoleType {
  SUPER_ADMIN = 'super_admin',
  ADMIN = 'admin',
  MANAGER = 'manager',
  AGENT = 'agent',
  USER = 'user',
  GUEST = 'guest',
}

@Entity('roles')
export class Role extends BaseEntity {
  @ApiProperty({ example: 'Admin' })
  @Column()
  name: string;

  @ApiProperty({ example: 'admin' })
  @Column({ unique: true })
  slug: string;

  @ApiProperty({ example: 'System administrator role' })
  @Column({ nullable: true })
  description?: string;

  @ApiProperty({ enum: RoleType })
  @Column({
    type: 'enum',
    enum: RoleType,
    default: RoleType.USER,
  })
  type: RoleType;

  @ApiProperty({ example: true })
  @Column({ default: true })
  isActive: boolean;

  @ApiProperty({ example: false })
  @Column({ default: false })
  isSystem: boolean;

  @ManyToMany(() => User, (user) => user.roles)
  users: User[];

  @ManyToMany(() => Permission, (permission) => permission.roles)
  @JoinTable({
    name: 'role_permissions',
    joinColumn: { name: 'role_id', referencedColumnName: 'id' },
    inverseJoinColumn: { name: 'permission_id', referencedColumnName: 'id' },
  })
  permissions: Permission[];
}
