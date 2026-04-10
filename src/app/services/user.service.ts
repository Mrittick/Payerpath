import { Injectable, inject, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of, tap } from 'rxjs';
import { AuthService } from './auth.service';
import { MOCK_USER_REGISTRY } from '../database/mock-users';

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

  private readonly authService = inject(AuthService);

  constructor(private readonly http: HttpClient) {}

  loadCurrentUser(): Observable<User> {
    const username = this.authService.getCurrentUsername();
    const mockUser = username ? MOCK_USER_REGISTRY[username] : null;

    if (mockUser) {
      this._currentUser.set(mockUser);
      return of(mockUser);
    }

    return new Observable(subscriber => subscriber.error(new Error('User not found')));
  }

  clearUser(): void {
    this._currentUser.set(null);
  }
}
