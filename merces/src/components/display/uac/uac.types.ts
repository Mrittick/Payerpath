export type UserRole = 'admin' | 'manager';

export const USER_ROLE_LABELS: Record<UserRole, string> = {
  admin:   'Admin',
  manager: 'Manager',
};
