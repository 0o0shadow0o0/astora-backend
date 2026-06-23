import { WhatsAppService } from '../services/whatsapp.service';
import { CreateWhatsAppAccountDto, UpdateWhatsAppAccountDto, SendMessageDto, SendMediaDto, SendLocationDto } from '../dto/whatsapp.dto';
export declare class WhatsAppController {
    private readonly whatsappService;
    constructor(whatsappService: WhatsAppService);
    createAccount(req: any, dto: CreateWhatsAppAccountDto): Promise<import("../entities/whatsapp-account.entity").WhatsAppAccount>;
    findAll(req: any): Promise<import("../entities/whatsapp-account.entity").WhatsAppAccount[]>;
    findOne(id: string, req: any): Promise<import("../entities/whatsapp-account.entity").WhatsAppProvider>;
    update(id: string, req: any, dto: UpdateWhatsAppAccountDto): Promise<import("../entities/whatsapp-account.entity").WhatsAppAccount>;
    delete(id: string, req: any): Promise<{
        message: string;
    }>;
    connect(id: string, req: any): Promise<{
        qrCode?: string;
    }>;
    disconnect(id: string, req: any): Promise<{
        message: string;
    }>;
    getQRCode(id: string, req: any): Promise<{
        qrCode: string;
        expiresAt: Date;
    }>;
    getContacts(id: string, req: any): Promise<any[]>;
    sendMessage(id: string, req: any, dto: SendMessageDto): Promise<any>;
    sendMedia(id: string, req: any, dto: SendMediaDto): Promise<any>;
    sendLocation(id: string, req: any, dto: SendLocationDto): Promise<any>;
}
