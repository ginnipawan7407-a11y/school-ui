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
  token?: string;
  jwt?: string;
  jwtToken?: string;
  accessToken?: string;
  role?: string;
}

@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly http = inject(HttpClient);
  private readonly session = inject(AuthSessionService);

  login(credentials: LoginRequest): Observable<void> {
    return this.http.post<LoginResponse>('/api/auth/login', credentials).pipe(
      map(response => {
        const token = response.token ?? response.jwt ?? response.jwtToken ?? response.accessToken;
        const role = this.toRole(response.role);
        if (!token || !role) {
          throw new Error('Login response did not include a valid token and role.');
        }
        return { token, role };
      }),
      tap(({ token, role }) => this.session.setSession(token, role)),
      map(() => undefined)
    );
  }

  logout(): void {
    this.session.clearSession();
  }

  private toRole(value: string | undefined): Role | null {
    switch (value?.toLowerCase()) {
      case 'teacher': return 'Teacher';
      case 'student': return 'Student';
      case 'admin': return 'Admin';
      default: return null;
    }
  }
}
