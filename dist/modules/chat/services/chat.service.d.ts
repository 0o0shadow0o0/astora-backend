import { Repository } from 'typeorm';
import { ChatThread } from '../entities/chat-thread.entity';
import { Message } from '../entities/message.entity';
import { PaginatedResponseDto } from '../../../common/dto/common.dto';
import { CreateChatThreadDto, UpdateChatThreadDto, ChatQueryDto, MessageQueryDto } from '../dto/chat.dto';
export declare class ChatService {
    private chatThreadRepository;
    private messageRepository;
    constructor(chatThreadRepository: Repository<ChatThread>, messageRepository: Repository<Message>);
    createChatThread(userId: string, dto: CreateChatThreadDto): Promise<ChatThread>;
    findAllChats(userId: string, query: ChatQueryDto): Promise<PaginatedResponseDto<ChatThread>>;
    findChatById(id: string, userId: string): Promise<ChatThread>;
    updateChatThread(id: string, userId: string, dto: UpdateChatThreadDto): Promise<ChatThread>;
    deleteChatThread(id: string, userId: string): Promise<void>;
    getMessages(chatThreadId: string, userId: string, query: MessageQueryDto): Promise<PaginatedResponseDto<Message>>;
    createMessage(chatThreadId: string, userId: string, dto: any): Promise<Message>;
    markAsRead(id: string, userId: string): Promise<void>;
    archiveChat(id: string, userId: string, archive: boolean): Promise<void>;
    pinChat(id: string, userId: string, pin: boolean): Promise<void>;
}
