export type UserRole = 'admin' | 'manager' | 'analyst';

export const USER_ROLE_LABELS: Record<UserRole, string> = {
  admin:   'Admin',
  manager: 'Manager',
  analyst: 'Analyst',
};
