import { HttpErrorResponse, HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { catchError, switchMap, throwError } from 'rxjs';
import { AuthService } from '../services/auth.service';

export const tokenInterceptor: HttpInterceptorFn = (req, next) => {
  const auth   = inject(AuthService);
  const router = inject(Router);

  // Auth endpoints use cookies — no Bearer token needed
  if (req.url.startsWith('/api/auth/')) return next(req);

  const token      = auth.getAccessToken();
  const authedReq  = token
    ? req.clone({ setHeaders: { Authorization: `Bearer ${token}` } })
    : req;

  return next(authedReq).pipe(
    catchError((err: HttpErrorResponse) => {
      if (err.status !== 401) return throwError(() => err);

      // Access token expired — attempt silent refresh then retry
      return auth.refresh().pipe(
        switchMap(refreshed => {
          if (!refreshed) {
            auth.logout();
            router.navigate(['/login']);
            return throwError(() => err);
          }
          const retried = req.clone({
            setHeaders: { Authorization: `Bearer ${auth.getAccessToken()}` },
          });
          return next(retried);
        }),
      );
    }),
  );
};
