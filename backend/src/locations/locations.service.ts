import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Continent, Country, City } from '../entities';

@Injectable()
export class LocationsService {
  constructor(
    @InjectRepository(Continent)
    private continentRepository: Repository<Continent>,
    @InjectRepository(Country)
    private countryRepository: Repository<Country>,
    @InjectRepository(City)
    private cityRepository: Repository<City>,
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
}
