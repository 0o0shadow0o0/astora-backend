import { BaseEntity } from '../../../common/entities/base.entity';
import { User } from '../../users/entities/user.entity';
import { ChatThread } from './chat-thread.entity';
export declare enum MessageType {
    TEXT = "text",
    IMAGE = "image",
    VIDEO = "video",
    AUDIO = "audio",
    DOCUMENT = "document",
    STICKER = "sticker",
    LOCATION = "location",
    CONTACT = "contact",
    VOICE = "voice",
    POLL = "poll",
    TEMPLATE = "template",
    BUTTON = "button",
    REACTION = "reaction",
    SYSTEM = "system"
}
export declare enum MessageStatus {
    PENDING = "pending",
    SENT = "sent",
    DELIVERED = "delivered",
    READ = "read",
    FAILED = "failed"
}
export declare enum MessageDirection {
    INCOMING = "incoming",
    OUTGOING = "outgoing"
}
export declare class Message extends BaseEntity {
    externalId: string;
    type: MessageType;
    status: MessageStatus;
    direction: MessageDirection;
    content: string;
    caption?: string;
    mediaUrl?: string;
    mediaMimeType?: string;
    mediaFileName?: string;
    mediaSize?: number;
    isDeleted: boolean;
    isEdited: boolean;
    isForwarded: boolean;
    isStarred: boolean;
    replyCount: number;
    replyToId?: string;
    user?: User;
    userId?: string;
    chatThread: ChatThread;
    chatThreadId: string;
}
