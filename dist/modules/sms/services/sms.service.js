"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
var SmsService_1;
var _a;
Object.defineProperty(exports, "__esModule", { value: true });
exports.SmsService = void 0;
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const bullmq_1 = require("@nestjs/bullmq");
const bullmq_2 = require("bullmq");
const axios_1 = __importDefault(require("axios"));
const event_emitter_1 = require("@nestjs/event-emitter");
let SmsService = SmsService_1 = class SmsService {
    constructor(smsQueue, configService, eventEmitter) {
        this.smsQueue = smsQueue;
        this.configService = configService;
        this.eventEmitter = eventEmitter;
        this.logger = new common_1.Logger(SmsService_1.name);
        this.provider = this.configService.get('SMS_PROVIDER', 'twilio');
    }
    async sendSms(to, content, from) {
        const message = {
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
        return { ...message, id: job.id };
    }
    async sendBulkSms(numbers, content) {
        const job = await this.smsQueue.add('send-bulk-sms', {
            numbers,
            content,
        });
        return { jobId: job.id, count: numbers.length };
    }
    async scheduleSms(to, content, scheduledAt) {
        const message = {
            id: `sms_scheduled_${Date.now()}`,
            to,
            from: this.configService.get('TWILIO_PHONE_NUMBER'),
            content,
            status: 'pending',
            timestamp: scheduledAt,
        };
        const job = await this.smsQueue.add('send-scheduled-sms', { message }, { delay: scheduledAt.getTime() - Date.now() });
        return { ...message, id: job.id };
    }
    async getDeliveryStatus(messageId) {
        return 'delivered';
    }
    async setAutoReply(phone, replyMessage, active) {
        this.logger.log(`Auto-reply ${active ? 'enabled' : 'disabled'} for ${phone}`);
    }
    async sendViaTwilio(to, content, from) {
        const accountSid = this.configService.get('TWILIO_ACCOUNT_SID');
        const authToken = this.configService.get('TWILIO_AUTH_TOKEN');
        const phoneNumber = from || this.configService.get('TWILIO_PHONE_NUMBER');
        try {
            const response = await axios_1.default.post(`https://api.twilio.com/2010-04-01/Accounts/${accountSid}/Messages.json`, new URLSearchParams({
                To: to,
                From: phoneNumber,
                Body: content,
            }), {
                auth: {
                    username: accountSid,
                    password: authToken,
                },
            });
            return response.data;
        }
        catch (error) {
            this.logger.error('Failed to send SMS via Twilio:', error);
            throw error;
        }
    }
    async processIncomingSms(from, content) {
        this.eventEmitter.emit('sms.received', { from, content });
    }
};
exports.SmsService = SmsService;
exports.SmsService = SmsService = SmsService_1 = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, bullmq_1.InjectQueue)('sms-messages')),
    __metadata("design:paramtypes", [bullmq_2.Queue,
        config_1.ConfigService, typeof (_a = typeof event_emitter_1.EventEmitter2 !== "undefined" && event_emitter_1.EventEmitter2) === "function" ? _a : Object])
], SmsService);
//# sourceMappingURL=sms.service.js.map