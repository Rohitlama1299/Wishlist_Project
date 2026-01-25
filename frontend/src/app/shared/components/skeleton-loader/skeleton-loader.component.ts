import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

export type SkeletonType = 'card' | 'stat' | 'text' | 'avatar' | 'image' | 'activity';

@Component({
  selector: 'app-skeleton-loader',
  standalone: true,
  imports: [CommonModule],
  template: `
    @switch (type) {
      @case ('card') {
        <div class="skeleton-card">
          <div class="skeleton-image shimmer"></div>
          <div class="skeleton-content">
            <div class="skeleton-title shimmer"></div>
            <div class="skeleton-subtitle shimmer"></div>
            <div class="skeleton-meta">
              <div class="skeleton-badge shimmer"></div>
              <div class="skeleton-badge shimmer"></div>
            </div>
          </div>
        </div>
      }
      @case ('stat') {
        <div class="skeleton-stat">
          <div class="skeleton-stat-icon shimmer"></div>
          <div class="skeleton-stat-content">
            <div class="skeleton-stat-value shimmer"></div>
            <div class="skeleton-stat-label shimmer"></div>
          </div>
        </div>
      }
      @case ('text') {
        <div class="skeleton-text-group">
          @for (line of textLines; track $index) {
            <div class="skeleton-text shimmer" [style.width]="line"></div>
          }
        </div>
      }
      @case ('avatar') {
        <div class="skeleton-avatar shimmer"></div>
      }
      @case ('image') {
        <div class="skeleton-image-only shimmer" [style.height]="height"></div>
      }
      @case ('activity') {
        <div class="skeleton-activity">
          <div class="skeleton-checkbox shimmer"></div>
          <div class="skeleton-activity-content">
            <div class="skeleton-activity-name shimmer"></div>
            <div class="skeleton-activity-desc shimmer"></div>
          </div>
          <div class="skeleton-activity-cost shimmer"></div>
        </div>
      }
    }
  `,
  styles: [`
    :host {
      display: block;
    }

    .shimmer {
      background: linear-gradient(
        90deg,
        #f0f0f0 0%,
        #e0e0e0 20%,
        #f0f0f0 40%,
        #f0f0f0 100%
      );
      background-size: 200% 100%;
      animation: shimmer 1.5s ease-in-out infinite;
      border-radius: 8px;
    }

    @keyframes shimmer {
      0% {
        background-position: 200% 0;
      }
      100% {
        background-position: -200% 0;
      }
    }

    /* Card Skeleton */
    .skeleton-card {
      background: white;
      border-radius: 20px;
      overflow: hidden;
      box-shadow: 0 2px 12px rgba(0,0,0,0.05);
    }

    .skeleton-image {
      height: 180px;
      border-radius: 0;
    }

    .skeleton-content {
      padding: 20px;
    }

    .skeleton-title {
      height: 24px;
      width: 70%;
      margin-bottom: 12px;
    }

    .skeleton-subtitle {
      height: 16px;
      width: 50%;
      margin-bottom: 16px;
    }

    .skeleton-meta {
      display: flex;
      gap: 12px;
    }

    .skeleton-badge {
      height: 20px;
      width: 60px;
      border-radius: 10px;
    }

    /* Stat Skeleton */
    .skeleton-stat {
      background: white;
      border-radius: 20px;
      padding: 28px;
      display: flex;
      align-items: center;
      gap: 20px;
      box-shadow: 0 2px 12px rgba(0,0,0,0.05);
    }

    .skeleton-stat-icon {
      width: 64px;
      height: 64px;
      border-radius: 16px;
      flex-shrink: 0;
    }

    .skeleton-stat-content {
      flex: 1;
    }

    .skeleton-stat-value {
      height: 40px;
      width: 60px;
      margin-bottom: 8px;
    }

    .skeleton-stat-label {
      height: 16px;
      width: 100px;
    }

    /* Text Skeleton */
    .skeleton-text-group {
      display: flex;
      flex-direction: column;
      gap: 12px;
    }

    .skeleton-text {
      height: 16px;
    }

    /* Avatar Skeleton */
    .skeleton-avatar {
      width: 48px;
      height: 48px;
      border-radius: 50%;
    }

    /* Image Only Skeleton */
    .skeleton-image-only {
      width: 100%;
      border-radius: 16px;
    }

    /* Activity Skeleton */
    .skeleton-activity {
      display: flex;
      align-items: center;
      gap: 16px;
      padding: 16px;
      background: white;
      border-radius: 12px;
      box-shadow: 0 2px 8px rgba(0,0,0,0.05);
    }

    .skeleton-checkbox {
      width: 24px;
      height: 24px;
      border-radius: 6px;
      flex-shrink: 0;
    }

    .skeleton-activity-content {
      flex: 1;
    }

    .skeleton-activity-name {
      height: 18px;
      width: 60%;
      margin-bottom: 8px;
    }

    .skeleton-activity-desc {
      height: 14px;
      width: 80%;
    }

    .skeleton-activity-cost {
      width: 60px;
      height: 24px;
      border-radius: 6px;
    }

    /* Responsive */
    @media (max-width: 768px) {
      .skeleton-stat {
        padding: 20px;
      }

      .skeleton-stat-icon {
        width: 52px;
        height: 52px;
      }

      .skeleton-stat-value {
        height: 32px;
      }

      .skeleton-image {
        height: 150px;
      }
    }
  `]
})
export class SkeletonLoaderComponent {
  @Input() type: SkeletonType = 'card';
  @Input() height = '200px';
  @Input() textLines: string[] = ['100%', '80%', '60%'];
}
