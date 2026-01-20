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
import { Destination } from '../../../models';

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

      <div class="filters">
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
      } @else {
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
    if (dest.photos && dest.photos.length > 0) {
      return dest.photos[0].url;
    }
    return 'https://images.unsplash.com/photo-1488646953014-85cb44e25828?w=400';
  }
}
