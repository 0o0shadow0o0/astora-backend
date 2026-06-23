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
exports.StoreController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const store_service_1 = require("../services/store.service");
const auth_guard_1 = require("../../auth/guards/auth.guard");
const class_validator_1 = require("class-validator");
const swagger_2 = require("@nestjs/swagger");
class ProductQueryDto {
}
__decorate([
    (0, swagger_2.ApiPropertyOptional)(),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsNumber)(),
    __metadata("design:type", Number)
], ProductQueryDto.prototype, "page", void 0);
__decorate([
    (0, swagger_2.ApiPropertyOptional)(),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsNumber)(),
    __metadata("design:type", Number)
], ProductQueryDto.prototype, "limit", void 0);
__decorate([
    (0, swagger_2.ApiPropertyOptional)(),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], ProductQueryDto.prototype, "search", void 0);
let StoreController = class StoreController {
    constructor(storeService) {
        this.storeService = storeService;
    }
    async createProduct(req, data) {
        return this.storeService.createProduct(req.user.id, data);
    }
    async getProducts(req, query) {
        return this.storeService.getProducts(req.user.id, query.page, query.limit, query.search);
    }
    async getProduct(id, req) {
        return this.storeService.getProduct(id, req.user.id);
    }
    async updateProduct(id, req, data) {
        return this.storeService.updateProduct(id, req.user.id, data);
    }
    async deleteProduct(id, req) {
        await this.storeService.deleteProduct(id, req.user.id);
        return { message: 'Product deleted successfully' };
    }
    async updateInventory(id, req, quantity) {
        return this.storeService.updateInventory(id, req.user.id, quantity);
    }
    async createCategory(req, data) {
        return this.storeService.createCategory(req.user.id, data);
    }
    async getCategories(req) {
        return this.storeService.getCategories(req.user.id);
    }
    async getCategory(id, req) {
        return this.storeService.getCategory(id, req.user.id);
    }
    async updateCategory(id, req, data) {
        return this.storeService.updateCategory(id, req.user.id, data);
    }
    async deleteCategory(id, req) {
        await this.storeService.deleteCategory(id, req.user.id);
        return { message: 'Category deleted successfully' };
    }
    async createCustomer(req, data) {
        return this.storeService.createCustomer(req.user.id, data);
    }
    async getCustomers(req, query) {
        return this.storeService.getCustomers(req.user.id, query.page, query.limit, query.search);
    }
    async getCustomer(id, req) {
        return this.storeService.getCustomer(id, req.user.id);
    }
    async updateCustomer(id, req, data) {
        return this.storeService.updateCustomer(id, req.user.id, data);
    }
    async addPoints(id, points) {
        return this.storeService.addCustomerPoints(id, points);
    }
    async createOrder(req, data) {
        return this.storeService.createOrder(req.user.id, data);
    }
    async getOrders(req, query) {
        return this.storeService.getOrders(req.user.id, query.page, query.limit, query.status);
    }
    async getOrder(id, req) {
        return this.storeService.getOrder(id, req.user.id);
    }
    async updateOrderStatus(id, req, status) {
        return this.storeService.updateOrderStatus(id, req.user.id, status);
    }
    async createCoupon(req, data) {
        return this.storeService.createCoupon(req.user.id, data);
    }
    async getCoupons(req) {
        return this.storeService.getCoupons(req.user.id);
    }
    async validateCoupon(req, code, orderTotal) {
        return this.storeService.validateCoupon(code, req.user.id, orderTotal);
    }
    async getAnalytics(req) {
        return this.storeService.getStoreAnalytics(req.user.id);
    }
};
exports.StoreController = StoreController;
__decorate([
    (0, common_1.Post)('products'),
    (0, swagger_1.ApiOperation)({ summary: 'Create a new product' }),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], StoreController.prototype, "createProduct", null);
__decorate([
    (0, common_1.Get)('products'),
    (0, swagger_1.ApiOperation)({ summary: 'Get all products' }),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, ProductQueryDto]),
    __metadata("design:returntype", Promise)
], StoreController.prototype, "getProducts", null);
__decorate([
    (0, common_1.Get)('products/:id'),
    (0, swagger_1.ApiOperation)({ summary: 'Get product by ID' }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], StoreController.prototype, "getProduct", null);
__decorate([
    (0, common_1.Put)('products/:id'),
    (0, swagger_1.ApiOperation)({ summary: 'Update product' }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Req)()),
    __param(2, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object, Object]),
    __metadata("design:returntype", Promise)
], StoreController.prototype, "updateProduct", null);
__decorate([
    (0, common_1.Delete)('products/:id'),
    (0, swagger_1.ApiOperation)({ summary: 'Delete product' }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], StoreController.prototype, "deleteProduct", null);
__decorate([
    (0, common_1.Put)('products/:id/inventory'),
    (0, swagger_1.ApiOperation)({ summary: 'Update product inventory' }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Req)()),
    __param(2, (0, common_1.Body)('quantity')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object, Number]),
    __metadata("design:returntype", Promise)
], StoreController.prototype, "updateInventory", null);
__decorate([
    (0, common_1.Post)('categories'),
    (0, swagger_1.ApiOperation)({ summary: 'Create a new category' }),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], StoreController.prototype, "createCategory", null);
