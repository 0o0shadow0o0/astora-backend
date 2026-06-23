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
exports.ChatService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const chat_thread_entity_1 = require("../entities/chat-thread.entity");
const message_entity_1 = require("../entities/message.entity");
let ChatService = class ChatService {
    constructor(chatThreadRepository, messageRepository) {
        this.chatThreadRepository = chatThreadRepository;
        this.messageRepository = messageRepository;
    }
    async createChatThread(userId, dto) {
        const chatThread = this.chatThreadRepository.create({
            ...dto,
            userId,
        });
        return this.chatThreadRepository.save(chatThread);
    }
    async findAllChats(userId, query) {
        const { page = 1, limit = 20, type, status, isPinned, isArchived, contactId, whatsappAccountId } = query;
        const where = { userId };
        if (type)
            where.type = type;
        if (status)
            where.status = status;
        if (isPinned !== undefined)
            where.isPinned = isPinned;
        if (isArchived !== undefined)
            where.isArchived = isArchived;
        if (contactId)
            where.contactId = contactId;
        if (whatsappAccountId)
            where.whatsappAccountId = whatsappAccountId;
        const [data, total] = await this.chatThreadRepository.findAndCount({
            where,
            relations: ['contact'],
            order: { lastMessageAt: 'DESC' },
            skip: (page - 1) * limit,
            take: limit,
        });
        return {
            data,
            total,
            page,
            limit,
            totalPages: Math.ceil(total / limit),
        };
    }
    async findChatById(id, userId) {
        const chat = await this.chatThreadRepository.findOne({
            where: { id, userId },
            relations: ['contact', 'messages'],
        });
        if (!chat) {
            throw new common_1.NotFoundException('Chat not found');
        }
        return chat;
    }
    async updateChatThread(id, userId, dto) {
        const chat = await this.findChatById(id, userId);
        Object.assign(chat, dto);
        return this.chatThreadRepository.save(chat);
    }
    async deleteChatThread(id, userId) {
        const chat = await this.findChatById(id, userId);
        await this.chatThreadRepository.remove(chat);
    }
    async getMessages(chatThreadId, userId, query) {
        const chat = await this.findChatById(chatThreadId, userId);
        const { page = 1, limit = 20, type, direction, status, search } = query;
        const where = { chatThreadId: chat.id };
        if (type)
            where.type = type;
        if (direction)
            where.direction = direction;
        if (status)
            where.status = status;
        if (search)
            where.content = (0, typeorm_2.Like)(`%${search}%`);
        const [data, total] = await this.messageRepository.findAndCount({
            where,
            order: { createdAt: 'DESC' },
            skip: (page - 1) * limit,
            take: limit,
        });
        return {
            data,
            total,
            page,
            limit,
            totalPages: Math.ceil(total / limit),
        };
    }
    async createMessage(chatThreadId, userId, dto) {
        const chat = await this.findChatById(chatThreadId, userId);
        const message = this.messageRepository.create({
            ...dto,
            chatThreadId: chat.id,
            userId,
        });
        const savedMessage = await this.messageRepository.save(message);
        await this.chatThreadRepository.update(chat.id, {
            lastMessage: dto.content,
            lastMessageAt: new Date(),
            messageCount: chat.messageCount + 1,
        });
        return savedMessage;
    }
    async markAsRead(id, userId) {
        const chat = await this.findChatById(id, userId);
        await this.chatThreadRepository.update(chat.id, { unreadCount: 0 });
    }
    async archiveChat(id, userId, archive) {
        const chat = await this.findChatById(id, userId);
        await this.chatThreadRepository.update(chat.id, {
            isArchived: archive,
            status: archive ? 'archived' : 'active',
        });
    }
    async pinChat(id, userId, pin) {
        const chat = await this.findChatById(id, userId);
        await this.chatThreadRepository.update(chat.id, {
            isPinned: pin,
            status: pin ? 'pinned' : 'active',
        });
    }
};
exports.ChatService = ChatService;
exports.ChatService = ChatService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(chat_thread_entity_1.ChatThread)),
    __param(1, (0, typeorm_1.InjectRepository)(message_entity_1.Message)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository])
], ChatService);
//# sourceMappingURL=chat.service.js.map