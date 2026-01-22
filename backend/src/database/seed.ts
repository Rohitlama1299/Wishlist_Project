import { DataSource } from 'typeorm';
import { Continent } from '../entities/continent.entity';
import { Country } from '../entities/country.entity';
import { City } from '../entities/city.entity';
import { User } from '../entities/user.entity';
import { Destination } from '../entities/destination.entity';
import { Photo } from '../entities/photo.entity';
import { Activity } from '../entities/activity.entity';
import * as dotenv from 'dotenv';

dotenv.config({ path: process.env.ENV_FILE || '.env' });

// Support both DATABASE_URL and individual variables
const dbConfig = process.env.DATABASE_URL
  ? {
      type: 'postgres' as const,
      url: process.env.DATABASE_URL,
      entities: [User, Continent, Country, City, Destination, Photo, Activity],
      synchronize: true,
      ssl: { rejectUnauthorized: false },
    }
  : {
      type: 'postgres' as const,
      host: process.env.DB_HOST || 'localhost',
      port: parseInt(process.env.DB_PORT || '5432'),
      username: process.env.DB_USERNAME || 'postgres',
      password: process.env.DB_PASSWORD || 'password',
      database: process.env.DB_NAME || 'travel_wishlist',
      entities: [User, Continent, Country, City, Destination, Photo, Activity],
      synchronize: true,
    };

const dataSource = new DataSource(dbConfig);

const continentsData = [
  { name: 'Africa', code: 'AF', imageUrl: 'https://images.unsplash.com/photo-1547471080-7cc2caa01a7e?w=800' },
  { name: 'Antarctica', code: 'AN', imageUrl: 'https://images.unsplash.com/photo-1551415923-a2297c7fda79?w=800' },
  { name: 'Asia', code: 'AS', imageUrl: 'https://images.unsplash.com/photo-1480796927426-f609979314bd?w=800' },
  { name: 'Europe', code: 'EU', imageUrl: 'https://images.unsplash.com/photo-1467269204594-9661b134dd2b?w=800' },
  { name: 'North America', code: 'NA', imageUrl: 'https://images.unsplash.com/photo-1485738422979-f5c462d49f74?w=800' },
  { name: 'Oceania', code: 'OC', imageUrl: 'https://images.unsplash.com/photo-1523482580672-f109ba8cb9be?w=800' },
  { name: 'South America', code: 'SA', imageUrl: 'https://images.unsplash.com/photo-1483729558449-99ef09a8c325?w=800' },
];

const countriesData = [
  // Africa (54 countries - major ones)
  { name: 'Algeria', code: 'DZ', continent: 'Africa' },
  { name: 'Angola', code: 'AO', continent: 'Africa' },
  { name: 'Botswana', code: 'BW', continent: 'Africa' },
  { name: 'Cameroon', code: 'CM', continent: 'Africa' },
  { name: 'Democratic Republic of Congo', code: 'CD', continent: 'Africa' },
  { name: 'Egypt', code: 'EG', continent: 'Africa' },
  { name: 'Ethiopia', code: 'ET', continent: 'Africa' },
  { name: 'Ghana', code: 'GH', continent: 'Africa' },
  { name: 'Ivory Coast', code: 'CI', continent: 'Africa' },
  { name: 'Kenya', code: 'KE', continent: 'Africa' },
  { name: 'Madagascar', code: 'MG', continent: 'Africa' },
  { name: 'Mauritius', code: 'MU', continent: 'Africa' },
  { name: 'Morocco', code: 'MA', continent: 'Africa' },
  { name: 'Mozambique', code: 'MZ', continent: 'Africa' },
  { name: 'Namibia', code: 'NA', continent: 'Africa' },
  { name: 'Nigeria', code: 'NG', continent: 'Africa' },
  { name: 'Rwanda', code: 'RW', continent: 'Africa' },
  { name: 'Senegal', code: 'SN', continent: 'Africa' },
  { name: 'Seychelles', code: 'SC', continent: 'Africa' },
  { name: 'South Africa', code: 'ZA', continent: 'Africa' },
  { name: 'Tanzania', code: 'TZ', continent: 'Africa' },
  { name: 'Tunisia', code: 'TN', continent: 'Africa' },
  { name: 'Uganda', code: 'UG', continent: 'Africa' },
  { name: 'Zambia', code: 'ZM', continent: 'Africa' },
  { name: 'Zimbabwe', code: 'ZW', continent: 'Africa' },

  // Asia (48 countries - major ones)
  { name: 'Bangladesh', code: 'BD', continent: 'Asia' },
  { name: 'Bhutan', code: 'BT', continent: 'Asia' },
  { name: 'Brunei', code: 'BN', continent: 'Asia' },
  { name: 'Cambodia', code: 'KH', continent: 'Asia' },
  { name: 'China', code: 'CN', continent: 'Asia' },
  { name: 'Hong Kong', code: 'HK', continent: 'Asia' },
  { name: 'India', code: 'IN', continent: 'Asia' },
  { name: 'Indonesia', code: 'ID', continent: 'Asia' },
  { name: 'Israel', code: 'IL', continent: 'Asia' },
  { name: 'Japan', code: 'JP', continent: 'Asia' },
  { name: 'Jordan', code: 'JO', continent: 'Asia' },
  { name: 'Kazakhstan', code: 'KZ', continent: 'Asia' },
  { name: 'Kuwait', code: 'KW', continent: 'Asia' },
  { name: 'Kyrgyzstan', code: 'KG', continent: 'Asia' },
  { name: 'Laos', code: 'LA', continent: 'Asia' },
  { name: 'Lebanon', code: 'LB', continent: 'Asia' },
  { name: 'Macau', code: 'MO', continent: 'Asia' },
  { name: 'Malaysia', code: 'MY', continent: 'Asia' },
  { name: 'Maldives', code: 'MV', continent: 'Asia' },
  { name: 'Mongolia', code: 'MN', continent: 'Asia' },
  { name: 'Myanmar', code: 'MM', continent: 'Asia' },
  { name: 'Nepal', code: 'NP', continent: 'Asia' },
  { name: 'Oman', code: 'OM', continent: 'Asia' },
  { name: 'Pakistan', code: 'PK', continent: 'Asia' },
  { name: 'Philippines', code: 'PH', continent: 'Asia' },
  { name: 'Qatar', code: 'QA', continent: 'Asia' },
  { name: 'Saudi Arabia', code: 'SA', continent: 'Asia' },
  { name: 'Singapore', code: 'SG', continent: 'Asia' },
  { name: 'South Korea', code: 'KR', continent: 'Asia' },
  { name: 'Sri Lanka', code: 'LK', continent: 'Asia' },
  { name: 'Taiwan', code: 'TW', continent: 'Asia' },
  { name: 'Thailand', code: 'TH', continent: 'Asia' },
  { name: 'Turkey', code: 'TR', continent: 'Asia' },
  { name: 'United Arab Emirates', code: 'AE', continent: 'Asia' },
  { name: 'Uzbekistan', code: 'UZ', continent: 'Asia' },
  { name: 'Vietnam', code: 'VN', continent: 'Asia' },

  // Europe (44 countries)
  { name: 'Albania', code: 'AL', continent: 'Europe' },
  { name: 'Andorra', code: 'AD', continent: 'Europe' },
  { name: 'Austria', code: 'AT', continent: 'Europe' },
  { name: 'Belarus', code: 'BY', continent: 'Europe' },
  { name: 'Belgium', code: 'BE', continent: 'Europe' },
  { name: 'Bosnia and Herzegovina', code: 'BA', continent: 'Europe' },
  { name: 'Bulgaria', code: 'BG', continent: 'Europe' },
  { name: 'Croatia', code: 'HR', continent: 'Europe' },
  { name: 'Cyprus', code: 'CY', continent: 'Europe' },
  { name: 'Czech Republic', code: 'CZ', continent: 'Europe' },
  { name: 'Denmark', code: 'DK', continent: 'Europe' },
  { name: 'Estonia', code: 'EE', continent: 'Europe' },
  { name: 'Finland', code: 'FI', continent: 'Europe' },
  { name: 'France', code: 'FR', continent: 'Europe' },
  { name: 'Germany', code: 'DE', continent: 'Europe' },
  { name: 'Greece', code: 'GR', continent: 'Europe' },
  { name: 'Hungary', code: 'HU', continent: 'Europe' },
  { name: 'Iceland', code: 'IS', continent: 'Europe' },
  { name: 'Ireland', code: 'IE', continent: 'Europe' },
  { name: 'Italy', code: 'IT', continent: 'Europe' },
  { name: 'Latvia', code: 'LV', continent: 'Europe' },
  { name: 'Lithuania', code: 'LT', continent: 'Europe' },
  { name: 'Luxembourg', code: 'LU', continent: 'Europe' },
  { name: 'Malta', code: 'MT', continent: 'Europe' },
  { name: 'Monaco', code: 'MC', continent: 'Europe' },
  { name: 'Montenegro', code: 'ME', continent: 'Europe' },
  { name: 'Netherlands', code: 'NL', continent: 'Europe' },
  { name: 'North Macedonia', code: 'MK', continent: 'Europe' },
  { name: 'Norway', code: 'NO', continent: 'Europe' },
  { name: 'Poland', code: 'PL', continent: 'Europe' },
  { name: 'Portugal', code: 'PT', continent: 'Europe' },
  { name: 'Romania', code: 'RO', continent: 'Europe' },
  { name: 'Russia', code: 'RU', continent: 'Europe' },
  { name: 'Serbia', code: 'RS', continent: 'Europe' },
  { name: 'Slovakia', code: 'SK', continent: 'Europe' },
  { name: 'Slovenia', code: 'SI', continent: 'Europe' },
  { name: 'Spain', code: 'ES', continent: 'Europe' },
  { name: 'Sweden', code: 'SE', continent: 'Europe' },
  { name: 'Switzerland', code: 'CH', continent: 'Europe' },
  { name: 'Ukraine', code: 'UA', continent: 'Europe' },
  { name: 'United Kingdom', code: 'GB', continent: 'Europe' },

  // North America (23 countries)
  { name: 'Bahamas', code: 'BS', continent: 'North America' },
  { name: 'Barbados', code: 'BB', continent: 'North America' },
  { name: 'Belize', code: 'BZ', continent: 'North America' },
  { name: 'Canada', code: 'CA', continent: 'North America' },
  { name: 'Costa Rica', code: 'CR', continent: 'North America' },
  { name: 'Cuba', code: 'CU', continent: 'North America' },
  { name: 'Dominican Republic', code: 'DO', continent: 'North America' },
  { name: 'El Salvador', code: 'SV', continent: 'North America' },
  { name: 'Guatemala', code: 'GT', continent: 'North America' },
  { name: 'Haiti', code: 'HT', continent: 'North America' },
  { name: 'Honduras', code: 'HN', continent: 'North America' },
  { name: 'Jamaica', code: 'JM', continent: 'North America' },
  { name: 'Mexico', code: 'MX', continent: 'North America' },
  { name: 'Nicaragua', code: 'NI', continent: 'North America' },
  { name: 'Panama', code: 'PA', continent: 'North America' },
  { name: 'Puerto Rico', code: 'PR', continent: 'North America' },
  { name: 'Trinidad and Tobago', code: 'TT', continent: 'North America' },
  { name: 'United States', code: 'US', continent: 'North America' },

  // South America (12 countries)
  { name: 'Argentina', code: 'AR', continent: 'South America' },
  { name: 'Bolivia', code: 'BO', continent: 'South America' },
  { name: 'Brazil', code: 'BR', continent: 'South America' },
  { name: 'Chile', code: 'CL', continent: 'South America' },
  { name: 'Colombia', code: 'CO', continent: 'South America' },
  { name: 'Ecuador', code: 'EC', continent: 'South America' },
  { name: 'Guyana', code: 'GY', continent: 'South America' },
  { name: 'Paraguay', code: 'PY', continent: 'South America' },
  { name: 'Peru', code: 'PE', continent: 'South America' },
  { name: 'Suriname', code: 'SR', continent: 'South America' },
  { name: 'Uruguay', code: 'UY', continent: 'South America' },
  { name: 'Venezuela', code: 'VE', continent: 'South America' },

  // Oceania (14 countries)
  { name: 'Australia', code: 'AU', continent: 'Oceania' },
  { name: 'Fiji', code: 'FJ', continent: 'Oceania' },
  { name: 'French Polynesia', code: 'PF', continent: 'Oceania' },
  { name: 'Guam', code: 'GU', continent: 'Oceania' },
  { name: 'Kiribati', code: 'KI', continent: 'Oceania' },
  { name: 'New Caledonia', code: 'NC', continent: 'Oceania' },
  { name: 'New Zealand', code: 'NZ', continent: 'Oceania' },
  { name: 'Palau', code: 'PW', continent: 'Oceania' },
  { name: 'Papua New Guinea', code: 'PG', continent: 'Oceania' },
  { name: 'Samoa', code: 'WS', continent: 'Oceania' },
  { name: 'Solomon Islands', code: 'SB', continent: 'Oceania' },
  { name: 'Tonga', code: 'TO', continent: 'Oceania' },
  { name: 'Vanuatu', code: 'VU', continent: 'Oceania' },
];

