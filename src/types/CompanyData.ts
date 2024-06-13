import { ICountry } from "./Country";
import { IIndustry, IIndustrySubcategory } from "./Industry";

export enum CompanyAccountType {
  Employeer = 'EMPLOYER',
  Agency = 'AGENCY',
};
export interface ICompanyResidency {
  company_residency_id: number;
  country_id: number;
  company_id: number;
  street_address: string;
  province: string;
  town: string;
  appartment: string;
  createdAt: string;
  updatedAt: string;
};

export interface ICompanyCard {
  card_number: string;
  card_type: string;
  company_card_id: string;
  company_id: string;
  createdAt: string;
  exp_month: string;
  exp_year: string;
  updatedAt: string;
};

export interface ICompanyData {
  CompanyCard: null | ICompanyCard;
  CompanyResidency: null | ICompanyResidency;
  Industry: IIndustry;
  IndustrySubcategory: IIndustrySubcategory;
  Country: ICountry;
  company_id: number;
  country_id: number;
  industry_id: number;
  industry_subcategory_id: number;
  firstname: string;
  lastname: string;
  phonenumber: string;
  company_phonenumber: null | string;
  email: string;
  company_email: null | string;
  name: string;
  provider: string;
  tax_id: string;
  account_type: CompanyAccountType;
  role: string;
  profile_image: null | string;
  profile_image_id: null | string;
  company_logo: null | string;
  company_logo_id: null | string;
  date_of_birth: null | string;
  phone_alpha_2: string;
  company_phone_alpha_2: null | string;
  phone_prefix: null | string;
  company_phone_prefix: null | string;
  nationality: null | string;
  gender: number;
  married: number;
  is_subscribed: number;
  is_verified: number;
  is_number_verified: number;
  is_email_verified: number;
  createdAt: string;
  updatedAt: string;
  description: null | string;
};
