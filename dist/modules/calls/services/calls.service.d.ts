import { Queue } from 'bullmq';
import { EventEmitter2 } from '@nestjs/event-emitter';
export interface Call {
    id: string;
    to: string;
    from: string;
    status: 'pending' | 'ringing' | 'answered' | 'completed' | 'missed' | 'failed';
    duration?: number;
    timestamp: Date;
}
export declare class CallsService {
    private callsQueue;
    private eventEmitter;
    private readonly logger;
    constructor(callsQueue: Queue, eventEmitter: EventEmitter2);
    initiateCall(to: string, from?: string): Promise<Call>;
    scheduleCall(to: string, scheduledAt: Date, notes?: string): Promise<Call>;
    scheduleReminder(to: string, message: string, scheduledAt: Date): Promise<void>;
    autoRedial(callId: string, maxAttempts?: number): Promise<void>;
    getCallLogs(userId: string, page?: number, limit?: number): Promise<any>;
    getCallAnalytics(userId: string, startDate: Date, endDate: Date): Promise<any>;
    processIncomingCall(from: string): Promise<void>;
    endCall(callId: string): Promise<void>;
}
