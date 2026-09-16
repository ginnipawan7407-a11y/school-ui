import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map, tap } from 'rxjs';

import { Role } from '../../common/model/dashboard.models';
import { AuthSessionService } from './auth-session.service';

export interface LoginRequest {
  username: string;
  password: string;
}

interface LoginResponse {
  status: string;
  code: number;
  message: string;
  data: {
    id: number;
    username: string;
    token: string;
    refreshToken: string | null;
    roles: string[];
    active: boolean;
  };
  timestamp: string;
}

@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly http = inject(HttpClient);
  private readonly session = inject(AuthSessionService);

  login(credentials: LoginRequest): Observable<void> {
    return this.http.post<LoginResponse>('/rest/user-service/api/v1/auth/login', credentials).pipe(
      map(response => {
        const token = response.data.token;
        const role = this.toRole(response.data.roles[0]);
        if (!token || !role) {
          throw new Error('Login response did not include a valid token and role.');
        }
        return { token, role };
      }),
      tap(({ token, role }) => this.session.setSession(token, role)),
      map(() => undefined)
    );
  }

  setSchoolId(schoolId: string): void {
    this.session.setSchoolId(schoolId);
  }

  logout(): void {
    this.session.clearSession();
  }

  private toRole(value: string | undefined): Role | null {
    switch (value?.toLowerCase().replace(/^role_/, '')) {
      case 'teacher': return 'Teacher';
      case 'student': return 'Student';
      case 'admin': return 'Admin';
      default: return null;
    }
  }
}
