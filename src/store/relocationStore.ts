import { ICountry } from '@/types/Country';
import { atom } from 'recoil';

export const AsiaCountriesStore = atom<ICountry[] | null>({
  default: null,
  key: 'asia-c-store'
});

export const AfricaCountriesStore = atom<ICountry[] | null>({
  default: null,
  key: 'africa-c-store'
});

export const EuropeCountriesStore = atom<ICountry[] | null>({
  default: null,
  key: 'europe-c-store'
});

export const CaribbeanCountriesStore = atom<ICountry[] | null>({
  default: null,
  key: 'caribbean-c-store'
});

export const NorthAmericaCountriesStore = atom<ICountry[] | null>({
  default: null,
  key: 'northAmerica-c-store'
});

export const CentralAmericaCountriesStore = atom<ICountry[] | null>({
  default: null,
  key: 'centralAmerica-c-store'
});

export const SouthAmericaCountriesStore = atom<ICountry[] | null>({
  default: null,
  key: 'southAmerica-c-store'
});

export const OceaniaCountriesStore = atom<ICountry[] | null>({
  default: null,
  key: 'oceania-c-store'
});



