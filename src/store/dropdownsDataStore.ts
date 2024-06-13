import { atom } from 'recoil';
import { ICountry } from '@/types/Country';
import { ICurrency } from '@/types/Currency';
import { IDepartment } from '@/types/Department';
import { IIndustry, IIndustrySubcategory } from '@/types/Industry';
import { IJobTitle } from '@/types/JobTitle';
import { ILanguage } from '@/types/Language';
import { IDrivingLicense } from '@/types/DrivingLicense';

export const CountriesStore = atom<ICountry[] | null>({
  default: null,
  key: 'countries-store'
});

export const DepartmentsStore = atom<IDepartment[] | null>({
  default: null,
  key: 'deparments-store'
});

export const IndustriesStore = atom<IIndustrySubcategory[] | null>({
  default: null,
  key: 'industries-store'
});

export const JobTitlesStore = atom<IJobTitle[] | null>({
  default: null,
  key: 'jobTitles-store'
});

export const LanguagesStore = atom<ILanguage[] | null>({
  default: null,
  key: 'languages-store'
});

export const CurrenciesStore = atom<ICurrency[] | null>({
  default: null,
  key: 'currencies-store'
});

export const DrivingStore = atom<IDrivingLicense[] | null>({
  default: null,
  key: 'driving-store'
});




