import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Device } from '../entities/device.entity';

@Injectable()
export class DevicesService {
  constructor(
    @InjectRepository(Device)
    private deviceRepository: Repository<Device>,
  ) {}

  async findByUser(userId: string): Promise<Device[]> {
    return this.deviceRepository.find({ where: { userId } });
  }

  async create(data: Partial<Device>): Promise<Device> {
    const device = this.deviceRepository.create(data);
    return this.deviceRepository.save(device);
  }

  async updateStatus(id: string, status: any): Promise<void> {
    await this.deviceRepository.update(id, { status });
  }
}
