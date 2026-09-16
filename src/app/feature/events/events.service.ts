import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { catchError, Observable, of } from 'rxjs';

export interface SchoolEvent { title: string; date: string; }

@Injectable({ providedIn: 'root' })
export class EventsService {
  private readonly http = inject(HttpClient);
  getUpcoming(): Observable<SchoolEvent[]> {
    return this.http.get<SchoolEvent[]>('/api/events').pipe(
      catchError(() => of([
        { title: 'Science fair', date: '22 September' },
        { title: 'Sports day', date: '4 October' }
      ]))
    );
  }
}
