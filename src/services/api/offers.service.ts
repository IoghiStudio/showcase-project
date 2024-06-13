import request from "../base.service";
import { IJobTitle } from "@/types/JobTitle";
import { IFullPosition } from "./jobPosition.service";
import { SentJobOfferStatus } from "./serachWorkers.service";
import { ICompanyData } from "@/types/CompanyData";

export interface IOfferReceived {
  job_offer_id: number;
  type_of_employment: string;
  minimum_contract: string;
  workplace_type: string;
  salary: number
  currency: string;
  recurrency: string;
  benefits: string[];
  job_experience: number;
  status: SentJobOfferStatus;
  favorite: number;
  due_date: string;
  description: string;
  createdAt: string;
  updatedAt: string;
  JobTitle: IJobTitle;
  JobPosition: IFullPosition;
  Company: ICompanyData;
  isExpired: boolean;
  accepted_rejected_on: null | string;
  ChatToJobOffer: any;
};

export interface IChangeOfferFavoriteStatus {
  job_offer_id: number;
  favorite: number;
};

export interface IRejectOffer {
  reason: string;
};

export const rejectOffer = async (offerId: number, data: IRejectOffer) => await request.post(`job-offer/reject/${offerId}`, data);
export const acceptOffer = async (offerId: number) => await request.post(`job-offer/accept/${offerId}`);
export const getOffersReceived = async (params?: string) => await request.get(`candidate/job-offer/${params}`);
export const getOfferReceived = async (id: number) => await request.get(`candidate/job-offer/one/${id}`);
export const changeOfferFavoriteStatus = async (data: IChangeOfferFavoriteStatus) => await request.post('job-offer/favorite', data);
