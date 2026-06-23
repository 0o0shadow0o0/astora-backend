import { Controller, Get, Post, Put, Param, Body, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { RoleService } from '../services/roles.service';
import { AuthGuard } from '../../auth/guards/auth.guard';
import { Roles } from '../../../common/decorators/roles.decorator';
import { RolesGuard } from '../../auth/guards/rbac.guard';

@ApiTags('roles')
@ApiBearerAuth()
@UseGuards(AuthGuard, RolesGuard)
@Controller({ path: 'roles', version: '1' })
export class RoleController {
  constructor(private readonly roleService: RoleService) {}

  @Get()
  @Roles('admin', 'super_admin')
  @ApiOperation({ summary: 'Get all roles' })
  async findAll() {
    return this.roleService.findAll();
  }

  @Get(':id')
  @Roles('admin', 'super_admin')
  @ApiOperation({ summary: 'Get role by ID' })
  async findOne(@Param('id') id: string) {
    return this.roleService.findById(id);
  }

  @Post()
  @Roles('super_admin')
  @ApiOperation({ summary: 'Create a new role' })
  async create(@Body() data: any) {
    return this.roleService.create(data);
  }

  @Put(':id')
  @Roles('super_admin')
  @ApiOperation({ summary: 'Update role' })
  async update(@Param('id') id: string, @Body() data: any) {
    return this.roleService.update(id, data);
  }
}