__decorate([
    (0, common_1.Get)('categories'),
    (0, swagger_1.ApiOperation)({ summary: 'Get all categories' }),
    __param(0, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], StoreController.prototype, "getCategories", null);
__decorate([
    (0, common_1.Get)('categories/:id'),
    (0, swagger_1.ApiOperation)({ summary: 'Get category by ID' }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], StoreController.prototype, "getCategory", null);
__decorate([
    (0, common_1.Put)('categories/:id'),
    (0, swagger_1.ApiOperation)({ summary: 'Update category' }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Req)()),
    __param(2, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object, Object]),
    __metadata("design:returntype", Promise)
], StoreController.prototype, "updateCategory", null);
__decorate([
    (0, common_1.Delete)('categories/:id'),
    (0, swagger_1.ApiOperation)({ summary: 'Delete category' }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], StoreController.prototype, "deleteCategory", null);
__decorate([
    (0, common_1.Post)('customers'),
    (0, swagger_1.ApiOperation)({ summary: 'Create a new customer' }),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], StoreController.prototype, "createCustomer", null);
__decorate([
    (0, common_1.Get)('customers'),
    (0, swagger_1.ApiOperation)({ summary: 'Get all customers' }),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, ProductQueryDto]),
    __metadata("design:returntype", Promise)
], StoreController.prototype, "getCustomers", null);
__decorate([
    (0, common_1.Get)('customers/:id'),
    (0, swagger_1.ApiOperation)({ summary: 'Get customer by ID' }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], StoreController.prototype, "getCustomer", null);
__decorate([
    (0, common_1.Put)('customers/:id'),
    (0, swagger_1.ApiOperation)({ summary: 'Update customer' }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Req)()),
    __param(2, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object, Object]),
    __metadata("design:returntype", Promise)
], StoreController.prototype, "updateCustomer", null);
__decorate([
    (0, common_1.Post)('customers/:id/points'),
    (0, swagger_1.ApiOperation)({ summary: 'Add points to customer' }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)('points')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Number]),
    __metadata("design:returntype", Promise)
], StoreController.prototype, "addPoints", null);
__decorate([
    (0, common_1.Post)('orders'),
    (0, swagger_1.ApiOperation)({ summary: 'Create a new order' }),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], StoreController.prototype, "createOrder", null);
__decorate([
    (0, common_1.Get)('orders'),
    (0, swagger_1.ApiOperation)({ summary: 'Get all orders' }),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], StoreController.prototype, "getOrders", null);
__decorate([
    (0, common_1.Get)('orders/:id'),
    (0, swagger_1.ApiOperation)({ summary: 'Get order by ID' }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], StoreController.prototype, "getOrder", null);
__decorate([
    (0, common_1.Put)('orders/:id/status'),
    (0, swagger_1.ApiOperation)({ summary: 'Update order status' }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Req)()),
    __param(2, (0, common_1.Body)('status')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object, String]),
    __metadata("design:returntype", Promise)
], StoreController.prototype, "updateOrderStatus", null);
__decorate([
    (0, common_1.Post)('coupons'),
    (0, swagger_1.ApiOperation)({ summary: 'Create a new coupon' }),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], StoreController.prototype, "createCoupon", null);
__decorate([
    (0, common_1.Get)('coupons'),
    (0, swagger_1.ApiOperation)({ summary: 'Get all coupons' }),
    __param(0, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], StoreController.prototype, "getCoupons", null);
__decorate([
    (0, common_1.Post)('coupons/validate'),
    (0, swagger_1.ApiOperation)({ summary: 'Validate coupon code' }),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Body)('code')),
    __param(2, (0, common_1.Body)('orderTotal')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String, Number]),
    __metadata("design:returntype", Promise)
], StoreController.prototype, "validateCoupon", null);
__decorate([
    (0, common_1.Get)('analytics'),
    (0, swagger_1.ApiOperation)({ summary: 'Get store analytics' }),
    __param(0, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], StoreController.prototype, "getAnalytics", null);
exports.StoreController = StoreController = __decorate([
    (0, swagger_1.ApiTags)('store'),
    (0, swagger_1.ApiBearerAuth)(),
    (0, common_1.UseGuards)(auth_guard_1.AuthGuard),
    (0, common_1.Controller)({ path: 'store', version: '1' }),
    __metadata("design:paramtypes", [store_service_1.StoreService])
], StoreController);
//# sourceMappingURL=store.controller.js.map