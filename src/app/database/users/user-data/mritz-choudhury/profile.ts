import type { UserRecord } from '../../user.types';

export const profile: UserRecord = {
  id:      'mritz-choudhury',
  name:    'Mritz Choudhury',
  email:   'mritz.choudhury@veradigm.com',
  role:    'manager',
  // Drop a photo at payerpath/database/users/{id}/photo.{jpg,jpeg,png,webp}
  // Served by the backend at /api/users/me/avatar — no frontend change needed.
  product: 'payerpath',
};

// ⚠️  Dev-only mock credential — never store real passwords in source code
export const mockCredentials = {
  email:    'mritz.choudhury@veradigm.com',
  password: 'testaccount',
} as const;
