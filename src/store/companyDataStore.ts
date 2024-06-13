import { ICompanyData } from '@/types/CompanyData';
import { atom } from 'recoil';

export const CompanyDataStore = atom<ICompanyData | null>({
  default: null,
  key: 'companyData-store'
});
