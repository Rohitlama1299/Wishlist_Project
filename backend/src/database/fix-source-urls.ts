import { DataSource } from 'typeorm';
import {
  City,
  Country,
  Continent,
  Destination,
  User,
  Photo,
  Activity,
  CityActivity,
} from '../entities';
import * as dotenv from 'dotenv';

dotenv.config({ path: process.env.ENV_FILE || '.env' });

const entities = [User, Continent, Country, City, CityActivity, Destination, Photo, Activity];

const dbConfig = process.env.DATABASE_URL
  ? {
      type: 'postgres' as const,
      url: process.env.DATABASE_URL.replace('sslmode=require', 'sslmode=no-verify'),
      entities,
      ssl: { rejectUnauthorized: false },
    }
  : {
      type: 'postgres' as const,
      host: process.env.DB_HOST || 'localhost',
      port: parseInt(process.env.DB_PORT || '5432'),
      username: process.env.DB_USERNAME || 'postgres',
      password: process.env.DB_PASSWORD || 'password',
      database: process.env.DB_NAME || 'travel_wishlist',
      entities,
    };

const dataSource = new DataSource(dbConfig);

// Reliable fallback images by category/region
const fallbackImages: Record<string, string> = {
  // Asia
  default_asia: '1480796927426-f609979314bd', // Generic Asian city
  // Europe
  default_europe: '1467269204594-9661b134dd2b', // European architecture
  // Americas
  default_americas: '1449824913935-59a10b8d2000', // City skyline
  // Africa
  default_africa: '1489392191049-fc10c97e64b6', // African landscape
  // Oceania
  default_oceania: '1506973035872-a4ec16b8e8d9', // Beach/ocean
  // Middle East
  default_middle_east: '1512453913323-0b5c8a2b8b7c', // Dubai-style city
  // Generic
  default: '1477959858617-67f85cf4f1df', // Generic cityscape
};

// Map of city names to their known working Unsplash photo IDs
const knownCityImages: Record<string, string> = {
  // Middle East
  'Abu Dhabi': '1512453913323-0b5c8a2b8b7c',
  'Dubai': '1512453913323-0b5c8a2b8b7c',
  'Doha': '1518684079-3c830dcef090',
  // Asia
  'Bangkok': '1508009603885-50cf7c8a1550',
  'Seoul': '1517154421773-0529f29ea451',
  'Shanghai': '1474181923578-ffd78d89f150',
  'Beijing': '1508804185872-d7badad00f7d',
  'Tokyo': '1540959733332-eab4deabeeaf',
  'Singapore': '1525625293386-3f8f99389edd',
  'Hong Kong': '1536599018102-9f803c140fc1',
  // Europe
  'Vienna': '1516550893923-42d28e5677af',
  'Budapest': '1541849546-216549ae216d',
  'Prague': '1519677100203-a0e668c92439',
  'Munich': '1595867818082-083862f3d630',
  'Stockholm': '1509356843151-3e7bd6a4d4e3',
  'Brussels': '1559113202-c916b8e55d55',
  'Bruges': '1491557345352-5929e343eb89',
  'Edinburgh': '1506377711776-a0d2f20d0c05',
  'Lisbon': '1536663815808-535e2280d2c2',
  'Barcelona': '1583422409516-2895a77efded',
  'Madrid': '1539037116277-4db20889f2d4',
  'Rome': '1552832230-c0197dd311b5',
  'Paris': '1502602898657-3e91760cbb34',
  'London': '1513635269975-59663e0ac1ad',
  'Amsterdam': '1534351590666-13e3e96b5017',
  'Berlin': '1560969184-10fe8719e047',
  // Americas
  'New York': '1496442226666-8d4d0e62e6e9',
  'Los Angeles': '1534190760961-74e8c1c5c3da',
  'San Francisco': '1501594907352-04cda38ebc29',
  'Chicago': '1494522855154-9297ac14b55f',
  'Miami': '1533106497176-45ae19e68ba2',
  'Toronto': '1517935706615-2717063c2225',
  'Vancouver': '1559511260-66a68e7e0e31',
  'Mexico City': '1518659526054-e268293c3e7c',
  'Rio de Janeiro': '1483729558449-99ef09a8c325',
  'Buenos Aires': '1518098268026-4e89f1a2cd8e',
  'Lima': '1531968455001-4862fe25a55c',
  'Santiago': '1473177104440-ffee2f376098',
  'Bogota': '1568967729548-e3be0a16ce88',
  'Sao Paulo': '1554168848-228bc8f6e2a0',
  // Oceania
  'Sydney': '1506973035872-a4ec16b8e8d9',
  'Melbourne': '1514395462725-fb4566210144',
  'Brisbane': '1524293581917-dc2d5d4a32b4',
  'Auckland': '1507699622108-4be3abd695ad',
  // Africa
  'Cairo': '1572252009286-4fdba7b3f98f',
  'Cape Town': '1580060839134-75a5edca2e99',
  'Marrakech': '1597212618440-806262de4f6b',
  'Nairobi': '1611348524140-53c9a25263d6',
};

function getImageUrl(photoId: string): string {
  return `https://images.unsplash.com/photo-${photoId}?w=800&q=80`;
}

async function fixSourceUrls() {
  try {
    await dataSource.initialize();
    console.log('Database connected\n');

    const cityRepository = dataSource.getRepository(City);

    // Find all cities with broken source.unsplash.com URLs
    const cities = await cityRepository
      .createQueryBuilder('city')
      .leftJoinAndSelect('city.country', 'country')
      .leftJoinAndSelect('country.continent', 'continent')
      .where("city.imageUrl LIKE :pattern", { pattern: '%source.unsplash.com%' })
      .getMany();

    console.log(`Found ${cities.length} cities with source.unsplash.com URLs to fix\n`);

    let fixed = 0;

    for (const city of cities) {
      let newPhotoId: string;

      // Check if we have a known working image for this city
      if (knownCityImages[city.name]) {
        newPhotoId = knownCityImages[city.name];
      } else {
        // Use regional fallback based on continent
        const continentName = city.country?.continent?.name || '';

        if (continentName === 'Asia') {
          newPhotoId = fallbackImages.default_asia;
        } else if (continentName === 'Europe') {
          newPhotoId = fallbackImages.default_europe;
        } else if (continentName === 'North America' || continentName === 'South America') {
          newPhotoId = fallbackImages.default_americas;
        } else if (continentName === 'Africa') {
          newPhotoId = fallbackImages.default_africa;
        } else if (continentName === 'Oceania') {
          newPhotoId = fallbackImages.default_oceania;
        } else {
          newPhotoId = fallbackImages.default;
        }
      }

      const newUrl = getImageUrl(newPhotoId);
      await cityRepository.update({ id: city.id }, { imageUrl: newUrl });
      console.log(`Fixed: ${city.name} -> ${newUrl}`);
      fixed++;
    }

    console.log(`\n============================`);
    console.log(`Fixed ${fixed} cities`);
    console.log(`============================`);

  } catch (error) {
    console.error('Error:', error);
    process.exit(1);
  } finally {
    await dataSource.destroy();
  }
}

fixSourceUrls();
