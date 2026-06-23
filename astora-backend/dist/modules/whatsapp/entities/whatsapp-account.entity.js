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
exports.WhatsAppAccount = exports.WhatsAppStatus = exports.WhatsAppProvider = void 0;
const typeorm_1 = require("typeorm");
const swagger_1 = require("@nestjs/swagger");
const base_entity_1 = require("../../../common/entities/base.entity");
const user_entity_1 = require("../../users/entities/user.entity");
var WhatsAppProvider;
(function (WhatsAppProvider) {
    WhatsAppProvider["BAILEYS"] = "baileys";
    WhatsAppProvider["EVOLUTION_API"] = "evolution_api";
    WhatsAppProvider["WPP_CONNECT"] = "wpp_connect";
    WhatsAppProvider["META"] = "meta";
})(WhatsAppProvider || (exports.WhatsAppProvider = WhatsAppProvider = {}));
var WhatsAppStatus;
(function (WhatsAppStatus) {
    WhatsAppStatus["CONNECTED"] = "connected";
    WhatsAppStatus["DISCONNECTED"] = "disconnected";
    WhatsAppStatus["CONNECTING"] = "connecting";
    WhatsAppStatus["RECONNECTING"] = "reconnecting";
    WhatsAppStatus["QR_READY"] = "qr_ready";
    WhatsAppStatus["ERROR"] = "error";
})(WhatsAppStatus || (exports.WhatsAppStatus = WhatsAppStatus = {}));
let WhatsAppAccount = class WhatsAppAccount extends base_entity_1.BaseEntity {
};
exports.WhatsAppAccount = WhatsAppAccount;
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'My Business WhatsApp' }),
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], WhatsAppAccount.prototype, "name", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ enum: WhatsAppProvider }),
    (0, typeorm_1.Column)({
        type: 'enum',
        enum: WhatsAppProvider,
        default: WhatsAppProvider.BAILEYS,
    }),
    __metadata("design:type", String)
], WhatsAppAccount.prototype, "provider", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ enum: WhatsAppStatus }),
    (0, typeorm_1.Column)({
        type: 'enum',
        enum: WhatsAppStatus,
        default: WhatsAppStatus.DISCONNECTED,
    }),
    __metadata("design:type", String)
], WhatsAppAccount.prototype, "status", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: '+1234567890' }),
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", String)
], WhatsAppAccount.prototype, "phoneNumber", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'Business Account', required: false }),
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", String)
], WhatsAppAccount.prototype, "businessName", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'Profile description', required: false }),
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", String)
], WhatsAppAccount.prototype, "profileDescription", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'profile.jpg', required: false }),
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", String)
], WhatsAppAccount.prototype, "profilePicture", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: false }),
    (0, typeorm_1.Column)({ default: false }),
    __metadata("design:type", Boolean)
], WhatsAppAccount.prototype, "isBusiness", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: false }),
    (0, typeorm_1.Column)({ default: false }),
    __metadata("design:type", Boolean)
], WhatsAppAccount.prototype, "multiDevice", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: true }),
    (0, typeorm_1.Column)({ default: true }),
    __metadata("design:type", Boolean)
], WhatsAppAccount.prototype, "autoReconnect", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: true }),
    (0, typeorm_1.Column)({ default: true }),
    __metadata("design:type", Boolean)
], WhatsAppAccount.prototype, "syncMessages", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: true }),
    (0, typeorm_1.Column)({ default: true }),
    __metadata("design:type", Boolean)
], WhatsAppAccount.prototype, "syncContacts", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: true }),
    (0, typeorm_1.Column)({ default: true }),
    __metadata("design:type", Boolean)
], WhatsAppAccount.prototype, "syncPresence", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 30 }),
    (0, typeorm_1.Column)({ default: 30 }),
    __metadata("design:type", Number)
], WhatsAppAccount.prototype, "reconnectInterval", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 5 }),
    (0, typeorm_1.Column)({ default: 5 }),
    __metadata("design:type", Number)
], WhatsAppAccount.prototype, "maxReconnectAttempts", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ required: false }),
    (0, typeorm_1.Column)({ type: 'text', nullable: true }),
    __metadata("design:type", String)
], WhatsAppAccount.prototype, "sessionData", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ required: false }),
    (0, typeorm_1.Column)({ type: 'text', nullable: true }),
    __metadata("design:type", String)
], WhatsAppAccount.prototype, "qrCode", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ required: false }),
    (0, typeorm_1.Column)({ type: 'timestamp with time zone', nullable: true }),
    __metadata("design:type", Date)
], WhatsAppAccount.prototype, "qrExpiresAt", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ required: false }),
    (0, typeorm_1.Column)({ type: 'timestamp with time zone', nullable: true }),
    __metadata("design:type", Date)
], WhatsAppAccount.prototype, "lastConnectedAt", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ required: false }),
    (0, typeorm_1.Column)({ type: 'timestamp with time zone', nullable: true }),
    __metadata("design:type", Date)
], WhatsAppAccount.prototype, "lastDisconnectedAt", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'Error message', required: false }),
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", String)
], WhatsAppAccount.prototype, "errorMessage", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => user_entity_1.User, { onDelete: 'CASCADE' }),
    (0, typeorm_1.JoinColumn)({ name: 'user_id' }),
    __metadata("design:type", user_entity_1.User)
], WhatsAppAccount.prototype, "user", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], WhatsAppAccount.prototype, "userId", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => user_entity_1.User, { nullable: true }),
    (0, typeorm_1.JoinColumn)({ name: 'assigned_to_id' }),
    __metadata("design:type", user_entity_1.User)
], WhatsAppAccount.prototype, "assignedTo", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", String)
], WhatsAppAccount.prototype, "assignedToId", void 0);
exports.WhatsAppAccount = WhatsAppAccount = __decorate([
    (0, typeorm_1.Entity)('whatsapp_accounts')
], WhatsAppAccount);
//# sourceMappingURL=whatsapp-account.entity.js.map