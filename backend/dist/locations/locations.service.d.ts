import { Repository } from 'typeorm';
import { Continent, Country, City } from '../entities';
export declare class LocationsService {
    private continentRepository;
    private countryRepository;
    private cityRepository;
    constructor(continentRepository: Repository<Continent>, countryRepository: Repository<Country>, cityRepository: Repository<City>);
    getAllContinents(): Promise<Continent[]>;
    getContinentById(id: number): Promise<Continent>;
    getCountriesByContinent(continentId: number): Promise<Country[]>;
    getCountryById(id: number): Promise<Country>;
    getAllCountries(): Promise<Country[]>;
    getCitiesByCountry(countryId: number): Promise<City[]>;
    getCityById(id: number): Promise<City>;
    searchCities(query: string): Promise<City[]>;
    searchCountries(query: string): Promise<Country[]>;
    searchLocations(query: string): Promise<{
        countries: Country[];
        cities: City[];
    }>;
    createCity(name: string, countryId: number, latitude?: number, longitude?: number): Promise<City>;
}
