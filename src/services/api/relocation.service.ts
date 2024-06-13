import { ICountry } from "@/types/Country";
import request from "../base.service";

export interface IRelocation {
  countryIds: number[],
  worldwide: number,
  name: string | null,
  createdAt?: string;
  updatedAt?: string;
  relocation_id?: number;
  candidate_id?: number;
  company_id?: number;
  countries?: ICountry[];
};

export interface IGetPrivacy {
  company_id: number;
  countries: ICountry[];
  createdAt: number;
  name: number;
  updatedAt: number;
  worldwide: number;
};

export const getRelocationSettings = async () => await request.get('relocation');
export const postRelocationSettings = async (data: IRelocation) => await request.post('relocation', data);
export const updateRelocationSettings = async (data: IRelocation) => await request.put('relocation', data);
export const getRegionCountries = async (region: string) => await request.get(`countries/region/${region}`);
export const getSubregionCountries = async (subregion: string) => await request.get(`countries/subregion/${subregion}`);

export const getPrivacySettings = async () => await request.get('privacy');
export const postPrivacySettings = async (data: IRelocation) => await request.post('privacy', data);
export const updatePrivacySettings = async (data: IRelocation) => await request.put('privacy', data);

