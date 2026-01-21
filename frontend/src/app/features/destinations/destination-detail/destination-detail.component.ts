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
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatDialogModule } from '@angular/material/dialog';
import { DestinationsService } from '../../../core/services/destinations.service';
import { Destination, Photo } from '../../../models';
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
        <!-- Hero Section with City Image -->
        <div class="hero-section">
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

        <!-- Bucket List Section -->
        <section class="bucket-list-section">
          <div class="section-header">
            <h2>Bucket List</h2>
            <button mat-raised-button color="primary" class="add-item-btn" (click)="openItemDialog()">
              Add to List
            </button>
          </div>

          @if (destination()!.photos && destination()!.photos!.length > 0) {
            <div class="postcards-grid">
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

        <!-- Item Dialog Overlay -->
        @if (dialogOpen()) {
          <div class="dialog-overlay" (click)="closeItemDialog()">
            <div class="item-dialog" (click)="$event.stopPropagation()">
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
      margin-bottom: 32px;
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

    /* Bucket List Section */
    .bucket-list-section {
      padding: 0 24px 24px;
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

    .add-item-btn mat-icon {
      margin-right: 8px;
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

    .edit-btn {
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

    /* Item Dialog */
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

    .item-dialog {
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

      .bucket-list-section {
        padding: 0 16px 16px;
      }

      .section-header {
        flex-direction: column;
        align-items: flex-start;
        gap: 16px;
      }

      .add-item-btn {
        width: 100%;
      }

      .postcards-grid {
        grid-template-columns: 1fr;
        gap: 16px;
      }

      .edit-btn {
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

      .item-dialog {
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

      .bucket-list-section {
        padding: 0 12px 12px;
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

  // Dialog state
  dialogOpen = signal(false);
  editingPhoto = signal<Photo | null>(null);
  selectedFile = signal<File | null>(null);
  previewUrl = signal<string | null>(null);
  itemNote = '';
  saving = signal(false);
  isDragging = signal(false);

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
        this.loading.set(false);
      },
      error: () => {
        this.snackBar.open('Failed to load destination', 'Close', { duration: 3000 });
        this.router.navigate(['/destinations']);
      }
    });
  }

  getCityImageUrl(): string {
    const dest = this.destination();
    if (!dest?.city) return 'https://images.unsplash.com/photo-1488646953014-85cb44e25828?w=1200';

    // Use city imageUrl from backend
    if (dest.city.imageUrl) {
      return dest.city.imageUrl;
    }

    // Default travel image
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

  // Dialog methods
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
}
