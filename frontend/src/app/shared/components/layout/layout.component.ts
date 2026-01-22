import { Component, ViewChild, signal, HostListener } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet, RouterLink, RouterLinkActive } from '@angular/router';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatSidenavModule, MatSidenav } from '@angular/material/sidenav';
import { MatListModule } from '@angular/material/list';
import { MatMenuModule } from '@angular/material/menu';
import { MatTooltipModule } from '@angular/material/tooltip';
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
    MatMenuModule,
    MatTooltipModule
  ],
  template: `
    <mat-sidenav-container class="sidenav-container">
      <mat-sidenav #sidenav [mode]="isMobile() ? 'over' : 'side'" [opened]="!isMobile()" class="sidenav" [fixedInViewport]="true">
        <div class="sidenav-header">
          <div class="logo">
            <div class="logo-icon">
              <mat-icon>flight_takeoff</mat-icon>
            </div>
            <span class="logo-text">Wanderlust</span>
          </div>
          @if (isMobile()) {
            <button mat-icon-button class="close-sidenav" (click)="sidenav.close()">
              <mat-icon>close</mat-icon>
            </button>
          }
        </div>

        <nav class="nav-section">
          <span class="nav-label">Menu</span>
          <a class="nav-item" routerLink="/dashboard" routerLinkActive="active" (click)="onNavClick()">
            <mat-icon>dashboard</mat-icon>
            <span>Dashboard</span>
          </a>
          <a class="nav-item" routerLink="/explore" routerLinkActive="active" (click)="onNavClick()">
            <mat-icon>explore</mat-icon>
            <span>Explore</span>
          </a>
          <a class="nav-item" routerLink="/destinations" routerLinkActive="active" (click)="onNavClick()">
            <mat-icon>place</mat-icon>
            <span>My Destinations</span>
          </a>
        </nav>

        <nav class="nav-section">
          <span class="nav-label">Account</span>
          <a class="nav-item" routerLink="/profile" routerLinkActive="active" (click)="onNavClick()">
            <mat-icon>person</mat-icon>
            <span>Profile</span>
          </a>
        </nav>

        <div class="sidenav-footer">
          <div class="user-card" [matMenuTriggerFor]="userMenu">
            <div class="user-avatar" [class.has-image]="authService.currentUser()?.profilePicture" [style.background-image]="authService.currentUser()?.profilePicture ? 'url(' + authService.currentUser()?.profilePicture + ')' : 'none'">
              @if (!authService.currentUser()?.profilePicture) {
                {{ getUserInitials() }}
              }
            </div>
            <div class="user-details">
              <span class="user-name">{{ authService.currentUser()?.firstName }} {{ authService.currentUser()?.lastName }}</span>
              <span class="user-email">{{ authService.currentUser()?.email }}</span>
            </div>
            <mat-icon class="expand-icon">unfold_more</mat-icon>
          </div>
        </div>

        <mat-menu #userMenu="matMenu" class="user-menu">
          <button mat-menu-item routerLink="/profile" (click)="onNavClick()">
            <mat-icon>person</mat-icon>
            <span>Profile</span>
          </button>
          <mat-divider></mat-divider>
          <button mat-menu-item (click)="logout()">
            <mat-icon>logout</mat-icon>
            <span>Logout</span>
          </button>
        </mat-menu>
      </mat-sidenav>

      <mat-sidenav-content class="content">
        <!-- Mobile Header -->
        @if (isMobile()) {
          <div class="mobile-header">
            <button mat-icon-button (click)="sidenav.toggle()">
              <mat-icon>menu</mat-icon>
            </button>
            <div class="mobile-logo">
              <mat-icon>flight_takeoff</mat-icon>
              <span>Wanderlust</span>
            </div>
            <div class="mobile-avatar" [class.has-image]="authService.currentUser()?.profilePicture" [style.background-image]="authService.currentUser()?.profilePicture ? 'url(' + authService.currentUser()?.profilePicture + ')' : 'none'" [matMenuTriggerFor]="mobileUserMenu">
              @if (!authService.currentUser()?.profilePicture) {
                {{ getUserInitials() }}
              }
            </div>
            <mat-menu #mobileUserMenu="matMenu">
              <button mat-menu-item routerLink="/profile">
                <mat-icon>person</mat-icon>
                <span>Profile</span>
              </button>
              <mat-divider></mat-divider>
              <button mat-menu-item (click)="logout()">
                <mat-icon>logout</mat-icon>
                <span>Logout</span>
              </button>
            </mat-menu>
          </div>
        }
        <router-outlet></router-outlet>
      </mat-sidenav-content>
    </mat-sidenav-container>
  `,
  styles: [`
    .sidenav-container {
      height: 100vh;
    }

    .sidenav {
      width: 280px;
      background: linear-gradient(180deg, #1a1a2e 0%, #16213e 100%);
      color: white;
      display: flex;
      flex-direction: column;
      border-right: none;
    }

    .sidenav-header {
      padding: 24px;
      display: flex;
      justify-content: space-between;
      align-items: flex-start;
    }

    .logo {
      display: flex;
      align-items: center;
      gap: 14px;
    }

    .logo-icon {
      width: 44px;
      height: 44px;
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      border-radius: 12px;
      display: flex;
      align-items: center;
      justify-content: center;
    }

    .logo-icon mat-icon {
      font-size: 24px;
      width: 24px;
      height: 24px;
      color: white;
    }

    .logo-text {
      font-size: 22px;
      font-weight: 700;
      background: linear-gradient(135deg, #667eea 0%, #a855f7 100%);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      background-clip: text;
    }

    .nav-section {
      padding: 8px 16px;
      flex: 1;
    }

    .nav-section:last-of-type {
      flex: 0;
      border-top: 1px solid rgba(255,255,255,0.08);
      padding-top: 16px;
    }

    .nav-label {
      display: block;
      font-size: 11px;
      text-transform: uppercase;
      letter-spacing: 1px;
      color: rgba(255,255,255,0.4);
      padding: 8px 12px;
      margin-bottom: 4px;
    }

    .nav-item {
      display: flex;
      align-items: center;
      gap: 14px;
      padding: 14px 16px;
      border-radius: 12px;
      color: rgba(255,255,255,0.7);
      text-decoration: none;
      margin-bottom: 4px;
      transition: all 0.2s ease;
    }

    .nav-item:hover {
      background: rgba(255,255,255,0.08);
      color: white;
    }

    .nav-item.active {
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      color: white;
      box-shadow: 0 4px 15px rgba(102, 126, 234, 0.4);
    }

    .nav-item mat-icon {
      font-size: 22px;
      width: 22px;
      height: 22px;
    }

    .nav-item span {
      font-size: 15px;
      font-weight: 500;
    }

    .sidenav-footer {
      padding: 16px;
      border-top: 1px solid rgba(255,255,255,0.08);
    }

    .user-card {
      display: flex;
      align-items: center;
      gap: 12px;
      padding: 12px;
      border-radius: 12px;
      cursor: pointer;
      transition: all 0.2s;
      background: rgba(255,255,255,0.05);
    }

    .user-card:hover {
      background: rgba(255,255,255,0.1);
    }

    .user-avatar {
      width: 42px;
      height: 42px;
      border-radius: 10px;
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      background-size: cover;
      background-position: center;
      display: flex;
      align-items: center;
      justify-content: center;
      font-weight: 600;
      font-size: 15px;
      color: white;
      flex-shrink: 0;
    }

    .user-avatar.has-image {
      background-color: transparent;
    }

    .user-details {
      flex: 1;
      display: flex;
      flex-direction: column;
      overflow: hidden;
    }

    .user-name {
      font-weight: 600;
      font-size: 14px;
      color: white;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }

    .user-email {
      font-size: 12px;
      color: rgba(255,255,255,0.5);
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }

    .expand-icon {
      color: rgba(255,255,255,0.5);
      font-size: 18px;
      width: 18px;
      height: 18px;
    }

    .content {
      background: #f8f9ff;
    }

    ::ng-deep .user-menu {
      min-width: 200px !important;
    }

    /* Mobile Header */
    .mobile-header {
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 12px 16px;
      background: linear-gradient(135deg, #1a1a2e 0%, #16213e 100%);
      color: white;
      position: sticky;
      top: 0;
      z-index: 100;
    }

    .mobile-header button {
      color: white;
    }

    .mobile-logo {
      display: flex;
      align-items: center;
      gap: 8px;
      font-size: 18px;
      font-weight: 600;
    }

    .mobile-logo mat-icon {
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      padding: 6px;
      border-radius: 8px;
      font-size: 20px;
      width: 20px;
      height: 20px;
    }

    .mobile-avatar {
      width: 36px;
      height: 36px;
      border-radius: 50%;
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      background-size: cover;
      background-position: center;
      display: flex;
      align-items: center;
      justify-content: center;
      font-weight: 600;
      font-size: 14px;
      cursor: pointer;
      color: white;
      flex-shrink: 0;
    }

    .mobile-avatar.has-image {
      background-color: transparent;
    }

    .close-sidenav {
      color: white;
    }

    /* Tablet adjustments */
    @media (max-width: 1024px) and (min-width: 769px) {
      .sidenav {
        width: 240px;
      }

      .logo-text {
        font-size: 18px;
      }

      .nav-item {
        padding: 12px 14px;
      }
    }

    /* Mobile adjustments */
    @media (max-width: 768px) {
      .sidenav {
        width: 280px;
      }
    }
  `]
})
export class LayoutComponent {
  @ViewChild('sidenav') sidenav!: MatSidenav;
  isMobile = signal(window.innerWidth <= 768);

  constructor(public authService: AuthService) {
    this.checkScreenSize();
  }

  @HostListener('window:resize')
  onResize() {
    this.checkScreenSize();
  }

  private checkScreenSize(): void {
    this.isMobile.set(window.innerWidth <= 768);
  }

  onNavClick(): void {
    if (this.isMobile()) {
      this.sidenav?.close();
    }
  }

  getUserInitials(): string {
    const user = this.authService.currentUser();
    if (!user) return '';
    return `${user.firstName.charAt(0)}${user.lastName.charAt(0)}`.toUpperCase();
  }

  logout(): void {
    this.authService.logout();
  }
}
