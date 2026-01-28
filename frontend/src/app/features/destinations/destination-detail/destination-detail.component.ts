import { Component, OnInit, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatChipsModule } from '@angular/material/chips';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatDialogModule } from '@angular/material/dialog';
import { MatTabsModule } from '@angular/material/tabs';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatSelectModule } from '@angular/material/select';
import { DestinationsService } from '../../../core/services/destinations.service';
import { LocationsService } from '../../../core/services/locations.service';
import { Destination, Photo, Activity, CreateActivityRequest, CityActivity } from '../../../models';
import { environment } from '../../../../environments/environment';
import { fadeInUp, cardStagger, backdropAnimation, dialogAnimation } from '../../../animations/route.animations';

const ACTIVITY_CATEGORIES = [
  { value: 'sightseeing', label: 'Sightseeing', icon: 'visibility' },
  { value: 'food', label: 'Food & Dining', icon: 'restaurant' },
  { value: 'adventure', label: 'Adventure', icon: 'hiking' },
  { value: 'culture', label: 'Culture', icon: 'museum' },
  { value: 'shopping', label: 'Shopping', icon: 'shopping_bag' },
  { value: 'nightlife', label: 'Nightlife', icon: 'nightlife' },
  { value: 'relaxation', label: 'Relaxation', icon: 'spa' },
  { value: 'other', label: 'Other', icon: 'category' }
];

