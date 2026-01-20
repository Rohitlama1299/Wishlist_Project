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
import { MatDialogModule } from '@angular/material/dialog';
import { MatTabsModule } from '@angular/material/tabs';
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
    MatDialogModule,
    MatTabsModule
  ],
  template: `
    <div class="explore-container">
      <header class="explore-header">
        <div class="header-content">
          <h1>Explore the World</h1>
          <p>Discover amazing destinations and add them to your travel wishlist</p>
        </div>
        <div class="header-stats">
          <div class="stat">
            <span class="stat-number">{{ continents().length }}</span>
            <span class="stat-label">Continents</span>
          </div>
          <div class="stat">
            <span class="stat-number">{{ totalCountries }}</span>
            <span class="stat-label">Countries</span>
          </div>
          <div class="stat">
            <span class="stat-number">{{ totalCities }}+</span>
            <span class="stat-label">Cities</span>
          </div>
        </div>
      </header>

      <div class="search-section">
        <div class="search-container">
          <mat-icon class="search-icon">search</mat-icon>
          <input
            type="text"
            [(ngModel)]="searchQuery"
            (ngModelChange)="onSearch($event)"
            placeholder="Search for countries or cities..."
            class="search-input"
          >
          @if (searchQuery) {
            <button class="clear-btn" (click)="clearSearch()">
              <mat-icon>close</mat-icon>
            </button>
          }
        </div>
      </div>

      @if (searching()) {
        <div class="loading-container">
          <mat-spinner diameter="40"></mat-spinner>
          <p>Searching...</p>
        </div>
      } @else if (searchQuery && (searchResultsCountries().length > 0 || searchResultsCities().length > 0)) {
        <section class="search-results">
          @if (searchResultsCountries().length > 0) {
            <div class="results-section">
              <h2>
                <mat-icon>flag</mat-icon>
                Countries
              </h2>
              <div class="countries-results-grid">
                @for (country of searchResultsCountries(); track country.id) {
                  <mat-card class="country-result-card" (click)="selectCountryFromSearch(country)">
                    <div class="country-flag">{{ getFlag(country.code) }}</div>
                    <div class="country-info">
                      <h3>{{ country.name }}</h3>
                      <span class="continent-badge">{{ country.continent?.name }}</span>
                    </div>
                    <mat-icon class="arrow-icon">chevron_right</mat-icon>
                  </mat-card>
                }
              </div>
            </div>
          }

          @if (searchResultsCities().length > 0) {
            <div class="results-section">
              <h2>
                <mat-icon>location_city</mat-icon>
                Cities
              </h2>
              <div class="cities-results-grid">
                @for (city of searchResultsCities(); track city.id) {
                  <mat-card class="city-result-card">
                    <mat-card-content>
                      <div class="city-header">
                        <h3>{{ city.name }}</h3>
                        <span class="city-flag">{{ getFlag(city.country?.code || '') }}</span>
                      </div>
                      <p class="city-location">
                        <mat-icon>place</mat-icon>
                        {{ city.country?.name }}, {{ city.country?.continent?.name }}
                      </p>
                    </mat-card-content>
                    <mat-card-actions>
                      <button mat-flat-button color="primary" (click)="addToWishlist(city)" [disabled]="addingCity() === city.id">
                        @if (addingCity() === city.id) {
                          <mat-spinner diameter="18"></mat-spinner>
                        } @else {
                          <mat-icon>add</mat-icon>
                          Add to Wishlist
                        }
                      </button>
                    </mat-card-actions>
                  </mat-card>
                }
              </div>
            </div>
          }
        </section>
      } @else if (searchQuery && !searching()) {
        <div class="no-results">
          <mat-icon>search_off</mat-icon>
          <h3>No results found</h3>
          <p>No countries or cities matching "{{ searchQuery }}"</p>
        </div>
      }

      @if (!searchQuery) {
        <nav class="breadcrumb">
          @if (selectedContinent() || selectedCountry()) {
            <button class="breadcrumb-btn" (click)="goToHome()">
              <mat-icon>public</mat-icon>
              All Continents
            </button>
            @if (selectedContinent()) {
              <mat-icon class="breadcrumb-separator">chevron_right</mat-icon>
              <button class="breadcrumb-btn" [class.active]="!selectedCountry()" (click)="goToContinent()">
                {{ selectedContinent()?.name }}
              </button>
            }
            @if (selectedCountry()) {
              <mat-icon class="breadcrumb-separator">chevron_right</mat-icon>
              <span class="breadcrumb-current">{{ selectedCountry()?.name }}</span>
            }
          }
        </nav>

        @if (loading()) {
          <div class="loading-container">
            <mat-spinner></mat-spinner>
            <p>Loading...</p>
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
                      <p class="continent-desc">{{ getContinentDescription(continent.name) }}</p>
                    </div>
                  </div>
                </mat-card>
              }
            </div>
          </section>
        } @else if (!selectedCountry()) {
          <section class="countries-section">
            <div class="section-header">
              <h2>Countries in {{ selectedContinent()?.name }}</h2>
              <span class="count-badge">{{ countries().length }} countries</span>
            </div>
            <div class="countries-grid">
              @for (country of countries(); track country.id) {
                <mat-card class="country-card" (click)="selectCountry(country)">
                  <div class="country-flag-large">{{ getFlag(country.code) }}</div>
                  <div class="country-content">
                    <h3>{{ country.name }}</h3>
                    <span class="country-code">{{ country.code }}</span>
                  </div>
                </mat-card>
              }
            </div>
          </section>
        } @else {
          <section class="cities-section">
            <div class="section-header">
              <h2>
                <span class="country-flag-inline">{{ getFlag(selectedCountry()?.code || '') }}</span>
                Popular Cities in {{ selectedCountry()?.name }}
              </h2>
              <span class="count-badge">{{ cities().length }} cities</span>
            </div>
            @if (cities().length > 0) {
              <div class="cities-grid">
                @for (city of cities(); track city.id) {
                  <mat-card class="city-card">
                    <div class="city-image" [style.background-image]="'url(' + getCityImage(city.name, selectedCountry()?.name || '') + ')'">
                      <div class="city-overlay">
                        <h3>{{ city.name }}</h3>
                      </div>
                    </div>
                    <mat-card-actions>
                      <button mat-flat-button color="primary" (click)="addToWishlist(city)" [disabled]="addingCity() === city.id">
                        @if (addingCity() === city.id) {
                          <mat-spinner diameter="18"></mat-spinner>
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
                <h3>No cities available yet</h3>
                <p>We're working on adding cities for this country</p>
              </div>
            }
          </section>
        }
      }
    </div>
  `,
  styles: [`
    .explore-container {
      min-height: 100vh;
      background: linear-gradient(135deg, #f8f9ff 0%, #f0f4ff 100%);
    }

    .explore-header {
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      padding: 48px 32px;
      color: white;
      display: flex;
      justify-content: space-between;
      align-items: center;
      flex-wrap: wrap;
      gap: 24px;
    }

    .header-content h1 {
      margin: 0;
      font-size: 36px;
      font-weight: 700;
    }

    .header-content p {
      margin: 8px 0 0;
      opacity: 0.9;
      font-size: 16px;
    }

    .header-stats {
      display: flex;
      gap: 32px;
    }

    .stat {
      text-align: center;
    }

    .stat-number {
      display: block;
      font-size: 32px;
      font-weight: 700;
    }

    .stat-label {
      font-size: 14px;
      opacity: 0.8;
    }

    .search-section {
      padding: 24px 32px;
      margin-top: -30px;
      position: relative;
      z-index: 10;
    }

    .search-container {
      max-width: 700px;
      margin: 0 auto;
      background: white;
      border-radius: 16px;
      box-shadow: 0 8px 32px rgba(102, 126, 234, 0.2);
      display: flex;
      align-items: center;
      padding: 8px 20px;
      gap: 12px;
    }

    .search-icon {
      color: #667eea;
      font-size: 28px;
      width: 28px;
      height: 28px;
    }

    .search-input {
      flex: 1;
      border: none;
      outline: none;
      font-size: 18px;
      padding: 16px 0;
      background: transparent;
    }

    .search-input::placeholder {
      color: #999;
    }

    .clear-btn {
      background: #f0f0f0;
      border: none;
      border-radius: 50%;
      width: 32px;
      height: 32px;
      display: flex;
      align-items: center;
      justify-content: center;
      cursor: pointer;
      transition: all 0.2s;
    }

    .clear-btn:hover {
      background: #e0e0e0;
    }

    .clear-btn mat-icon {
      font-size: 18px;
      width: 18px;
      height: 18px;
    }

    .loading-container {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      padding: 80px;
      gap: 16px;
      color: #666;
    }

    .breadcrumb {
      padding: 16px 32px;
      display: flex;
      align-items: center;
      gap: 8px;
      flex-wrap: wrap;
    }

    .breadcrumb-btn {
      display: flex;
      align-items: center;
      gap: 6px;
      background: white;
      border: 1px solid #e0e0e0;
      padding: 8px 16px;
      border-radius: 24px;
      cursor: pointer;
      font-size: 14px;
      color: #666;
      transition: all 0.2s;
    }

    .breadcrumb-btn:hover {
      background: #f5f5f5;
      border-color: #667eea;
      color: #667eea;
    }

    .breadcrumb-btn.active {
      background: #667eea;
      color: white;
      border-color: #667eea;
    }

    .breadcrumb-btn mat-icon {
      font-size: 18px;
      width: 18px;
      height: 18px;
    }

    .breadcrumb-separator {
      color: #ccc;
      font-size: 20px;
    }

    .breadcrumb-current {
      font-weight: 600;
      color: #333;
    }

    section {
      padding: 24px 32px 48px;
    }

    h2 {
      margin: 0 0 24px;
      font-size: 24px;
      color: #1a1a2e;
      display: flex;
      align-items: center;
      gap: 12px;
    }

    h2 mat-icon {
      color: #667eea;
    }

    .section-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 24px;
    }

    .section-header h2 {
      margin: 0;
    }

    .count-badge {
      background: #667eea20;
      color: #667eea;
      padding: 6px 16px;
      border-radius: 20px;
      font-size: 14px;
      font-weight: 500;
    }

    .continents-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
      gap: 24px;
    }

    .continent-card {
      cursor: pointer;
      overflow: hidden;
      transition: all 0.3s;
      border-radius: 16px !important;
    }

    .continent-card:hover {
      transform: translateY(-8px);
      box-shadow: 0 20px 40px rgba(0,0,0,0.15);
    }

    .continent-image {
      height: 220px;
      background-size: cover;
      background-position: center;
      position: relative;
    }

    .continent-overlay {
      position: absolute;
      inset: 0;
      background: linear-gradient(to top, rgba(0,0,0,0.8) 0%, rgba(0,0,0,0.2) 60%, transparent 100%);
      display: flex;
      flex-direction: column;
      justify-content: flex-end;
      padding: 24px;
    }

    .continent-overlay h3 {
      margin: 0;
      color: white;
      font-size: 28px;
      font-weight: 700;
    }

    .continent-desc {
      margin: 8px 0 0;
      color: rgba(255,255,255,0.8);
      font-size: 14px;
    }

    .countries-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
      gap: 16px;
    }

    .country-card {
      cursor: pointer;
      transition: all 0.2s;
      border-radius: 12px !important;
      padding: 20px;
      display: flex;
      flex-direction: column;
      align-items: center;
      text-align: center;
      gap: 12px;
    }

    .country-card:hover {
      transform: translateY(-4px);
      box-shadow: 0 8px 24px rgba(0,0,0,0.1);
      border-color: #667eea;
    }

    .country-flag-large {
      font-size: 48px;
      line-height: 1;
    }

    .country-content h3 {
      margin: 0;
      font-size: 16px;
      color: #1a1a2e;
      font-weight: 600;
    }

    .country-code {
      color: #999;
      font-size: 12px;
    }

    .cities-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
      gap: 24px;
    }

    .city-card {
      border-radius: 16px !important;
      overflow: hidden;
      transition: all 0.2s;
    }

    .city-card:hover {
      transform: translateY(-4px);
      box-shadow: 0 12px 32px rgba(0,0,0,0.12);
    }

    .city-image {
      height: 160px;
      background-size: cover;
      background-position: center;
      background-color: #e8e8e8;
      position: relative;
    }

    .city-overlay {
      position: absolute;
      inset: 0;
      background: linear-gradient(to top, rgba(0,0,0,0.7), transparent);
      display: flex;
      align-items: flex-end;
      padding: 16px;
    }

    .city-overlay h3 {
      margin: 0;
      color: white;
      font-size: 20px;
      font-weight: 600;
    }

    .city-card mat-card-actions {
      padding: 12px 16px 16px;
    }

    .city-card mat-card-actions button {
      width: 100%;
      border-radius: 8px;
    }

    .no-results, .no-cities {
      text-align: center;
      padding: 80px 20px;
      color: #666;
    }

    .no-results mat-icon, .no-cities mat-icon {
      font-size: 80px;
      width: 80px;
      height: 80px;
      color: #ddd;
      margin-bottom: 16px;
    }

    .no-results h3, .no-cities h3 {
      margin: 0 0 8px;
      color: #333;
    }

    .no-results p, .no-cities p {
      margin: 0;
    }

    .search-results {
      padding: 24px 32px;
    }

    .results-section {
      margin-bottom: 32px;
    }

    .results-section h2 {
      font-size: 18px;
      margin-bottom: 16px;
    }

    .countries-results-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
      gap: 12px;
    }

    .country-result-card {
      display: flex;
      align-items: center;
      padding: 16px 20px;
      gap: 16px;
      cursor: pointer;
      border-radius: 12px !important;
      transition: all 0.2s;
    }

    .country-result-card:hover {
      background: #f8f9ff;
      transform: translateX(4px);
    }

    .country-flag {
      font-size: 32px;
    }

    .country-info {
      flex: 1;
    }

    .country-info h3 {
      margin: 0 0 4px;
      font-size: 16px;
      color: #1a1a2e;
    }

    .continent-badge {
      font-size: 12px;
      color: #667eea;
      background: #667eea15;
      padding: 2px 8px;
      border-radius: 4px;
    }

    .arrow-icon {
      color: #ccc;
    }

    .cities-results-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
      gap: 16px;
    }

    .city-result-card {
      border-radius: 12px !important;
    }

    .city-result-card mat-card-content {
      padding: 16px;
    }

    .city-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 8px;
    }

    .city-header h3 {
      margin: 0;
      font-size: 18px;
      color: #1a1a2e;
    }

    .city-flag {
      font-size: 24px;
    }

    .city-location {
      display: flex;
      align-items: center;
      gap: 6px;
      color: #666;
      font-size: 13px;
      margin: 0;
    }

    .city-location mat-icon {
      font-size: 16px;
      width: 16px;
      height: 16px;
      color: #667eea;
    }

    .city-result-card mat-card-actions {
      padding: 12px 16px 16px;
    }

    .city-result-card mat-card-actions button {
      width: 100%;
      border-radius: 8px;
    }

    .country-flag-inline {
      font-size: 28px;
      margin-right: 8px;
    }

    /* Tablet */
    @media (max-width: 1024px) and (min-width: 769px) {
      .explore-header {
        padding: 40px 24px;
      }

      .header-content h1 {
        font-size: 30px;
      }

      .continents-grid {
        grid-template-columns: repeat(2, 1fr);
      }

      .countries-grid {
        grid-template-columns: repeat(3, 1fr);
      }

      .cities-grid {
        grid-template-columns: repeat(2, 1fr);
      }
    }

    /* Mobile */
    @media (max-width: 768px) {
      .explore-header {
        padding: 24px 16px;
        flex-direction: column;
        text-align: center;
      }

      .header-content h1 {
        font-size: 24px;
      }

      .header-content p {
        font-size: 14px;
      }

      .header-stats {
        gap: 20px;
      }

      .stat-number {
        font-size: 24px;
      }

      .stat-label {
        font-size: 12px;
      }

      .search-section {
        padding: 16px;
        margin-top: -20px;
      }

      .search-container {
        border-radius: 12px;
        padding: 6px 16px;
      }

      .search-icon {
        font-size: 24px;
        width: 24px;
        height: 24px;
      }

      .search-input {
        font-size: 16px;
        padding: 12px 0;
      }

      section {
        padding: 16px;
      }

      h2 {
        font-size: 20px;
      }

      .section-header {
        flex-direction: column;
        align-items: flex-start;
        gap: 12px;
      }

      .continents-grid {
        grid-template-columns: 1fr;
        gap: 16px;
      }

      .continent-image {
        height: 180px;
      }

      .continent-overlay h3 {
        font-size: 22px;
      }

      .countries-grid {
        grid-template-columns: repeat(2, 1fr);
        gap: 12px;
      }

      .country-card {
        padding: 16px;
      }

      .country-flag-large {
        font-size: 36px;
      }

      .country-content h3 {
        font-size: 14px;
      }

      .cities-grid {
        grid-template-columns: 1fr;
        gap: 16px;
      }

      .city-image {
        height: 140px;
      }

      .breadcrumb {
        padding: 12px 16px;
        gap: 6px;
      }

      .breadcrumb-btn {
        padding: 6px 12px;
        font-size: 13px;
      }

      .countries-results-grid,
      .cities-results-grid {
        grid-template-columns: 1fr;
      }

      .search-results {
        padding: 16px;
      }

      .no-results, .no-cities {
        padding: 60px 16px;
      }

      .no-results mat-icon, .no-cities mat-icon {
        font-size: 60px;
        width: 60px;
        height: 60px;
      }
    }

    /* Small mobile */
    @media (max-width: 480px) {
      .explore-header {
        padding: 20px 12px;
      }

      .header-content h1 {
        font-size: 20px;
      }

      .header-stats {
        gap: 16px;
      }

      .stat-number {
        font-size: 20px;
      }

      .search-section {
        padding: 12px;
      }

      section {
        padding: 12px;
      }

      .countries-grid {
        grid-template-columns: 1fr;
      }

      .country-card {
        flex-direction: row;
        text-align: left;
        gap: 16px;
      }

      .country-flag-large {
        font-size: 32px;
      }
    }
  `]
})
export class ExploreComponent implements OnInit {
  loading = signal(true);
  searching = signal(false);
  searchQuery = '';
  searchResultsCountries = signal<Country[]>([]);
  searchResultsCities = signal<City[]>([]);

