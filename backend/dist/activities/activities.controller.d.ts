import { ActivitiesService } from './activities.service';
import { CreateActivityDto, UpdateActivityDto } from './dto';
import { User } from '../entities';
export declare class ActivitiesController {
    private readonly activitiesService;
    constructor(activitiesService: ActivitiesService);
    create(user: User, createActivityDto: CreateActivityDto): Promise<import("../entities").Activity>;
    findByDestination(user: User, destinationId: string): Promise<import("../entities").Activity[]>;
    findOne(user: User, id: string): Promise<import("../entities").Activity>;
    update(user: User, id: string, updateActivityDto: UpdateActivityDto): Promise<import("../entities").Activity>;
    toggleCompleted(user: User, id: string): Promise<import("../entities").Activity>;
    reorder(user: User, destinationId: string, activityIds: string[]): Promise<import("../entities").Activity[]>;
    remove(user: User, id: string): Promise<void>;
}
