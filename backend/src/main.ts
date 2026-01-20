import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const configService = app.get(ConfigService);
  const isProduction = configService.get('NODE_ENV') === 'production';

  // Enable CORS for Angular frontend
  const frontendUrl = configService.get('FRONTEND_URL', '')?.trim();
  const allowedOrigins = isProduction
    ? [
        frontendUrl,
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
bootstrap();
