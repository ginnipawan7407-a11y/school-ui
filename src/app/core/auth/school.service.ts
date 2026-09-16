import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';

export interface School {
  id: string | number;
  name: string;
}

@Injectable({ providedIn: 'root' })
export class SchoolService {
  private readonly http = inject(HttpClient);

  getSchools(): Observable<School[]> {
    return this.http.get<School[]>('/api/v1/schools');
  }
}
