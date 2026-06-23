"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.MetricsService = void 0;
const common_1 = require("@nestjs/common");
const client = __importStar(require("prom-client"));
let MetricsService = class MetricsService {
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
    incrementHttpRequests(method, route, statusCode) {
        this.httpRequestsTotal.inc({ method, route, status_code: statusCode.toString() });
    }
    observeHttpRequestDuration(method, route, statusCode, duration) {
        this.httpRequestDuration.observe({ method, route, status_code: statusCode.toString() }, duration);
    }
    incrementWhatsAppMessages(type, direction, status) {
        this.whatsappMessagesTotal.inc({ type, direction, status });
    }
    setActiveConnections(count) {
        this.activeConnections.set(count);
    }
    setQueueSize(queueName, size) {
        this.queueSize.set({ queue_name: queueName }, size);
    }
    async getMetrics() {
        return client.register.metrics();
    }
    getContentType() {
        return client.register.contentType;
    }
};
exports.MetricsService = MetricsService;
exports.MetricsService = MetricsService = __decorate([
    (0, common_1.Injectable)()
], MetricsService);
//# sourceMappingURL=metrics.service.js.map