import { HttpClient } from '@angular/common/http';
import { Injectable, inject, signal } from '@angular/core';
import { catchError, map, Observable, of, tap } from 'rxjs';

export interface School {
  id: string | number;
  name: string;
  logoUrl?: string;
  welcomeLogo?: string;
  shortName: string;
}

const DEFAULT_LOGO = '/image/default-logo.svg';
const DEFAULT_WELCOME_MESSAGE = 'Welcom to the school management application, Please contact +91-8130579771 to get onBoarded as a school.';
const DEFAULT_SCHOOL: School = {
  id: 'default',
  name: 'School Management Application',
  shortName: 'School Management',
  logoUrl: DEFAULT_LOGO,
  welcomeLogo: DEFAULT_LOGO
};

const DUMMY_SCHOOLS: School[] = [
  {
    id: 'oakridge',
    name: 'Oakridge School',
    shortName: 'Oakridge',
    logoUrl: '/school-logos/oakridge.svg',
    welcomeLogo: '/school-logos/oakridge.svg'
  },
  {
    id: 'greenwood',
    name: 'Greenwood Academy',
    shortName: 'Greenwood',
    logoUrl: '/school-logos/greenwood.svg',
    welcomeLogo: '/school-logos/greenwood.svg'
  },
  {
    id: 'lakeside',
    name: 'Lakeside Public School',
    shortName: 'Lakeside',
    logoUrl: '/school-logos/lakeside.svg',
    welcomeLogo: '/school-logos/lakeside.svg'
  }
];

@Injectable({ providedIn: 'root' })
export class SchoolService {
  private readonly http = inject(HttpClient);
  private readonly schools = signal<School[]>(DUMMY_SCHOOLS);

  getSchools(): Observable<School[]> {
    return this.http.get<Partial<School>[]>('/api/v1/schools').pipe(
      map(schools => schools.map(school => this.withBranding(school))),
      tap(schools => this.schools.set(schools)),
      catchError(() => of(DUMMY_SCHOOLS))
    );
  }

  getBranding(schoolId: string | number | null): School {
    if (schoolId === null || schoolId === '') return this.withBranding(DEFAULT_SCHOOL);

    return this.schools().find(school => String(school.id) === String(schoolId))
      ?? this.withBranding({ id: schoolId, name: String(schoolId) });
  }

  private withBranding(school: Partial<School>): School {
    const branding = DUMMY_SCHOOLS.find(candidate => String(candidate.id) === String(school.id)) ?? DEFAULT_SCHOOL;
    return {
      ...branding,
      ...school,
      logoUrl: school.logoUrl?.trim() || branding.logoUrl || DEFAULT_LOGO,
      welcomeLogo: school.welcomeLogo?.trim() || branding.welcomeLogo || DEFAULT_LOGO,
      shortName: school.shortName?.trim() || branding.shortName
    };
  }
}

export { DEFAULT_LOGO, DEFAULT_WELCOME_MESSAGE };
