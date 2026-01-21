import { City } from './location.model';

export interface Photo {
  id: string;
  url: string;
  caption?: string;
  fileName?: string;
  sortOrder: number;
  destinationId: string;
  createdAt: Date;
}

export interface Activity {
  id: string;
  name: string;
  description?: string;
  category?: string;
  completed: boolean;
  estimatedCost?: number;
  currency?: string;
  sortOrder: number;
  destinationId: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface Destination {
  id: string;
  notes?: string;
  visited: boolean;
  visitedDate?: Date;
  plannedDate?: Date;
  priority: number;
  userId: string;
  cityId: number;
  city?: City;
  photos?: Photo[];
  activities?: Activity[];
  createdAt: Date;
  updatedAt: Date;
}

export interface CreateDestinationRequest {
  cityId: number;
  notes?: string;
  visited?: boolean;
  visitedDate?: string;
  plannedDate?: string;
  priority?: number;
}

export interface UpdateDestinationRequest {
  notes?: string;
  visited?: boolean;
  visitedDate?: string;
  plannedDate?: string;
  priority?: number;
}

export interface CreateActivityRequest {
  destinationId: string;
  name: string;
  description?: string;
  category?: string;
  completed?: boolean;
  estimatedCost?: number;
  currency?: string;
}

export interface CountryCity {
  id: number;
  name: string;
  imageUrl?: string;
  destinationId: string;
  visited: boolean;
}

export interface CountryDetail {
  id: number;
  name: string;
  code: string;
  continentName: string;
  cityCount: number;
  cities: CountryCity[];
}

export interface DestinationStats {
  totalDestinations: number;
  visitedCount: number;
  pendingCount: number;
  continentStats: Record<string, number>;
  countryStats: Record<string, number>;
  countryDetails: CountryDetail[];
}
