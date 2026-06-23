import { BaseEntity } from '../../../common/entities/base.entity';
import { User } from '../../users/entities/user.entity';
import { Contact } from '../../contacts/entities/contact.entity';
import { WhatsAppAccount } from '../../whatsapp/entities/whatsapp-account.entity';
export declare enum ChatType {
    DIRECT = "direct",
    GROUP = "group",
    BROADCAST = "broadcast",
    CHANNEL = "channel"
}
export declare enum ChatStatus {
    ACTIVE = "active",
    ARCHIVED = "archived",
    PINNED = "pinned",
    MUTED = "muted",
    SPAM = "spam"
}
export declare class ChatThread extends BaseEntity {
    externalId: string;
    type: ChatType;
    status: ChatStatus;
    title?: string;
    image?: string;
    description?: string;
    isReadOnly: boolean;
    isMuted: boolean;
    isPinned: boolean;
    isArchived: boolean;
    isSpam: boolean;
    unreadCount: number;
    messageCount: number;
    lastMessage?: string;
    lastMessageAt?: Date;
    user: User;
    userId: string;
    contact?: Contact;
    contactId?: string;
    whatsappAccount: WhatsAppAccount;
    whatsappAccountId: string;
}
