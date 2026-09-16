import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { catchError, Observable, of } from 'rxjs';

export interface Announcement { title: string; date: string; }

@Injectable({ providedIn: 'root' })
export class AnnouncementsService {
  private readonly http = inject(HttpClient);
  getRecent(): Observable<Announcement[]> {
    return this.http.get<Announcement[]>('/api/announcements').pipe(
      catchError(() => of([
        { title: 'Parent meeting this Friday', date: 'Today' },
        { title: 'Library week begins Monday', date: 'Yesterday' }
      ]))
    );
  }
}
