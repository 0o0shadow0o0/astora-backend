import { PaginationDto } from '../../../common/dto/common.dto';
import { ChatType, ChatStatus } from '../entities/chat-thread.entity';
import { MessageType, MessageDirection } from '../entities/message.entity';
export declare class CreateChatThreadDto {
    externalId: string;
    type?: ChatType;
    title?: string;
    contactId?: string;
    whatsappAccountId: string;
}
export declare class UpdateChatThreadDto {
    status?: ChatStatus;
    isPinned?: boolean;
    isArchived?: boolean;
    isMuted?: boolean;
}
export declare class ChatQueryDto extends PaginationDto {
    type?: ChatType;
    status?: ChatStatus;
    isPinned?: boolean;
    isArchived?: boolean;
    contactId?: string;
    whatsappAccountId?: string;
}
export declare class SendChatMessageDto {
    to: string;
    content: string;
    type?: MessageType;
    replyToId?: string;
}
export declare class SendMediaMessageDto {
    to: string;
    mediaUrl: string;
    type: 'image' | 'video' | 'audio' | 'document';
    caption?: string;
    filename?: string;
}
export declare class MessageQueryDto extends PaginationDto {
    type?: MessageType;
    direction?: MessageDirection;
    status?: string;
    search?: string;
}
export declare class MarkReadDto {
    chatThreadId: string;
}
export declare class ArchiveChatDto {
    archive: boolean;
}
export declare class PinChatDto {
    pin: boolean;
}
