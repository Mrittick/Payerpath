import type { UserRole } from '@merces/components/display/uac/uac.types';

export type { UserRole };

export interface UserRecord {
  id:         string;
  name:       string;
  email:      string;
  role:       UserRole;
  avatarUrl?: string;
  product:    'payerpath' | 'echart-coder';
}
