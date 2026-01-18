import { Repository } from 'typeorm';
import { Activity, Destination } from '../entities';
import { CreateActivityDto, UpdateActivityDto } from './dto';
export declare class ActivitiesService {
    private activityRepository;
    private destinationRepository;
    constructor(activityRepository: Repository<Activity>, destinationRepository: Repository<Destination>);
    create(userId: string, createActivityDto: CreateActivityDto): Promise<Activity>;
    findByDestination(userId: string, destinationId: string): Promise<Activity[]>;
    findOne(userId: string, activityId: string): Promise<Activity>;
    update(userId: string, activityId: string, updateActivityDto: UpdateActivityDto): Promise<Activity>;
    remove(userId: string, activityId: string): Promise<void>;
    toggleCompleted(userId: string, activityId: string): Promise<Activity>;
    reorder(userId: string, destinationId: string, activityIds: string[]): Promise<Activity[]>;
}
