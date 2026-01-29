import { Module } from '@nestjs/common';
import { APP_GUARD } from '@nestjs/core';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ServeStaticModule } from '@nestjs/serve-static';
import { ThrottlerModule, ThrottlerGuard } from '@nestjs/throttler';
import { join } from 'path';

import { AppController } from './app.controller';
import { AppService } from './app.service';

import { AuthModule } from './auth/auth.module';
import { LocationsModule } from './locations/locations.module';
import { DestinationsModule } from './destinations/destinations.module';
import { PhotosModule } from './photos/photos.module';
import { ActivitiesModule } from './activities/activities.module';

import {
  User,
  Continent,
  Country,
  City,
  CityActivity,
  Destination,
  Photo,
  Activity,
} from './entities';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),
    // Rate limiting: 100 requests per 60 seconds per IP
    ThrottlerModule.forRoot([
      {
        ttl: 60000,
        limit: 100,
      },
    ]),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => {
        const isProduction = configService.get('NODE_ENV') === 'production';
        const dbUrl = configService.get<string>('DATABASE_URL');

        // If DATABASE_URL is provided, use it directly
        if (dbUrl) {
          return {
            type: 'postgres',
            url: dbUrl,
            entities: [
              User,
              Continent,
              Country,
              City,
              CityActivity,
              Destination,
              Photo,
              Activity,
            ],
            synchronize: !isProduction,
            logging: !isProduction,
            // Note: rejectUnauthorized:false is required for many cloud PostgreSQL providers
            // (Supabase, Railway, etc.) that use self-signed certificates
            ssl: {
              rejectUnauthorized: false,
            },
          };
        }

        return {
          type: 'postgres',
          host: configService.get('DB_HOST', 'localhost'),
          port: configService.get<number>('DB_PORT', 5432),
          username: configService.get('DB_USERNAME', 'postgres'),
          password: configService.get('DB_PASSWORD', 'password'),
          database: configService.get('DB_NAME', 'travel_wishlist'),
          entities: [
            User,
            Continent,
            Country,
            City,
            CityActivity,
            Destination,
            Photo,
            Activity,
          ],
          synchronize: !isProduction,
          logging: !isProduction,
          ssl: isProduction ? { rejectUnauthorized: false } : false,
          extra: isProduction
            ? {
                family: 4, // Force IPv4
              }
            : {},
        };
      },
      inject: [ConfigService],
    }),
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '..', 'uploads'),
      serveRoot: '/uploads',
    }),
    AuthModule,
    LocationsModule,
    DestinationsModule,
    PhotosModule,
    ActivitiesModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    // Enable rate limiting globally
    {
      provide: APP_GUARD,
      useClass: ThrottlerGuard,
    },
  ],
})
export class AppModule {}
