import { ConfigService } from '@nestjs/config';
import { Queue } from 'bullmq';
import { EventEmitter2 } from '@nestjs/event-emitter';
export interface SMSMessage {
    id: string;
    to: string;
    from: string;
    content: string;
    status: 'pending' | 'sent' | 'delivered' | 'failed';
    timestamp: Date;
}
export declare class SmsService {
    private smsQueue;
    private configService;
    private eventEmitter;
    private readonly logger;
    private provider;
    constructor(smsQueue: Queue, configService: ConfigService, eventEmitter: EventEmitter2);
    sendSms(to: string, content: string, from?: string): Promise<SMSMessage>;
    sendBulkSms(numbers: string[], content: string): Promise<{
        jobId: string;
        count: number;
    }>;
    scheduleSms(to: string, content: string, scheduledAt: Date): Promise<SMSMessage>;
    getDeliveryStatus(messageId: string): Promise<string>;
    setAutoReply(phone: string, replyMessage: string, active: boolean): Promise<void>;
    private sendViaTwilio;
    processIncomingSms(from: string, content: string): Promise<void>;
}
