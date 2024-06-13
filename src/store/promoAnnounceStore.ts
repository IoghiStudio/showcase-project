import { atom } from "recoil";
import { AnnounceStatus, IAnnounce } from "@/store/announceStore";
import { ICountry } from "@/types/Country";

export enum PromoJobStatus {
  Active = 'ACTIVE',
  Paused = 'PAUSED'
};

interface PromoJobCountry {
  Country: ICountry;
  country_id: number;
  createdAt: string;
  job_promotion_country_id: number;
  job_promotion_id: number;
  updatedAt: string;
};

export interface IPromoJob {
  Job: IAnnounce;
  company_id: number;
  company_payment_id: number;
  countries: PromoJobCountry[];
  createdAt: string;
  currency: string;
  duration: null | string
  expires_at: string;
  job_id: number;
  job_promotion_id: number;
  quantity: number;
  remaining_days: null | string;
  status: PromoJobStatus
  stripe_subscription_id: string;
  unit_price: number;
  updatedAt: string;
  worldwide: boolean;
};

export const PromotedAnnouncesStore = atom<IPromoJob[] | null>({
  default: null,
  key: 'promo-announces-store'
});

export const PromotedAnnounceStore = atom<IPromoJob | null>({
  default: null,
  key: 'promo-one-announces-store'
});

export const PromotedAnnouncesActiveStore = atom<number>({
  default: 0,
  key: 'promo-announce-active-store'
});

export const AnnounceToPromoteStore = atom<number | null>({
  default: null,
  key: 'announce-to-promote-store'
});

