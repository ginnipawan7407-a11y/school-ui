import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { catchError, map, Observable, of } from 'rxjs';

export interface ProfileSummary {
  id: number;
  name: string;
  username: string;
  className: string;
  email: string;
  mobile: string;
  role: string;
  active: boolean;
  photoUrl: string | null;
}

interface ProfilePayload {
  id?: number;
  name?: string;
  username?: string;
  className?: string;
  email?: string;
  mobile?: string;
  phone?: string;
  photoUrl?: string;
  profilePic?: string;
  profileImage?: string;
  firstName?: string;
  lastName?: string;
  role?: string;
  active?: boolean;
}

interface ProfileResponse extends ProfilePayload {
  data?: ProfilePayload;
}

@Injectable({ providedIn: 'root' })
export class ProfileService {
  private readonly http = inject(HttpClient);
  getProfile(): Observable<ProfileSummary> {
    return this.http.get<ProfileResponse>('/api/profile').pipe(
      map(response => this.toProfile(response.data ?? response)),
      catchError(() => of({
        id: 0,
        name: 'Jordan Davis',
        username: 'jordan.davis',
        className: 'Class 8A',
        email: 'jordan.davis@oakridge.edu',
        mobile: 'Not available',
        role: 'Student',
        active: true,
        photoUrl: null
      }))
    );
  }

  private toProfile(profile: ProfilePayload): ProfileSummary {
    return {
      id: profile.id ?? 0,
      name: profile.name ?? ([profile.firstName, profile.lastName].filter(Boolean).join(' ') || profile.username || 'Not available'),
      username: profile.username ?? 'Not available',
      className: profile.className ?? 'Not available',
      email: profile.email ?? 'Not available',
      mobile: profile.mobile ?? profile.phone ?? 'Not available',
      role: profile.role ?? 'Not available',
      active: profile.active ?? false,
      photoUrl: profile.photoUrl ?? profile.profilePic ?? profile.profileImage ?? null
    };
  }
}
