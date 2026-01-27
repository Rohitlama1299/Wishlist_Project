import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

interface GeoapifyPlace {
  properties: {
    name?: string;
    categories?: string[];
    datasource?: {
      raw?: {
        description?: string;
        opening_hours?: string;
        fee?: string;
        website?: string;
        image?: string;
        wikimedia_commons?: string;
        wikidata?: string;
      };
    };
    wiki_and_media?: {
      image?: string;
      wikimedia_commons?: string;
      wikidata?: string;
    };
    address_line1?: string;
    address_line2?: string;
    lat: number;
    lon: number;
    place_id: string;
  };
}

interface GeoapifyResponse {
  features: GeoapifyPlace[];
}

export interface PlaceActivity {
  name: string;
  description: string;
  category: string;
  estimatedCost: number;
  duration: string;
  address?: string;
  imageUrl?: string;
}

@Injectable()
export class GeoapifyService {
  private readonly logger = new Logger(GeoapifyService.name);
  private readonly apiKey: string;
  private readonly baseUrl = 'https://api.geoapify.com/v2/places';

  // Map Geoapify categories to our activity categories
  private readonly categoryMap: Record<string, string> = {
    tourism: 'sightseeing',
    'tourism.sights': 'sightseeing',
    'tourism.attraction': 'sightseeing',
    'tourism.sights.memorial': 'culture',
    'tourism.sights.tower': 'sightseeing',
    'tourism.sights.castle': 'culture',
    'tourism.sights.ruins': 'culture',
    'tourism.sights.archaeological_site': 'culture',
    'tourism.sights.city_gate': 'sightseeing',
    'tourism.sights.bridge': 'sightseeing',
    entertainment: 'nightlife',
    'entertainment.culture': 'culture',
    'entertainment.culture.theatre': 'culture',
    'entertainment.culture.arts_centre': 'culture',
    'entertainment.museum': 'culture',
    'entertainment.zoo': 'nature',
    'entertainment.aquarium': 'nature',
    catering: 'food',
    'catering.restaurant': 'food',
    'catering.cafe': 'food',
    'catering.fast_food': 'food',
    'catering.bar': 'nightlife',
    'catering.pub': 'nightlife',
    'catering.ice_cream': 'food',
    leisure: 'adventure',
    'leisure.park': 'nature',
    'leisure.garden': 'nature',
    'leisure.playground': 'adventure',
    'leisure.spa': 'relaxation',
    natural: 'nature',
    'natural.water': 'nature',
    'natural.mountain': 'adventure',
    'natural.forest': 'nature',
    'natural.beach': 'nature',
    beach: 'nature',
    sport: 'adventure',
    'sport.swimming': 'adventure',
    'sport.diving': 'adventure',
    commercial: 'shopping',
    'commercial.shopping_mall': 'shopping',
    'commercial.marketplace': 'shopping',
    'commercial.outdoor_and_sport': 'shopping',
    'building.historic': 'culture',
    'heritage.unesco': 'culture',
    'religion.place_of_worship': 'culture',
  };

  // Categories to fetch from Geoapify
  private readonly categoriesToFetch = [
    'tourism.sights',
    'tourism.attraction',
    'entertainment.museum',
    'entertainment.culture',
    'catering.restaurant',
    'leisure.park',
    'natural',
    'beach',
    'commercial.marketplace',
    'heritage',
    'religion.place_of_worship',
  ];

  // Category-based fallback images from Unsplash
  private readonly categoryImages: Record<string, string> = {
    sightseeing: 'https://images.unsplash.com/photo-1469474968028-56623f02e42e?w=400&q=80',
    culture: 'https://images.unsplash.com/photo-1518998053901-5348d3961a04?w=400&q=80',
    food: 'https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=400&q=80',
    nature: 'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=400&q=80',
    adventure: 'https://images.unsplash.com/photo-1551632811-561732d1e306?w=400&q=80',
    nightlife: 'https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?w=400&q=80',
    shopping: 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=400&q=80',
    relaxation: 'https://images.unsplash.com/photo-1544161515-4ab6ce6db874?w=400&q=80',
  };

  constructor(private configService: ConfigService) {
    this.apiKey = this.configService.get<string>('GEOAPIFY_API_KEY') || '';
    if (!this.apiKey) {
      this.logger.warn('GEOAPIFY_API_KEY not configured');
    }
  }

  async getPlacesForCity(
    lat: number,
    lon: number,
    cityName: string,
  ): Promise<PlaceActivity[]> {
    if (!this.apiKey) {
      this.logger.warn('Geoapify API key not configured, returning empty');
      return [];
    }

    try {
      const categories = this.categoriesToFetch.join(',');
      const url = `${this.baseUrl}?categories=${categories}&filter=circle:${lon},${lat},5000&limit=30&apiKey=${this.apiKey}`;

      const response = await fetch(url);

      if (!response.ok) {
        this.logger.error(
          `Geoapify API error: ${response.status} ${response.statusText}`,
        );
        return [];
      }

      const data: GeoapifyResponse = await response.json();

      if (!data.features || data.features.length === 0) {
        this.logger.log(`No places found for ${cityName}`);
        return [];
      }

      // Transform and deduplicate places
      const activities = this.transformPlaces(data.features, cityName);

      this.logger.log(
        `Found ${activities.length} activities for ${cityName}`,
      );

      return activities;
    } catch (error) {
      this.logger.error(`Error fetching places for ${cityName}:`, error);
      return [];
    }
  }

