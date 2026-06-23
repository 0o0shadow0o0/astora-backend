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
exports.ChatThread = exports.ChatStatus = exports.ChatType = void 0;
const typeorm_1 = require("typeorm");
const swagger_1 = require("@nestjs/swagger");
const base_entity_1 = require("../../../common/entities/base.entity");
const user_entity_1 = require("../../users/entities/user.entity");
const contact_entity_1 = require("../../contacts/entities/contact.entity");
const whatsapp_account_entity_1 = require("../../whatsapp/entities/whatsapp-account.entity");
var ChatType;
(function (ChatType) {
    ChatType["DIRECT"] = "direct";
    ChatType["GROUP"] = "group";
    ChatType["BROADCAST"] = "broadcast";
    ChatType["CHANNEL"] = "channel";
})(ChatType || (exports.ChatType = ChatType = {}));
var ChatStatus;
(function (ChatStatus) {
    ChatStatus["ACTIVE"] = "active";
    ChatStatus["ARCHIVED"] = "archived";
    ChatStatus["PINNED"] = "pinned";
    ChatStatus["MUTED"] = "muted";
    ChatStatus["SPAM"] = "spam";
})(ChatStatus || (exports.ChatStatus = ChatStatus = {}));
let ChatThread = class ChatThread extends base_entity_1.BaseEntity {
};
exports.ChatThread = ChatThread;
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'chat_123' }),
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], ChatThread.prototype, "externalId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ enum: ChatType }),
    (0, typeorm_1.Column)({
        type: 'enum',
        enum: ChatType,
        default: ChatType.DIRECT,
    }),
    __metadata("design:type", String)
], ChatThread.prototype, "type", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ enum: ChatStatus }),
    (0, typeorm_1.Column)({
        type: 'enum',
        enum: ChatStatus,
        default: ChatStatus.ACTIVE,
    }),
    __metadata("design:type", String)
], ChatThread.prototype, "status", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'Chat Title' }),
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", String)
], ChatThread.prototype, "title", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'group_photo.jpg', required: false }),
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", String)
], ChatThread.prototype, "image", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'Group description', required: false }),
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", String)
], ChatThread.prototype, "description", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: false }),
    (0, typeorm_1.Column)({ default: false }),
    __metadata("design:type", Boolean)
], ChatThread.prototype, "isReadOnly", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: false }),
    (0, typeorm_1.Column)({ default: false }),
    __metadata("design:type", Boolean)
], ChatThread.prototype, "isMuted", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: false }),
    (0, typeorm_1.Column)({ default: false }),
    __metadata("design:type", Boolean)
], ChatThread.prototype, "isPinned", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: false }),
    (0, typeorm_1.Column)({ default: false }),
    __metadata("design:type", Boolean)
], ChatThread.prototype, "isArchived", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: false }),
    (0, typeorm_1.Column)({ default: false }),
    __metadata("design:type", Boolean)
], ChatThread.prototype, "isSpam", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 0 }),
    (0, typeorm_1.Column)({ default: 0 }),
    __metadata("design:type", Number)
], ChatThread.prototype, "unreadCount", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 0 }),
    (0, typeorm_1.Column)({ default: 0 }),
    __metadata("design:type", Number)
], ChatThread.prototype, "messageCount", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'last message content', required: false }),
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", String)
], ChatThread.prototype, "lastMessage", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ required: false }),
    (0, typeorm_1.Column)({ type: 'timestamp with time zone', nullable: true }),
    __metadata("design:type", Date)
], ChatThread.prototype, "lastMessageAt", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => user_entity_1.User, { onDelete: 'CASCADE' }),
    (0, typeorm_1.JoinColumn)({ name: 'user_id' }),
    __metadata("design:type", user_entity_1.User)
], ChatThread.prototype, "user", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], ChatThread.prototype, "userId", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => contact_entity_1.Contact, { onDelete: 'SET NULL', nullable: true }),
    (0, typeorm_1.JoinColumn)({ name: 'contact_id' }),
    __metadata("design:type", contact_entity_1.Contact)
], ChatThread.prototype, "contact", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", String)
], ChatThread.prototype, "contactId", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => whatsapp_account_entity_1.WhatsAppAccount, { onDelete: 'CASCADE' }),
    (0, typeorm_1.JoinColumn)({ name: 'whatsapp_account_id' }),
    __metadata("design:type", whatsapp_account_entity_1.WhatsAppAccount)
], ChatThread.prototype, "whatsappAccount", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], ChatThread.prototype, "whatsappAccountId", void 0);
exports.ChatThread = ChatThread = __decorate([
    (0, typeorm_1.Entity)('chat_threads')
], ChatThread);
//# sourceMappingURL=chat-thread.entity.js.map