import { Repository } from 'typeorm';
import { Role } from '../entities/role.entity';
export declare class RoleService {
    private roleRepository;
    constructor(roleRepository: Repository<Role>);
    findAll(): Promise<Role[]>;
    findById(id: string): Promise<Role>;
    findBySlug(slug: string): Promise<Role>;
    create(data: Partial<Role>): Promise<Role>;
    update(id: string, data: Partial<Role>): Promise<Role>;
    addPermission(roleId: string, permissionId: string): Promise<Role>;
}
