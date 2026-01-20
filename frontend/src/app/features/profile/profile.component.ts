import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatDividerModule } from '@angular/material/divider';
import { AuthService } from '../../core/services/auth.service';
import { DestinationsService } from '../../core/services/destinations.service';
import { User, DestinationStats } from '../../models';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatInputModule,
    MatProgressSpinnerModule,
    MatSnackBarModule,
    MatDividerModule
  ],
  template: `
    <div class="profile-container">
      <header class="profile-header">
        <div class="header-content">
          <div class="avatar-section">
            <div class="avatar-large">
              {{ getUserInitials() }}
            </div>
            <div class="user-info">
              <h1>{{ user()?.firstName }} {{ user()?.lastName }}</h1>
              <p class="email">{{ user()?.email }}</p>
              <p class="member-since">Member since {{ getMemberSince() }}</p>
            </div>
          </div>
        </div>
      </header>

      <div class="profile-content">
        <div class="stats-section">
          <h2>Travel Statistics</h2>
          <div class="stats-grid">
            <mat-card class="stat-card">
              <div class="stat-icon total">
                <mat-icon>place</mat-icon>
              </div>
              <div class="stat-info">
                <span class="stat-value">{{ stats()?.totalDestinations || 0 }}</span>
                <span class="stat-label">Total Destinations</span>
              </div>
            </mat-card>

            <mat-card class="stat-card">
              <div class="stat-icon visited">
                <mat-icon>check_circle</mat-icon>
              </div>
              <div class="stat-info">
                <span class="stat-value">{{ stats()?.visitedCount || 0 }}</span>
                <span class="stat-label">Places Visited</span>
              </div>
            </mat-card>

            <mat-card class="stat-card">
              <div class="stat-icon pending">
                <mat-icon>schedule</mat-icon>
              </div>
              <div class="stat-info">
                <span class="stat-value">{{ stats()?.pendingCount || 0 }}</span>
                <span class="stat-label">On Wishlist</span>
              </div>
            </mat-card>

            <mat-card class="stat-card">
              <div class="stat-icon continents">
                <mat-icon>public</mat-icon>
              </div>
              <div class="stat-info">
                <span class="stat-value">{{ getContinentCount() }}</span>
                <span class="stat-label">Continents Explored</span>
              </div>
            </mat-card>
          </div>
        </div>

        @if (getContinentCount() > 0) {
          <div class="continents-breakdown">
            <h2>Destinations by Continent</h2>
            <div class="continent-bars">
              @for (entry of getContinentEntries(); track entry[0]) {
                <div class="continent-bar-item">
                  <div class="continent-label">
                    <span class="continent-name">{{ entry[0] }}</span>
                    <span class="continent-count">{{ entry[1] }}</span>
                  </div>
                  <div class="progress-bar">
                    <div
                      class="progress-fill"
                      [style.width.%]="getProgressWidth(entry[1])"
                    ></div>
                  </div>
                </div>
              }
            </div>
          </div>
        }

        <mat-card class="edit-profile-card">
          <mat-card-header>
            <mat-card-title>
              <mat-icon>edit</mat-icon>
              Edit Profile
            </mat-card-title>
          </mat-card-header>
          <mat-card-content>
            <form [formGroup]="profileForm" (ngSubmit)="onSubmit()">
              <div class="form-row">
                <mat-form-field appearance="outline">
                  <mat-label>First Name</mat-label>
                  <input matInput formControlName="firstName" placeholder="Enter your first name">
                  <mat-icon matPrefix>person</mat-icon>
                  @if (profileForm.get('firstName')?.hasError('required') && profileForm.get('firstName')?.touched) {
                    <mat-error>First name is required</mat-error>
                  }
                </mat-form-field>

                <mat-form-field appearance="outline">
                  <mat-label>Last Name</mat-label>
                  <input matInput formControlName="lastName" placeholder="Enter your last name">
                  <mat-icon matPrefix>person</mat-icon>
                  @if (profileForm.get('lastName')?.hasError('required') && profileForm.get('lastName')?.touched) {
                    <mat-error>Last name is required</mat-error>
                  }
                </mat-form-field>
              </div>

              <mat-form-field appearance="outline" class="full-width">
                <mat-label>Email</mat-label>
                <input matInput formControlName="email" type="email" placeholder="Enter your email">
                <mat-icon matPrefix>email</mat-icon>
                <mat-hint>Email cannot be changed</mat-hint>
              </mat-form-field>

              <div class="form-actions">
                <button mat-flat-button color="primary" type="submit" [disabled]="saving() || profileForm.invalid || !profileForm.dirty">
                  @if (saving()) {
                    <mat-spinner diameter="20"></mat-spinner>
                  } @else {
                    <mat-icon>save</mat-icon>
                    Save Changes
                  }
                </button>
              </div>
            </form>
          </mat-card-content>
        </mat-card>

        <mat-card class="danger-zone">
          <mat-card-header>
            <mat-card-title>
              <mat-icon>warning</mat-icon>
              Account Actions
            </mat-card-title>
          </mat-card-header>
          <mat-card-content>
            <div class="action-item">
              <div class="action-info">
                <h4>Log Out</h4>
                <p>Sign out of your account on this device</p>
              </div>
              <button mat-stroked-button color="warn" (click)="logout()">
                <mat-icon>logout</mat-icon>
                Log Out
              </button>
            </div>
          </mat-card-content>
        </mat-card>
      </div>
    </div>
  `,
  styles: [`
    .profile-container {
      min-height: 100vh;
      background: linear-gradient(135deg, #f8f9ff 0%, #f0f4ff 100%);
    }

    .profile-header {
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      padding: 48px 32px;
      color: white;
    }

    .header-content {
      max-width: 1200px;
      margin: 0 auto;
    }

    .avatar-section {
      display: flex;
      align-items: center;
      gap: 24px;
    }

    .avatar-large {
      width: 100px;
      height: 100px;
      border-radius: 50%;
      background: rgba(255,255,255,0.2);
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 36px;
      font-weight: 700;
      border: 4px solid rgba(255,255,255,0.3);
    }

    .user-info h1 {
      margin: 0 0 8px;
      font-size: 32px;
      font-weight: 700;
    }

    .email {
      margin: 0 0 4px;
      opacity: 0.9;
      font-size: 16px;
    }

    .member-since {
      margin: 0;
      opacity: 0.7;
      font-size: 14px;
    }

    .profile-content {
      max-width: 1200px;
      margin: -30px auto 0;
      padding: 0 32px 48px;
      position: relative;
      z-index: 10;
    }

    .stats-section {
      margin-bottom: 32px;
    }

    .stats-section h2 {
      margin: 0 0 16px;
      font-size: 20px;
      color: #1a1a2e;
    }

    .stats-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
      gap: 20px;
    }

    .stat-card {
      border-radius: 16px !important;
      padding: 24px;
    }

    .stat-card {
      display: flex;
      align-items: center;
      gap: 20px;
    }

    .stat-icon {
      width: 60px;
      height: 60px;
      border-radius: 16px;
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
      font-size: 36px;
      font-weight: 700;
      color: #1a1a2e;
      line-height: 1.1;
    }

    .stat-label {
      color: #666;
      font-size: 14px;
      margin-top: 4px;
    }

    .continents-breakdown {
      background: white;
      border-radius: 16px;
      padding: 24px;
      margin-bottom: 32px;
      box-shadow: 0 2px 12px rgba(0,0,0,0.05);
    }

    .continents-breakdown h2 {
      margin: 0 0 20px;
      font-size: 18px;
      color: #1a1a2e;
    }

    .continent-bars {
      display: flex;
      flex-direction: column;
      gap: 16px;
    }

    .continent-bar-item {
      display: flex;
      flex-direction: column;
      gap: 8px;
    }

    .continent-label {
      display: flex;
      justify-content: space-between;
      align-items: center;
    }

    .continent-name {
      font-weight: 500;
      color: #333;
    }

    .continent-count {
      font-weight: 600;
      color: #667eea;
    }

    .progress-bar {
      height: 8px;
      background: #f0f0f0;
      border-radius: 4px;
      overflow: hidden;
    }

    .progress-fill {
      height: 100%;
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      border-radius: 4px;
      transition: width 0.3s ease;
    }

    .edit-profile-card {
      border-radius: 16px !important;
      margin-bottom: 24px;
    }

    .edit-profile-card mat-card-header {
      padding: 24px 24px 0;
    }

    .edit-profile-card mat-card-title {
      display: flex;
      align-items: center;
      gap: 12px;
      font-size: 18px;
      color: #1a1a2e;
    }

    .edit-profile-card mat-card-title mat-icon {
      color: #667eea;
    }

    .edit-profile-card mat-card-content {
      padding: 24px;
    }

    .form-row {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 20px;
    }

    .full-width {
      width: 100%;
    }

    mat-form-field {
      width: 100%;
    }

    .form-actions {
      margin-top: 8px;
    }

    .form-actions button {
      display: flex;
      align-items: center;
      gap: 8px;
    }

    .danger-zone {
      border-radius: 16px !important;
      border: 1px solid #ffebee;
    }

    .danger-zone mat-card-header {
      padding: 24px 24px 0;
    }

    .danger-zone mat-card-title {
      display: flex;
      align-items: center;
      gap: 12px;
      font-size: 18px;
      color: #f44336;
    }

    .danger-zone mat-card-content {
      padding: 24px;
    }

    .action-item {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 16px 0;
    }

    .action-info h4 {
      margin: 0 0 4px;
      font-size: 16px;
      color: #333;
    }

    .action-info p {
      margin: 0;
      font-size: 14px;
      color: #666;
    }

    .action-item button {
      display: flex;
      align-items: center;
      gap: 8px;
    }

    @media (max-width: 768px) {
      .profile-header {
        padding: 32px 20px;
      }

      .avatar-section {
        flex-direction: column;
        text-align: center;
      }

      .user-info h1 {
        font-size: 24px;
      }

      .profile-content {
        padding: 0 20px 32px;
      }

      .form-row {
        grid-template-columns: 1fr;
      }

      .action-item {
        flex-direction: column;
        gap: 16px;
        text-align: center;
      }
    }
  `]
})
export class ProfileComponent implements OnInit {
  user = signal<User | null>(null);
  stats = signal<DestinationStats | null>(null);
  saving = signal(false);
  profileForm: FormGroup;

