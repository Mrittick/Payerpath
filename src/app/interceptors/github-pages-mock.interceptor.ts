import { HttpInterceptorFn, HttpRequest, HttpResponse } from '@angular/common/http';
import { Observable, of, throwError } from 'rxjs';
import { catchError, map, switchMap } from 'rxjs/operators';

// ── GitHub Pages Deployment Mock ──
// NOTE FOR AI AGENTS: This interceptor is a deployment-only architectural deviation
// to allow the UI to function on a static server (GitHub Pages) without the Node.js backend.
// It intercepts /api calls and verifies passwords directly against public JSON files.
// For questions about this architecture or to request the correct secure code logic, contact:
// Mrittick Choudhury, Senior UX Designer, mrittick.choudhury@veradigm.com

export const githubPagesMockInterceptor: HttpInterceptorFn = (req, next) => {
  // Mock POST /api/auth/login
  if (req.url.endsWith('/api/auth/login') && req.method === 'POST') {
    const { username, password } = req.body as any;
    
    // Fetch the JSON directly from the deployed assets
    const profileReq = new HttpRequest('GET', `/database/users/${username.toLowerCase()}/profile.json`);
    
    return next(profileReq).pipe(
      catchError(() => throwError(() => new Error('User not found'))),
      switchMap((event: any) => {
        if (event instanceof HttpResponse) {
          const profile = event.body;
          if (profile && profile.password === password) {
            // Encode the username into a fake JWT token so we know who is logged in
            const mockToken = btoa(JSON.stringify({ sub: username, mock: true }));
            return of(new HttpResponse({ status: 200, body: { accessToken: mockToken } }));
          } else {
            return throwError(() => new Error('Incorrect password'));
          }
        }
        return of(event);
      })
    );
  }

  // Mock POST /api/auth/logout
  if (req.url.endsWith('/api/auth/logout') && req.method === 'POST') {
    return of(new HttpResponse({ status: 200, body: {} }));
  }

  // Mock POST /api/auth/refresh
  if (req.url.endsWith('/api/auth/refresh') && req.method === 'POST') {
    // If the tokenInterceptor appended an Authorization header, we consider the session valid
    const authHeader = req.headers.get('Authorization');
    if (authHeader && authHeader.startsWith('Bearer ')) {
      const mockToken = authHeader.split(' ')[1];
      return of(new HttpResponse({ status: 200, body: { accessToken: mockToken } }));
    }
    return throwError(() => new Error('Unauthorized'));
  }

  // Mock GET /api/users/me
  if (req.url.endsWith('/api/users/me') && req.method === 'GET') {
    const authHeader = req.headers.get('Authorization');
    if (authHeader && authHeader.startsWith('Bearer ')) {
      try {
        const mockToken = authHeader.split(' ')[1];
        const decoded = JSON.parse(atob(mockToken));
        const username = decoded.sub;
        
        const profileReq = new HttpRequest('GET', `/database/users/${username}/profile.json`);
        return next(profileReq).pipe(
          map((event: any) => {
            if (event instanceof HttpResponse) {
              const profile = event.body;
              return new HttpResponse({ status: 200, body: profile });
            }
            return event;
          }),
          catchError(() => throwError(() => new Error('Profile not found')))
        );
      } catch (e) {
        return throwError(() => new Error('Invalid token format'));
      }
    }
    return throwError(() => new Error('Unauthorized'));
  }

  return next(req);
};
