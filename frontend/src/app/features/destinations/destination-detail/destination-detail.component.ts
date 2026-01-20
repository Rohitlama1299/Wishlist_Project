import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatChipsModule } from '@angular/material/chips';
import { MatTabsModule } from '@angular/material/tabs';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatDialogModule, MatDialog } from '@angular/material/dialog';
import { DestinationsService } from '../../../core/services/destinations.service';
import { Destination, Photo, Activity } from '../../../models';
import { environment } from '../../../../environments/environment';

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
    MatTabsModule,
    MatCheckboxModule,
    MatSnackBarModule,
    MatDialogModule
  ],
  template: `
    <div class="detail-container">
      @if (loading()) {
        <div class="loading-container">
          <mat-spinner></mat-spinner>
        </div>
      } @else if (destination()) {
        <header class="detail-header">
          <button mat-icon-button routerLink="/destinations">
            <mat-icon>arrow_back</mat-icon>
          </button>
          <div class="header-info">
            <h1>{{ destination()!.city?.name }}</h1>
            <p class="location">
              <mat-icon>location_on</mat-icon>
              {{ destination()!.city?.country?.name }}, {{ destination()!.city?.country?.continent?.name }}
            </p>
          </div>
          <mat-chip [class.visited]="destination()!.visited" (click)="toggleVisited()">
            {{ destination()!.visited ? 'Visited' : 'On Wishlist' }}
          </mat-chip>
        </header>

        <div class="detail-content">
          <mat-card class="notes-card">
            <mat-card-header>
              <mat-card-title>Notes</mat-card-title>
            </mat-card-header>
            <mat-card-content>
              @if (editingNotes()) {
                <mat-form-field appearance="outline" class="full-width">
                  <textarea matInput [(ngModel)]="notesText" rows="4" placeholder="Add notes about this destination..."></textarea>
                </mat-form-field>
                <div class="notes-actions">
                  <button mat-button (click)="cancelNotesEdit()">Cancel</button>
                  <button mat-raised-button color="primary" (click)="saveNotes()">Save</button>
                </div>
              } @else {
                <p class="notes-text" (click)="startNotesEdit()">
                  {{ destination()!.notes || 'Click to add notes about this destination...' }}
                </p>
              }
            </mat-card-content>
          </mat-card>

          <mat-tab-group>
            <mat-tab label="Photos ({{ destination()!.photos?.length || 0 }})">
              <div class="tab-content">
                <div class="upload-section">
                  <input type="file" #fileInput accept="image/*" (change)="onFileSelected($event)" hidden>
                  <button mat-raised-button color="primary" (click)="fileInput.click()" [disabled]="uploading()">
                    @if (uploading()) {
                      <mat-spinner diameter="20"></mat-spinner>
                    } @else {
                      <mat-icon>add_photo_alternate</mat-icon>
                      Upload Photo
                    }
                  </button>
                </div>

                @if (destination()!.photos && destination()!.photos!.length > 0) {
                  <div class="photos-grid">
                    @for (photo of destination()!.photos; track photo.id) {
                      <div class="photo-item">
                        <img [src]="getPhotoUrl(photo)" [alt]="photo.caption || 'Photo'">
                        <div class="photo-overlay">
                          @if (photo.caption) {
                            <span class="caption">{{ photo.caption }}</span>
                          }
                          <button mat-icon-button (click)="deletePhoto(photo)">
                            <mat-icon>delete</mat-icon>
                          </button>
                        </div>
                      </div>
                    }
                  </div>
                } @else {
                  <div class="empty-photos">
                    <mat-icon>photo_library</mat-icon>
                    <p>No photos yet. Upload your first photo!</p>
                  </div>
                }
              </div>
            </mat-tab>

            <mat-tab label="Activities ({{ destination()!.activities?.length || 0 }})">
              <div class="tab-content">
                <div class="add-activity">
                  <mat-form-field appearance="outline" class="activity-input">
                    <mat-label>Add an activity</mat-label>
                    <input matInput [(ngModel)]="newActivityName" (keyup.enter)="addActivity()" placeholder="e.g., Visit the Eiffel Tower">
                  </mat-form-field>
                  <button mat-raised-button color="primary" (click)="addActivity()" [disabled]="!newActivityName || addingActivity()">
                    @if (addingActivity()) {
                      <mat-spinner diameter="20"></mat-spinner>
                    } @else {
                      <mat-icon>add</mat-icon>
                      Add
                    }
                  </button>
                </div>

                @if (destination()!.activities && destination()!.activities!.length > 0) {
                  <div class="activities-list">
                    @for (activity of destination()!.activities; track activity.id) {
                      <div class="activity-item" [class.completed]="activity.completed">
                        <mat-checkbox [checked]="activity.completed" (change)="toggleActivity(activity)">
                          <span class="activity-name">{{ activity.name }}</span>
                        </mat-checkbox>
                        @if (activity.description) {
                          <p class="activity-description">{{ activity.description }}</p>
                        }
                        <button mat-icon-button class="delete-activity" (click)="deleteActivity(activity)">
                          <mat-icon>delete</mat-icon>
                        </button>
                      </div>
                    }
                  </div>
                } @else {
                  <div class="empty-activities">
                    <mat-icon>checklist</mat-icon>
                    <p>No activities planned yet. Add things you want to do!</p>
                  </div>
                }
              </div>
            </mat-tab>
          </mat-tab-group>
        </div>
      }
    </div>
  `,
  styles: [`
    .detail-container {
      padding: 24px;
      max-width: 1000px;
      margin: 0 auto;
    }

    .loading-container {
      display: flex;
      justify-content: center;
      padding: 48px;
    }

    .detail-header {
      display: flex;
      align-items: center;
      gap: 16px;
      margin-bottom: 24px;
    }

    .header-info {
      flex: 1;
    }

    .header-info h1 {
      margin: 0;
      font-size: 28px;
      color: #1a1a2e;
    }

    .location {
      display: flex;
      align-items: center;
      gap: 4px;
      color: #666;
      margin: 8px 0 0;
    }

    .location mat-icon {
      font-size: 18px;
      width: 18px;
      height: 18px;
    }

    mat-chip {
      cursor: pointer;
      background: #667eea !important;
      color: white !important;
    }

    mat-chip.visited {
      background: #11998e !important;
    }

    .notes-card {
      margin-bottom: 24px;
    }

    .notes-text {
      color: #666;
      cursor: pointer;
      padding: 12px;
      border-radius: 8px;
      background: #f5f5f5;
      margin: 0;
      min-height: 60px;
    }

    .notes-text:hover {
      background: #eeeeee;
    }

    .notes-actions {
      display: flex;
      justify-content: flex-end;
      gap: 8px;
      margin-top: 8px;
    }

    .full-width {
      width: 100%;
    }

    .tab-content {
      padding: 24px 0;
    }

    .upload-section {
      margin-bottom: 24px;
    }

    .photos-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
      gap: 16px;
    }

    .photo-item {
      position: relative;
      border-radius: 8px;
      overflow: hidden;
      aspect-ratio: 1;
    }

    .photo-item img {
      width: 100%;
      height: 100%;
      object-fit: cover;
    }

    .photo-overlay {
      position: absolute;
      inset: 0;
      background: linear-gradient(to top, rgba(0,0,0,0.7), transparent);
      display: flex;
      align-items: flex-end;
      justify-content: space-between;
      padding: 12px;
      opacity: 0;
      transition: opacity 0.2s;
    }

    .photo-item:hover .photo-overlay {
      opacity: 1;
    }

    .caption {
      color: white;
      font-size: 14px;
    }

    .photo-overlay mat-icon {
      color: white;
    }

    .empty-photos, .empty-activities {
      text-align: center;
      padding: 48px;
      color: #666;
    }

    .empty-photos mat-icon, .empty-activities mat-icon {
      font-size: 64px;
      width: 64px;
      height: 64px;
      color: #ccc;
    }

    .add-activity {
      display: flex;
      gap: 16px;
      margin-bottom: 24px;
    }

    .activity-input {
      flex: 1;
    }

    .activities-list {
      display: flex;
      flex-direction: column;
      gap: 8px;
    }

    .activity-item {
      display: flex;
      align-items: center;
      padding: 12px 16px;
      background: white;
      border-radius: 8px;
      border: 1px solid #e0e0e0;
      position: relative;
    }

    .activity-item.completed {
      background: #f5f5f5;
    }

    .activity-item.completed .activity-name {
      text-decoration: line-through;
      color: #999;
    }

    .activity-name {
      font-size: 16px;
    }

    .activity-description {
      margin: 4px 0 0 32px;
      font-size: 14px;
      color: #666;
    }

    .delete-activity {
      position: absolute;
      right: 8px;
      opacity: 0;
      transition: opacity 0.2s;
    }

    .activity-item:hover .delete-activity {
      opacity: 1;
    }

    /* Tablet */
    @media (max-width: 1024px) and (min-width: 769px) {
      .detail-container {
        padding: 20px;
      }

      .photos-grid {
        grid-template-columns: repeat(3, 1fr);
      }
    }

    /* Mobile */
    @media (max-width: 768px) {
      .detail-container {
        padding: 16px;
      }

      .detail-header {
        flex-wrap: wrap;
        gap: 12px;
      }

      .detail-header button {
        order: -1;
      }

      .header-info {
        flex: 1 1 100%;
        order: 1;
      }

      .header-info h1 {
        font-size: 22px;
      }

      mat-chip {
        order: 0;
        margin-left: auto;
      }

      .notes-card {
        margin-bottom: 16px;
      }

      .notes-text {
        padding: 10px;
        min-height: 50px;
        font-size: 14px;
      }

      .tab-content {
        padding: 16px 0;
      }

      .photos-grid {
        grid-template-columns: repeat(2, 1fr);
        gap: 12px;
      }

      .add-activity {
        flex-direction: column;
        gap: 12px;
      }

      .add-activity button {
        width: 100%;
      }

      .activity-item {
        padding: 10px 12px;
        padding-right: 48px;
      }

      .activity-name {
        font-size: 14px;
      }

      .delete-activity {
        opacity: 1;
      }

      .empty-photos, .empty-activities {
        padding: 32px 16px;
      }

      .empty-photos mat-icon, .empty-activities mat-icon {
        font-size: 48px;
        width: 48px;
        height: 48px;
      }
    }

    /* Small mobile */
    @media (max-width: 480px) {
      .detail-container {
        padding: 12px;
      }

      .header-info h1 {
        font-size: 20px;
      }

      .location {
        font-size: 13px;
      }

      .photos-grid {
        grid-template-columns: 1fr 1fr;
        gap: 8px;
      }

      .photo-overlay {
        opacity: 1;
        background: linear-gradient(to top, rgba(0,0,0,0.5), transparent 50%);
      }
    }
  `]
})
export class DestinationDetailComponent implements OnInit {
  loading = signal(true);
  destination = signal<Destination | null>(null);

