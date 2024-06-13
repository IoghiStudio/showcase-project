import { PromoJobStatus } from "@/store/promoAnnounceStore";
import request from "../base.service";

export interface IPostPromoteJob {
  job_id: number;
  countryIds: number[]
  price_id: string;
  worldwide: number;
};

export interface IUpdatePromotedJob {
  job_promotion_id: number;
  countryIds: number[];
  worldwide: number;
};

export const postPromoteJob = async (data: IPostPromoteJob) => await request.post('checkout/job/promotion', data);
export const updatePromotedJob = async (data: IUpdatePromotedJob) => await request.put('promotion/job', data);
export const getPromotedJobs = async () => await request.get('promotions/jobs');
export const getOnePromotedJob = async (id: number) => await request.get(`promotion/job/${id}`);
export const deletePromotedJob = async (id: number) => await request.delete(`promotion/job/${id}`);
export const updatePromotedJobStatus = async (id: number, data: { status: PromoJobStatus}) => await request.put(`promotion/job/status/${id}`, data);
