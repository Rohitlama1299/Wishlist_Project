import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { Continent, Country, City, CityActivity } from '../../models';

@Injectable({
  providedIn: 'root'
})
export class LocationsService {
  private readonly apiUrl = `${environment.apiUrl}/locations`;

  constructor(private http: HttpClient) {}

  // Continents
  getContinents(): Observable<Continent[]> {
    return this.http.get<Continent[]>(`${this.apiUrl}/continents`);
  }

  getContinent(id: number): Observable<Continent> {
    return this.http.get<Continent>(`${this.apiUrl}/continents/${id}`);
  }

  getCountriesByContinent(continentId: number): Observable<Country[]> {
    return this.http.get<Country[]>(`${this.apiUrl}/continents/${continentId}/countries`);
  }

  // Countries
  getCountries(): Observable<Country[]> {
    return this.http.get<Country[]>(`${this.apiUrl}/countries`);
  }

  getCountry(id: number): Observable<Country> {
    return this.http.get<Country>(`${this.apiUrl}/countries/${id}`);
  }

  getCitiesByCountry(countryId: number): Observable<City[]> {
    return this.http.get<City[]>(`${this.apiUrl}/countries/${countryId}/cities`);
  }

  // Search
  searchLocations(query: string): Observable<{ countries: Country[]; cities: City[] }> {
    return this.http.get<{ countries: Country[]; cities: City[] }>(`${this.apiUrl}/search`, {
      params: { q: query }
    });
  }

  // Cities
  searchCities(query: string): Observable<City[]> {
    return this.http.get<City[]>(`${this.apiUrl}/cities/search`, {
      params: { q: query }
    });
  }

  getCity(id: number): Observable<City> {
    return this.http.get<City>(`${this.apiUrl}/cities/${id}`);
  }

  // City Activities
  getCityActivities(cityId: number): Observable<CityActivity[]> {
    return this.http.get<CityActivity[]>(`${this.apiUrl}/cities/${cityId}/activities`);
  }
}
