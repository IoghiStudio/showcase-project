import { atom } from 'recoil';
import { IJob } from './jobStore';

export const JobDataStore = atom<IJob | null>({
  default: null,
  key: 'job-data-store'
});
