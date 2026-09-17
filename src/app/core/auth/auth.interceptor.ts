import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';

import { AuthSessionService } from './auth-session.service';

export const authInterceptor: HttpInterceptorFn = (request, next) => {
  const session = inject(AuthSessionService);
  if (!request.url.startsWith('/rest/user-service/api/')) {
    return next(request);
  }

  const headers: Record<string, string> = {};
  if (session.token) headers['Authorization'] = `Bearer ${session.token}`;
  if (session.schoolHeaderValue) headers['X-School-Code'] = session.schoolHeaderValue;
  return next(request.clone({ setHeaders: headers }));
};
