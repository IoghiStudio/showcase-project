import { ISearchWorkers } from '@/services/api/serachWorkers.service';
import { atom } from 'recoil';

export const WorkerDataStore = atom<ISearchWorkers | null>({
  default: null,
  key: 'worker-data-store'
});
