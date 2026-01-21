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
import { Destination, DestinationStats, CountryDetail } from '../../models';

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
        <div class="welcome-section">
          <div class="welcome-text">
            <h1>Welcome back, {{ authService.currentUser()?.firstName }}!</h1>
            <p>Ready for your next adventure? Here's your travel overview.</p>
          </div>
          <button mat-flat-button color="primary" routerLink="/explore" class="cta-button">
            <mat-icon>add</mat-icon>
            Add Destination
          </button>
        </div>
      </header>

      @if (loading()) {
        <div class="loading-container">
          <mat-spinner></mat-spinner>
        </div>
      } @else {
        <div class="stats-section">
          <mat-card class="stat-card">
            <div class="stat-content">
              <div class="stat-icon-wrapper total">
                <mat-icon>place</mat-icon>
              </div>
              <div class="stat-details">
                <span class="stat-value">{{ stats()?.totalDestinations || 0 }}</span>
                <span class="stat-label">Total Destinations</span>
              </div>
            </div>
            <div class="stat-decoration"></div>
          </mat-card>

          <mat-card class="stat-card">
            <div class="stat-content">
              <div class="stat-icon-wrapper visited">
                <mat-icon>check_circle</mat-icon>
              </div>
              <div class="stat-details">
                <span class="stat-value">{{ stats()?.visitedCount || 0 }}</span>
                <span class="stat-label">Places Visited</span>
              </div>
            </div>
            <div class="stat-decoration visited"></div>
          </mat-card>

          <mat-card class="stat-card">
            <div class="stat-content">
              <div class="stat-icon-wrapper pending">
                <mat-icon>schedule</mat-icon>
              </div>
              <div class="stat-details">
                <span class="stat-value">{{ stats()?.pendingCount || 0 }}</span>
                <span class="stat-label">On Wishlist</span>
              </div>
            </div>
            <div class="stat-decoration pending"></div>
          </mat-card>

          <mat-card class="stat-card">
            <div class="stat-content">
              <div class="stat-icon-wrapper continents">
                <mat-icon>public</mat-icon>
              </div>
              <div class="stat-details">
                <span class="stat-value">{{ getContinentCount() }}</span>
                <span class="stat-label">Continents Explored</span>
              </div>
            </div>
            <div class="stat-decoration continents"></div>
          </mat-card>
        </div>

        @if (recentDestinations().length > 0) {
          <section class="recent-section">
            <div class="section-header">
              <h2>Recent Destinations</h2>
              <a mat-button routerLink="/destinations" class="view-all">
                View All
                <mat-icon>arrow_forward</mat-icon>
              </a>
            </div>

            <div class="destinations-grid">
              @for (dest of recentDestinations(); track dest.id) {
                <mat-card class="destination-card" [routerLink]="['/destinations', dest.id]">
                  <div class="card-image" [style.background-image]="'url(' + getDestinationImage(dest) + ')'">
                    @if (dest.visited) {
                      <div class="visited-badge">
                        <mat-icon>check</mat-icon>
                        Visited
                      </div>
                    }
                    <div class="card-overlay">
                      <h3>{{ dest.city?.name }}</h3>
                    </div>
                  </div>
                  <mat-card-content>
                    <div class="card-location">
                      <mat-icon>location_on</mat-icon>
                      <span>{{ dest.city?.country?.name }}</span>
                    </div>
                    <div class="card-meta">
                      <span class="meta-item">
                        <mat-icon>photo_camera</mat-icon>
                        {{ dest.photos?.length || 0 }}
                      </span>
                      <span class="meta-item">
                        <mat-icon>checklist</mat-icon>
                        {{ dest.activities?.length || 0 }}
                      </span>
                    </div>
                  </mat-card-content>
                </mat-card>
              }
            </div>
          </section>

          @if (getContinentCount() > 0) {
            <section class="continents-section">
              <h2>Your Global Footprint</h2>
              <div class="continent-cards">
                @for (continent of getContinentEntries(); track continent[0]) {
                  <div class="continent-item">
                    <div class="continent-icon">
                      <mat-icon>{{ getContinentIcon(continent[0]) }}</mat-icon>
                    </div>
                    <div class="continent-info">
                      <span class="continent-name">{{ continent[0] }}</span>
                      <span class="continent-count">{{ continent[1] }} {{ continent[1] === 1 ? 'destination' : 'destinations' }}</span>
                    </div>
                  </div>
                }
              </div>
            </section>
          }

          @if (countryDetails().length > 0) {
            <section class="countries-section">
              <h2>Your Countries</h2>
              <p class="section-subtitle">Click on a country to see your cities</p>
              <div class="country-cards">
                @for (country of countryDetails(); track country.id) {
                  <div class="country-item" (click)="openCountryModal(country)">
                    <div class="country-flag">{{ getFlag(country.code) }}</div>
                    <div class="country-info">
                      <span class="country-name">{{ country.name }}</span>
                      <span class="country-count">{{ country.cityCount }} {{ country.cityCount === 1 ? 'city' : 'cities' }}</span>
                    </div>
                    <mat-icon class="arrow-icon">chevron_right</mat-icon>
                  </div>
                }
              </div>
            </section>
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
        } @else {
          <mat-card class="empty-state">
            <div class="empty-icon">
              <mat-icon>flight_takeoff</mat-icon>
            </div>
            <h2>Start Your Journey</h2>
            <p>You haven't added any destinations yet. Explore the world and add places you want to visit!</p>
            <button mat-flat-button color="primary" routerLink="/explore">
              <mat-icon>explore</mat-icon>
              Explore Destinations
            </button>
          </mat-card>
        }
      }
    </div>
  `,
  styles: [`
    .dashboard-container {
      min-height: 100vh;
      background: linear-gradient(135deg, #f8f9ff 0%, #f0f4ff 100%);
      padding: 32px;
    }

    .dashboard-header {
      margin-bottom: 32px;
    }

    .welcome-section {
      display: flex;
      justify-content: space-between;
      align-items: center;
      flex-wrap: wrap;
      gap: 24px;
    }

    .welcome-text h1 {
      margin: 0 0 8px;
      font-size: 32px;
      font-weight: 700;
      color: #1a1a2e;
    }

    .welcome-text p {
      margin: 0;
      color: #666;
      font-size: 16px;
    }

    .cta-button {
      padding: 12px 24px;
      font-size: 15px;
      border-radius: 12px;
      display: flex;
      align-items: center;
      gap: 8px;
    }

    .loading-container {
      display: flex;
      justify-content: center;
      padding: 80px;
    }

    .stats-section {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(260px, 1fr));
      gap: 24px;
      margin-bottom: 40px;
    }

    .stat-card {
      border-radius: 20px !important;
      overflow: hidden;
      position: relative;
      transition: all 0.3s ease;
    }

    .stat-card:hover {
      transform: translateY(-4px);
      box-shadow: 0 12px 40px rgba(0,0,0,0.1);
    }

    .stat-content {
      display: flex;
      align-items: center;
      gap: 20px;
      padding: 28px;
      position: relative;
      z-index: 1;
    }

    .stat-icon-wrapper {
      width: 64px;
      height: 64px;
      border-radius: 16px;
      display: flex;
      align-items: center;
      justify-content: center;
      flex-shrink: 0;
    }

    .stat-icon-wrapper mat-icon {
      font-size: 32px;
      width: 32px;
      height: 32px;
      color: white;
    }

    .stat-icon-wrapper.total { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); }
    .stat-icon-wrapper.visited { background: linear-gradient(135deg, #11998e 0%, #38ef7d 100%); }
    .stat-icon-wrapper.pending { background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%); }
    .stat-icon-wrapper.continents { background: linear-gradient(135deg, #4facfe 0%, #00f2fe 100%); }

    .stat-details {
      display: flex;
      flex-direction: column;
    }

    .stat-value {
      font-size: 40px;
      font-weight: 700;
      color: #1a1a2e;
      line-height: 1.1;
    }

    .stat-label {
      color: #666;
      font-size: 14px;
      margin-top: 4px;
    }

    .stat-decoration {
      position: absolute;
      right: -20px;
      bottom: -20px;
      width: 100px;
      height: 100px;
      border-radius: 50%;
      opacity: 0.1;
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    }

    .stat-decoration.visited { background: linear-gradient(135deg, #11998e 0%, #38ef7d 100%); }
    .stat-decoration.pending { background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%); }
    .stat-decoration.continents { background: linear-gradient(135deg, #4facfe 0%, #00f2fe 100%); }

    .section-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 24px;
    }

    .section-header h2 {
      margin: 0;
      font-size: 22px;
      font-weight: 600;
      color: #1a1a2e;
    }

    .view-all {
      display: flex;
      align-items: center;
      gap: 4px;
      color: #667eea;
    }

    .view-all mat-icon {
      font-size: 18px;
      width: 18px;
      height: 18px;
    }

    .destinations-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
      gap: 24px;
      margin-bottom: 40px;
    }

    .destination-card {
      cursor: pointer;
      transition: all 0.3s ease;
      overflow: hidden;
      border-radius: 20px !important;
    }

    .destination-card:hover {
      transform: translateY(-8px);
      box-shadow: 0 20px 40px rgba(0,0,0,0.12);
    }

    .card-image {
      height: 180px;
      background-size: cover;
      background-position: center;
      background-color: #e8e8e8;
      position: relative;
    }

    .visited-badge {
      position: absolute;
      top: 16px;
      right: 16px;
      background: linear-gradient(135deg, #11998e 0%, #38ef7d 100%);
      color: white;
      padding: 6px 14px;
      border-radius: 20px;
      font-size: 12px;
      font-weight: 600;
      display: flex;
      align-items: center;
      gap: 4px;
    }

    .visited-badge mat-icon {
      font-size: 14px;
      width: 14px;
      height: 14px;
    }

    .card-overlay {
      position: absolute;
      inset: 0;
      background: linear-gradient(to top, rgba(0,0,0,0.7) 0%, transparent 60%);
      display: flex;
      align-items: flex-end;
      padding: 20px;
    }

    .card-overlay h3 {
      margin: 0;
      color: white;
      font-size: 22px;
      font-weight: 600;
    }

    .destination-card mat-card-content {
      padding: 20px;
    }

    .card-location {
      display: flex;
      align-items: center;
      gap: 6px;
      color: #666;
      font-size: 14px;
      margin-bottom: 12px;
    }

    .card-location mat-icon {
      font-size: 18px;
      width: 18px;
      height: 18px;
      color: #667eea;
    }

    .card-meta {
      display: flex;
      gap: 20px;
    }

    .meta-item {
      display: flex;
      align-items: center;
      gap: 6px;
      color: #888;
      font-size: 13px;
    }

    .meta-item mat-icon {
      font-size: 16px;
      width: 16px;
      height: 16px;
    }

    .empty-state {
      text-align: center;
      padding: 60px 24px;
      border-radius: 20px !important;
    }

    .empty-icon {
      width: 100px;
      height: 100px;
      border-radius: 50%;
      background: linear-gradient(135deg, #667eea20 0%, #764ba220 100%);
      display: flex;
      align-items: center;
      justify-content: center;
      margin: 0 auto 24px;
    }

    .empty-icon mat-icon {
      font-size: 48px;
      width: 48px;
      height: 48px;
      color: #667eea;
    }

    .empty-state h2 {
      margin: 0 0 12px;
      font-size: 24px;
      color: #1a1a2e;
    }

    .empty-state p {
      color: #666;
      max-width: 400px;
      margin: 0 auto 28px;
      line-height: 1.6;
    }

    .empty-state button {
      display: inline-flex;
      align-items: center;
      gap: 8px;
      padding: 14px 28px;
      border-radius: 12px;
    }

    .continents-section {
      background: white;
      border-radius: 20px;
      padding: 28px;
      box-shadow: 0 2px 12px rgba(0,0,0,0.05);
    }

    .continents-section h2 {
      margin: 0 0 24px;
      font-size: 20px;
      color: #1a1a2e;
    }

    .continent-cards {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
      gap: 16px;
    }

    .continent-item {
      display: flex;
      align-items: center;
      gap: 16px;
      padding: 16px;
      background: #f8f9ff;
      border-radius: 12px;
      transition: all 0.2s;
    }

    .continent-item:hover {
      background: #f0f2ff;
      transform: translateX(4px);
    }

    .continent-icon {
      width: 48px;
      height: 48px;
      border-radius: 12px;
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      display: flex;
      align-items: center;
      justify-content: center;
    }

    .continent-icon mat-icon {
      color: white;
      font-size: 24px;
      width: 24px;
      height: 24px;
    }

    .continent-info {
      display: flex;
      flex-direction: column;
    }

    .continent-name {
      font-weight: 600;
      color: #1a1a2e;
      font-size: 15px;
    }

    .continent-count {
      color: #666;
      font-size: 13px;
    }

    /* Countries Section */
    .countries-section {
      background: white;
      border-radius: 20px;
      padding: 28px;
      box-shadow: 0 2px 12px rgba(0,0,0,0.05);
      margin-top: 24px;
    }

    .countries-section h2 {
      margin: 0 0 8px;
      font-size: 20px;
      color: #1a1a2e;
    }

    .section-subtitle {
      margin: 0 0 20px;
      color: #888;
      font-size: 14px;
    }

    .country-cards {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
      gap: 12px;
    }

    .country-item {
      display: flex;
      align-items: center;
      gap: 16px;
      padding: 16px;
      background: #f8f9ff;
      border-radius: 12px;
      cursor: pointer;
      transition: all 0.2s;
    }

    .country-item:hover {
      background: #f0f2ff;
      transform: translateX(4px);
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
      font-size: 15px;
    }

    .country-count {
      color: #667eea;
      font-size: 13px;
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
      .dashboard-container {
        padding: 24px;
      }

      .stats-section {
        grid-template-columns: repeat(2, 1fr);
      }

      .destinations-grid {
        grid-template-columns: repeat(2, 1fr);
      }

      .continent-cards {
        grid-template-columns: repeat(2, 1fr);
      }

      .country-cards {
        grid-template-columns: repeat(2, 1fr);
      }
    }

    /* Mobile */
    @media (max-width: 768px) {
      .dashboard-container {
        padding: 16px;
      }

      .welcome-section {
        flex-direction: column;
        text-align: center;
      }

      .welcome-text h1 {
        font-size: 22px;
      }

      .welcome-text p {
        font-size: 14px;
      }

      .cta-button {
        width: 100%;
        justify-content: center;
      }

      .stats-section {
        grid-template-columns: 1fr;
        gap: 16px;
      }

      .stat-content {
        padding: 20px;
      }

      .stat-icon-wrapper {
        width: 52px;
        height: 52px;
      }

      .stat-icon-wrapper mat-icon {
        font-size: 26px;
        width: 26px;
        height: 26px;
      }

      .stat-value {
        font-size: 32px;
      }

      .section-header {
        flex-direction: column;
        align-items: flex-start;
        gap: 12px;
      }

      .destinations-grid {
        grid-template-columns: 1fr;
        gap: 16px;
      }

      .card-image {
        height: 150px;
      }

      .continents-section {
        padding: 20px;
      }

      .continent-cards {
        grid-template-columns: 1fr;
      }

      .countries-section {
        padding: 20px;
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
        padding: 40px 20px;
      }

      .empty-icon {
        width: 80px;
        height: 80px;
      }

      .empty-icon mat-icon {
        font-size: 40px;
        width: 40px;
        height: 40px;
      }

      .empty-state h2 {
        font-size: 20px;
      }

      .empty-state button {
        width: 100%;
        justify-content: center;
      }
    }

    /* Small mobile */
    @media (max-width: 480px) {
      .dashboard-container {
        padding: 12px;
      }

      .stat-content {
        gap: 14px;
      }

      .stat-value {
        font-size: 28px;
      }

      .stat-label {
        font-size: 13px;
      }
    }
  `]
})
export class DashboardComponent implements OnInit {
  loading = signal(true);
  stats = signal<DestinationStats | null>(null);
  recentDestinations = signal<Destination[]>([]);
  allDestinations = signal<Destination[]>([]);
  countryDetails = signal<CountryDetail[]>([]);
  selectedCountry = signal<CountryDetail | null>(null);

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
        this.allDestinations.set(destinations);
        this.recentDestinations.set(destinations.slice(0, 6));
        this.computeCountryDetails(destinations);
        this.loading.set(false);
      },
      error: () => this.loading.set(false)
    });
  }

  computeCountryDetails(destinations: Destination[]): void {
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

    const sorted = Array.from(countryMap.values()).sort((a, b) => b.cityCount - a.cityCount);
    this.countryDetails.set(sorted);
  }

  getContinentCount(): number {
    return Object.keys(this.stats()?.continentStats || {}).length;
  }

  getContinentEntries(): [string, number][] {
    const stats = this.stats()?.continentStats || {};
    return Object.entries(stats).sort((a, b) => b[1] - a[1]) as [string, number][];
  }

  getContinentIcon(name: string): string {
    const icons: Record<string, string> = {
      'Africa': 'terrain',
      'Antarctica': 'ac_unit',
      'Asia': 'temple_buddhist',
      'Europe': 'account_balance',
      'North America': 'landscape',
      'Oceania': 'waves',
      'South America': 'forest'
    };
    return icons[name] || 'public';
  }

  getDestinationImage(dest: Destination): string {
    if (dest.photos && dest.photos.length > 0) {
      return dest.photos[0].url;
    }
    // Use city image from backend
    if (dest.city?.imageUrl) {
      return dest.city.imageUrl;
    }
    return 'https://images.unsplash.com/photo-1488646953014-85cb44e25828?w=400';
  }

  // Country methods
  getCountryCount(): number {
    return this.countryDetails().length;
  }

  getFlag(code: string): string {
    if (!code) return '';
    const codePoints = code
      .toUpperCase()
      .split('')
      .map(char => 127397 + char.charCodeAt(0));
    return String.fromCodePoint(...codePoints);
  }

  openCountryModal(country: CountryDetail): void {
    this.selectedCountry.set(country);
  }

  closeCountryModal(): void {
    this.selectedCountry.set(null);
  }
}
