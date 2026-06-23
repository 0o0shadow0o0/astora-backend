"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.StoreModule = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const product_entity_1 = require("./entities/product.entity");
const category_entity_1 = require("./entities/category.entity");
const customer_entity_1 = require("./entities/customer.entity");
const order_entity_1 = require("./entities/order.entity");
const coupon_entity_1 = require("./entities/coupon.entity");
const store_service_1 = require("./services/store.service");
const store_controller_1 = require("./controllers/store.controller");
let StoreModule = class StoreModule {
};
exports.StoreModule = StoreModule;
exports.StoreModule = StoreModule = __decorate([
    (0, common_1.Module)({
        imports: [
            typeorm_1.TypeOrmModule.forFeature([product_entity_1.Product, category_entity_1.Category, customer_entity_1.Customer, order_entity_1.Order, order_entity_1.OrderItem, coupon_entity_1.Coupon]),
        ],
        controllers: [store_controller_1.StoreController],
        providers: [store_service_1.StoreService],
        exports: [store_service_1.StoreService],
    })
], StoreModule);
//# sourceMappingURL=store.module.js.map