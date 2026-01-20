import { LocationsService } from './locations.service';
import { CreateCityDto } from './dto/create-city.dto';
export declare class LocationsController {
    private readonly locationsService;
    constructor(locationsService: LocationsService);
    getAllContinents(): Promise<import("../entities").Continent[]>;
    getContinentById(id: number): Promise<import("../entities").Continent>;
    getCountriesByContinent(id: number): Promise<import("../entities").Country[]>;
    getAllCountries(): Promise<import("../entities").Country[]>;
    getCountryById(id: number): Promise<import("../entities").Country>;
    getCitiesByCountry(id: number): Promise<import("../entities").City[]>;
    searchLocations(query: string): Promise<{
        countries: import("../entities").Country[];
        cities: import("../entities").City[];
    }>;
    searchCities(query: string): Promise<import("../entities").City[]>;
    getCityById(id: number): Promise<import("../entities").City>;
    createCity(createCityDto: CreateCityDto): Promise<import("../entities").City>;
}
