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
exports.Permission = exports.PermissionAction = exports.PermissionResource = void 0;
const typeorm_1 = require("typeorm");
const swagger_1 = require("@nestjs/swagger");
const base_entity_1 = require("../../../common/entities/base.entity");
const role_entity_1 = require("../../roles/entities/role.entity");
var PermissionResource;
(function (PermissionResource) {
    PermissionResource["USERS"] = "users";
    PermissionResource["ROLES"] = "roles";
    PermissionResource["PERMISSIONS"] = "permissions";
    PermissionResource["DEVICES"] = "devices";
    PermissionResource["SESSIONS"] = "sessions";
    PermissionResource["WHATSAPP"] = "whatsapp";
    PermissionResource["CONTACTS"] = "contacts";
    PermissionResource["CHATS"] = "chats";
    PermissionResource["MESSAGES"] = "messages";
    PermissionResource["SCHEDULER"] = "scheduler";
    PermissionResource["SMS"] = "sms";
    PermissionResource["CALLS"] = "calls";
    PermissionResource["AI"] = "ai";
    PermissionResource["STORE"] = "store";
    PermissionResource["NOTIFICATIONS"] = "notifications";
    PermissionResource["AUDIT_LOGS"] = "audit_logs";
})(PermissionResource || (exports.PermissionResource = PermissionResource = {}));
var PermissionAction;
(function (PermissionAction) {
    PermissionAction["CREATE"] = "create";
    PermissionAction["READ"] = "read";
    PermissionAction["UPDATE"] = "update";
    PermissionAction["DELETE"] = "delete";
    PermissionAction["MANAGE"] = "manage";
})(PermissionAction || (exports.PermissionAction = PermissionAction = {}));
let Permission = class Permission extends base_entity_1.BaseEntity {
};
exports.Permission = Permission;
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'Create Users' }),
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], Permission.prototype, "name", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'create_users' }),
    (0, typeorm_1.Column)({ unique: true }),
    __metadata("design:type", String)
], Permission.prototype, "slug", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ enum: PermissionResource }),
    (0, typeorm_1.Column)({
        type: 'enum',
        enum: PermissionResource,
    }),
    __metadata("design:type", String)
], Permission.prototype, "resource", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ enum: PermissionAction }),
    (0, typeorm_1.Column)({
        type: 'enum',
        enum: PermissionAction,
    }),
    __metadata("design:type", String)
], Permission.prototype, "action", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'Permission to create users' }),
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", String)
], Permission.prototype, "description", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: true }),
    (0, typeorm_1.Column)({ default: true }),
    __metadata("design:type", Boolean)
], Permission.prototype, "isActive", void 0);
__decorate([
    (0, typeorm_1.ManyToMany)(() => role_entity_1.Role, (role) => role.permissions),
    __metadata("design:type", Array)
], Permission.prototype, "roles", void 0);
exports.Permission = Permission = __decorate([
    (0, typeorm_1.Entity)('permissions')
], Permission);
//# sourceMappingURL=permission.entity.js.map