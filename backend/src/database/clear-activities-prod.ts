import { DataSource } from 'typeorm';
import * as dotenv from 'dotenv';

dotenv.config({ path: '.env.prod' });

const dataSource = new DataSource({
  type: 'postgres',
  url: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false,
  },
});

async function clear() {
  await dataSource.initialize();
  await dataSource.query('DELETE FROM city_activities');
  console.log('Cleared all city activities from production');
  await dataSource.destroy();
}

clear().catch(console.error);
