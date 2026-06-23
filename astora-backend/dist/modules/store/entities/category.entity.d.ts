import { BaseEntity } from '../../../common/entities/base.entity';
import { User } from '../../users/entities/user.entity';
export declare class Category extends BaseEntity {
    name: string;
    slug: string;
    description?: string;
    image?: string;
    sortOrder: number;
    isActive: boolean;
    parent?: Category;
    parentId?: string;
    children: Category[];
    user: User;
    userId: string;
}
