import { Injectable, signal } from '@angular/core';

import { Role } from '../../common/model/dashboard.models';

const TOKEN_KEY = 'school_auth_token';
const ROLE_KEY = 'school_auth_role';
const SCHOOL_NAME_KEY = 'X-School-Name';

@Injectable({ providedIn: 'root' })
export class AuthSessionService {
  private readonly tokenState = signal<string | null>(sessionStorage.getItem(TOKEN_KEY));
  readonly isAuthenticatedState = this.tokenState.asReadonly();

  get token(): string | null {
    return this.tokenState();
  }

  get role(): Role | null {
    return this.toRole(sessionStorage.getItem(ROLE_KEY));
  }

  get schoolHeaderValue(): string | null {
    return sessionStorage.getItem(SCHOOL_NAME_KEY);
  }

  get isAuthenticated(): boolean {
    return Boolean(this.token);
  }

  setSession(token: string, role: Role): void {
    sessionStorage.setItem(TOKEN_KEY, token);
    sessionStorage.setItem(ROLE_KEY, role);
    this.tokenState.set(token);
  }

  setSchoolId(schoolId: string): void {
    sessionStorage.setItem(SCHOOL_NAME_KEY, schoolId);
  }

  clearSession(): void {
    sessionStorage.removeItem(TOKEN_KEY);
    sessionStorage.removeItem(ROLE_KEY);
    sessionStorage.removeItem(SCHOOL_NAME_KEY);
    this.tokenState.set(null);
  }

  private toRole(value: string | null): Role | null {
    switch (value?.toLowerCase().replace(/^role_/, '')) {
      case 'teacher': return 'Teacher';
      case 'student': return 'Student';
      case 'admin': return 'Admin';
      default: return null;
    }
  }
}
