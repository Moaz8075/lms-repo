import { Logger, ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import { NestExpressApplication } from '@nestjs/platform-express';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { WinstonModule } from 'nest-winston';
import { join } from 'path';
import { AppModule } from './app.module';
import { API_PREFIX, SWAGGER_PATH } from './common/constants';
import { winstonConfig } from './config/logger.config';

async function bootstrap(): Promise<void> {
  const app = await NestFactory.create<NestExpressApplication>(AppModule, {
    logger: WinstonModule.createLogger(winstonConfig),
  });

  const configService = app.get(ConfigService);
  const logger = new Logger('Bootstrap');

  // Demo PDFs for Legal Research (mobile + web) — outside /api/v1 prefix
  app.useStaticAssets(join(process.cwd(), 'public'), {
    prefix: '/',
    setHeaders: (res, filePath) => {
      if (filePath.endsWith('.pdf')) {
        res.setHeader('Content-Type', 'application/pdf');
        res.setHeader('Access-Control-Allow-Origin', '*');
      }
    },
  });

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

  // origin: true reflects the request Origin (allow any). origin: '*' cannot be used with credentials: true.
  app.enableCors({
    origin: true,
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
  await app.listen(port, '0.0.0.0');

  logger.log(`Application running on http://0.0.0.0:${port}`);
  logger.log(`Swagger docs available at /${SWAGGER_PATH}`);
  logger.log(`Demo PDFs available at /demo/*.pdf`);
}

bootstrap();
