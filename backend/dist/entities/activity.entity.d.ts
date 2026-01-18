import { Destination } from './destination.entity';
export declare class Activity {
    id: string;
    name: string;
    description: string;
    category: string;
    completed: boolean;
    estimatedCost: number;
    currency: string;
    sortOrder: number;
    destination: Destination;
    destinationId: string;
    createdAt: Date;
    updatedAt: Date;
}
