import { ICountry } from "@/types/Country";
import { IDepartment } from "@/types/Department";
import { IIndustrySubcategory } from "@/types/Industry";
import { IJobTitle } from "@/types/JobTitle";
import { ILanguage } from "@/types/Language";
import { atom } from "recoil";

export enum AnnounceStatus {
  Open = 'OPEN',
  Closed = 'CLOSED'
};

export interface IAnnounce {
  job_id: number;
  job_title_id: number;
  company_id: number;
  country_id: number;
  industry_subcategory_id: number;
  department_id: number;
  city: null | string;
  type_of_employment: string;
  contract_duration: null | number;
  contract_duration_period: null | string;
  workplace_type: string;
  salary: number;
  currency: string;
  recurrency: string;
  benefits: null | string[];
  description: string;
  due_date: null | string;
  responsabilities: string;
  views: number;
  clicks: number;
  saved: number;
  applied: number;
  experience: null | number;
  type: null | string;
  skills: null | string[];
  status: AnnounceStatus,
  createdAt: string;
  updatedAt: string;
  JobTitle:IJobTitle;
  promoted: boolean;
  Country: ICountry;
  Department: IDepartment;
  IndustrySubcategory: IIndustrySubcategory;
  JobDrivingPermits: IAnnounceLicence[],
  JobLanguages: IAnnounceLanguage[],
  custom_name: string;
  opening_positions: number | null;
  JobCountries: IJobCountry[];
  jobCountries: ICountry[];
};

export interface IJobCountry {
  Country: ICountry;
};

export interface IAnnounceLanguage {
  Language: ILanguage;
  createdAt: string;
  job_id: number;
  job_languague_id: number;
  language_id: number;
  proficiency: string;
  updatedAt: string;
};

export interface IAnnounceLicence {
  category: string;
  createdAt: string;
  driving_experience: number;
  job_driving_permit_id: number;
  job_id: number;
  updatedAt: string;
};

export const AnnouncesStore = atom<IAnnounce[] | null>({
  default: null,
  key: 'announces-store'
});

export const AnnouncesActiveStore = atom<number>({
  default: 0,
  key: 'announce-active-store'
});

export const AnnounceOneStore = atom<IAnnounce | null>({
  default: null,
  key: 'announce-one-store'
});

