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

async function checkCityImages() {
  try {
    await dataSource.initialize();
    console.log('Database connected\n');

    const cityRepository = dataSource.getRepository(City);
    const cities = await cityRepository.find({
      order: { name: 'ASC' },
    });

    console.log(`Checking ${cities.length} cities for broken images...\n`);

    const brokenImages: { name: string; imageUrl: string; status: number | string }[] = [];

    for (const city of cities) {
      if (!city.imageUrl) {
        brokenImages.push({ name: city.name, imageUrl: 'NO IMAGE URL', status: 'missing' });
        continue;
      }

      try {
        const response = await fetch(city.imageUrl, { method: 'HEAD' });
        if (!response.ok) {
          brokenImages.push({ name: city.name, imageUrl: city.imageUrl, status: response.status });
          console.log(`❌ ${city.name}: ${response.status}`);
        } else {
          // Check if it's a redirect to error page
          const finalUrl = response.url;
          if (finalUrl.includes('source-404') || finalUrl.includes('error')) {
            brokenImages.push({ name: city.name, imageUrl: city.imageUrl, status: 'redirect-error' });
            console.log(`❌ ${city.name}: redirects to error`);
          }
        }
      } catch (error) {
        brokenImages.push({ name: city.name, imageUrl: city.imageUrl, status: 'fetch-error' });
        console.log(`❌ ${city.name}: fetch error`);
      }
    }

    console.log('\n========================================');
    console.log(`Total cities: ${cities.length}`);
    console.log(`Broken images: ${brokenImages.length}`);

    if (brokenImages.length > 0) {
      console.log('\nBroken images list:');
      for (const broken of brokenImages) {
        console.log(`- ${broken.name}: ${broken.status}`);
        console.log(`  URL: ${broken.imageUrl}`);
      }
    } else {
      console.log('\n✅ All city images are working!');
    }

  } catch (error) {
    console.error('Error checking city images:', error);
    process.exit(1);
  } finally {
    await dataSource.destroy();
  }
}

checkCityImages();
