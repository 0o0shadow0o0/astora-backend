import {
  Entity,
  Column,
  ManyToMany,
  JoinTable,
  OneToMany,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';
import { BaseEntity } from '../../../common/entities/base.entity';
import { Role } from '../../roles/entities/role.entity';
import { Exclude } from 'class-transformer';

@Entity('users')
export class User extends BaseEntity {
  @ApiProperty({ example: 'john@example.com' })
  @Column({ unique: true })
  email: string;

  @ApiProperty({ example: 'John Doe' })
  @Column()
  name: string;

  @ApiProperty({ example: '+1234567890' })
  @Column({ unique: true, nullable: true })
  phone?: string;

  @ApiProperty({ example: 'username' })
  @Column({ unique: true })
  username: string;

  @Column()
  @Exclude()
  password: string;

  @ApiProperty({ example: 'avatar.jpg', required: false })
  @Column({ nullable: true })
  avatar?: string;

  @ApiProperty({ example: true })
  @Column({ default: true })
  isActive: boolean;

  @ApiProperty({ example: false })
  @Column({ default: false })
  isVerified: boolean;

  @ApiProperty({ example: '127.0.0.1', required: false })
  @Column({ nullable: true })
  lastLoginIp?: string;

  @ApiProperty({ required: false })
  @Column({ type: 'timestamp with time zone', nullable: true })
  lastLoginAt?: Date;

  @ApiProperty({ example: '+1234567890', required: false })
  @Column({ nullable: true })
  twoFactorSecret?: string;

  @ApiProperty({ example: false })
  @Column({ default: false })
  twoFactorEnabled: boolean;

  @ManyToMany(() => Role, (role) => role.users)
  @JoinTable({
    name: 'user_roles',
    joinColumn: { name: 'user_id', referencedColumnName: 'id' },
    inverseJoinColumn: { name: 'role_id', referencedColumnName: 'id' },
  })
  roles: Role[];

  @OneToMany(() => User, (user) => user.manager)
  subordinates: User[];

  @ManyToOne(() => User, (user) => user.subordinates, { nullable: true })
  @JoinColumn({ name: 'manager_id' })
  manager?: User;
}
