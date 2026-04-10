import { Injectable, computed, inject, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, catchError, map, of, tap } from 'rxjs';

export interface User {
  id:    string;
  email: string;
  name:  string;
  role:  string;
}

import { MOCK_USER_REGISTRY } from '../database/mock-users';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly http = inject(HttpClient);

  private readonly _accessToken = signal<string | null>(localStorage.getItem('gh_demo_token'));
  private readonly _currentUsername = signal<string | null>(localStorage.getItem('gh_demo_user'));

  readonly isAuthenticated = computed(() => !!this._accessToken());

  getAccessToken(): string | null {
    return this._accessToken();
  }

  getCurrentUsername(): string | null {
    return this._currentUsername();
  }

  login(email: string, username: string, password: string): Observable<void> {
    const user = MOCK_USER_REGISTRY[username];
    const isValid = user && user.email === email && user.password === password;

    if (isValid) {
      const fakeToken = 'demo-mock-jwt-token';
      this._accessToken.set(fakeToken);
      this._currentUsername.set(username);
      localStorage.setItem('gh_demo_token', fakeToken);
      localStorage.setItem('gh_demo_user', username);
      return of(void 0);
    } else {
      console.error('Login failed: Invalid credentials');
      const error = new Error('Authentication failed');
      return new Observable(subscriber => subscriber.error(error));
    }
  }

  logout(): void {
    this._accessToken.set(null);
    this._currentUsername.set(null);
    localStorage.removeItem('gh_demo_token');
    localStorage.removeItem('gh_demo_user');
  }

  refresh(): Observable<boolean> {
    const token = localStorage.getItem('gh_demo_token');
    const user = localStorage.getItem('gh_demo_user');
    if (token && user) {
      this._accessToken.set(token);
      this._currentUsername.set(user);
      return of(true);
    }
    return of(false);
  }

  initialize(): Observable<boolean> {
    return this.refresh();
  }
}
