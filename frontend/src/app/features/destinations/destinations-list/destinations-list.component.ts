import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatChipsModule } from '@angular/material/chips';
import { MatMenuModule } from '@angular/material/menu';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { DestinationsService } from '../../../core/services/destinations.service';
import { Destination, CountryDetail } from '../../../models';

@Component({
  selector: 'app-destinations-list',
  standalone: true,
  imports: [
    CommonModule,
    RouterLink,
    FormsModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatInputModule,
    MatSelectModule,
    MatProgressSpinnerModule,
    MatChipsModule,
    MatMenuModule,
    MatSnackBarModule
  ],
  template: `
    <div class="destinations-container">
      <header class="destinations-header">
        <div>
          <h1>My Destinations</h1>
          <p>{{ filteredDestinations().length }} destinations in your wishlist</p>
        </div>
        <button mat-raised-button color="primary" routerLink="/explore">
          <mat-icon>add</mat-icon>
          Add New
        </button>
      </header>

      <!-- View Toggle -->
      <div class="view-toggle">
        <button mat-button [class.active]="viewMode() === 'all'" (click)="setViewMode('all')">
          <mat-icon>view_module</mat-icon>
          All Destinations
        </button>
        <button mat-button [class.active]="viewMode() === 'countries'" (click)="setViewMode('countries')">
          <mat-icon>flag</mat-icon>
          By Country
        </button>
      </div>

      <div class="filters" [class.hidden]="viewMode() === 'countries'">
        <mat-form-field appearance="outline" class="search-field">
          <mat-label>Search destinations</mat-label>
          <input matInput [(ngModel)]="searchQuery" (ngModelChange)="applyFilters()" placeholder="Search...">
          <mat-icon matPrefix>search</mat-icon>
        </mat-form-field>

        <mat-form-field appearance="outline">
          <mat-label>Filter by status</mat-label>
          <mat-select [(ngModel)]="statusFilter" (ngModelChange)="applyFilters()">
            <mat-option value="all">All</mat-option>
            <mat-option value="visited">Visited</mat-option>
            <mat-option value="pending">On Wishlist</mat-option>
          </mat-select>
        </mat-form-field>

        <mat-form-field appearance="outline">
          <mat-label>Sort by</mat-label>
          <mat-select [(ngModel)]="sortBy" (ngModelChange)="applyFilters()">
            <mat-option value="recent">Recently Added</mat-option>
            <mat-option value="name">City Name</mat-option>
            <mat-option value="country">Country</mat-option>
          </mat-select>
        </mat-form-field>
      </div>

      @if (loading()) {
        <div class="loading-container">
          <mat-spinner></mat-spinner>
        </div>
      } @else if (filteredDestinations().length === 0) {
        <mat-card class="empty-state">
          <mat-card-content>
            @if (destinations().length === 0) {
              <mat-icon>flight_takeoff</mat-icon>
              <h2>No Destinations Yet</h2>
              <p>Start exploring and add places you want to visit!</p>
              <button mat-raised-button color="primary" routerLink="/explore">
                Explore Destinations
              </button>
            } @else {
              <mat-icon>search_off</mat-icon>
              <h2>No Results</h2>
              <p>No destinations match your current filters</p>
              <button mat-button (click)="clearFilters()">Clear Filters</button>
            }
          </mat-card-content>
        </mat-card>
      } @else if (viewMode() === 'all') {
        <div class="destinations-grid">
          @for (dest of filteredDestinations(); track dest.id) {
            <mat-card class="destination-card">
              <div class="destination-image" [routerLink]="['/destinations', dest.id]" [style.background-image]="'url(' + getDestinationImage(dest) + ')'">
                @if (dest.visited) {
                  <mat-chip class="status-chip visited">Visited</mat-chip>
                } @else {
                  <mat-chip class="status-chip pending">Wishlist</mat-chip>
                }
                <button mat-icon-button class="menu-btn" [matMenuTriggerFor]="menu" (click)="$event.stopPropagation()">
                  <mat-icon>more_vert</mat-icon>
                </button>
                <mat-menu #menu="matMenu">
                  <button mat-menu-item (click)="toggleVisited(dest)">
                    <mat-icon>{{ dest.visited ? 'undo' : 'check_circle' }}</mat-icon>
                    <span>{{ dest.visited ? 'Mark as Wishlist' : 'Mark as Visited' }}</span>
                  </button>
                  <button mat-menu-item (click)="deleteDestination(dest)">
                    <mat-icon color="warn">delete</mat-icon>
                    <span>Remove</span>
                  </button>
                </mat-menu>
              </div>
              <mat-card-content [routerLink]="['/destinations', dest.id]">
                <h3>{{ dest.city?.name }}</h3>
                <p class="location">
                  <mat-icon>location_on</mat-icon>
                  {{ dest.city?.country?.name }}, {{ dest.city?.country?.continent?.name }}
                </p>
                @if (dest.notes) {
                  <p class="notes">{{ dest.notes | slice:0:80 }}{{ dest.notes.length > 80 ? '...' : '' }}</p>
                }
                <div class="card-stats">
                  <span><mat-icon>photo_camera</mat-icon> {{ dest.photos?.length || 0 }}</span>
                  <span><mat-icon>checklist</mat-icon> {{ dest.activities?.length || 0 }}</span>
                </div>
              </mat-card-content>
            </mat-card>
          }
        </div>
      } @else {
        <!-- Countries View -->
        <div class="countries-view">
          <p class="countries-subtitle">Click on a country to see your cities</p>
          <div class="country-cards">
            @for (country of countryDetails(); track country.id) {
              <div class="country-item" (click)="openCountryModal(country)">
                <div class="country-flag">{{ getFlag(country.code) }}</div>
                <div class="country-info">
                  <span class="country-name">{{ country.name }}</span>
                  <span class="country-meta">{{ country.continentName }}</span>
                </div>
                <div class="country-badge">{{ country.cityCount }} {{ country.cityCount === 1 ? 'city' : 'cities' }}</div>
                <mat-icon class="arrow-icon">chevron_right</mat-icon>
              </div>
            }
          </div>
        </div>
      }

      <!-- Country Cities Modal -->
      @if (selectedCountry()) {
        <div class="modal-overlay" (click)="closeCountryModal()">
          <div class="country-modal" (click)="$event.stopPropagation()">
            <div class="modal-header">
              <div class="modal-title">
                <span class="modal-flag">{{ getFlag(selectedCountry()!.code) }}</span>
                <div>
                  <h3>{{ selectedCountry()!.name }}</h3>
                  <span class="modal-subtitle">{{ selectedCountry()!.cityCount }} {{ selectedCountry()!.cityCount === 1 ? 'city' : 'cities' }} in your list</span>
                </div>
              </div>
              <button mat-icon-button (click)="closeCountryModal()">
                <mat-icon>close</mat-icon>
              </button>
            </div>
            <div class="modal-content">
              <div class="cities-list">
                @for (city of selectedCountry()!.cities; track city.id) {
                  <div class="city-item" [routerLink]="['/destinations', city.destinationId]" (click)="closeCountryModal()">
                    <div class="city-image" [style.background-image]="'url(' + (city.imageUrl || 'https://images.unsplash.com/photo-1488646953014-85cb44e25828?w=400') + ')'">
                      @if (city.visited) {
                        <div class="city-visited-badge">
                          <mat-icon>check</mat-icon>
                        </div>
                      }
                    </div>
                    <div class="city-info">
                      <span class="city-name">{{ city.name }}</span>
                      <span class="city-status">{{ city.visited ? 'Visited' : 'On Wishlist' }}</span>
                    </div>
                    <mat-icon class="arrow-icon">chevron_right</mat-icon>
                  </div>
                }
              </div>
            </div>
          </div>
        </div>
      }
    </div>
  `,
  styles: [`
    .destinations-container {
      padding: 24px;
      max-width: 1400px;
      margin: 0 auto;
    }

    .destinations-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 24px;
    }

    .destinations-header h1 {
      margin: 0;
      font-size: 28px;
      color: #1a1a2e;
    }

    .destinations-header p {
      margin: 8px 0 0;
      color: #666;
    }

    .filters {
      display: flex;
      gap: 16px;
      margin-bottom: 24px;
      flex-wrap: wrap;
    }

    .search-field {
      flex: 1;
      min-width: 250px;
    }

    .loading-container {
      display: flex;
      justify-content: center;
      padding: 48px;
    }

    .destinations-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
      gap: 24px;
    }

    .destination-card {
      overflow: hidden;
      cursor: pointer;
      transition: transform 0.2s, box-shadow 0.2s;
    }

    .destination-card:hover {
      transform: translateY(-4px);
      box-shadow: 0 8px 24px rgba(0,0,0,0.12);
    }

    .destination-image {
      height: 180px;
      background-size: cover;
      background-position: center;
      background-color: #e0e0e0;
      position: relative;
    }

    .status-chip {
      position: absolute;
      top: 12px;
      left: 12px;
    }

    .status-chip.visited {
      background: #11998e !important;
      color: white !important;
    }

    .status-chip.pending {
      background: #667eea !important;
      color: white !important;
    }

    .menu-btn {
      position: absolute;
      top: 8px;
      right: 8px;
      background: rgba(255,255,255,0.9) !important;
    }

    mat-card-content h3 {
      margin: 0 0 8px;
      font-size: 18px;
      color: #1a1a2e;
    }

    .location {
      display: flex;
      align-items: center;
      gap: 4px;
      color: #666;
      font-size: 14px;
      margin: 0 0 8px;
    }

    .location mat-icon {
      font-size: 16px;
      width: 16px;
      height: 16px;
    }

    .notes {
      color: #888;
      font-size: 13px;
      margin: 0 0 8px;
      line-height: 1.4;
    }

    .card-stats {
      display: flex;
      gap: 16px;
      color: #888;
      font-size: 13px;
    }

    .card-stats span {
      display: flex;
      align-items: center;
      gap: 4px;
    }

    .card-stats mat-icon {
      font-size: 16px;
      width: 16px;
      height: 16px;
    }

    .empty-state {
      text-align: center;
      padding: 48px 24px;
    }

    .empty-state mat-icon {
      font-size: 64px;
      width: 64px;
      height: 64px;
      color: #667eea;
      margin-bottom: 16px;
    }

    .empty-state h2 {
      margin: 0 0 8px;
      color: #1a1a2e;
    }

    .empty-state p {
      color: #666;
      margin: 0 0 24px;
    }

    /* View Toggle */
    .view-toggle {
      display: flex;
      gap: 8px;
      margin-bottom: 20px;
      padding: 4px;
      background: #f0f0f0;
      border-radius: 12px;
      width: fit-content;
    }

    .view-toggle button {
      display: flex;
      align-items: center;
      gap: 8px;
      padding: 10px 20px;
      border-radius: 10px;
      transition: all 0.2s;
    }

    .view-toggle button.active {
      background: white;
      box-shadow: 0 2px 8px rgba(0,0,0,0.1);
      color: #667eea;
    }

    .view-toggle button mat-icon {
      font-size: 18px;
      width: 18px;
      height: 18px;
    }

    .filters.hidden {
      display: none;
    }

    /* Countries View */
    .countries-view {
      margin-top: 16px;
    }

    .countries-subtitle {
      color: #888;
      font-size: 14px;
      margin: 0 0 20px;
    }

    .country-cards {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
      gap: 12px;
    }

    .country-item {
      display: flex;
      align-items: center;
      gap: 16px;
      padding: 16px 20px;
      background: white;
      border-radius: 12px;
      cursor: pointer;
      transition: all 0.2s;
      box-shadow: 0 2px 8px rgba(0,0,0,0.05);
    }

    .country-item:hover {
      background: #f8f9ff;
      transform: translateX(4px);
      box-shadow: 0 4px 16px rgba(0,0,0,0.1);
    }

    .country-flag {
      font-size: 36px;
      line-height: 1;
    }

    .country-info {
      flex: 1;
      display: flex;
      flex-direction: column;
    }

    .country-name {
      font-weight: 600;
      color: #1a1a2e;
      font-size: 16px;
    }

    .country-meta {
      color: #888;
      font-size: 13px;
    }

    .country-badge {
      background: #667eea;
      color: white;
      padding: 6px 14px;
      border-radius: 20px;
      font-size: 13px;
      font-weight: 500;
    }

    .arrow-icon {
      color: #ccc;
    }

    /* Country Modal */
    .modal-overlay {
      position: fixed;
      inset: 0;
      background: rgba(0, 0, 0, 0.5);
      display: flex;
      align-items: center;
      justify-content: center;
      z-index: 1000;
      padding: 24px;
    }

    .country-modal {
      background: white;
      border-radius: 20px;
      width: 100%;
      max-width: 500px;
      max-height: 80vh;
      overflow: hidden;
      box-shadow: 0 24px 48px rgba(0, 0, 0, 0.2);
    }

    .modal-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 24px;
      border-bottom: 1px solid #eee;
    }

    .modal-title {
      display: flex;
      align-items: center;
      gap: 16px;
    }

    .modal-flag {
      font-size: 48px;
      line-height: 1;
    }

    .modal-title h3 {
      margin: 0;
      font-size: 20px;
      color: #1a1a2e;
    }

    .modal-subtitle {
      color: #666;
      font-size: 14px;
    }

    .modal-content {
      padding: 16px 24px 24px;
      max-height: 60vh;
      overflow-y: auto;
    }

    .cities-list {
      display: flex;
      flex-direction: column;
      gap: 12px;
    }

    .city-item {
      display: flex;
      align-items: center;
      gap: 16px;
      padding: 12px;
      background: #f8f9ff;
      border-radius: 12px;
      cursor: pointer;
      transition: all 0.2s;
    }

    .city-item:hover {
      background: #f0f2ff;
      transform: translateX(4px);
    }

    .city-image {
      width: 60px;
      height: 60px;
      border-radius: 10px;
      background-size: cover;
      background-position: center;
      background-color: #e8e8e8;
      flex-shrink: 0;
      position: relative;
    }

    .city-visited-badge {
      position: absolute;
      bottom: -4px;
      right: -4px;
      width: 22px;
      height: 22px;
      background: linear-gradient(135deg, #11998e 0%, #38ef7d 100%);
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      border: 2px solid white;
    }

    .city-visited-badge mat-icon {
      font-size: 14px;
      width: 14px;
      height: 14px;
      color: white;
    }

    .city-info {
      flex: 1;
      display: flex;
      flex-direction: column;
    }

    .city-name {
      font-weight: 600;
      color: #1a1a2e;
      font-size: 15px;
    }

    .city-status {
      color: #888;
      font-size: 13px;
    }

    /* Tablet */
    @media (max-width: 1024px) and (min-width: 769px) {
      .destinations-container {
        padding: 20px;
      }

      .destinations-grid {
        grid-template-columns: repeat(2, 1fr);
      }

      .filters {
        flex-wrap: wrap;
      }

      .search-field {
        min-width: 200px;
      }
    }

    /* Mobile */
    @media (max-width: 768px) {
      .destinations-container {
        padding: 16px;
      }

      .destinations-header {
        flex-direction: column;
        align-items: flex-start;
        gap: 16px;
      }

      .destinations-header h1 {
        font-size: 22px;
      }

      .destinations-header button {
        width: 100%;
      }

      .view-toggle {
        width: 100%;
      }

      .view-toggle button {
        flex: 1;
        justify-content: center;
        padding: 10px 12px;
      }

      .filters {
        flex-direction: column;
        gap: 12px;
      }

      .search-field {
        min-width: 100%;
      }

      .filters mat-form-field {
        width: 100%;
      }

      .destinations-grid {
        grid-template-columns: 1fr;
        gap: 16px;
      }

      .destination-image {
        height: 160px;
      }

      mat-card-content h3 {
        font-size: 16px;
      }

      .country-cards {
        grid-template-columns: 1fr;
      }

      .country-flag {
        font-size: 32px;
      }

      .modal-overlay {
        padding: 16px;
        align-items: flex-end;
      }

      .country-modal {
        border-radius: 20px 20px 0 0;
        max-height: 85vh;
      }

      .modal-header {
        padding: 20px;
      }

      .modal-flag {
        font-size: 40px;
      }

      .modal-title h3 {
        font-size: 18px;
      }

      .modal-content {
        padding: 12px 20px 20px;
      }

      .empty-state {
        padding: 32px 16px;
      }

      .empty-state mat-icon {
        font-size: 48px;
        width: 48px;
        height: 48px;
      }

      .empty-state h2 {
        font-size: 18px;
      }
    }

    /* Small mobile */
    @media (max-width: 480px) {
      .destinations-container {
        padding: 12px;
      }

      .destination-image {
        height: 140px;
      }

      .status-chip {
        font-size: 11px;
        padding: 4px 8px;
      }
    }
  `]
})
export class DestinationsListComponent implements OnInit {
  loading = signal(true);
  destinations = signal<Destination[]>([]);
  filteredDestinations = signal<Destination[]>([]);
  countryDetails = signal<CountryDetail[]>([]);
  selectedCountry = signal<CountryDetail | null>(null);
  viewMode = signal<'all' | 'countries'>('all');

