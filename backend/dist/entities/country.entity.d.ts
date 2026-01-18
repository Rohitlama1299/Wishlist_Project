import { Continent } from './continent.entity';
import { City } from './city.entity';
export declare class Country {
    id: number;
    name: string;
    code: string;
    imageUrl: string;
    flagUrl: string;
    continent: Continent;
    continentId: number;
    cities: City[];
}