// City images mapping
// Default images by continent for cities without specific images
const continentDefaultImages: Record<string, string> = {
  'Africa': 'https://images.unsplash.com/photo-1547471080-7cc2caa01a7e?w=800',
  'Antarctica': 'https://images.unsplash.com/photo-1551415923-a2297c7fda79?w=800',
  'Asia': 'https://images.unsplash.com/photo-1480796927426-f609979314bd?w=800',
  'Europe': 'https://images.unsplash.com/photo-1467269204594-9661b134dd2b?w=800',
  'North America': 'https://images.unsplash.com/photo-1485738422979-f5c462d49f74?w=800',
  'Oceania': 'https://images.unsplash.com/photo-1523482580672-f109ba8cb9be?w=800',
  'South America': 'https://images.unsplash.com/photo-1483729558449-99ef09a8c325?w=800',
};

const cityImages: Record<string, string> = {
  // ==================== AFRICA ====================
  // Algeria
  'Algiers': 'https://images.unsplash.com/photo-1597923452627-0ec0c93c8ffa?w=800',
  'Oran': 'https://images.unsplash.com/photo-1583430999920-8c5c9e8e2c3d?w=800',
  // Angola
  'Luanda': 'https://images.unsplash.com/photo-1611348524140-53c9a25263d6?w=800',
  // Botswana
  'Gaborone': 'https://images.unsplash.com/photo-1516026672322-bc52d61a55d5?w=800',
  // Cameroon
  'Douala': 'https://images.unsplash.com/photo-1489749798305-4fea3ae63d43?w=800',
  'Yaounde': 'https://images.unsplash.com/photo-1591033594798-33227a05780d?w=800',
  // Democratic Republic of Congo
  'Kinshasa': 'https://images.unsplash.com/photo-1580746738099-6c278ecb5c93?w=800',
  // Egypt
  'Cairo': 'https://images.unsplash.com/photo-1572252009286-268acec5ca0a?w=800',
  'Alexandria': 'https://images.unsplash.com/photo-1568322503251-71dae83c0a77?w=800',
  'Luxor': 'https://images.unsplash.com/photo-1539650116574-8efeb43e2750?w=800',
  'Sharm El Sheikh': 'https://images.unsplash.com/photo-1565073624497-7144969d0a07?w=800',
  'Hurghada': 'https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=800',
  'Aswan': 'https://images.unsplash.com/photo-1568322445389-f64ac2515020?w=800',
  // Ethiopia
  'Addis Ababa': 'https://images.unsplash.com/photo-1575997033949-06cf9e6e44d6?w=800',
  // Ghana
  'Accra': 'https://images.unsplash.com/photo-1567789884554-0b844b597180?w=800',
  'Kumasi': 'https://images.unsplash.com/photo-1572466993682-b7c2b08e2fd2?w=800',
  // Ivory Coast
  'Abidjan': 'https://images.unsplash.com/photo-1605745341112-85968b19335b?w=800',
  // Kenya
  'Nairobi': 'https://images.unsplash.com/photo-1523805009345-7448845a9e53?w=800',
  'Mombasa': 'https://images.unsplash.com/photo-1596005554384-d293674c91d7?w=800',
  'Maasai Mara': 'https://images.unsplash.com/photo-1547471080-7cc2caa01a7e?w=800',
  // Madagascar
  'Antananarivo': 'https://images.unsplash.com/photo-1580060839134-75a5edca2e99?w=800',
  // Mauritius
  'Port Louis': 'https://images.unsplash.com/photo-1585220483039-8c65ad1c9f3b?w=800',
  // Morocco
  'Marrakech': 'https://images.unsplash.com/photo-1597212618440-806262de4f6b?w=800',
  'Fes': 'https://images.unsplash.com/photo-1549140600-78c9b8275e9d?w=800',
  'Casablanca': 'https://images.unsplash.com/photo-1569383746724-6f1b882b8f46?w=800',
  'Chefchaouen': 'https://images.unsplash.com/photo-1553244370-c65c6a7e8d1e?w=800',
  'Tangier': 'https://images.unsplash.com/photo-1563889362352-b0497f8dbf58?w=800',
  'Rabat': 'https://images.unsplash.com/photo-1569231282047-f9c6a9c6c970?w=800',
  // Mozambique
  'Maputo': 'https://images.unsplash.com/photo-1523805009345-7448845a9e53?w=800',
  // Namibia
  'Windhoek': 'https://images.unsplash.com/photo-1534430480872-3498386e7856?w=800',
  'Swakopmund': 'https://images.unsplash.com/photo-1504195229432-17fe0e5d52e5?w=800',
  // Nigeria
  'Lagos': 'https://images.unsplash.com/photo-1618828665011-0abd973f7bb8?w=800',
  'Abuja': 'https://images.unsplash.com/photo-1618828665011-0abd973f7bb8?w=800',
  // Rwanda
  'Kigali': 'https://images.unsplash.com/photo-1612442443385-48c8e4d8b38e?w=800',
  // Senegal
  'Dakar': 'https://images.unsplash.com/photo-1576485375217-d6a95e34d043?w=800',
  // Seychelles
  'Victoria': 'https://images.unsplash.com/photo-1589979481223-deb893043163?w=800',
  // South Africa
  'Cape Town': 'https://images.unsplash.com/photo-1580060839134-75a5edca2e99?w=800',
  'Johannesburg': 'https://images.unsplash.com/photo-1577608837584-ab6e9a3c1d20?w=800',
  'Durban': 'https://images.unsplash.com/photo-1588364797399-c3bbfc77f673?w=800',
  'Pretoria': 'https://images.unsplash.com/photo-1598977054780-7e9c5e2f1e4e?w=800',
  'Kruger National Park': 'https://images.unsplash.com/photo-1547970810-dc1eac37d174?w=800',
  // Tanzania
  'Dar es Salaam': 'https://images.unsplash.com/photo-1541426003909-9a0e9b8dc696?w=800',
  'Zanzibar City': 'https://images.unsplash.com/photo-1586861203927-800a5acdcc4d?w=800',
  'Serengeti': 'https://images.unsplash.com/photo-1516426122078-c23e76319801?w=800',
  'Arusha': 'https://images.unsplash.com/photo-1489392191049-fc10c97e64b6?w=800',
  // Tunisia
  'Tunis': 'https://images.unsplash.com/photo-1590587808110-5c77b35c8bff?w=800',
  // Uganda
  'Kampala': 'https://images.unsplash.com/photo-1585686556759-d2929a1fea25?w=800',
  // Zambia
  'Lusaka': 'https://images.unsplash.com/photo-1547471080-7cc2caa01a7e?w=800',
  'Victoria Falls': 'https://images.unsplash.com/photo-1568625502763-2a5ec6a94c47?w=800',
  // Zimbabwe
  'Harare': 'https://images.unsplash.com/photo-1601587093442-c1c70c90c4b0?w=800',

  // ==================== ASIA ====================
  // Bangladesh
  'Dhaka': 'https://images.unsplash.com/photo-1588416936097-41850ab3d86d?w=800',
  // Bhutan
  'Thimphu': 'https://images.unsplash.com/photo-1609766856923-7e0a0c06d5d9?w=800',
  'Paro': 'https://images.unsplash.com/photo-1553856622-d1b352e9a211?w=800',
  // Brunei
  'Bandar Seri Begawan': 'https://images.unsplash.com/photo-1597435877651-86f5c1b0e5f5?w=800',
  // Cambodia
  'Phnom Penh': 'https://images.unsplash.com/photo-1562602833-0f4ab2fc46e5?w=800',
  'Siem Reap': 'https://images.unsplash.com/photo-1600589336403-1c2a2c15a95d?w=800',
  // China
  'Beijing': 'https://images.unsplash.com/photo-1508804185872-d7badad00f7d?w=800',
  'Shanghai': 'https://images.unsplash.com/photo-1474181487882-5abf3f0ba6c2?w=800',
  'Guangzhou': 'https://images.unsplash.com/photo-1578632767115-351597cf2477?w=800',
  'Shenzhen': 'https://images.unsplash.com/photo-1533659124865-d6072dc035e1?w=800',
  'Chengdu': 'https://images.unsplash.com/photo-1533638431697-a6b18d41dd3c?w=800',
  "Xi'an": 'https://images.unsplash.com/photo-1527838832700-5059252407fa?w=800',
  'Hangzhou': 'https://images.unsplash.com/photo-1508739773434-c26b3d09e071?w=800',
  'Guilin': 'https://images.unsplash.com/photo-1529921879218-f4cde0cae893?w=800',
  // Hong Kong
  'Hong Kong': 'https://images.unsplash.com/photo-1536599018102-9f803c140fc1?w=800',
  'Kowloon': 'https://images.unsplash.com/photo-1563600893-b68e82f82da4?w=800',
  // India
  'New Delhi': 'https://images.unsplash.com/photo-1587474260584-136574528ed5?w=800',
  'Mumbai': 'https://images.unsplash.com/photo-1570168007204-dfb528c6958f?w=800',
  'Jaipur': 'https://images.unsplash.com/photo-1599661046289-e31897846e41?w=800',
  'Agra': 'https://images.unsplash.com/photo-1564507592333-c60657eea523?w=800',
  'Varanasi': 'https://images.unsplash.com/photo-1561361513-2d000a50f0dc?w=800',
  'Goa': 'https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?w=800',
  'Bangalore': 'https://images.unsplash.com/photo-1596176530529-78163a4f7af2?w=800',
  'Kerala': 'https://images.unsplash.com/photo-1602216056096-3b40cc0c9944?w=800',
  'Udaipur': 'https://images.unsplash.com/photo-1568495248636-6432b97bd949?w=800',
  'Kolkata': 'https://images.unsplash.com/photo-1558431382-27e303142255?w=800',
  // Indonesia
  'Jakarta': 'https://images.unsplash.com/photo-1555899434-94d1368aa7af?w=800',
  'Bali': 'https://images.unsplash.com/photo-1537996194471-e657df975ab4?w=800',
  'Yogyakarta': 'https://images.unsplash.com/photo-1584810359583-96fc3448beaa?w=800',
  'Lombok': 'https://images.unsplash.com/photo-1570789210967-2cac24ba74ff?w=800',
  'Komodo': 'https://images.unsplash.com/photo-1570099829470-a0e64e0c8ebe?w=800',
  // Israel
  'Tel Aviv': 'https://images.unsplash.com/photo-1538970272646-f61fabb3a8a2?w=800',
  'Jerusalem': 'https://images.unsplash.com/photo-1544991875-5dc1b05f607d?w=800',
  // Japan
  'Tokyo': 'https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?w=800',
  'Kyoto': 'https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?w=800',
  'Osaka': 'https://images.unsplash.com/photo-1590559899731-a382839e5549?w=800',
  'Hiroshima': 'https://images.unsplash.com/photo-1576153192281-7f4f9bebb6a6?w=800',
  'Nara': 'https://images.unsplash.com/photo-1624253321171-1be53e12f5f4?w=800',
  'Hakone': 'https://images.unsplash.com/photo-1570459027562-4a916cc6113f?w=800',
  'Sapporo': 'https://images.unsplash.com/photo-1583159459377-55e42c4b3b1c?w=800',
  'Fukuoka': 'https://images.unsplash.com/photo-1601042879364-f3947d3f9c16?w=800',
  'Okinawa': 'https://images.unsplash.com/photo-1590253230532-a67f6bc61c9e?w=800',
  // Jordan
  'Amman': 'https://images.unsplash.com/photo-1558998708-ed126bc1f014?w=800',
  'Petra': 'https://images.unsplash.com/photo-1579606032821-4e6161c81571?w=800',
  // Kazakhstan
  'Almaty': 'https://images.unsplash.com/photo-1563594256022-27d9f4c6f50a?w=800',
  'Astana': 'https://images.unsplash.com/photo-1590064661284-4f7df61c2c9f?w=800',
  // Kuwait
  'Kuwait City': 'https://images.unsplash.com/photo-1575986767340-5d17ae767ab0?w=800',
  // Kyrgyzstan
  'Bishkek': 'https://images.unsplash.com/photo-1590059802772-1bfb2e02d6d0?w=800',
  // Laos
  'Vientiane': 'https://images.unsplash.com/photo-1582654454409-778f6619ddc6?w=800',
  'Luang Prabang': 'https://images.unsplash.com/photo-1539186607619-df476afe6ff1?w=800',
  // Lebanon
  'Beirut': 'https://images.unsplash.com/photo-1579042035939-54a2ed5d4dfe?w=800',
  // Macau
  'Macau': 'https://images.unsplash.com/photo-1544979093-d40e81e3c92a?w=800',
  // Malaysia
  'Kuala Lumpur': 'https://images.unsplash.com/photo-1596422846543-75c6fc197f07?w=800',
  'Penang': 'https://images.unsplash.com/photo-1571818717979-d77a3f91d708?w=800',
  'Langkawi': 'https://images.unsplash.com/photo-1596413959206-1e37e61e044f?w=800',
  'Malacca': 'https://images.unsplash.com/photo-1595435934249-5df7ed86e1c0?w=800',
  'Kota Kinabalu': 'https://images.unsplash.com/photo-1543731068-7e0f5beff43a?w=800',
  // Maldives
  'Male': 'https://images.unsplash.com/photo-1514282401047-d79a71a590e8?w=800',
  // Mongolia
  'Ulaanbaatar': 'https://images.unsplash.com/photo-1579021465426-f3bf16e5a8f4?w=800',
  // Myanmar
  'Yangon': 'https://images.unsplash.com/photo-1535181702654-c9d4bedc4e0d?w=800',
  'Bagan': 'https://images.unsplash.com/photo-1570432000868-3bc22abc7e57?w=800',
  // Nepal
  'Kathmandu': 'https://images.unsplash.com/photo-1558799401-1dcba79e2c8b?w=800',
  'Pokhara': 'https://images.unsplash.com/photo-1605640840605-14ac1855827b?w=800',
  // Oman
  'Muscat': 'https://images.unsplash.com/photo-1569551024587-c4c755ca9f6b?w=800',
  // Pakistan
  'Islamabad': 'https://images.unsplash.com/photo-1566552881560-0be862a7c445?w=800',
  'Lahore': 'https://images.unsplash.com/photo-1570536147811-0a769eb58fe7?w=800',
  'Karachi': 'https://images.unsplash.com/photo-1570481662006-a3a1374699e8?w=800',
  // Philippines
  'Manila': 'https://images.unsplash.com/photo-1573832541190-205ad5d5fca5?w=800',
  'Cebu': 'https://images.unsplash.com/photo-1530595467537-0b5996c41f2d?w=800',
  'Boracay': 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=800',
  'Palawan': 'https://images.unsplash.com/photo-1518509562904-e7ef99cdcc86?w=800',
  // Qatar
  'Doha': 'https://images.unsplash.com/photo-1572252821143-035a024857ac?w=800',
  // Saudi Arabia
  'Riyadh': 'https://images.unsplash.com/photo-1586724237569-f3d0c1dee8c6?w=800',
  'Jeddah': 'https://images.unsplash.com/photo-1578895101408-1a36b834405b?w=800',
  'Mecca': 'https://images.unsplash.com/photo-1591604129939-f1efa4d9f7fa?w=800',
  // Singapore
  'Singapore': 'https://images.unsplash.com/photo-1525625293386-3f8f99389edd?w=800',
  // South Korea
  'Seoul': 'https://images.unsplash.com/photo-1538485399081-7191377e8241?w=800',
  'Busan': 'https://images.unsplash.com/photo-1578037571214-25e07a2d91f0?w=800',
  'Jeju Island': 'https://images.unsplash.com/photo-1579880674494-ef6bdcb93e0d?w=800',
  // Sri Lanka
  'Colombo': 'https://images.unsplash.com/photo-1576423170493-fcc8bb7f29b3?w=800',
  'Kandy': 'https://images.unsplash.com/photo-1580893246395-52aead8960dc?w=800',
  'Galle': 'https://images.unsplash.com/photo-1583087253076-5765203a6a84?w=800',
  // Taiwan
  'Taipei': 'https://images.unsplash.com/photo-1517030330234-94c4fb948ebc?w=800',
  'Kaohsiung': 'https://images.unsplash.com/photo-1595684746684-1f8a8d0d4f98?w=800',
  // Thailand
  'Bangkok': 'https://images.unsplash.com/photo-1508009603885-50cf7c579365?w=800',
  'Chiang Mai': 'https://images.unsplash.com/photo-1528181304800-259b08848526?w=800',
  'Phuket': 'https://images.unsplash.com/photo-1589394815804-964ed0be2eb5?w=800',
  'Krabi': 'https://images.unsplash.com/photo-1552465011-b4e21bf6e79a?w=800',
  'Koh Samui': 'https://images.unsplash.com/photo-1552733407-5d5c46c3bb3b?w=800',
  'Pattaya': 'https://images.unsplash.com/photo-1556215085-03b4443bb2b3?w=800',
  // Turkey
  'Istanbul': 'https://images.unsplash.com/photo-1541432901042-2d8bd64b4a9b?w=800',
  'Cappadocia': 'https://images.unsplash.com/photo-1641128324972-af3212f0f6bd?w=800',
  'Antalya': 'https://images.unsplash.com/photo-1593238739364-18cfde986823?w=800',
  'Bodrum': 'https://images.unsplash.com/photo-1614953621836-db30e3f7b2b0?w=800',
  'Pamukkale': 'https://images.unsplash.com/photo-1566071424727-12b1c7472d9e?w=800',
  // United Arab Emirates
  'Dubai': 'https://images.unsplash.com/photo-1512453979798-5ea266f8880c?w=800',
  'Abu Dhabi': 'https://images.unsplash.com/photo-1512632578888-169bbbc64f33?w=800',
  'Sharjah': 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=800',
  // Uzbekistan
  'Tashkent': 'https://images.unsplash.com/photo-1603893575234-e0f94f5a7375?w=800',
  'Samarkand': 'https://images.unsplash.com/photo-1596484552834-6a58f850e0a1?w=800',
  // Vietnam
  'Hanoi': 'https://images.unsplash.com/photo-1569596082827-c8265e5b0d74?w=800',
  'Ho Chi Minh City': 'https://images.unsplash.com/photo-1558334467-7f6fb9e8a209?w=800',
  'Da Nang': 'https://images.unsplash.com/photo-1559592413-7cec4d0cae2b?w=800',
  'Hoi An': 'https://images.unsplash.com/photo-1533760881669-80db4d7b341f?w=800',
  'Ha Long Bay': 'https://images.unsplash.com/photo-1528127269322-539801943592?w=800',
  'Nha Trang': 'https://images.unsplash.com/photo-1573790387438-4da905039392?w=800',

  // ==================== EUROPE ====================
  // Albania
  'Tirana': 'https://images.unsplash.com/photo-1578324113339-f41b0dc5ca76?w=800',
  // Andorra
  'Andorra la Vella': 'https://images.unsplash.com/photo-1574950578143-858c6fc58922?w=800',
  // Austria
  'Vienna': 'https://images.unsplash.com/photo-1516550893923-42d28e5677af?w=800',
  'Salzburg': 'https://images.unsplash.com/photo-1529677120457-e85fc4cc0ea3?w=800',
  'Innsbruck': 'https://images.unsplash.com/photo-1567096101942-50f0a65384a5?w=800',
  // Belarus
  'Minsk': 'https://images.unsplash.com/photo-1585213132256-4e1a3a02f809?w=800',
  // Belgium
  'Brussels': 'https://images.unsplash.com/photo-1559113202-c916b8e44373?w=800',
  'Bruges': 'https://images.unsplash.com/photo-1491557345352-5929e343eb89?w=800',
  'Antwerp': 'https://images.unsplash.com/photo-1612178991541-b48cc8e92a4d?w=800',
  'Ghent': 'https://images.unsplash.com/photo-1555992828-ca4dbe41d294?w=800',
  // Bosnia and Herzegovina
  'Sarajevo': 'https://images.unsplash.com/photo-1586788680434-30d324b2d46f?w=800',
  'Mostar': 'https://images.unsplash.com/photo-1577453686889-89ea6c4ae1bc?w=800',
  // Bulgaria
  'Sofia': 'https://images.unsplash.com/photo-1558098329-a11cff621064?w=800',
  // Croatia
  'Zagreb': 'https://images.unsplash.com/photo-1562842894-98dd00fe3d97?w=800',
  'Dubrovnik': 'https://images.unsplash.com/photo-1580502304784-8985b7eb7260?w=800',
  'Split': 'https://images.unsplash.com/photo-1559578451-ab4da3a19c55?w=800',
  'Plitvice Lakes': 'https://images.unsplash.com/photo-1558271736-cd043ef2e855?w=800',
  // Cyprus
  'Nicosia': 'https://images.unsplash.com/photo-1569248234642-0d18af4cfbbe?w=800',
  'Limassol': 'https://images.unsplash.com/photo-1558704155-82aa9b14bde6?w=800',
  // Czech Republic
  'Prague': 'https://images.unsplash.com/photo-1519677100203-a0e668c92439?w=800',
  'Cesky Krumlov': 'https://images.unsplash.com/photo-1560427000-e70a23a1c5fd?w=800',
  'Brno': 'https://images.unsplash.com/photo-1600096194534-95cf5ece04cf?w=800',
  // Denmark
  'Copenhagen': 'https://images.unsplash.com/photo-1513622470522-26c3c8a854bc?w=800',
  // Estonia
  'Tallinn': 'https://images.unsplash.com/photo-1565008576549-57569a49371d?w=800',
  // Finland
  'Helsinki': 'https://images.unsplash.com/photo-1538332576228-eb5b4c4de6f5?w=800',
  'Rovaniemi': 'https://images.unsplash.com/photo-1548524233-5dc4d6ad1acf?w=800',
  // France
  'Paris': 'https://images.unsplash.com/photo-1502602898657-3e91760cbb34?w=800',
  'Nice': 'https://images.unsplash.com/photo-1491166617655-0723a0999cfc?w=800',
  'Lyon': 'https://images.unsplash.com/photo-1524397057410-1e775ed476f3?w=800',
  'Marseille': 'https://images.unsplash.com/photo-1553959833-8b69b3df8a9e?w=800',
  'Bordeaux': 'https://images.unsplash.com/photo-1558175776-48c0af4f7b08?w=800',
  'Strasbourg': 'https://images.unsplash.com/photo-1556445519-c9a96f7ea0a1?w=800',
  'Cannes': 'https://images.unsplash.com/photo-1563207153-f403bf289096?w=800',
  'Monaco': 'https://images.unsplash.com/photo-1559098840-167e9d822f1f?w=800',
  // Germany
  'Berlin': 'https://images.unsplash.com/photo-1560969184-10fe8719e047?w=800',
  'Munich': 'https://images.unsplash.com/photo-1595867675579-0f2f49266f22?w=800',
  'Hamburg': 'https://images.unsplash.com/photo-1566567124154-aa56e6fb1a8e?w=800',
  'Frankfurt': 'https://images.unsplash.com/photo-1566843970834-2a9a4bf70d87?w=800',
  'Cologne': 'https://images.unsplash.com/photo-1515091943-9d5c0ad475af?w=800',
  'Dresden': 'https://images.unsplash.com/photo-1568994979073-c68b723e5e36?w=800',
  'Heidelberg': 'https://images.unsplash.com/photo-1590149570235-8a0ad217c1c9?w=800',
  // Greece
  'Athens': 'https://images.unsplash.com/photo-1555993539-1732b0258235?w=800',
  'Santorini': 'https://images.unsplash.com/photo-1570077188670-e3a8d69ac5ff?w=800',
  'Mykonos': 'https://images.unsplash.com/photo-1601581875039-e899893d520c?w=800',
  'Crete': 'https://images.unsplash.com/photo-1580500378755-30f49d1dbc60?w=800',
  'Rhodes': 'https://images.unsplash.com/photo-1585409677983-0f6c41ca9c3b?w=800',
  'Corfu': 'https://images.unsplash.com/photo-1585494156145-1c60a4fe952b?w=800',
  // Hungary
  'Budapest': 'https://images.unsplash.com/photo-1549923746-c502d488b3ea?w=800',
  // Iceland
  'Reykjavik': 'https://images.unsplash.com/photo-1529963183134-61a90db47eaf?w=800',
  // Ireland
  'Dublin': 'https://images.unsplash.com/photo-1549918864-48ac978761a4?w=800',
  'Galway': 'https://images.unsplash.com/photo-1565879268199-d1f3b0b08c15?w=800',
  'Cork': 'https://images.unsplash.com/photo-1590736969955-71cc94901144?w=800',
  // Italy
  'Rome': 'https://images.unsplash.com/photo-1552832230-c0197dd311b5?w=800',
  'Venice': 'https://images.unsplash.com/photo-1514890547357-a9ee288728e0?w=800',
  'Florence': 'https://images.unsplash.com/photo-1543429258-49d2e2e0abed?w=800',
  'Milan': 'https://images.unsplash.com/photo-1520440229-6469a149ac59?w=800',
  'Naples': 'https://images.unsplash.com/photo-1534308983496-4fabb1a015ee?w=800',
  'Amalfi Coast': 'https://images.unsplash.com/photo-1537799943037-f5da89a65689?w=800',
  'Cinque Terre': 'https://images.unsplash.com/photo-1516483638261-f4dbaf036963?w=800',
  'Bologna': 'https://images.unsplash.com/photo-1570393080760-0a182b3b8406?w=800',
  'Tuscany': 'https://images.unsplash.com/photo-1541370976299-4d24ebbc9077?w=800',
  // Latvia
  'Riga': 'https://images.unsplash.com/photo-1520986606214-8b456906c813?w=800',
  // Lithuania
  'Vilnius': 'https://images.unsplash.com/photo-1562817369-81e5e4df2178?w=800',
  // Luxembourg
  'Luxembourg City': 'https://images.unsplash.com/photo-1535753496353-22e53ad49720?w=800',
  // Malta
  'Valletta': 'https://images.unsplash.com/photo-1519012667227-9edbd63e5d90?w=800',
  // Montenegro
  'Podgorica': 'https://images.unsplash.com/photo-1580820267682-426da823b514?w=800',
  'Kotor': 'https://images.unsplash.com/photo-1569154941061-e231b4725ef1?w=800',
  // Netherlands
  'Amsterdam': 'https://images.unsplash.com/photo-1534351590666-13e3e96b5017?w=800',
  'Rotterdam': 'https://images.unsplash.com/photo-1543168256-418811576931?w=800',
  'The Hague': 'https://images.unsplash.com/photo-1554168848-228a9233f7c6?w=800',
  // North Macedonia
  'Skopje': 'https://images.unsplash.com/photo-1560453017-5c5e1a5c10fa?w=800',
  // Norway
  'Oslo': 'https://images.unsplash.com/photo-1559029881-7cfd01bf8daa?w=800',
  'Bergen': 'https://images.unsplash.com/photo-1580017100384-91cf39c46e8b?w=800',
  'Tromso': 'https://images.unsplash.com/photo-1531366936337-7c912a4589a7?w=800',
  // Poland
  'Warsaw': 'https://images.unsplash.com/photo-1519197924294-4ba991a11128?w=800',
  'Krakow': 'https://images.unsplash.com/photo-1574714786203-d05a2fb65a47?w=800',
  'Gdansk': 'https://images.unsplash.com/photo-1560968408-2e586e07d4c0?w=800',
  'Wroclaw': 'https://images.unsplash.com/photo-1596472826197-37d3f60c28a7?w=800',
  // Portugal
  'Lisbon': 'https://images.unsplash.com/photo-1585208798174-6cedd86e019a?w=800',
  'Porto': 'https://images.unsplash.com/photo-1555881400-69c48f81c5ac?w=800',
  'Algarve': 'https://images.unsplash.com/photo-1583191873717-42f8d8e51c9d?w=800',
  'Madeira': 'https://images.unsplash.com/photo-1598971861713-54ad16a7e72e?w=800',
  // Romania
  'Bucharest': 'https://images.unsplash.com/photo-1584646098378-0874589d76b1?w=800',
  'Transylvania': 'https://images.unsplash.com/photo-1577531632716-1a0cdf25b19e?w=800',
  // Russia
  'Moscow': 'https://images.unsplash.com/photo-1513326738677-b964603b136d?w=800',
  'St. Petersburg': 'https://images.unsplash.com/photo-1556610961-2fecc5927173?w=800',
  // Serbia
  'Belgrade': 'https://images.unsplash.com/photo-1582029743813-0c8aa5a9a2e7?w=800',
  // Slovakia
  'Bratislava': 'https://images.unsplash.com/photo-1567525953852-ee4766c02189?w=800',
  // Slovenia
  'Ljubljana': 'https://images.unsplash.com/photo-1551867633-194f125bddfa?w=800',
  'Lake Bled': 'https://images.unsplash.com/photo-1583422409516-2895a77efded?w=800',
  // Spain
  'Madrid': 'https://images.unsplash.com/photo-1539037116277-4db20889f2d4?w=800',
  'Barcelona': 'https://images.unsplash.com/photo-1583422410115-c6ea09d0fc7d?w=800',
  'Seville': 'https://images.unsplash.com/photo-1515443961218-a51367888e4b?w=800',
  'Valencia': 'https://images.unsplash.com/photo-1599302592205-d7d683c83eea?w=800',
  'Granada': 'https://images.unsplash.com/photo-1558642452-9d2a7deb7f62?w=800',
  'Ibiza': 'https://images.unsplash.com/photo-1535622048012-e8fa53e21c86?w=800',
  'Mallorca': 'https://images.unsplash.com/photo-1570825296778-8b5d2c3e3f96?w=800',
  'San Sebastian': 'https://images.unsplash.com/photo-1558981033-0f0309284409?w=800',
  'Bilbao': 'https://images.unsplash.com/photo-1558019327-5bc7ea44f90c?w=800',
  // Sweden
  'Stockholm': 'https://images.unsplash.com/photo-1509356843151-3e7d96241e11?w=800',
  'Gothenburg': 'https://images.unsplash.com/photo-1580584592828-1b40fb717ff5?w=800',
  // Switzerland
  'Zurich': 'https://images.unsplash.com/photo-1515488764276-beab7607c1e6?w=800',
  'Geneva': 'https://images.unsplash.com/photo-1573108037329-37aa135a142e?w=800',
  'Lucerne': 'https://images.unsplash.com/photo-1551279077-04a4d8fa2db2?w=800',
  'Interlaken': 'https://images.unsplash.com/photo-1526711657229-e7e080ed7aa1?w=800',
  'Zermatt': 'https://images.unsplash.com/photo-1581882050674-4b694de5bb83?w=800',
  // Ukraine
  'Kyiv': 'https://images.unsplash.com/photo-1561542320-9a18cd340469?w=800',
  'Lviv': 'https://images.unsplash.com/photo-1564594736624-def7a10ab047?w=800',
  // United Kingdom
  'London': 'https://images.unsplash.com/photo-1513635269975-59663e0ac1ad?w=800',
  'Edinburgh': 'https://images.unsplash.com/photo-1486299267070-83823f5448dd?w=800',
  'Manchester': 'https://images.unsplash.com/photo-1564064213814-91f1ed2bf61c?w=800',
  'Liverpool': 'https://images.unsplash.com/photo-1566296333445-96c0dd82aedd?w=800',
  'Oxford': 'https://images.unsplash.com/photo-1570815210481-4f98c2f7da91?w=800',
  'Cambridge': 'https://images.unsplash.com/photo-1582719471384-894fbb16e074?w=800',
  'Bath': 'https://images.unsplash.com/photo-1580133318324-f2f76d987679?w=800',
  'York': 'https://images.unsplash.com/photo-1554965833-b0c850727f46?w=800',
  'Glasgow': 'https://images.unsplash.com/photo-1557166984-b00337652c94?w=800',
  'Belfast': 'https://images.unsplash.com/photo-1577427944330-93d27f01ac24?w=800',

  // ==================== NORTH AMERICA ====================
  // Bahamas
  'Nassau': 'https://images.unsplash.com/photo-1548574505-5e239809ee19?w=800',
  // Barbados
  'Bridgetown': 'https://images.unsplash.com/photo-1596574644210-3fb41a347c67?w=800',
  // Belize
  'Belize City': 'https://images.unsplash.com/photo-1571407677889-e7e7c6a40f5c?w=800',
  // Canada
  'Toronto': 'https://images.unsplash.com/photo-1517935706615-2717063c2225?w=800',
  'Vancouver': 'https://images.unsplash.com/photo-1559511260-66a68e7f4e4a?w=800',
  'Montreal': 'https://images.unsplash.com/photo-1519178614-68673b201f36?w=800',
  'Quebec City': 'https://images.unsplash.com/photo-1540618268682-8d5aa9e0a15f?w=800',
  'Calgary': 'https://images.unsplash.com/photo-1553301208-a3718cc0150e?w=800',
  'Ottawa': 'https://images.unsplash.com/photo-1555949963-aa79dcee981c?w=800',
  'Banff': 'https://images.unsplash.com/photo-1503614472-8c93d56e92ce?w=800',
  'Whistler': 'https://images.unsplash.com/photo-1483728642387-6c3bdd6c93e5?w=800',
  'Niagara Falls': 'https://images.unsplash.com/photo-1489447068241-b3490214e879?w=800',
  // Costa Rica
  'San Jose': 'https://images.unsplash.com/photo-1519130490854-cd5c4c8d7f43?w=800',
  'La Fortuna': 'https://images.unsplash.com/photo-1590181611172-b645f5e21d31?w=800',
  // Cuba
  'Havana': 'https://images.unsplash.com/photo-1500759285222-a95626b934cb?w=800',
  'Varadero': 'https://images.unsplash.com/photo-1510097467424-192d713fd8b2?w=800',
  'Trinidad': 'https://images.unsplash.com/photo-1570299437522-462f35bb9e04?w=800',
  // Dominican Republic
  'Punta Cana': 'https://images.unsplash.com/photo-1588867702719-969c8e65791f?w=800',
  'Santo Domingo': 'https://images.unsplash.com/photo-1594402919875-3c934df53b7c?w=800',
  // El Salvador
  'San Salvador': 'https://images.unsplash.com/photo-1566438480900-0609be27a4be?w=800',
  // Guatemala
  'Guatemala City': 'https://images.unsplash.com/photo-1609152717295-a7bb46b6c01c?w=800',
  'Antigua Guatemala': 'https://images.unsplash.com/photo-1589209186089-4c2c8acfb4ef?w=800',
  // Haiti
  'Port-au-Prince': 'https://images.unsplash.com/photo-1597149653389-9e69b3c3c92d?w=800',
  // Honduras
  'Tegucigalpa': 'https://images.unsplash.com/photo-1585502781901-5c49d9fc3a6c?w=800',
  'Roatan': 'https://images.unsplash.com/photo-1559128010-7c1ad6e1b6a5?w=800',
  // Jamaica
  'Kingston': 'https://images.unsplash.com/photo-1562632669-4f9e8d62f2d8?w=800',
  'Montego Bay': 'https://images.unsplash.com/photo-1586672806757-7072d8ba9f65?w=800',
  // Mexico
  'Mexico City': 'https://images.unsplash.com/photo-1585464231875-d9ef1f5ad396?w=800',
  'Cancun': 'https://images.unsplash.com/photo-1510097467424-192d713fd8b2?w=800',
  'Playa del Carmen': 'https://images.unsplash.com/photo-1552074284-5e88ef1aef18?w=800',
  'Tulum': 'https://images.unsplash.com/photo-1518105779142-d975f22f1b0a?w=800',
  'Los Cabos': 'https://images.unsplash.com/photo-1505832018823-50331d70d237?w=800',
  'Puerto Vallarta': 'https://images.unsplash.com/photo-1512813195386-6cf811ad3542?w=800',
  'Guadalajara': 'https://images.unsplash.com/photo-1568065329758-7a28d8c62fde?w=800',
  'Oaxaca': 'https://images.unsplash.com/photo-1547995886-6dc09384c6e6?w=800',
  'Merida': 'https://images.unsplash.com/photo-1594559222853-4f9f8d64f2c8?w=800',
  'San Miguel de Allende': 'https://images.unsplash.com/photo-1571863533956-01c88e79957e?w=800',
  // Nicaragua
  'Managua': 'https://images.unsplash.com/photo-1585842378054-ee2e52f94ba2?w=800',
  // Panama
  'Panama City': 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=800',
  'Bocas del Toro': 'https://images.unsplash.com/photo-1523192193543-6e7296d960e4?w=800',
  // Puerto Rico
  'San Juan': 'https://images.unsplash.com/photo-1568402102990-bc541580b59f?w=800',
  // Trinidad and Tobago
  'Port of Spain': 'https://images.unsplash.com/photo-1596091419432-0bfe8dc0c85d?w=800',
  // United States
  'New York City': 'https://images.unsplash.com/photo-1496442226666-8d4d0e62e6e9?w=800',
  'Los Angeles': 'https://images.unsplash.com/photo-1534190760961-74e8c1c5c3da?w=800',
  'San Francisco': 'https://images.unsplash.com/photo-1501594907352-04cda38ebc29?w=800',
  'Miami': 'https://images.unsplash.com/photo-1514214246283-d427a95c5d2f?w=800',
  'Las Vegas': 'https://images.unsplash.com/photo-1605833556294-ea5c7a74f57d?w=800',
  'Chicago': 'https://images.unsplash.com/photo-1494522855154-9297ac14b55f?w=800',
  'Boston': 'https://images.unsplash.com/photo-1501979376754-2ff867a4f659?w=800',
  'Seattle': 'https://images.unsplash.com/photo-1502175353174-a7a70e73b362?w=800',
  'Washington D.C.': 'https://images.unsplash.com/photo-1501466044931-62695aada8e9?w=800',
  'New Orleans': 'https://images.unsplash.com/photo-1556905055-8f358a7a47b2?w=800',
  'San Diego': 'https://images.unsplash.com/photo-1538979528949-6f3c7c3d9f85?w=800',
  'Orlando': 'https://images.unsplash.com/photo-1575089776834-8be34696ffb9?w=800',
  'Honolulu': 'https://images.unsplash.com/photo-1507876466758-bc54f384809c?w=800',
  'Austin': 'https://images.unsplash.com/photo-1531218150217-54595bc2b934?w=800',
  'Nashville': 'https://images.unsplash.com/photo-1545419913-775e3e0f2dbc?w=800',
  'Denver': 'https://images.unsplash.com/photo-1546156929-a4c0ac411f47?w=800',
  'Portland': 'https://images.unsplash.com/photo-1541593747-e2bc2b1ad67a?w=800',
  'Phoenix': 'https://images.unsplash.com/photo-1558645836-e44d43c91e74?w=800',
  'Philadelphia': 'https://images.unsplash.com/photo-1569761316261-9a8696fa2ca3?w=800',
  'Atlanta': 'https://images.unsplash.com/photo-1575917649705-5b59aaa12e6b?w=800',
  'Grand Canyon': 'https://images.unsplash.com/photo-1509316975850-ff9c5deb0cd9?w=800',
  'Yellowstone': 'https://images.unsplash.com/photo-1533953263783-c8aefbca8370?w=800',

  // ==================== SOUTH AMERICA ====================
  // Argentina
  'Buenos Aires': 'https://images.unsplash.com/photo-1612294037637-ec328d0e075e?w=800',
  'Mendoza': 'https://images.unsplash.com/photo-1558363074-e7e43c78e9a8?w=800',
  'Bariloche': 'https://images.unsplash.com/photo-1589909202802-8f4aadce1849?w=800',
  'Ushuaia': 'https://images.unsplash.com/photo-1538993704933-2bd62a596c92?w=800',
  'Iguazu Falls': 'https://images.unsplash.com/photo-1552308995-b7c8c9484e94?w=800',
  // Bolivia
  'La Paz': 'https://images.unsplash.com/photo-1540875003536-4985d5b602c8?w=800',
  'Uyuni': 'https://images.unsplash.com/photo-1591225638500-f7f6ff4f4898?w=800',
  // Brazil
  'Rio de Janeiro': 'https://images.unsplash.com/photo-1483729558449-99ef09a8c325?w=800',
  'Sao Paulo': 'https://images.unsplash.com/photo-1543059080-f9b1272213d5?w=800',
  'Salvador': 'https://images.unsplash.com/photo-1568308637950-1c8a36c8e435?w=800',
  'Florianopolis': 'https://images.unsplash.com/photo-1594498653385-d5172c532c00?w=800',
  'Brasilia': 'https://images.unsplash.com/photo-1557180293-6c19d86c82a6?w=800',
  'Manaus': 'https://images.unsplash.com/photo-1598438436839-d36b3b0e32b3?w=800',
  'Recife': 'https://images.unsplash.com/photo-1533282960533-51328aa49826?w=800',
  'Foz do Iguacu': 'https://images.unsplash.com/photo-1518639192441-8fce0a366e2e?w=800',
  // Chile
  'Santiago': 'https://images.unsplash.com/photo-1594488436185-bb6e2a10c6a5?w=800',
  'Valparaiso': 'https://images.unsplash.com/photo-1547996160-81dfa63595aa?w=800',
  'Atacama Desert': 'https://images.unsplash.com/photo-1555078073-0b12e2b2d5dc?w=800',
  'Torres del Paine': 'https://images.unsplash.com/photo-1531761535209-180857e963b9?w=800',
  'Easter Island': 'https://images.unsplash.com/photo-1570786852435-a8d44f36dd2c?w=800',
  // Colombia
  'Bogota': 'https://images.unsplash.com/photo-1568632234157-ce7aecd03d0d?w=800',
  'Medellin': 'https://images.unsplash.com/photo-1599413987313-7c9f5e3b8f3e?w=800',
  'Cartagena': 'https://images.unsplash.com/photo-1583531172005-873055e96ead?w=800',
  // Ecuador
  'Quito': 'https://images.unsplash.com/photo-1566408669374-5a6d5dca1a59?w=800',
  'Galapagos Islands': 'https://images.unsplash.com/photo-1544979590-37e9b47eb705?w=800',
  'Cuenca': 'https://images.unsplash.com/photo-1613657785298-e7d20d90c0c0?w=800',
  // Guyana
  'Georgetown': 'https://images.unsplash.com/photo-1605979399824-42a89c2c93bb?w=800',
  // Paraguay
  'Asuncion': 'https://images.unsplash.com/photo-1591198619986-0c8c0a73d1f4?w=800',
  // Peru
  'Lima': 'https://images.unsplash.com/photo-1531968455001-5c5272a41129?w=800',
  'Cusco': 'https://images.unsplash.com/photo-1526392060635-9d6019884377?w=800',
  'Machu Picchu': 'https://images.unsplash.com/photo-1587595431973-160d0d94add1?w=800',
  'Arequipa': 'https://images.unsplash.com/photo-1580619305218-8423a7ef79b4?w=800',
  // Suriname
  'Paramaribo': 'https://images.unsplash.com/photo-1585842378054-ee2e52f94ba2?w=800',
  // Uruguay
  'Montevideo': 'https://images.unsplash.com/photo-1618955320609-92c573d8e48d?w=800',
  'Punta del Este': 'https://images.unsplash.com/photo-1591716811819-bc57b8c6bcf6?w=800',
  // Venezuela
  'Caracas': 'https://images.unsplash.com/photo-1578632292035-2b94bebc97c8?w=800',
  'Angel Falls': 'https://images.unsplash.com/photo-1493226803568-f9e4c4b2d2fd?w=800',

  // ==================== OCEANIA ====================
  // Australia
  'Sydney': 'https://images.unsplash.com/photo-1506973035872-a4ec16b8e8d9?w=800',
  'Melbourne': 'https://images.unsplash.com/photo-1514395462725-fb4566210144?w=800',
  'Brisbane': 'https://images.unsplash.com/photo-1524293581917-878a6d017c71?w=800',
  'Perth': 'https://images.unsplash.com/photo-1578724029617-f0dfb3a9c28c?w=800',
  'Gold Coast': 'https://images.unsplash.com/photo-1512745491093-0aae787de7d0?w=800',
  'Adelaide': 'https://images.unsplash.com/photo-1590058823707-0bff4fd2dd6f?w=800',
  'Cairns': 'https://images.unsplash.com/photo-1578587018452-892bacefd3f2?w=800',
  'Great Barrier Reef': 'https://images.unsplash.com/photo-1587139223877-04cb899fa3e8?w=800',
  'Uluru': 'https://images.unsplash.com/photo-1529108190281-9a4f620bc2d8?w=800',
  'Tasmania': 'https://images.unsplash.com/photo-1544071895-c7d21bfb8d98?w=800',
  // Fiji
  'Suva': 'https://images.unsplash.com/photo-1518548419970-58e3b4079ab2?w=800',
  'Nadi': 'https://images.unsplash.com/photo-1562127951-4f8d5a62b2a6?w=800',
  // French Polynesia
  'Bora Bora': 'https://images.unsplash.com/photo-1589197331516-4d84b72ebde3?w=800',
  'Tahiti': 'https://images.unsplash.com/photo-1516815231560-8f41ec531527?w=800',
  'Moorea': 'https://images.unsplash.com/photo-1593351799227-75df2026356b?w=800',
  // Guam
  'Hagatna': 'https://images.unsplash.com/photo-1590523278191-599f2a7f4bce?w=800',
  // Kiribati
  'Tarawa': 'https://images.unsplash.com/photo-1559827291-72ee739d0d9a?w=800',
  // New Caledonia
  'Noumea': 'https://images.unsplash.com/photo-1591604021695-0c69b7c05981?w=800',
  // New Zealand
  'Auckland': 'https://images.unsplash.com/photo-1507699622108-4be3abd695ad?w=800',
  'Queenstown': 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800',
  'Wellington': 'https://images.unsplash.com/photo-1582726772133-0013c47c4c16?w=800',
  'Rotorua': 'https://images.unsplash.com/photo-1500207891079-e5c12a37c5c0?w=800',
  'Christchurch': 'https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=800',
  'Milford Sound': 'https://images.unsplash.com/photo-1580137189272-c9379f8864fd?w=800',
  // Palau
  'Koror': 'https://images.unsplash.com/photo-1516550893923-42d28e5677af?w=800',
  // Papua New Guinea
  'Port Moresby': 'https://images.unsplash.com/photo-1590002057541-32e6e1cd7fdd?w=800',
  // Samoa
  'Apia': 'https://images.unsplash.com/photo-1592364395653-83e648b20cc2?w=800',
  // Solomon Islands
  'Honiara': 'https://images.unsplash.com/photo-1596570203566-06f13fae96e4?w=800',
  // Tonga
  'Nukualofa': 'https://images.unsplash.com/photo-1559128010-7c1ad6e1b6a5?w=800',
  // Vanuatu
  'Port Vila': 'https://images.unsplash.com/photo-1516569422572-d9e0514f8e70?w=800',
};

