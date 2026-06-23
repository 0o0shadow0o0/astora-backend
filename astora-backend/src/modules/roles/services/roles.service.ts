import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Role } from '../entities/role.entity';

@Injectable()
export class RoleService {
  constructor(
    @InjectRepository(Role)
    private roleRepository: Repository<Role>,
  ) {}

  async findAll(): Promise<Role[]> {
    return this.roleRepository.find({ relations: ['permissions'] });
  }

  async findById(id: string): Promise<Role> {
    const role = await this.roleRepository.findOne({ where: { id }, relations: ['permissions'] });
    if (!role) throw new NotFoundException('Role not found');
    return role;
  }

  async findBySlug(slug: string): Promise<Role> {
    return this.roleRepository.findOne({ where: { slug }, relations: ['permissions'] });
  }

  async create(data: Partial<Role>): Promise<Role> {
    const role = this.roleRepository.create(data);
    return this.roleRepository.save(role);
  }

  async update(id: string, data: Partial<Role>): Promise<Role> {
    const role = await this.findById(id);
    Object.assign(role, data);
    return this.roleRepository.save(role);
  }

  async addPermission(roleId: string, permissionId: string): Promise<Role> {
    const role = await this.findById(roleId);
    // Add permission logic here
    return this.roleRepository.save(role);
  }
}
