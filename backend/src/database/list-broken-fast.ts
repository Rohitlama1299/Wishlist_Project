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

async function checkImage(city: City): Promise<string | null> {
  if (!city.imageUrl) return city.name;

  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 5000);

    const res = await fetch(city.imageUrl, {
      method: 'HEAD',
      signal: controller.signal
    });

    clearTimeout(timeout);
    return res.ok ? null : city.name;
  } catch {
    return city.name;
  }
}

async function listBrokenImages() {
  try {
    await dataSource.initialize();
    console.log('Database connected');

    const cityRepository = dataSource.getRepository(City);
    const cities = await cityRepository.find({ order: { name: 'ASC' } });

    console.log('Checking ' + cities.length + ' cities in parallel...\n');

    // Check in batches of 20
    const batchSize = 20;
    const broken: string[] = [];

    for (let i = 0; i < cities.length; i += batchSize) {
      const batch = cities.slice(i, i + batchSize);
      const results = await Promise.all(batch.map(checkImage));

      results.forEach(r => {
        if (r) broken.push(r);
      });

      process.stdout.write('.');
    }

    console.log('\n\n============================');
    console.log('BROKEN CITIES (' + broken.length + ' / ' + cities.length + '):');
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
