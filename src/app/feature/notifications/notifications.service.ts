import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { catchError, Observable, of } from 'rxjs';
import { apiUrl } from '../../core/config/api.config';

export interface NotificationSummary { unread: number; latest: string; }

@Injectable({ providedIn: 'root' })
export class NotificationsService {
  private readonly http = inject(HttpClient);
  getSummary(): Observable<NotificationSummary> {
    return this.http.get<NotificationSummary>(apiUrl('/api/notifications/summary')).pipe(
      catchError(() => of({ unread: 3, latest: 'New homework feedback is available' }))
    );
  }
}
