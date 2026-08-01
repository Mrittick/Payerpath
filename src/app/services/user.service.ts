import { Injectable, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap } from 'rxjs';

export interface User {
  id: string;
  name: string;
  email: string;
  role: string;
  avatarUrl?: string;
}

@Injectable({ providedIn: 'root' })
export class UserService {
  private readonly _currentUser = signal<User | null>(null);
  readonly currentUser = this._currentUser.asReadonly();

  constructor(private readonly http: HttpClient) {}

  loadCurrentUser(): Observable<User> {
    return this.http
      .get<User>('/api/users/me')
      .pipe(tap(user => this._currentUser.set(user)));
  }

  clearUser(): void {
    this._currentUser.set(null);
  }
}