  private transformPlaces(
    places: GeoapifyPlace[],
    cityName: string,
  ): PlaceActivity[] {
    const seenNames = new Set<string>();
    const activities: PlaceActivity[] = [];

    for (const place of places) {
      const name = place.properties.name;

      // Skip places without names or duplicates
      if (!name || seenNames.has(name.toLowerCase())) {
        continue;
      }

      seenNames.add(name.toLowerCase());

      // Determine category from Geoapify categories
      const category = this.mapCategory(place.properties.categories || []);

      // Generate description
      const description = this.generateDescription(place, cityName, category);

      // Estimate cost based on category
      const estimatedCost = this.estimateCost(category);

      // Estimate duration based on category
      const duration = this.estimateDuration(category);

      // Get image URL
      const imageUrl = this.getImageUrl(place, category);

      activities.push({
        name,
        description,
        category,
        estimatedCost,
        duration,
        address: place.properties.address_line2,
        imageUrl,
      });
    }

    // Sort by relevance and limit to top activities
    return activities.slice(0, 15);
  }

  private getImageUrl(place: GeoapifyPlace, category: string): string {
    // Try to get image from Wikimedia Commons
    const wikimediaCommons =
      place.properties.wiki_and_media?.wikimedia_commons ||
      place.properties.datasource?.raw?.wikimedia_commons;

    if (wikimediaCommons) {
      // Extract the category/file name and construct Wikimedia Commons thumbnail URL
      const commonsFile = wikimediaCommons.replace('Category:', '').replace(/ /g, '_');
      // Use Wikimedia Commons API to get a thumbnail
      return `https://commons.wikimedia.org/wiki/Special:FilePath/${encodeURIComponent(commonsFile)}?width=400`;
    }

    // Try direct image from datasource
    const directImage = place.properties.datasource?.raw?.image;
    if (directImage && directImage.startsWith('http')) {
      return directImage;
    }

    // Fallback to category-based image
    return this.categoryImages[category] || this.categoryImages.sightseeing;
  }

  private mapCategory(categories: string[]): string {
    for (const cat of categories) {
      // Check exact match first
      if (this.categoryMap[cat]) {
        return this.categoryMap[cat];
      }
      // Check parent category
      const parts = cat.split('.');
      while (parts.length > 0) {
        const parentCat = parts.join('.');
        if (this.categoryMap[parentCat]) {
          return this.categoryMap[parentCat];
        }
        parts.pop();
      }
    }
    return 'sightseeing'; // Default
  }

  private generateDescription(
    place: GeoapifyPlace,
    cityName: string,
    category: string,
  ): string {
    const name = place.properties.name || 'this place';
    const rawDesc = place.properties.datasource?.raw?.description;

    if (rawDesc && rawDesc.length > 10 && rawDesc.length < 200) {
      return rawDesc;
    }

    // Generate category-specific descriptions
    const descriptions: Record<string, string[]> = {
      sightseeing: [
        `Visit ${name}, one of ${cityName}'s notable landmarks`,
        `Explore ${name} and enjoy the views of ${cityName}`,
        `Discover ${name}, a must-see attraction in ${cityName}`,
      ],
      culture: [
        `Experience the cultural heritage at ${name}`,
        `Learn about local history and art at ${name}`,
        `Immerse yourself in culture at ${name} in ${cityName}`,
      ],
      food: [
        `Taste authentic local cuisine at ${name}`,
        `Enjoy a memorable dining experience at ${name}`,
        `Savor delicious food at ${name} in ${cityName}`,
      ],
      nature: [
        `Enjoy the natural beauty of ${name}`,
        `Relax and unwind at ${name} in ${cityName}`,
        `Connect with nature at ${name}`,
      ],
      adventure: [
        `Experience exciting activities at ${name}`,
        `Get your adrenaline pumping at ${name}`,
        `Enjoy outdoor adventures at ${name} in ${cityName}`,
      ],
      nightlife: [
        `Experience the nightlife at ${name}`,
        `Enjoy drinks and entertainment at ${name}`,
        `Have a great night out at ${name} in ${cityName}`,
      ],
      shopping: [
        `Shop for local goods and souvenirs at ${name}`,
        `Browse unique finds at ${name}`,
        `Discover local products at ${name} in ${cityName}`,
      ],
      relaxation: [
        `Relax and rejuvenate at ${name}`,
        `Treat yourself to relaxation at ${name}`,
        `Unwind at ${name} in ${cityName}`,
      ],
    };

    const options = descriptions[category] || descriptions.sightseeing;
    return options[Math.floor(Math.random() * options.length)];
  }

  private estimateCost(category: string): number {
    const costMap: Record<string, number> = {
      sightseeing: 10,
      culture: 15,
      food: 25,
      nature: 0,
      adventure: 40,
      nightlife: 30,
      shopping: 0,
      relaxation: 50,
    };
    return costMap[category] || 10;
  }

  private estimateDuration(category: string): string {
    const durationMap: Record<string, string> = {
      sightseeing: '1-2 hours',
      culture: '2-3 hours',
      food: '1-2 hours',
      nature: '2-3 hours',
      adventure: '3-4 hours',
      nightlife: '2-3 hours',
      shopping: '1-2 hours',
      relaxation: '2-3 hours',
    };
    return durationMap[category] || '1-2 hours';
  }
}
