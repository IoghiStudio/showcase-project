import { ICountry } from "@/types/Country";
import request from "../base.service";
import { IFullPosition } from "./jobPosition.service";

export interface IPostPromotedPosition {
  job_position_id: number,
  countryIds: number[],
};

export interface IPromotedPosition {
  JobPosition: IFullPosition,
  candidate_id: number,
  createdAt: string,
  updatedAt: number,
  payment_id: number,
  quantity: number,
  status: string;
  unit_price: number;
  job_position_id: number;
  job_position_promotion_id: number;
  currency: string;
  duration: string;
  expires_at: any;
  countries: ICountryPromoted[];
};

export interface ICountryPromoted {
  Country: ICountry;
  country_id: number;
  createdAt: string;
  job_position_promotion_country_id: number;
  job_position_promotion_id: number;
  updatedAt: string;
};

export interface IPromotedPositionStatus {
  status: string;
};

export const getPromotedPositions = async () => await request.get('promotions/cv');
export const getOnePromotedPosition = async (id: number) => await request.get(`promotions/cv/${id}`);
export const postPromotedPosition = async (data: IPostPromotedPosition) => await request.post('checkout/cv/promotion', data);
export const updatePromotedPositionStatus = async (id: number, data: IPromotedPositionStatus) => await request.put(`promotion/position/status/${id}`, data);
export const deletePromotedPosition = async (id: number) => await request.delete(`promotion/cv/${id}`);
