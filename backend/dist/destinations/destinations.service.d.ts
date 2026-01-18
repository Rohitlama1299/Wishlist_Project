import { Repository } from 'typeorm';
import { Destination, City } from '../entities';
import { CreateDestinationDto, UpdateDestinationDto } from './dto';
export declare class DestinationsService {
    private destinationRepository;
    private cityRepository;
    constructor(destinationRepository: Repository<Destination>, cityRepository: Repository<City>);
    create(userId: string, createDestinationDto: CreateDestinationDto): Promise<Destination>;
    findAllByUser(userId: string): Promise<Destination[]>;
    findByContinent(userId: string, continentId: number): Promise<Destination[]>;
    findByCountry(userId: string, countryId: number): Promise<Destination[]>;
    findOne(userId: string, id: string): Promise<Destination>;
    update(userId: string, id: string, updateDestinationDto: UpdateDestinationDto): Promise<Destination>;
    remove(userId: string, id: string): Promise<void>;
    getStats(userId: string): Promise<{
        totalDestinations: number;
        visitedCount: number;
        pendingCount: number;
        continentStats: Record<string, number>;
        countryStats: Record<string, number>;
    }>;
}
