import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  Query,
  UseGuards,
  Req,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { StoreService } from '../services/store.service';
import { AuthGuard } from '../../auth/guards/auth.guard';
import { IsOptional, IsString, IsNumber } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

class ProductQueryDto {
  @ApiPropertyOptional()
  @IsOptional()
  @IsNumber()
  page?: number;

  @ApiPropertyOptional()
  @IsOptional()
  @IsNumber()
  limit?: number;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  search?: string;
}

@ApiTags('store')
@ApiBearerAuth()
@UseGuards(AuthGuard)
@Controller({ path: 'store', version: '1' })
export class StoreController {
  constructor(private readonly storeService: StoreService) {}

  // Products
  @Post('products')
  @ApiOperation({ summary: 'Create a new product' })
  async createProduct(@Req() req: any, @Body() data: any) {
    return this.storeService.createProduct(req.user.id, data);
  }

  @Get('products')
  @ApiOperation({ summary: 'Get all products' })
  async getProducts(@Req() req: any, @Query() query: ProductQueryDto) {
    return this.storeService.getProducts(req.user.id, query.page, query.limit, query.search);
  }

  @Get('products/:id')
  @ApiOperation({ summary: 'Get product by ID' })
  async getProduct(@Param('id') id: string, @Req() req: any) {
    return this.storeService.getProduct(id, req.user.id);
  }

  @Put('products/:id')
  @ApiOperation({ summary: 'Update product' })
  async updateProduct(@Param('id') id: string, @Req() req: any, @Body() data: any) {
    return this.storeService.updateProduct(id, req.user.id, data);
  }

  @Delete('products/:id')
  @ApiOperation({ summary: 'Delete product' })
  async deleteProduct(@Param('id') id: string, @Req() req: any) {
    await this.storeService.deleteProduct(id, req.user.id);
    return { message: 'Product deleted successfully' };
  }

  @Put('products/:id/inventory')
  @ApiOperation({ summary: 'Update product inventory' })
  async updateInventory(@Param('id') id: string, @Req() req: any, @Body('quantity') quantity: number) {
    return this.storeService.updateInventory(id, req.user.id, quantity);
  }

  // Categories
  @Post('categories')
  @ApiOperation({ summary: 'Create a new category' })
  async createCategory(@Req() req: any, @Body() data: any) {
    return this.storeService.createCategory(req.user.id, data);
  }

  @Get('categories')
  @ApiOperation({ summary: 'Get all categories' })
  async getCategories(@Req() req: any) {
    return this.storeService.getCategories(req.user.id);
  }

  @Get('categories/:id')
  @ApiOperation({ summary: 'Get category by ID' })
  async getCategory(@Param('id') id: string, @Req() req: any) {
    return this.storeService.getCategory(id, req.user.id);
  }

  @Put('categories/:id')
  @ApiOperation({ summary: 'Update category' })
  async updateCategory(@Param('id') id: string, @Req() req: any, @Body() data: any) {
    return this.storeService.updateCategory(id, req.user.id, data);
  }

  @Delete('categories/:id')
  @ApiOperation({ summary: 'Delete category' })
  async deleteCategory(@Param('id') id: string, @Req() req: any) {
    await this.storeService.deleteCategory(id, req.user.id);
    return { message: 'Category deleted successfully' };
  }

  // Customers
  @Post('customers')
  @ApiOperation({ summary: 'Create a new customer' })
  async createCustomer(@Req() req: any, @Body() data: any) {
    return this.storeService.createCustomer(req.user.id, data);
  }

  @Get('customers')
  @ApiOperation({ summary: 'Get all customers' })
  async getCustomers(@Req() req: any, @Query() query: ProductQueryDto) {
    return this.storeService.getCustomers(req.user.id, query.page, query.limit, query.search);
  }

  @Get('customers/:id')
  @ApiOperation({ summary: 'Get customer by ID' })
  async getCustomer(@Param('id') id: string, @Req() req: any) {
    return this.storeService.getCustomer(id, req.user.id);
  }

  @Put('customers/:id')
  @ApiOperation({ summary: 'Update customer' })
  async updateCustomer(@Param('id') id: string, @Req() req: any, @Body() data: any) {
    return this.storeService.updateCustomer(id, req.user.id, data);
  }

  @Post('customers/:id/points')
  @ApiOperation({ summary: 'Add points to customer' })
  async addPoints(@Param('id') id: string, @Body('points') points: number) {
    return this.storeService.addCustomerPoints(id, points);
  }

  // Orders
  @Post('orders')
  @ApiOperation({ summary: 'Create a new order' })
  async createOrder(@Req() req: any, @Body() data: any) {
    return this.storeService.createOrder(req.user.id, data);
  }

  @Get('orders')
  @ApiOperation({ summary: 'Get all orders' })
  async getOrders(@Req() req: any, @Query() query: any) {
    return this.storeService.getOrders(req.user.id, query.page, query.limit, query.status);
  }

  @Get('orders/:id')
  @ApiOperation({ summary: 'Get order by ID' })
  async getOrder(@Param('id') id: string, @Req() req: any) {
    return this.storeService.getOrder(id, req.user.id);
  }

  @Put('orders/:id/status')
  @ApiOperation({ summary: 'Update order status' })
  async updateOrderStatus(@Param('id') id: string, @Req() req: any, @Body('status') status: string) {
    return this.storeService.updateOrderStatus(id, req.user.id, status);
  }

  // Coupons
  @Post('coupons')
  @ApiOperation({ summary: 'Create a new coupon' })
  async createCoupon(@Req() req: any, @Body() data: any) {
    return this.storeService.createCoupon(req.user.id, data);
  }

  @Get('coupons')
  @ApiOperation({ summary: 'Get all coupons' })
  async getCoupons(@Req() req: any) {
    return this.storeService.getCoupons(req.user.id);
  }

  @Post('coupons/validate')
  @ApiOperation({ summary: 'Validate coupon code' })
  async validateCoupon(@Req() req: any, @Body('code') code: string, @Body('orderTotal') orderTotal?: number) {
    return this.storeService.validateCoupon(code, req.user.id, orderTotal);
  }

  // Analytics
  @Get('analytics')
  @ApiOperation({ summary: 'Get store analytics' })
  async getAnalytics(@Req() req: any) {
    return this.storeService.getStoreAnalytics(req.user.id);
  }
}
