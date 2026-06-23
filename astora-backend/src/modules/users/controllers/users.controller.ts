import { Controller, Get, Post, Put, Delete, Body, Param, UseGuards, Req } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { UsersService } from '../services/users.service';
import { AuthGuard } from '../../auth/guards/auth.guard';
import { Roles } from '../../../common/decorators/roles.decorator';
import { RolesGuard } from '../../auth/guards/rbac.guard';

@ApiTags('users')
@ApiBearerAuth()
@UseGuards(AuthGuard)
@Controller({ path: 'users', version: '1' })
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get()
  @Roles('admin', 'super_admin')
  @UseGuards(RolesGuard)
  @ApiOperation({ summary: 'Get all users (admin only)' })
  async findAll(@Body() query: { page?: number; limit?: number }) {
    return this.usersService.findAll(query.page, query.limit);
  }

  @Get('profile')
  @ApiOperation({ summary: 'Get current user profile' })
  async getProfile(@Req() req: any) {
    return this.usersService.findById(req.user.id);
  }

  @Get(':id')
  @Roles('admin', 'super_admin')
  @UseGuards(RolesGuard)
  @ApiOperation({ summary: 'Get user by ID' })
  async findOne(@Param('id') id: string) {
    return this.usersService.findById(id);
  }

  @Put('profile')
  @ApiOperation({ summary: 'Update current user profile' })
  async updateProfile(@Req() req: any, @Body() data: any) {
    return this.usersService.update(req.user.id, data);
  }
}
