import { Injectable } from '@angular/core';

import { Role } from '../../common/model/dashboard.models';

const TOKEN_KEY = 'school_auth_token';
const ROLE_KEY = 'school_auth_role';

@Injectable({ providedIn: 'root' })
export class AuthSessionService {
  get token(): string | null {
    return sessionStorage.getItem(TOKEN_KEY);
  }

  get role(): Role | null {
    return this.toRole(sessionStorage.getItem(ROLE_KEY));
  }

  get isAuthenticated(): boolean {
    return Boolean(this.token);
  }

  setSession(token: string, role: Role): void {
    sessionStorage.setItem(TOKEN_KEY, token);
    sessionStorage.setItem(ROLE_KEY, role);
  }

  clearSession(): void {
    sessionStorage.removeItem(TOKEN_KEY);
    sessionStorage.removeItem(ROLE_KEY);
  }

  private toRole(value: string | null): Role | null {
    switch (value?.toLowerCase()) {
      case 'teacher': return 'Teacher';
      case 'student': return 'Student';
      case 'admin': return 'Admin';
      default: return null;
    }
  }
}
