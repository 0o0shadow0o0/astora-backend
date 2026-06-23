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
var WebsocketGateway_1;
var _a;
Object.defineProperty(exports, "__esModule", { value: true });
exports.WebsocketGateway = void 0;
const websockets_1 = require("@nestjs/websockets");
const socket_io_1 = require("socket.io");
const common_1 = require("@nestjs/common");
const event_emitter_1 = require("@nestjs/event-emitter");
let WebsocketGateway = WebsocketGateway_1 = class WebsocketGateway {
    constructor(eventEmitter) {
        this.eventEmitter = eventEmitter;
        this.logger = new common_1.Logger(WebsocketGateway_1.name);
        this.userSockets = new Map();
        this.setupEventListeners();
    }
    setupEventListeners() {
        this.eventEmitter.on('new_message', (data) => {
            this.emitToUser(data.userId, 'new_message', data);
        });
        this.eventEmitter.on('message_sent', (data) => {
            this.emitToUser(data.userId, 'message_sent', data);
        });
        this.eventEmitter.on('message_delivered', (data) => {
            this.emitToUser(data.userId, 'message_delivered', data);
        });
        this.eventEmitter.on('message_read', (data) => {
            this.emitToUser(data.userId, 'message_read', data);
        });
        this.eventEmitter.on('task_created', (data) => {
            this.emitToUser(data.userId, 'task_created', data);
        });
        this.eventEmitter.on('task_completed', (data) => {
            this.emitToUser(data.userId, 'task_completed', data);
        });
        this.eventEmitter.on('task_failed', (data) => {
            this.emitToUser(data.userId, 'task_failed', data);
        });
        this.eventEmitter.on('customer_created', (data) => {
            this.emitToUser(data.userId, 'customer_created', data);
        });
        this.eventEmitter.on('order_created', (data) => {
            this.emitToUser(data.userId, 'order_created', data);
        });
        this.eventEmitter.on('whatsapp.connection', (data) => {
            this.emitToUser(data.accountUserId, 'whatsapp.connection', data);
        });
        this.eventEmitter.on('whatsapp.qr', (data) => {
            this.emitToUser(data.accountUserId, 'whatsapp.qr', data);
        });
        this.eventEmitter.on('whatsapp.message', (data) => {
            this.emitToUser(data.userId, 'whatsapp.message', data);
        });
        this.eventEmitter.on('notification', (data) => {
            this.emitToUser(data.userId, 'notification', data);
        });
    }
    handleConnection(client) {
        this.logger.log(`Client connected: ${client.id}`);
        const token = client.handshake.auth.token || client.handshake.headers.authorization?.split(' ')[1];
        if (token) {
            client.userId = this.extractUserId(token);
            this.addUserSocket(client.userId, client.id);
            this.logger.log(`User ${client.userId} connected with socket ${client.id}`);
        }
    }
    handleDisconnect(client) {
        this.logger.log(`Client disconnected: ${client.id}`);
        if (client.userId) {
            this.removeUserSocket(client.userId, client.id);
        }
    }
    handleAuthenticate(client, data) {
        const userId = this.extractUserId(data.token);
        if (userId) {
            client.userId = userId;
            this.addUserSocket(userId, client.id);
            client.emit('authenticated', { success: true, userId });
            this.logger.log(`User ${userId} authenticated on socket ${client.id}`);
        }
        else {
            client.emit('authenticated', { success: false, error: 'Invalid token' });
        }
    }
    handleSubscribeChat(client, data) {
        if (client.userId) {
            client.join(`chat:${data.chatThreadId}`);
            client.emit('subscribed_chat', { chatThreadId: data.chatThreadId });
        }
    }
    handleUnsubscribeChat(client, data) {
        if (client.userId) {
            client.leave(`chat:${data.chatThreadId}`);
        }
    }
    handleSubscribeWhatsApp(client, data) {
        if (client.userId) {
            client.join(`whatsapp:${data.accountId}`);
        }
    }
    handleUnsubscribeWhatsApp(client, data) {
        if (client.userId) {
            client.leave(`whatsapp:${data.accountId}`);
        }
    }
    handleTyping(client, data) {
        if (client.userId) {
            client.to(`chat:${data.chatThreadId}`).emit('user_typing', {
                userId: client.userId,
                chatThreadId: data.chatThreadId,
                isTyping: data.isTyping,
            });
        }
    }
    emitToUser(userId, event, data) {
        const socketIds = this.userSockets.get(userId);
        if (socketIds) {
            socketIds.forEach(socketId => {
                this.server.to(socketId).emit(event, data);
            });
        }
    }
    emitToChat(chatThreadId, event, data) {
        this.server.to(`chat:${chatThreadId}`).emit(event, data);
    }
    emitToWhatsApp(accountId, event, data) {
        this.server.to(`whatsapp:${accountId}`).emit(event, data);
    }
    addUserSocket(userId, socketId) {
        if (!this.userSockets.has(userId)) {
            this.userSockets.set(userId, new Set());
        }
        this.userSockets.get(userId).add(socketId);
    }
    removeUserSocket(userId, socketId) {
        const sockets = this.userSockets.get(userId);
        if (sockets) {
            sockets.delete(socketId);
            if (sockets.size === 0) {
                this.userSockets.delete(userId);
            }
        }
    }
    extractUserId(token) {
        try {
            const payload = JSON.parse(Buffer.from(token.split('.')[1], 'base64').toString());
            return payload.sub || null;
        }
        catch {
            return null;
        }
    }
};
exports.WebsocketGateway = WebsocketGateway;
__decorate([
    (0, websockets_1.WebSocketServer)(),
    __metadata("design:type", socket_io_1.Server)
], WebsocketGateway.prototype, "server", void 0);
__decorate([
    (0, websockets_1.SubscribeMessage)('authenticate'),
    __param(0, (0, websockets_1.ConnectedSocket)()),
    __param(1, (0, websockets_1.MessageBody)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", void 0)
], WebsocketGateway.prototype, "handleAuthenticate", null);
__decorate([
    (0, websockets_1.SubscribeMessage)('subscribe_chat'),
    __param(0, (0, websockets_1.ConnectedSocket)()),
    __param(1, (0, websockets_1.MessageBody)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", void 0)
], WebsocketGateway.prototype, "handleSubscribeChat", null);
__decorate([
    (0, websockets_1.SubscribeMessage)('unsubscribe_chat'),
    __param(0, (0, websockets_1.ConnectedSocket)()),
    __param(1, (0, websockets_1.MessageBody)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", void 0)
], WebsocketGateway.prototype, "handleUnsubscribeChat", null);
__decorate([
    (0, websockets_1.SubscribeMessage)('subscribe_whatsapp'),
    __param(0, (0, websockets_1.ConnectedSocket)()),
    __param(1, (0, websockets_1.MessageBody)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", void 0)
], WebsocketGateway.prototype, "handleSubscribeWhatsApp", null);
__decorate([
    (0, websockets_1.SubscribeMessage)('unsubscribe_whatsapp'),
    __param(0, (0, websockets_1.ConnectedSocket)()),
    __param(1, (0, websockets_1.MessageBody)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", void 0)
], WebsocketGateway.prototype, "handleUnsubscribeWhatsApp", null);
__decorate([
    (0, websockets_1.SubscribeMessage)('typing'),
    __param(0, (0, websockets_1.ConnectedSocket)()),
    __param(1, (0, websockets_1.MessageBody)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", void 0)
], WebsocketGateway.prototype, "handleTyping", null);
exports.WebsocketGateway = WebsocketGateway = WebsocketGateway_1 = __decorate([
    (0, websockets_1.WebSocketGateway)({
        cors: {
            origin: '*',
            credentials: true,
        },
        namespace: '/ws',
    }),
    __metadata("design:paramtypes", [typeof (_a = typeof event_emitter_1.EventEmitter2 !== "undefined" && event_emitter_1.EventEmitter2) === "function" ? _a : Object])
], WebsocketGateway);
//# sourceMappingURL=websocket.gateway.js.map