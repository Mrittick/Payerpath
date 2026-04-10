import { UserRole } from '@merces/components/display/uac/uac.types';

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  username: string;
  password: string;
  role: UserRole;
  avatarUrl?: string;
}

export const MOCK_USER_REGISTRY: Record<string, UserProfile> = {
  'mritz': {
    id: 'mritz',
    name: 'Mrittick Choudhury',
    email: 'mrittick.choudhury@veradigm.com',
    username: 'mritz',
    password: 'merces',
    role: 'manager'
  },
  'mrittick': {
    id: 'mrittick',
    name: 'Mrittick Choudhury',
    email: 'mrittick.choudhury@veradigm.com',
    username: 'mrittick',
    password: 'merces',
    role: 'admin',
    avatarUrl: 'assets/mrittick-photo.jpeg'
  },
  'dswiezy': {
    id: 'dswiezy',
    name: 'David Swiezy',
    email: 'david.swiezy@veradigm.com',
    username: 'dswiezy',
    password: 'merces',
    role: 'analyst'
  },
  'dknize': {
    id: 'dknize',
    name: 'Don Knize',
    email: 'don.knize@veradigm.com',
    username: 'dknize',
    password: 'merces',
    role: 'analyst'
  },
  'gjindal': {
    id: 'gjindal',
    name: 'Gaurav Jindal',
    email: 'gaurav.jindal@veradigm.com',
    username: 'gjindal',
    password: 'merces',
    role: 'analyst'
  },
  'yhe': {
    id: 'yhe',
    name: 'Yudong He',
    email: 'yudong.he@veradigm.com',
    username: 'yhe',
    password: 'merces',
    role: 'analyst'
  }
};
