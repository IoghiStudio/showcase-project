import { ICurrency } from "@/types/Currency";
import request from "../base.service";
import { IJobTitle } from "@/types/JobTitle";

export interface IPositionFromFlow {
  job_title_id: number;
  currency_id: number;
  desired_salary: number;
  job_experience: number;
  type_of_employment: string;
  recurrency: string;
  minimum_contract: string;
  location_type: string;
  benefits: string[] | null;
}
;
export interface IPositionVideo {
  video: string;
};

export interface IPositionSkills {
  skills: string[];
};

export interface IPositionAbout {
  about: string;
};

export interface IPosition extends IPositionFromFlow {
  skills?: string[] | null;
  about?: string | null;
  video?: string | null;
};

export interface IFullPosition extends IPosition {
  Currency?: ICurrency;
  JobTitle?: IJobTitle;
  job_position_id?: number;
  candidate_id?: number;
  video_id?: string | null;
  views?: number;
  clicked?: number;
  offers?: number;
  saved?: number;
  promoted: boolean;
  favorite?: number;
  status?: string;
  createdAt?: string;
  updatedAt?: string
};

export interface IPositionStatus {
  status: string;
}

export const postPositionFromFlow = async (data: IPositionFromFlow) => await request.post('job-position', data);
export const updatePositionVideo = async (id: number, data: IPositionVideo) => await request.put(`job-position/video/${id}`, data);
export const updatePositionSkills = async (id: number, data: IPositionSkills) => await request.put(`job-position/skills/${id}`, data);
export const updatePositionAbout = async (id: number, data: IPositionAbout) => await request.put(`job-position/about/${id}`, data);

export const getLimitCountPositions = async () => await request.get(`/job-position/candidate/limit`);
export const getPositions = async () => await request.get(`job-position`);
export const getPosition = async (id: number) => await request.get(`job-position/${id}`);
export const postPosition = async (data: IPosition) => await request.post('job-position', data);
export const updatePosition = async (id: number, data: IPosition | IPositionFromFlow) => await request.put(`job-position/${id}`, data);
export const updatePositionStatus = async (id: number, data: IPositionStatus) => await request.put(`job-position/status/${id}`, data);
export const deletePosition = async (id: number) => await request.delete(`job-position/${id}`);
