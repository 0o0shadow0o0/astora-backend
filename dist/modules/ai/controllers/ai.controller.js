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
exports.AIController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const ai_service_1 = require("../services/ai.service");
const auth_guard_1 = require("../../auth/guards/auth.guard");
const class_validator_1 = require("class-validator");
const swagger_2 = require("@nestjs/swagger");
class SendMessageDto {
}
__decorate([
    (0, swagger_2.ApiProperty)({ example: 'Hello, I need help with my order' }),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], SendMessageDto.prototype, "content", void 0);
__decorate([
    (0, swagger_2.ApiPropertyOptional)({ example: 'You are a helpful assistant...' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], SendMessageDto.prototype, "systemPrompt", void 0);
let AIController = class AIController {
    constructor(aiService) {
        this.aiService = aiService;
    }
    async createConversation(req, title) {
        return this.aiService.createConversation(req.user.id, title);
    }
    async getConversations(req) {
        return this.aiService.getConversations(req.user.id);
    }
    async getConversation(id, req) {
        const messages = await this.aiService['getConversationMessages'](id);
        return messages;
    }
    async sendMessage(id, req, dto) {
        return this.aiService.sendMessage(id, req.user.id, dto.content, dto.systemPrompt);
    }
    async deleteConversation(id, req) {
        await this.aiService.deleteConversation(id, req.user.id);
        return { message: 'Conversation deleted successfully' };
    }
    async recommendProduct(id, req) {
        const recommendation = await this.aiService.generateProductRecommendation(id, req.user.id);
        return { recommendation };
    }
    async analyzeIntent(id, req, message) {
        return this.aiService.analyzeCustomerIntent(id, req.user.id, message);
    }
};
exports.AIController = AIController;
__decorate([
    (0, common_1.Post)('conversations'),
    (0, swagger_1.ApiOperation)({ summary: 'Create a new AI conversation' }),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Body)('title')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", Promise)
], AIController.prototype, "createConversation", null);
__decorate([
    (0, common_1.Get)('conversations'),
    (0, swagger_1.ApiOperation)({ summary: 'Get all AI conversations' }),
    __param(0, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], AIController.prototype, "getConversations", null);
__decorate([
    (0, common_1.Get)('conversations/:id'),
    (0, swagger_1.ApiOperation)({ summary: 'Get conversation by ID' }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], AIController.prototype, "getConversation", null);
__decorate([
    (0, common_1.Post)('conversations/:id/messages'),
    (0, swagger_1.ApiOperation)({ summary: 'Send message to AI' }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Req)()),
    __param(2, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object, SendMessageDto]),
    __metadata("design:returntype", Promise)
], AIController.prototype, "sendMessage", null);
__decorate([
    (0, common_1.Delete)('conversations/:id'),
    (0, swagger_1.ApiOperation)({ summary: 'Delete AI conversation' }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], AIController.prototype, "deleteConversation", null);
__decorate([
    (0, common_1.Post)('conversations/:id/recommend-product'),
    (0, swagger_1.ApiOperation)({ summary: 'Generate product recommendation' }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], AIController.prototype, "recommendProduct", null);
__decorate([
    (0, common_1.Post)('conversations/:id/analyze-intent'),
    (0, swagger_1.ApiOperation)({ summary: 'Analyze customer intent' }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Req)()),
    __param(2, (0, common_1.Body)('message')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object, String]),
    __metadata("design:returntype", Promise)
], AIController.prototype, "analyzeIntent", null);
exports.AIController = AIController = __decorate([
    (0, swagger_1.ApiTags)('ai'),
    (0, swagger_1.ApiBearerAuth)(),
    (0, common_1.UseGuards)(auth_guard_1.AuthGuard),
    (0, common_1.Controller)({ path: 'ai', version: '1' }),
    __metadata("design:paramtypes", [ai_service_1.AIService])
], AIController);
//# sourceMappingURL=ai.controller.js.map