import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { catchError, Observable, of } from 'rxjs';

export interface FeesSummary { outstanding: number; paid: number; dueDate: string; }

@Injectable({ providedIn: 'root' })
export class FeesService {
  private readonly http = inject(HttpClient);
  getSummary(): Observable<FeesSummary> {
    return this.http.get<FeesSummary>('/api/fees/summary').pipe(
      catchError(() => of({ outstanding: 1250, paid: 8750, dueDate: '30 September' }))
    );
  }
}
