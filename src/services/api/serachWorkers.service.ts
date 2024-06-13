import request from "../base.service";
import { IJobTitle } from "@/types/JobTitle";
import { ICurrency } from "@/types/Currency";
import { ICountry } from "@/types/Country";
import { ICertification } from "./certifications.service";
import { IEducation } from "./education.service";
import { IExperience } from "./experience.service";
import { ICourse } from "./courses.service";
import { IUserDriving, IUserLanguage } from "./userDriving.service";
import { IResidency } from "@/types/Residency";

export interface ICandidateWorker {
  Residency: IResidency;
  Experiences: IExperience[];
  Education: IEducation[];
  Certifications: ICertification[];
  TrainingCourses: ICourse[];
  UserLanguages: IUserLanguage[];
  DrivingLicences: IUserDriving[];
  Country: ICountry;
  candidate_id: number;
  country_id: number;
  createdAt: string;
  date_of_birth: string;
  email: string;
  firstname: string;
  is_email_verified: number;
  is_number_verified: number;
  is_subscribed: number;
  is_subscription_active: number;
  lastname: string;
  married: string;
  nationality: null;
  phone_alpha_2: string;
  phone_prefix: string;
  phonenumber: string;
  profile_image: string;
  profile_image_id: string;
  role: string;
  updatedAt: string;
};

export enum SentJobOfferStatus {
  OfferSent = 'OFFER SENT',
  Accepted = 'ACCEPTED',
  Rejected = 'REJECTED',
};

export interface ISentOffer {
  reason: null | string;
  favorite: number;
  status: SentJobOfferStatus;
  job_offer_id: number;
  job_title_id: number;
  job_position_id: number;
  candidate_id: number;
  type_of_employment: string;
  minimum_contract: string;
  workplace_type: string;
  salary: number;
  recurrency: string;
  benefits: string[];
  due_date: string;
  job_experience: number;
  currency: string;
  description: string;
  company_id: number;
  updatedAt: string;
  createdAt: string;
  ChatToJobOffer: any;
};

export interface ISearchWorkers {
  JobOffer: null | ISentOffer,
  Candidate: ICandidateWorker;
  // ChatTo
  Country: ICountry;
  Currency: ICurrency;
  JobTitle: IJobTitle
  promoted: boolean;
  about: string;
  benefits: string[];
  blocked: any[];
  candidate_id: number;
  clicked: number;
  createdAt: string;
  currency_id: number;
  desired_salary: number;
  isExpired: boolean;
  Favorite: boolean;
  favorite: number;
  job_experience: number;
  job_position_id: number;
  job_title_id: number;
  location_type: string;
  minimum_contract: string;
  offers: number;
  recurrency: string;
  saved: number;
  status: string;
  skills: string[];
  type_of_employment: string;
  updatedAt: string;
  video: string;
  video_id: string;
  views: number;
};

export interface ISendOffer {
  job_title_id: number;
  job_position_id: number;
  candidate_id: number;
  type_of_employment: string;
  minimum_contract: string;
  workplace_type: string;
  salary: number;
  recurrency: string;
  benefits: string[],
  due_date: string;
  job_experience: number;
  currency: string;
  description: string;
};

export const searchWorkers = async (params?: string) => request.get(`search-workers/${params || ''}`);
export const searchOneWorker = async (candidateId: number, positionId: number) => request.get(`search-workers/one/?candidate_id=${candidateId}&job_position_id=${positionId}`);
export const updateWorkersToFavorite = async (data: {jobPositionId: number}) => request.post('favorite/job-position', data);
export const updateWorkersToUnfavorite = async (data: {jobPositionId: number}) => request.post('unfavorite/job-position', data);
export const generateWorkerCV = async (data: {jobPositionId: number, candidateId: number}) => request.post(`generate/cv`, data, { responseType: 'blob'});
export const sendOffer = async (data: ISendOffer) => request.post(`company/job-offer`, data);