const citiesData = [
  // Africa - Popular Cities
  { name: 'Algiers', country: 'Algeria', lat: 36.7538, lng: 3.0588 },
  { name: 'Oran', country: 'Algeria', lat: 35.6969, lng: -0.6331 },
  { name: 'Luanda', country: 'Angola', lat: -8.8390, lng: 13.2894 },
  { name: 'Gaborone', country: 'Botswana', lat: -24.6282, lng: 25.9231 },
  { name: 'Douala', country: 'Cameroon', lat: 4.0511, lng: 9.7679 },
  { name: 'Yaounde', country: 'Cameroon', lat: 3.8480, lng: 11.5021 },
  { name: 'Kinshasa', country: 'Democratic Republic of Congo', lat: -4.4419, lng: 15.2663 },
  { name: 'Cairo', country: 'Egypt', lat: 30.0444, lng: 31.2357 },
  { name: 'Alexandria', country: 'Egypt', lat: 31.2001, lng: 29.9187 },
  { name: 'Luxor', country: 'Egypt', lat: 25.6872, lng: 32.6396 },
  { name: 'Sharm El Sheikh', country: 'Egypt', lat: 27.9158, lng: 34.3300 },
  { name: 'Hurghada', country: 'Egypt', lat: 27.2579, lng: 33.8116 },
  { name: 'Aswan', country: 'Egypt', lat: 24.0889, lng: 32.8998 },
  { name: 'Addis Ababa', country: 'Ethiopia', lat: 9.0320, lng: 38.7489 },
  { name: 'Accra', country: 'Ghana', lat: 5.6037, lng: -0.1870 },
  { name: 'Kumasi', country: 'Ghana', lat: 6.6885, lng: -1.6244 },
  { name: 'Abidjan', country: 'Ivory Coast', lat: 5.3600, lng: -4.0083 },
  { name: 'Nairobi', country: 'Kenya', lat: -1.2921, lng: 36.8219 },
  { name: 'Mombasa', country: 'Kenya', lat: -4.0435, lng: 39.6682 },
  { name: 'Maasai Mara', country: 'Kenya', lat: -1.4061, lng: 35.0173 },
  { name: 'Antananarivo', country: 'Madagascar', lat: -18.8792, lng: 47.5079 },
  { name: 'Port Louis', country: 'Mauritius', lat: -20.1609, lng: 57.5012 },
  { name: 'Marrakech', country: 'Morocco', lat: 31.6295, lng: -7.9811 },
  { name: 'Fes', country: 'Morocco', lat: 34.0181, lng: -5.0078 },
  { name: 'Casablanca', country: 'Morocco', lat: 33.5731, lng: -7.5898 },
  { name: 'Chefchaouen', country: 'Morocco', lat: 35.1688, lng: -5.2636 },
  { name: 'Tangier', country: 'Morocco', lat: 35.7595, lng: -5.8340 },
  { name: 'Rabat', country: 'Morocco', lat: 34.0209, lng: -6.8416 },
  { name: 'Maputo', country: 'Mozambique', lat: -25.9692, lng: 32.5732 },
  { name: 'Windhoek', country: 'Namibia', lat: -22.5609, lng: 17.0658 },
  { name: 'Swakopmund', country: 'Namibia', lat: -22.6784, lng: 14.5323 },
  { name: 'Lagos', country: 'Nigeria', lat: 6.5244, lng: 3.3792 },
  { name: 'Abuja', country: 'Nigeria', lat: 9.0765, lng: 7.3986 },
  { name: 'Kigali', country: 'Rwanda', lat: -1.9403, lng: 29.8739 },
  { name: 'Dakar', country: 'Senegal', lat: 14.7167, lng: -17.4677 },
  { name: 'Victoria', country: 'Seychelles', lat: -4.6191, lng: 55.4513 },
  { name: 'Cape Town', country: 'South Africa', lat: -33.9249, lng: 18.4241 },
  { name: 'Johannesburg', country: 'South Africa', lat: -26.2041, lng: 28.0473 },
  { name: 'Durban', country: 'South Africa', lat: -29.8587, lng: 31.0218 },
  { name: 'Pretoria', country: 'South Africa', lat: -25.7479, lng: 28.2293 },
  { name: 'Kruger National Park', country: 'South Africa', lat: -23.9884, lng: 31.5547 },
  { name: 'Dar es Salaam', country: 'Tanzania', lat: -6.7924, lng: 39.2083 },
  { name: 'Zanzibar City', country: 'Tanzania', lat: -6.1622, lng: 39.1921 },
  { name: 'Serengeti', country: 'Tanzania', lat: -2.3333, lng: 34.8333 },
  { name: 'Arusha', country: 'Tanzania', lat: -3.3869, lng: 36.6830 },
  { name: 'Tunis', country: 'Tunisia', lat: 36.8065, lng: 10.1815 },
  { name: 'Kampala', country: 'Uganda', lat: 0.3476, lng: 32.5825 },
  { name: 'Lusaka', country: 'Zambia', lat: -15.3875, lng: 28.3228 },
  { name: 'Victoria Falls', country: 'Zambia', lat: -17.9243, lng: 25.8572 },
  { name: 'Harare', country: 'Zimbabwe', lat: -17.8252, lng: 31.0335 },

  // Asia - Popular Cities
  { name: 'Dhaka', country: 'Bangladesh', lat: 23.8103, lng: 90.4125 },
  { name: 'Thimphu', country: 'Bhutan', lat: 27.4716, lng: 89.6386 },
  { name: 'Paro', country: 'Bhutan', lat: 27.4305, lng: 89.4136 },
  { name: 'Bandar Seri Begawan', country: 'Brunei', lat: 4.9031, lng: 114.9398 },
  { name: 'Phnom Penh', country: 'Cambodia', lat: 11.5564, lng: 104.9282 },
  { name: 'Siem Reap', country: 'Cambodia', lat: 13.3633, lng: 103.8564 },
  { name: 'Beijing', country: 'China', lat: 39.9042, lng: 116.4074 },
  { name: 'Shanghai', country: 'China', lat: 31.2304, lng: 121.4737 },
  { name: 'Guangzhou', country: 'China', lat: 23.1291, lng: 113.2644 },
  { name: 'Shenzhen', country: 'China', lat: 22.5431, lng: 114.0579 },
  { name: 'Chengdu', country: 'China', lat: 30.5728, lng: 104.0668 },
  { name: 'Xi\'an', country: 'China', lat: 34.3416, lng: 108.9398 },
  { name: 'Hangzhou', country: 'China', lat: 30.2741, lng: 120.1551 },
  { name: 'Guilin', country: 'China', lat: 25.2740, lng: 110.2990 },
  { name: 'Hong Kong', country: 'Hong Kong', lat: 22.3193, lng: 114.1694 },
  { name: 'Kowloon', country: 'Hong Kong', lat: 22.3193, lng: 114.1694 },
  { name: 'New Delhi', country: 'India', lat: 28.6139, lng: 77.2090 },
  { name: 'Mumbai', country: 'India', lat: 19.0760, lng: 72.8777 },
  { name: 'Jaipur', country: 'India', lat: 26.9124, lng: 75.7873 },
  { name: 'Agra', country: 'India', lat: 27.1767, lng: 78.0081 },
  { name: 'Varanasi', country: 'India', lat: 25.3176, lng: 82.9739 },
  { name: 'Goa', country: 'India', lat: 15.2993, lng: 74.1240 },
  { name: 'Bangalore', country: 'India', lat: 12.9716, lng: 77.5946 },
  { name: 'Kerala', country: 'India', lat: 10.8505, lng: 76.2711 },
  { name: 'Udaipur', country: 'India', lat: 24.5854, lng: 73.7125 },
  { name: 'Kolkata', country: 'India', lat: 22.5726, lng: 88.3639 },
  { name: 'Jakarta', country: 'Indonesia', lat: -6.2088, lng: 106.8456 },
  { name: 'Bali', country: 'Indonesia', lat: -8.3405, lng: 115.0920 },
  { name: 'Yogyakarta', country: 'Indonesia', lat: -7.7956, lng: 110.3695 },
  { name: 'Lombok', country: 'Indonesia', lat: -8.6500, lng: 116.3249 },
  { name: 'Komodo', country: 'Indonesia', lat: -8.5500, lng: 119.4333 },
  { name: 'Tel Aviv', country: 'Israel', lat: 32.0853, lng: 34.7818 },
  { name: 'Jerusalem', country: 'Israel', lat: 31.7683, lng: 35.2137 },
  { name: 'Tokyo', country: 'Japan', lat: 35.6762, lng: 139.6503 },
  { name: 'Kyoto', country: 'Japan', lat: 35.0116, lng: 135.7681 },
  { name: 'Osaka', country: 'Japan', lat: 34.6937, lng: 135.5023 },
  { name: 'Hiroshima', country: 'Japan', lat: 34.3853, lng: 132.4553 },
  { name: 'Nara', country: 'Japan', lat: 34.6851, lng: 135.8048 },
  { name: 'Hakone', country: 'Japan', lat: 35.2323, lng: 139.1069 },
  { name: 'Sapporo', country: 'Japan', lat: 43.0618, lng: 141.3545 },
  { name: 'Fukuoka', country: 'Japan', lat: 33.5904, lng: 130.4017 },
  { name: 'Okinawa', country: 'Japan', lat: 26.2124, lng: 127.6809 },
  { name: 'Amman', country: 'Jordan', lat: 31.9454, lng: 35.9284 },
  { name: 'Petra', country: 'Jordan', lat: 30.3285, lng: 35.4444 },
  { name: 'Almaty', country: 'Kazakhstan', lat: 43.2220, lng: 76.8512 },
  { name: 'Astana', country: 'Kazakhstan', lat: 51.1605, lng: 71.4704 },
  { name: 'Kuwait City', country: 'Kuwait', lat: 29.3759, lng: 47.9774 },
  { name: 'Bishkek', country: 'Kyrgyzstan', lat: 42.8746, lng: 74.5698 },
  { name: 'Vientiane', country: 'Laos', lat: 17.9757, lng: 102.6331 },
  { name: 'Luang Prabang', country: 'Laos', lat: 19.8847, lng: 102.1350 },
  { name: 'Beirut', country: 'Lebanon', lat: 33.8938, lng: 35.5018 },
  { name: 'Macau', country: 'Macau', lat: 22.1987, lng: 113.5439 },
  { name: 'Kuala Lumpur', country: 'Malaysia', lat: 3.1390, lng: 101.6869 },
  { name: 'Penang', country: 'Malaysia', lat: 5.4141, lng: 100.3288 },
  { name: 'Langkawi', country: 'Malaysia', lat: 6.3500, lng: 99.8000 },
  { name: 'Malacca', country: 'Malaysia', lat: 2.1896, lng: 102.2501 },
  { name: 'Kota Kinabalu', country: 'Malaysia', lat: 5.9804, lng: 116.0735 },
  { name: 'Male', country: 'Maldives', lat: 4.1755, lng: 73.5093 },
  { name: 'Ulaanbaatar', country: 'Mongolia', lat: 47.8864, lng: 106.9057 },
  { name: 'Yangon', country: 'Myanmar', lat: 16.8661, lng: 96.1951 },
  { name: 'Bagan', country: 'Myanmar', lat: 21.1717, lng: 94.8585 },
  { name: 'Kathmandu', country: 'Nepal', lat: 27.7172, lng: 85.3240 },
  { name: 'Pokhara', country: 'Nepal', lat: 28.2096, lng: 83.9856 },
  { name: 'Muscat', country: 'Oman', lat: 23.5880, lng: 58.3829 },
  { name: 'Islamabad', country: 'Pakistan', lat: 33.6844, lng: 73.0479 },
  { name: 'Lahore', country: 'Pakistan', lat: 31.5204, lng: 74.3587 },
  { name: 'Karachi', country: 'Pakistan', lat: 24.8607, lng: 67.0011 },
  { name: 'Manila', country: 'Philippines', lat: 14.5995, lng: 120.9842 },
  { name: 'Cebu', country: 'Philippines', lat: 10.3157, lng: 123.8854 },
  { name: 'Boracay', country: 'Philippines', lat: 11.9674, lng: 121.9248 },
  { name: 'Palawan', country: 'Philippines', lat: 9.8349, lng: 118.7384 },
  { name: 'Doha', country: 'Qatar', lat: 25.2854, lng: 51.5310 },
  { name: 'Riyadh', country: 'Saudi Arabia', lat: 24.7136, lng: 46.6753 },
  { name: 'Jeddah', country: 'Saudi Arabia', lat: 21.4858, lng: 39.1925 },
  { name: 'Mecca', country: 'Saudi Arabia', lat: 21.4225, lng: 39.8262 },
  { name: 'Singapore', country: 'Singapore', lat: 1.3521, lng: 103.8198 },
  { name: 'Seoul', country: 'South Korea', lat: 37.5665, lng: 126.9780 },
  { name: 'Busan', country: 'South Korea', lat: 35.1796, lng: 129.0756 },
  { name: 'Jeju Island', country: 'South Korea', lat: 33.4996, lng: 126.5312 },
  { name: 'Colombo', country: 'Sri Lanka', lat: 6.9271, lng: 79.8612 },
  { name: 'Kandy', country: 'Sri Lanka', lat: 7.2906, lng: 80.6337 },
  { name: 'Galle', country: 'Sri Lanka', lat: 6.0535, lng: 80.2210 },
  { name: 'Taipei', country: 'Taiwan', lat: 25.0330, lng: 121.5654 },
  { name: 'Kaohsiung', country: 'Taiwan', lat: 22.6273, lng: 120.3014 },
  { name: 'Bangkok', country: 'Thailand', lat: 13.7563, lng: 100.5018 },
  { name: 'Chiang Mai', country: 'Thailand', lat: 18.7883, lng: 98.9853 },
  { name: 'Phuket', country: 'Thailand', lat: 7.8804, lng: 98.3923 },
  { name: 'Krabi', country: 'Thailand', lat: 8.0863, lng: 98.9063 },
  { name: 'Koh Samui', country: 'Thailand', lat: 9.5120, lng: 100.0134 },
  { name: 'Pattaya', country: 'Thailand', lat: 12.9236, lng: 100.8825 },
  { name: 'Istanbul', country: 'Turkey', lat: 41.0082, lng: 28.9784 },
  { name: 'Cappadocia', country: 'Turkey', lat: 38.6431, lng: 34.8289 },
  { name: 'Antalya', country: 'Turkey', lat: 36.8969, lng: 30.7133 },
  { name: 'Bodrum', country: 'Turkey', lat: 37.0344, lng: 27.4305 },
  { name: 'Pamukkale', country: 'Turkey', lat: 37.9137, lng: 29.1187 },
  { name: 'Dubai', country: 'United Arab Emirates', lat: 25.2048, lng: 55.2708 },
  { name: 'Abu Dhabi', country: 'United Arab Emirates', lat: 24.4539, lng: 54.3773 },
  { name: 'Sharjah', country: 'United Arab Emirates', lat: 25.3463, lng: 55.4209 },
  { name: 'Tashkent', country: 'Uzbekistan', lat: 41.2995, lng: 69.2401 },
  { name: 'Samarkand', country: 'Uzbekistan', lat: 39.6542, lng: 66.9597 },
  { name: 'Hanoi', country: 'Vietnam', lat: 21.0285, lng: 105.8542 },
  { name: 'Ho Chi Minh City', country: 'Vietnam', lat: 10.8231, lng: 106.6297 },
  { name: 'Da Nang', country: 'Vietnam', lat: 16.0544, lng: 108.2022 },
  { name: 'Hoi An', country: 'Vietnam', lat: 15.8801, lng: 108.3380 },
  { name: 'Ha Long Bay', country: 'Vietnam', lat: 20.9101, lng: 107.1839 },
  { name: 'Nha Trang', country: 'Vietnam', lat: 12.2388, lng: 109.1967 },

  // Europe - Popular Cities
  { name: 'Tirana', country: 'Albania', lat: 41.3275, lng: 19.8187 },
  { name: 'Andorra la Vella', country: 'Andorra', lat: 42.5063, lng: 1.5218 },
  { name: 'Vienna', country: 'Austria', lat: 48.2082, lng: 16.3738 },
  { name: 'Salzburg', country: 'Austria', lat: 47.8095, lng: 13.0550 },
  { name: 'Innsbruck', country: 'Austria', lat: 47.2692, lng: 11.4041 },
  { name: 'Minsk', country: 'Belarus', lat: 53.9045, lng: 27.5615 },
  { name: 'Brussels', country: 'Belgium', lat: 50.8503, lng: 4.3517 },
  { name: 'Bruges', country: 'Belgium', lat: 51.2093, lng: 3.2247 },
  { name: 'Antwerp', country: 'Belgium', lat: 51.2194, lng: 4.4025 },
  { name: 'Ghent', country: 'Belgium', lat: 51.0543, lng: 3.7174 },
  { name: 'Sarajevo', country: 'Bosnia and Herzegovina', lat: 43.8563, lng: 18.4131 },
  { name: 'Mostar', country: 'Bosnia and Herzegovina', lat: 43.3438, lng: 17.8078 },
  { name: 'Sofia', country: 'Bulgaria', lat: 42.6977, lng: 23.3219 },
  { name: 'Zagreb', country: 'Croatia', lat: 45.8150, lng: 15.9819 },
  { name: 'Dubrovnik', country: 'Croatia', lat: 42.6507, lng: 18.0944 },
  { name: 'Split', country: 'Croatia', lat: 43.5081, lng: 16.4402 },
  { name: 'Plitvice Lakes', country: 'Croatia', lat: 44.8654, lng: 15.5820 },
  { name: 'Nicosia', country: 'Cyprus', lat: 35.1856, lng: 33.3823 },
  { name: 'Limassol', country: 'Cyprus', lat: 34.7071, lng: 33.0226 },
  { name: 'Prague', country: 'Czech Republic', lat: 50.0755, lng: 14.4378 },
  { name: 'Cesky Krumlov', country: 'Czech Republic', lat: 48.8127, lng: 14.3175 },
  { name: 'Brno', country: 'Czech Republic', lat: 49.1951, lng: 16.6068 },
  { name: 'Copenhagen', country: 'Denmark', lat: 55.6761, lng: 12.5683 },
  { name: 'Tallinn', country: 'Estonia', lat: 59.4370, lng: 24.7536 },
  { name: 'Helsinki', country: 'Finland', lat: 60.1699, lng: 24.9384 },
  { name: 'Rovaniemi', country: 'Finland', lat: 66.5039, lng: 25.7294 },
  { name: 'Paris', country: 'France', lat: 48.8566, lng: 2.3522 },
  { name: 'Nice', country: 'France', lat: 43.7102, lng: 7.2620 },
  { name: 'Lyon', country: 'France', lat: 45.7640, lng: 4.8357 },
  { name: 'Marseille', country: 'France', lat: 43.2965, lng: 5.3698 },
  { name: 'Bordeaux', country: 'France', lat: 44.8378, lng: -0.5792 },
  { name: 'Strasbourg', country: 'France', lat: 48.5734, lng: 7.7521 },
  { name: 'Cannes', country: 'France', lat: 43.5528, lng: 7.0174 },
  { name: 'Monaco', country: 'Monaco', lat: 43.7384, lng: 7.4246 },
  { name: 'Berlin', country: 'Germany', lat: 52.5200, lng: 13.4050 },
  { name: 'Munich', country: 'Germany', lat: 48.1351, lng: 11.5820 },
  { name: 'Hamburg', country: 'Germany', lat: 53.5511, lng: 9.9937 },
  { name: 'Frankfurt', country: 'Germany', lat: 50.1109, lng: 8.6821 },
  { name: 'Cologne', country: 'Germany', lat: 50.9375, lng: 6.9603 },
  { name: 'Dresden', country: 'Germany', lat: 51.0504, lng: 13.7373 },
  { name: 'Heidelberg', country: 'Germany', lat: 49.3988, lng: 8.6724 },
  { name: 'Athens', country: 'Greece', lat: 37.9838, lng: 23.7275 },
  { name: 'Santorini', country: 'Greece', lat: 36.3932, lng: 25.4615 },
  { name: 'Mykonos', country: 'Greece', lat: 37.4467, lng: 25.3289 },
  { name: 'Crete', country: 'Greece', lat: 35.2401, lng: 24.8093 },
  { name: 'Rhodes', country: 'Greece', lat: 36.4349, lng: 28.2176 },
  { name: 'Corfu', country: 'Greece', lat: 39.6243, lng: 19.9217 },
  { name: 'Budapest', country: 'Hungary', lat: 47.4979, lng: 19.0402 },
  { name: 'Reykjavik', country: 'Iceland', lat: 64.1466, lng: -21.9426 },
  { name: 'Dublin', country: 'Ireland', lat: 53.3498, lng: -6.2603 },
  { name: 'Galway', country: 'Ireland', lat: 53.2707, lng: -9.0568 },
  { name: 'Cork', country: 'Ireland', lat: 51.8985, lng: -8.4756 },
  { name: 'Rome', country: 'Italy', lat: 41.9028, lng: 12.4964 },
  { name: 'Venice', country: 'Italy', lat: 45.4408, lng: 12.3155 },
  { name: 'Florence', country: 'Italy', lat: 43.7696, lng: 11.2558 },
  { name: 'Milan', country: 'Italy', lat: 45.4642, lng: 9.1900 },
  { name: 'Naples', country: 'Italy', lat: 40.8518, lng: 14.2681 },
  { name: 'Amalfi Coast', country: 'Italy', lat: 40.6340, lng: 14.6027 },
  { name: 'Cinque Terre', country: 'Italy', lat: 44.1270, lng: 9.7132 },
  { name: 'Bologna', country: 'Italy', lat: 44.4949, lng: 11.3426 },
  { name: 'Tuscany', country: 'Italy', lat: 43.7711, lng: 11.2486 },
  { name: 'Riga', country: 'Latvia', lat: 56.9496, lng: 24.1052 },
  { name: 'Vilnius', country: 'Lithuania', lat: 54.6872, lng: 25.2797 },
  { name: 'Luxembourg City', country: 'Luxembourg', lat: 49.6116, lng: 6.1319 },
  { name: 'Valletta', country: 'Malta', lat: 35.8989, lng: 14.5146 },
  { name: 'Podgorica', country: 'Montenegro', lat: 42.4304, lng: 19.2594 },
  { name: 'Kotor', country: 'Montenegro', lat: 42.4247, lng: 18.7712 },
  { name: 'Amsterdam', country: 'Netherlands', lat: 52.3676, lng: 4.9041 },
  { name: 'Rotterdam', country: 'Netherlands', lat: 51.9244, lng: 4.4777 },
  { name: 'The Hague', country: 'Netherlands', lat: 52.0705, lng: 4.3007 },
  { name: 'Skopje', country: 'North Macedonia', lat: 41.9981, lng: 21.4254 },
  { name: 'Oslo', country: 'Norway', lat: 59.9139, lng: 10.7522 },
  { name: 'Bergen', country: 'Norway', lat: 60.3913, lng: 5.3221 },
  { name: 'Tromso', country: 'Norway', lat: 69.6492, lng: 18.9553 },
  { name: 'Warsaw', country: 'Poland', lat: 52.2297, lng: 21.0122 },
  { name: 'Krakow', country: 'Poland', lat: 50.0647, lng: 19.9450 },
  { name: 'Gdansk', country: 'Poland', lat: 54.3520, lng: 18.6466 },
  { name: 'Wroclaw', country: 'Poland', lat: 51.1079, lng: 17.0385 },
  { name: 'Lisbon', country: 'Portugal', lat: 38.7223, lng: -9.1393 },
  { name: 'Porto', country: 'Portugal', lat: 41.1579, lng: -8.6291 },
  { name: 'Algarve', country: 'Portugal', lat: 37.0179, lng: -7.9304 },
  { name: 'Madeira', country: 'Portugal', lat: 32.6669, lng: -16.9241 },
  { name: 'Bucharest', country: 'Romania', lat: 44.4268, lng: 26.1025 },
  { name: 'Transylvania', country: 'Romania', lat: 46.7712, lng: 23.6236 },
  { name: 'Moscow', country: 'Russia', lat: 55.7558, lng: 37.6173 },
  { name: 'St. Petersburg', country: 'Russia', lat: 59.9311, lng: 30.3609 },
  { name: 'Belgrade', country: 'Serbia', lat: 44.7866, lng: 20.4489 },
  { name: 'Bratislava', country: 'Slovakia', lat: 48.1486, lng: 17.1077 },
  { name: 'Ljubljana', country: 'Slovenia', lat: 46.0569, lng: 14.5058 },
  { name: 'Lake Bled', country: 'Slovenia', lat: 46.3683, lng: 14.1146 },
  { name: 'Madrid', country: 'Spain', lat: 40.4168, lng: -3.7038 },
  { name: 'Barcelona', country: 'Spain', lat: 41.3851, lng: 2.1734 },
  { name: 'Seville', country: 'Spain', lat: 37.3891, lng: -5.9845 },
  { name: 'Valencia', country: 'Spain', lat: 39.4699, lng: -0.3763 },
  { name: 'Granada', country: 'Spain', lat: 37.1773, lng: -3.5986 },
  { name: 'Ibiza', country: 'Spain', lat: 38.9067, lng: 1.4206 },
  { name: 'Mallorca', country: 'Spain', lat: 39.6953, lng: 3.0176 },
  { name: 'San Sebastian', country: 'Spain', lat: 43.3183, lng: -1.9812 },
  { name: 'Bilbao', country: 'Spain', lat: 43.2630, lng: -2.9350 },
  { name: 'Stockholm', country: 'Sweden', lat: 59.3293, lng: 18.0686 },
  { name: 'Gothenburg', country: 'Sweden', lat: 57.7089, lng: 11.9746 },
  { name: 'Zurich', country: 'Switzerland', lat: 47.3769, lng: 8.5417 },
  { name: 'Geneva', country: 'Switzerland', lat: 46.2044, lng: 6.1432 },
  { name: 'Lucerne', country: 'Switzerland', lat: 47.0502, lng: 8.3093 },
  { name: 'Interlaken', country: 'Switzerland', lat: 46.6863, lng: 7.8632 },
  { name: 'Zermatt', country: 'Switzerland', lat: 46.0207, lng: 7.7491 },
  { name: 'Kyiv', country: 'Ukraine', lat: 50.4501, lng: 30.5234 },
  { name: 'Lviv', country: 'Ukraine', lat: 49.8397, lng: 24.0297 },
  { name: 'London', country: 'United Kingdom', lat: 51.5074, lng: -0.1278 },
  { name: 'Edinburgh', country: 'United Kingdom', lat: 55.9533, lng: -3.1883 },
  { name: 'Manchester', country: 'United Kingdom', lat: 53.4808, lng: -2.2426 },
  { name: 'Liverpool', country: 'United Kingdom', lat: 53.4084, lng: -2.9916 },
  { name: 'Oxford', country: 'United Kingdom', lat: 51.7520, lng: -1.2577 },
  { name: 'Cambridge', country: 'United Kingdom', lat: 52.2053, lng: 0.1218 },
  { name: 'Bath', country: 'United Kingdom', lat: 51.3811, lng: -2.3590 },
  { name: 'York', country: 'United Kingdom', lat: 53.9600, lng: -1.0873 },
  { name: 'Glasgow', country: 'United Kingdom', lat: 55.8642, lng: -4.2518 },
  { name: 'Belfast', country: 'United Kingdom', lat: 54.5973, lng: -5.9301 },

  // North America - Popular Cities
  { name: 'Nassau', country: 'Bahamas', lat: 25.0343, lng: -77.3963 },
  { name: 'Bridgetown', country: 'Barbados', lat: 13.1132, lng: -59.5988 },
  { name: 'Belize City', country: 'Belize', lat: 17.4986, lng: -88.1886 },
  { name: 'Toronto', country: 'Canada', lat: 43.6532, lng: -79.3832 },
  { name: 'Vancouver', country: 'Canada', lat: 49.2827, lng: -123.1207 },
  { name: 'Montreal', country: 'Canada', lat: 45.5017, lng: -73.5673 },
  { name: 'Quebec City', country: 'Canada', lat: 46.8139, lng: -71.2080 },
  { name: 'Calgary', country: 'Canada', lat: 51.0447, lng: -114.0719 },
  { name: 'Ottawa', country: 'Canada', lat: 45.4215, lng: -75.6972 },
  { name: 'Banff', country: 'Canada', lat: 51.1784, lng: -115.5708 },
  { name: 'Victoria', country: 'Canada', lat: 48.4284, lng: -123.3656 },
  { name: 'Whistler', country: 'Canada', lat: 50.1163, lng: -122.9574 },
  { name: 'Niagara Falls', country: 'Canada', lat: 43.0896, lng: -79.0849 },
  { name: 'San Jose', country: 'Costa Rica', lat: 9.9281, lng: -84.0907 },
  { name: 'La Fortuna', country: 'Costa Rica', lat: 10.4679, lng: -84.6427 },
  { name: 'Havana', country: 'Cuba', lat: 23.1136, lng: -82.3666 },
  { name: 'Varadero', country: 'Cuba', lat: 23.1560, lng: -81.2503 },
  { name: 'Trinidad', country: 'Cuba', lat: 21.8023, lng: -79.9843 },
  { name: 'Punta Cana', country: 'Dominican Republic', lat: 18.5601, lng: -68.3725 },
  { name: 'Santo Domingo', country: 'Dominican Republic', lat: 18.4861, lng: -69.9312 },
  { name: 'San Salvador', country: 'El Salvador', lat: 13.6929, lng: -89.2182 },
  { name: 'Guatemala City', country: 'Guatemala', lat: 14.6349, lng: -90.5069 },
  { name: 'Antigua Guatemala', country: 'Guatemala', lat: 14.5586, lng: -90.7295 },
  { name: 'Port-au-Prince', country: 'Haiti', lat: 18.5944, lng: -72.3074 },
  { name: 'Tegucigalpa', country: 'Honduras', lat: 14.0723, lng: -87.1921 },
  { name: 'Roatan', country: 'Honduras', lat: 16.3419, lng: -86.5150 },
  { name: 'Kingston', country: 'Jamaica', lat: 18.0179, lng: -76.8099 },
  { name: 'Montego Bay', country: 'Jamaica', lat: 18.4762, lng: -77.8939 },
  { name: 'Mexico City', country: 'Mexico', lat: 19.4326, lng: -99.1332 },
  { name: 'Cancun', country: 'Mexico', lat: 21.1619, lng: -86.8515 },
  { name: 'Playa del Carmen', country: 'Mexico', lat: 20.6296, lng: -87.0739 },
  { name: 'Tulum', country: 'Mexico', lat: 20.2114, lng: -87.4654 },
  { name: 'Los Cabos', country: 'Mexico', lat: 22.8905, lng: -109.9167 },
  { name: 'Puerto Vallarta', country: 'Mexico', lat: 20.6534, lng: -105.2253 },
  { name: 'Guadalajara', country: 'Mexico', lat: 20.6597, lng: -103.3496 },
  { name: 'Oaxaca', country: 'Mexico', lat: 17.0732, lng: -96.7266 },
  { name: 'Merida', country: 'Mexico', lat: 20.9674, lng: -89.5926 },
  { name: 'San Miguel de Allende', country: 'Mexico', lat: 20.9144, lng: -100.7452 },
  { name: 'Managua', country: 'Nicaragua', lat: 12.1150, lng: -86.2362 },
  { name: 'Granada', country: 'Nicaragua', lat: 11.9344, lng: -85.9560 },
  { name: 'Panama City', country: 'Panama', lat: 8.9824, lng: -79.5199 },
  { name: 'Bocas del Toro', country: 'Panama', lat: 9.3404, lng: -82.2417 },
  { name: 'San Juan', country: 'Puerto Rico', lat: 18.4655, lng: -66.1057 },
  { name: 'Port of Spain', country: 'Trinidad and Tobago', lat: 10.6596, lng: -61.5086 },
  { name: 'New York City', country: 'United States', lat: 40.7128, lng: -74.0060 },
  { name: 'Los Angeles', country: 'United States', lat: 34.0522, lng: -118.2437 },
  { name: 'San Francisco', country: 'United States', lat: 37.7749, lng: -122.4194 },
  { name: 'Miami', country: 'United States', lat: 25.7617, lng: -80.1918 },
  { name: 'Las Vegas', country: 'United States', lat: 36.1699, lng: -115.1398 },
  { name: 'Chicago', country: 'United States', lat: 41.8781, lng: -87.6298 },
  { name: 'Boston', country: 'United States', lat: 42.3601, lng: -71.0589 },
  { name: 'Seattle', country: 'United States', lat: 47.6062, lng: -122.3321 },
  { name: 'Washington D.C.', country: 'United States', lat: 38.9072, lng: -77.0369 },
  { name: 'New Orleans', country: 'United States', lat: 29.9511, lng: -90.0715 },
  { name: 'San Diego', country: 'United States', lat: 32.7157, lng: -117.1611 },
  { name: 'Orlando', country: 'United States', lat: 28.5383, lng: -81.3792 },
  { name: 'Honolulu', country: 'United States', lat: 21.3069, lng: -157.8583 },
  { name: 'Austin', country: 'United States', lat: 30.2672, lng: -97.7431 },
  { name: 'Nashville', country: 'United States', lat: 36.1627, lng: -86.7816 },
  { name: 'Denver', country: 'United States', lat: 39.7392, lng: -104.9903 },
  { name: 'Portland', country: 'United States', lat: 45.5152, lng: -122.6784 },
  { name: 'Phoenix', country: 'United States', lat: 33.4484, lng: -112.0740 },
  { name: 'Philadelphia', country: 'United States', lat: 39.9526, lng: -75.1652 },
  { name: 'Atlanta', country: 'United States', lat: 33.7490, lng: -84.3880 },
  { name: 'Grand Canyon', country: 'United States', lat: 36.0544, lng: -112.1401 },
  { name: 'Yellowstone', country: 'United States', lat: 44.4280, lng: -110.5885 },

  // South America - Popular Cities
  { name: 'Buenos Aires', country: 'Argentina', lat: -34.6037, lng: -58.3816 },
  { name: 'Mendoza', country: 'Argentina', lat: -32.8895, lng: -68.8458 },
  { name: 'Bariloche', country: 'Argentina', lat: -41.1335, lng: -71.3103 },
  { name: 'Ushuaia', country: 'Argentina', lat: -54.8019, lng: -68.3030 },
  { name: 'Iguazu Falls', country: 'Argentina', lat: -25.6866, lng: -54.4445 },
  { name: 'La Paz', country: 'Bolivia', lat: -16.4897, lng: -68.1193 },
  { name: 'Uyuni', country: 'Bolivia', lat: -20.4637, lng: -66.8253 },
  { name: 'Rio de Janeiro', country: 'Brazil', lat: -22.9068, lng: -43.1729 },
  { name: 'Sao Paulo', country: 'Brazil', lat: -23.5505, lng: -46.6333 },
  { name: 'Salvador', country: 'Brazil', lat: -12.9714, lng: -38.5014 },
  { name: 'Florianopolis', country: 'Brazil', lat: -27.5954, lng: -48.5480 },
  { name: 'Brasilia', country: 'Brazil', lat: -15.7942, lng: -47.8822 },
  { name: 'Manaus', country: 'Brazil', lat: -3.1190, lng: -60.0217 },
  { name: 'Recife', country: 'Brazil', lat: -8.0476, lng: -34.8770 },
  { name: 'Foz do Iguacu', country: 'Brazil', lat: -25.5163, lng: -54.5854 },
  { name: 'Santiago', country: 'Chile', lat: -33.4489, lng: -70.6693 },
  { name: 'Valparaiso', country: 'Chile', lat: -33.0472, lng: -71.6127 },
  { name: 'Atacama Desert', country: 'Chile', lat: -23.8634, lng: -69.1328 },
  { name: 'Torres del Paine', country: 'Chile', lat: -50.9423, lng: -73.4068 },
  { name: 'Easter Island', country: 'Chile', lat: -27.1127, lng: -109.3497 },
  { name: 'Bogota', country: 'Colombia', lat: 4.7110, lng: -74.0721 },
  { name: 'Medellin', country: 'Colombia', lat: 6.2476, lng: -75.5658 },
  { name: 'Cartagena', country: 'Colombia', lat: 10.3910, lng: -75.4794 },
  { name: 'Quito', country: 'Ecuador', lat: -0.1807, lng: -78.4678 },
  { name: 'Galapagos Islands', country: 'Ecuador', lat: -0.9538, lng: -90.9656 },
  { name: 'Cuenca', country: 'Ecuador', lat: -2.9001, lng: -79.0059 },
  { name: 'Georgetown', country: 'Guyana', lat: 6.8013, lng: -58.1551 },
  { name: 'Asuncion', country: 'Paraguay', lat: -25.2637, lng: -57.5759 },
  { name: 'Lima', country: 'Peru', lat: -12.0464, lng: -77.0428 },
  { name: 'Cusco', country: 'Peru', lat: -13.5320, lng: -71.9675 },
  { name: 'Machu Picchu', country: 'Peru', lat: -13.1631, lng: -72.5450 },
  { name: 'Arequipa', country: 'Peru', lat: -16.4090, lng: -71.5375 },
  { name: 'Paramaribo', country: 'Suriname', lat: 5.8520, lng: -55.2038 },
  { name: 'Montevideo', country: 'Uruguay', lat: -34.9011, lng: -56.1645 },
  { name: 'Punta del Este', country: 'Uruguay', lat: -34.9671, lng: -54.9507 },
  { name: 'Caracas', country: 'Venezuela', lat: 10.4806, lng: -66.9036 },
  { name: 'Angel Falls', country: 'Venezuela', lat: 5.9701, lng: -62.5362 },

  // Oceania - Popular Cities
  { name: 'Sydney', country: 'Australia', lat: -33.8688, lng: 151.2093 },
  { name: 'Melbourne', country: 'Australia', lat: -37.8136, lng: 144.9631 },
  { name: 'Brisbane', country: 'Australia', lat: -27.4698, lng: 153.0251 },
  { name: 'Perth', country: 'Australia', lat: -31.9505, lng: 115.8605 },
  { name: 'Gold Coast', country: 'Australia', lat: -28.0167, lng: 153.4000 },
  { name: 'Adelaide', country: 'Australia', lat: -34.9285, lng: 138.6007 },
  { name: 'Cairns', country: 'Australia', lat: -16.9186, lng: 145.7781 },
  { name: 'Great Barrier Reef', country: 'Australia', lat: -18.2871, lng: 147.6992 },
  { name: 'Uluru', country: 'Australia', lat: -25.3444, lng: 131.0369 },
  { name: 'Tasmania', country: 'Australia', lat: -42.0409, lng: 146.8087 },
  { name: 'Suva', country: 'Fiji', lat: -18.1416, lng: 178.4419 },
  { name: 'Nadi', country: 'Fiji', lat: -17.7765, lng: 177.4356 },
  { name: 'Bora Bora', country: 'French Polynesia', lat: -16.5004, lng: -151.7415 },
  { name: 'Tahiti', country: 'French Polynesia', lat: -17.6509, lng: -149.4260 },
  { name: 'Moorea', country: 'French Polynesia', lat: -17.5388, lng: -149.8295 },
  { name: 'Hagatna', country: 'Guam', lat: 13.4443, lng: 144.7937 },
  { name: 'Tarawa', country: 'Kiribati', lat: 1.3282, lng: 172.9784 },
  { name: 'Noumea', country: 'New Caledonia', lat: -22.2758, lng: 166.4580 },
  { name: 'Auckland', country: 'New Zealand', lat: -36.8485, lng: 174.7633 },
  { name: 'Queenstown', country: 'New Zealand', lat: -45.0312, lng: 168.6626 },
  { name: 'Wellington', country: 'New Zealand', lat: -41.2866, lng: 174.7756 },
  { name: 'Rotorua', country: 'New Zealand', lat: -38.1368, lng: 176.2497 },
  { name: 'Christchurch', country: 'New Zealand', lat: -43.5321, lng: 172.6362 },
  { name: 'Milford Sound', country: 'New Zealand', lat: -44.6414, lng: 167.8975 },
  { name: 'Koror', country: 'Palau', lat: 7.3419, lng: 134.4792 },
  { name: 'Port Moresby', country: 'Papua New Guinea', lat: -9.4438, lng: 147.1803 },
  { name: 'Apia', country: 'Samoa', lat: -13.8506, lng: -171.7513 },
  { name: 'Honiara', country: 'Solomon Islands', lat: -9.4280, lng: 159.9498 },
  { name: 'Nukualofa', country: 'Tonga', lat: -21.2114, lng: -175.1998 },
  { name: 'Port Vila', country: 'Vanuatu', lat: -17.7334, lng: 168.3220 },
];

