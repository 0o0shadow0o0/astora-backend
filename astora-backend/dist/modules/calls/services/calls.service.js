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
var CallsService_1;
var _a;
Object.defineProperty(exports, "__esModule", { value: true });
exports.CallsService = void 0;
const common_1 = require("@nestjs/common");
const bullmq_1 = require("@nestjs/bullmq");
const bullmq_2 = require("bullmq");
const event_emitter_1 = require("@nestjs/event-emitter");
let CallsService = CallsService_1 = class CallsService {
    constructor(callsQueue, eventEmitter) {
        this.callsQueue = callsQueue;
        this.eventEmitter = eventEmitter;
        this.logger = new common_1.Logger(CallsService_1.name);
    }
    async initiateCall(to, from) {
        const call = {
            id: `call_${Date.now()}`,
            to,
            from: from || '+1234567890',
            status: 'pending',
            timestamp: new Date(),
        };
        const job = await this.callsQueue.add('initiate-call', {
            call,
        });
        return { ...call, id: job.id };
    }
    async scheduleCall(to, scheduledAt, notes) {
        const call = {
            id: `scheduled_call_${Date.now()}`,
            to,
            from: '+1234567890',
            status: 'pending',
            timestamp: scheduledAt,
        };
        const job = await this.callsQueue.add('schedule-call', { call, notes }, { delay: scheduledAt.getTime() - Date.now() });
        return { ...call, id: job.id };
    }
    async scheduleReminder(to, message, scheduledAt) {
        await this.callsQueue.add('call-reminder', { to, message }, { delay: scheduledAt.getTime() - Date.now() });
    }
    async autoRedial(callId, maxAttempts = 3) {
        this.logger.log(`Auto-redial initiated for call ${callId}`);
    }
    async getCallLogs(userId, page = 1, limit = 50) {
        return {
            data: [],
            total: 0,
            page,
            limit,
            totalPages: 0,
        };
    }
    async getCallAnalytics(userId, startDate, endDate) {
        return {
            totalCalls: 0,
            answeredCalls: 0,
            missedCalls: 0,
            averageDuration: 0,
            peakHours: [],
        };
    }
    async processIncomingCall(from) {
        this.eventEmitter.emit('call.received', { from });
    }
    async endCall(callId) {
        this.logger.log(`Call ${callId} ended`);
    }
};
exports.CallsService = CallsService;
exports.CallsService = CallsService = CallsService_1 = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, bullmq_1.InjectQueue)('calls')),
    __metadata("design:paramtypes", [bullmq_2.Queue, typeof (_a = typeof event_emitter_1.EventEmitter2 !== "undefined" && event_emitter_1.EventEmitter2) === "function" ? _a : Object])
], CallsService);
//# sourceMappingURL=calls.service.js.map