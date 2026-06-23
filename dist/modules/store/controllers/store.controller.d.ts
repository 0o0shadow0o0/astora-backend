import { StoreService } from '../services/store.service';
declare class ProductQueryDto {
    page?: number;
    limit?: number;
    search?: string;
}
export declare class StoreController {
    private readonly storeService;
    constructor(storeService: StoreService);
    createProduct(req: any, data: any): Promise<import("../entities/product.entity").Product>;
    getProducts(req: any, query: ProductQueryDto): Promise<import("../../../common/dto/common.dto").PaginatedResponseDto<import("../entities/product.entity").Product>>;
    getProduct(id: string, req: any): Promise<import("../entities/product.entity").Product>;
    updateProduct(id: string, req: any, data: any): Promise<import("../entities/product.entity").Product>;
    deleteProduct(id: string, req: any): Promise<{
        message: string;
    }>;
    updateInventory(id: string, req: any, quantity: number): Promise<import("../entities/product.entity").Product>;
    createCategory(req: any, data: any): Promise<import("../entities/category.entity").Category>;
    getCategories(req: any): Promise<import("../entities/category.entity").Category[]>;
    getCategory(id: string, req: any): Promise<import("../entities/category.entity").Category>;
    updateCategory(id: string, req: any, data: any): Promise<import("../entities/category.entity").Category>;
    deleteCategory(id: string, req: any): Promise<{
        message: string;
    }>;
    createCustomer(req: any, data: any): Promise<import("../entities/customer.entity").Customer>;
    getCustomers(req: any, query: ProductQueryDto): Promise<import("../../../common/dto/common.dto").PaginatedResponseDto<import("../entities/customer.entity").Customer>>;
    getCustomer(id: string, req: any): Promise<import("../entities/customer.entity").Customer>;
    updateCustomer(id: string, req: any, data: any): Promise<import("../entities/customer.entity").Customer>;
    addPoints(id: string, points: number): Promise<import("../entities/customer.entity").Customer>;
    createOrder(req: any, data: any): Promise<import("../entities/order.entity").Order>;
    getOrders(req: any, query: any): Promise<import("../../../common/dto/common.dto").PaginatedResponseDto<import("../entities/order.entity").Order>>;
    getOrder(id: string, req: any): Promise<import("../entities/order.entity").Order>;
    updateOrderStatus(id: string, req: any, status: string): Promise<import("../entities/order.entity").Order>;
    createCoupon(req: any, data: any): Promise<import("../entities/coupon.entity").Coupon>;
    getCoupons(req: any): Promise<import("../entities/coupon.entity").Coupon[]>;
    validateCoupon(req: any, code: string, orderTotal?: number): Promise<import("../entities/coupon.entity").Coupon | null>;
    getAnalytics(req: any): Promise<any>;
}
export {};
