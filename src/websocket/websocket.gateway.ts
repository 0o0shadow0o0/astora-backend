import {
  WebSocketGateway,
  WebSocketServer,
  SubscribeMessage,
  OnGatewayConnection,
  OnGatewayDisconnect,
  MessageBody,
  ConnectedSocket,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { Logger } from '@nestjs/common';
import { EventEmitter2 } from '@nestjs/event-emitter';

interface AuthenticatedSocket extends Socket {
  userId?: string;
}

@WebSocketGateway({
  cors: {
    origin: '*',
    credentials: true,
  },
  namespace: '/ws',
})
export class WebsocketGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer()
  server: Server;

  private readonly logger = new Logger(WebsocketGateway.name);
  private userSockets: Map<string, Set<string>> = new Map();

  constructor(private eventEmitter: EventEmitter2) {
    this.setupEventListeners();
  }

  private setupEventListeners() {
    this.eventEmitter.on('new_message', (data: any) => {
      this.emitToUser(data.userId, 'new_message', data);
    });

    this.eventEmitter.on('message_sent', (data: any) => {
      this.emitToUser(data.userId, 'message_sent', data);
    });

    this.eventEmitter.on('message_delivered', (data: any) => {
      this.emitToUser(data.userId, 'message_delivered', data);
    });

    this.eventEmitter.on('message_read', (data: any) => {
      this.emitToUser(data.userId, 'message_read', data);
    });

    this.eventEmitter.on('task_created', (data: any) => {
      this.emitToUser(data.userId, 'task_created', data);
    });

    this.eventEmitter.on('task_completed', (data: any) => {
      this.emitToUser(data.userId, 'task_completed', data);
    });

    this.eventEmitter.on('task_failed', (data: any) => {
      this.emitToUser(data.userId, 'task_failed', data);
    });

    this.eventEmitter.on('customer_created', (data: any) => {
      this.emitToUser(data.userId, 'customer_created', data);
    });

    this.eventEmitter.on('order_created', (data: any) => {
      this.emitToUser(data.userId, 'order_created', data);
    });

    this.eventEmitter.on('whatsapp.connection', (data: any) => {
      this.emitToUser(data.accountUserId, 'whatsapp.connection', data);
    });

    this.eventEmitter.on('whatsapp.qr', (data: any) => {
      this.emitToUser(data.accountUserId, 'whatsapp.qr', data);
    });

    this.eventEmitter.on('whatsapp.message', (data: any) => {
      this.emitToUser(data.userId, 'whatsapp.message', data);
    });

    this.eventEmitter.on('notification', (data: any) => {
      this.emitToUser(data.userId, 'notification', data);
    });
  }

  handleConnection(client: AuthenticatedSocket) {
    this.logger.log(`Client connected: ${client.id}`);
    
    const token = client.handshake.auth.token || client.handshake.headers.authorization?.split(' ')[1];
    
    if (token) {
      client.userId = this.extractUserId(token);
      this.addUserSocket(client.userId, client.id);
      this.logger.log(`User ${client.userId} connected with socket ${client.id}`);
    }
  }

  handleDisconnect(client: AuthenticatedSocket) {
    this.logger.log(`Client disconnected: ${client.id}`);
    
    if (client.userId) {
      this.removeUserSocket(client.userId, client.id);
    }
  }

  @SubscribeMessage('authenticate')
  handleAuthenticate(
    @ConnectedSocket() client: AuthenticatedSocket,
    @MessageBody() data: { token: string },
  ) {
    const userId = this.extractUserId(data.token);
    
    if (userId) {
      client.userId = userId;
      this.addUserSocket(userId, client.id);
      client.emit('authenticated', { success: true, userId });
      this.logger.log(`User ${userId} authenticated on socket ${client.id}`);
    } else {
      client.emit('authenticated', { success: false, error: 'Invalid token' });
    }
  }

  @SubscribeMessage('subscribe_chat')
  handleSubscribeChat(
    @ConnectedSocket() client: AuthenticatedSocket,
    @MessageBody() data: { chatThreadId: string },
  ) {
    if (client.userId) {
      client.join(`chat:${data.chatThreadId}`);
      client.emit('subscribed_chat', { chatThreadId: data.chatThreadId });
    }
  }

  @SubscribeMessage('unsubscribe_chat')
  handleUnsubscribeChat(
    @ConnectedSocket() client: AuthenticatedSocket,
    @MessageBody() data: { chatThreadId: string },
  ) {
    if (client.userId) {
      client.leave(`chat:${data.chatThreadId}`);
    }
  }

  @SubscribeMessage('subscribe_whatsapp')
  handleSubscribeWhatsApp(
    @ConnectedSocket() client: AuthenticatedSocket,
    @MessageBody() data: { accountId: string },
  ) {
    if (client.userId) {
      client.join(`whatsapp:${data.accountId}`);
    }
  }

  @SubscribeMessage('unsubscribe_whatsapp')
  handleUnsubscribeWhatsApp(
    @ConnectedSocket() client: AuthenticatedSocket,
    @MessageBody() data: { accountId: string },
  ) {
    if (client.userId) {
      client.leave(`whatsapp:${data.accountId}`);
    }
  }

  @SubscribeMessage('typing')
  handleTyping(
    @ConnectedSocket() client: AuthenticatedSocket,
    @MessageBody() data: { chatThreadId: string; isTyping: boolean },
  ) {
    if (client.userId) {
      client.to(`chat:${data.chatThreadId}`).emit('user_typing', {
        userId: client.userId,
        chatThreadId: data.chatThreadId,
        isTyping: data.isTyping,
      });
    }
  }

  emitToUser(userId: string, event: string, data: any) {
    const socketIds = this.userSockets.get(userId);
    
    if (socketIds) {
      socketIds.forEach(socketId => {
        this.server.to(socketId).emit(event, data);
      });
    }
  }

  emitToChat(chatThreadId: string, event: string, data: any) {
    this.server.to(`chat:${chatThreadId}`).emit(event, data);
  }

  emitToWhatsApp(accountId: string, event: string, data: any) {
    this.server.to(`whatsapp:${accountId}`).emit(event, data);
  }

  private addUserSocket(userId: string, socketId: string) {
    if (!this.userSockets.has(userId)) {
      this.userSockets.set(userId, new Set());
    }
    this.userSockets.get(userId).add(socketId);
  }

  private removeUserSocket(userId: string, socketId: string) {
    const sockets = this.userSockets.get(userId);
    if (sockets) {
      sockets.delete(socketId);
      if (sockets.size === 0) {
        this.userSockets.delete(userId);
      }
    }
  }

  private extractUserId(token: string): string | null {
    try {
      const payload = JSON.parse(Buffer.from(token.split('.')[1], 'base64').toString());
      return payload.sub || null;
    } catch {
      return null;
    }
  }
}
