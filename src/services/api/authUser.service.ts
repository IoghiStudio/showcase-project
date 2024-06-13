import request from "../base.service";
import { IRegisterCompany, IRegisterUser } from "@/types/Register";
import { ILogin } from "@/types/Login";
import { IInfoCheck } from "@/types/InfoCheck";

export interface ICompanyUserInfo {
  firstname: string;
  lastname: string;
  phonenumber: string;
  phone_alpha_2: string;
  phone_prefix: string;
};

export interface IUpdateCompanyInfo {
  country_id: number;
  industry_id: number,
  industry_subcategory_id: number,
  company_email: string;
  company_phonenumber: string;
  company_phone_alpha_2: string;
  company_phone_prefix: string;
  street_address: string;
  province: string;
  town: string;
  appartment: string;
};

export const registerUser = async (data: IRegisterUser) => await request.post('candidate/signup', data);
export const loginUser = async (data: ILogin) => await request.post('candidate/signin', data);
export const getUserData = async () => await request.get('candidate/one');
export const updateUserInfo = async (data: IInfoCheck) => await request.put('candidate/flow/update', data);

export const registerCompany = async (data: IRegisterCompany) => await request.post('company/signup', data);
export const loginCompany = async (data: ILogin) => await request.post('company/signin', data);
export const getCompanyData = async () => await request.get('company/one');
export const updateCompanyUserInfo = async (data: ICompanyUserInfo) => await request.put('company/flow/update/user', data);
export const updateCompanyInfo = async (data: IUpdateCompanyInfo) => await request.put('company/flow/update', data);
export const updateCompanyDescription = async (data: { description: string }) => await request.put('company/flow/description', data);
