import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  ParseIntPipe,
} from '@nestjs/common';
import { DestinationsService } from './destinations.service';
import { CreateDestinationDto, UpdateDestinationDto } from './dto';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { GetUser } from '../common/decorators/get-user.decorator';
import { User } from '../entities';

@Controller('destinations')
@UseGuards(JwtAuthGuard)
export class DestinationsController {
  constructor(private readonly destinationsService: DestinationsService) {}

  @Post()
  create(
    @GetUser() user: User,
    @Body() createDestinationDto: CreateDestinationDto,
  ) {
    return this.destinationsService.create(user.id, createDestinationDto);
  }

  @Get()
  findAll(@GetUser() user: User) {
    return this.destinationsService.findAllByUser(user.id);
  }

  @Get('stats')
  getStats(@GetUser() user: User) {
    return this.destinationsService.getStats(user.id);
  }

  @Get('continent/:continentId')
  findByContinent(
    @GetUser() user: User,
    @Param('continentId', ParseIntPipe) continentId: number,
  ) {
    return this.destinationsService.findByContinent(user.id, continentId);
  }

  @Get('country/:countryId')
  findByCountry(
    @GetUser() user: User,
    @Param('countryId', ParseIntPipe) countryId: number,
  ) {
    return this.destinationsService.findByCountry(user.id, countryId);
  }

  @Get(':id')
  findOne(@GetUser() user: User, @Param('id') id: string) {
    return this.destinationsService.findOne(user.id, id);
  }

  @Patch(':id')
  update(
    @GetUser() user: User,
    @Param('id') id: string,
    @Body() updateDestinationDto: UpdateDestinationDto,
  ) {
    return this.destinationsService.update(user.id, id, updateDestinationDto);
  }

  @Delete(':id')
  remove(@GetUser() user: User, @Param('id') id: string) {
    return this.destinationsService.remove(user.id, id);
  }
}
