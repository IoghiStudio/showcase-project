import { ICountry } from "@/types/Country";
import request from "../base.service";

export interface IEducation {
  education_id?: number,
  country_id: number,
  candidate_id?: number,
  from_date: string,
  to_date?: string | null,
  state?: string | null,
  city?: string | null,
  profile: string,
  institution_name: string,
  degree: string,
  description?: string | null,
  in_progress: number,
  createdAt?: string,
  updatedAt?: string,
  Country?: ICountry
};

export const getEducations = async () => await request.get('candidate/flow/education');
export const getOneEducation = async (id: number) => await request.get(`candidate/flow/education/${id}`);
export const postEducation = async (education: IEducation) => await request.post('candidate/flow/education', education);
export const updateEducation = async (id: number,education: IEducation) => await request.put(`candidate/flow/education/update/${id}`, education);
export const deleteEducation = async (id: number) => await request.delete(`candidate/flow/education/delete/${id}`);
