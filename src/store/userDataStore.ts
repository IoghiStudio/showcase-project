import { IUserData } from '@/types/UserData';
import { atom } from 'recoil';

export const UserDataStore = atom<IUserData | null>({
  default: null,
  key: 'userData-store'
});
