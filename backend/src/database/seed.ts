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

// Generate Lorem Picsum URL for city images
// Uses city name as seed for consistent images per city
const getCityImageUrl = (cityName: string): string => {
  const seed = cityName.toLowerCase().replace(/\s+/g, '-');
  return `https://picsum.photos/seed/${seed}/800/600`;
};

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
  {
    name: 'Africa',
    code: 'AF',
    imageUrl: 'https://images.unsplash.com/photo-1547471080-7cc2caa01a7e?w=800',
  },
  {
    name: 'Antarctica',
    code: 'AN',
    imageUrl: 'https://images.unsplash.com/photo-1551415923-a2297c7fda79?w=800',
  },
  {
    name: 'Asia',
    code: 'AS',
    imageUrl:
      'https://images.unsplash.com/photo-1480796927426-f609979314bd?w=800',
  },
  {
    name: 'Europe',
    code: 'EU',
    imageUrl:
      'https://images.unsplash.com/photo-1467269204594-9661b134dd2b?w=800',
  },
  {
    name: 'North America',
    code: 'NA',
    imageUrl:
      'https://images.unsplash.com/photo-1485738422979-f5c462d49f74?w=800',
  },
  {
    name: 'Oceania',
    code: 'OC',
    imageUrl:
      'https://images.unsplash.com/photo-1523482580672-f109ba8cb9be?w=800',
  },
  {
    name: 'South America',
    code: 'SA',
    imageUrl:
      'https://images.unsplash.com/photo-1483729558449-99ef09a8c325?w=800',
  },
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

