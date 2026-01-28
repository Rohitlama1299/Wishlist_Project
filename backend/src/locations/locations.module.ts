import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { LocationsService } from './locations.service';
import { LocationsController } from './locations.controller';
import { AmadeusService } from './amadeus.service';
import { Continent, Country, City, CityActivity } from '../entities';

@Module({
  imports: [TypeOrmModule.forFeature([Continent, Country, City, CityActivity])],
  controllers: [LocationsController],
  providers: [LocationsService, AmadeusService],
  exports: [LocationsService, AmadeusService],
})
export class LocationsModule {}
