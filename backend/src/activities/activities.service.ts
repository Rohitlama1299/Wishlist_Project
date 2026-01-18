import {
  Injectable,
  NotFoundException,
  ForbiddenException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Activity, Destination } from '../entities';
import { CreateActivityDto, UpdateActivityDto } from './dto';

@Injectable()
export class ActivitiesService {
  constructor(
    @InjectRepository(Activity)
    private activityRepository: Repository<Activity>,
    @InjectRepository(Destination)
    private destinationRepository: Repository<Destination>,
  ) {}

  async create(
    userId: string,
    createActivityDto: CreateActivityDto,
  ): Promise<Activity> {
    const { destinationId, ...activityData } = createActivityDto;

    // Verify destination belongs to user
    const destination = await this.destinationRepository.findOne({
      where: { id: destinationId, userId },
    });

    if (!destination) {
      throw new NotFoundException('Destination not found');
    }

    const activity = this.activityRepository.create({
      ...activityData,
      destinationId,
    });

    return this.activityRepository.save(activity);
  }

  async findByDestination(
    userId: string,
    destinationId: string,
  ): Promise<Activity[]> {
    // Verify destination belongs to user
    const destination = await this.destinationRepository.findOne({
      where: { id: destinationId, userId },
    });

    if (!destination) {
      throw new NotFoundException('Destination not found');
    }

    return this.activityRepository.find({
      where: { destinationId },
      order: { sortOrder: 'ASC', createdAt: 'DESC' },
    });
  }

  async findOne(userId: string, activityId: string): Promise<Activity> {
    const activity = await this.activityRepository.findOne({
      where: { id: activityId },
      relations: ['destination'],
    });

    if (!activity) {
      throw new NotFoundException('Activity not found');
    }

    if (activity.destination.userId !== userId) {
      throw new ForbiddenException('Not authorized to access this activity');
    }

    return activity;
  }

  async update(
    userId: string,
    activityId: string,
    updateActivityDto: UpdateActivityDto,
  ): Promise<Activity> {
    const activity = await this.findOne(userId, activityId);

    Object.assign(activity, updateActivityDto);

    return this.activityRepository.save(activity);
  }

  async remove(userId: string, activityId: string): Promise<void> {
    const activity = await this.findOne(userId, activityId);
    await this.activityRepository.remove(activity);
  }

  async toggleCompleted(userId: string, activityId: string): Promise<Activity> {
    const activity = await this.findOne(userId, activityId);
    activity.completed = !activity.completed;
    return this.activityRepository.save(activity);
  }

  async reorder(
    userId: string,
    destinationId: string,
    activityIds: string[],
  ): Promise<Activity[]> {
    // Verify destination belongs to user
    const destination = await this.destinationRepository.findOne({
      where: { id: destinationId, userId },
    });

    if (!destination) {
      throw new NotFoundException('Destination not found');
    }

    // Update sort order for each activity
    for (let i = 0; i < activityIds.length; i++) {
      await this.activityRepository.update(
        { id: activityIds[i], destinationId },
        { sortOrder: i },
      );
    }

    return this.findByDestination(userId, destinationId);
  }
}
