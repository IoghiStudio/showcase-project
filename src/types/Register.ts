import { CompanyAccountType } from "./CompanyData";

export interface IRegisterUser {
  firstname: string,
  lastname: string,
  email: string,
  password: string,
  country_id: number,
  is_subscribed: number,
};

export interface IRegisterCompany {
  name: string;
  firstname: string;
  lastname: string;
  phonenumber: string;
  phone_alpha_2: string;
  phone_prefix: string;
  email: string;
  password: string;
  country_id: number;
  is_subscribed: number;
  industry_subcategory_id: number
  account_type: CompanyAccountType;
  tax_id: string;
}