  editingNotes = signal(false);
  notesText = '';

  uploading = signal(false);
  addingActivity = signal(false);
  newActivityName = '';

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private destinationsService: DestinationsService,
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
        this.notesText = destination.notes || '';
        this.loading.set(false);
      },
      error: () => {
        this.snackBar.open('Failed to load destination', 'Close', { duration: 3000 });
        this.router.navigate(['/destinations']);
      }
    });
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

  startNotesEdit(): void {
    this.notesText = this.destination()?.notes || '';
    this.editingNotes.set(true);
  }

  cancelNotesEdit(): void {
    this.notesText = this.destination()?.notes || '';
    this.editingNotes.set(false);
  }

  saveNotes(): void {
    const dest = this.destination();
    if (!dest) return;

    this.destinationsService.updateDestination(dest.id, { notes: this.notesText }).subscribe({
      next: (updated) => {
        this.destination.set({ ...dest, notes: updated.notes });
        this.editingNotes.set(false);
        this.snackBar.open('Notes saved!', 'Close', { duration: 3000 });
      }
    });
  }

  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (!input.files?.length) return;

    const file = input.files[0];
    const dest = this.destination();
    if (!dest) return;

    this.uploading.set(true);
    this.destinationsService.uploadPhoto(dest.id, file).subscribe({
      next: (photo) => {
        const photos = [...(dest.photos || []), photo];
        this.destination.set({ ...dest, photos });
        this.uploading.set(false);
        this.snackBar.open('Photo uploaded!', 'Close', { duration: 3000 });
        input.value = '';
      },
      error: () => {
        this.uploading.set(false);
        this.snackBar.open('Failed to upload photo', 'Close', { duration: 3000 });
      }
    });
  }

  deletePhoto(photo: Photo): void {
    if (!confirm('Delete this photo?')) return;

    const dest = this.destination();
    if (!dest) return;

    this.destinationsService.deletePhoto(photo.id).subscribe({
      next: () => {
        const photos = dest.photos?.filter(p => p.id !== photo.id) || [];
        this.destination.set({ ...dest, photos });
        this.snackBar.open('Photo deleted', 'Close', { duration: 3000 });
      }
    });
  }

  getPhotoUrl(photo: Photo): string {
    if (photo.url.startsWith('http')) {
      return photo.url;
    }
    return `${environment.apiUrl.replace('/api', '')}${photo.url}`;
  }

  addActivity(): void {
    if (!this.newActivityName.trim()) return;

    const dest = this.destination();
    if (!dest) return;

    this.addingActivity.set(true);
    this.destinationsService.createActivity({
      destinationId: dest.id,
      name: this.newActivityName.trim()
    }).subscribe({
      next: (activity) => {
        const activities = [...(dest.activities || []), activity];
        this.destination.set({ ...dest, activities });
        this.newActivityName = '';
        this.addingActivity.set(false);
        this.snackBar.open('Activity added!', 'Close', { duration: 3000 });
      },
      error: () => {
        this.addingActivity.set(false);
        this.snackBar.open('Failed to add activity', 'Close', { duration: 3000 });
      }
    });
  }

  toggleActivity(activity: Activity): void {
    const dest = this.destination();
    if (!dest) return;

    this.destinationsService.toggleActivityCompleted(activity.id).subscribe({
      next: (updated) => {
        const activities = dest.activities?.map(a => a.id === activity.id ? updated : a) || [];
        this.destination.set({ ...dest, activities });
      }
    });
  }

  deleteActivity(activity: Activity): void {
    const dest = this.destination();
    if (!dest) return;

    this.destinationsService.deleteActivity(activity.id).subscribe({
      next: () => {
        const activities = dest.activities?.filter(a => a.id !== activity.id) || [];
        this.destination.set({ ...dest, activities });
        this.snackBar.open('Activity removed', 'Close', { duration: 3000 });
      }
    });
  }
}
