import request from "../base.service";

export interface IReportPosition {
  job_position_id: number;
  description: string;
};

export interface IReportJob {
  job_id: number;
  description: string;
};

export interface IReportOffer {
  job_offer_id: number;
  description: string;
};

export interface IReportApplicant {
  applicant_id: number;
  description: string;
};

export const reportPosition = async (data: IReportPosition) => await request.post('report/job_position', data);
export const reportJob = async (data: IReportJob) => await request.post('report/job', data);
export const reportOffer = async (data: IReportOffer) => await request.post('report/job_offer', data);
export const reportApplicant = async (data: IReportApplicant) => await request.post('report/applicant', data);
