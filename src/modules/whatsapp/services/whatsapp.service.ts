import {
  Injectable,
  NotFoundException,
  BadRequestException,
  Logger,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { InjectQueue } from '@nestjs/bullmq';
import { Queue } from 'bullmq';
import { WhatsAppAccount, WhatsAppStatus, WhatsAppProvider } from '../entities/whatsapp-account.entity';
import {
  CreateWhatsAppAccountDto,
  UpdateWhatsAppAccountDto,
  SendMessageDto,
  SendMediaDto,
  SendLocationDto,
} from '../dto/whatsapp.dto';
import { WhatsAppProvider as IWhatsAppProvider } from '../interfaces/whatsapp-provider.interface';
import { EventEmitter2 } from '@nestjs/event-emitter';

@Injectable()
export class WhatsAppService {
  private readonly logger = new Logger(WhatsAppService.name);
  private providers: Map<string, IWhatsAppProvider> = new Map();

  constructor(
    @InjectRepository(WhatsAppAccount)
    private whatsappRepository: Repository<WhatsAppAccount>,
    @InjectQueue('whatsapp-messages')
    private messageQueue: Queue,
    private configService: ConfigService,
    private eventEmitter: EventEmitter2,
  ) {}

  async createAccount(userId: string, dto: CreateWhatsAppAccountDto): Promise<WhatsAppAccount> {
    const account = this.whatsappRepository.create({
      ...dto,
      userId,
      status: WhatsAppStatus.DISCONNECTED,
    });
    return this.whatsappRepository.save(account);
  }

  async findAll(userId: string): Promise<WhatsAppAccount[]> {
    return this.whatsappRepository.find({ where: { userId } });
  }

  async findOne(id: string, userId: string): Promise<WhatsAppAccount> {
    const account = await this.whatsappRepository.findOne({ where: { id, userId } });
    if (!account) {
      throw new NotFoundException('WhatsApp account not found');
    }
    return account;
  }

  async update(id: string, userId: string, dto: UpdateWhatsAppAccountDto): Promise<WhatsAppAccount> {
    const account = await this.findOne(id, userId);
    Object.assign(account, dto);
    return this.whatsappRepository.save(account);
  }

  async delete(id: string, userId: string): Promise<void> {
    const account = await this.findOne(id, userId);
    await this.disconnect(id);
    await this.whatsappRepository.remove(account);
  }

  async connect(id: string, userId: string): Promise<{ qrCode?: string }> {
    const account = await this.findOne(id, userId);
    
    const provider = this.getProviderInstance(account.provider);
    
    this.providers.set(id, provider);

    provider.onQR((qr: string) => {
      this.whatsappRepository.update(id, {
        qrCode: qr,
        qrExpiresAt: new Date(Date.now() + 60000),
        status: WhatsAppStatus.QR_READY,
      });
      this.eventEmitter.emit('whatsapp.qr', { accountId: id, qr });
    });

    provider.onConnectionChange((state: string) => {
      const status = state === 'open' ? WhatsAppStatus.CONNECTED : 
                     state === 'connecting' ? WhatsAppStatus.CONNECTING :
                     WhatsAppStatus.DISCONNECTED;
      
      this.whatsappRepository.update(id, {
        status,
        lastConnectedAt: state === 'open' ? new Date() : undefined,
        lastDisconnectedAt: state === 'closed' ? new Date() : undefined,
      });
      
      this.eventEmitter.emit('whatsapp.connection', { accountId: id, state });
    });

    provider.onMessage((message) => {
      this.eventEmitter.emit('whatsapp.message', { accountId: id, message });
    });

    try {
      await provider.connect();
      
      const qr = await provider.getQRCode();
      
      await this.whatsappRepository.update(id, {
        status: WhatsAppStatus.QR_READY,
        qrCode: qr,
        qrExpiresAt: new Date(Date.now() + 60000),
      });

      return { qrCode: qr };
    } catch (error) {
      this.logger.error(`Failed to connect WhatsApp account ${id}:`, error);
      await this.whatsappRepository.update(id, {
        status: WhatsAppStatus.ERROR,
        errorMessage: error.message,
      });
      throw new BadRequestException('Failed to connect WhatsApp account');
    }
  }

  async disconnect(id: string): Promise<void> {
    const provider = this.providers.get(id);
    if (provider) {
      await provider.disconnect();
      this.providers.delete(id);
    }
    await this.whatsappRepository.update(id, {
      status: WhatsAppStatus.DISCONNECTED,
      qrCode: undefined,
    });
  }

  async sendMessage(accountId: string, userId: string, dto: SendMessageDto): Promise<any> {
    const account = await this.findOne(accountId, userId);
    
    if (account.status !== WhatsAppStatus.CONNECTED) {
      throw new BadRequestException('WhatsApp account is not connected');
    }

    const provider = this.providers.get(accountId);
    if (!provider) {
      throw new BadRequestException('WhatsApp provider not initialized');
    }

    const job = await this.messageQueue.add('send-message', {
      accountId,
      to: dto.to,
      content: dto.content,
      replyTo: dto.replyTo,
    });

    return { jobId: job.id, status: 'queued' };
  }

  async sendMedia(accountId: string, userId: string, dto: SendMediaDto): Promise<any> {
    const account = await this.findOne(accountId, userId);
    
    if (account.status !== WhatsAppStatus.CONNECTED) {
      throw new BadRequestException('WhatsApp account is not connected');
    }

    const job = await this.messageQueue.add('send-media', {
      accountId,
      to: dto.to,
      mediaUrl: dto.mediaUrl,
      type: dto.type,
      caption: dto.caption,
      filename: dto.filename,
    });

    return { jobId: job.id, status: 'queued' };
  }

  async sendLocation(accountId: string, userId: string, dto: SendLocationDto): Promise<any> {
    const account = await this.findOne(accountId, userId);
    
    if (account.status !== WhatsAppStatus.CONNECTED) {
      throw new BadRequestException('WhatsApp account is not connected');
    }

    const provider = this.providers.get(accountId);
    if (!provider) {
      throw new BadRequestException('WhatsApp provider not initialized');
    }

    const message = await provider.sendLocationMessage(dto.to, dto.latitude, dto.longitude);
    return message;
  }

  async getQRCode(id: string, userId: string): Promise<{ qrCode: string; expiresAt: Date }> {
    const account = await this.findOne(id, userId);
    
    if (account.qrExpiresAt && account.qrExpiresAt < new Date()) {
      throw new BadRequestException('QR code has expired. Please request a new one.');
    }

    return {
      qrCode: account.qrCode,
      expiresAt: account.qrExpiresAt,
    };
  }

  async getContacts(accountId: string, userId: string): Promise<any[]> {
    const account = await this.findOne(accountId, userId);
    
    if (account.status !== WhatsAppStatus.CONNECTED) {
      throw new BadRequestException('WhatsApp account is not connected');
    }

    const provider = this.providers.get(accountId);
    if (!provider) {
      throw new BadRequestException('WhatsApp provider not initialized');
    }

    return provider.getContacts();
  }

  private getProviderInstance(providerType: WhatsAppProvider): IWhatsAppProvider {
    switch (providerType) {
      case WhatsAppProvider.BAILEYS:
        return this.createBaileysProvider();
      case WhatsAppProvider.EVOLUTION_API:
        return this.createEvolutionApiProvider();
      case WhatsAppProvider.WPP_CONNECT:
        return this.createWppConnectProvider();
      case WhatsAppProvider.META:
        return this.createMetaProvider();
      default:
        return this.createBaileysProvider();
    }
  }

  private createBaileysProvider(): IWhatsAppProvider {
    return {
      connect: async () => { /* Baileys implementation */ },
      disconnect: async () => { /* Baileys implementation */ },
      getConnectionState: () => 'closed',
      sendTextMessage: async (to, content) => ({ id: '', from: '', to, content, type: 'text', timestamp: new Date(), fromMe: true }),
      sendMediaMessage: async (to, mediaUrl, type, caption) => ({ id: '', from: '', to, content: caption || '', type: type as any, timestamp: new Date(), fromMe: true }),
      sendDocumentMessage: async (to, documentUrl, filename) => ({ id: '', from: '', to, content: filename, type: 'document', timestamp: new Date(), fromMe: true }),
      sendLocationMessage: async (to, latitude, longitude) => ({ id: '', from: '', to, content: `${latitude},${longitude}`, type: 'location', timestamp: new Date(), fromMe: true }),
      getContacts: async () => [],
      getChatById: async (chatId) => ({}),
      getMessages: async (chatId, limit) => [],
      markAsRead: async (chatId) => {},
      archiveChat: async (chatId, archive) => {},
      pinChat: async (chatId, pin) => {},
      muteChat: async (chatId, mute, duration) => {},
      deleteMessage: async (chatId, messageId) => {},
      downloadMedia: async (messageId) => Buffer.from(''),
      getQRCode: async () => '',
      onQR: (callback) => {},
      onMessage: (callback) => {},
      onConnectionChange: (callback) => {},
    };
  }

  private createEvolutionApiProvider(): IWhatsAppProvider {
    const apiUrl = this.configService.get('WA_EVOLUTION_API_URL');
    const apiKey = this.configService.get('WA_EVOLUTION_API_KEY');
    
    return {
      connect: async () => { /* Evolution API connection */ },
      disconnect: async () => { /* Evolution API disconnection */ },
      getConnectionState: () => 'closed',
      sendTextMessage: async (to, content) => ({ id: '', from: '', to, content, type: 'text', timestamp: new Date(), fromMe: true }),
      sendMediaMessage: async (to, mediaUrl, type, caption) => ({ id: '', from: '', to, content: caption || '', type: type as any, timestamp: new Date(), fromMe: true }),
      sendDocumentMessage: async (to, documentUrl, filename) => ({ id: '', from: '', to, content: filename, type: 'document', timestamp: new Date(), fromMe: true }),
      sendLocationMessage: async (to, latitude, longitude) => ({ id: '', from: '', to, content: `${latitude},${longitude}`, type: 'location', timestamp: new Date(), fromMe: true }),
      getContacts: async () => [],
      getChatById: async (chatId) => ({}),
      getMessages: async (chatId, limit) => [],
      markAsRead: async (chatId) => {},
      archiveChat: async (chatId, archive) => {},
      pinChat: async (chatId, pin) => {},
      muteChat: async (chatId, mute, duration) => {},
      deleteMessage: async (chatId, messageId) => {},
      downloadMedia: async (messageId) => Buffer.from(''),
      getQRCode: async () => '',
      onQR: (callback) => {},
      onMessage: (callback) => {},
      onConnectionChange: (callback) => {},
    };
  }

  private createWppConnectProvider(): IWhatsAppProvider {
    const apiUrl = this.configService.get('WA_WPP_CONNECT_URL');
    const token = this.configService.get('WA_WPP_CONNECT_TOKEN');
    
    return {
      connect: async () => { /* WPPConnect implementation */ },
      disconnect: async () => { /* WPPConnect implementation */ },
      getConnectionState: () => 'closed',
      sendTextMessage: async (to, content) => ({ id: '', from: '', to, content, type: 'text', timestamp: new Date(), fromMe: true }),
      sendMediaMessage: async (to, mediaUrl, type, caption) => ({ id: '', from: '', to, content: caption || '', type: type as any, timestamp: new Date(), fromMe: true }),
      sendDocumentMessage: async (to, documentUrl, filename) => ({ id: '', from: '', to, content: filename, type: 'document', timestamp: new Date(), fromMe: true }),
      sendLocationMessage: async (to, latitude, longitude) => ({ id: '', from: '', to, content: `${latitude},${longitude}`, type: 'location', timestamp: new Date(), fromMe: true }),
      getContacts: async () => [],
      getChatById: async (chatId) => ({}),
      getMessages: async (chatId, limit) => [],
      markAsRead: async (chatId) => {},
      archiveChat: async (chatId, archive) => {},
      pinChat: async (chatId, pin) => {},
      muteChat: async (chatId, mute, duration) => {},
      deleteMessage: async (chatId, messageId) => {},
      downloadMedia: async (messageId) => Buffer.from(''),
      getQRCode: async () => '',
      onQR: (callback) => {},
      onMessage: (callback) => {},
      onConnectionChange: (callback) => {},
    };
  }

  private createMetaProvider(): IWhatsAppProvider {
    const appId = this.configService.get('WA_META_APP_ID');
    const appSecret = this.configService.get('WA_META_APP_SECRET');
    const phoneNumberId = this.configService.get('WA_META_PHONE_NUMBER_ID');
    
    return {
      connect: async () => { /* Meta WhatsApp Business API implementation */ },
      disconnect: async () => { /* Meta WhatsApp Business API implementation */ },
      getConnectionState: () => 'closed',
      sendTextMessage: async (to, content) => ({ id: '', from: '', to, content, type: 'text', timestamp: new Date(), fromMe: true }),
      sendMediaMessage: async (to, mediaUrl, type, caption) => ({ id: '', from: '', to, content: caption || '', type: type as any, timestamp: new Date(), fromMe: true }),
      sendDocumentMessage: async (to, documentUrl, filename) => ({ id: '', from: '', to, content: filename, type: 'document', timestamp: new Date(), fromMe: true }),
      sendLocationMessage: async (to, latitude, longitude) => ({ id: '', from: '', to, content: `${latitude},${longitude}`, type: 'location', timestamp: new Date(), fromMe: true }),
      getContacts: async () => [],
      getChatById: async (chatId) => ({}),
      getMessages: async (chatId, limit) => [],
      markAsRead: async (chatId) => {},
      archiveChat: async (chatId, archive) => {},
      pinChat: async (chatId, pin) => {},
      muteChat: async (chatId, mute, duration) => {},
      deleteMessage: async (chatId, messageId) => {},
      downloadMedia: async (messageId) => Buffer.from(''),
      getQRCode: async () => '',
      onQR: (callback) => {},
      onMessage: (callback) => {},
      onConnectionChange: (callback) => {},
    };
  }
}
