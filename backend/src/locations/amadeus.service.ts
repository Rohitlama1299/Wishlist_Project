import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

interface AmadeusActivity {
  id: string;
  type: string;
  name: string;
  shortDescription?: string;
  description?: string;
  geoCode?: {
    latitude: number;
    longitude: number;
  };
  rating?: string;
  pictures?: string[];
  bookingLink?: string;
  price?: {
    currencyCode: string;
    amount: string;
  };
  minimumDuration?: string;
}

interface AmadeusResponse {
  data: AmadeusActivity[];
}

interface AmadeusTokenResponse {
  access_token: string;
  expires_in: number;
}

export interface PlaceActivity {
  name: string;
  description: string;
  category: string;
  estimatedCost: number;
  currency: string;
  duration: string;
  imageUrl?: string;
  bookingLink?: string;
  rating?: string;
}

@Injectable()
export class AmadeusService {
  private readonly logger = new Logger(AmadeusService.name);
  private readonly apiKey: string;
  private readonly apiSecret: string;
  // Using test environment - change to 'https://api.amadeus.com' for production
  private readonly baseUrl = 'https://test.api.amadeus.com';
  private accessToken: string | null = null;
  private tokenExpiry: number = 0;

  constructor(private configService: ConfigService) {
    this.apiKey = this.configService.get<string>('AMADEUS_API_KEY') || '';
    this.apiSecret = this.configService.get<string>('AMADEUS_API_SECRET') || '';

    this.logger.log(
      `Amadeus API Key loaded: ${this.apiKey ? 'YES (' + this.apiKey.substring(0, 5) + '...)' : 'NO'}`,
    );
    this.logger.log(
      `Amadeus API Secret loaded: ${this.apiSecret ? 'YES' : 'NO'}`,
    );

    if (!this.apiKey || !this.apiSecret) {
      this.logger.warn('Amadeus API credentials not configured');
    }
  }

