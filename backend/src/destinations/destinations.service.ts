import {
  Injectable,
  NotFoundException,
  ConflictException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Destination, City } from '../entities';
import { CreateDestinationDto, UpdateDestinationDto } from './dto';

@Injectable()
export class DestinationsService {
  constructor(
    @InjectRepository(Destination)
    private destinationRepository: Repository<Destination>,
    @InjectRepository(City)
    private cityRepository: Repository<City>,
  ) {}

  async create(
    userId: string,
    createDestinationDto: CreateDestinationDto,
  ): Promise<Destination> {
    const { cityId } = createDestinationDto;

    // Check if city exists
    const city = await this.cityRepository.findOne({ where: { id: cityId } });
    if (!city) {
      throw new NotFoundException(`City with ID ${cityId} not found`);
    }

    // Check if user already has this destination
    const existingDestination = await this.destinationRepository.findOne({
      where: { userId, cityId },
    });

    if (existingDestination) {
      throw new ConflictException('This destination is already in your list');
    }

    const destination = this.destinationRepository.create({
      ...createDestinationDto,
      userId,
    });

    return this.destinationRepository.save(destination);
  }

  async findAllByUser(userId: string): Promise<Destination[]> {
    return this.destinationRepository.find({
      where: { userId },
      relations: [
        'city',
        'city.country',
        'city.country.continent',
        'photos',
        'activities',
      ],
      order: { createdAt: 'DESC' },
    });
  }

  async findByContinent(userId: string, continentId: number): Promise<Destination[]> {
    return this.destinationRepository
      .createQueryBuilder('destination')
      .leftJoinAndSelect('destination.city', 'city')
      .leftJoinAndSelect('city.country', 'country')
      .leftJoinAndSelect('country.continent', 'continent')
      .leftJoinAndSelect('destination.photos', 'photos')
      .leftJoinAndSelect('destination.activities', 'activities')
      .where('destination.userId = :userId', { userId })
      .andWhere('continent.id = :continentId', { continentId })
      .orderBy('destination.createdAt', 'DESC')
      .getMany();
  }

  async findByCountry(userId: string, countryId: number): Promise<Destination[]> {
    return this.destinationRepository
      .createQueryBuilder('destination')
      .leftJoinAndSelect('destination.city', 'city')
      .leftJoinAndSelect('city.country', 'country')
      .leftJoinAndSelect('country.continent', 'continent')
      .leftJoinAndSelect('destination.photos', 'photos')
      .leftJoinAndSelect('destination.activities', 'activities')
      .where('destination.userId = :userId', { userId })
      .andWhere('country.id = :countryId', { countryId })
      .orderBy('destination.createdAt', 'DESC')
      .getMany();
  }

  async findOne(userId: string, id: string): Promise<Destination> {
    const destination = await this.destinationRepository.findOne({
      where: { id, userId },
      relations: [
        'city',
        'city.country',
        'city.country.continent',
        'photos',
        'activities',
      ],
    });

    if (!destination) {
      throw new NotFoundException(`Destination with ID ${id} not found`);
    }

    return destination;
  }

  async update(
    userId: string,
    id: string,
    updateDestinationDto: UpdateDestinationDto,
  ): Promise<Destination> {
    const destination = await this.findOne(userId, id);

    Object.assign(destination, updateDestinationDto);

    return this.destinationRepository.save(destination);
  }

  async remove(userId: string, id: string): Promise<void> {
    const destination = await this.findOne(userId, id);
    await this.destinationRepository.remove(destination);
  }

  async getStats(userId: string) {
    const destinations = await this.findAllByUser(userId);

    const totalDestinations = destinations.length;
    const visitedCount = destinations.filter((d) => d.visited).length;
    const pendingCount = totalDestinations - visitedCount;

    const continentStats = destinations.reduce(
      (acc, dest) => {
        const continentName = dest.city?.country?.continent?.name || 'Unknown';
        acc[continentName] = (acc[continentName] || 0) + 1;
        return acc;
      },
      {} as Record<string, number>,
    );

    const countryStats = destinations.reduce(
      (acc, dest) => {
        const countryName = dest.city?.country?.name || 'Unknown';
        acc[countryName] = (acc[countryName] || 0) + 1;
        return acc;
      },
      {} as Record<string, number>,
    );

    return {
      totalDestinations,
      visitedCount,
      pendingCount,
      continentStats,
      countryStats,
    };
  }
}
