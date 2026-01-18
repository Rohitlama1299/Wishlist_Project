import { Destination } from './destination.entity';
export declare class User {
    id: string;
    email: string;
    password: string;
    firstName: string;
    lastName: string;
    profilePicture: string;
    destinations: Destination[];
    createdAt: Date;
    updatedAt: Date;
}
