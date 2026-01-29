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

async function listBrokenImages() {
  try {
    await dataSource.initialize();
    console.log('Database connected');

    const cityRepository = dataSource.getRepository(City);
    const cities = await cityRepository.find({ order: { name: 'ASC' } });

    console.log('Checking ' + cities.length + ' cities...\n');

    const broken: string[] = [];

    for (const city of cities) {
      if (!city.imageUrl) {
        broken.push(city.name);
        continue;
      }

      try {
        const res = await fetch(city.imageUrl, { method: 'HEAD' });
        if (!res.ok) {
          broken.push(city.name);
        }
      } catch {
        broken.push(city.name);
      }
    }

    console.log('\n============================');
    console.log('BROKEN CITIES (' + broken.length + ' total):');
    console.log('============================\n');
    broken.forEach(c => console.log(c));

  } catch (error) {
    console.error('Error:', error);
    process.exit(1);
  } finally {
    await dataSource.destroy();
  }
}

listBrokenImages();
