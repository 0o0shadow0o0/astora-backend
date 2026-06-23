import { WhatsAppProvider } from '../entities/whatsapp-account.entity';
export declare class CreateWhatsAppAccountDto {
    name: string;
    provider?: WhatsAppProvider;
    multiDevice?: boolean;
    autoReconnect?: boolean;
    syncMessages?: boolean;
    syncContacts?: boolean;
}
export declare class UpdateWhatsAppAccountDto {
    name?: string;
    autoReconnect?: boolean;
    syncMessages?: boolean;
    syncContacts?: boolean;
    syncPresence?: boolean;
}
export declare class SendMessageDto {
    to: string;
    content: string;
    replyTo?: string;
}
export declare class SendMediaDto {
    to: string;
    mediaUrl: string;
    type: 'image' | 'video' | 'audio' | 'document';
    caption?: string;
    filename?: string;
}
export declare class SendLocationDto {
    to: string;
    latitude: number;
    longitude: number;
    description?: string;
}
export declare class WhatsAppWebhookDto {
    event: string;
    data: any;
}
