"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppModule = void 0;
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const typeorm_1 = require("@nestjs/typeorm");
const bullmq_1 = require("@nestjs/bullmq");
const throttler_1 = require("@nestjs/throttler");
const schedule_1 = require("@nestjs/schedule");
const terminus_1 = require("@nestjs/terminus");
const health_controller_1 = require("./common/controllers/health.controller");
const auth_module_1 = require("./modules/auth/auth.module");
const users_module_1 = require("./modules/users/users.module");
const roles_module_1 = require("./modules/roles/roles.module");
const permissions_module_1 = require("./modules/permissions/permissions.module");
const devices_module_1 = require("./modules/devices/devices.module");
const sessions_module_1 = require("./modules/sessions/sessions.module");
const whatsapp_module_1 = require("./modules/whatsapp/whatsapp.module");
const contacts_module_1 = require("./modules/contacts/contacts.module");
const chat_module_1 = require("./modules/chat/chat.module");
const scheduler_module_1 = require("./modules/scheduler/scheduler.module");
const sms_module_1 = require("./modules/sms/sms.module");
const calls_module_1 = require("./modules/calls/calls.module");
const ai_module_1 = require("./modules/ai/ai.module");
const store_module_1 = require("./modules/store/store.module");
const notifications_module_1 = require("./modules/notifications/notifications.module");
const logs_module_1 = require("./modules/logs/logs.module");
const audit_logs_module_1 = require("./modules/audit-logs/audit-logs.module");
const websocket_module_1 = require("./websocket/websocket.module");
const monitoring_module_1 = require("./modules/monitoring/monitoring.module");
const logger_middleware_1 = require("./common/middleware/logger.middleware");
let AppModule = class AppModule {
    configure(consumer) {
        consumer.apply(logger_middleware_1.LoggerMiddleware).forRoutes('*');
    }
};
exports.AppModule = AppModule;
exports.AppModule = AppModule = __decorate([
    (0, common_1.Module)({
        imports: [
            config_1.ConfigModule.forRoot({
                isGlobal: true,
                envFilePath: `.env.${process.env.NODE_ENV || 'development'}`,
            }),
            typeorm_1.TypeOrmModule.forRootAsync({
                imports: [config_1.ConfigModule],
                useFactory: (configService) => ({
                    type: 'postgres',
                    host: configService.get('DB_HOST', 'localhost'),
                    port: configService.get('DB_PORT', 5432),
                    username: configService.get('DB_USERNAME', 'postgres'),
                    password: configService.get('DB_PASSWORD', 'postgres'),
                    database: configService.get('DB_DATABASE', 'astora'),
                    entities: [__dirname + '/**/*.entity{.ts,.js}'],
                    migrations: [__dirname + '/database/migrations/*{.ts,.js}'],
                    synchronize: configService.get('DB_SYNCHRONIZE', 'false') === 'true',
                    logging: configService.get('DB_LOGGING', 'false') === 'true',
                    ssl: configService.get('DB_SSL', 'false') === 'true',
                    extra: {
                        max: 100,
                        idleTimeoutMillis: 30000,
                        connectionTimeoutMillis: 2000,
                    },
                }),
                inject: [config_1.ConfigService],
            }),
            bullmq_1.BullModule.forRootAsync({
                imports: [config_1.ConfigModule],
                useFactory: (configService) => ({
                    connection: {
                        host: configService.get('REDIS_HOST', 'localhost'),
                        port: configService.get('REDIS_PORT', 6379),
                        password: configService.get('REDIS_PASSWORD', ''),
                        tls: configService.get('REDIS_TLS', 'false') === 'true' ? {} : undefined,
                    },
                    defaultJobOptions: {
                        removeOnComplete: true,
                        removeOnFail: false,
                        attempts: 3,
                        backoff: {
                            type: 'exponential',
                            delay: 1000,
                        },
                    },
                }),
                inject: [config_1.ConfigService],
            }),
            throttler_1.ThrottlerModule.forRootAsync({
                imports: [config_1.ConfigModule],
                useFactory: (configService) => ({
                    throttlers: [
                        { ttl: 60000, limit: 100 },
                        { ttl: 600000, limit: 500 },
                    ],
                }),
                inject: [config_1.ConfigService],
            }),
            schedule_1.ScheduleModule.forRoot(),
            terminus_1.TerminusModule,
            auth_module_1.AuthModule,
            users_module_1.UsersModule,
            roles_module_1.RolesModule,
            permissions_module_1.PermissionsModule,
            devices_module_1.DevicesModule,
            sessions_module_1.SessionsModule,
            whatsapp_module_1.WhatsAppModule,
            contacts_module_1.ContactsModule,
            chat_module_1.ChatModule,
            scheduler_module_1.SchedulerModule,
            sms_module_1.SmsModule,
            calls_module_1.CallsModule,
            ai_module_1.AiModule,
            store_module_1.StoreModule,
            notifications_module_1.NotificationsModule,
            logs_module_1.LogsModule,
            audit_logs_module_1.AuditLogsModule,
            websocket_module_1.WebsocketModule,
            monitoring_module_1.MonitoringModule,
        ],
        controllers: [health_controller_1.HealthController],
    })
], AppModule);
//# sourceMappingURL=app.module.js.map