  private async getAccessToken(): Promise<string | null> {
    // Return cached token if still valid
    if (this.accessToken && Date.now() < this.tokenExpiry) {
      return this.accessToken;
    }

    try {
      const response = await fetch(`${this.baseUrl}/v1/security/oauth2/token`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: new URLSearchParams({
          grant_type: 'client_credentials',
          client_id: this.apiKey,
          client_secret: this.apiSecret,
        }),
      });

      if (!response.ok) {
        const errorBody = await response.text();
        this.logger.error(`Amadeus auth error: ${response.status} - ${errorBody}`);
        return null;
      }

      const data = (await response.json()) as AmadeusTokenResponse;
      this.accessToken = data.access_token;
      // Set expiry 5 minutes before actual expiry for safety
      this.tokenExpiry = Date.now() + (data.expires_in - 300) * 1000;

      return this.accessToken;
    } catch (error) {
      this.logger.error('Error getting Amadeus access token:', error);
      return null;
    }
  }

  async getActivitiesForCity(
    lat: number | string,
    lon: number | string,
    cityName: string,
  ): Promise<PlaceActivity[]> {
    if (!this.apiKey || !this.apiSecret) {
      this.logger.warn('Amadeus API not configured');
      return [];
    }

    // Ensure lat/lon are numbers
    const latitude = typeof lat === 'string' ? parseFloat(lat) : lat;
    const longitude = typeof lon === 'string' ? parseFloat(lon) : lon;

    this.logger.log(
      `Fetching activities for ${cityName} at ${latitude}, ${longitude}`,
    );

    const token = await this.getAccessToken();
    if (!token) {
      this.logger.error('Failed to get Amadeus access token');
      return [];
    }

    try {
      // Use Tours and Activities API
      const url = `${this.baseUrl}/v1/shopping/activities?latitude=${latitude}&longitude=${longitude}&radius=20`;

      const response = await fetch(url, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        const errorText = await response.text();
        this.logger.error(
          `Amadeus API error: ${response.status} - ${errorText}`,
        );
        return [];
      }

      const data = (await response.json()) as AmadeusResponse;

      if (!data.data || data.data.length === 0) {
        this.logger.log(`No activities found for ${cityName}`);
        return [];
      }

      const activities = this.transformActivities(data.data, cityName);
      this.logger.log(`Found ${activities.length} activities for ${cityName}`);

      return activities;
    } catch (error) {
      this.logger.error(`Error fetching activities for ${cityName}:`, error);
      return [];
    }
  }

  private transformActivities(
    activities: AmadeusActivity[],
    cityName: string,
  ): PlaceActivity[] {
    const seenNames = new Set<string>();
    const result: PlaceActivity[] = [];

    for (const activity of activities) {
      const name = activity.name;

      // Skip duplicates
      if (!name || seenNames.has(name.toLowerCase())) {
        continue;
      }
      seenNames.add(name.toLowerCase());

      // Get description and strip HTML tags
      const rawDescription =
        activity.shortDescription ||
        activity.description ||
        `Experience ${name} in ${cityName}`;
      const description = this.stripHtml(rawDescription);

      // Determine category from activity type/name
      const category = this.determineCategory(activity);

      // Get price
      const estimatedCost = activity.price
        ? parseFloat(activity.price.amount) || 0
        : 0;
      const currency = activity.price?.currencyCode || 'USD';

      // Get duration
      const duration = activity.minimumDuration || '2-3 hours';

      // Get image
      const imageUrl =
        activity.pictures && activity.pictures.length > 0
          ? activity.pictures[0]
          : this.getCategoryImage(category);

      result.push({
        name,
        description: description.substring(0, 500), // Limit description length
        category,
        estimatedCost,
        currency,
        duration,
        imageUrl,
        bookingLink: activity.bookingLink,
        rating: activity.rating,
      });
    }

    // Return top 15 activities
    return result.slice(0, 15);
  }

  private determineCategory(activity: AmadeusActivity): string {
    const name = activity.name?.toLowerCase() || '';
    const desc = (
      activity.shortDescription ||
      activity.description ||
      ''
    ).toLowerCase();
    const combined = `${name} ${desc}`;

    if (
      combined.includes('museum') ||
      combined.includes('gallery') ||
      combined.includes('art')
    ) {
      return 'culture';
    }
    if (
      combined.includes('food') ||
      combined.includes('culinary') ||
      combined.includes('restaurant') ||
      combined.includes('tasting') ||
      combined.includes('dining') ||
      combined.includes('cooking')
    ) {
      return 'food';
    }
    if (
      combined.includes('adventure') ||
      combined.includes('hiking') ||
      combined.includes('climbing') ||
      combined.includes('rafting') ||
      combined.includes('zip')
    ) {
      return 'adventure';
    }
    if (
      combined.includes('nature') ||
      combined.includes('park') ||
      combined.includes('garden') ||
      combined.includes('beach') ||
      combined.includes('wildlife')
    ) {
      return 'nature';
    }
    if (
      combined.includes('night') ||
      combined.includes('bar') ||
      combined.includes('club') ||
      combined.includes('pub')
    ) {
      return 'nightlife';
    }
    if (
      combined.includes('shop') ||
      combined.includes('market') ||
      combined.includes('mall')
    ) {
      return 'shopping';
    }
    if (
      combined.includes('spa') ||
      combined.includes('wellness') ||
      combined.includes('relax') ||
      combined.includes('massage')
    ) {
      return 'relaxation';
    }
    if (
      combined.includes('tour') ||
      combined.includes('sightseeing') ||
      combined.includes('visit') ||
      combined.includes('landmark')
    ) {
      return 'sightseeing';
    }

    return 'sightseeing'; // Default category
  }

  private stripHtml(html: string): string {
    // Remove HTML tags
    let text = html.replace(/<[^>]*>/g, ' ');
    // Decode common HTML entities
    text = text
      .replace(/&nbsp;/g, ' ')
      .replace(/&amp;/g, '&')
      .replace(/&lt;/g, '<')
      .replace(/&gt;/g, '>')
      .replace(/&quot;/g, '"')
      .replace(/&#39;/g, "'")
      .replace(/&rsquo;/g, "'")
      .replace(/&lsquo;/g, "'")
      .replace(/&rdquo;/g, '"')
      .replace(/&ldquo;/g, '"')
      .replace(/&mdash;/g, '—')
      .replace(/&ndash;/g, '–');
    // Clean up extra whitespace
    text = text.replace(/\s+/g, ' ').trim();
    return text;
  }

  private getCategoryImage(category: string): string {
    const categoryImages: Record<string, string> = {
      sightseeing:
        'https://images.unsplash.com/photo-1469474968028-56623f02e42e?w=400&q=80',
      culture:
        'https://images.unsplash.com/photo-1518998053901-5348d3961a04?w=400&q=80',
      food: 'https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=400&q=80',
      nature:
        'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=400&q=80',
      adventure:
        'https://images.unsplash.com/photo-1551632811-561732d1e306?w=400&q=80',
      nightlife:
        'https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?w=400&q=80',
      shopping:
        'https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=400&q=80',
      relaxation:
        'https://images.unsplash.com/photo-1544161515-4ab6ce6db874?w=400&q=80',
    };

    return categoryImages[category] || categoryImages.sightseeing;
  }
}
