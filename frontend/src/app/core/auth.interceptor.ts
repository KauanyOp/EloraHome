import { HttpErrorResponse, HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { catchError, throwError } from 'rxjs';
import { AuthService } from './auth.service';

export const authInterceptor: HttpInterceptorFn = (request, next) => {
  const auth = inject(AuthService);
  const token = auth.token();

  if (!token) {
    return next(request);
  }

  return next(request.clone({
    setHeaders: { Authorization: `Bearer ${token}` }
  })).pipe(catchError((error: unknown) => {
    if (error instanceof HttpErrorResponse && (
      error.status === 401 ||
      (error.status === 403 && error.error?.message === 'Esta conta está desativada.')
    )) {
      auth.clearSession();
    }
    return throwError(() => error);
  }));
};
