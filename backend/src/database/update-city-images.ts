import { DataSource } from 'typeorm';
import { City } from '../entities/city.entity';
import * as dotenv from 'dotenv';

dotenv.config({ path: process.env.ENV_FILE || '.env' });

// Helper to generate Unsplash URL (supports both full IDs and short slugs)
const unsplash = (photoId: string): string => {
  // Short slugs (like "59Al83Zjtf8") use source.unsplash.com
  if (photoId.length < 20) {
    return `https://source.unsplash.com/${photoId}/800x600`;
  }
  // Full IDs use images.unsplash.com
  return `https://images.unsplash.com/photo-${photoId}?w=800&q=80`;
};

// Cities to update with their new Unsplash photo IDs
const cityUpdates: Record<string, string> = {
  Kathmandu: '59Al83Zjtf8',
  Pokhara: '7cENZhgyf7c',
  Tirana: 'hYsQP88bMlo',
  'Andorra la Vella': 'txDX4b4n8AY',
  Innsbruck: '2V0EXtFqdJQ',
  Salzburg: 'Ig2cLTewvP4',
  Antwerp: 'DlTwjSIup0A',
  Brussels: 'm39OKAexaqo',
  Ghent: 'k1E6994P3t8',
  Bruges: '_BBlUZhRzjg',
};

const dbConfig = process.env.DATABASE_URL
  ? {
      type: 'postgres' as const,
      url: process.env.DATABASE_URL,
      entities: [City],
      ssl: { rejectUnauthorized: false },
    }
  : {
      type: 'postgres' as const,
      host: process.env.DB_HOST || 'localhost',
      port: parseInt(process.env.DB_PORT || '5432'),
      username: process.env.DB_USERNAME || 'postgres',
      password: process.env.DB_PASSWORD || 'password',
      database: process.env.DB_NAME || 'travel_wishlist',
      entities: [City],
    };

const dataSource = new DataSource(dbConfig);

async function updateCityImages() {
  try {
    await dataSource.initialize();
    console.log('Database connected');

    const cityRepository = dataSource.getRepository(City);

    for (const [cityName, photoId] of Object.entries(cityUpdates)) {
      const imageUrl = unsplash(photoId);

      const result = await cityRepository.update(
        { name: cityName },
        { imageUrl }
      );

      if (result.affected && result.affected > 0) {
        console.log(`Updated ${cityName}: ${imageUrl}`);
      } else {
        console.log(`City not found: ${cityName}`);
      }
    }

    console.log('City images updated successfully!');
  } catch (error) {
    console.error('Error updating city images:', error);
    process.exit(1);
  } finally {
    await dataSource.destroy();
  }
}

updateCityImages();
