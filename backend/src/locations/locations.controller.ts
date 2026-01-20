import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Query,
  ParseIntPipe,
  UseGuards,
} from '@nestjs/common';
import { LocationsService } from './locations.service';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { CreateCityDto } from './dto/create-city.dto';

@Controller('locations')
export class LocationsController {
  constructor(private readonly locationsService: LocationsService) {}

  // Continents
  @Get('continents')
  getAllContinents() {
    return this.locationsService.getAllContinents();
  }

  @Get('continents/:id')
  getContinentById(@Param('id', ParseIntPipe) id: number) {
    return this.locationsService.getContinentById(id);
  }

  @Get('continents/:id/countries')
  getCountriesByContinent(@Param('id', ParseIntPipe) id: number) {
    return this.locationsService.getCountriesByContinent(id);
  }

  // Countries
  @Get('countries')
  getAllCountries() {
    return this.locationsService.getAllCountries();
  }

  @Get('countries/:id')
  getCountryById(@Param('id', ParseIntPipe) id: number) {
    return this.locationsService.getCountryById(id);
  }

  @Get('countries/:id/cities')
  getCitiesByCountry(@Param('id', ParseIntPipe) id: number) {
    return this.locationsService.getCitiesByCountry(id);
  }

  // Search
  @Get('search')
  searchLocations(@Query('q') query: string) {
    return this.locationsService.searchLocations(query || '');
  }

  // Cities
  @Get('cities/search')
  searchCities(@Query('q') query: string) {
    return this.locationsService.searchCities(query || '');
  }

  @Get('cities/:id')
  getCityById(@Param('id', ParseIntPipe) id: number) {
    return this.locationsService.getCityById(id);
  }

  @Post('cities')
  @UseGuards(JwtAuthGuard)
  createCity(@Body() createCityDto: CreateCityDto) {
    return this.locationsService.createCity(
      createCityDto.name,
      createCityDto.countryId,
      createCityDto.latitude,
      createCityDto.longitude,
    );
  }
}
