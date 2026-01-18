import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import {
  Destination,
  CreateDestinationRequest,
  UpdateDestinationRequest,
  DestinationStats,
  Photo,
  Activity,
  CreateActivityRequest
} from '../../models';

@Injectable({
  providedIn: 'root'
})
export class DestinationsService {
  private readonly apiUrl = `${environment.apiUrl}/destinations`;
  private readonly photosUrl = `${environment.apiUrl}/photos`;
  private readonly activitiesUrl = `${environment.apiUrl}/activities`;

  constructor(private http: HttpClient) {}

  // Destinations
  getDestinations(): Observable<Destination[]> {
    return this.http.get<Destination[]>(this.apiUrl);
  }

  getDestination(id: string): Observable<Destination> {
    return this.http.get<Destination>(`${this.apiUrl}/${id}`);
  }

  getDestinationsByContinent(continentId: number): Observable<Destination[]> {
    return this.http.get<Destination[]>(`${this.apiUrl}/continent/${continentId}`);
  }

  getDestinationsByCountry(countryId: number): Observable<Destination[]> {
    return this.http.get<Destination[]>(`${this.apiUrl}/country/${countryId}`);
  }

  createDestination(data: CreateDestinationRequest): Observable<Destination> {
    return this.http.post<Destination>(this.apiUrl, data);
  }

  updateDestination(id: string, data: UpdateDestinationRequest): Observable<Destination> {
    return this.http.patch<Destination>(`${this.apiUrl}/${id}`, data);
  }

  deleteDestination(id: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }

  getStats(): Observable<DestinationStats> {
    return this.http.get<DestinationStats>(`${this.apiUrl}/stats`);
  }

  // Photos
  uploadPhoto(destinationId: string, file: File, caption?: string): Observable<Photo> {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('destinationId', destinationId);
    if (caption) {
      formData.append('caption', caption);
    }
    return this.http.post<Photo>(this.photosUrl, formData);
  }

  getPhotos(destinationId: string): Observable<Photo[]> {
    return this.http.get<Photo[]>(`${this.photosUrl}/destination/${destinationId}`);
  }

  updatePhotoCaption(photoId: string, caption: string): Observable<Photo> {
    return this.http.patch<Photo>(`${this.photosUrl}/${photoId}/caption`, { caption });
  }

  deletePhoto(photoId: string): Observable<void> {
    return this.http.delete<void>(`${this.photosUrl}/${photoId}`);
  }

  // Activities
  createActivity(data: CreateActivityRequest): Observable<Activity> {
    return this.http.post<Activity>(this.activitiesUrl, data);
  }

  getActivities(destinationId: string): Observable<Activity[]> {
    return this.http.get<Activity[]>(`${this.activitiesUrl}/destination/${destinationId}`);
  }

  updateActivity(activityId: string, data: Partial<CreateActivityRequest>): Observable<Activity> {
    return this.http.patch<Activity>(`${this.activitiesUrl}/${activityId}`, data);
  }

  toggleActivityCompleted(activityId: string): Observable<Activity> {
    return this.http.patch<Activity>(`${this.activitiesUrl}/${activityId}/toggle`, {});
  }

  deleteActivity(activityId: string): Observable<void> {
    return this.http.delete<void>(`${this.activitiesUrl}/${activityId}`);
  }
}
