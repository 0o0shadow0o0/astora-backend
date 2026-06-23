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
exports.AIMessage = exports.AIConversation = exports.ConversationStatus = exports.AIProvider = void 0;
const typeorm_1 = require("typeorm");
const swagger_1 = require("@nestjs/swagger");
const base_entity_1 = require("../../../common/entities/base.entity");
const user_entity_1 = require("../../users/entities/user.entity");
var AIProvider;
(function (AIProvider) {
    AIProvider["OPENAI"] = "openai";
    AIProvider["GEMINI"] = "gemini";
    AIProvider["CLAUDE"] = "claude";
    AIProvider["DEEPSEEK"] = "deepseek";
    AIProvider["OLLAMA"] = "ollama";
})(AIProvider || (exports.AIProvider = AIProvider = {}));
var ConversationStatus;
(function (ConversationStatus) {
    ConversationStatus["ACTIVE"] = "active";
    ConversationStatus["ENDED"] = "ended";
    ConversationStatus["ARCHIVED"] = "archived";
})(ConversationStatus || (exports.ConversationStatus = ConversationStatus = {}));
let AIConversation = class AIConversation extends base_entity_1.BaseEntity {
};
exports.AIConversation = AIConversation;
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'Customer Support Chat' }),
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], AIConversation.prototype, "title", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ enum: AIProvider }),
    (0, typeorm_1.Column)({
        type: 'enum',
        enum: AIProvider,
        default: AIProvider.OPENAI,
    }),
    __metadata("design:type", String)
], AIConversation.prototype, "provider", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ enum: ConversationStatus }),
    (0, typeorm_1.Column)({
        type: 'enum',
        enum: ConversationStatus,
        default: ConversationStatus.ACTIVE,
    }),
    __metadata("design:type", String)
], AIConversation.prototype, "status", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'jsonb', nullable: true }),
    __metadata("design:type", Object)
], AIConversation.prototype, "context", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 0 }),
    (0, typeorm_1.Column)({ default: 0 }),
    __metadata("design:type", Number)
], AIConversation.prototype, "messageCount", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'phone_123', required: false }),
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", String)
], AIConversation.prototype, "contactPhone", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'chat_thread_id', required: false }),
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", String)
], AIConversation.prototype, "chatThreadId", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => user_entity_1.User, { onDelete: 'CASCADE' }),
    (0, typeorm_1.JoinColumn)({ name: 'user_id' }),
    __metadata("design:type", user_entity_1.User)
], AIConversation.prototype, "user", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], AIConversation.prototype, "userId", void 0);
exports.AIConversation = AIConversation = __decorate([
    (0, typeorm_1.Entity)('ai_conversations')
], AIConversation);
let AIMessage = class AIMessage extends base_entity_1.BaseEntity {
};
exports.AIMessage = AIMessage;
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'Hello, how can I help you?' }),
    (0, typeorm_1.Column)({ type: 'text' }),
    __metadata("design:type", String)
], AIMessage.prototype, "content", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'user' }),
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], AIMessage.prototype, "role", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 100 }),
    (0, typeorm_1.Column)({ type: 'int', nullable: true }),
    __metadata("design:type", Number)
], AIMessage.prototype, "tokens", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'jsonb', nullable: true }),
    __metadata("design:type", Object)
], AIMessage.prototype, "metadata", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => AIConversation, (conv) => conv.messages, { onDelete: 'CASCADE' }),
    (0, typeorm_1.JoinColumn)({ name: 'conversation_id' }),
    __metadata("design:type", AIConversation)
], AIMessage.prototype, "conversation", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], AIMessage.prototype, "conversationId", void 0);
exports.AIMessage = AIMessage = __decorate([
    (0, typeorm_1.Entity)('ai_messages')
], AIMessage);
//# sourceMappingURL=ai-conversation.entity.js.map