import { User } from './user.entity';
import { City } from './city.entity';
import { Photo } from './photo.entity';
import { Activity } from './activity.entity';
export declare class Destination {
    id: string;
    notes: string;
    visited: boolean;
    visitedDate: Date;
    plannedDate: Date;
    priority: number;
    user: User;
    userId: string;
    city: City;
    cityId: number;
    photos: Photo[];
    activities: Activity[];
    createdAt: Date;
    updatedAt: Date;
}
