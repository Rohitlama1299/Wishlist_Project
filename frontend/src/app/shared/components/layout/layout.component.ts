import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet, RouterLink, RouterLinkActive } from '@angular/router';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatListModule } from '@angular/material/list';
import { MatMenuModule } from '@angular/material/menu';
import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-layout',
  standalone: true,
  imports: [
    CommonModule,
    RouterOutlet,
    RouterLink,
    RouterLinkActive,
    MatToolbarModule,
    MatButtonModule,
    MatIconModule,
    MatSidenavModule,
    MatListModule,
    MatMenuModule
  ],
  template: `
    <mat-sidenav-container class="sidenav-container">
      <mat-sidenav #sidenav mode="side" opened class="sidenav" [fixedInViewport]="true">
        <div class="sidenav-header">
          <mat-icon class="logo-icon">flight_takeoff</mat-icon>
          <span class="logo-text">Wanderlust</span>
        </div>

        <mat-nav-list>
          <a mat-list-item routerLink="/dashboard" routerLinkActive="active">
            <mat-icon matListItemIcon>dashboard</mat-icon>
            <span matListItemTitle>Dashboard</span>
          </a>
          <a mat-list-item routerLink="/explore" routerLinkActive="active">
            <mat-icon matListItemIcon>explore</mat-icon>
            <span matListItemTitle>Explore</span>
          </a>
          <a mat-list-item routerLink="/destinations" routerLinkActive="active">
            <mat-icon matListItemIcon>place</mat-icon>
            <span matListItemTitle>My Destinations</span>
          </a>
        </mat-nav-list>

        <div class="sidenav-footer">
          <mat-divider></mat-divider>
          <div class="user-info" [matMenuTriggerFor]="userMenu">
            <div class="user-avatar">
              {{ getUserInitials() }}
            </div>
            <div class="user-details">
              <span class="user-name">{{ authService.currentUser()?.firstName }} {{ authService.currentUser()?.lastName }}</span>
              <span class="user-email">{{ authService.currentUser()?.email }}</span>
            </div>
            <mat-icon>expand_more</mat-icon>
          </div>
        </div>

        <mat-menu #userMenu="matMenu">
          <button mat-menu-item (click)="logout()">
            <mat-icon>logout</mat-icon>
            <span>Logout</span>
          </button>
        </mat-menu>
      </mat-sidenav>

      <mat-sidenav-content class="content">
        <router-outlet></router-outlet>
      </mat-sidenav-content>
    </mat-sidenav-container>
  `,
  styles: [`
    .sidenav-container {
      height: 100vh;
    }

    .sidenav {
      width: 260px;
      background: #1a1a2e;
      color: white;
      display: flex;
      flex-direction: column;
    }

    .sidenav-header {
      padding: 24px;
      display: flex;
      align-items: center;
      gap: 12px;
      border-bottom: 1px solid rgba(255,255,255,0.1);
    }

    .logo-icon {
      font-size: 32px;
      width: 32px;
      height: 32px;
      color: #667eea;
    }

    .logo-text {
      font-size: 20px;
      font-weight: 600;
    }

    mat-nav-list {
      padding-top: 16px;
      flex: 1;
    }

    mat-nav-list a {
      color: rgba(255,255,255,0.7);
      margin: 4px 12px;
      border-radius: 8px;
    }

    mat-nav-list a:hover {
      background: rgba(255,255,255,0.1);
    }

    mat-nav-list a.active {
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      color: white;
    }

    mat-nav-list mat-icon {
      color: inherit;
    }

    .sidenav-footer {
      padding: 16px;
    }

    .user-info {
      display: flex;
      align-items: center;
      gap: 12px;
      padding: 12px;
      border-radius: 8px;
      cursor: pointer;
      margin-top: 12px;
    }

    .user-info:hover {
      background: rgba(255,255,255,0.1);
    }

    .user-avatar {
      width: 40px;
      height: 40px;
      border-radius: 50%;
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      display: flex;
      align-items: center;
      justify-content: center;
      font-weight: 600;
      font-size: 14px;
    }

    .user-details {
      flex: 1;
      display: flex;
      flex-direction: column;
    }

    .user-name {
      font-weight: 500;
      font-size: 14px;
    }

    .user-email {
      font-size: 12px;
      color: rgba(255,255,255,0.5);
    }

    .content {
      background: #f5f5f5;
    }
  `]
})
export class LayoutComponent {
  constructor(public authService: AuthService) {}

  getUserInitials(): string {
    const user = this.authService.currentUser();
    if (!user) return '';
    return `${user.firstName.charAt(0)}${user.lastName.charAt(0)}`.toUpperCase();
  }

  logout(): void {
    this.authService.logout();
  }
}
