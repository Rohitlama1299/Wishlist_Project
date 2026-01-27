import { Injectable, NotFoundException, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Continent, Country, City, CityActivity } from '../entities';
import { GeoapifyService } from './geoapify.service';

@Injectable()
export class LocationsService {
  private readonly logger = new Logger(LocationsService.name);

  constructor(
    @InjectRepository(Continent)
    private continentRepository: Repository<Continent>,
    @InjectRepository(Country)
    private countryRepository: Repository<Country>,
    @InjectRepository(City)
    private cityRepository: Repository<City>,
    @InjectRepository(CityActivity)
    private cityActivityRepository: Repository<CityActivity>,
    private geoapifyService: GeoapifyService,
  ) {}

  // Continents
  async getAllContinents(): Promise<Continent[]> {
    return this.continentRepository.find({
      order: { name: 'ASC' },
    });
  }

  async getContinentById(id: number): Promise<Continent> {
    const continent = await this.continentRepository.findOne({
      where: { id },
      relations: ['countries'],
    });

    if (!continent) {
      throw new NotFoundException(`Continent with ID ${id} not found`);
    }

    return continent;
  }

  // Countries
  async getCountriesByContinent(continentId: number): Promise<Country[]> {
    return this.countryRepository.find({
      where: { continentId },
      order: { name: 'ASC' },
    });
  }

  async getCountryById(id: number): Promise<Country> {
    const country = await this.countryRepository.findOne({
      where: { id },
      relations: ['continent', 'cities'],
    });

    if (!country) {
      throw new NotFoundException(`Country with ID ${id} not found`);
    }

    return country;
  }

  async getAllCountries(): Promise<Country[]> {
    return this.countryRepository.find({
      relations: ['continent'],
      order: { name: 'ASC' },
    });
  }

  // Cities
  async getCitiesByCountry(countryId: number): Promise<City[]> {
    return this.cityRepository.find({
      where: { countryId },
      order: { name: 'ASC' },
    });
  }

  async getCityById(id: number): Promise<City> {
    const city = await this.cityRepository.findOne({
      where: { id },
      relations: ['country', 'country.continent'],
    });

    if (!city) {
      throw new NotFoundException(`City with ID ${id} not found`);
    }

    return city;
  }

  async searchCities(query: string): Promise<City[]> {
    return this.cityRepository
      .createQueryBuilder('city')
      .leftJoinAndSelect('city.country', 'country')
      .leftJoinAndSelect('country.continent', 'continent')
      .where('LOWER(city.name) LIKE LOWER(:query)', { query: `%${query}%` })
      .orderBy('city.name', 'ASC')
      .limit(20)
      .getMany();
  }

  async searchCountries(query: string): Promise<Country[]> {
    return this.countryRepository
      .createQueryBuilder('country')
      .leftJoinAndSelect('country.continent', 'continent')
      .where('LOWER(country.name) LIKE LOWER(:query)', { query: `%${query}%` })
      .orderBy('country.name', 'ASC')
      .limit(20)
      .getMany();
  }

  async searchLocations(
    query: string,
  ): Promise<{ countries: Country[]; cities: City[] }> {
    const [countries, cities] = await Promise.all([
      this.countryRepository
        .createQueryBuilder('country')
        .leftJoinAndSelect('country.continent', 'continent')
        .where('LOWER(country.name) LIKE LOWER(:query)', {
          query: `%${query}%`,
        })
        .orderBy('country.name', 'ASC')
        .limit(10)
        .getMany(),
      this.cityRepository
        .createQueryBuilder('city')
        .leftJoinAndSelect('city.country', 'country')
        .leftJoinAndSelect('country.continent', 'continent')
        .where('LOWER(city.name) LIKE LOWER(:query)', { query: `%${query}%` })
        .orderBy('city.name', 'ASC')
        .limit(20)
        .getMany(),
    ]);
    return { countries, cities };
  }

  // Create city (for adding custom cities)
  async createCity(
    name: string,
    countryId: number,
    latitude?: number,
    longitude?: number,
  ): Promise<City> {
    const country = await this.countryRepository.findOne({
      where: { id: countryId },
    });

    if (!country) {
      throw new NotFoundException(`Country with ID ${countryId} not found`);
    }

    const city = this.cityRepository.create({
      name,
      countryId,
      latitude,
      longitude,
    });

    return this.cityRepository.save(city);
  }

  // City Activities
  async getCityActivities(cityId: number): Promise<CityActivity[]> {
    const city = await this.cityRepository.findOne({
      where: { id: cityId },
      relations: ['country'],
    });

    if (!city) {
      throw new NotFoundException(`City with ID ${cityId} not found`);
    }

    // Check if we have activities in the database
    let activities = await this.cityActivityRepository.find({
      where: { cityId },
      order: { sortOrder: 'ASC', category: 'ASC' },
    });

    // If no activities and city has coordinates, fetch from Geoapify
    if (activities.length === 0 && city.latitude && city.longitude) {
      this.logger.log(`Fetching activities from Geoapify for ${city.name}`);
      activities = await this.fetchAndSaveActivities(city);
    }

    return activities;
  }

  // Fetch activities from Geoapify and save to database
  private async fetchAndSaveActivities(city: City): Promise<CityActivity[]> {
    try {
      const places = await this.geoapifyService.getPlacesForCity(
        city.latitude!,
        city.longitude!,
        city.name,
      );

      if (places.length === 0) {
        return [];
      }

      const savedActivities: CityActivity[] = [];

      for (let i = 0; i < places.length; i++) {
        const place = places[i];
        const activity = this.cityActivityRepository.create({
          name: place.name,
          description: place.description,
          category: place.category,
          estimatedCost: place.estimatedCost,
          duration: place.duration,
          currency: 'USD',
          sortOrder: i,
          cityId: city.id,
          imageUrl: place.imageUrl,
        });

        const saved = await this.cityActivityRepository.save(activity);
        savedActivities.push(saved);
      }

      this.logger.log(
        `Saved ${savedActivities.length} activities for ${city.name}`,
      );

      return savedActivities;
    } catch (error) {
      this.logger.error(`Error fetching activities for ${city.name}:`, error);
      return [];
    }
  }

  // Force refresh activities from Geoapify
  async refreshCityActivities(cityId: number): Promise<CityActivity[]> {
    const city = await this.cityRepository.findOne({
      where: { id: cityId },
      relations: ['country'],
    });

    if (!city) {
      throw new NotFoundException(`City with ID ${cityId} not found`);
    }

    if (!city.latitude || !city.longitude) {
      throw new NotFoundException(
        `City ${city.name} does not have coordinates`,
      );
    }

    // Delete existing activities
    await this.cityActivityRepository.delete({ cityId });

    // Fetch new activities
    return this.fetchAndSaveActivities(city);
  }

  async getCityActivitiesByCategory(
    cityId: number,
    category: string,
  ): Promise<CityActivity[]> {
    return this.cityActivityRepository.find({
      where: { cityId, category },
      order: { sortOrder: 'ASC' },
    });
  }
}
