import { registerAs } from '@nestjs/config';

export default registerAs('app', () => ({
  port: parseInt(process.env.PORT ?? '3000', 10),
  nodeEnv: process.env.NODE_ENV ?? 'development',
  corsOrigins:
    process.env.CORS_ORIGINS?.split(',')
      .map((origin) => origin.trim())
      .filter(Boolean) ?? [],
  apiTitle: 'LMS API',
  apiVersion: '1.0',
  apiDescription:
    'Multi-tenant Lawyer Case Management SaaS API for Pakistani law firms',
}));
