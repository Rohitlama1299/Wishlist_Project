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

// Generate a unique Unsplash URL using city name as search term
function getUnsplashUrl(cityName: string, seed: number): string {
  // Use source.unsplash.com with city name for relevant images
  const query = encodeURIComponent(cityName + ' city');
  return `https://source.unsplash.com/800x600/?${query}&sig=${seed}`;
}

async function checkImage(url: string): Promise<boolean> {
  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 5000);

    const res = await fetch(url, {
      method: 'HEAD',
      signal: controller.signal
    });

    clearTimeout(timeout);
    return res.ok;
  } catch {
    return false;
  }
}

async function fixBrokenImages() {
  try {
    await dataSource.initialize();
    console.log('Database connected\n');

    const cityRepository = dataSource.getRepository(City);
    const cities = await cityRepository.find({ order: { name: 'ASC' } });

    console.log('Checking ' + cities.length + ' cities...\n');

    let fixed = 0;
    let failed = 0;

    for (const city of cities) {
      const isWorking = city.imageUrl ? await checkImage(city.imageUrl) : false;

      if (!isWorking) {
        // Generate new URL using city name
        const newUrl = getUnsplashUrl(city.name, city.id);

        await cityRepository.update({ id: city.id }, { imageUrl: newUrl });
        console.log('Fixed: ' + city.name + ' -> ' + newUrl);
        fixed++;
      }
    }

    console.log('\n============================');
    console.log('Fixed ' + fixed + ' broken images');
    console.log('============================');

  } catch (error) {
    console.error('Error:', error);
    process.exit(1);
  } finally {
    await dataSource.destroy();
  }
}

fixBrokenImages();
