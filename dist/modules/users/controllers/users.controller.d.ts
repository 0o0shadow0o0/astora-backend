import { UsersService } from '../services/users.service';
export declare class UsersController {
    private readonly usersService;
    constructor(usersService: UsersService);
    findAll(query: {
        page?: number;
        limit?: number;
    }): Promise<any>;
    getProfile(req: any): Promise<import("../entities/user.entity").User>;
    findOne(id: string): Promise<import("../entities/user.entity").User>;
    updateProfile(req: any, data: any): Promise<import("../entities/user.entity").User>;
}
