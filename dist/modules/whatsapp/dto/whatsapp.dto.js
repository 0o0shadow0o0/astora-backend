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
exports.WhatsAppWebhookDto = exports.SendLocationDto = exports.SendMediaDto = exports.SendMessageDto = exports.UpdateWhatsAppAccountDto = exports.CreateWhatsAppAccountDto = void 0;
const swagger_1 = require("@nestjs/swagger");
const class_validator_1 = require("class-validator");
const whatsapp_account_entity_1 = require("../entities/whatsapp-account.entity");
class CreateWhatsAppAccountDto {
}
exports.CreateWhatsAppAccountDto = CreateWhatsAppAccountDto;
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'My Business WhatsApp' }),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateWhatsAppAccountDto.prototype, "name", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ enum: whatsapp_account_entity_1.WhatsAppProvider }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsEnum)(whatsapp_account_entity_1.WhatsAppProvider),
    __metadata("design:type", String)
], CreateWhatsAppAccountDto.prototype, "provider", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)(),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsBoolean)(),
    __metadata("design:type", Boolean)
], CreateWhatsAppAccountDto.prototype, "multiDevice", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)(),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsBoolean)(),
    __metadata("design:type", Boolean)
], CreateWhatsAppAccountDto.prototype, "autoReconnect", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)(),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsBoolean)(),
    __metadata("design:type", Boolean)
], CreateWhatsAppAccountDto.prototype, "syncMessages", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)(),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsBoolean)(),
    __metadata("design:type", Boolean)
], CreateWhatsAppAccountDto.prototype, "syncContacts", void 0);
class UpdateWhatsAppAccountDto {
}
exports.UpdateWhatsAppAccountDto = UpdateWhatsAppAccountDto;
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ example: 'Updated Name' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], UpdateWhatsAppAccountDto.prototype, "name", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)(),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsBoolean)(),
    __metadata("design:type", Boolean)
], UpdateWhatsAppAccountDto.prototype, "autoReconnect", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)(),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsBoolean)(),
    __metadata("design:type", Boolean)
], UpdateWhatsAppAccountDto.prototype, "syncMessages", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)(),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsBoolean)(),
    __metadata("design:type", Boolean)
], UpdateWhatsAppAccountDto.prototype, "syncContacts", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)(),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsBoolean)(),
    __metadata("design:type", Boolean)
], UpdateWhatsAppAccountDto.prototype, "syncPresence", void 0);
class SendMessageDto {
}
exports.SendMessageDto = SendMessageDto;
__decorate([
    (0, swagger_1.ApiProperty)({ example: '+1234567890' }),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], SendMessageDto.prototype, "to", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'Hello, this is a test message!' }),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], SendMessageDto.prototype, "content", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)(),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], SendMessageDto.prototype, "replyTo", void 0);
class SendMediaDto {
}
exports.SendMediaDto = SendMediaDto;
__decorate([
    (0, swagger_1.ApiProperty)({ example: '+1234567890' }),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], SendMediaDto.prototype, "to", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'https://example.com/image.jpg' }),
    (0, class_validator_1.IsUrl)(),
    __metadata("design:type", String)
], SendMediaDto.prototype, "mediaUrl", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'image' }),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], SendMediaDto.prototype, "type", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ example: 'Image caption' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], SendMediaDto.prototype, "caption", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ example: 'document.pdf' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], SendMediaDto.prototype, "filename", void 0);
class SendLocationDto {
}
exports.SendLocationDto = SendLocationDto;
__decorate([
    (0, swagger_1.ApiProperty)({ example: '+1234567890' }),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], SendLocationDto.prototype, "to", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 40.7128 }),
    (0, class_validator_1.IsNumber)(),
    __metadata("design:type", Number)
], SendLocationDto.prototype, "latitude", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: -74.0060 }),
    (0, class_validator_1.IsNumber)(),
    __metadata("design:type", Number)
], SendLocationDto.prototype, "longitude", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ example: 'New York, NY' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], SendLocationDto.prototype, "description", void 0);
class WhatsAppWebhookDto {
}
exports.WhatsAppWebhookDto = WhatsAppWebhookDto;
__decorate([
    (0, swagger_1.ApiProperty)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], WhatsAppWebhookDto.prototype, "event", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", Object)
], WhatsAppWebhookDto.prototype, "data", void 0);
//# sourceMappingURL=whatsapp.dto.js.map