const citiesData = [
  // Africa - Popular Cities
  { name: 'Algiers', country: 'Algeria', lat: 36.7538, lng: 3.0588 },
  { name: 'Oran', country: 'Algeria', lat: 35.6969, lng: -0.6331 },
  { name: 'Luanda', country: 'Angola', lat: -8.839, lng: 13.2894 },
  { name: 'Gaborone', country: 'Botswana', lat: -24.6282, lng: 25.9231 },
  { name: 'Douala', country: 'Cameroon', lat: 4.0511, lng: 9.7679 },
  { name: 'Yaounde', country: 'Cameroon', lat: 3.848, lng: 11.5021 },
  {
    name: 'Kinshasa',
    country: 'Democratic Republic of Congo',
    lat: -4.4419,
    lng: 15.2663,
  },
  { name: 'Cairo', country: 'Egypt', lat: 30.0444, lng: 31.2357 },
  { name: 'Alexandria', country: 'Egypt', lat: 31.2001, lng: 29.9187 },
  { name: 'Luxor', country: 'Egypt', lat: 25.6872, lng: 32.6396 },
  { name: 'Sharm El Sheikh', country: 'Egypt', lat: 27.9158, lng: 34.33 },
  { name: 'Hurghada', country: 'Egypt', lat: 27.2579, lng: 33.8116 },
  { name: 'Aswan', country: 'Egypt', lat: 24.0889, lng: 32.8998 },
  { name: 'Addis Ababa', country: 'Ethiopia', lat: 9.032, lng: 38.7489 },
  { name: 'Accra', country: 'Ghana', lat: 5.6037, lng: -0.187 },
  { name: 'Kumasi', country: 'Ghana', lat: 6.6885, lng: -1.6244 },
  { name: 'Abidjan', country: 'Ivory Coast', lat: 5.36, lng: -4.0083 },
  { name: 'Nairobi', country: 'Kenya', lat: -1.2921, lng: 36.8219 },
  { name: 'Mombasa', country: 'Kenya', lat: -4.0435, lng: 39.6682 },
  { name: 'Maasai Mara', country: 'Kenya', lat: -1.4061, lng: 35.0173 },
  { name: 'Antananarivo', country: 'Madagascar', lat: -18.8792, lng: 47.5079 },
  { name: 'Port Louis', country: 'Mauritius', lat: -20.1609, lng: 57.5012 },
  { name: 'Marrakech', country: 'Morocco', lat: 31.6295, lng: -7.9811 },
  { name: 'Fes', country: 'Morocco', lat: 34.0181, lng: -5.0078 },
  { name: 'Casablanca', country: 'Morocco', lat: 33.5731, lng: -7.5898 },
  { name: 'Chefchaouen', country: 'Morocco', lat: 35.1688, lng: -5.2636 },
  { name: 'Tangier', country: 'Morocco', lat: 35.7595, lng: -5.834 },
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
  {
    name: 'Johannesburg',
    country: 'South Africa',
    lat: -26.2041,
    lng: 28.0473,
  },
  { name: 'Durban', country: 'South Africa', lat: -29.8587, lng: 31.0218 },
  { name: 'Pretoria', country: 'South Africa', lat: -25.7479, lng: 28.2293 },
  {
    name: 'Kruger National Park',
    country: 'South Africa',
    lat: -23.9884,
    lng: 31.5547,
  },
  { name: 'Dar es Salaam', country: 'Tanzania', lat: -6.7924, lng: 39.2083 },
  { name: 'Zanzibar City', country: 'Tanzania', lat: -6.1622, lng: 39.1921 },
  { name: 'Serengeti', country: 'Tanzania', lat: -2.3333, lng: 34.8333 },
  { name: 'Arusha', country: 'Tanzania', lat: -3.3869, lng: 36.683 },
  { name: 'Tunis', country: 'Tunisia', lat: 36.8065, lng: 10.1815 },
  { name: 'Kampala', country: 'Uganda', lat: 0.3476, lng: 32.5825 },
  { name: 'Lusaka', country: 'Zambia', lat: -15.3875, lng: 28.3228 },
  { name: 'Victoria Falls', country: 'Zambia', lat: -17.9243, lng: 25.8572 },
  { name: 'Harare', country: 'Zimbabwe', lat: -17.8252, lng: 31.0335 },

  // Asia - Popular Cities
  { name: 'Dhaka', country: 'Bangladesh', lat: 23.8103, lng: 90.4125 },
  { name: 'Thimphu', country: 'Bhutan', lat: 27.4716, lng: 89.6386 },
  { name: 'Paro', country: 'Bhutan', lat: 27.4305, lng: 89.4136 },
  {
    name: 'Bandar Seri Begawan',
    country: 'Brunei',
    lat: 4.9031,
    lng: 114.9398,
  },
  { name: 'Phnom Penh', country: 'Cambodia', lat: 11.5564, lng: 104.9282 },
  { name: 'Siem Reap', country: 'Cambodia', lat: 13.3633, lng: 103.8564 },
  { name: 'Beijing', country: 'China', lat: 39.9042, lng: 116.4074 },
  { name: 'Shanghai', country: 'China', lat: 31.2304, lng: 121.4737 },
  { name: 'Guangzhou', country: 'China', lat: 23.1291, lng: 113.2644 },
  { name: 'Shenzhen', country: 'China', lat: 22.5431, lng: 114.0579 },
  { name: 'Chengdu', country: 'China', lat: 30.5728, lng: 104.0668 },
  { name: "Xi'an", country: 'China', lat: 34.3416, lng: 108.9398 },
  { name: 'Hangzhou', country: 'China', lat: 30.2741, lng: 120.1551 },
  { name: 'Guilin', country: 'China', lat: 25.274, lng: 110.299 },
  { name: 'Hong Kong', country: 'Hong Kong', lat: 22.3193, lng: 114.1694 },
  { name: 'Kowloon', country: 'Hong Kong', lat: 22.3193, lng: 114.1694 },
  { name: 'New Delhi', country: 'India', lat: 28.6139, lng: 77.209 },
  { name: 'Mumbai', country: 'India', lat: 19.076, lng: 72.8777 },
  { name: 'Jaipur', country: 'India', lat: 26.9124, lng: 75.7873 },
  { name: 'Agra', country: 'India', lat: 27.1767, lng: 78.0081 },
  { name: 'Varanasi', country: 'India', lat: 25.3176, lng: 82.9739 },
  { name: 'Goa', country: 'India', lat: 15.2993, lng: 74.124 },
  { name: 'Bangalore', country: 'India', lat: 12.9716, lng: 77.5946 },
  { name: 'Kerala', country: 'India', lat: 10.8505, lng: 76.2711 },
  { name: 'Udaipur', country: 'India', lat: 24.5854, lng: 73.7125 },
  { name: 'Kolkata', country: 'India', lat: 22.5726, lng: 88.3639 },
  { name: 'Jakarta', country: 'Indonesia', lat: -6.2088, lng: 106.8456 },
  { name: 'Bali', country: 'Indonesia', lat: -8.3405, lng: 115.092 },
  { name: 'Yogyakarta', country: 'Indonesia', lat: -7.7956, lng: 110.3695 },
  { name: 'Lombok', country: 'Indonesia', lat: -8.65, lng: 116.3249 },
  { name: 'Komodo', country: 'Indonesia', lat: -8.55, lng: 119.4333 },
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
  { name: 'Almaty', country: 'Kazakhstan', lat: 43.222, lng: 76.8512 },
  { name: 'Astana', country: 'Kazakhstan', lat: 51.1605, lng: 71.4704 },
  { name: 'Kuwait City', country: 'Kuwait', lat: 29.3759, lng: 47.9774 },
  { name: 'Bishkek', country: 'Kyrgyzstan', lat: 42.8746, lng: 74.5698 },
  { name: 'Vientiane', country: 'Laos', lat: 17.9757, lng: 102.6331 },
  { name: 'Luang Prabang', country: 'Laos', lat: 19.8847, lng: 102.135 },
  { name: 'Beirut', country: 'Lebanon', lat: 33.8938, lng: 35.5018 },
  { name: 'Macau', country: 'Macau', lat: 22.1987, lng: 113.5439 },
  { name: 'Kuala Lumpur', country: 'Malaysia', lat: 3.139, lng: 101.6869 },
  { name: 'Penang', country: 'Malaysia', lat: 5.4141, lng: 100.3288 },
  { name: 'Langkawi', country: 'Malaysia', lat: 6.35, lng: 99.8 },
  { name: 'Malacca', country: 'Malaysia', lat: 2.1896, lng: 102.2501 },
  { name: 'Kota Kinabalu', country: 'Malaysia', lat: 5.9804, lng: 116.0735 },
  { name: 'Male', country: 'Maldives', lat: 4.1755, lng: 73.5093 },
  { name: 'Ulaanbaatar', country: 'Mongolia', lat: 47.8864, lng: 106.9057 },
  { name: 'Yangon', country: 'Myanmar', lat: 16.8661, lng: 96.1951 },
  { name: 'Bagan', country: 'Myanmar', lat: 21.1717, lng: 94.8585 },
  { name: 'Kathmandu', country: 'Nepal', lat: 27.7172, lng: 85.324 },
  { name: 'Pokhara', country: 'Nepal', lat: 28.2096, lng: 83.9856 },
  { name: 'Muscat', country: 'Oman', lat: 23.588, lng: 58.3829 },
  { name: 'Islamabad', country: 'Pakistan', lat: 33.6844, lng: 73.0479 },
  { name: 'Lahore', country: 'Pakistan', lat: 31.5204, lng: 74.3587 },
  { name: 'Karachi', country: 'Pakistan', lat: 24.8607, lng: 67.0011 },
  { name: 'Manila', country: 'Philippines', lat: 14.5995, lng: 120.9842 },
  { name: 'Cebu', country: 'Philippines', lat: 10.3157, lng: 123.8854 },
  { name: 'Boracay', country: 'Philippines', lat: 11.9674, lng: 121.9248 },
  { name: 'Palawan', country: 'Philippines', lat: 9.8349, lng: 118.7384 },
  { name: 'Doha', country: 'Qatar', lat: 25.2854, lng: 51.531 },
  { name: 'Riyadh', country: 'Saudi Arabia', lat: 24.7136, lng: 46.6753 },
  { name: 'Jeddah', country: 'Saudi Arabia', lat: 21.4858, lng: 39.1925 },
  { name: 'Mecca', country: 'Saudi Arabia', lat: 21.4225, lng: 39.8262 },
  { name: 'Singapore', country: 'Singapore', lat: 1.3521, lng: 103.8198 },
  { name: 'Seoul', country: 'South Korea', lat: 37.5665, lng: 126.978 },
  { name: 'Busan', country: 'South Korea', lat: 35.1796, lng: 129.0756 },
  { name: 'Jeju Island', country: 'South Korea', lat: 33.4996, lng: 126.5312 },
  { name: 'Colombo', country: 'Sri Lanka', lat: 6.9271, lng: 79.8612 },
  { name: 'Kandy', country: 'Sri Lanka', lat: 7.2906, lng: 80.6337 },
  { name: 'Galle', country: 'Sri Lanka', lat: 6.0535, lng: 80.221 },
  { name: 'Taipei', country: 'Taiwan', lat: 25.033, lng: 121.5654 },
  { name: 'Kaohsiung', country: 'Taiwan', lat: 22.6273, lng: 120.3014 },
  { name: 'Bangkok', country: 'Thailand', lat: 13.7563, lng: 100.5018 },
  { name: 'Chiang Mai', country: 'Thailand', lat: 18.7883, lng: 98.9853 },
  { name: 'Phuket', country: 'Thailand', lat: 7.8804, lng: 98.3923 },
  { name: 'Krabi', country: 'Thailand', lat: 8.0863, lng: 98.9063 },
  { name: 'Koh Samui', country: 'Thailand', lat: 9.512, lng: 100.0134 },
  { name: 'Pattaya', country: 'Thailand', lat: 12.9236, lng: 100.8825 },
  { name: 'Istanbul', country: 'Turkey', lat: 41.0082, lng: 28.9784 },
  { name: 'Cappadocia', country: 'Turkey', lat: 38.6431, lng: 34.8289 },
  { name: 'Antalya', country: 'Turkey', lat: 36.8969, lng: 30.7133 },
  { name: 'Bodrum', country: 'Turkey', lat: 37.0344, lng: 27.4305 },
  { name: 'Pamukkale', country: 'Turkey', lat: 37.9137, lng: 29.1187 },
  {
    name: 'Dubai',
    country: 'United Arab Emirates',
    lat: 25.2048,
    lng: 55.2708,
  },
  {
    name: 'Abu Dhabi',
    country: 'United Arab Emirates',
    lat: 24.4539,
    lng: 54.3773,
  },
  {
    name: 'Sharjah',
    country: 'United Arab Emirates',
    lat: 25.3463,
    lng: 55.4209,
  },
  { name: 'Tashkent', country: 'Uzbekistan', lat: 41.2995, lng: 69.2401 },
  { name: 'Samarkand', country: 'Uzbekistan', lat: 39.6542, lng: 66.9597 },
  { name: 'Hanoi', country: 'Vietnam', lat: 21.0285, lng: 105.8542 },
  { name: 'Ho Chi Minh City', country: 'Vietnam', lat: 10.8231, lng: 106.6297 },
  { name: 'Da Nang', country: 'Vietnam', lat: 16.0544, lng: 108.2022 },
  { name: 'Hoi An', country: 'Vietnam', lat: 15.8801, lng: 108.338 },
  { name: 'Ha Long Bay', country: 'Vietnam', lat: 20.9101, lng: 107.1839 },
  { name: 'Nha Trang', country: 'Vietnam', lat: 12.2388, lng: 109.1967 },

  // Europe - Popular Cities
  { name: 'Tirana', country: 'Albania', lat: 41.3275, lng: 19.8187 },
  { name: 'Andorra la Vella', country: 'Andorra', lat: 42.5063, lng: 1.5218 },
  { name: 'Vienna', country: 'Austria', lat: 48.2082, lng: 16.3738 },
  { name: 'Salzburg', country: 'Austria', lat: 47.8095, lng: 13.055 },
  { name: 'Innsbruck', country: 'Austria', lat: 47.2692, lng: 11.4041 },
  { name: 'Minsk', country: 'Belarus', lat: 53.9045, lng: 27.5615 },
  { name: 'Brussels', country: 'Belgium', lat: 50.8503, lng: 4.3517 },
  { name: 'Bruges', country: 'Belgium', lat: 51.2093, lng: 3.2247 },
  { name: 'Antwerp', country: 'Belgium', lat: 51.2194, lng: 4.4025 },
  { name: 'Ghent', country: 'Belgium', lat: 51.0543, lng: 3.7174 },
  {
    name: 'Sarajevo',
    country: 'Bosnia and Herzegovina',
    lat: 43.8563,
    lng: 18.4131,
  },
  {
    name: 'Mostar',
    country: 'Bosnia and Herzegovina',
    lat: 43.3438,
    lng: 17.8078,
  },
  { name: 'Sofia', country: 'Bulgaria', lat: 42.6977, lng: 23.3219 },
  { name: 'Zagreb', country: 'Croatia', lat: 45.815, lng: 15.9819 },
  { name: 'Dubrovnik', country: 'Croatia', lat: 42.6507, lng: 18.0944 },
  { name: 'Split', country: 'Croatia', lat: 43.5081, lng: 16.4402 },
  { name: 'Plitvice Lakes', country: 'Croatia', lat: 44.8654, lng: 15.582 },
  { name: 'Nicosia', country: 'Cyprus', lat: 35.1856, lng: 33.3823 },
  { name: 'Limassol', country: 'Cyprus', lat: 34.7071, lng: 33.0226 },
  { name: 'Prague', country: 'Czech Republic', lat: 50.0755, lng: 14.4378 },
  {
    name: 'Cesky Krumlov',
    country: 'Czech Republic',
    lat: 48.8127,
    lng: 14.3175,
  },
  { name: 'Brno', country: 'Czech Republic', lat: 49.1951, lng: 16.6068 },
  { name: 'Copenhagen', country: 'Denmark', lat: 55.6761, lng: 12.5683 },
  { name: 'Tallinn', country: 'Estonia', lat: 59.437, lng: 24.7536 },
  { name: 'Helsinki', country: 'Finland', lat: 60.1699, lng: 24.9384 },
  { name: 'Rovaniemi', country: 'Finland', lat: 66.5039, lng: 25.7294 },
  { name: 'Paris', country: 'France', lat: 48.8566, lng: 2.3522 },
  { name: 'Nice', country: 'France', lat: 43.7102, lng: 7.262 },
  { name: 'Lyon', country: 'France', lat: 45.764, lng: 4.8357 },
  { name: 'Marseille', country: 'France', lat: 43.2965, lng: 5.3698 },
  { name: 'Bordeaux', country: 'France', lat: 44.8378, lng: -0.5792 },
  { name: 'Strasbourg', country: 'France', lat: 48.5734, lng: 7.7521 },
  { name: 'Cannes', country: 'France', lat: 43.5528, lng: 7.0174 },
  { name: 'Monaco', country: 'Monaco', lat: 43.7384, lng: 7.4246 },
  { name: 'Berlin', country: 'Germany', lat: 52.52, lng: 13.405 },
  { name: 'Munich', country: 'Germany', lat: 48.1351, lng: 11.582 },
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
  { name: 'Milan', country: 'Italy', lat: 45.4642, lng: 9.19 },
  { name: 'Naples', country: 'Italy', lat: 40.8518, lng: 14.2681 },
  { name: 'Amalfi Coast', country: 'Italy', lat: 40.634, lng: 14.6027 },
  { name: 'Cinque Terre', country: 'Italy', lat: 44.127, lng: 9.7132 },
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
  { name: 'Krakow', country: 'Poland', lat: 50.0647, lng: 19.945 },
  { name: 'Gdansk', country: 'Poland', lat: 54.352, lng: 18.6466 },
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
  { name: 'Bilbao', country: 'Spain', lat: 43.263, lng: -2.935 },
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
  { name: 'Oxford', country: 'United Kingdom', lat: 51.752, lng: -1.2577 },
  { name: 'Cambridge', country: 'United Kingdom', lat: 52.2053, lng: 0.1218 },
  { name: 'Bath', country: 'United Kingdom', lat: 51.3811, lng: -2.359 },
  { name: 'York', country: 'United Kingdom', lat: 53.96, lng: -1.0873 },
  { name: 'Glasgow', country: 'United Kingdom', lat: 55.8642, lng: -4.2518 },
  { name: 'Belfast', country: 'United Kingdom', lat: 54.5973, lng: -5.9301 },

  // North America - Popular Cities
  { name: 'Nassau', country: 'Bahamas', lat: 25.0343, lng: -77.3963 },
  { name: 'Bridgetown', country: 'Barbados', lat: 13.1132, lng: -59.5988 },
  { name: 'Belize City', country: 'Belize', lat: 17.4986, lng: -88.1886 },
  { name: 'Toronto', country: 'Canada', lat: 43.6532, lng: -79.3832 },
  { name: 'Vancouver', country: 'Canada', lat: 49.2827, lng: -123.1207 },
  { name: 'Montreal', country: 'Canada', lat: 45.5017, lng: -73.5673 },
  { name: 'Quebec City', country: 'Canada', lat: 46.8139, lng: -71.208 },
  { name: 'Calgary', country: 'Canada', lat: 51.0447, lng: -114.0719 },
  { name: 'Ottawa', country: 'Canada', lat: 45.4215, lng: -75.6972 },
  { name: 'Banff', country: 'Canada', lat: 51.1784, lng: -115.5708 },
  { name: 'Victoria', country: 'Canada', lat: 48.4284, lng: -123.3656 },
  { name: 'Whistler', country: 'Canada', lat: 50.1163, lng: -122.9574 },
  { name: 'Niagara Falls', country: 'Canada', lat: 43.0896, lng: -79.0849 },
  { name: 'San Jose', country: 'Costa Rica', lat: 9.9281, lng: -84.0907 },
  { name: 'La Fortuna', country: 'Costa Rica', lat: 10.4679, lng: -84.6427 },
  { name: 'Havana', country: 'Cuba', lat: 23.1136, lng: -82.3666 },
  { name: 'Varadero', country: 'Cuba', lat: 23.156, lng: -81.2503 },
  { name: 'Trinidad', country: 'Cuba', lat: 21.8023, lng: -79.9843 },
  {
    name: 'Punta Cana',
    country: 'Dominican Republic',
    lat: 18.5601,
    lng: -68.3725,
  },
  {
    name: 'Santo Domingo',
    country: 'Dominican Republic',
    lat: 18.4861,
    lng: -69.9312,
  },
  { name: 'San Salvador', country: 'El Salvador', lat: 13.6929, lng: -89.2182 },
  { name: 'Guatemala City', country: 'Guatemala', lat: 14.6349, lng: -90.5069 },
  {
    name: 'Antigua Guatemala',
    country: 'Guatemala',
    lat: 14.5586,
    lng: -90.7295,
  },
  { name: 'Port-au-Prince', country: 'Haiti', lat: 18.5944, lng: -72.3074 },
  { name: 'Tegucigalpa', country: 'Honduras', lat: 14.0723, lng: -87.1921 },
  { name: 'Roatan', country: 'Honduras', lat: 16.3419, lng: -86.515 },
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
  {
    name: 'San Miguel de Allende',
    country: 'Mexico',
    lat: 20.9144,
    lng: -100.7452,
  },
  { name: 'Managua', country: 'Nicaragua', lat: 12.115, lng: -86.2362 },
  { name: 'Granada', country: 'Nicaragua', lat: 11.9344, lng: -85.956 },
  { name: 'Panama City', country: 'Panama', lat: 8.9824, lng: -79.5199 },
  { name: 'Bocas del Toro', country: 'Panama', lat: 9.3404, lng: -82.2417 },
  { name: 'San Juan', country: 'Puerto Rico', lat: 18.4655, lng: -66.1057 },
  {
    name: 'Port of Spain',
    country: 'Trinidad and Tobago',
    lat: 10.6596,
    lng: -61.5086,
  },
  {
    name: 'New York City',
    country: 'United States',
    lat: 40.7128,
    lng: -74.006,
  },
  {
    name: 'Los Angeles',
    country: 'United States',
    lat: 34.0522,
    lng: -118.2437,
  },
  {
    name: 'San Francisco',
    country: 'United States',
    lat: 37.7749,
    lng: -122.4194,
  },
  { name: 'Miami', country: 'United States', lat: 25.7617, lng: -80.1918 },
  { name: 'Las Vegas', country: 'United States', lat: 36.1699, lng: -115.1398 },
  { name: 'Chicago', country: 'United States', lat: 41.8781, lng: -87.6298 },
  { name: 'Boston', country: 'United States', lat: 42.3601, lng: -71.0589 },
  { name: 'Seattle', country: 'United States', lat: 47.6062, lng: -122.3321 },
  {
    name: 'Washington D.C.',
    country: 'United States',
    lat: 38.9072,
    lng: -77.0369,
  },
  {
    name: 'New Orleans',
    country: 'United States',
    lat: 29.9511,
    lng: -90.0715,
  },
  { name: 'San Diego', country: 'United States', lat: 32.7157, lng: -117.1611 },
  { name: 'Orlando', country: 'United States', lat: 28.5383, lng: -81.3792 },
  { name: 'Honolulu', country: 'United States', lat: 21.3069, lng: -157.8583 },
  { name: 'Austin', country: 'United States', lat: 30.2672, lng: -97.7431 },
  { name: 'Nashville', country: 'United States', lat: 36.1627, lng: -86.7816 },
  { name: 'Denver', country: 'United States', lat: 39.7392, lng: -104.9903 },
  { name: 'Portland', country: 'United States', lat: 45.5152, lng: -122.6784 },
  { name: 'Phoenix', country: 'United States', lat: 33.4484, lng: -112.074 },
  {
    name: 'Philadelphia',
    country: 'United States',
    lat: 39.9526,
    lng: -75.1652,
  },
  { name: 'Atlanta', country: 'United States', lat: 33.749, lng: -84.388 },
  {
    name: 'Grand Canyon',
    country: 'United States',
    lat: 36.0544,
    lng: -112.1401,
  },
  {
    name: 'Yellowstone',
    country: 'United States',
    lat: 44.428,
    lng: -110.5885,
  },

  // South America - Popular Cities
  { name: 'Buenos Aires', country: 'Argentina', lat: -34.6037, lng: -58.3816 },
  { name: 'Mendoza', country: 'Argentina', lat: -32.8895, lng: -68.8458 },
  { name: 'Bariloche', country: 'Argentina', lat: -41.1335, lng: -71.3103 },
  { name: 'Ushuaia', country: 'Argentina', lat: -54.8019, lng: -68.303 },
  { name: 'Iguazu Falls', country: 'Argentina', lat: -25.6866, lng: -54.4445 },
  { name: 'La Paz', country: 'Bolivia', lat: -16.4897, lng: -68.1193 },
  { name: 'Uyuni', country: 'Bolivia', lat: -20.4637, lng: -66.8253 },
  { name: 'Rio de Janeiro', country: 'Brazil', lat: -22.9068, lng: -43.1729 },
  { name: 'Sao Paulo', country: 'Brazil', lat: -23.5505, lng: -46.6333 },
  { name: 'Salvador', country: 'Brazil', lat: -12.9714, lng: -38.5014 },
  { name: 'Florianopolis', country: 'Brazil', lat: -27.5954, lng: -48.548 },
  { name: 'Brasilia', country: 'Brazil', lat: -15.7942, lng: -47.8822 },
  { name: 'Manaus', country: 'Brazil', lat: -3.119, lng: -60.0217 },
  { name: 'Recife', country: 'Brazil', lat: -8.0476, lng: -34.877 },
  { name: 'Foz do Iguacu', country: 'Brazil', lat: -25.5163, lng: -54.5854 },
  { name: 'Santiago', country: 'Chile', lat: -33.4489, lng: -70.6693 },
  { name: 'Valparaiso', country: 'Chile', lat: -33.0472, lng: -71.6127 },
  { name: 'Atacama Desert', country: 'Chile', lat: -23.8634, lng: -69.1328 },
  { name: 'Torres del Paine', country: 'Chile', lat: -50.9423, lng: -73.4068 },
  { name: 'Easter Island', country: 'Chile', lat: -27.1127, lng: -109.3497 },
  { name: 'Bogota', country: 'Colombia', lat: 4.711, lng: -74.0721 },
  { name: 'Medellin', country: 'Colombia', lat: 6.2476, lng: -75.5658 },
  { name: 'Cartagena', country: 'Colombia', lat: 10.391, lng: -75.4794 },
  { name: 'Quito', country: 'Ecuador', lat: -0.1807, lng: -78.4678 },
  {
    name: 'Galapagos Islands',
    country: 'Ecuador',
    lat: -0.9538,
    lng: -90.9656,
  },
  { name: 'Cuenca', country: 'Ecuador', lat: -2.9001, lng: -79.0059 },
  { name: 'Georgetown', country: 'Guyana', lat: 6.8013, lng: -58.1551 },
  { name: 'Asuncion', country: 'Paraguay', lat: -25.2637, lng: -57.5759 },
  { name: 'Lima', country: 'Peru', lat: -12.0464, lng: -77.0428 },
  { name: 'Cusco', country: 'Peru', lat: -13.532, lng: -71.9675 },
  { name: 'Machu Picchu', country: 'Peru', lat: -13.1631, lng: -72.545 },
  { name: 'Arequipa', country: 'Peru', lat: -16.409, lng: -71.5375 },
  { name: 'Paramaribo', country: 'Suriname', lat: 5.852, lng: -55.2038 },
  { name: 'Montevideo', country: 'Uruguay', lat: -34.9011, lng: -56.1645 },
  { name: 'Punta del Este', country: 'Uruguay', lat: -34.9671, lng: -54.9507 },
  { name: 'Caracas', country: 'Venezuela', lat: 10.4806, lng: -66.9036 },
  { name: 'Angel Falls', country: 'Venezuela', lat: 5.9701, lng: -62.5362 },

  // Oceania - Popular Cities
  { name: 'Sydney', country: 'Australia', lat: -33.8688, lng: 151.2093 },
  { name: 'Melbourne', country: 'Australia', lat: -37.8136, lng: 144.9631 },
  { name: 'Brisbane', country: 'Australia', lat: -27.4698, lng: 153.0251 },
  { name: 'Perth', country: 'Australia', lat: -31.9505, lng: 115.8605 },
  { name: 'Gold Coast', country: 'Australia', lat: -28.0167, lng: 153.4 },
  { name: 'Adelaide', country: 'Australia', lat: -34.9285, lng: 138.6007 },
  { name: 'Cairns', country: 'Australia', lat: -16.9186, lng: 145.7781 },
  {
    name: 'Great Barrier Reef',
    country: 'Australia',
    lat: -18.2871,
    lng: 147.6992,
  },
  { name: 'Uluru', country: 'Australia', lat: -25.3444, lng: 131.0369 },
  { name: 'Tasmania', country: 'Australia', lat: -42.0409, lng: 146.8087 },
  { name: 'Suva', country: 'Fiji', lat: -18.1416, lng: 178.4419 },
  { name: 'Nadi', country: 'Fiji', lat: -17.7765, lng: 177.4356 },
  {
    name: 'Bora Bora',
    country: 'French Polynesia',
    lat: -16.5004,
    lng: -151.7415,
  },
  { name: 'Tahiti', country: 'French Polynesia', lat: -17.6509, lng: -149.426 },
  {
    name: 'Moorea',
    country: 'French Polynesia',
    lat: -17.5388,
    lng: -149.8295,
  },
  { name: 'Hagatna', country: 'Guam', lat: 13.4443, lng: 144.7937 },
  { name: 'Tarawa', country: 'Kiribati', lat: 1.3282, lng: 172.9784 },
  { name: 'Noumea', country: 'New Caledonia', lat: -22.2758, lng: 166.458 },
  { name: 'Auckland', country: 'New Zealand', lat: -36.8485, lng: 174.7633 },
  { name: 'Queenstown', country: 'New Zealand', lat: -45.0312, lng: 168.6626 },
  { name: 'Wellington', country: 'New Zealand', lat: -41.2866, lng: 174.7756 },
  { name: 'Rotorua', country: 'New Zealand', lat: -38.1368, lng: 176.2497 },
  {
    name: 'Christchurch',
    country: 'New Zealand',
    lat: -43.5321,
    lng: 172.6362,
  },
  {
    name: 'Milford Sound',
    country: 'New Zealand',
    lat: -44.6414,
    lng: 167.8975,
  },
  { name: 'Koror', country: 'Palau', lat: 7.3419, lng: 134.4792 },
  {
    name: 'Port Moresby',
    country: 'Papua New Guinea',
    lat: -9.4438,
    lng: 147.1803,
  },
  { name: 'Apia', country: 'Samoa', lat: -13.8506, lng: -171.7513 },
  { name: 'Honiara', country: 'Solomon Islands', lat: -9.428, lng: 159.9498 },
  { name: 'Nukualofa', country: 'Tonga', lat: -21.2114, lng: -175.1998 },
  { name: 'Port Vila', country: 'Vanuatu', lat: -17.7334, lng: 168.322 },
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
    await destinationRepo
      .createQueryBuilder()
      .delete()
      .from(Destination)
      .execute();
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
        // Get image: Teleport API for major cities, Lorem Picsum for others
        const imageUrl = getCityImageUrl(cityData.name);

        // Check if city already exists
        let city = await cityRepo.findOne({
          where: { name: cityData.name, countryId: country.id },
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
    console.log(
      `Seeded ${cityCount} new cities, updated ${updatedCount} existing cities`,
    );

    console.log('Seeding completed successfully!');
    await dataSource.destroy();
  } catch (error) {
    console.error('Error seeding database:', error);
    process.exit(1);
  }
}

void seed();
