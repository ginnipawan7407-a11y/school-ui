import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { catchError, Observable, of } from 'rxjs';

export interface School {
  id: string | number;
  name: string;
}

const DUMMY_SCHOOLS: School[] = [
  { id: 'oakridge', name: 'Oakridge School' },
  { id: 'greenwood', name: 'Greenwood Academy' },
  { id: 'lakeside', name: 'Lakeside Public School' }
];

@Injectable({ providedIn: 'root' })
export class SchoolService {
  private readonly http = inject(HttpClient);

  getSchools(): Observable<School[]> {
    return this.http.get<School[]>('/api/v1/schools').pipe(
      catchError(() => of(DUMMY_SCHOOLS))
    );
  }
}
