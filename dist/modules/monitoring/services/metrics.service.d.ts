import { OnModuleInit } from '@nestjs/common';
export declare class MetricsService implements OnModuleInit {
    private httpRequestsTotal;
    private httpRequestDuration;
    private whatsappMessagesTotal;
    private activeConnections;
    private queueSize;
    onModuleInit(): void;
    incrementHttpRequests(method: string, route: string, statusCode: number): void;
    observeHttpRequestDuration(method: string, route: string, statusCode: number, duration: number): void;
    incrementWhatsAppMessages(type: string, direction: string, status: string): void;
    setActiveConnections(count: number): void;
    setQueueSize(queueName: string, size: number): void;
    getMetrics(): Promise<string>;
    getContentType(): string;
}
