import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DestinationsService } from './destinations.service';
import { DestinationsController } from './destinations.controller';
import { Destination, City } from '../entities';

@Module({
  imports: [TypeOrmModule.forFeature([Destination, City])],
  controllers: [DestinationsController],
  providers: [DestinationsService],
  exports: [DestinationsService],
})
export class DestinationsModule {}
