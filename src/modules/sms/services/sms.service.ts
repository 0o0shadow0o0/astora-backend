import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectQueue } from '@nestjs/bullmq';
import { Queue } from 'bullmq';
import axios from 'axios';
import { EventEmitter2 } from '@nestjs/event-emitter';

export interface SMSMessage {
  id: string;
  to: string;
  from: string;
  content: string;
  status: 'pending' | 'sent' | 'delivered' | 'failed';
  timestamp: Date;
}

@Injectable()
export class SmsService {
  private readonly logger = new Logger(SmsService.name);
  private provider: string;

  constructor(
    @InjectQueue('sms-messages')
    private smsQueue: Queue,
    private configService: ConfigService,
    private eventEmitter: EventEmitter2,
  ) {
    this.provider = this.configService.get('SMS_PROVIDER', 'twilio');
  }

  async sendSms(to: string, content: string, from?: string): Promise<SMSMessage> {
    const message: SMSMessage = {
      id: `sms_${Date.now()}`,
      to,
      from: from || this.configService.get('TWILIO_PHONE_NUMBER'),
      content,
      status: 'pending',
      timestamp: new Date(),
    };

    const job = await this.smsQueue.add('send-sms', {
      message,
    });

    return { ...message, id: job.id as string };
  }

  async sendBulkSms(numbers: string[], content: string): Promise<{ jobId: string; count: number }> {
    const job = await this.smsQueue.add('send-bulk-sms', {
      numbers,
      content,
    });

    return { jobId: job.id as string, count: numbers.length };
  }

  async scheduleSms(to: string, content: string, scheduledAt: Date): Promise<SMSMessage> {
    const message: SMSMessage = {
      id: `sms_scheduled_${Date.now()}`,
      to,
      from: this.configService.get('TWILIO_PHONE_NUMBER'),
      content,
      status: 'pending',
      timestamp: scheduledAt,
    };

    const job = await this.smsQueue.add(
      'send-scheduled-sms',
      { message },
      { delay: scheduledAt.getTime() - Date.now() }
    );

    return { ...message, id: job.id as string };
  }

  async getDeliveryStatus(messageId: string): Promise<string> {
    return 'delivered';
  }

  async setAutoReply(phone: string, replyMessage: string, active: boolean): Promise<void> {
    this.logger.log(`Auto-reply ${active ? 'enabled' : 'disabled'} for ${phone}`);
  }

  private async sendViaTwilio(to: string, content: string, from?: string): Promise<any> {
    const accountSid = this.configService.get('TWILIO_ACCOUNT_SID');
    const authToken = this.configService.get('TWILIO_AUTH_TOKEN');
    const phoneNumber = from || this.configService.get('TWILIO_PHONE_NUMBER');

    try {
      const response = await axios.post(
        `https://api.twilio.com/2010-04-01/Accounts/${accountSid}/Messages.json`,
        new URLSearchParams({
          To: to,
          From: phoneNumber,
          Body: content,
        }),
        {
          auth: {
            username: accountSid,
            password: authToken,
          },
        }
      );

      return response.data;
    } catch (error) {
      this.logger.error('Failed to send SMS via Twilio:', error);
      throw error;
    }
  }

  async processIncomingSms(from: string, content: string): Promise<void> {
    this.eventEmitter.emit('sms.received', { from, content });
  }
}