@Component({
  selector: 'app-destination-detail',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    RouterLink,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatInputModule,
    MatProgressSpinnerModule,
    MatChipsModule,
    MatSnackBarModule,
    MatDialogModule,
    MatTabsModule,
    MatCheckboxModule,
    MatSelectModule
  ],
  animations: [fadeInUp, cardStagger, backdropAnimation, dialogAnimation],
  template: `
    <div class="detail-container">
      @if (loading()) {
        <div class="loading-container">
          <mat-spinner></mat-spinner>
        </div>
      } @else if (destination()) {
        <!-- Hero Section with City Image -->
        <div class="hero-section" @fadeInUp>
          <div class="hero-image" [style.backgroundImage]="'url(' + getCityImageUrl() + ')'">
            <div class="hero-overlay"></div>
            <div class="hero-content">
              <div class="header-top">
                <button mat-icon-button routerLink="/destinations" class="back-btn">
                  <mat-icon>arrow_back</mat-icon>
                </button>
                <mat-chip [class.visited]="destination()!.visited" (click)="toggleVisited()">
                  <mat-icon>{{ destination()!.visited ? 'check_circle' : 'bookmark' }}</mat-icon>
                  {{ destination()!.visited ? 'Visited' : 'Wishlist' }}
                </mat-chip>
              </div>
              <div class="hero-text">
                <h1 class="city-name">{{ destination()!.city?.name }}</h1>
                <p class="location-subtitle">
                  <mat-icon>location_on</mat-icon>
                  {{ destination()!.city?.country?.name }}, {{ destination()!.city?.country?.continent?.name }}
                </p>
              </div>
            </div>
          </div>
        </div>

        <!-- Tabs Section -->
        <div class="tabs-container" @fadeInUp>
          <div class="tab-buttons">
            <button class="tab-btn" [class.active]="activeTab() === 'bucket'" (click)="setActiveTab('bucket')">
              <mat-icon>photo_library</mat-icon>
              Bucket List
              <span class="tab-count">{{ destination()!.photos?.length || 0 }}</span>
            </button>
            <button class="tab-btn" [class.active]="activeTab() === 'itinerary'" (click)="setActiveTab('itinerary')">
              <mat-icon>checklist</mat-icon>
              Itinerary
              <span class="tab-count">{{ destination()!.activities?.length || 0 }}</span>
            </button>
            <button class="tab-btn" [class.active]="activeTab() === 'suggestions'" (click)="setActiveTab('suggestions')">
              <mat-icon>lightbulb</mat-icon>
              Ideas
              <span class="tab-count">{{ suggestedActivities().length }}</span>
            </button>
          </div>
        </div>

        <!-- Bucket List Section -->
        @if (activeTab() === 'bucket') {
          <section class="bucket-list-section" @fadeInUp>
            <div class="section-header">
              <h2>Bucket List</h2>
              <button mat-raised-button color="primary" class="add-item-btn" (click)="openItemDialog()">
                <mat-icon>add</mat-icon>
                Add to List
              </button>
            </div>

            @if (destination()!.photos && destination()!.photos!.length > 0) {
              <div class="postcards-grid" [@cardStagger]="destination()!.photos!.length">
                @for (photo of destination()!.photos; track photo.id) {
                  <div class="postcard" (click)="openItemDialog(photo)">
                    <div class="postcard-image">
                      <img [src]="getPhotoUrl(photo)" [alt]="photo.caption || 'Bucket list item'">
                    </div>
                    <div class="postcard-content">
                      @if (photo.caption) {
                        <p class="postcard-note">{{ photo.caption }}</p>
                      }
                      <div class="postcard-footer">
                        <span class="postcard-date">{{ photo.createdAt | date:'MMM d, yyyy' }}</span>
                        <button mat-icon-button class="edit-btn" (click)="openItemDialog(photo); $event.stopPropagation()">
                          <mat-icon>edit</mat-icon>
                        </button>
                      </div>
                    </div>
                  </div>
                }
              </div>
            } @else {
              <div class="empty-state">
                <mat-icon>explore</mat-icon>
                <h3>No bucket list items yet</h3>
                <p>Add things you want to see and do!</p>
              </div>
            }
          </section>
        }

        <!-- Itinerary Section -->
        @if (activeTab() === 'itinerary') {
          <section class="itinerary-section" @fadeInUp>
            <div class="section-header">
              <h2>Itinerary</h2>
              <button mat-raised-button color="primary" class="add-item-btn" (click)="openActivityDialog()">
                <mat-icon>add</mat-icon>
                Add Activity
              </button>
            </div>

            <!-- Category Filters -->
            <div class="category-filters">
              <button
                class="filter-chip"
                [class.active]="selectedCategory() === null"
                (click)="setSelectedCategory(null)">
                All
              </button>
              @for (cat of getUniqueCategories(); track cat) {
                <button
                  class="filter-chip"
                  [class.active]="selectedCategory() === cat"
                  (click)="setSelectedCategory(cat)">
                  <mat-icon>{{ getCategoryIcon(cat) }}</mat-icon>
                  {{ getCategoryLabel(cat) }}
                </button>
              }
            </div>

            @if (filteredActivities().length > 0) {
              <div class="activities-list" [@cardStagger]="filteredActivities().length">
                @for (activity of filteredActivities(); track activity.id) {
                  <div class="activity-item" [class.completed]="activity.completed">
                    <button mat-icon-button class="check-btn" (click)="toggleActivityCompleted(activity)">
                      <mat-icon>{{ activity.completed ? 'check_circle' : 'radio_button_unchecked' }}</mat-icon>
                    </button>
                    <div class="activity-content" (click)="openActivityDialog(activity)">
                      <div class="activity-header">
                        <h4>{{ activity.name }}</h4>
                        @if (activity.category) {
                          <span class="activity-category" [attr.data-category]="activity.category">
                            <mat-icon>{{ getCategoryIcon(activity.category) }}</mat-icon>
                            {{ getCategoryLabel(activity.category) }}
                          </span>
                        }
                      </div>
                      @if (activity.description) {
                        <p class="activity-description">{{ activity.description }}</p>
                      }
                      @if (activity.estimatedCost) {
                        <div class="activity-cost">
                          <mat-icon>payments</mat-icon>
                          {{ activity.currency || '$' }}{{ activity.estimatedCost | number:'1.0-0' }}
                        </div>
                      }
                    </div>
                    <button mat-icon-button class="edit-btn" (click)="openActivityDialog(activity); $event.stopPropagation()">
                      <mat-icon>edit</mat-icon>
                    </button>
                  </div>
                }
              </div>

              <!-- Cost Summary -->
              @if (totalEstimatedCost() > 0) {
                <div class="cost-summary" @fadeInUp>
                  <div class="cost-row">
                    <span>Estimated Total</span>
                    <span class="cost-value">&#36;{{ totalEstimatedCost() | number:'1.0-0' }}</span>
                  </div>
                  <div class="cost-row completed-row">
                    <span>Completed</span>
                    <span class="cost-value">&#36;{{ completedCost() | number:'1.0-0' }}</span>
                  </div>
                  <div class="cost-row remaining-row">
                    <span>Remaining</span>
                    <span class="cost-value">&#36;{{ totalEstimatedCost() - completedCost() | number:'1.0-0' }}</span>
                  </div>
                </div>
              }
            } @else {
              <div class="empty-state">
                <mat-icon>checklist</mat-icon>
                <h3>No activities yet</h3>
                <p>Plan your itinerary by adding activities!</p>
              </div>
            }
          </section>
        }

        <!-- Suggestions Section -->
        @if (activeTab() === 'suggestions') {
          <section class="suggestions-section" @fadeInUp>
            <div class="section-header">
              <div>
                <h2>Activity Ideas</h2>
                <p class="section-subtitle">Curated suggestions for {{ destination()!.city?.name }}</p>
              </div>
            </div>

            @if (loadingSuggestions()) {
              <div class="suggestions-loading">
                <mat-spinner diameter="40"></mat-spinner>
                <p>Loading suggestions...</p>
              </div>
            } @else if (suggestedActivities().length > 0) {
              <!-- Category Filters -->
              <div class="category-filters">
                <button
                  class="filter-chip"
                  [class.active]="selectedSuggestionCategory() === null"
                  (click)="setSelectedSuggestionCategory(null)">
                  All
                </button>
                @for (cat of getUniqueSuggestionCategories(); track cat) {
                  <button
                    class="filter-chip"
                    [class.active]="selectedSuggestionCategory() === cat"
                    (click)="setSelectedSuggestionCategory(cat)">
                    <mat-icon>{{ getCategoryIcon(cat) }}</mat-icon>
                    {{ getCategoryLabel(cat) }}
                  </button>
                }
              </div>

              <div class="suggestions-grid" [@cardStagger]="filteredSuggestions().length">
                @for (suggestion of filteredSuggestions(); track suggestion.id) {
                  <div class="suggestion-card" [class.in-itinerary]="isActivityInItinerary(suggestion)">
                    @if (suggestion.imageUrl) {
                      <div class="suggestion-image" [style.backgroundImage]="'url(' + suggestion.imageUrl + ')'"></div>
                    } @else {
                      <div class="suggestion-image suggestion-image-placeholder">
                        <mat-icon>{{ getCategoryIcon(suggestion.category) }}</mat-icon>
                      </div>
                    }
                    <div class="suggestion-content">
                      <div class="suggestion-header">
                        <h4>{{ suggestion.name }}</h4>
                        <span class="suggestion-category" [attr.data-category]="suggestion.category">
                          <mat-icon>{{ getCategoryIcon(suggestion.category) }}</mat-icon>
                          {{ getCategoryLabel(suggestion.category) }}
                        </span>
                      </div>
                      @if (suggestion.description) {
                        <p class="suggestion-description">{{ suggestion.description }}</p>
                      }
                      <div class="suggestion-meta">
                        @if (suggestion.duration) {
                          <span class="meta-item">
                            <mat-icon>schedule</mat-icon>
                            {{ suggestion.duration }}
                          </span>
                        }
                        @if (suggestion.estimatedCost) {
                          <span class="meta-item cost">
                            <mat-icon>payments</mat-icon>
                            {{ suggestion.currency || '$' }}{{ suggestion.estimatedCost | number:'1.0-0' }}
                          </span>
                        }
                      </div>
                      <div class="suggestion-actions">
                        @if (isActivityInItinerary(suggestion)) {
                          <button mat-button disabled class="added-btn">
                            <mat-icon>check</mat-icon>
                            In Itinerary
                          </button>
                        } @else {
                          <button mat-raised-button color="primary" (click)="addSuggestionToItinerary(suggestion)">
                            <mat-icon>add</mat-icon>
                            Add to Itinerary
                          </button>
                        }
                      </div>
                    </div>
                  </div>
                }
              </div>
            } @else {
              <div class="empty-state">
                <mat-icon>lightbulb</mat-icon>
                <h3>No suggestions yet</h3>
                <p>We're working on adding activity ideas for this destination!</p>
              </div>
            }
          </section>
        }

        <!-- Photo Item Dialog Overlay -->
        @if (dialogOpen()) {
          <div class="dialog-overlay" @backdropAnimation (click)="closeItemDialog()">
            <div class="item-dialog" @dialogAnimation (click)="$event.stopPropagation()">
              <div class="dialog-header">
                <h3>{{ editingPhoto() ? 'Edit Item' : 'Add to Bucket List' }}</h3>
                <button mat-icon-button (click)="closeItemDialog()">
                  <mat-icon>close</mat-icon>
                </button>
              </div>

              <div class="dialog-content">
                <!-- Image Upload Area -->
                <div class="upload-area"
                     [class.has-image]="previewUrl()"
                     [class.dragging]="isDragging()"
                     (click)="fileInput.click()"
                     (dragover)="onDragOver($event)"
                     (dragleave)="onDragLeave($event)"
                     (drop)="onDrop($event)">
                  <input type="file" #fileInput accept="image/*" (change)="onFileSelected($event)" hidden>
                  @if (previewUrl()) {
                    <img [src]="previewUrl()" alt="Preview" class="preview-image">
                    <div class="image-overlay">
                      <mat-icon>edit</mat-icon>
                      <span>Change image</span>
                    </div>
                  } @else {
                    <mat-icon>cloud_upload</mat-icon>
                    <span>Click to upload image</span>
                    <span class="drag-hint">or drag & drop</span>
                  }
                </div>

                <!-- Description Input -->
                <mat-form-field appearance="outline" class="full-width">
                  <mat-label>What do you want to do here?</mat-label>
                  <textarea matInput [(ngModel)]="itemNote" rows="3" maxlength="500" placeholder="e.g., Visit the Eiffel Tower at sunset"></textarea>
                  <mat-hint align="end">{{ itemNote.length }}/500</mat-hint>
                </mat-form-field>
              </div>

              <div class="dialog-actions">
                @if (editingPhoto()) {
                  <button mat-button color="warn" (click)="deleteItem()" [disabled]="saving()">
                    <mat-icon>delete</mat-icon>
                    Delete
                  </button>
                }
                <span class="spacer"></span>
                <button mat-button (click)="closeItemDialog()" [disabled]="saving()">Cancel</button>
                <button mat-raised-button color="primary" (click)="saveItem()" [disabled]="saving() || (!editingPhoto() && !selectedFile())">
                  @if (saving()) {
                    <mat-spinner diameter="20"></mat-spinner>
                  } @else {
                    Save
                  }
                </button>
              </div>
            </div>
          </div>
        }

        <!-- Activity Dialog Overlay -->
        @if (activityDialogOpen()) {
          <div class="dialog-overlay" @backdropAnimation (click)="closeActivityDialog()">
            <div class="activity-dialog" @dialogAnimation (click)="$event.stopPropagation()">
              <div class="dialog-header">
                <h3>{{ editingActivity() ? 'Edit Activity' : 'Add Activity' }}</h3>
                <button mat-icon-button (click)="closeActivityDialog()">
                  <mat-icon>close</mat-icon>
                </button>
              </div>

              <div class="dialog-content">
                <mat-form-field appearance="outline" class="full-width">
                  <mat-label>Activity Name</mat-label>
                  <input matInput [(ngModel)]="activityName" placeholder="e.g., Visit the Louvre Museum" required>
                </mat-form-field>

                <mat-form-field appearance="outline" class="full-width">
                  <mat-label>Description (Optional)</mat-label>
                  <textarea matInput [(ngModel)]="activityDescription" rows="2" placeholder="Any notes or details..."></textarea>
                </mat-form-field>

                <mat-form-field appearance="outline" class="full-width">
                  <mat-label>Category</mat-label>
                  <mat-select [(ngModel)]="activityCategory">
                    @for (cat of categories; track cat.value) {
                      <mat-option [value]="cat.value">
                        <mat-icon>{{ cat.icon }}</mat-icon>
                        {{ cat.label }}
                      </mat-option>
                    }
                  </mat-select>
                </mat-form-field>

                <div class="cost-inputs">
                  <mat-form-field appearance="outline" class="cost-field">
                    <mat-label>Estimated Cost</mat-label>
                    <input matInput type="number" [(ngModel)]="activityCost" min="0" placeholder="0">
                    <span matPrefix>$&nbsp;</span>
                  </mat-form-field>
                </div>
              </div>

              <div class="dialog-actions">
                @if (editingActivity()) {
                  <button mat-button color="warn" (click)="deleteActivity()" [disabled]="savingActivity()">
                    <mat-icon>delete</mat-icon>
                    Delete
                  </button>
                }
                <span class="spacer"></span>
                <button mat-button (click)="closeActivityDialog()" [disabled]="savingActivity()">Cancel</button>
                <button mat-raised-button color="primary" (click)="saveActivity()" [disabled]="savingActivity() || !activityName.trim()">
                  @if (savingActivity()) {
                    <mat-spinner diameter="20"></mat-spinner>
                  } @else {
                    Save
                  }
                </button>
              </div>
            </div>
          </div>
        }
      }
    </div>
  `,
  styles: [`
    .detail-container {
      max-width: 1200px;
      margin: 0 auto;
    }

    .loading-container {
      display: flex;
      justify-content: center;
      padding: 48px;
    }

    /* Hero Section */
    .hero-section {
      margin-bottom: 0;
    }

    .hero-image {
      position: relative;
      height: 400px;
      background-size: cover;
      background-position: center;
      background-color: #667eea;
      border-radius: 0 0 24px 24px;
      overflow: hidden;
    }

    .hero-overlay {
      position: absolute;
      inset: 0;
      background: linear-gradient(to bottom, rgba(0,0,0,0.3) 0%, rgba(0,0,0,0.1) 40%, rgba(0,0,0,0.6) 100%);
    }

    .hero-content {
      position: relative;
      height: 100%;
      display: flex;
      flex-direction: column;
      justify-content: space-between;
      padding: 24px;
      z-index: 1;
    }

    .header-top {
      display: flex;
      justify-content: space-between;
      align-items: center;
    }

    .back-btn {
      background: rgba(255, 255, 255, 0.9);
      box-shadow: 0 2px 8px rgba(0, 0, 0, 0.2);
      transition: transform 0.2s;
    }

    .back-btn:hover {
      transform: scale(1.05);
    }

    .hero-text {
      color: white;
    }

    .city-name {
      font-size: 56px;
      font-weight: 700;
      margin: 0 0 8px;
      text-shadow: 0 2px 16px rgba(0, 0, 0, 0.3);
      line-height: 1.1;
    }

    .location-subtitle {
      display: flex;
      align-items: center;
      gap: 6px;
      font-size: 18px;
      margin: 0;
      opacity: 0.95;
    }

    .location-subtitle mat-icon {
      font-size: 20px;
      width: 20px;
      height: 20px;
    }

    mat-chip {
      cursor: pointer;
      background: rgba(255, 255, 255, 0.9) !important;
      color: #667eea !important;
      font-weight: 500;
      transition: transform 0.2s;
    }

    mat-chip:hover {
      transform: scale(1.05);
    }

    mat-chip.visited {
      background: #11998e !important;
      color: white !important;
    }

    mat-chip mat-icon {
      font-size: 16px;
      width: 16px;
      height: 16px;
      margin-right: 4px;
    }

    /* Tabs */
    .tabs-container {
      padding: 0 24px;
      margin-top: -20px;
      position: relative;
      z-index: 2;
    }

    .tab-buttons {
      display: flex;
      gap: 12px;
      background: white;
      padding: 8px;
      border-radius: 16px;
      box-shadow: 0 4px 20px rgba(0,0,0,0.1);
    }

    .tab-btn {
      flex: 1;
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 8px;
      padding: 14px 20px;
      border: none;
      background: transparent;
      border-radius: 12px;
      font-size: 15px;
      font-weight: 500;
      color: #666;
      cursor: pointer;
      transition: all 0.2s;
    }

    .tab-btn:hover {
      background: #f8f9ff;
    }

    .tab-btn.active {
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      color: white;
    }

    .tab-btn mat-icon {
      font-size: 20px;
      width: 20px;
      height: 20px;
    }

    .tab-count {
      background: rgba(0,0,0,0.1);
      padding: 2px 8px;
      border-radius: 10px;
      font-size: 12px;
    }

    .tab-btn.active .tab-count {
      background: rgba(255,255,255,0.2);
    }

    /* Bucket List Section */
    .bucket-list-section,
    .itinerary-section,
    .suggestions-section {
      padding: 32px 24px 24px;
    }

    .section-subtitle {
      color: #888;
      font-size: 14px;
      margin: 4px 0 0;
    }

    /* Suggestions Section */
    .suggestions-loading {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      padding: 48px;
      gap: 16px;
      color: #888;
    }

    .suggestions-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
      gap: 20px;
    }

    .suggestion-card {
      background: white;
      border-radius: 16px;
      overflow: hidden;
      box-shadow: 0 2px 12px rgba(0, 0, 0, 0.08);
      transition: all 0.3s ease;
    }

    .suggestion-card:hover {
      transform: translateY(-4px);
      box-shadow: 0 8px 24px rgba(0, 0, 0, 0.12);
    }

    .suggestion-card.in-itinerary {
      opacity: 0.7;
      border: 2px solid #11998e;
    }

    .suggestion-image {
      height: 160px;
      background-size: cover;
      background-position: center;
      background-color: #f0f4ff;
    }

    .suggestion-image-placeholder {
      display: flex;
      align-items: center;
      justify-content: center;
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    }

    .suggestion-image-placeholder mat-icon {
      font-size: 48px;
      width: 48px;
      height: 48px;
      color: rgba(255, 255, 255, 0.8);
    }

    .suggestion-content {
      padding: 16px;
    }

    .suggestion-header {
      display: flex;
      justify-content: space-between;
      align-items: flex-start;
      gap: 12px;
      margin-bottom: 8px;
    }

    .suggestion-header h4 {
      margin: 0;
      font-size: 16px;
      font-weight: 600;
      color: #1a1a2e;
      flex: 1;
    }

    .suggestion-category {
      display: flex;
      align-items: center;
      gap: 4px;
      padding: 4px 10px;
      border-radius: 12px;
      font-size: 11px;
      font-weight: 500;
      background: #f0f4ff;
      color: #667eea;
      white-space: nowrap;
    }

    .suggestion-category[data-category="food"] {
      background: #fff3e0;
      color: #e65100;
    }

    .suggestion-category[data-category="adventure"] {
      background: #e8f5e9;
      color: #2e7d32;
    }

    .suggestion-category[data-category="culture"] {
      background: #fce4ec;
      color: #c2185b;
    }

    .suggestion-category[data-category="shopping"] {
      background: #e3f2fd;
      color: #1565c0;
    }

    .suggestion-category[data-category="nightlife"] {
      background: #ede7f6;
      color: #7b1fa2;
    }

    .suggestion-category[data-category="nature"] {
      background: #e8f5e9;
      color: #388e3c;
    }

    .suggestion-category mat-icon {
      font-size: 12px;
      width: 12px;
      height: 12px;
    }

    .suggestion-description {
      margin: 0 0 12px;
      font-size: 14px;
      color: #666;
      line-height: 1.5;
      display: -webkit-box;
      -webkit-line-clamp: 2;
      -webkit-box-orient: vertical;
      overflow: hidden;
    }

    .suggestion-meta {
      display: flex;
      gap: 16px;
      margin-bottom: 12px;
    }

    .meta-item {
      display: flex;
      align-items: center;
      gap: 4px;
      font-size: 13px;
      color: #888;
    }

    .meta-item.cost {
      font-weight: 600;
      color: #11998e;
    }

    .meta-item mat-icon {
      font-size: 16px;
      width: 16px;
      height: 16px;
    }

    .suggestion-actions {
      display: flex;
      justify-content: flex-end;
    }

    .suggestion-actions button {
      display: flex;
      align-items: center;
      gap: 4px;
    }

    .added-btn {
      color: #11998e !important;
    }

    .added-btn mat-icon {
      font-size: 18px;
      width: 18px;
      height: 18px;
    }

    .section-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 24px;
    }

    .section-header h2 {
      font-size: 24px;
      font-weight: 600;
      color: #333;
      margin: 0;
    }

    .add-item-btn {
      display: flex;
      align-items: center;
      gap: 8px;
      transition: transform 0.2s, box-shadow 0.2s;
    }

    .add-item-btn:hover {
      transform: translateY(-2px);
      box-shadow: 0 6px 20px rgba(102, 126, 234, 0.3);
    }

    /* Category Filters */
    .category-filters {
      display: flex;
      gap: 8px;
      flex-wrap: wrap;
      margin-bottom: 24px;
    }

    .filter-chip {
      display: flex;
      align-items: center;
      gap: 6px;
      padding: 8px 16px;
      border: 2px solid #e0e0e0;
      background: white;
      border-radius: 20px;
      font-size: 13px;
      font-weight: 500;
      color: #666;
      cursor: pointer;
      transition: all 0.2s;
    }

    .filter-chip:hover {
      border-color: #667eea;
      color: #667eea;
    }

    .filter-chip.active {
      background: #667eea;
      border-color: #667eea;
      color: white;
    }

    .filter-chip mat-icon {
      font-size: 16px;
      width: 16px;
      height: 16px;
    }

    /* Activities List */
    .activities-list {
      display: flex;
      flex-direction: column;
      gap: 12px;
    }

    .activity-item {
      display: flex;
      align-items: flex-start;
      gap: 12px;
      padding: 16px;
      background: white;
      border-radius: 16px;
      box-shadow: 0 2px 8px rgba(0,0,0,0.06);
      transition: all 0.2s;
    }

    .activity-item:hover {
      box-shadow: 0 4px 16px rgba(0,0,0,0.1);
      transform: translateX(4px);
    }

    .activity-item.completed {
      opacity: 0.7;
    }

    .activity-item.completed .activity-content h4 {
      text-decoration: line-through;
      color: #888;
    }

    .check-btn {
      flex-shrink: 0;
      margin-top: 2px;
    }

    .check-btn mat-icon {
      color: #ccc;
      transition: color 0.2s;
    }

    .activity-item.completed .check-btn mat-icon {
      color: #11998e;
    }

    .check-btn:hover mat-icon {
      color: #667eea;
    }

    .activity-content {
      flex: 1;
      cursor: pointer;
    }

    .activity-header {
      display: flex;
      align-items: center;
      gap: 12px;
      flex-wrap: wrap;
      margin-bottom: 4px;
    }

    .activity-header h4 {
      margin: 0;
      font-size: 16px;
      font-weight: 600;
      color: #1a1a2e;
    }

    .activity-category {
      display: flex;
      align-items: center;
      gap: 4px;
      padding: 4px 10px;
      border-radius: 12px;
      font-size: 11px;
      font-weight: 500;
      background: #f0f4ff;
      color: #667eea;
    }

    .activity-category[data-category="food"] {
      background: #fff3e0;
      color: #e65100;
    }

    .activity-category[data-category="adventure"] {
      background: #e8f5e9;
      color: #2e7d32;
    }

    .activity-category[data-category="culture"] {
      background: #fce4ec;
      color: #c2185b;
    }

    .activity-category[data-category="shopping"] {
      background: #e3f2fd;
      color: #1565c0;
    }

    .activity-category[data-category="nightlife"] {
      background: #ede7f6;
      color: #7b1fa2;
    }

    .activity-category[data-category="relaxation"] {
      background: #e0f7fa;
      color: #00838f;
    }

    .activity-category mat-icon {
      font-size: 12px;
      width: 12px;
      height: 12px;
    }

    .activity-description {
      margin: 4px 0 8px;
      font-size: 14px;
      color: #666;
      line-height: 1.4;
    }

    .activity-cost {
      display: flex;
      align-items: center;
      gap: 4px;
      font-size: 14px;
      font-weight: 600;
      color: #11998e;
    }

    .activity-cost mat-icon {
      font-size: 16px;
      width: 16px;
      height: 16px;
    }

    .activity-item .edit-btn {
      opacity: 0;
      transition: opacity 0.2s;
    }

    .activity-item:hover .edit-btn {
      opacity: 1;
    }

    /* Cost Summary */
    .cost-summary {
      margin-top: 24px;
      padding: 20px;
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      border-radius: 16px;
      color: white;
    }

    .cost-row {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 8px 0;
    }

    .cost-row:not(:last-child) {
      border-bottom: 1px solid rgba(255,255,255,0.2);
    }

    .cost-row span {
      font-size: 14px;
    }

    .cost-value {
      font-size: 18px;
      font-weight: 700;
    }

    .completed-row {
      opacity: 0.7;
    }

    .remaining-row .cost-value {
      font-size: 24px;
    }

    /* Postcards Grid */
    .postcards-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
      gap: 24px;
    }

    .postcard {
      background: white;
      border-radius: 12px;
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
      overflow: hidden;
      cursor: pointer;
      transition: transform 0.2s, box-shadow 0.2s;
    }

    .postcard:hover {
      transform: translateY(-4px);
      box-shadow: 0 8px 24px rgba(0, 0, 0, 0.15);
    }

    .postcard-image {
      aspect-ratio: 4/3;
      overflow: hidden;
    }

    .postcard-image img {
      width: 100%;
      height: 100%;
      object-fit: cover;
      transition: transform 0.3s;
    }

    .postcard:hover .postcard-image img {
      transform: scale(1.05);
    }

    .postcard-content {
      padding: 16px;
    }

    .postcard-note {
      color: #333;
      font-size: 14px;
      line-height: 1.5;
      margin: 0 0 12px;
      display: -webkit-box;
      -webkit-line-clamp: 3;
      -webkit-box-orient: vertical;
      overflow: hidden;
    }

    .postcard-footer {
      display: flex;
      justify-content: space-between;
      align-items: center;
    }

    .postcard-date {
      color: #888;
      font-size: 13px;
    }

    .postcard .edit-btn {
      opacity: 0;
      transition: opacity 0.2s;
    }

    .postcard:hover .edit-btn {
      opacity: 1;
    }

    .edit-btn mat-icon {
      font-size: 18px;
      width: 18px;
      height: 18px;
    }

    /* Empty State */
    .empty-state {
      text-align: center;
      padding: 64px 24px;
      background: white;
      border-radius: 16px;
      box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
    }

    .empty-state mat-icon {
      font-size: 80px;
      width: 80px;
      height: 80px;
      color: #ddd;
      margin-bottom: 16px;
    }

    .empty-state h3 {
      font-size: 24px;
      color: #333;
      margin: 0 0 8px;
    }

    .empty-state p {
      color: #888;
      margin: 0 0 24px;
    }

    /* Dialogs */
    .dialog-overlay {
      position: fixed;
      inset: 0;
      background: rgba(0, 0, 0, 0.5);
      display: flex;
      align-items: center;
      justify-content: center;
      z-index: 1000;
      padding: 24px;
    }

    .item-dialog,
    .activity-dialog {
      background: white;
      border-radius: 16px;
      width: 100%;
      max-width: 480px;
      max-height: 90vh;
      overflow-y: auto;
      box-shadow: 0 24px 48px rgba(0, 0, 0, 0.2);
    }

    .dialog-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 20px 24px;
      border-bottom: 1px solid #eee;
    }

    .dialog-header h3 {
      margin: 0;
      font-size: 20px;
      color: #333;
    }

    .dialog-content {
      padding: 24px;
    }

    .upload-area {
      border: 2px dashed #ddd;
      border-radius: 12px;
      padding: 40px;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      gap: 8px;
      cursor: pointer;
      transition: all 0.2s;
      margin-bottom: 20px;
      position: relative;
      overflow: hidden;
      min-height: 200px;
    }

    .upload-area:hover {
      border-color: #667eea;
      background: #f8f9ff;
    }

    .upload-area.dragging {
      border-color: #667eea;
      background: #f0f4ff;
    }

    .upload-area.has-image {
      padding: 0;
      border-style: solid;
      border-color: #667eea;
    }

    .upload-area mat-icon {
      font-size: 48px;
      width: 48px;
      height: 48px;
      color: #aaa;
    }

    .upload-area span {
      color: #666;
      font-size: 14px;
    }

    .drag-hint {
      color: #999 !important;
      font-size: 12px !important;
    }

    .preview-image {
      width: 100%;
      height: 100%;
      object-fit: cover;
      min-height: 200px;
    }

    .image-overlay {
      position: absolute;
      inset: 0;
      background: rgba(0, 0, 0, 0.4);
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      gap: 8px;
      opacity: 0;
      transition: opacity 0.2s;
    }

    .upload-area.has-image:hover .image-overlay {
      opacity: 1;
    }

    .image-overlay mat-icon {
      color: white;
    }

    .image-overlay span {
      color: white;
    }

    .full-width {
      width: 100%;
    }

    .cost-inputs {
      display: flex;
      gap: 16px;
    }

    .cost-field {
      flex: 1;
    }

    .dialog-actions {
      display: flex;
      align-items: center;
      padding: 16px 24px;
      border-top: 1px solid #eee;
      gap: 8px;
    }

    .spacer {
      flex: 1;
    }

    /* Responsive Design */
    @media (max-width: 1024px) and (min-width: 769px) {
      .hero-image {
        height: 350px;
      }

      .city-name {
        font-size: 42px;
      }

      .postcards-grid {
        grid-template-columns: repeat(2, 1fr);
        gap: 20px;
      }
    }

    @media (max-width: 768px) {
      .hero-image {
        height: 300px;
        border-radius: 0;
      }

      .hero-content {
        padding: 16px;
      }

      .city-name {
        font-size: 32px;
      }

      .location-subtitle {
        font-size: 15px;
      }

      .tabs-container {
        padding: 0 16px;
        margin-top: -16px;
      }

      .tab-buttons {
        padding: 6px;
        gap: 8px;
      }

      .tab-btn {
        padding: 10px 12px;
        font-size: 12px;
        gap: 4px;
      }

      .tab-btn mat-icon {
        font-size: 18px;
        width: 18px;
        height: 18px;
      }

      .tab-count {
        display: none;
      }

      .bucket-list-section,
      .itinerary-section,
      .suggestions-section {
        padding: 24px 16px 16px;
      }

      .suggestions-grid {
        grid-template-columns: 1fr;
      }

      .suggestion-image {
        height: 140px;
      }

      .section-header {
        flex-direction: column;
        align-items: flex-start;
        gap: 16px;
      }

      .add-item-btn {
        width: 100%;
        justify-content: center;
      }

      .category-filters {
        padding-bottom: 8px;
        overflow-x: auto;
        flex-wrap: nowrap;
        -webkit-overflow-scrolling: touch;
      }

      .filter-chip {
        flex-shrink: 0;
      }

      .postcards-grid {
        grid-template-columns: 1fr;
        gap: 16px;
      }

      .activity-item .edit-btn {
        opacity: 1;
      }

      .postcard .edit-btn {
        opacity: 1;
      }

      .empty-state {
        padding: 48px 20px;
      }

      .empty-state mat-icon {
        font-size: 64px;
        width: 64px;
        height: 64px;
      }

      .dialog-overlay {
        padding: 16px;
        align-items: flex-end;
      }

      .item-dialog,
      .activity-dialog {
        border-radius: 16px 16px 0 0;
        max-height: 85vh;
      }
    }

    @media (max-width: 480px) {
      .hero-image {
        height: 260px;
      }

      .hero-content {
        padding: 12px;
      }

      .city-name {
        font-size: 28px;
      }

      .location-subtitle {
        font-size: 14px;
      }

      .tabs-container {
        padding: 0 12px;
      }

      .tab-btn {
        padding: 8px 10px;
        font-size: 11px;
        gap: 4px;
      }

      .tab-btn mat-icon {
        font-size: 16px;
        width: 16px;
        height: 16px;
      }

      .bucket-list-section,
      .itinerary-section,
      .suggestions-section {
        padding: 20px 12px 12px;
      }

      .suggestion-header {
        flex-direction: column;
        align-items: flex-start;
      }

      .suggestion-meta {
        flex-wrap: wrap;
        gap: 8px;
      }

      .section-header h2 {
        font-size: 20px;
      }

      .upload-area {
        padding: 32px 20px;
        min-height: 180px;
      }

      .dialog-content {
        padding: 20px 16px;
      }

      .dialog-actions {
        padding: 14px 16px;
      }
    }
  `]
})
export class DestinationDetailComponent implements OnInit {
  loading = signal(true);
  destination = signal<Destination | null>(null);
  activeTab = signal<'bucket' | 'itinerary' | 'suggestions'>('bucket');

