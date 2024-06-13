import { IResidency } from '@/types/Residency';
import { atom } from 'recoil';

export const ResidencyStore = atom<IResidency | null>({
  default: null,
  key: 'residency-store'
});