  continents = signal<Continent[]>([]);
  countries = signal<Country[]>([]);
  cities = signal<City[]>([]);

  selectedContinent = signal<Continent | null>(null);
  selectedCountry = signal<Country | null>(null);
  addingCity = signal<number | null>(null);

  totalCountries = 155;
  totalCities = 400;

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
        this.searchResultsCountries.set([]);
        this.searchResultsCities.set([]);
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
    this.selectedCountry.set(null);
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

  selectCountryFromSearch(country: Country): void {
    this.clearSearch();
    if (country.continent) {
      this.selectedContinent.set(country.continent);
    }
    this.selectCountry(country);
  }

  goToHome(): void {
    this.selectedContinent.set(null);
    this.selectedCountry.set(null);
    this.countries.set([]);
    this.cities.set([]);
  }

  goToContinent(): void {
    this.selectedCountry.set(null);
    this.cities.set([]);
  }

  onSearch(query: string): void {
    if (query.length >= 2) {
      this.searching.set(true);
    }
    this.searchSubject.next(query);
  }

  performSearch(query: string): void {
    this.locationsService.searchLocations(query).subscribe({
      next: (results) => {
        this.searchResultsCountries.set(results.countries);
        this.searchResultsCities.set(results.cities);
        this.searching.set(false);
      },
      error: () => this.searching.set(false)
    });
  }

