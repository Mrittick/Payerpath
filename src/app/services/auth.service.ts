import { Injectable, computed, inject, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, catchError, map, of, tap } from 'rxjs';

export interface User {
  id:    string;
  email: string;
  name:  string;
  role:  string;
}

@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly http = inject(HttpClient);

  private readonly _accessToken = signal<string | null>(null);

  readonly isAuthenticated = computed(() => !!this._accessToken());

  getAccessToken(): string | null {
    return this._accessToken();
  }

  login(email: string, username: string, password: string): Observable<void> {
    return this.http
      .post<{ accessToken: string }>('/api/auth/login', { email, username, password })
      .pipe(
        tap(({ accessToken }) => this._accessToken.set(accessToken)),
        map(() => void 0),
      );
  }

  logout(): void {
    this._accessToken.set(null);
    this.http.post('/api/auth/logout', {}).subscribe();
  }

  refresh(): Observable<boolean> {
    return this.http
      .post<{ accessToken: string }>('/api/auth/refresh', {})
      .pipe(
        tap(({ accessToken }) => this._accessToken.set(accessToken)),
        map(() => true),
        catchError(() => of(false)),
      );
  }

  initialize(): Observable<boolean> {
    return this.refresh();
  }
}
