import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import cookieParser = require('cookie-parser');
import helmet from 'helmet';
import { AppModule } from './app.module';
import { SESSION_COOKIE_NAME } from './auth/auth.constants';
import { getCorsOrigin } from './common/config/security.config';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const isProd = process.env.NODE_ENV === 'production';

  if (isProd && !process.env.CORS_ORIGIN?.trim()) {
    throw new Error(
      'CORS_ORIGIN must be set explicitly when NODE_ENV=production',
    );
  }

  app.use(
    helmet({
      contentSecurityPolicy: isProd ? undefined : false,
      crossOriginResourcePolicy: { policy: 'cross-origin' },
    }),
  );
  app.use(cookieParser());

  const expressApp = app.getHttpAdapter().getInstance();
  expressApp.disable('x-powered-by');
  if (isProd || process.env.TRUST_PROXY === 'true') {
    expressApp.set('trust proxy', 1);
  }

  app.enableCors({
    origin: getCorsOrigin(),
    credentials: true,
    methods: ['GET', 'HEAD', 'PUT', 'PATCH', 'POST', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
  });

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

  // Uploads are NOT publicly mounted — use authenticated GET /files/:id/download

  const enableSwagger =
    process.env.ENABLE_SWAGGER === 'true' ||
    (!isProd && process.env.ENABLE_SWAGGER !== 'false');

  if (enableSwagger) {
    const swaggerConfig = new DocumentBuilder()
      .setTitle('Real Estate CRM API')
      .setDescription(
        [
          'Backend API for the real-estate CRM (v1).',
          '',
          '### Authentication',
          'Session-based auth with an httpOnly cookie named `session_token`.',
          '1. Call `POST /auth/login` (with `organizationSlug` for org users, or omit for platform ADMIN)',
          '2. Browser/Swagger stores the cookie automatically',
          '3. Protected routes require that cookie',
          '',
          '### Bootstrap',
          'Run `pnpm prisma:seed` to create the platform ADMIN (see ADMIN_EMAIL / ADMIN_PASSWORD in `.env`).',
          '',
          '### Roles',
          '- **ADMIN** — full access across all organizations (`organizationId` may be null)',
          '- **OWNER** — access to users/data in their organization',
          '- **MANAGER / AGENT / ASSISTANT** — properties they own; parties/contracts in their org',
          '- Creating organizations is limited to **ADMIN**',
          '- Creating users is limited to **ADMIN** and **OWNER**',
          '',
          'Use **Authorize** in Swagger and set the cookie value after login if needed.',
        ].join('\n'),
      )
      .setVersion('1.0.0')
      .addCookieAuth(SESSION_COOKIE_NAME, {
        type: 'apiKey',
        in: 'cookie',
        name: SESSION_COOKIE_NAME,
        description: 'Session cookie issued by POST /auth/login',
      })
      .addTag('Health', 'Service health checks')
      .addTag('Auth', 'Login, logout, and current session')
      .addTag('Organizations', 'Organization onboarding (ADMIN)')
      .addTag('Users', 'User CRUD with role-based access')
      .addTag('Addresses', 'Shared address records')
      .addTag('Properties', 'Properties with optional deed info')
      .addTag('Parties', 'Contract parties (people / companies)')
      .addTag('Contracts', 'Contracts, parties, and signatures')
      .addTag('Files', 'File uploads for signatures and documents')
      .build();

    const document = SwaggerModule.createDocument(app, swaggerConfig);
    SwaggerModule.setup('docs', app, document, {
      swaggerOptions: {
        persistAuthorization: true,
        withCredentials: true,
      },
    });
  }

  const port = process.env.PORT ?? 3000;
  await app.listen(port);
  if (enableSwagger) {
    console.log(`Swagger docs: http://localhost:${port}/docs`);
  }
}
bootstrap();
