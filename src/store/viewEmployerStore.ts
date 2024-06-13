import { IViewEmployer } from '@/services/api/viewEmployer.service';
import { atom } from 'recoil';

export const ViewEmployerStore = atom<IViewEmployer | null>({
  default: null,
  key: 'view-employer-store'
});
