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

interface UnsplashPhoto {
  id: string;
  urls: {
    raw: string;
    full: string;
    regular: string;
    small: string;
  };
}

interface UnsplashSearchResult {
  results: UnsplashPhoto[];
}

async function searchUnsplashAPI(query: string): Promise<string | null> {
  try {
    const searchTerm = encodeURIComponent(`${query} city`);
    const response = await fetch(
      `https://unsplash.com/napi/search/photos?query=${searchTerm}&per_page=1`,
      {
        headers: {
          'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36',
          'Accept': 'application/json',
        }
      }
    );

    if (!response.ok) {
      return null;
    }

    const data: UnsplashSearchResult = await response.json();
    if (data.results && data.results.length > 0) {
      // Return the regular sized URL directly - it's already verified to exist
      const regularUrl = data.results[0].urls.regular;
      // Simplify the URL to use standard format
      const baseUrl = regularUrl.split('?')[0];
      return `${baseUrl}?w=800&q=80`;
    }
    return null;
  } catch {
    return null;
  }
}

async function verifyImage(url: string): Promise<boolean> {
  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 5000);

    const res = await fetch(url, { method: 'HEAD', signal: controller.signal });
    clearTimeout(timeout);
    return res.ok;
  } catch {
    return false;
  }
}

async function fixDuplicates() {
  try {
    await dataSource.initialize();
    console.log('Database connected\n');

    const cityRepository = dataSource.getRepository(City);
    const cities = await cityRepository.find({ order: { name: 'ASC' } });

    // Group by image URL to find duplicates
    const urlGroups: Record<string, City[]> = {};
    for (const city of cities) {
      if (!urlGroups[city.imageUrl]) urlGroups[city.imageUrl] = [];
      urlGroups[city.imageUrl].push(city);
    }

    // Get cities that share images (skip first one, keep others)
    const citiesToFix: City[] = [];
    for (const [, cityList] of Object.entries(urlGroups)) {
      if (cityList.length > 1) {
        citiesToFix.push(...cityList.slice(1));
      }
    }

    console.log(
      `Found ${citiesToFix.length} cities with duplicate images to fix\n`,
    );

    let fixed = 0;
    let failed = 0;
    const failedCities: string[] = [];

    for (const city of citiesToFix) {
      const imageUrl = await searchUnsplashAPI(city.name);

      if (imageUrl) {
        // Check if valid
        const isValid = await verifyImage(imageUrl);

        if (isValid) {
          // Check if different from current
          if (city.imageUrl !== imageUrl) {
            await cityRepository.update({ id: city.id }, { imageUrl });
            console.log(`✅ ${city.name}`);
            fixed++;
          } else {
            console.log(`⏭️ ${city.name} (already has unique image)`);
          }
        } else {
          console.log(`❌ ${city.name}: invalid image`);
          failedCities.push(city.name);
          failed++;
        }
      } else {
        console.log(`⚠️ ${city.name}: no image found`);
        failedCities.push(city.name);
        failed++;
      }

      // Small delay to avoid rate limiting
      await new Promise(resolve => setTimeout(resolve, 300));
    }

    console.log(`\n============================`);
    console.log(`Fixed: ${fixed}`);
    console.log(`Failed: ${failed}`);
    console.log(`============================`);

    if (failedCities.length > 0) {
      console.log(`\nFailed cities: ${failedCities.join(', ')}`);
    }

  } catch (error) {
    console.error('Error:', error);
    process.exit(1);
  } finally {
    await dataSource.destroy();
  }
}

fixDuplicates();
2