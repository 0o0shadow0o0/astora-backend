import { Injectable, OnModuleInit } from '@nestjs/common';
import * as client from 'prom-client';

@Injectable()
export class MetricsService implements OnModuleInit {
  private httpRequestsTotal: client.Counter<string>;
  private httpRequestDuration: client.Histogram<string>;
  private whatsappMessagesTotal: client.Counter<string>;
  private activeConnections: client.Gauge<string>;
  private queueSize: client.Gauge<string>;

  onModuleInit() {
    client.collectDefaultMetrics({ prefix: 'astora_' });

    this.httpRequestsTotal = new client.Counter({
      name: 'astora_http_requests_total',
      help: 'Total number of HTTP requests',
      labelNames: ['method', 'route', 'status_code'],
    });

    this.httpRequestDuration = new client.Histogram({
      name: 'astora_http_request_duration_seconds',
      help: 'HTTP request duration in seconds',
      labelNames: ['method', 'route', 'status_code'],
      buckets: [0.01, 0.05, 0.1, 0.5, 1, 2, 5],
    });

    this.whatsappMessagesTotal = new client.Counter({
      name: 'astora_whatsapp_messages_total',
      help: 'Total WhatsApp messages sent and received',
      labelNames: ['type', 'direction', 'status'],
    });

    this.activeConnections = new client.Gauge({
      name: 'astora_active_connections',
      help: 'Number of active WebSocket connections',
    });

    this.queueSize = new client.Gauge({
      name: 'astora_queue_size',
      help: 'Current size of message queues',
      labelNames: ['queue_name'],
    });
  }

  incrementHttpRequests(method: string, route: string, statusCode: number) {
    this.httpRequestsTotal.inc({ method, route, status_code: statusCode.toString() });
  }

  observeHttpRequestDuration(method: string, route: string, statusCode: number, duration: number) {
    this.httpRequestDuration.observe({ method, route, status_code: statusCode.toString() }, duration);
  }

  incrementWhatsAppMessages(type: string, direction: string, status: string) {
    this.whatsappMessagesTotal.inc({ type, direction, status });
  }

  setActiveConnections(count: number) {
    this.activeConnections.set(count);
  }

  setQueueSize(queueName: string, size: number) {
    this.queueSize.set({ queue_name: queueName }, size);
  }

  async getMetrics(): Promise<string> {
    return client.register.metrics();
  }

  getContentType(): string {
    return client.register.contentType;
  }
}
