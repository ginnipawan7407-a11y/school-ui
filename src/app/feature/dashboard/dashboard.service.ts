import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { catchError, Observable, of } from 'rxjs';

import { DashboardData, FALLBACK_DASHBOARD_DATA } from '../../common/model/dashboard.models';
import { apiUrl } from '../../core/config/api.config';

@Injectable({ providedIn: 'root' })
export class DashboardService {
  private readonly http = inject(HttpClient);

  getDashboardData(): Observable<DashboardData> {
    return this.http.get<DashboardData>(apiUrl('/api/dashboard')).pipe(
      catchError(() => of(FALLBACK_DASHBOARD_DATA))
    );
  }
}