  searchQuery = '';
  statusFilter = 'all';
  sortBy = 'recent';

  constructor(
    private destinationsService: DestinationsService,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {
    this.loadDestinations();
  }

  loadDestinations(): void {
    this.destinationsService.getDestinations().subscribe({
      next: (destinations) => {
        this.destinations.set(destinations);
        this.applyFilters();
        this.loading.set(false);
      },
      error: () => this.loading.set(false)
    });
  }

  applyFilters(): void {
    let filtered = [...this.destinations()];

    // Search filter
    if (this.searchQuery) {
      const query = this.searchQuery.toLowerCase();
      filtered = filtered.filter(d =>
        d.city?.name?.toLowerCase().includes(query) ||
        d.city?.country?.name?.toLowerCase().includes(query) ||
        d.notes?.toLowerCase().includes(query)
      );
    }

    // Status filter
    if (this.statusFilter === 'visited') {
      filtered = filtered.filter(d => d.visited);
    } else if (this.statusFilter === 'pending') {
      filtered = filtered.filter(d => !d.visited);
    }

    // Sort
    if (this.sortBy === 'name') {
      filtered.sort((a, b) => (a.city?.name || '').localeCompare(b.city?.name || ''));
    } else if (this.sortBy === 'country') {
      filtered.sort((a, b) => (a.city?.country?.name || '').localeCompare(b.city?.country?.name || ''));
    }

    this.filteredDestinations.set(filtered);
  }

  clearFilters(): void {
    this.searchQuery = '';
    this.statusFilter = 'all';
    this.sortBy = 'recent';
    this.applyFilters();
  }

  toggleVisited(dest: Destination): void {
    this.destinationsService.updateDestination(dest.id, { visited: !dest.visited }).subscribe({
      next: (updated) => {
        const destinations = this.destinations().map(d => d.id === dest.id ? updated : d);
        this.destinations.set(destinations);
        this.applyFilters();
        this.snackBar.open(
          updated.visited ? 'Marked as visited!' : 'Moved to wishlist!',
          'Close',
          { duration: 3000 }
        );
      },
      error: () => this.snackBar.open('Failed to update', 'Close', { duration: 3000 })
    });
  }

  deleteDestination(dest: Destination): void {
    if (confirm(`Remove ${dest.city?.name} from your list?`)) {
      this.destinationsService.deleteDestination(dest.id).subscribe({
        next: () => {
          this.destinations.set(this.destinations().filter(d => d.id !== dest.id));
          this.applyFilters();
          this.snackBar.open('Destination removed', 'Close', { duration: 3000 });
        },
        error: () => this.snackBar.open('Failed to remove', 'Close', { duration: 3000 })
      });
    }
  }

  getDestinationImage(dest: Destination): string {
    // Use city imageUrl from backend
    if (dest.city?.imageUrl) {
      return dest.city.imageUrl;
    }

    // Default travel image
    return 'https://images.unsplash.com/photo-1488646953014-85cb44e25828?w=600';
  }

  // View mode methods
  setViewMode(mode: 'all' | 'countries'): void {
    this.viewMode.set(mode);
    if (mode === 'countries') {
      this.computeCountryDetails();
    }
  }

  computeCountryDetails(): void {
    const destinations = this.destinations();
    const countryMap = new Map<number, CountryDetail>();

    for (const dest of destinations) {
      const country = dest.city?.country;
      if (!country) continue;

      if (!countryMap.has(country.id)) {
        countryMap.set(country.id, {
          id: country.id,
          name: country.name,
          code: country.code || '',
          continentName: country.continent?.name || 'Unknown',
          cityCount: 0,
          cities: []
        });
      }

      const countryDetail = countryMap.get(country.id)!;
      countryDetail.cityCount += 1;
      if (dest.city) {
        countryDetail.cities.push({
          id: dest.city.id,
          name: dest.city.name,
          imageUrl: dest.city.imageUrl,
          destinationId: dest.id,
          visited: dest.visited
        });
      }
    }

    // Sort by city count descending
    const sorted = Array.from(countryMap.values()).sort((a, b) => b.cityCount - a.cityCount);
    this.countryDetails.set(sorted);
  }

  // Country modal methods
  openCountryModal(country: CountryDetail): void {
    this.selectedCountry.set(country);
  }

  closeCountryModal(): void {
    this.selectedCountry.set(null);
  }

  getFlag(code: string): string {
    if (!code) return '';
    const codePoints = code
      .toUpperCase()
      .split('')
      .map(char => 127397 + char.charCodeAt(0));
    return String.fromCodePoint(...codePoints);
  }
}
