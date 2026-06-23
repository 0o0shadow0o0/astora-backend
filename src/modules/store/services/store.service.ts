import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Like, FindOptionsWhere } from 'typeorm';
import { Product } from '../entities/product.entity';
import { Category } from '../entities/category.entity';
import { Customer } from '../entities/customer.entity';
import { Order, OrderItem } from '../entities/order.entity';
import { Coupon } from '../entities/coupon.entity';
import { PaginatedResponseDto } from '../../../common/dto/common.dto';

@Injectable()
export class StoreService {
  constructor(
    @InjectRepository(Product)
    private productRepository: Repository<Product>,
    @InjectRepository(Category)
    private categoryRepository: Repository<Category>,
    @InjectRepository(Customer)
    private customerRepository: Repository<Customer>,
    @InjectRepository(Order)
    private orderRepository: Repository<Order>,
    @InjectRepository(OrderItem)
    private orderItemRepository: Repository<OrderItem>,
    @InjectRepository(Coupon)
    private couponRepository: Repository<Coupon>,
  ) {}

  // Products
  async createProduct(userId: string, data: Partial<Product>): Promise<Product> {
    const product = this.productRepository.create({ ...data, userId });
    return this.productRepository.save(product);
  }

  async getProducts(userId: string, page = 1, limit = 20, search?: string): Promise<PaginatedResponseDto<Product>> {
    const where: FindOptionsWhere<Product> = { userId };
    if (search) {
      where.name = Like(`%${search}%`);
    }

    const [data, total] = await this.productRepository.findAndCount({
      where,
      relations: ['category'],
      order: { createdAt: 'DESC' },
      skip: (page - 1) * limit,
      take: limit,
    });

    return { data, total, page, limit, totalPages: Math.ceil(total / limit) };
  }

  async getProduct(id: string, userId: string): Promise<Product> {
    const product = await this.productRepository.findOne({ where: { id, userId } });
    if (!product) throw new NotFoundException('Product not found');
    return product;
  }

  async updateProduct(id: string, userId: string, data: Partial<Product>): Promise<Product> {
    const product = await this.getProduct(id, userId);
    Object.assign(product, data);
    return this.productRepository.save(product);
  }

  async deleteProduct(id: string, userId: string): Promise<void> {
    const product = await this.getProduct(id, userId);
    await this.productRepository.remove(product);
  }

  async updateInventory(id: string, userId: string, quantity: number): Promise<Product> {
    const product = await this.getProduct(id, userId);
    product.stockQuantity += quantity;
    return this.productRepository.save(product);
  }

  // Categories
  async createCategory(userId: string, data: Partial<Category>): Promise<Category> {
    const category = this.categoryRepository.create({ ...data, userId });
    return this.categoryRepository.save(category);
  }

  async getCategories(userId: string): Promise<Category[]> {
    return this.categoryRepository.find({
      where: { userId },
      relations: ['children'],
      order: { sortOrder: 'ASC' },
    });
  }

  async getCategory(id: string, userId: string): Promise<Category> {
    const category = await this.categoryRepository.findOne({ where: { id, userId } });
    if (!category) throw new NotFoundException('Category not found');
    return category;
  }

  async updateCategory(id: string, userId: string, data: Partial<Category>): Promise<Category> {
    const category = await this.getCategory(id, userId);
    Object.assign(category, data);
    return this.categoryRepository.save(category);
  }

  async deleteCategory(id: string, userId: string): Promise<void> {
    const category = await this.getCategory(id, userId);
    await this.categoryRepository.remove(category);
  }

  // Customers
  async createCustomer(userId: string, data: Partial<Customer>): Promise<Customer> {
    const customer = this.customerRepository.create({ ...data, userId });
    return this.customerRepository.save(customer);
  }

  async getCustomers(userId: string, page = 1, limit = 20, search?: string): Promise<PaginatedResponseDto<Customer>> {
    const where: FindOptionsWhere<Customer> = { userId };
    if (search) {
      where.name = Like(`%${search}%`);
    }

    const [data, total] = await this.customerRepository.findAndCount({
      where,
      order: { createdAt: 'DESC' },
      skip: (page - 1) * limit,
      take: limit,
    });

    return { data, total, page, limit, totalPages: Math.ceil(total / limit) };
  }

  async getCustomer(id: string, userId: string): Promise<Customer> {
    const customer = await this.customerRepository.findOne({ where: { id, userId } });
    if (!customer) throw new NotFoundException('Customer not found');
    return customer;
  }

  async updateCustomer(id: string, userId: string, data: Partial<Customer>): Promise<Customer> {
    const customer = await this.getCustomer(id, userId);
    Object.assign(customer, data);
    return this.customerRepository.save(customer);
  }

