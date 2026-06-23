import { BaseEntity } from '../../../common/entities/base.entity';
import { User } from '../../users/entities/user.entity';
export declare enum WhatsAppProvider {
    BAILEYS = "baileys",
    EVOLUTION_API = "evolution_api",
    WPP_CONNECT = "wpp_connect",
    META = "meta"
}
export declare enum WhatsAppStatus {
    CONNECTED = "connected",
    DISCONNECTED = "disconnected",
    CONNECTING = "connecting",
    RECONNECTING = "reconnecting",
    QR_READY = "qr_ready",
    ERROR = "error"
}
export declare class WhatsAppAccount extends BaseEntity {
    name: string;
    provider: WhatsAppProvider;
    status: WhatsAppStatus;
    phoneNumber?: string;
    businessName?: string;
    profileDescription?: string;
    profilePicture?: string;
    isBusiness: boolean;
    multiDevice: boolean;
    autoReconnect: boolean;
    syncMessages: boolean;
    syncContacts: boolean;
    syncPresence: boolean;
    reconnectInterval: number;
    maxReconnectAttempts: number;
    sessionData?: string;
    qrCode?: string;
    qrExpiresAt?: Date;
    lastConnectedAt?: Date;
    lastDisconnectedAt?: Date;
    errorMessage?: string;
    user: User;
    userId: string;
    assignedTo?: User;
    assignedToId?: string;
}
