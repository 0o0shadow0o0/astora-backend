import { OnGatewayConnection, OnGatewayDisconnect } from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { EventEmitter2 } from '@nestjs/event-emitter';
interface AuthenticatedSocket extends Socket {
    userId?: string;
}
export declare class WebsocketGateway implements OnGatewayConnection, OnGatewayDisconnect {
    private eventEmitter;
    server: Server;
    private readonly logger;
    private userSockets;
    constructor(eventEmitter: EventEmitter2);
    private setupEventListeners;
    handleConnection(client: AuthenticatedSocket): void;
    handleDisconnect(client: AuthenticatedSocket): void;
    handleAuthenticate(client: AuthenticatedSocket, data: {
        token: string;
    }): void;
    handleSubscribeChat(client: AuthenticatedSocket, data: {
        chatThreadId: string;
    }): void;
    handleUnsubscribeChat(client: AuthenticatedSocket, data: {
        chatThreadId: string;
    }): void;
    handleSubscribeWhatsApp(client: AuthenticatedSocket, data: {
        accountId: string;
    }): void;
    handleUnsubscribeWhatsApp(client: AuthenticatedSocket, data: {
        accountId: string;
    }): void;
    handleTyping(client: AuthenticatedSocket, data: {
        chatThreadId: string;
        isTyping: boolean;
    }): void;
    emitToUser(userId: string, event: string, data: any): void;
    emitToChat(chatThreadId: string, event: string, data: any): void;
    emitToWhatsApp(accountId: string, event: string, data: any): void;
    private addUserSocket;
    private removeUserSocket;
    private extractUserId;
}
export {};
