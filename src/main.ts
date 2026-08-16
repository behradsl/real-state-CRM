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

  // CSP disabled in non-production so Swagger UI assets load cleanly
  app.use(
    helmet({
      contentSecurityPolicy:
        process.env.NODE_ENV === 'production' ? undefined : false,
    }),
  );
  app.use(cookieParser());

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

  const expressApp = app.getHttpAdapter().getInstance();
  expressApp.disable('x-powered-by');

  const swaggerConfig = new DocumentBuilder()
    .setTitle('Real Estate CRM API')
    .setDescription(
      [
        'Backend API for the real-estate CRM.',
        '',
        '### Authentication',
        'Session-based auth with an httpOnly cookie named `session_token`.',
        '1. Call `POST /auth/login`',
        '2. Browser/Swagger stores the cookie automatically',
        '3. Protected routes require that cookie',
        '',
        '### Roles',
        '- **ADMIN** — full access across all organizations',
        '- **OWNER** — access to users/data in their organization',
        '- **MANAGER / AGENT / ASSISTANT** — access to their own data only',
        '- Creating users is limited to **ADMIN** and **OWNER**',
        '',
        'Use **Authorize** in Swagger and set the cookie value after login if needed.',
      ].join('\n'),
    )
    .setVersion('0.1.0')
    .addCookieAuth(SESSION_COOKIE_NAME, {
      type: 'apiKey',
      in: 'cookie',
      name: SESSION_COOKIE_NAME,
      description: 'Session cookie issued by POST /auth/login',
    })
    .addTag('Health', 'Service health checks')
    .addTag('Auth', 'Login, logout, and current session')
    .addTag('Users', 'User CRUD with role-based access')
    .addTag('Properties', 'Property listings with role-based access')
    .build();

  const document = SwaggerModule.createDocument(app, swaggerConfig);
  SwaggerModule.setup('docs', app, document, {
    swaggerOptions: {
      persistAuthorization: true,
      withCredentials: true,
    },
  });

  const port = process.env.PORT ?? 3000;
  await app.listen(port);
  console.log(`Swagger docs: http://localhost:${port}/docs`);
}
bootstrap();
