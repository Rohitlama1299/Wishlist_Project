import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatChipsModule } from '@angular/material/chips';
import { MatDialogModule, MatDialog } from '@angular/material/dialog';
import { LocationsService } from '../../../core/services/locations.service';
import { DestinationsService } from '../../../core/services/destinations.service';
import { Continent, Country, City } from '../../../models';
import { debounceTime, Subject } from 'rxjs';

@Component({
  selector: 'app-explore',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatInputModule,
    MatProgressSpinnerModule,
    MatSnackBarModule,
    MatChipsModule,
    MatDialogModule
  ],
  template: `
    <div class="explore-container">
      <header class="explore-header">
        <h1>Explore the World</h1>
        <p>Discover new destinations and add them to your wishlist</p>
      </header>

      <mat-form-field appearance="outline" class="search-field">
        <mat-label>Search cities</mat-label>
        <input matInput [(ngModel)]="searchQuery" (ngModelChange)="onSearch($event)" placeholder="Search for a city...">
        <mat-icon matPrefix>search</mat-icon>
        @if (searchQuery) {
          <button mat-icon-button matSuffix (click)="clearSearch()">
            <mat-icon>close</mat-icon>
          </button>
        }
      </mat-form-field>

      @if (searching()) {
        <div class="loading-container">
          <mat-spinner diameter="40"></mat-spinner>
        </div>
      } @else if (searchResults().length > 0) {
        <section class="search-results">
          <h2>Search Results</h2>
          <div class="cities-grid">
            @for (city of searchResults(); track city.id) {
              <mat-card class="city-card">
                <mat-card-content>
                  <h3>{{ city.name }}</h3>
                  <p class="location">
                    <mat-icon>location_on</mat-icon>
                    {{ city.country?.name }}, {{ city.country?.continent?.name }}
                  </p>
                </mat-card-content>
                <mat-card-actions>
                  <button mat-raised-button color="primary" (click)="addToWishlist(city)" [disabled]="addingCity() === city.id">
                    @if (addingCity() === city.id) {
                      <mat-spinner diameter="20"></mat-spinner>
                    } @else {
                      <mat-icon>add</mat-icon>
                      Add to Wishlist
                    }
                  </button>
                </mat-card-actions>
              </mat-card>
            }
          </div>
        </section>
      } @else if (searchQuery && !searching()) {
        <div class="no-results">
          <mat-icon>search_off</mat-icon>
          <p>No cities found matching "{{ searchQuery }}"</p>
        </div>
      }

      @if (!searchQuery) {
        <nav class="breadcrumb">
          <button mat-button (click)="goBack()" [disabled]="!selectedContinent()">
            <mat-icon>arrow_back</mat-icon>
            @if (selectedCountry()) {
              {{ selectedContinent()?.name }}
            } @else if (selectedContinent()) {
              All Continents
            }
          </button>
          @if (selectedContinent() && !selectedCountry()) {
            <span>{{ selectedContinent()?.name }}</span>
          }
          @if (selectedCountry()) {
            <span>{{ selectedCountry()?.name }}</span>
          }
        </nav>

        @if (loading()) {
          <div class="loading-container">
            <mat-spinner></mat-spinner>
          </div>
        } @else if (!selectedContinent()) {
          <section class="continents-section">
            <h2>Choose a Continent</h2>
            <div class="continents-grid">
              @for (continent of continents(); track continent.id) {
                <mat-card class="continent-card" (click)="selectContinent(continent)">
                  <div class="continent-image" [style.background-image]="'url(' + getContinentImage(continent.name) + ')'">
                    <div class="continent-overlay">
                      <h3>{{ continent.name }}</h3>
                    </div>
                  </div>
                </mat-card>
              }
            </div>
          </section>
        } @else if (!selectedCountry()) {
          <section class="countries-section">
            <h2>Countries in {{ selectedContinent()?.name }}</h2>
            <div class="countries-grid">
              @for (country of countries(); track country.id) {
                <mat-card class="country-card" (click)="selectCountry(country)">
                  <mat-card-content>
                    <h3>{{ country.name }}</h3>
                    <span class="country-code">{{ country.code }}</span>
                  </mat-card-content>
                </mat-card>
              }
            </div>
          </section>
        } @else {
          <section class="cities-section">
            <h2>Cities in {{ selectedCountry()?.name }}</h2>
            @if (cities().length > 0) {
              <div class="cities-grid">
                @for (city of cities(); track city.id) {
                  <mat-card class="city-card">
                    <mat-card-content>
                      <h3>{{ city.name }}</h3>
                      @if (city.latitude && city.longitude) {
                        <p class="coordinates">
                          <mat-icon>my_location</mat-icon>
                          {{ city.latitude | number:'1.2-2' }}, {{ city.longitude | number:'1.2-2' }}
                        </p>
                      }
                    </mat-card-content>
                    <mat-card-actions>
                      <button mat-raised-button color="primary" (click)="addToWishlist(city)" [disabled]="addingCity() === city.id">
                        @if (addingCity() === city.id) {
                          <mat-spinner diameter="20"></mat-spinner>
                        } @else {
                          <mat-icon>add</mat-icon>
                          Add to Wishlist
                        }
                      </button>
                    </mat-card-actions>
                  </mat-card>
                }
              </div>
            } @else {
              <div class="no-cities">
                <mat-icon>location_city</mat-icon>
                <p>No cities available for this country yet</p>
              </div>
            }
          </section>
        }
      }
    </div>
  `,
  styles: [`
    .explore-container {
      padding: 24px;
      max-width: 1400px;
      margin: 0 auto;
    }

    .explore-header {
      margin-bottom: 24px;
    }

    .explore-header h1 {
      margin: 0;
      font-size: 28px;
      color: #1a1a2e;
    }

    .explore-header p {
      margin: 8px 0 0;
      color: #666;
    }

    .search-field {
      width: 100%;
      max-width: 500px;
      margin-bottom: 24px;
    }

    .loading-container {
      display: flex;
      justify-content: center;
      padding: 48px;
    }

    .breadcrumb {
      margin-bottom: 24px;
      display: flex;
      align-items: center;
      gap: 8px;
    }

    .breadcrumb span {
      color: #667eea;
      font-weight: 500;
    }

    h2 {
      margin: 0 0 16px;
      font-size: 20px;
      color: #1a1a2e;
    }

    .continents-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
      gap: 24px;
    }

    .continent-card {
      cursor: pointer;
      overflow: hidden;
      transition: transform 0.2s, box-shadow 0.2s;
    }

    .continent-card:hover {
      transform: translateY(-4px);
      box-shadow: 0 8px 24px rgba(0,0,0,0.12);
    }

    .continent-image {
      height: 180px;
      background-size: cover;
      background-position: center;
      position: relative;
    }

    .continent-overlay {
      position: absolute;
      inset: 0;
      background: linear-gradient(to top, rgba(0,0,0,0.7), transparent);
      display: flex;
      align-items: flex-end;
      padding: 20px;
    }

    .continent-overlay h3 {
      margin: 0;
      color: white;
      font-size: 24px;
    }

    .countries-grid, .cities-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(240px, 1fr));
      gap: 16px;
    }

    .country-card {
      cursor: pointer;
      transition: transform 0.2s, box-shadow 0.2s;
    }

    .country-card:hover {
      transform: translateY(-2px);
      box-shadow: 0 4px 12px rgba(0,0,0,0.1);
    }

    .country-card h3 {
      margin: 0 0 4px;
      font-size: 18px;
      color: #1a1a2e;
    }

    .country-code {
      color: #666;
      font-size: 14px;
    }

    .city-card {
      display: flex;
      flex-direction: column;
    }

    .city-card mat-card-content {
      flex: 1;
    }

    .city-card h3 {
      margin: 0 0 8px;
      font-size: 18px;
      color: #1a1a2e;
    }

    .location, .coordinates {
      display: flex;
      align-items: center;
      gap: 4px;
      color: #666;
      font-size: 14px;
      margin: 0;
    }

    .location mat-icon, .coordinates mat-icon {
      font-size: 16px;
      width: 16px;
      height: 16px;
    }

    .city-card mat-card-actions {
      padding: 8px 16px 16px;
    }

    .no-results, .no-cities {
      text-align: center;
      padding: 48px;
      color: #666;
    }

    .no-results mat-icon, .no-cities mat-icon {
      font-size: 64px;
      width: 64px;
      height: 64px;
      color: #ccc;
    }

    .search-results h2 {
      margin-bottom: 16px;
    }
  `]
})
export class ExploreComponent implements OnInit {
  loading = signal(true);
  searching = signal(false);
  searchQuery = '';
  searchResults = signal<City[]>([]);

