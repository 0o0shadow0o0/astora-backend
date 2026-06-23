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
exports.Campaign = exports.CampaignStatus = exports.CampaignType = void 0;
const typeorm_1 = require("typeorm");
const swagger_1 = require("@nestjs/swagger");
const base_entity_1 = require("../../../common/entities/base.entity");
const user_entity_1 = require("../../users/entities/user.entity");
const whatsapp_account_entity_1 = require("../../whatsapp/entities/whatsapp-account.entity");
var CampaignType;
(function (CampaignType) {
    CampaignType["WHATSAPP"] = "whatsapp";
    CampaignType["SMS"] = "sms";
    CampaignType["BOTH"] = "both";
})(CampaignType || (exports.CampaignType = CampaignType = {}));
var CampaignStatus;
(function (CampaignStatus) {
    CampaignStatus["DRAFT"] = "draft";
    CampaignStatus["SCHEDULED"] = "scheduled";
    CampaignStatus["RUNNING"] = "running";
    CampaignStatus["COMPLETED"] = "completed";
    CampaignStatus["PAUSED"] = "paused";
    CampaignStatus["CANCELLED"] = "cancelled";
    CampaignStatus["FAILED"] = "failed";
})(CampaignStatus || (exports.CampaignStatus = CampaignStatus = {}));
let Campaign = class Campaign extends base_entity_1.BaseEntity {
};
exports.Campaign = Campaign;
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'Summer Sale Campaign' }),
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], Campaign.prototype, "name", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'Campaign description' }),
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", String)
], Campaign.prototype, "description", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ enum: CampaignType }),
    (0, typeorm_1.Column)({
        type: 'enum',
        enum: CampaignType,
        default: CampaignType.WHATSAPP,
    }),
    __metadata("design:type", String)
], Campaign.prototype, "type", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ enum: CampaignStatus }),
    (0, typeorm_1.Column)({
        type: 'enum',
        enum: CampaignStatus,
        default: CampaignStatus.DRAFT,
    }),
    __metadata("design:type", String)
], Campaign.prototype, "status", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'Hello! Check out our summer sale...' }),
    (0, typeorm_1.Column)({ type: 'text' }),
    __metadata("design:type", String)
], Campaign.prototype, "message", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'image.jpg', required: false }),
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", String)
], Campaign.prototype, "mediaUrl", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    (0, typeorm_1.Column)({ type: 'timestamp with time zone', nullable: true }),
    __metadata("design:type", Date)
], Campaign.prototype, "scheduledAt", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    (0, typeorm_1.Column)({ type: 'timestamp with time zone', nullable: true }),
    __metadata("design:type", Date)
], Campaign.prototype, "startedAt", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    (0, typeorm_1.Column)({ type: 'timestamp with time zone', nullable: true }),
    __metadata("design:type", Date)
], Campaign.prototype, "completedAt", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 100 }),
    (0, typeorm_1.Column)({ default: 0 }),
    __metadata("design:type", Number)
], Campaign.prototype, "totalRecipients", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 50 }),
    (0, typeorm_1.Column)({ default: 0 }),
    __metadata("design:type", Number)
], Campaign.prototype, "sentCount", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 45 }),
    (0, typeorm_1.Column)({ default: 0 }),
    __metadata("design:type", Number)
], Campaign.prototype, "deliveredCount", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 40 }),
    (0, typeorm_1.Column)({ default: 0 }),
    __metadata("design:type", Number)
], Campaign.prototype, "readCount", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 5 }),
    (0, typeorm_1.Column)({ default: 0 }),
    __metadata("design:type", Number)
], Campaign.prototype, "failedCount", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 10 }),
    (0, typeorm_1.Column)({ default: 0 }),
    __metadata("design:type", Number)
], Campaign.prototype, "optedOutCount", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => user_entity_1.User, { onDelete: 'CASCADE' }),
    (0, typeorm_1.JoinColumn)({ name: 'user_id' }),
    __metadata("design:type", user_entity_1.User)
], Campaign.prototype, "user", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], Campaign.prototype, "userId", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => whatsapp_account_entity_1.WhatsAppAccount, { onDelete: 'SET NULL', nullable: true }),
    (0, typeorm_1.JoinColumn)({ name: 'whatsapp_account_id' }),
    __metadata("design:type", whatsapp_account_entity_1.WhatsAppAccount)
], Campaign.prototype, "whatsappAccount", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", String)
], Campaign.prototype, "whatsappAccountId", void 0);
exports.Campaign = Campaign = __decorate([
    (0, typeorm_1.Entity)('campaigns')
], Campaign);
//# sourceMappingURL=campaign.entity.js.map