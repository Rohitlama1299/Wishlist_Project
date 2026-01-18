import { DestinationsService } from './destinations.service';
import { CreateDestinationDto, UpdateDestinationDto } from './dto';
import { User } from '../entities';
export declare class DestinationsController {
    private readonly destinationsService;
    constructor(destinationsService: DestinationsService);
    create(user: User, createDestinationDto: CreateDestinationDto): Promise<import("../entities").Destination>;
    findAll(user: User): Promise<import("../entities").Destination[]>;
    getStats(user: User): Promise<{
        totalDestinations: number;
        visitedCount: number;
        pendingCount: number;
        continentStats: Record<string, number>;
        countryStats: Record<string, number>;
    }>;
    findByContinent(user: User, continentId: number): Promise<import("../entities").Destination[]>;
    findByCountry(user: User, countryId: number): Promise<import("../entities").Destination[]>;
    findOne(user: User, id: string): Promise<import("../entities").Destination>;
    update(user: User, id: string, updateDestinationDto: UpdateDestinationDto): Promise<import("../entities").Destination>;
    remove(user: User, id: string): Promise<void>;
}
