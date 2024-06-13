import { atom } from "recoil";
import { IAnnounce } from "./announceStore";
import { ICompanyData } from "@/types/CompanyData";
import { IFullPosition } from "@/services/api/jobPosition.service";

export enum JobApplyStatus {
  Applied = 'APPLIED',
  Accepted = 'ACCEPTED',
  Rejected = 'REJECTED',
};

export interface IJobApplicant {
  ChatToApplicant: any;
  status: JobApplyStatus;
  JobPosition: IFullPosition;
  accepted_rejected_on: null | string;
  applicant_id: number;
  candidate_id: number;
  company_id: number;
  createdAt: string;
  favorite: number;
  job_id: number;
  job_position_id: number;
  reason: null | string;
  updatedAt: string;
  visible: number;
};

export interface IJob extends IAnnounce {
  Applicant: null | IJobApplicant;
  Company: ICompanyData;
  favorite: boolean;
  promoted: boolean;
  is_elligible_to_apply: boolean;
};

export const JobsStore = atom<IJob[] | null>({
  default: null,
  key: 'jobs-store'
});

export const JobOneStore = atom<IJob | null>({
  default: null,
  key: 'job-one-store'
});
