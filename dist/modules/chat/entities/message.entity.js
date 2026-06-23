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
exports.Message = exports.MessageDirection = exports.MessageStatus = exports.MessageType = void 0;
const typeorm_1 = require("typeorm");
const swagger_1 = require("@nestjs/swagger");
const base_entity_1 = require("../../../common/entities/base.entity");
const user_entity_1 = require("../../users/entities/user.entity");
const chat_thread_entity_1 = require("./chat-thread.entity");
var MessageType;
(function (MessageType) {
    MessageType["TEXT"] = "text";
    MessageType["IMAGE"] = "image";
    MessageType["VIDEO"] = "video";
    MessageType["AUDIO"] = "audio";
    MessageType["DOCUMENT"] = "document";
    MessageType["STICKER"] = "sticker";
    MessageType["LOCATION"] = "location";
    MessageType["CONTACT"] = "contact";
    MessageType["VOICE"] = "voice";
    MessageType["POLL"] = "poll";
    MessageType["TEMPLATE"] = "template";
    MessageType["BUTTON"] = "button";
    MessageType["REACTION"] = "reaction";
    MessageType["SYSTEM"] = "system";
})(MessageType || (exports.MessageType = MessageType = {}));
var MessageStatus;
(function (MessageStatus) {
    MessageStatus["PENDING"] = "pending";
    MessageStatus["SENT"] = "sent";
    MessageStatus["DELIVERED"] = "delivered";
    MessageStatus["READ"] = "read";
    MessageStatus["FAILED"] = "failed";
})(MessageStatus || (exports.MessageStatus = MessageStatus = {}));
var MessageDirection;
(function (MessageDirection) {
    MessageDirection["INCOMING"] = "incoming";
    MessageDirection["OUTGOING"] = "outgoing";
})(MessageDirection || (exports.MessageDirection = MessageDirection = {}));
let Message = class Message extends base_entity_1.BaseEntity {
};
exports.Message = Message;
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'msg_123' }),
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], Message.prototype, "externalId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ enum: MessageType }),
    (0, typeorm_1.Column)({
        type: 'enum',
        enum: MessageType,
        default: MessageType.TEXT,
    }),
    __metadata("design:type", String)
], Message.prototype, "type", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ enum: MessageStatus }),
    (0, typeorm_1.Column)({
        type: 'enum',
        enum: MessageStatus,
        default: MessageStatus.PENDING,
    }),
    __metadata("design:type", String)
], Message.prototype, "status", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ enum: MessageDirection }),
    (0, typeorm_1.Column)({
        type: 'enum',
        enum: MessageDirection,
        default: MessageDirection.OUTGOING,
    }),
    __metadata("design:type", String)
], Message.prototype, "direction", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'Hello, how are you?' }),
    (0, typeorm_1.Column)({ type: 'text' }),
    __metadata("design:type", String)
], Message.prototype, "content", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'caption', required: false }),
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", String)
], Message.prototype, "caption", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'media_url.jpg', required: false }),
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", String)
], Message.prototype, "mediaUrl", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'media_mime_type', required: false }),
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", String)
], Message.prototype, "mediaMimeType", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'filename.pdf', required: false }),
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", String)
], Message.prototype, "mediaFileName", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 1024, required: false }),
    (0, typeorm_1.Column)({ type: 'bigint', nullable: true }),
    __metadata("design:type", Number)
], Message.prototype, "mediaSize", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: false }),
    (0, typeorm_1.Column)({ default: false }),
    __metadata("design:type", Boolean)
], Message.prototype, "isDeleted", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: false }),
    (0, typeorm_1.Column)({ default: false }),
    __metadata("design:type", Boolean)
], Message.prototype, "isEdited", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: false }),
    (0, typeorm_1.Column)({ default: false }),
    __metadata("design:type", Boolean)
], Message.prototype, "isForwarded", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: false }),
    (0, typeorm_1.Column)({ default: false }),
    __metadata("design:type", Boolean)
], Message.prototype, "isStarred", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 0 }),
    (0, typeorm_1.Column)({ default: 0 }),
    __metadata("design:type", Number)
], Message.prototype, "replyCount", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'reply_to_msg_id', required: false }),
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", String)
], Message.prototype, "replyToId", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => user_entity_1.User, { onDelete: 'SET NULL', nullable: true }),
    (0, typeorm_1.JoinColumn)({ name: 'user_id' }),
    __metadata("design:type", user_entity_1.User)
], Message.prototype, "user", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", String)
], Message.prototype, "userId", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => chat_thread_entity_1.ChatThread, (thread) => thread.messages, { onDelete: 'CASCADE' }),
    (0, typeorm_1.JoinColumn)({ name: 'chat_thread_id' }),
    __metadata("design:type", chat_thread_entity_1.ChatThread)
], Message.prototype, "chatThread", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], Message.prototype, "chatThreadId", void 0);
exports.Message = Message = __decorate([
    (0, typeorm_1.Entity)('messages')
], Message);
//# sourceMappingURL=message.entity.js.map