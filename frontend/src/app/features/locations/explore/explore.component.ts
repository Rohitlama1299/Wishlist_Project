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
                    <div class="city-result-image" [style.background-image]="'url(' + getCityImageForCity(city) + ')'">
                      <div class="city-result-overlay">
                        <h3>{{ city.name }}</h3>
                        <span class="city-result-flag">{{ getFlag(city.country?.code || '') }}</span>
                      </div>
                    </div>
                    <mat-card-content>
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
                    <div class="city-image" [style.background-image]="'url(' + getCityImageForCity(city) + ')'">
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
      overflow: hidden;
    }

    .city-result-image {
      height: 140px;
      background-size: cover;
      background-position: center;
      background-color: #e8e8e8;
      position: relative;
    }

    .city-result-overlay {
      position: absolute;
      inset: 0;
      background: linear-gradient(to top, rgba(0,0,0,0.7), transparent);
      display: flex;
      align-items: flex-end;
      justify-content: space-between;
      padding: 16px;
    }

    .city-result-overlay h3 {
      margin: 0;
      color: white;
      font-size: 20px;
      font-weight: 600;
    }

    .city-result-flag {
      font-size: 24px;
    }

    .city-result-card mat-card-content {
      padding: 12px 16px 8px;
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

  getCityImageForCity(city: City): string {
    // First check if city has imageUrl from backend
    if (city.imageUrl) {
      return city.imageUrl;
    }
    // Fall back to default travel image
    return 'https://images.unsplash.com/photo-1488646953014-85cb44e25828?w=600';
  }

  getCityImage(cityName: string, countryName: string = ''): string {
    // Fallback method for cases where we only have city name (not the full city object)
    // This is kept for backward compatibility but images should come from backend
    return 'https://images.unsplash.com/photo-1488646953014-85cb44e25828?w=600';
  }
}
