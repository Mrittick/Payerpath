export type { UserRole, UserRecord } from './user.types';

import type { UserRecord } from './user.types';
import { profile as mrittickChoudhury } from './user-data/mrittick-choudhury/profile';
import { profile as mritzChoudhury }    from './user-data/mritz-choudhury/profile';

export const USER_REGISTRY: UserRecord[] = [
  mrittickChoudhury,
  mritzChoudhury,
];

export function getUserById(id: string): UserRecord | undefined {
  return USER_REGISTRY.find(u => u.id === id);
}

export function getUserByEmail(email: string): UserRecord | undefined {
  return USER_REGISTRY.find(u => u.email === email);
}
