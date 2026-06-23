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
exports.AutomationFlow = exports.FlowStatus = void 0;
const typeorm_1 = require("typeorm");
const swagger_1 = require("@nestjs/swagger");
const base_entity_1 = require("../../../common/entities/base.entity");
const user_entity_1 = require("../../users/entities/user.entity");
var FlowStatus;
(function (FlowStatus) {
    FlowStatus["ACTIVE"] = "active";
    FlowStatus["INACTIVE"] = "inactive";
    FlowStatus["DRAFT"] = "draft";
})(FlowStatus || (exports.FlowStatus = FlowStatus = {}));
let AutomationFlow = class AutomationFlow extends base_entity_1.BaseEntity {
};
exports.AutomationFlow = AutomationFlow;
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'Welcome Message Flow' }),
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], AutomationFlow.prototype, "name", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'Automated welcome message sequence' }),
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", String)
], AutomationFlow.prototype, "description", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ enum: FlowStatus }),
    (0, typeorm_1.Column)({
        type: 'enum',
        enum: FlowStatus,
        default: FlowStatus.DRAFT,
    }),
    __metadata("design:type", String)
], AutomationFlow.prototype, "status", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'jsonb' }),
    __metadata("design:type", Object)
], AutomationFlow.prototype, "trigger", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'jsonb' }),
    __metadata("design:type", Array)
], AutomationFlow.prototype, "actions", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'jsonb', nullable: true }),
    __metadata("design:type", Array)
], AutomationFlow.prototype, "conditions", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 0 }),
    (0, typeorm_1.Column)({ default: 0 }),
    __metadata("design:type", Number)
], AutomationFlow.prototype, "executionsCount", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 0 }),
    (0, typeorm_1.Column)({ default: 0 }),
    __metadata("design:type", Number)
], AutomationFlow.prototype, "successCount", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 0 }),
    (0, typeorm_1.Column)({ default: 0 }),
    __metadata("design:type", Number)
], AutomationFlow.prototype, "failureCount", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => user_entity_1.User, { onDelete: 'CASCADE' }),
    (0, typeorm_1.JoinColumn)({ name: 'user_id' }),
    __metadata("design:type", user_entity_1.User)
], AutomationFlow.prototype, "user", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], AutomationFlow.prototype, "userId", void 0);
exports.AutomationFlow = AutomationFlow = __decorate([
    (0, typeorm_1.Entity)('automation_flows')
], AutomationFlow);
//# sourceMappingURL=automation-flow.entity.js.map