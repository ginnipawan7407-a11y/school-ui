import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, catchError, map, of, tap } from 'rxjs';

import { Role } from '../../common/model/dashboard.models';
import { AuthSessionService } from './auth-session.service';
import { apiUrl } from '../config/api.config';

export interface LoginRequest {
  username: string;
  password: string;
}

export interface UserRegistrationRequest {
  username: string;
  password: string;
  phoneNumber?: string;
  role: 'TEACHER' | 'STUDENT' | 'ADMIN';
}

interface UserRegistrationResponse 
{
  status: string;
  code: 200,
  message: string;
  data: {
    id: number;
    username: string;
    token: string;
    refreshToken?: string;
    roles: string[];
    active: boolean;
  },
  timestamp: Date;
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
    return this.http.post<LoginResponse>(apiUrl('/api/v1/auth/login'), credentials).pipe(
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

  createAdmin(adminReq: UserRegistrationRequest, token: string): Observable<void> {
    return this.http.post<UserRegistrationResponse>(apiUrl('/api/v1/users/register/admin/' + token), adminReq).pipe(
      map(response => {
        if (response.code > 299) {
          throw new Error('Admin creation failed.');
        }
      })
    );
  }

  getAdminToken(): Observable<string> {
    return this.http.get<{ data: string }>(apiUrl('/api/v1/users/register/admin/token')).pipe(
      map(response => response.data),
      catchError(() => of(''))
    );
  }

  setSchoolCode(schoolCode: string): void {
    this.session.setSchoolCode(schoolCode);
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
