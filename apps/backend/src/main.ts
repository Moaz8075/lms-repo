import { Logger, ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { WinstonModule } from 'nest-winston';
import { AppModule } from './app.module';
import { API_PREFIX, SWAGGER_PATH } from './common/constants';
import { winstonConfig } from './config/logger.config';

async function bootstrap(): Promise<void> {
  const app = await NestFactory.create(AppModule, {
    logger: WinstonModule.createLogger(winstonConfig),
  });

  const configService = app.get(ConfigService);
  const logger = new Logger('Bootstrap');

  app.setGlobalPrefix(API_PREFIX);

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
      transformOptions: {
        enableImplicitConversion: true,
      },
    }),
  );

  app.enableCors({
    origin: configService.get<string>('app.nodeEnv') === 'production' ? false : true,
    credentials: true,
  });

  const swaggerConfig = new DocumentBuilder()
    .setTitle(configService.getOrThrow<string>('app.apiTitle'))
    .setDescription(configService.getOrThrow<string>('app.apiDescription'))
    .setVersion(configService.getOrThrow<string>('app.apiVersion'))
    .addBearerAuth(
      {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
        name: 'Authorization',
        description: 'Enter JWT access token',
        in: 'header',
      },
      'access-token',
    )
    .addApiKey(
      {
        type: 'apiKey',
        name: 'x-organization-id',
        in: 'header',
        description: 'Organization ID for multi-tenant context',
      },
      'organization-id',
    )
    .build();

  const document = SwaggerModule.createDocument(app, swaggerConfig);
  SwaggerModule.setup(SWAGGER_PATH, app, document, {
    swaggerOptions: {
      persistAuthorization: true,
    },
  });

  const port = configService.getOrThrow<number>('app.port');
  await app.listen(port);

  logger.log(`Application running on port ${port}`);
  logger.log(`Swagger docs available at /${SWAGGER_PATH}`);
}

bootstrap();
