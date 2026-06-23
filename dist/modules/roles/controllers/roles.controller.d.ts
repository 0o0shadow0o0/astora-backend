import { RoleService } from '../services/roles.service';
export declare class RoleController {
    private readonly roleService;
    constructor(roleService: RoleService);
    findAll(): Promise<import("../entities/role.entity").Role[]>;
    findOne(id: string): Promise<import("../entities/role.entity").Role>;
    create(data: any): Promise<import("../entities/role.entity").Role>;
    update(id: string, data: any): Promise<import("../entities/role.entity").Role>;
}
