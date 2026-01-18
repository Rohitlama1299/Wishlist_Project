import { Country } from './country.entity';
import { Destination } from './destination.entity';
export declare class City {
    id: number;
    name: string;
    imageUrl: string;
    latitude: number;
    longitude: number;
    country: Country;
    countryId: number;
    destinations: Destination[];
}
