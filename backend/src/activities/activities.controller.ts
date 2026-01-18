import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
} from '@nestjs/common';
import { ActivitiesService } from './activities.service';
import { CreateActivityDto, UpdateActivityDto } from './dto';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { GetUser } from '../common/decorators/get-user.decorator';
import { User } from '../entities';

@Controller('activities')
@UseGuards(JwtAuthGuard)
export class ActivitiesController {
  constructor(private readonly activitiesService: ActivitiesService) {}

  @Post()
  create(@GetUser() user: User, @Body() createActivityDto: CreateActivityDto) {
    return this.activitiesService.create(user.id, createActivityDto);
  }

  @Get('destination/:destinationId')
  findByDestination(
    @GetUser() user: User,
    @Param('destinationId') destinationId: string,
  ) {
    return this.activitiesService.findByDestination(user.id, destinationId);
  }

  @Get(':id')
  findOne(@GetUser() user: User, @Param('id') id: string) {
    return this.activitiesService.findOne(user.id, id);
  }

  @Patch(':id')
  update(
    @GetUser() user: User,
    @Param('id') id: string,
    @Body() updateActivityDto: UpdateActivityDto,
  ) {
    return this.activitiesService.update(user.id, id, updateActivityDto);
  }

  @Patch(':id/toggle')
  toggleCompleted(@GetUser() user: User, @Param('id') id: string) {
    return this.activitiesService.toggleCompleted(user.id, id);
  }

  @Post('destination/:destinationId/reorder')
  reorder(
    @GetUser() user: User,
    @Param('destinationId') destinationId: string,
    @Body('activityIds') activityIds: string[],
  ) {
    return this.activitiesService.reorder(user.id, destinationId, activityIds);
  }

  @Delete(':id')
  remove(@GetUser() user: User, @Param('id') id: string) {
    return this.activitiesService.remove(user.id, id);
  }
}