  async addCustomerPoints(id: string, points: number): Promise<Customer> {
    const customer = await this.customerRepository.findOne({ where: { id } });
    if (!customer) throw new NotFoundException('Customer not found');
    customer.points += points;
    return this.customerRepository.save(customer);
  }

  // Orders
  async createOrder(userId: string, data: {
    customerId?: string;
    items: { productId: string; quantity: number; unitPrice: number }[];
    shippingAddress?: string;
    shippingName?: string;
    shippingPhone?: string;
    notes?: string;
  }): Promise<Order> {
    const orderItems = data.items.map(item => {
      return this.orderItemRepository.create({
        quantity: item.quantity,
        unitPrice: item.unitPrice,
        total: item.quantity * item.unitPrice,
        productName: '',
        orderId: '',
      });
    });

    const subtotal = data.items.reduce((sum, item) => sum + (item.quantity * item.unitPrice), 0);

    const order = this.orderRepository.create({
      orderNumber: `ORD-${Date.now()}`,
      subtotal,
      total: subtotal,
      userId,
      customerId: data.customerId,
      shippingAddress: data.shippingAddress,
      shippingName: data.shippingName,
      shippingPhone: data.shippingPhone,
      notes: data.notes,
      items: orderItems,
    });

    const savedOrder = await this.orderRepository.save(order);

    orderItems.forEach(item => {
      item.orderId = savedOrder.id;
    });
    await this.orderItemRepository.save(orderItems);

    if (data.customerId) {
      const customer = await this.customerRepository.findOne({ where: { id: data.customerId } });
      if (customer) {
        customer.orderCount += 1;
        customer.totalSpent += subtotal;
        await this.customerRepository.save(customer);
      }
    }

    return savedOrder;
  }

  async getOrders(userId: string, page = 1, limit = 20, status?: string): Promise<PaginatedResponseDto<Order>> {
    const where: FindOptionsWhere<Order> = { userId };
    if (status) {
      where.status = status as any;
    }

    const [data, total] = await this.orderRepository.findAndCount({
      where,
      relations: ['items', 'customer'],
      order: { createdAt: 'DESC' },
      skip: (page - 1) * limit,
      take: limit,
    });

    return { data, total, page, limit, totalPages: Math.ceil(total / limit) };
  }

  async getOrder(id: string, userId: string): Promise<Order> {
    const order = await this.orderRepository.findOne({
      where: { id, userId },
      relations: ['items', 'customer'],
    });
    if (!order) throw new NotFoundException('Order not found');
    return order;
  }

  async updateOrderStatus(id: string, userId: string, status: any): Promise<Order> {
    const order = await this.getOrder(id, userId);
    order.status = status;
    return this.orderRepository.save(order);
  }

  // Coupons
  async createCoupon(userId: string, data: Partial<Coupon>): Promise<Coupon> {
    const coupon = this.couponRepository.create({ ...data, userId });
    return this.couponRepository.save(coupon);
  }

  async getCoupons(userId: string): Promise<Coupon[]> {
    return this.couponRepository.find({ where: { userId } });
  }

  async validateCoupon(code: string, userId: string, orderTotal?: number): Promise<Coupon | null> {
    const coupon = await this.couponRepository.findOne({
      where: { code, userId, isActive: true },
    });

    if (!coupon) return null;
    if (new Date() < coupon.startsAt || new Date() > coupon.expiresAt) return null;
    if (coupon.usedCount >= coupon.usageLimit) return null;
    if (coupon.minOrderAmount && orderTotal && orderTotal < coupon.minOrderAmount) return null;

    return coupon;
  }

  async applyCoupon(code: string): Promise<number> {
    const coupon = await this.couponRepository.findOne({ where: { code } });
    if (!coupon) throw new NotFoundException('Coupon not found');
    
    coupon.usedCount += 1;
    await this.couponRepository.save(coupon);
    
    return coupon.value;
  }

  // Analytics
  async getStoreAnalytics(userId: string): Promise<any> {
    const totalProducts = await this.productRepository.count({ where: { userId } });
    const totalCustomers = await this.customerRepository.count({ where: { userId } });
    const totalOrders = await this.orderRepository.count({ where: { userId } });
    const totalRevenue = await this.orderRepository
      .createQueryBuilder('order')
      .select('SUM(order.total)', 'total')
      .where('order.userId = :userId', { userId })
      .getRawOne();

    const lowStockProducts = await this.productRepository.find({
      where: { userId },
    }).then(products => products.filter(p => p.stockQuantity <= p.lowStockThreshold));

    return {
      totalProducts,
      totalCustomers,
      totalOrders,
      totalRevenue: totalRevenue?.total || 0,
      lowStockProducts: lowStockProducts.length,
      averageOrderValue: totalOrders > 0 ? (totalRevenue?.total || 0) / totalOrders : 0,
    };
  }
}
