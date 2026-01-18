import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MulterModule } from '@nestjs/platform-express';
import { memoryStorage } from 'multer';
import { PhotosService } from './photos.service';
import { PhotosController } from './photos.controller';
import { Photo, Destination } from '../entities';

@Module({
  imports: [
    TypeOrmModule.forFeature([Photo, Destination]),
    MulterModule.register({
      storage: memoryStorage(),
    }),
  ],
  controllers: [PhotosController],
  providers: [PhotosService],
  exports: [PhotosService],
})
export class PhotosModule {}
