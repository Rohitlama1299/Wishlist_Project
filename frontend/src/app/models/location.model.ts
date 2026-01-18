export interface Continent {
  id: number;
  name: string;
  code: string;
  imageUrl?: string;
  countries?: Country[];
}

export interface Country {
  id: number;
  name: string;
  code: string;
  imageUrl?: string;
  flagUrl?: string;
  continentId: number;
  continent?: Continent;
  cities?: City[];
}

export interface City {
  id: number;
  name: string;
  imageUrl?: string;
  latitude?: number;
  longitude?: number;
  countryId: number;
  country?: Country;
}
