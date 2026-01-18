import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatChipsModule } from '@angular/material/chips';
import { AuthService } from '../../core/services/auth.service';
import { DestinationsService } from '../../core/services/destinations.service';
import { Destination, DestinationStats } from '../../models';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [
    CommonModule,
    RouterLink,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatProgressSpinnerModule,
    MatChipsModule
  ],
  template: `
    <div class="dashboard-container">
      <header class="dashboard-header">
        <div>
          <h1>Welcome back, {{ authService.currentUser()?.firstName }}!</h1>
          <p>Here's an overview of your travel wishlist</p>
        </div>
        <button mat-raised-button color="primary" routerLink="/explore">
          <mat-icon>add</mat-icon>
          Add Destination
        </button>
      </header>

      @if (loading()) {
        <div class="loading-container">
          <mat-spinner></mat-spinner>
        </div>
      } @else {
        <div class="stats-grid">
          <mat-card class="stat-card">
            <mat-card-content>
              <div class="stat-icon total">
                <mat-icon>place</mat-icon>
              </div>
              <div class="stat-info">
                <span class="stat-value">{{ stats()?.totalDestinations || 0 }}</span>
                <span class="stat-label">Total Destinations</span>
              </div>
            </mat-card-content>
          </mat-card>

          <mat-card class="stat-card">
            <mat-card-content>
              <div class="stat-icon visited">
                <mat-icon>check_circle</mat-icon>
              </div>
              <div class="stat-info">
                <span class="stat-value">{{ stats()?.visitedCount || 0 }}</span>
                <span class="stat-label">Places Visited</span>
              </div>
            </mat-card-content>
          </mat-card>

          <mat-card class="stat-card">
            <mat-card-content>
              <div class="stat-icon pending">
                <mat-icon>schedule</mat-icon>
              </div>
              <div class="stat-info">
                <span class="stat-value">{{ stats()?.pendingCount || 0 }}</span>
                <span class="stat-label">On Wishlist</span>
              </div>
            </mat-card-content>
          </mat-card>

          <mat-card class="stat-card">
            <mat-card-content>
              <div class="stat-icon continents">
                <mat-icon>public</mat-icon>
              </div>
              <div class="stat-info">
                <span class="stat-value">{{ getContinentCount() }}</span>
                <span class="stat-label">Continents</span>
              </div>
            </mat-card-content>
          </mat-card>
        </div>

        @if (recentDestinations().length > 0) {
          <section class="recent-section">
            <div class="section-header">
              <h2>Recent Destinations</h2>
              <a mat-button routerLink="/destinations">View All</a>
            </div>

            <div class="destinations-grid">
              @for (dest of recentDestinations(); track dest.id) {
                <mat-card class="destination-card" [routerLink]="['/destinations', dest.id]">
                  <div class="destination-image" [style.background-image]="'url(' + getDestinationImage(dest) + ')'">
                    @if (dest.visited) {
                      <mat-chip class="visited-chip">Visited</mat-chip>
                    }
                  </div>
                  <mat-card-content>
                    <h3>{{ dest.city?.name }}</h3>
                    <p class="location">
                      <mat-icon>location_on</mat-icon>
                      {{ dest.city?.country?.name }}, {{ dest.city?.country?.continent?.name }}
                    </p>
                    <div class="card-stats">
                      <span><mat-icon>photo_camera</mat-icon> {{ dest.photos?.length || 0 }}</span>
                      <span><mat-icon>checklist</mat-icon> {{ dest.activities?.length || 0 }}</span>
                    </div>
                  </mat-card-content>
                </mat-card>
              }
            </div>
          </section>
        } @else {
          <mat-card class="empty-state">
            <mat-card-content>
              <mat-icon>flight_takeoff</mat-icon>
              <h2>Start Your Journey</h2>
              <p>You haven't added any destinations yet. Explore the world and add places you want to visit!</p>
              <button mat-raised-button color="primary" routerLink="/explore">
                Explore Destinations
              </button>
            </mat-card-content>
          </mat-card>
        }

        @if (getContinentCount() > 0) {
          <section class="continents-section">
            <h2>Destinations by Continent</h2>
            <div class="continent-chips">
              @for (continent of getContinentEntries(); track continent[0]) {
                <mat-chip class="continent-chip">
                  {{ continent[0] }}: {{ continent[1] }}
                </mat-chip>
              }
            </div>
          </section>
        }
      }
    </div>
  `,
  styles: [`
    .dashboard-container {
      padding: 24px;
      max-width: 1400px;
      margin: 0 auto;
    }

    .dashboard-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 32px;
    }

    .dashboard-header h1 {
      margin: 0;
      font-size: 28px;
      color: #1a1a2e;
    }

    .dashboard-header p {
      margin: 8px 0 0;
      color: #666;
    }

    .loading-container {
      display: flex;
      justify-content: center;
      padding: 48px;
    }

    .stats-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
      gap: 24px;
      margin-bottom: 32px;
    }

    .stat-card mat-card-content {
      display: flex;
      align-items: center;
      gap: 16px;
      padding: 24px !important;
    }

    .stat-icon {
      width: 56px;
      height: 56px;
      border-radius: 12px;
      display: flex;
      align-items: center;
      justify-content: center;
    }

    .stat-icon mat-icon {
      font-size: 28px;
      width: 28px;
      height: 28px;
      color: white;
    }

    .stat-icon.total { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); }
    .stat-icon.visited { background: linear-gradient(135deg, #11998e 0%, #38ef7d 100%); }
    .stat-icon.pending { background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%); }
    .stat-icon.continents { background: linear-gradient(135deg, #4facfe 0%, #00f2fe 100%); }

    .stat-info {
      display: flex;
      flex-direction: column;
    }

    .stat-value {
      font-size: 32px;
      font-weight: 700;
      color: #1a1a2e;
    }

    .stat-label {
      color: #666;
      font-size: 14px;
    }

    .section-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 16px;
    }

    .section-header h2 {
      margin: 0;
      font-size: 20px;
      color: #1a1a2e;
    }

    .destinations-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
      gap: 24px;
    }

    .destination-card {
      cursor: pointer;
      transition: transform 0.2s, box-shadow 0.2s;
      overflow: hidden;
    }

    .destination-card:hover {
      transform: translateY(-4px);
      box-shadow: 0 8px 24px rgba(0,0,0,0.12);
    }

    .destination-image {
      height: 160px;
      background-size: cover;
      background-position: center;
      background-color: #e0e0e0;
      position: relative;
    }

    .visited-chip {
      position: absolute;
      top: 12px;
      right: 12px;
      background: #11998e !important;
      color: white !important;
    }

    .destination-card h3 {
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
      margin: 0;
    }

    .location mat-icon {
      font-size: 16px;
      width: 16px;
      height: 16px;
    }

    .card-stats {
      display: flex;
      gap: 16px;
      margin-top: 12px;
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
      max-width: 400px;
      margin: 0 auto 24px;
    }

    .continents-section {
      margin-top: 32px;
    }

    .continents-section h2 {
      margin: 0 0 16px;
      font-size: 20px;
      color: #1a1a2e;
    }

    .continent-chips {
      display: flex;
      flex-wrap: wrap;
      gap: 8px;
    }

    .continent-chip {
      background: #667eea !important;
      color: white !important;
    }
  `]
})
export class DashboardComponent implements OnInit {
  loading = signal(true);
  stats = signal<DestinationStats | null>(null);
  recentDestinations = signal<Destination[]>([]);

  constructor(
    public authService: AuthService,
    private destinationsService: DestinationsService
  ) {}

  ngOnInit(): void {
    this.loadData();
  }

  loadData(): void {
    this.destinationsService.getStats().subscribe({
      next: (stats) => this.stats.set(stats),
      error: () => this.stats.set(null)
    });

    this.destinationsService.getDestinations().subscribe({
      next: (destinations) => {
        this.recentDestinations.set(destinations.slice(0, 6));
        this.loading.set(false);
      },
      error: () => this.loading.set(false)
    });
  }

  getContinentCount(): number {
    return Object.keys(this.stats()?.continentStats || {}).length;
  }

  getContinentEntries(): [string, number][] {
    const stats = this.stats()?.continentStats || {};
    return Object.entries(stats) as [string, number][];
  }

  getDestinationImage(dest: Destination): string {
    if (dest.photos && dest.photos.length > 0) {
      return dest.photos[0].url;
    }
    return 'https://images.unsplash.com/photo-1488646953014-85cb44e25828?w=400';
  }
}
