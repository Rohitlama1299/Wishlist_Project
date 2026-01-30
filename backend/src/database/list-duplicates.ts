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

async function listDuplicates() {
  try {
    await dataSource.initialize();
    const cityRepository = dataSource.getRepository(City);
    const cities = await cityRepository.find({ order: { name: 'ASC' } });

    // Group by image URL
    const urlGroups: Record<string, string[]> = {};
    for (const city of cities) {
      if (!urlGroups[city.imageUrl]) urlGroups[city.imageUrl] = [];
      urlGroups[city.imageUrl].push(city.name);
    }

    // Get cities that share images (all except first)
    const duplicates: string[] = [];
    for (const [, cityNames] of Object.entries(urlGroups)) {
      if (cityNames.length > 1) {
        // Keep first, list the rest as duplicates
        duplicates.push(...cityNames.slice(1));
      }
    }

    console.log(`Total cities needing unique images: ${duplicates.length}\n`);
    duplicates.sort().forEach(name => console.log(name));

  } catch (error) {
    console.error('Error:', error);
  } finally {
    await dataSource.destroy();
  }
}

listDuplicates();
