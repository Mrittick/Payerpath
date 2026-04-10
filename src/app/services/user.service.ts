import { Injectable, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of, tap } from 'rxjs';

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
    const mockUser: User = {
      id: 'mritz-choudhury',
      name: 'Mritz Choudhury',
      email: 'mritz.choudhury@veradigm.com',
      role: 'manager'
    };
    this._currentUser.set(mockUser);
    return of(mockUser);
  }

  clearUser(): void {
    this._currentUser.set(null);
  }
}
