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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.WhatsAppController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const whatsapp_service_1 = require("../services/whatsapp.service");
const auth_guard_1 = require("../../auth/guards/auth.guard");
const whatsapp_dto_1 = require("../dto/whatsapp.dto");
let WhatsAppController = class WhatsAppController {
    constructor(whatsappService) {
        this.whatsappService = whatsappService;
    }
    async createAccount(req, dto) {
        return this.whatsappService.createAccount(req.user.id, dto);
    }
    async findAll(req) {
        return this.whatsappService.findAll(req.user.id);
    }
    async findOne(id, req) {
        return this.whatsappService.findOne(id, req.user.id);
    }
    async update(id, req, dto) {
        return this.whatsappService.update(id, req.user.id, dto);
    }
    async delete(id, req) {
        await this.whatsappService.delete(id, req.user.id);
        return { message: 'WhatsApp account deleted successfully' };
    }
    async connect(id, req) {
        return this.whatsappService.connect(id, req.user.id);
    }
    async disconnect(id, req) {
        await this.whatsappService.disconnect(id);
        return { message: 'WhatsApp account disconnected successfully' };
    }
    async getQRCode(id, req) {
        return this.whatsappService.getQRCode(id, req.user.id);
    }
    async getContacts(id, req) {
        return this.whatsappService.getContacts(id, req.user.id);
    }
    async sendMessage(id, req, dto) {
        return this.whatsappService.sendMessage(id, req.user.id, dto);
    }
    async sendMedia(id, req, dto) {
        return this.whatsappService.sendMedia(id, req.user.id, dto);
    }
    async sendLocation(id, req, dto) {
        return this.whatsappService.sendLocation(id, req.user.id, dto);
    }
};
exports.WhatsAppController = WhatsAppController;
__decorate([
    (0, common_1.Post)('accounts'),
    (0, swagger_1.ApiOperation)({ summary: 'Create a new WhatsApp account' }),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, whatsapp_dto_1.CreateWhatsAppAccountDto]),
    __metadata("design:returntype", Promise)
], WhatsAppController.prototype, "createAccount", null);
__decorate([
    (0, common_1.Get)('accounts'),
    (0, swagger_1.ApiOperation)({ summary: 'Get all WhatsApp accounts' }),
    __param(0, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], WhatsAppController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)('accounts/:id'),
    (0, swagger_1.ApiOperation)({ summary: 'Get WhatsApp account by ID' }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], WhatsAppController.prototype, "findOne", null);
__decorate([
    (0, common_1.Put)('accounts/:id'),
    (0, swagger_1.ApiOperation)({ summary: 'Update WhatsApp account' }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Req)()),
    __param(2, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object, whatsapp_dto_1.UpdateWhatsAppAccountDto]),
    __metadata("design:returntype", Promise)
], WhatsAppController.prototype, "update", null);
__decorate([
    (0, common_1.Delete)('accounts/:id'),
    (0, swagger_1.ApiOperation)({ summary: 'Delete WhatsApp account' }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], WhatsAppController.prototype, "delete", null);
__decorate([
    (0, common_1.Post)('accounts/:id/connect'),
    (0, swagger_1.ApiOperation)({ summary: 'Connect WhatsApp account' }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], WhatsAppController.prototype, "connect", null);
__decorate([
    (0, common_1.Post)('accounts/:id/disconnect'),
    (0, swagger_1.ApiOperation)({ summary: 'Disconnect WhatsApp account' }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], WhatsAppController.prototype, "disconnect", null);
__decorate([
    (0, common_1.Get)('accounts/:id/qr'),
    (0, swagger_1.ApiOperation)({ summary: 'Get QR code for authentication' }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], WhatsAppController.prototype, "getQRCode", null);
__decorate([
    (0, common_1.Get)('accounts/:id/contacts'),
    (0, swagger_1.ApiOperation)({ summary: 'Get contacts from WhatsApp account' }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], WhatsAppController.prototype, "getContacts", null);
__decorate([
    (0, common_1.Post)('accounts/:id/messages'),
    (0, swagger_1.ApiOperation)({ summary: 'Send text message' }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Req)()),
    __param(2, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object, whatsapp_dto_1.SendMessageDto]),
    __metadata("design:returntype", Promise)
], WhatsAppController.prototype, "sendMessage", null);
__decorate([
    (0, common_1.Post)('accounts/:id/media'),
    (0, swagger_1.ApiOperation)({ summary: 'Send media message' }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Req)()),
    __param(2, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object, whatsapp_dto_1.SendMediaDto]),
    __metadata("design:returntype", Promise)
], WhatsAppController.prototype, "sendMedia", null);
__decorate([
    (0, common_1.Post)('accounts/:id/location'),
    (0, swagger_1.ApiOperation)({ summary: 'Send location message' }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Req)()),
    __param(2, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object, whatsapp_dto_1.SendLocationDto]),
    __metadata("design:returntype", Promise)
], WhatsAppController.prototype, "sendLocation", null);
exports.WhatsAppController = WhatsAppController = __decorate([
    (0, swagger_1.ApiTags)('whatsapp'),
    (0, swagger_1.ApiBearerAuth)(),
    (0, common_1.UseGuards)(auth_guard_1.AuthGuard),
    (0, common_1.Controller)({ path: 'whatsapp', version: '1' }),
    __metadata("design:paramtypes", [whatsapp_service_1.WhatsAppService])
], WhatsAppController);
//# sourceMappingURL=whatsapp.controller.js.map