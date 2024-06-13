import { ICompanyData } from "@/types/CompanyData";
import request from "../base.service";
import { IJob, JobApplyStatus } from "@/store/jobStore";
import { SentJobOfferStatus } from "./serachWorkers.service";

export interface IEmployer extends ICompanyData {
  Jobs: IJob[]
};

export interface IViewEmployer {
  employer: IEmployer,
  status: JobApplyStatus | SentJobOfferStatus | null,
};

export const viewEmployer = (id: number) => request.get(`/company/one/${id}`)