async function seed() {
  try {
    await dataSource.initialize();
    console.log('Database connected');

    const continentRepo = dataSource.getRepository(Continent);
    const countryRepo = dataSource.getRepository(Country);
    const cityRepo = dataSource.getRepository(City);

    // Clear existing data (in correct order due to foreign keys)
    const destinationRepo = dataSource.getRepository(Destination);
    const photoRepo = dataSource.getRepository(Photo);
    const activityRepo = dataSource.getRepository(Activity);

    await photoRepo.createQueryBuilder().delete().from(Photo).execute();
    await activityRepo.createQueryBuilder().delete().from(Activity).execute();
    await destinationRepo.createQueryBuilder().delete().from(Destination).execute();
    await cityRepo.createQueryBuilder().delete().from(City).execute();
    await countryRepo.createQueryBuilder().delete().from(Country).execute();
    await continentRepo.createQueryBuilder().delete().from(Continent).execute();
    console.log('Cleared existing data');

    // Seed continents with images
    const continentMap = new Map<string, Continent>();
    for (const continentData of continentsData) {
      const continent = continentRepo.create({
        name: continentData.name,
        code: continentData.code,
        imageUrl: continentData.imageUrl,
      });
      const saved = await continentRepo.save(continent);
      continentMap.set(saved.name, saved);
    }
    console.log(`Seeded ${continentMap.size} continents`);

    // Seed countries
    const countryMap = new Map<string, Country>();
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

    // Build country to continent mapping
    const countryToContinent = new Map<string, string>();
    for (const countryData of countriesData) {
      countryToContinent.set(countryData.name, countryData.continent);
    }

    // Seed cities with images (update existing or create new)
    let cityCount = 0;
    let updatedCount = 0;
    for (const cityData of citiesData) {
      const country = countryMap.get(cityData.country);
      if (country) {
        // Get image: specific city image > continent default
        const continentName = countryToContinent.get(cityData.country) || 'Asia';
        const imageUrl = cityImages[cityData.name] || continentDefaultImages[continentName] || 'https://images.unsplash.com/photo-1488646953014-85cb44e25828?w=800';

        // Check if city already exists
        let city = await cityRepo.findOne({
          where: { name: cityData.name, countryId: country.id }
        });

        if (city) {
          // Update existing city with imageUrl
          city.imageUrl = imageUrl;
          city.latitude = cityData.lat;
          city.longitude = cityData.lng;
          await cityRepo.save(city);
          updatedCount++;
        } else {
          // Create new city
          city = cityRepo.create({
            name: cityData.name,
            countryId: country.id,
            latitude: cityData.lat,
            longitude: cityData.lng,
            imageUrl: imageUrl,
          });
          await cityRepo.save(city);
          cityCount++;
        }
      }
    }
    console.log(`Seeded ${cityCount} new cities, updated ${updatedCount} existing cities`);

    console.log('Seeding completed successfully!');
    await dataSource.destroy();
  } catch (error) {
    console.error('Error seeding database:', error);
    process.exit(1);
  }
}

seed();