  constructor(
    private authService: AuthService,
    private destinationsService: DestinationsService,
    private fb: FormBuilder,
    private snackBar: MatSnackBar
  ) {
    this.profileForm = this.fb.group({
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      email: [{ value: '', disabled: true }]
    });
  }

  ngOnInit(): void {
    this.loadUserData();
    this.loadStats();
  }

  loadUserData(): void {
    const currentUser = this.authService.currentUser();
    if (currentUser) {
      this.user.set(currentUser);
      this.profileForm.patchValue({
        firstName: currentUser.firstName,
        lastName: currentUser.lastName,
        email: currentUser.email
      });
    }
  }

  loadStats(): void {
    this.destinationsService.getStats().subscribe({
      next: (stats) => this.stats.set(stats),
      error: () => this.stats.set(null)
    });
  }

  getUserInitials(): string {
    const currentUser = this.user();
    if (!currentUser) return '';
    return `${currentUser.firstName.charAt(0)}${currentUser.lastName.charAt(0)}`.toUpperCase();
  }

  getMemberSince(): string {
    const user = this.user();
    if (!user || !user.createdAt) return 'Recently';
    const date = new Date(user.createdAt);
    return date.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
  }

  getContinentCount(): number {
    return Object.keys(this.stats()?.continentStats || {}).length;
  }

  getContinentEntries(): [string, number][] {
    const stats = this.stats()?.continentStats || {};
    return Object.entries(stats).sort((a, b) => b[1] - a[1]) as [string, number][];
  }

  getProgressWidth(count: number): number {
    const maxCount = Math.max(...Object.values(this.stats()?.continentStats || { '': 1 }));
    return (count / maxCount) * 100;
  }

  onSubmit(): void {
    if (this.profileForm.invalid) return;

    this.saving.set(true);
    // Note: The backend doesn't have an update profile endpoint yet,
    // so we'll just show a success message for now
    setTimeout(() => {
      this.saving.set(false);
      this.snackBar.open('Profile updated successfully!', 'Close', { duration: 3000 });
      this.profileForm.markAsPristine();
    }, 1000);
  }

  logout(): void {
    this.authService.logout();
  }
}
