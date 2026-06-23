import { NestFactory } from '@nestjs/core';
import { ValidationPipe, VersioningType, Logger } from '@nestjs/common';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { IoAdapter } from '@nestjs/platform-socket.io';
import helmet from 'helmet';
import compression from 'compression';
import { AppModule } from './app.module';
import { HttpExceptionFilter } from './common/filters/http-exception.filter';
import { TransformInterceptor } from './common/interceptors/transform.interceptor';
import { ConfigService } from '@nestjs/config';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    bufferLogs: true,
  });

  const configService = app.get(ConfigService);
  const logger = app.get(Logger);

  app.use(helmet());
  app.use(compression());
  
  app.enableCors({
    origin: configService.get('CORS_ORIGINS', '*'),
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
  });

  app.enableVersioning({
    type: VersioningType.URI,
    defaultVersion: '1',
    prefix: 'api/v',
  });

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
      forbidNonWhitelisted: true,
      transformOptions: {
        enableImplicitConversion: true,
      },
    }),
  );

  app.useGlobalFilters(new HttpExceptionFilter());
  app.useGlobalInterceptors(new TransformInterceptor());

  const config = new DocumentBuilder()
    .setTitle('Astora Backend API')
    .setDescription('Enterprise-Level Backend Platform API Documentation')
    .setVersion('1.0')
    .addBearerAuth()
    .addTag('auth', 'Authentication & Authorization')
    .addTag('users', 'User Management')
    .addTag('roles', 'Role Management')
    .addTag('permissions', 'Permission Management')
    .addTag('devices', 'Device Management')
    .addTag('whatsapp', 'WhatsApp Integration')
    .addTag('contacts', 'Contact Management')
    .addTag('chat', 'Chat & Messaging')
    .addTag('scheduler', 'Task Scheduler')
    .addTag('sms', 'SMS Management')
    .addTag('calls', 'Call Management')
    .addTag('ai', 'AI & Chatbot')
    .addTag('store', 'Store Management')
    .addTag('notifications', 'Notifications')
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api/docs', app, document);

  const port = configService.get('PORT', 3000);
  await app.listen(port);
  
  logger.info(`🚀 Astora Backend running on port ${port}`);
  logger.info(`📚 API Documentation available at /api/docs`);
}

class WebSocketAdapter extends IoAdapter {
  constructor(app: any) {
    super(app);
  }
}

bootstrap();
