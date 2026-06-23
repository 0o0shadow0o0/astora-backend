import { Module, MiddlewareConsumer, NestModule } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BullModule } from '@nestjs/bullmq';
import { ThrottlerModule } from '@nestjs/throttler';
import { ScheduleModule } from '@nestjs/schedule';
import { ServeStaticModule } from '@nestjs/serve-static';
import { TerminusModule } from '@nestjs/terminus';
import { HealthController } from './common/controllers/health.controller';
import { AuthModule } from './modules/auth/auth.module';
import { UsersModule } from './modules/users/users.module';
import { RolesModule } from './modules/roles/roles.module';
import { PermissionsModule } from './modules/permissions/permissions.module';
import { DevicesModule } from './modules/devices/devices.module';
import { SessionsModule } from './modules/sessions/sessions.module';
import { WhatsAppModule } from './modules/whatsapp/whatsapp.module';
import { ContactsModule } from './modules/contacts/contacts.module';
import { ChatModule } from './modules/chat/chat.module';
import { SchedulerModule } from './modules/scheduler/scheduler.module';
import { SmsModule } from './modules/sms/sms.module';
import { CallsModule } from './modules/calls/calls.module';
import { AiModule } from './modules/ai/ai.module';
import { StoreModule } from './modules/store/store.module';
import { NotificationsModule } from './modules/notifications/notifications.module';
import { LogsModule } from './modules/logs/logs.module';
import { AuditLogsModule } from './modules/audit-logs/audit-logs.module';
import { WebsocketModule } from './websocket/websocket.module';
import { MonitoringModule } from './modules/monitoring/monitoring.module';
import { LoggerMiddleware } from './common/middleware/logger.middleware';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: `.env.${process.env.NODE_ENV || 'development'}`,
    }),
    
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => ({
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
      inject: [ConfigService],
    }),

    BullModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => ({
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
      inject: [ConfigService],
    }),

    ThrottlerModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => ({
        throttlers: [
          { ttl: 60000, limit: 100 },
          { ttl: 600000, limit: 500 },
        ],
      }),
      inject: [ConfigService],
    }),

    ScheduleModule.forRoot(),

    TerminusModule,
    
    AuthModule,
    UsersModule,
    RolesModule,
    PermissionsModule,
    DevicesModule,
    SessionsModule,
    WhatsAppModule,
    ContactsModule,
    ChatModule,
    SchedulerModule,
    SmsModule,
    CallsModule,
    AiModule,
    StoreModule,
    NotificationsModule,
    LogsModule,
    AuditLogsModule,
    WebsocketModule,
    MonitoringModule,
  ],
  controllers: [HealthController],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(LoggerMiddleware).forRoutes('*');
  }
}
