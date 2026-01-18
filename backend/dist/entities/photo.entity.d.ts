import { Destination } from './destination.entity';
export declare class Photo {
    id: string;
    url: string;
    caption: string;
    fileName: string;
    mimeType: string;
    sortOrder: number;
    destination: Destination;
    destinationId: string;
    createdAt: Date;
}
