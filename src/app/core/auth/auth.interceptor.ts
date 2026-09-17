import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';

import { AuthSessionService } from './auth-session.service';
import { API_BASE_URL, ATTENDANCE_API_BASE_URL } from '../config/api.config';

export const authInterceptor: HttpInterceptorFn = (request, next) => {
  const session = inject(AuthSessionService);
  if (!request.url.startsWith(`${API_BASE_URL}/api/`) && !request.url.startsWith(`${ATTENDANCE_API_BASE_URL}/api/`)) {
    return next(request);
  }

  const headers: Record<string, string> = {};
  if (session.token) headers['Authorization'] = `Bearer ${session.token}`;
  if (session.schoolHeaderValue) headers['X-School-Code'] = session.schoolHeaderValue;
  return next(request.clone({ setHeaders: headers }));
};
