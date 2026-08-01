import { HttpInterceptorFn, HttpResponse } from '@angular/common/http';
import { from, map, of } from 'rxjs';

// ── Mock mode detection ───────────────────────────────────────────────────────
// Activates when the app is hosted on GitHub Pages (any *.github.io domain).
// All /api/* requests are intercepted and answered with static mock data so the
// app works end-to-end without an Express backend.
const isMockMode = (): boolean =>
  typeof window !== 'undefined' && 
  (window.location.hostname.endsWith('.github.io') || 
   window.location.hostname.endsWith('.vercel.app') ||
   window.location.hostname === 'payerpath.mrittick.com');

// ── Static mock payloads ──────────────────────────────────────────────────────

/** A fake, non-expiring access token. The token interceptor attaches it as a
 *  Bearer header; mock responses accept any token, so no real validation runs. */
const MOCK_TOKEN = 'mock.access.token.github-pages';

/** Matches the wire format that GET /api/users/me returns from the real server.
 *  Uses the same field names (username, not id) that the backend actually sends. */
const MOCK_USER = {
  username:  'mrittick',
  email:     'mrittick.choudhury@veradigm.com',
  name:      'Mrittick Choudhury',
  role:      'admin',
  avatarUrl: null,
};

// ── Helper ────────────────────────────────────────────────────────────────────

function respond<T>(body: T, status = 200): HttpResponse<T> {
  return new HttpResponse<T>({ body, status });
}

// ── Interceptor ───────────────────────────────────────────────────────────────

export const mockInterceptor: HttpInterceptorFn = (req, next) => {
  if (!isMockMode()) return next(req);

  const { method, url } = req;

  // Auth — refresh always succeeds so initialize() logs the user in on boot
  if (method === 'POST' && url === '/api/auth/refresh') {
    return of(respond({ accessToken: MOCK_TOKEN }));
  }

  // Auth — login accepts any credentials (demo mode)
  if (method === 'POST' && url === '/api/auth/login') {
    return of(respond({ accessToken: MOCK_TOKEN }));
  }

  // Auth — logout is a no-op in mock mode
  if (method === 'POST' && url === '/api/auth/logout') {
    return of(respond({ ok: true }));
  }

  // Current user — returns a hardcoded profile matching the server's wire format
  if (method === 'GET' && url === '/api/users/me') {
    return of(respond(MOCK_USER));
  }

  // Eligibility-check rows — streamed from the pre-generated static snapshot.
  // The snapshot was produced by running buildEcRows() against the live database;
  // it lives in src/assets/mock/ and is deployed as a static file alongside the app.
  // fetch() resolves the relative URL against the document's <base href>, which
  // the Angular CLI sets to the correct subdirectory path during the GitHub Pages build.
  if (method === 'GET' && url === '/api/eligibility-check') {
    return from(
      fetch('assets/mock/eligibility-check.json').then(r => {
        if (!r.ok) throw new Error(`Mock asset fetch failed: ${r.status}`);
        return r.json() as Promise<unknown[]>;
      }),
    ).pipe(map(data => respond(data)));
  }

  // Any other request passes through (Angular internals, unknown future endpoints)
  return next(req);
};