  continents = signal<Continent[]>([]);
  countries = signal<Country[]>([]);
  cities = signal<City[]>([]);

  selectedContinent = signal<Continent | null>(null);
  selectedCountry = signal<Country | null>(null);
  addingCity = signal<number | null>(null);

  private searchSubject = new Subject<string>();

  constructor(
    private locationsService: LocationsService,
    private destinationsService: DestinationsService,
    private snackBar: MatSnackBar
  ) {
    this.searchSubject.pipe(debounceTime(300)).subscribe(query => {
      if (query.length >= 2) {
        this.performSearch(query);
      } else {
        this.searchResults.set([]);
        this.searching.set(false);
      }
    });
  }

  ngOnInit(): void {
    this.loadContinents();
  }

  loadContinents(): void {
    this.locationsService.getContinents().subscribe({
      next: (continents) => {
        this.continents.set(continents);
        this.loading.set(false);
      },
      error: () => this.loading.set(false)
    });
  }

  selectContinent(continent: Continent): void {
    this.selectedContinent.set(continent);
    this.loading.set(true);
    this.locationsService.getCountriesByContinent(continent.id).subscribe({
      next: (countries) => {
        this.countries.set(countries);
        this.loading.set(false);
      },
      error: () => this.loading.set(false)
    });
  }

