import { BaseEntity } from '../../../common/entities/base.entity';
import { User } from '../../users/entities/user.entity';
import { WhatsAppAccount } from '../../whatsapp/entities/whatsapp-account.entity';
export declare enum ContactType {
    PERSONAL = "personal",
    BUSINESS = "business",
    UNKNOWN = "unknown"
}
export declare class Contact extends BaseEntity {
    phone: string;
    name: string;
    profilePicture?: string;
    businessName?: string;
    email?: string;
    address?: string;
    about?: string;
    company?: string;
    website?: string;
    type: ContactType;
    isBlocked: boolean;
    isMuted: boolean;
    isStarred: boolean;
    isArchived: boolean;
    isContact: boolean;
    description?: string;
    user: User;
    userId: string;
    whatsappAccount: WhatsAppAccount;
    whatsappAccountId: string;
}
