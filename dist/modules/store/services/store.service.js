"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.StoreService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const product_entity_1 = require("../entities/product.entity");
const category_entity_1 = require("../entities/category.entity");
const customer_entity_1 = require("../entities/customer.entity");
const order_entity_1 = require("../entities/order.entity");
const coupon_entity_1 = require("../entities/coupon.entity");
let StoreService = class StoreService {
    constructor(productRepository, categoryRepository, customerRepository, orderRepository, orderItemRepository, couponRepository) {
        this.productRepository = productRepository;
        this.categoryRepository = categoryRepository;
        this.customerRepository = customerRepository;
        this.orderRepository = orderRepository;
        this.orderItemRepository = orderItemRepository;
        this.couponRepository = couponRepository;
    }
    async createProduct(userId, data) {
        const product = this.productRepository.create({ ...data, userId });
        return this.productRepository.save(product);
    }
    async getProducts(userId, page = 1, limit = 20, search) {
        const where = { userId };
        if (search) {
            where.name = (0, typeorm_2.Like)(`%${search}%`);
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
    async getProduct(id, userId) {
        const product = await this.productRepository.findOne({ where: { id, userId } });
        if (!product)
            throw new common_1.NotFoundException('Product not found');
        return product;
    }
    async updateProduct(id, userId, data) {
        const product = await this.getProduct(id, userId);
        Object.assign(product, data);
        return this.productRepository.save(product);
    }
    async deleteProduct(id, userId) {
        const product = await this.getProduct(id, userId);
        await this.productRepository.remove(product);
    }
    async updateInventory(id, userId, quantity) {
        const product = await this.getProduct(id, userId);
        product.stockQuantity += quantity;
        return this.productRepository.save(product);
    }
    async createCategory(userId, data) {
        const category = this.categoryRepository.create({ ...data, userId });
        return this.categoryRepository.save(category);
    }
    async getCategories(userId) {
        return this.categoryRepository.find({
            where: { userId },
            relations: ['children'],
            order: { sortOrder: 'ASC' },
        });
    }
    async getCategory(id, userId) {
        const category = await this.categoryRepository.findOne({ where: { id, userId } });
        if (!category)
            throw new common_1.NotFoundException('Category not found');
        return category;
    }
    async updateCategory(id, userId, data) {
        const category = await this.getCategory(id, userId);
        Object.assign(category, data);
        return this.categoryRepository.save(category);
    }
    async deleteCategory(id, userId) {
        const category = await this.getCategory(id, userId);
        await this.categoryRepository.remove(category);
    }
    async createCustomer(userId, data) {
        const customer = this.customerRepository.create({ ...data, userId });
        return this.customerRepository.save(customer);
    }
    async getCustomers(userId, page = 1, limit = 20, search) {
        const where = { userId };
        if (search) {
            where.name = (0, typeorm_2.Like)(`%${search}%`);
        }
        const [data, total] = await this.customerRepository.findAndCount({
            where,
            order: { createdAt: 'DESC' },
            skip: (page - 1) * limit,
            take: limit,
        });
        return { data, total, page, limit, totalPages: Math.ceil(total / limit) };
    }
    async getCustomer(id, userId) {
        const customer = await this.customerRepository.findOne({ where: { id, userId } });
        if (!customer)
            throw new common_1.NotFoundException('Customer not found');
        return customer;
    }
    async updateCustomer(id, userId, data) {
        const customer = await this.getCustomer(id, userId);
        Object.assign(customer, data);
        return this.customerRepository.save(customer);
    }
    async addCustomerPoints(id, points) {
        const customer = await this.customerRepository.findOne({ where: { id } });
        if (!customer)
            throw new common_1.NotFoundException('Customer not found');
        customer.points += points;
        return this.customerRepository.save(customer);
    }
    async createOrder(userId, data) {
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
    async getOrders(userId, page = 1, limit = 20, status) {
        const where = { userId };
        if (status) {
            where.status = status;
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
    async getOrder(id, userId) {
        const order = await this.orderRepository.findOne({
            where: { id, userId },
            relations: ['items', 'customer'],
        });
        if (!order)
            throw new common_1.NotFoundException('Order not found');
        return order;
    }
    async updateOrderStatus(id, userId, status) {
        const order = await this.getOrder(id, userId);
        order.status = status;
        return this.orderRepository.save(order);
    }
    async createCoupon(userId, data) {
        const coupon = this.couponRepository.create({ ...data, userId });
        return this.couponRepository.save(coupon);
    }
    async getCoupons(userId) {
        return this.couponRepository.find({ where: { userId } });
    }
    async validateCoupon(code, userId, orderTotal) {
        const coupon = await this.couponRepository.findOne({
            where: { code, userId, isActive: true },
        });
        if (!coupon)
            return null;
        if (new Date() < coupon.startsAt || new Date() > coupon.expiresAt)
            return null;
        if (coupon.usedCount >= coupon.usageLimit)
            return null;
        if (coupon.minOrderAmount && orderTotal && orderTotal < coupon.minOrderAmount)
            return null;
        return coupon;
    }
    async applyCoupon(code) {
        const coupon = await this.couponRepository.findOne({ where: { code } });
        if (!coupon)
            throw new common_1.NotFoundException('Coupon not found');
        coupon.usedCount += 1;
        await this.couponRepository.save(coupon);
        return coupon.value;
    }
    async getStoreAnalytics(userId) {
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
};
exports.StoreService = StoreService;
exports.StoreService = StoreService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(product_entity_1.Product)),
    __param(1, (0, typeorm_1.InjectRepository)(category_entity_1.Category)),
    __param(2, (0, typeorm_1.InjectRepository)(customer_entity_1.Customer)),
    __param(3, (0, typeorm_1.InjectRepository)(order_entity_1.Order)),
    __param(4, (0, typeorm_1.InjectRepository)(order_entity_1.OrderItem)),
    __param(5, (0, typeorm_1.InjectRepository)(coupon_entity_1.Coupon)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository])
], StoreService);
//# sourceMappingURL=store.service.js.map