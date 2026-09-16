import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { catchError, Observable, of } from 'rxjs';

export interface ProfileSummary { name: string; className: string; email: string; }

@Injectable({ providedIn: 'root' })
export class ProfileService {
  private readonly http = inject(HttpClient);
  getProfile(): Observable<ProfileSummary> {
    return this.http.get<ProfileSummary>('/api/profile').pipe(
      catchError(() => of({ name: 'Jordan Davis', className: 'Class 8A', email: 'jordan.davis@oakridge.edu' }))
    );
  }
}
