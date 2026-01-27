import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { LocationsService } from './locations.service';
import { LocationsController } from './locations.controller';
import { GeoapifyService } from './geoapify.service';
import { Continent, Country, City, CityActivity } from '../entities';

@Module({
  imports: [TypeOrmModule.forFeature([Continent, Country, City, CityActivity])],
  controllers: [LocationsController],
  providers: [LocationsService, GeoapifyService],
  exports: [LocationsService, GeoapifyService],
})
export class LocationsModule {}