  clearSearch(): void {
    this.searchQuery = '';
    this.searchResultsCountries.set([]);
    this.searchResultsCities.set([]);
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

  getFlag(code: string): string {
    if (!code) return '';
    const codePoints = code
      .toUpperCase()
      .split('')
      .map(char => 127397 + char.charCodeAt(0));
    return String.fromCodePoint(...codePoints);
  }

  getContinentImage(name: string): string {
    const images: Record<string, string> = {
      'Africa': 'https://images.unsplash.com/photo-1547471080-7cc2caa01a7e?w=800',
      'Antarctica': 'https://images.unsplash.com/photo-1551415923-a2297c7fda79?w=800',
      'Asia': 'https://images.unsplash.com/photo-1480796927426-f609979314bd?w=800',
      'Europe': 'https://images.unsplash.com/photo-1467269204594-9661b134dd2b?w=800',
      'North America': 'https://images.unsplash.com/photo-1485738422979-f5c462d49f74?w=800',
      'Oceania': 'https://images.unsplash.com/photo-1523482580672-f109ba8cb9be?w=800',
      'South America': 'https://images.unsplash.com/photo-1483729558449-99ef09a8c325?w=800'
    };
    return images[name] || 'https://images.unsplash.com/photo-1488646953014-85cb44e25828?w=800';
  }

  getContinentDescription(name: string): string {
    const descriptions: Record<string, string> = {
      'Africa': 'Safaris, pyramids, and diverse cultures',
      'Antarctica': 'The frozen frontier of adventure',
      'Asia': 'Ancient temples and modern cities',
      'Europe': 'History, art, and culinary delights',
      'North America': 'From tropical beaches to arctic wilderness',
      'Oceania': 'Island paradises and unique wildlife',
      'South America': 'Rainforests, mountains, and vibrant culture'
    };
    return descriptions[name] || 'Explore amazing destinations';
  }

  getCityImage(cityName: string, countryName: string = ''): string {
    // Curated images for popular cities
    const images: Record<string, string> = {
      'Tokyo': 'https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?w=600',
      'Paris': 'https://images.unsplash.com/photo-1502602898657-3e91760cbb34?w=600',
      'London': 'https://images.unsplash.com/photo-1513635269975-59663e0ac1ad?w=600',
      'New York City': 'https://images.unsplash.com/photo-1496442226666-8d4d0e62e6e9?w=600',
      'Sydney': 'https://images.unsplash.com/photo-1506973035872-a4ec16b8e8d9?w=600',
      'Dubai': 'https://images.unsplash.com/photo-1512453979798-5ea266f8880c?w=600',
      'Singapore': 'https://images.unsplash.com/photo-1525625293386-3f8f99389edd?w=600',
      'Rome': 'https://images.unsplash.com/photo-1552832230-c0197dd311b5?w=600',
      'Barcelona': 'https://images.unsplash.com/photo-1583422409516-2895a77efded?w=600',
      'Bangkok': 'https://images.unsplash.com/photo-1508009603885-50cf7c579365?w=600',
      'Mumbai': 'https://images.unsplash.com/photo-1566552881560-0be862a7c445?w=600',
      'New Delhi': 'https://images.unsplash.com/photo-1587474260584-136574528ed5?w=600',
      'Istanbul': 'https://images.unsplash.com/photo-1541432901042-2d8bd64b4a9b?w=600',
      'Cairo': 'https://images.unsplash.com/photo-1572252009286-268acec5ca0a?w=600',
      'Rio de Janeiro': 'https://images.unsplash.com/photo-1483729558449-99ef09a8c325?w=600',
      'Los Angeles': 'https://images.unsplash.com/photo-1534190760961-74e8c1c5c3da?w=600',
      'Berlin': 'https://images.unsplash.com/photo-1560969184-10fe8719e047?w=600',
      'Amsterdam': 'https://images.unsplash.com/photo-1534351590666-13e3e96b5017?w=600',
      'Prague': 'https://images.unsplash.com/photo-1541849546-216549ae216d?w=600',
      'Vienna': 'https://images.unsplash.com/photo-1516550893923-42d28e5677af?w=600',
      'Madrid': 'https://images.unsplash.com/photo-1539037116277-4db20889f2d4?w=600',
      'Lisbon': 'https://images.unsplash.com/photo-1585208798174-6cedd86e019a?w=600',
      'Athens': 'https://images.unsplash.com/photo-1555993539-1732b0258235?w=600',
      'Moscow': 'https://images.unsplash.com/photo-1513326738677-b964603b136d?w=600',
      'Beijing': 'https://images.unsplash.com/photo-1508804185872-d7badad00f7d?w=600',
      'Shanghai': 'https://images.unsplash.com/photo-1537531383496-f4749f7b30e6?w=600',
      'Hong Kong': 'https://images.unsplash.com/photo-1536599018102-9f803c140fc1?w=600',
      'Seoul': 'https://images.unsplash.com/photo-1534274988757-a28bf1a57c17?w=600',
      'Osaka': 'https://images.unsplash.com/photo-1590559899731-a382839e5549?w=600',
      'Kyoto': 'https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?w=600',
      'Melbourne': 'https://images.unsplash.com/photo-1514395462725-fb4566210144?w=600',
      'Toronto': 'https://images.unsplash.com/photo-1517090504586-fde19ea6066f?w=600',
      'Vancouver': 'https://images.unsplash.com/photo-1559511260-66a654ae982a?w=600',
      'San Francisco': 'https://images.unsplash.com/photo-1501594907352-04cda38ebc29?w=600',
      'Chicago': 'https://images.unsplash.com/photo-1494522855154-9297ac14b55f?w=600',
      'Miami': 'https://images.unsplash.com/photo-1506966953602-c20cc11f75e3?w=600',
      'Cape Town': 'https://images.unsplash.com/photo-1580060839134-75a5edca2e99?w=600',
      'Marrakech': 'https://images.unsplash.com/photo-1597212720008-45f0baf19f12?w=600',
      'Bali': 'https://images.unsplash.com/photo-1537996194471-e657df975ab4?w=600',
      'Phuket': 'https://images.unsplash.com/photo-1589394815804-964ed0be2eb5?w=600',
      'Maldives': 'https://images.unsplash.com/photo-1514282401047-d79a71a590e8?w=600',
      'Santorini': 'https://images.unsplash.com/photo-1570077188670-e3a8d69ac5ff?w=600',
      'Venice': 'https://images.unsplash.com/photo-1514890547357-a9ee288728e0?w=600',
      'Florence': 'https://images.unsplash.com/photo-1543429258-c5ca3e3c0c60?w=600',
      'Budapest': 'https://images.unsplash.com/photo-1541343672885-9be56236f96a?w=600',
      'Zurich': 'https://images.unsplash.com/photo-1515488764276-beab7607c1e6?w=600',
      'Stockholm': 'https://images.unsplash.com/photo-1509356843151-3e7d96241e11?w=600',
      'Copenhagen': 'https://images.unsplash.com/photo-1513622470522-26c3c8a854bc?w=600',
      'Oslo': 'https://images.unsplash.com/photo-1531366936337-7c912a4589a7?w=600',
      'Helsinki': 'https://images.unsplash.com/photo-1538332576228-eb5b4c4de6f5?w=600',
      'Dublin': 'https://images.unsplash.com/photo-1549918864-48ac978761a4?w=600',
      'Edinburgh': 'https://images.unsplash.com/photo-1587974928442-77dc3e0dba72?w=600',
      'Brussels': 'https://images.unsplash.com/photo-1559113202-c916b8e44373?w=600',
      'Munich': 'https://images.unsplash.com/photo-1595867818082-083862f3d630?w=600',
      'Kathmandu': 'https://images.unsplash.com/photo-1582654454409-778aea3f1c92?w=600',
      'Pokhara': 'https://images.unsplash.com/photo-1605640840605-14ac1855827b?w=600'
    };

    if (images[cityName]) {
      return images[cityName];
    }

    // Generate a deterministic image based on city name using Unsplash source
    const searchQuery = encodeURIComponent(`${cityName} ${countryName} city landmark`);
    return `https://source.unsplash.com/600x400/?${searchQuery}`;
  }
}
