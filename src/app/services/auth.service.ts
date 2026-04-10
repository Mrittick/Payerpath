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

  private readonly _accessToken = signal<string | null>(localStorage.getItem('gh_demo_token'));

  readonly isAuthenticated = computed(() => !!this._accessToken());

  getAccessToken(): string | null {
    return this._accessToken();
  }

  login(email: string, username: string, password: string): Observable<void> {
    const fakeToken = 'demo-mock-jwt-token';
    this._accessToken.set(fakeToken);
    localStorage.setItem('gh_demo_token', fakeToken);
    return of(void 0);
  }

  logout(): void {
    this._accessToken.set(null);
    localStorage.removeItem('gh_demo_token');
  }

  refresh(): Observable<boolean> {
    const token = localStorage.getItem('gh_demo_token');
    if (token) {
      this._accessToken.set(token);
      return of(true);
    }
    return of(false);
  }

  initialize(): Observable<boolean> {
    return this.refresh();
  }
}
