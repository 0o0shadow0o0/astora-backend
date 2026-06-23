import { Entity, Column, ManyToOne, JoinColumn, OneToMany } from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';
import { BaseEntity } from '../../../common/entities/base.entity';
import { User } from '../../users/entities/user.entity';

@Entity('categories')
export class Category extends BaseEntity {
  @ApiProperty({ example: 'Electronics' })
  @Column()
  name: string;

  @ApiProperty({ example: 'electronics' })
  @Column({ unique: true })
  slug: string;

  @ApiProperty({ example: 'Electronic devices and accessories' })
  @Column({ type: 'text', nullable: true })
  description?: string;

  @ApiProperty({ example: 'category.jpg', required: false })
  @Column({ nullable: true })
  image?: string;

  @ApiProperty({ example: 0 })
  @Column({ default: 0 })
  sortOrder: number;

  @ApiProperty({ example: true })
  @Column({ default: true })
  isActive: boolean;

  @ManyToOne(() => Category, (category) => category.children, { nullable: true })
  @JoinColumn({ name: 'parent_id' })
  parent?: Category;

  @Column({ nullable: true })
  parentId?: string;

  @OneToMany(() => Category, (category) => category.parent)
  children: Category[];

  @ManyToOne(() => User, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'user_id' })
  user: User;

  @Column()
  userId: string;
}
