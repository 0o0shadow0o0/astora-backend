import { Repository } from 'typeorm';
import { Device } from '../entities/device.entity';
export declare class DevicesService {
    private deviceRepository;
    constructor(deviceRepository: Repository<Device>);
    findByUser(userId: string): Promise<Device[]>;
    create(data: Partial<Device>): Promise<Device>;
    updateStatus(id: string, status: any): Promise<void>;
}
