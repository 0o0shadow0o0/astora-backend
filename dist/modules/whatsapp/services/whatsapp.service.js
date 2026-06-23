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
var WhatsAppService_1;
var _a;
Object.defineProperty(exports, "__esModule", { value: true });
exports.WhatsAppService = void 0;
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const bullmq_1 = require("@nestjs/bullmq");
const bullmq_2 = require("bullmq");
const whatsapp_account_entity_1 = require("../entities/whatsapp-account.entity");
const event_emitter_1 = require("@nestjs/event-emitter");
let WhatsAppService = WhatsAppService_1 = class WhatsAppService {
    constructor(whatsappRepository, messageQueue, configService, eventEmitter) {
        this.whatsappRepository = whatsappRepository;
        this.messageQueue = messageQueue;
        this.configService = configService;
        this.eventEmitter = eventEmitter;
        this.logger = new common_1.Logger(WhatsAppService_1.name);
        this.providers = new Map();
    }
    async createAccount(userId, dto) {
        const account = this.whatsappRepository.create({
            ...dto,
            userId,
            status: whatsapp_account_entity_1.WhatsAppStatus.DISCONNECTED,
        });
        return this.whatsappRepository.save(account);
    }
    async findAll(userId) {
        return this.whatsappRepository.find({ where: { userId } });
    }
    async findOne(id, userId) {
        const account = await this.whatsappRepository.findOne({ where: { id, userId } });
        if (!account) {
            throw new common_1.NotFoundException('WhatsApp account not found');
        }
        return account;
    }
    async update(id, userId, dto) {
        const account = await this.findOne(id, userId);
        Object.assign(account, dto);
        return this.whatsappRepository.save(account);
    }
    async delete(id, userId) {
        const account = await this.findOne(id, userId);
        await this.disconnect(id);
        await this.whatsappRepository.remove(account);
    }
    async connect(id, userId) {
        const account = await this.findOne(id, userId);
        const provider = this.getProviderInstance(account.provider);
        this.providers.set(id, provider);
        provider.onQR((qr) => {
            this.whatsappRepository.update(id, {
                qrCode: qr,
                qrExpiresAt: new Date(Date.now() + 60000),
                status: whatsapp_account_entity_1.WhatsAppStatus.QR_READY,
            });
            this.eventEmitter.emit('whatsapp.qr', { accountId: id, qr });
        });
        provider.onConnectionChange((state) => {
            const status = state === 'open' ? whatsapp_account_entity_1.WhatsAppStatus.CONNECTED :
                state === 'connecting' ? whatsapp_account_entity_1.WhatsAppStatus.CONNECTING :
                    whatsapp_account_entity_1.WhatsAppStatus.DISCONNECTED;
            this.whatsappRepository.update(id, {
                status,
                lastConnectedAt: state === 'open' ? new Date() : undefined,
                lastDisconnectedAt: state === 'closed' ? new Date() : undefined,
            });
            this.eventEmitter.emit('whatsapp.connection', { accountId: id, state });
        });
        provider.onMessage((message) => {
            this.eventEmitter.emit('whatsapp.message', { accountId: id, message });
        });
        try {
            await provider.connect();
            const qr = await provider.getQRCode();
            await this.whatsappRepository.update(id, {
                status: whatsapp_account_entity_1.WhatsAppStatus.QR_READY,
                qrCode: qr,
                qrExpiresAt: new Date(Date.now() + 60000),
            });
            return { qrCode: qr };
        }
        catch (error) {
            this.logger.error(`Failed to connect WhatsApp account ${id}:`, error);
            await this.whatsappRepository.update(id, {
                status: whatsapp_account_entity_1.WhatsAppStatus.ERROR,
                errorMessage: error.message,
            });
            throw new common_1.BadRequestException('Failed to connect WhatsApp account');
        }
    }
    async disconnect(id) {
        const provider = this.providers.get(id);
        if (provider) {
            await provider.disconnect();
            this.providers.delete(id);
        }
        await this.whatsappRepository.update(id, {
            status: whatsapp_account_entity_1.WhatsAppStatus.DISCONNECTED,
            qrCode: null,
        });
    }
    async sendMessage(accountId, userId, dto) {
        const account = await this.findOne(accountId, userId);
        if (account.status !== whatsapp_account_entity_1.WhatsAppStatus.CONNECTED) {
            throw new common_1.BadRequestException('WhatsApp account is not connected');
        }
        const provider = this.providers.get(accountId);
        if (!provider) {
            throw new common_1.BadRequestException('WhatsApp provider not initialized');
        }
        const job = await this.messageQueue.add('send-message', {
            accountId,
            to: dto.to,
            content: dto.content,
            replyTo: dto.replyTo,
        });
        return { jobId: job.id, status: 'queued' };
    }
    async sendMedia(accountId, userId, dto) {
        const account = await this.findOne(accountId, userId);
        if (account.status !== whatsapp_account_entity_1.WhatsAppStatus.CONNECTED) {
            throw new common_1.BadRequestException('WhatsApp account is not connected');
        }
        const job = await this.messageQueue.add('send-media', {
            accountId,
            to: dto.to,
            mediaUrl: dto.mediaUrl,
            type: dto.type,
            caption: dto.caption,
            filename: dto.filename,
        });
        return { jobId: job.id, status: 'queued' };
    }
    async sendLocation(accountId, userId, dto) {
        const account = await this.findOne(accountId, userId);
        if (account.status !== whatsapp_account_entity_1.WhatsAppStatus.CONNECTED) {
            throw new common_1.BadRequestException('WhatsApp account is not connected');
        }
        const provider = this.providers.get(accountId);
        if (!provider) {
            throw new common_1.BadRequestException('WhatsApp provider not initialized');
        }
        const message = await provider.sendLocationMessage(dto.to, dto.latitude, dto.longitude);
        return message;
    }
    async getQRCode(id, userId) {
        const account = await this.findOne(id, userId);
        if (account.qrExpiresAt && account.qrExpiresAt < new Date()) {
            throw new common_1.BadRequestException('QR code has expired. Please request a new one.');
        }
        return {
            qrCode: account.qrCode,
            expiresAt: account.qrExpiresAt,
        };
    }
    async getContacts(accountId, userId) {
        const account = await this.findOne(accountId, userId);
        if (account.status !== whatsapp_account_entity_1.WhatsAppStatus.CONNECTED) {
            throw new common_1.BadRequestException('WhatsApp account is not connected');
        }
        const provider = this.providers.get(accountId);
        if (!provider) {
            throw new common_1.BadRequestException('WhatsApp provider not initialized');
        }
        return provider.getContacts();
    }
    getProviderInstance(providerType) {
        switch (providerType) {
            case whatsapp_account_entity_1.WhatsAppProvider.BAILEYS:
                return this.createBaileysProvider();
            case whatsapp_account_entity_1.WhatsAppProvider.EVOLUTION_API:
                return this.createEvolutionApiProvider();
            case whatsapp_account_entity_1.WhatsAppProvider.WPP_CONNECT:
                return this.createWppConnectProvider();
            case whatsapp_account_entity_1.WhatsAppProvider.META:
                return this.createMetaProvider();
            default:
                return this.createBaileysProvider();
        }
    }
    createBaileysProvider() {
        return {
            connect: async () => { },
            disconnect: async () => { },
            getConnectionState: () => 'closed',
            sendTextMessage: async (to, content) => ({ id: '', from: '', to, content, type: 'text', timestamp: new Date(), fromMe: true }),
            sendMediaMessage: async (to, mediaUrl, type, caption) => ({ id: '', from: '', to, content: caption || '', type: type, timestamp: new Date(), fromMe: true }),
            sendDocumentMessage: async (to, documentUrl, filename) => ({ id: '', from: '', to, content: filename, type: 'document', timestamp: new Date(), fromMe: true }),
            sendLocationMessage: async (to, latitude, longitude) => ({ id: '', from: '', to, content: `${latitude},${longitude}`, type: 'location', timestamp: new Date(), fromMe: true }),
            getContacts: async () => [],
            getChatById: async (chatId) => ({}),
            getMessages: async (chatId, limit) => [],
            markAsRead: async (chatId) => { },
            archiveChat: async (chatId, archive) => { },
            pinChat: async (chatId, pin) => { },
            muteChat: async (chatId, mute, duration) => { },
            deleteMessage: async (chatId, messageId) => { },
            downloadMedia: async (messageId) => Buffer.from(''),
            getQRCode: async () => '',
            onQR: (callback) => { },
            onMessage: (callback) => { },
            onConnectionChange: (callback) => { },
        };
    }
    createEvolutionApiProvider() {
        const apiUrl = this.configService.get('WA_EVOLUTION_API_URL');
        const apiKey = this.configService.get('WA_EVOLUTION_API_KEY');
        return {
            connect: async () => { },
            disconnect: async () => { },
            getConnectionState: () => 'closed',
            sendTextMessage: async (to, content) => ({ id: '', from: '', to, content, type: 'text', timestamp: new Date(), fromMe: true }),
            sendMediaMessage: async (to, mediaUrl, type, caption) => ({ id: '', from: '', to, content: caption || '', type: type, timestamp: new Date(), fromMe: true }),
            sendDocumentMessage: async (to, documentUrl, filename) => ({ id: '', from: '', to, content: filename, type: 'document', timestamp: new Date(), fromMe: true }),
            sendLocationMessage: async (to, latitude, longitude) => ({ id: '', from: '', to, content: `${latitude},${longitude}`, type: 'location', timestamp: new Date(), fromMe: true }),
            getContacts: async () => [],
            getChatById: async (chatId) => ({}),
            getMessages: async (chatId, limit) => [],
            markAsRead: async (chatId) => { },
            archiveChat: async (chatId, archive) => { },
            pinChat: async (chatId, pin) => { },
            muteChat: async (chatId, mute, duration) => { },
            deleteMessage: async (chatId, messageId) => { },
            downloadMedia: async (messageId) => Buffer.from(''),
            getQRCode: async () => '',
            onQR: (callback) => { },
            onMessage: (callback) => { },
            onConnectionChange: (callback) => { },
        };
    }
    createWppConnectProvider() {
        const apiUrl = this.configService.get('WA_WPP_CONNECT_URL');
        const token = this.configService.get('WA_WPP_CONNECT_TOKEN');
        return {
            connect: async () => { },
            disconnect: async () => { },
            getConnectionState: () => 'closed',
            sendTextMessage: async (to, content) => ({ id: '', from: '', to, content, type: 'text', timestamp: new Date(), fromMe: true }),
            sendMediaMessage: async (to, mediaUrl, type, caption) => ({ id: '', from: '', to, content: caption || '', type: type, timestamp: new Date(), fromMe: true }),
            sendDocumentMessage: async (to, documentUrl, filename) => ({ id: '', from: '', to, content: filename, type: 'document', timestamp: new Date(), fromMe: true }),
            sendLocationMessage: async (to, latitude, longitude) => ({ id: '', from: '', to, content: `${latitude},${longitude}`, type: 'location', timestamp: new Date(), fromMe: true }),
            getContacts: async () => [],
            getChatById: async (chatId) => ({}),
            getMessages: async (chatId, limit) => [],
            markAsRead: async (chatId) => { },
            archiveChat: async (chatId, archive) => { },
            pinChat: async (chatId, pin) => { },
            muteChat: async (chatId, mute, duration) => { },
            deleteMessage: async (chatId, messageId) => { },
            downloadMedia: async (messageId) => Buffer.from(''),
            getQRCode: async () => '',
            onQR: (callback) => { },
            onMessage: (callback) => { },
            onConnectionChange: (callback) => { },
        };
    }
    createMetaProvider() {
        const appId = this.configService.get('WA_META_APP_ID');
        const appSecret = this.configService.get('WA_META_APP_SECRET');
        const phoneNumberId = this.configService.get('WA_META_PHONE_NUMBER_ID');
        return {
            connect: async () => { },
            disconnect: async () => { },
            getConnectionState: () => 'closed',
            sendTextMessage: async (to, content) => ({ id: '', from: '', to, content, type: 'text', timestamp: new Date(), fromMe: true }),
            sendMediaMessage: async (to, mediaUrl, type, caption) => ({ id: '', from: '', to, content: caption || '', type: type, timestamp: new Date(), fromMe: true }),
            sendDocumentMessage: async (to, documentUrl, filename) => ({ id: '', from: '', to, content: filename, type: 'document', timestamp: new Date(), fromMe: true }),
            sendLocationMessage: async (to, latitude, longitude) => ({ id: '', from: '', to, content: `${latitude},${longitude}`, type: 'location', timestamp: new Date(), fromMe: true }),
            getContacts: async () => [],
            getChatById: async (chatId) => ({}),
            getMessages: async (chatId, limit) => [],
            markAsRead: async (chatId) => { },
            archiveChat: async (chatId, archive) => { },
            pinChat: async (chatId, pin) => { },
            muteChat: async (chatId, mute, duration) => { },
            deleteMessage: async (chatId, messageId) => { },
            downloadMedia: async (messageId) => Buffer.from(''),
            getQRCode: async () => '',
            onQR: (callback) => { },
            onMessage: (callback) => { },
            onConnectionChange: (callback) => { },
        };
    }
};
exports.WhatsAppService = WhatsAppService;
exports.WhatsAppService = WhatsAppService = WhatsAppService_1 = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(whatsapp_account_entity_1.WhatsAppAccount)),
    __param(1, (0, bullmq_1.InjectQueue)('whatsapp-messages')),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        bullmq_2.Queue,
        config_1.ConfigService, typeof (_a = typeof event_emitter_1.EventEmitter2 !== "undefined" && event_emitter_1.EventEmitter2) === "function" ? _a : Object])
], WhatsAppService);
//# sourceMappingURL=whatsapp.service.js.map