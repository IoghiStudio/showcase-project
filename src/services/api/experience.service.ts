import request from "../base.service";
import { ICountry } from "@/types/Country";
import { IJobTitle } from "@/types/JobTitle";
import { IDepartment } from "@/types/Department";
import { IIndustry, IIndustrySubcategory } from "@/types/Industry";

export interface IExperience {
  experience_id?: number,
  country_id: number,
  job_title_id: number,
  industry_subcategory_id: number,
  industry_id: number;
  department_id: number,
  candidate_id?: number,
  from_date: string,
  to_date?: string | null,
  job_type: string,
  company: string,
  description?: string | null,
  still_working: number,
  createdAt?: string,
  updatedAt?: string,
  Country?: ICountry,
  JobTitle?: IJobTitle,
  Department?: IDepartment,
  Industry?: IIndustry,
  IndustrySubcategory?: IIndustrySubcategory,
}

export const getExperience = async () => await request.get('candidate/flow/experience');
export const getOneExperience = async (id: number) => await request.get(`candidate/flow/experience/${id}`);
export const postExperience = async (experience: IExperience) => await request.post('candidate/flow/experience', experience);
export const updateExperience = async (id: number, experience: IExperience) => await request.put(`candidate/flow/experience/update/${id}`, experience);
export const deleteExperience = async (id: number) => await request.delete(`candidate/flow/experience/delete/${id}`);
