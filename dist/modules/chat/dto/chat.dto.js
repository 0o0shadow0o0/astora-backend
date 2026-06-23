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
exports.PinChatDto = exports.ArchiveChatDto = exports.MarkReadDto = exports.MessageQueryDto = exports.SendMediaMessageDto = exports.SendChatMessageDto = exports.ChatQueryDto = exports.UpdateChatThreadDto = exports.CreateChatThreadDto = void 0;
const swagger_1 = require("@nestjs/swagger");
const class_validator_1 = require("class-validator");
const common_dto_1 = require("../../../common/dto/common.dto");
const chat_thread_entity_1 = require("../entities/chat-thread.entity");
const message_entity_1 = require("../entities/message.entity");
class CreateChatThreadDto {
}
exports.CreateChatThreadDto = CreateChatThreadDto;
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'chat_123' }),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateChatThreadDto.prototype, "externalId", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ enum: chat_thread_entity_1.ChatType }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsEnum)(chat_thread_entity_1.ChatType),
    __metadata("design:type", String)
], CreateChatThreadDto.prototype, "type", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ example: 'Chat Title' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateChatThreadDto.prototype, "title", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)(),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsUUID)(),
    __metadata("design:type", String)
], CreateChatThreadDto.prototype, "contactId", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)(),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsUUID)(),
    __metadata("design:type", String)
], CreateChatThreadDto.prototype, "whatsappAccountId", void 0);
class UpdateChatThreadDto {
}
exports.UpdateChatThreadDto = UpdateChatThreadDto;
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ enum: chat_thread_entity_1.ChatStatus }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsEnum)(chat_thread_entity_1.ChatStatus),
    __metadata("design:type", String)
], UpdateChatThreadDto.prototype, "status", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)(),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsBoolean)(),
    __metadata("design:type", Boolean)
], UpdateChatThreadDto.prototype, "isPinned", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)(),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsBoolean)(),
    __metadata("design:type", Boolean)
], UpdateChatThreadDto.prototype, "isArchived", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)(),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsBoolean)(),
    __metadata("design:type", Boolean)
], UpdateChatThreadDto.prototype, "isMuted", void 0);
class ChatQueryDto extends common_dto_1.PaginationDto {
}
exports.ChatQueryDto = ChatQueryDto;
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ enum: chat_thread_entity_1.ChatType }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsEnum)(chat_thread_entity_1.ChatType),
    __metadata("design:type", String)
], ChatQueryDto.prototype, "type", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ enum: chat_thread_entity_1.ChatStatus }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsEnum)(chat_thread_entity_1.ChatStatus),
    __metadata("design:type", String)
], ChatQueryDto.prototype, "status", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)(),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsBoolean)(),
    __metadata("design:type", Boolean)
], ChatQueryDto.prototype, "isPinned", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)(),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsBoolean)(),
    __metadata("design:type", Boolean)
], ChatQueryDto.prototype, "isArchived", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)(),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsUUID)(),
    __metadata("design:type", String)
], ChatQueryDto.prototype, "contactId", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)(),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsUUID)(),
    __metadata("design:type", String)
], ChatQueryDto.prototype, "whatsappAccountId", void 0);
class SendChatMessageDto {
}
exports.SendChatMessageDto = SendChatMessageDto;
__decorate([
    (0, swagger_1.ApiProperty)({ example: '+1234567890' }),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], SendChatMessageDto.prototype, "to", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'Hello, this is a message!' }),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], SendChatMessageDto.prototype, "content", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ enum: message_entity_1.MessageType }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsEnum)(message_entity_1.MessageType),
    __metadata("design:type", String)
], SendChatMessageDto.prototype, "type", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)(),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], SendChatMessageDto.prototype, "replyToId", void 0);
class SendMediaMessageDto {
}
exports.SendMediaMessageDto = SendMediaMessageDto;
__decorate([
    (0, swagger_1.ApiProperty)({ example: '+1234567890' }),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], SendMediaMessageDto.prototype, "to", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'https://example.com/image.jpg' }),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], SendMediaMessageDto.prototype, "mediaUrl", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'image' }),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], SendMediaMessageDto.prototype, "type", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)(),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], SendMediaMessageDto.prototype, "caption", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)(),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], SendMediaMessageDto.prototype, "filename", void 0);
class MessageQueryDto extends common_dto_1.PaginationDto {
}
exports.MessageQueryDto = MessageQueryDto;
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ enum: message_entity_1.MessageType }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsEnum)(message_entity_1.MessageType),
    __metadata("design:type", String)
], MessageQueryDto.prototype, "type", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ enum: message_entity_1.MessageDirection }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsEnum)(message_entity_1.MessageDirection),
    __metadata("design:type", String)
], MessageQueryDto.prototype, "direction", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ enum: ['pending', 'sent', 'delivered', 'read', 'failed'] }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], MessageQueryDto.prototype, "status", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)(),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], MessageQueryDto.prototype, "search", void 0);
class MarkReadDto {
}
exports.MarkReadDto = MarkReadDto;
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'chat_thread_id' }),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], MarkReadDto.prototype, "chatThreadId", void 0);
class ArchiveChatDto {
}
exports.ArchiveChatDto = ArchiveChatDto;
__decorate([
    (0, swagger_1.ApiProperty)(),
    (0, class_validator_1.IsBoolean)(),
    __metadata("design:type", Boolean)
], ArchiveChatDto.prototype, "archive", void 0);
class PinChatDto {
}
exports.PinChatDto = PinChatDto;
__decorate([
    (0, swagger_1.ApiProperty)(),
    (0, class_validator_1.IsBoolean)(),
    __metadata("design:type", Boolean)
], PinChatDto.prototype, "pin", void 0);
//# sourceMappingURL=chat.dto.js.map