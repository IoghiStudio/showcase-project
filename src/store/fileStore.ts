import { atom } from 'recoil';

export const UserImageStore = atom<string | null>({
  default: null,
  key: 'user-image-store'
});