  // Suggested Activities state
  suggestedActivities = signal<CityActivity[]>([]);
  loadingSuggestions = signal(false);
  selectedSuggestionCategory = signal<string | null>(null);
  selectedCategory = signal<string | null>(null);

  // Photo Dialog state
  dialogOpen = signal(false);
  editingPhoto = signal<Photo | null>(null);
  selectedFile = signal<File | null>(null);
  previewUrl = signal<string | null>(null);
  itemNote = '';
  saving = signal(false);
  isDragging = signal(false);

  // Activity Dialog state
  activityDialogOpen = signal(false);
  editingActivity = signal<Activity | null>(null);
  activityName = '';
  activityDescription = '';
  activityCategory = 'sightseeing';
  activityCost: number | null = null;
  savingActivity = signal(false);

  categories = ACTIVITY_CATEGORIES;

  // Computed values
  filteredActivities = computed(() => {
    const activities = this.destination()?.activities || [];
    const category = this.selectedCategory();
    if (!category) return activities;
    return activities.filter(a => a.category === category);
  });

  totalEstimatedCost = computed(() => {
    const activities = this.destination()?.activities || [];
    return activities.reduce((sum, a) => sum + (a.estimatedCost || 0), 0);
  });

  completedCost = computed(() => {
    const activities = this.destination()?.activities || [];
    return activities
      .filter(a => a.completed)
      .reduce((sum, a) => sum + (a.estimatedCost || 0), 0);
  });

