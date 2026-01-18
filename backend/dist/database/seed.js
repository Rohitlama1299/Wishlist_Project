"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
const typeorm_1 = require("typeorm");
const continent_entity_1 = require("../entities/continent.entity");
const country_entity_1 = require("../entities/country.entity");
const city_entity_1 = require("../entities/city.entity");
const user_entity_1 = require("../entities/user.entity");
const destination_entity_1 = require("../entities/destination.entity");
const photo_entity_1 = require("../entities/photo.entity");
const activity_entity_1 = require("../entities/activity.entity");
const dotenv = __importStar(require("dotenv"));
dotenv.config();
const dataSource = new typeorm_1.DataSource({
    type: 'postgres',
    host: process.env.DB_HOST || 'localhost',
    port: parseInt(process.env.DB_PORT || '5432'),
    username: process.env.DB_USERNAME || 'postgres',
    password: process.env.DB_PASSWORD || 'password',
    database: process.env.DB_NAME || 'travel_wishlist',
    entities: [user_entity_1.User, continent_entity_1.Continent, country_entity_1.Country, city_entity_1.City, destination_entity_1.Destination, photo_entity_1.Photo, activity_entity_1.Activity],
    synchronize: true,
});
const continentsData = [
    { name: 'Africa', code: 'AF' },
    { name: 'Antarctica', code: 'AN' },
    { name: 'Asia', code: 'AS' },
    { name: 'Europe', code: 'EU' },
    { name: 'North America', code: 'NA' },
    { name: 'Oceania', code: 'OC' },
    { name: 'South America', code: 'SA' },
];
const countriesData = [
    { name: 'Egypt', code: 'EG', continent: 'Africa' },
    { name: 'Morocco', code: 'MA', continent: 'Africa' },
    { name: 'South Africa', code: 'ZA', continent: 'Africa' },
    { name: 'Kenya', code: 'KE', continent: 'Africa' },
    { name: 'Tanzania', code: 'TZ', continent: 'Africa' },
    { name: 'Japan', code: 'JP', continent: 'Asia' },
    { name: 'China', code: 'CN', continent: 'Asia' },
    { name: 'India', code: 'IN', continent: 'Asia' },
    { name: 'Thailand', code: 'TH', continent: 'Asia' },
    { name: 'Vietnam', code: 'VN', continent: 'Asia' },
    { name: 'Indonesia', code: 'ID', continent: 'Asia' },
    { name: 'South Korea', code: 'KR', continent: 'Asia' },
    { name: 'Nepal', code: 'NP', continent: 'Asia' },
    { name: 'Singapore', code: 'SG', continent: 'Asia' },
    { name: 'Malaysia', code: 'MY', continent: 'Asia' },
    { name: 'Philippines', code: 'PH', continent: 'Asia' },
    { name: 'United Arab Emirates', code: 'AE', continent: 'Asia' },
    { name: 'France', code: 'FR', continent: 'Europe' },
    { name: 'Italy', code: 'IT', continent: 'Europe' },
    { name: 'Spain', code: 'ES', continent: 'Europe' },
    { name: 'Germany', code: 'DE', continent: 'Europe' },
    { name: 'United Kingdom', code: 'GB', continent: 'Europe' },
    { name: 'Netherlands', code: 'NL', continent: 'Europe' },
    { name: 'Greece', code: 'GR', continent: 'Europe' },
    { name: 'Portugal', code: 'PT', continent: 'Europe' },
    { name: 'Switzerland', code: 'CH', continent: 'Europe' },
    { name: 'Austria', code: 'AT', continent: 'Europe' },
    { name: 'Czech Republic', code: 'CZ', continent: 'Europe' },
    { name: 'Norway', code: 'NO', continent: 'Europe' },
    { name: 'Sweden', code: 'SE', continent: 'Europe' },
    { name: 'Iceland', code: 'IS', continent: 'Europe' },
    { name: 'United States', code: 'US', continent: 'North America' },
    { name: 'Canada', code: 'CA', continent: 'North America' },
    { name: 'Mexico', code: 'MX', continent: 'North America' },
    { name: 'Costa Rica', code: 'CR', continent: 'North America' },
    { name: 'Cuba', code: 'CU', continent: 'North America' },
    { name: 'Brazil', code: 'BR', continent: 'South America' },
    { name: 'Argentina', code: 'AR', continent: 'South America' },
    { name: 'Peru', code: 'PE', continent: 'South America' },
    { name: 'Chile', code: 'CL', continent: 'South America' },
    { name: 'Colombia', code: 'CO', continent: 'South America' },
    { name: 'Australia', code: 'AU', continent: 'Oceania' },
    { name: 'New Zealand', code: 'NZ', continent: 'Oceania' },
    { name: 'Fiji', code: 'FJ', continent: 'Oceania' },
];
const citiesData = [
    { name: 'Tokyo', country: 'Japan', lat: 35.6762, lng: 139.6503 },
    { name: 'Kyoto', country: 'Japan', lat: 35.0116, lng: 135.7681 },
    { name: 'Osaka', country: 'Japan', lat: 34.6937, lng: 135.5023 },
    { name: 'Paris', country: 'France', lat: 48.8566, lng: 2.3522 },
    { name: 'Nice', country: 'France', lat: 43.7102, lng: 7.262 },
    { name: 'Lyon', country: 'France', lat: 45.764, lng: 4.8357 },
    { name: 'Rome', country: 'Italy', lat: 41.9028, lng: 12.4964 },
    { name: 'Venice', country: 'Italy', lat: 45.4408, lng: 12.3155 },
    { name: 'Florence', country: 'Italy', lat: 43.7696, lng: 11.2558 },
    { name: 'Milan', country: 'Italy', lat: 45.4642, lng: 9.19 },
    { name: 'Barcelona', country: 'Spain', lat: 41.3851, lng: 2.1734 },
    { name: 'Madrid', country: 'Spain', lat: 40.4168, lng: -3.7038 },
    { name: 'Seville', country: 'Spain', lat: 37.3891, lng: -5.9845 },
    { name: 'New York City', country: 'United States', lat: 40.7128, lng: -74.006 },
    { name: 'Los Angeles', country: 'United States', lat: 34.0522, lng: -118.2437 },
    { name: 'San Francisco', country: 'United States', lat: 37.7749, lng: -122.4194 },
    { name: 'Miami', country: 'United States', lat: 25.7617, lng: -80.1918 },
    { name: 'Las Vegas', country: 'United States', lat: 36.1699, lng: -115.1398 },
    { name: 'Bangkok', country: 'Thailand', lat: 13.7563, lng: 100.5018 },
    { name: 'Chiang Mai', country: 'Thailand', lat: 18.7883, lng: 98.9853 },
    { name: 'Phuket', country: 'Thailand', lat: 7.8804, lng: 98.3923 },
    { name: 'Sydney', country: 'Australia', lat: -33.8688, lng: 151.2093 },
    { name: 'Melbourne', country: 'Australia', lat: -37.8136, lng: 144.9631 },
    { name: 'Brisbane', country: 'Australia', lat: -27.4698, lng: 153.0251 },
    { name: 'Rio de Janeiro', country: 'Brazil', lat: -22.9068, lng: -43.1729 },
    { name: 'São Paulo', country: 'Brazil', lat: -23.5505, lng: -46.6333 },
    { name: 'London', country: 'United Kingdom', lat: 51.5074, lng: -0.1278 },
    { name: 'Edinburgh', country: 'United Kingdom', lat: 55.9533, lng: -3.1883 },
    { name: 'Berlin', country: 'Germany', lat: 52.52, lng: 13.405 },
    { name: 'Munich', country: 'Germany', lat: 48.1351, lng: 11.582 },
    { name: 'Athens', country: 'Greece', lat: 37.9838, lng: 23.7275 },
    { name: 'Santorini', country: 'Greece', lat: 36.3932, lng: 25.4615 },
    { name: 'Delhi', country: 'India', lat: 28.7041, lng: 77.1025 },
    { name: 'Mumbai', country: 'India', lat: 19.076, lng: 72.8777 },
    { name: 'Jaipur', country: 'India', lat: 26.9124, lng: 75.7873 },
    { name: 'Kathmandu', country: 'Nepal', lat: 27.7172, lng: 85.324 },
    { name: 'Pokhara', country: 'Nepal', lat: 28.2096, lng: 83.9856 },
    { name: 'Cairo', country: 'Egypt', lat: 30.0444, lng: 31.2357 },
    { name: 'Luxor', country: 'Egypt', lat: 25.6872, lng: 32.6396 },
    { name: 'Marrakech', country: 'Morocco', lat: 31.6295, lng: -7.9811 },
    { name: 'Fes', country: 'Morocco', lat: 34.0181, lng: -5.0078 },
    { name: 'Lima', country: 'Peru', lat: -12.0464, lng: -77.0428 },
    { name: 'Cusco', country: 'Peru', lat: -13.532, lng: -71.9675 },
    { name: 'Auckland', country: 'New Zealand', lat: -36.8485, lng: 174.7633 },
    { name: 'Queenstown', country: 'New Zealand', lat: -45.0312, lng: 168.6626 },
    { name: 'Seoul', country: 'South Korea', lat: 37.5665, lng: 126.978 },
    { name: 'Busan', country: 'South Korea', lat: 35.1796, lng: 129.0756 },
    { name: 'Hanoi', country: 'Vietnam', lat: 21.0285, lng: 105.8542 },
    { name: 'Ho Chi Minh City', country: 'Vietnam', lat: 10.8231, lng: 106.6297 },
    { name: 'Bali', country: 'Indonesia', lat: -8.3405, lng: 115.092 },
    { name: 'Jakarta', country: 'Indonesia', lat: -6.2088, lng: 106.8456 },
    { name: 'Singapore', country: 'Singapore', lat: 1.3521, lng: 103.8198 },
    { name: 'Dubai', country: 'United Arab Emirates', lat: 25.2048, lng: 55.2708 },
    { name: 'Abu Dhabi', country: 'United Arab Emirates', lat: 24.4539, lng: 54.3773 },
    { name: 'Reykjavik', country: 'Iceland', lat: 64.1466, lng: -21.9426 },
    { name: 'Lisbon', country: 'Portugal', lat: 38.7223, lng: -9.1393 },
    { name: 'Porto', country: 'Portugal', lat: 41.1579, lng: -8.6291 },
    { name: 'Amsterdam', country: 'Netherlands', lat: 52.3676, lng: 4.9041 },
    { name: 'Zurich', country: 'Switzerland', lat: 47.3769, lng: 8.5417 },
    { name: 'Geneva', country: 'Switzerland', lat: 46.2044, lng: 6.1432 },
    { name: 'Buenos Aires', country: 'Argentina', lat: -34.6037, lng: -58.3816 },
    { name: 'Mexico City', country: 'Mexico', lat: 19.4326, lng: -99.1332 },
    { name: 'Cancun', country: 'Mexico', lat: 21.1619, lng: -86.8515 },
    { name: 'Toronto', country: 'Canada', lat: 43.6532, lng: -79.3832 },
    { name: 'Vancouver', country: 'Canada', lat: 49.2827, lng: -123.1207 },
    { name: 'Beijing', country: 'China', lat: 39.9042, lng: 116.4074 },
    { name: 'Shanghai', country: 'China', lat: 31.2304, lng: 121.4737 },
    { name: 'Hong Kong', country: 'China', lat: 22.3193, lng: 114.1694 },
    { name: 'Cape Town', country: 'South Africa', lat: -33.9249, lng: 18.4241 },
    { name: 'Johannesburg', country: 'South Africa', lat: -26.2041, lng: 28.0473 },
];
async function seed() {
    try {
        await dataSource.initialize();
        console.log('Database connected');
        const continentRepo = dataSource.getRepository(continent_entity_1.Continent);
        const countryRepo = dataSource.getRepository(country_entity_1.Country);
        const cityRepo = dataSource.getRepository(city_entity_1.City);
        await cityRepo.createQueryBuilder().delete().from(city_entity_1.City).execute();
        await countryRepo.createQueryBuilder().delete().from(country_entity_1.Country).execute();
        await continentRepo.createQueryBuilder().delete().from(continent_entity_1.Continent).execute();
        console.log('Cleared existing data');
        const continentMap = new Map();
        for (const continentData of continentsData) {
            const continent = continentRepo.create(continentData);
            const saved = await continentRepo.save(continent);
            continentMap.set(saved.name, saved);
        }
        console.log(`Seeded ${continentMap.size} continents`);
        const countryMap = new Map();
        for (const countryData of countriesData) {
            const continent = continentMap.get(countryData.continent);
            if (continent) {
                const country = countryRepo.create({
                    name: countryData.name,
                    code: countryData.code,
                    continentId: continent.id,
                });
                const saved = await countryRepo.save(country);
                countryMap.set(saved.name, saved);
            }
        }
        console.log(`Seeded ${countryMap.size} countries`);
        let cityCount = 0;
        for (const cityData of citiesData) {
            const country = countryMap.get(cityData.country);
            if (country) {
                const city = cityRepo.create({
                    name: cityData.name,
                    countryId: country.id,
                    latitude: cityData.lat,
                    longitude: cityData.lng,
                });
                await cityRepo.save(city);
                cityCount++;
            }
        }
        console.log(`Seeded ${cityCount} cities`);
        console.log('Seeding completed successfully!');
        await dataSource.destroy();
    }
    catch (error) {
        console.error('Error seeding database:', error);
        process.exit(1);
    }
}
seed();
//# sourceMappingURL=seed.js.map