import { ConfigService } from '@nestjs/config';
import { Repository } from 'typeorm';
import { Queue } from 'bullmq';
import { WhatsAppAccount, WhatsAppProvider } from '../entities/whatsapp-account.entity';
import { CreateWhatsAppAccountDto, UpdateWhatsAppAccountDto, SendMessageDto, SendMediaDto, SendLocationDto } from '../dto/whatsapp.dto';
import { EventEmitter2 } from '@nestjs/event-emitter';
export declare class WhatsAppService {
    private whatsappRepository;
    private messageQueue;
    private configService;
    private eventEmitter;
    private readonly logger;
    private providers;
    constructor(whatsappRepository: Repository<WhatsAppAccount>, messageQueue: Queue, configService: ConfigService, eventEmitter: EventEmitter2);
    createAccount(userId: string, dto: CreateWhatsAppAccountDto): Promise<WhatsAppAccount>;
    findAll(userId: string): Promise<WhatsAppAccount[]>;
    findOne(id: string, userId: string): Promise<WhatsAppProvider>;
    update(id: string, userId: string, dto: UpdateWhatsAppAccountDto): Promise<WhatsAppAccount>;
    delete(id: string, userId: string): Promise<void>;
    connect(id: string, userId: string): Promise<{
        qrCode?: string;
    }>;
    disconnect(id: string): Promise<void>;
    sendMessage(accountId: string, userId: string, dto: SendMessageDto): Promise<any>;
    sendMedia(accountId: string, userId: string, dto: SendMediaDto): Promise<any>;
    sendLocation(accountId: string, userId: string, dto: SendLocationDto): Promise<any>;
    getQRCode(id: string, userId: string): Promise<{
        qrCode: string;
        expiresAt: Date;
    }>;
    getContacts(accountId: string, userId: string): Promise<any[]>;
    private getProviderInstance;
    private createBaileysProvider;
    private createEvolutionApiProvider;
    private createWppConnectProvider;
    private createMetaProvider;
}
