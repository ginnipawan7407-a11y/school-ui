import { HttpClient } from '@angular/common/http';
import { Injectable, inject, signal } from '@angular/core';
import { catchError, map, Observable, of, tap } from 'rxjs';

export interface School {
  id: string | number;
  name: string;
  logoUrl?: string;
  welcomeLogo?: string;
  welcomeBackground?: string;
  shortName: string;
}

const DEFAULT_LOGO = '/image/default-logo.svg';
const DEFAULT_WELCOME_BACKGROUND = '/image/school-welcom-background.svg';
const DEFAULT_WELCOME_MESSAGE = 'Welcom to the school management application, Please contact +91-8130579771 to get onBoarded as a school.';
const DEFAULT_SCHOOL: School = {
  id: 'default',
  name: 'School Management Application',
  shortName: 'School Management',
  logoUrl: DEFAULT_LOGO,
  welcomeLogo: DEFAULT_LOGO,
  welcomeBackground: DEFAULT_WELCOME_BACKGROUND
};

const DUMMY_SCHOOLS: School[] = [
  {
    id: 'bpssv',
    name: 'Bharti Public School',
    shortName: 'Bharti',
    logoUrl: '/school-logos/bpssv.png',
    welcomeLogo: '/school-logos/bpssv.png',
    welcomeBackground: DEFAULT_WELCOME_BACKGROUND
  },
  {
    id: 'greenwood',
    name: 'Greenwood Academy',
    shortName: 'Greenwood',
    logoUrl: '/school-logos/greenwood.svg',
    welcomeLogo: '/school-logos/greenwood.svg',
    welcomeBackground: DEFAULT_WELCOME_BACKGROUND
  },
  {
    id: 'lakeside',
    name: 'Lakeside Public School',
    shortName: 'Lakeside',
    logoUrl: '/school-logos/lakeside.svg',
    welcomeLogo: '/school-logos/lakeside.svg',
    welcomeBackground: DEFAULT_WELCOME_BACKGROUND
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
      welcomeBackground: school.welcomeBackground?.trim() || branding.welcomeBackground || DEFAULT_WELCOME_BACKGROUND,
      shortName: school.shortName?.trim() || branding.shortName
    };
  }
}

export { DEFAULT_LOGO, DEFAULT_WELCOME_BACKGROUND, DEFAULT_WELCOME_MESSAGE };
