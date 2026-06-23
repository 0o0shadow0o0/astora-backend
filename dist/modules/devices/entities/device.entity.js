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
exports.Device = exports.DeviceStatus = exports.DeviceType = void 0;
const typeorm_1 = require("typeorm");
const swagger_1 = require("@nestjs/swagger");
const base_entity_1 = require("../../../common/entities/base.entity");
const user_entity_1 = require("../../users/entities/user.entity");
var DeviceType;
(function (DeviceType) {
    DeviceType["DESKTOP"] = "desktop";
    DeviceType["MOBILE"] = "mobile";
    DeviceType["TABLET"] = "tablet";
    DeviceType["WEB"] = "web";
    DeviceType["API"] = "api";
})(DeviceType || (exports.DeviceType = DeviceType = {}));
var DeviceStatus;
(function (DeviceStatus) {
    DeviceStatus["ACTIVE"] = "active";
    DeviceStatus["INACTIVE"] = "inactive";
    DeviceStatus["BLOCKED"] = "blocked";
})(DeviceStatus || (exports.DeviceStatus = DeviceStatus = {}));
let Device = class Device extends base_entity_1.BaseEntity {
};
exports.Device = Device;
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'Chrome Browser' }),
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], Device.prototype, "name", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: '192.168.1.1' }),
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], Device.prototype, "ipAddress", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'Mozilla/5.0...' }),
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", String)
], Device.prototype, "userAgent", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ enum: DeviceType }),
    (0, typeorm_1.Column)({
        type: 'enum',
        enum: DeviceType,
        default: DeviceType.DESKTOP,
    }),
    __metadata("design:type", String)
], Device.prototype, "type", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ enum: DeviceStatus }),
    (0, typeorm_1.Column)({
        type: 'enum',
        enum: DeviceStatus,
        default: DeviceStatus.ACTIVE,
    }),
    __metadata("design:type", String)
], Device.prototype, "status", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'en-US' }),
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", String)
], Device.prototype, "language", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'Mac OS X', required: false }),
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", String)
], Device.prototype, "os", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'Chrome 120', required: false }),
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", String)
], Device.prototype, "browser", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: false }),
    (0, typeorm_1.Column)({ default: false }),
    __metadata("design:type", Boolean)
], Device.prototype, "isCurrent", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => user_entity_1.User, { onDelete: 'CASCADE' }),
    (0, typeorm_1.JoinColumn)({ name: 'user_id' }),
    __metadata("design:type", user_entity_1.User)
], Device.prototype, "user", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], Device.prototype, "userId", void 0);
exports.Device = Device = __decorate([
    (0, typeorm_1.Entity)('devices')
], Device);
//# sourceMappingURL=device.entity.js.map