  filteredSuggestions = computed(() => {
    const suggestions = this.suggestedActivities();
    const category = this.selectedSuggestionCategory();
    if (!category) return suggestions;
    return suggestions.filter(s => s.category === category);
  });

  getUniqueSuggestionCategories = computed(() => {
    const suggestions = this.suggestedActivities();
    const categories = new Set(suggestions.map(s => s.category).filter(Boolean));
    return Array.from(categories) as string[];
  });

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private destinationsService: DestinationsService,
    private locationsService: LocationsService,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.loadDestination(id);
    }
  }

  loadDestination(id: string): void {
    this.destinationsService.getDestination(id).subscribe({
      next: (destination) => {
        this.destination.set(destination);
        this.loading.set(false);
        // Load suggested activities for this city
        if (destination.city?.id) {
          this.loadSuggestedActivities(destination.city.id);
        }
      },
      error: () => {
        this.snackBar.open('Failed to load destination', 'Close', { duration: 3000 });
        this.router.navigate(['/destinations']);
      }
    });
  }

  loadSuggestedActivities(cityId: number): void {
    this.loadingSuggestions.set(true);
    this.locationsService.getCityActivities(cityId).subscribe({
      next: (activities) => {
        this.suggestedActivities.set(activities);
        this.loadingSuggestions.set(false);
      },
      error: () => {
        this.loadingSuggestions.set(false);
      }
    });
  }

  setActiveTab(tab: 'bucket' | 'itinerary' | 'suggestions'): void {
    this.activeTab.set(tab);
  }

  setSelectedSuggestionCategory(category: string | null): void {
    this.selectedSuggestionCategory.set(category);
  }

  addSuggestionToItinerary(suggestion: CityActivity): void {
    const dest = this.destination();
    if (!dest) return;

    const data: CreateActivityRequest = {
      destinationId: dest.id,
      name: suggestion.name,
      description: suggestion.description || undefined,
      category: suggestion.category,
      estimatedCost: suggestion.estimatedCost || undefined,
      currency: suggestion.currency || '$'
    };

    this.destinationsService.createActivity(data).subscribe({
      next: (activity) => {
        const activities = [...(dest.activities || []), activity];
        this.destination.set({ ...dest, activities });
        this.snackBar.open(`Added "${suggestion.name}" to your itinerary!`, 'Close', { duration: 3000 });
      },
      error: () => {
        this.snackBar.open('Failed to add activity', 'Close', { duration: 3000 });
      }
    });
  }

  isActivityInItinerary(suggestion: CityActivity): boolean {
    const activities = this.destination()?.activities || [];
    return activities.some(a => a.name.toLowerCase() === suggestion.name.toLowerCase());
  }

  setSelectedCategory(category: string | null): void {
    this.selectedCategory.set(category);
  }

  getUniqueCategories(): string[] {
    const activities = this.destination()?.activities || [];
    const categories = new Set(activities.map(a => a.category).filter(Boolean));
    return Array.from(categories) as string[];
  }

  getCategoryIcon(category: string): string {
    const cat = ACTIVITY_CATEGORIES.find(c => c.value === category);
    return cat?.icon || 'category';
  }

  getCategoryLabel(category: string): string {
    const cat = ACTIVITY_CATEGORIES.find(c => c.value === category);
    return cat?.label || category;
  }

  getCityImageUrl(): string {
    const dest = this.destination();
    if (!dest?.city) return 'https://images.unsplash.com/photo-1488646953014-85cb44e25828?w=1200';

    if (dest.city.imageUrl) {
      return dest.city.imageUrl;
    }

    return 'https://images.unsplash.com/photo-1488646953014-85cb44e25828?w=1200';
  }

  toggleVisited(): void {
    const dest = this.destination();
    if (!dest) return;

    this.destinationsService.updateDestination(dest.id, { visited: !dest.visited }).subscribe({
      next: (updated) => {
        this.destination.set({ ...dest, ...updated });
        this.snackBar.open(
          updated.visited ? 'Marked as visited!' : 'Moved to wishlist!',
          'Close',
          { duration: 3000 }
        );
      }
    });
  }

  getPhotoUrl(photo: Photo): string {
    if (photo.url.startsWith('http')) {
      return photo.url;
    }
    return `${environment.apiUrl.replace('/api', '')}${photo.url}`;
  }

  // Photo Dialog methods
  openItemDialog(photo?: Photo): void {
    if (photo) {
      this.editingPhoto.set(photo);
      this.itemNote = photo.caption || '';
      this.previewUrl.set(this.getPhotoUrl(photo));
    } else {
      this.editingPhoto.set(null);
      this.itemNote = '';
      this.previewUrl.set(null);
      this.selectedFile.set(null);
    }
    this.dialogOpen.set(true);
  }

  closeItemDialog(): void {
    this.dialogOpen.set(false);
    this.editingPhoto.set(null);
    this.selectedFile.set(null);
    this.previewUrl.set(null);
    this.itemNote = '';
  }

  onDragOver(event: DragEvent): void {
    event.preventDefault();
    event.stopPropagation();
    this.isDragging.set(true);
  }

  onDragLeave(event: DragEvent): void {
    event.preventDefault();
    event.stopPropagation();
    this.isDragging.set(false);
  }

  onDrop(event: DragEvent): void {
    event.preventDefault();
    event.stopPropagation();
    this.isDragging.set(false);

    const files = event.dataTransfer?.files;
    if (files && files.length > 0) {
      const file = files[0];
      if (file.type.startsWith('image/')) {
        this.handleFileSelection(file);
      }
    }
  }

  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (!input.files?.length) return;
    this.handleFileSelection(input.files[0]);
    input.value = '';
  }

  private handleFileSelection(file: File): void {
    this.selectedFile.set(file);
    const reader = new FileReader();
    reader.onload = () => {
      this.previewUrl.set(reader.result as string);
    };
    reader.readAsDataURL(file);
  }

  saveItem(): void {
    const dest = this.destination();
    if (!dest) return;

    const editing = this.editingPhoto();
    const file = this.selectedFile();

    this.saving.set(true);

    if (editing) {
      if (file) {
        this.destinationsService.uploadPhoto(dest.id, file, this.itemNote).subscribe({
          next: (photo) => {
            this.destinationsService.deletePhoto(editing.id).subscribe({
              next: () => {
                const photos = dest.photos?.filter(p => p.id !== editing.id) || [];
                photos.push(photo);
                this.destination.set({ ...dest, photos });
                this.saving.set(false);
                this.closeItemDialog();
                this.snackBar.open('Item updated!', 'Close', { duration: 3000 });
              },
              error: () => {
                const photos = [...(dest.photos || []), photo];
                this.destination.set({ ...dest, photos });
                this.saving.set(false);
                this.closeItemDialog();
                this.snackBar.open('Item updated!', 'Close', { duration: 3000 });
              }
            });
          },
          error: () => {
            this.saving.set(false);
            this.snackBar.open('Failed to update item', 'Close', { duration: 3000 });
          }
        });
      } else {
        this.destinationsService.updatePhotoCaption(editing.id, this.itemNote).subscribe({
          next: (updated) => {
            const photos = dest.photos?.map(p => p.id === editing.id ? updated : p) || [];
            this.destination.set({ ...dest, photos });
            this.saving.set(false);
            this.closeItemDialog();
            this.snackBar.open('Item updated!', 'Close', { duration: 3000 });
          },
          error: () => {
            this.saving.set(false);
            this.snackBar.open('Failed to update item', 'Close', { duration: 3000 });
          }
        });
      }
    } else {
      if (!file) {
        this.saving.set(false);
        return;
      }

      this.destinationsService.uploadPhoto(dest.id, file, this.itemNote).subscribe({
        next: (photo) => {
          const photos = [...(dest.photos || []), photo];
          this.destination.set({ ...dest, photos });
          this.saving.set(false);
          this.closeItemDialog();
          this.snackBar.open('Added to bucket list!', 'Close', { duration: 3000 });
        },
        error: () => {
          this.saving.set(false);
          this.snackBar.open('Failed to add item', 'Close', { duration: 3000 });
        }
      });
    }
  }

  deleteItem(): void {
    const editing = this.editingPhoto();
    const dest = this.destination();
    if (!editing || !dest) return;

    if (!confirm('Delete this item?')) return;

    this.saving.set(true);
    this.destinationsService.deletePhoto(editing.id).subscribe({
      next: () => {
        const photos = dest.photos?.filter(p => p.id !== editing.id) || [];
        this.destination.set({ ...dest, photos });
        this.saving.set(false);
        this.closeItemDialog();
        this.snackBar.open('Item deleted', 'Close', { duration: 3000 });
      },
      error: () => {
        this.saving.set(false);
        this.snackBar.open('Failed to delete item', 'Close', { duration: 3000 });
      }
    });
  }

  // Activity Dialog methods
  openActivityDialog(activity?: Activity): void {
    if (activity) {
      this.editingActivity.set(activity);
      this.activityName = activity.name;
      this.activityDescription = activity.description || '';
      this.activityCategory = activity.category || 'sightseeing';
      this.activityCost = activity.estimatedCost || null;
    } else {
      this.editingActivity.set(null);
      this.activityName = '';
      this.activityDescription = '';
      this.activityCategory = 'sightseeing';
      this.activityCost = null;
    }
    this.activityDialogOpen.set(true);
  }

  closeActivityDialog(): void {
    this.activityDialogOpen.set(false);
    this.editingActivity.set(null);
    this.activityName = '';
    this.activityDescription = '';
    this.activityCategory = 'sightseeing';
    this.activityCost = null;
  }

  toggleActivityCompleted(activity: Activity): void {
    const dest = this.destination();
    if (!dest) return;

    this.destinationsService.toggleActivityCompleted(activity.id).subscribe({
      next: (updated) => {
        const activities = dest.activities?.map(a => a.id === activity.id ? updated : a) || [];
        this.destination.set({ ...dest, activities });
      },
      error: () => {
        this.snackBar.open('Failed to update activity', 'Close', { duration: 3000 });
      }
    });
  }

  saveActivity(): void {
    const dest = this.destination();
    if (!dest || !this.activityName.trim()) return;

    const editing = this.editingActivity();
    this.savingActivity.set(true);

    if (editing) {
      this.destinationsService.updateActivity(editing.id, {
        name: this.activityName.trim(),
        description: this.activityDescription.trim() || undefined,
        category: this.activityCategory,
        estimatedCost: this.activityCost || undefined,
        currency: '$'
      }).subscribe({
        next: (updated) => {
          const activities = dest.activities?.map(a => a.id === editing.id ? updated : a) || [];
          this.destination.set({ ...dest, activities });
          this.savingActivity.set(false);
          this.closeActivityDialog();
          this.snackBar.open('Activity updated!', 'Close', { duration: 3000 });
        },
        error: () => {
          this.savingActivity.set(false);
          this.snackBar.open('Failed to update activity', 'Close', { duration: 3000 });
        }
      });
    } else {
      const data: CreateActivityRequest = {
        destinationId: dest.id,
        name: this.activityName.trim(),
        description: this.activityDescription.trim() || undefined,
        category: this.activityCategory,
        estimatedCost: this.activityCost || undefined,
        currency: '$'
      };

      this.destinationsService.createActivity(data).subscribe({
        next: (activity) => {
          const activities = [...(dest.activities || []), activity];
          this.destination.set({ ...dest, activities });
          this.savingActivity.set(false);
          this.closeActivityDialog();
          this.snackBar.open('Activity added!', 'Close', { duration: 3000 });
        },
        error: () => {
          this.savingActivity.set(false);
          this.snackBar.open('Failed to add activity', 'Close', { duration: 3000 });
        }
      });
    }
  }

  deleteActivity(): void {
    const editing = this.editingActivity();
    const dest = this.destination();
    if (!editing || !dest) return;

    if (!confirm('Delete this activity?')) return;

    this.savingActivity.set(true);
    this.destinationsService.deleteActivity(editing.id).subscribe({
      next: () => {
        const activities = dest.activities?.filter(a => a.id !== editing.id) || [];
        this.destination.set({ ...dest, activities });
        this.savingActivity.set(false);
        this.closeActivityDialog();
        this.snackBar.open('Activity deleted', 'Close', { duration: 3000 });
      },
      error: () => {
        this.savingActivity.set(false);
        this.snackBar.open('Failed to delete activity', 'Close', { duration: 3000 });
      }
    });
  }
}