  selectCountry(country: Country): void {
    this.selectedCountry.set(country);
    this.loading.set(true);
    this.locationsService.getCitiesByCountry(country.id).subscribe({
      next: (cities) => {
        this.cities.set(cities);
        this.loading.set(false);
      },
      error: () => this.loading.set(false)
    });
  }

  goBack(): void {
    if (this.selectedCountry()) {
      this.selectedCountry.set(null);
      this.cities.set([]);
    } else if (this.selectedContinent()) {
      this.selectedContinent.set(null);
      this.countries.set([]);
    }
  }

  onSearch(query: string): void {
    if (query.length >= 2) {
      this.searching.set(true);
    }
    this.searchSubject.next(query);
  }

  performSearch(query: string): void {
    this.locationsService.searchCities(query).subscribe({
      next: (cities) => {
        this.searchResults.set(cities);
        this.searching.set(false);
      },
      error: () => this.searching.set(false)
    });
  }

  clearSearch(): void {
    this.searchQuery = '';
    this.searchResults.set([]);
  }

  addToWishlist(city: City): void {
    this.addingCity.set(city.id);
    this.destinationsService.createDestination({ cityId: city.id }).subscribe({
      next: () => {
        this.snackBar.open(`${city.name} added to your wishlist!`, 'Close', { duration: 3000 });
        this.addingCity.set(null);
      },
      error: (error) => {
        this.snackBar.open(error.error?.message || 'Failed to add destination', 'Close', { duration: 3000 });
        this.addingCity.set(null);
      }
    });
  }

  getContinentImage(name: string): string {
    const images: Record<string, string> = {
      'Africa': 'https://images.unsplash.com/photo-1516026672322-bc52d61a55d5?w=600',
      'Antarctica': 'https://images.unsplash.com/photo-1551415923-a2297c7fda79?w=600',
      'Asia': 'https://images.unsplash.com/photo-1480796927426-f609979314bd?w=600',
      'Europe': 'https://images.unsplash.com/photo-1467269204594-9661b134dd2b?w=600',
      'North America': 'https://images.unsplash.com/photo-1485738422979-f5c462d49f74?w=600',
      'Oceania': 'https://images.unsplash.com/photo-1523482580672-f109ba8cb9be?w=600',
      'South America': 'https://images.unsplash.com/photo-1483729558449-99ef09a8c325?w=600'
    };
    return images[name] || 'https://images.unsplash.com/photo-1488646953014-85cb44e25828?w=600';
  }
}
