import { AnnounceStatus } from "@/store/announceStore";
import request from "../base.service";

export interface IRequiredLanguage {
  language_id: number;
  proficiency: string;
};

export interface IRequiredLicence {
  category: string;
  driving_experience: number;
};

export interface IPostAnnounce {
  job_title_id: number;
  country_id: number;
  custom_name: string;
  industry_subcategory_id: number;
  department_id: number;
  workplace_type: string;
  currency: string;
  languages?: IRequiredLanguage[],
  drivingPermit?: IRequiredLicence[],
  type_of_employment: string;
  salary: string;
  description: string;
  recurrency: string;
  responsabilities: string;
  benefits: string[],
  contract_duration?: string;
  contract_duration_period?: string;
  skills?: string[],
  experience?: number;
  due_date?: string;
  city?: string;
  type?: string;
  opening_positions: number;
  jobCountry: number[];
};

export const getAnnounces = async (params: string) => await request.get(`company/job${params}`);
export const postAnnounce = async (data: IPostAnnounce) => await request.post('company/job', data);
export const updateAnnounce = async (id: number, data: IPostAnnounce) => await request.put(`job/${id}`, data);
export const getOneAnnounce = async (id: number) => await request.get(`job/${id}`);
export const deleteAnnounce = async (id: number) => await request.delete(`job/${id}`);
export const updateAnnounceStatus = async (id: number, status: AnnounceStatus) => await request.put(`job/one/status/?job_id=${id}&status=${status}`);

export interface IApplyJob {
  jobId: number;
};

export interface IMakeJobFavorite {
  job_id: number;
};

export const getJobs = async (params: string) => await request.get(`job/${params || ''}`);
export const getFavoriteJobs = async (params?: string) => await request.get(`favorite/job/${params || ''}`);
export const applyJob = async (data: IApplyJob) => await request.post('applicant', data );
export const makeJobFavorite = async (data: IMakeJobFavorite) => await request.post('favorite/job', data);
export const makeJobUnfavorite = async (data: IMakeJobFavorite) => await request.post('unfavorite/job', data);
export const getOneJob = async (id: number) => await request.get(`candidate/job/${id}`);
