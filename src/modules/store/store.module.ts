import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Product } from './entities/product.entity';
import { Category } from './entities/category.entity';
import { Customer } from './entities/customer.entity';
import { Order, OrderItem } from './entities/order.entity';
import { Coupon } from './entities/coupon.entity';
import { StoreService } from './services/store.service';
import { StoreController } from './controllers/store.controller';

@Module({
  imports: [
    TypeOrmModule.forFeature([Product, Category, Customer, Order, OrderItem, Coupon]),
  ],
  controllers: [StoreController],
  providers: [StoreService],
  exports: [StoreService],
})
export class StoreModule {}
