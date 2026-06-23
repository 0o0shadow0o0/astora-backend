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
Object.defineProperty(exports, "__esModule", { value: true });
exports.Coupon = exports.CouponType = void 0;
const typeorm_1 = require("typeorm");
const swagger_1 = require("@nestjs/swagger");
const base_entity_1 = require("../../../common/entities/base.entity");
const user_entity_1 = require("../../users/entities/user.entity");
var CouponType;
(function (CouponType) {
    CouponType["PERCENTAGE"] = "percentage";
    CouponType["FIXED"] = "fixed";
    CouponType["FREE_SHIPPING"] = "free_shipping";
})(CouponType || (exports.CouponType = CouponType = {}));
let Coupon = class Coupon extends base_entity_1.BaseEntity {
};
exports.Coupon = Coupon;
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'SUMMER20' }),
    (0, typeorm_1.Column)({ unique: true }),
    __metadata("design:type", String)
], Coupon.prototype, "code", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'Summer Sale 20% off' }),
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", String)
], Coupon.prototype, "description", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ enum: CouponType }),
    (0, typeorm_1.Column)({
        type: 'enum',
        enum: CouponType,
        default: CouponType.PERCENTAGE,
    }),
    __metadata("design:type", String)
], Coupon.prototype, "type", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 20 }),
    (0, typeorm_1.Column)({ type: 'decimal', precision: 10, scale: 2 }),
    __metadata("design:type", Number)
], Coupon.prototype, "value", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 100.0 }),
    (0, typeorm_1.Column)({ type: 'decimal', precision: 10, scale: 2, nullable: true }),
    __metadata("design:type", Number)
], Coupon.prototype, "minOrderAmount", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 50.0 }),
    (0, typeorm_1.Column)({ type: 'decimal', precision: 10, scale: 2, nullable: true }),
    __metadata("design:type", Number)
], Coupon.prototype, "maxDiscount", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 100 }),
    (0, typeorm_1.Column)(),
    __metadata("design:type", Number)
], Coupon.prototype, "usageLimit", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 50 }),
    (0, typeorm_1.Column)({ default: 0 }),
    __metadata("design:type", Number)
], Coupon.prototype, "usedCount", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 1 }),
    (0, typeorm_1.Column)({ default: 1 }),
    __metadata("design:type", Number)
], Coupon.prototype, "perUserLimit", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    (0, typeorm_1.Column)({ type: 'timestamp with time zone' }),
    __metadata("design:type", Date)
], Coupon.prototype, "startsAt", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    (0, typeorm_1.Column)({ type: 'timestamp with time zone' }),
    __metadata("design:type", Date)
], Coupon.prototype, "expiresAt", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: true }),
    (0, typeorm_1.Column)({ default: true }),
    __metadata("design:type", Boolean)
], Coupon.prototype, "isActive", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: false }),
    (0, typeorm_1.Column)({ default: false }),
    __metadata("design:type", Boolean)
], Coupon.prototype, "isFirstOrderOnly", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: ['product_1', 'product_2'], required: false }),
    (0, typeorm_1.Column)({ type: 'text', array: true, nullable: true }),
    __metadata("design:type", Array)
], Coupon.prototype, "applicableProducts", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: ['category_1'], required: false }),
    (0, typeorm_1.Column)({ type: 'text', array: true, nullable: true }),
    __metadata("design:type", Array)
], Coupon.prototype, "applicableCategories", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => user_entity_1.User, { onDelete: 'CASCADE' }),
    (0, typeorm_1.JoinColumn)({ name: 'user_id' }),
    __metadata("design:type", user_entity_1.User)
], Coupon.prototype, "user", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], Coupon.prototype, "userId", void 0);
exports.Coupon = Coupon = __decorate([
    (0, typeorm_1.Entity)('coupons')
], Coupon);
//# sourceMappingURL=coupon.entity.js.map