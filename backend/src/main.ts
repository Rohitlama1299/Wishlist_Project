import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as express from 'express';
import { AppModule } from './app.module';

function validateEnvironment(configService: ConfigService): void {
  const requiredEnvVars = ['JWT_SECRET', 'DATABASE_URL'];
  const missingVars: string[] = [];

  for (const envVar of requiredEnvVars) {
    if (!configService.get<string>(envVar)) {
      missingVars.push(envVar);
    }
  }

  if (missingVars.length > 0) {
    throw new Error(
      `Missing required environment variables: ${missingVars.join(', ')}. ` +
        'Please check your .env file.',
    );
  }
}

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const configService = app.get(ConfigService);

  // Validate required environment variables
  validateEnvironment(configService);
  const isProduction = configService.get('NODE_ENV') === 'production';

  // Set request body size limits (10MB max for file uploads)
  app.use(express.json({ limit: '10mb' }));
  app.use(express.urlencoded({ limit: '10mb', extended: true }));

  // Enable CORS for Angular frontend
  const frontendUrl = configService.get<string>('FRONTEND_URL', '')?.trim();
  const allowedOrigins = isProduction
    ? [
        frontendUrl,
        'https://dreammap.world',
        'https://www.dreammap.world',
        'https://wishlist-project-liard.vercel.app',
      ].filter(Boolean)
    : ['http://localhost:4200', 'http://localhost:3000'];

  console.log('CORS allowed origins:', allowedOrigins);

  app.enableCors({
    origin: allowedOrigins,
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'Accept'],
    credentials: true,
  });

  // Enable validation globally
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

  // Set global prefix for API
  app.setGlobalPrefix('api');

  const port = configService.get<number>('PORT', 3000);
  await app.listen(port, '0.0.0.0');

  console.log(`Application is running on port ${port}`);
  console.log(`Environment: ${isProduction ? 'production' : 'development'}`);
}
void bootstrap();
