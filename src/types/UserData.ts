import { ICountry } from "./Country";
import { IResidency } from "./Residency";

export interface IPaymentData {
  amount: number;
  candidate_id: number;
  createdAt: string;
  currency: string;
  duration: string;
  invoice_number: string;
  invoice_url: string;
  item_name: string;
  payment_id: number;
  status: string;
  stripe_id: string;
  stripe_product: string;
  type: string;
  updatedAt: string;
};

export interface ISubscriptionData {
  Payment: IPaymentData;
  candidate_id: number;
  createdAt: string;
  expires_at: number;
  job_position_limit: number;
  payment_id: number;
  product_id: string;
  status: string;
  stripe_subscription_id: string;
  subscription_id: number;
  updatedAt: string;
};

export interface ICandidateCard {
  candidate_card_id: number;
  candidate_id: number;
  card_number: string;
  card_type: string;
  createdAt: string;
  exp_month: string;
  exp_year: string;
  updatedAt: string;
};

export interface IUserData {
  CandidateCard: ICandidateCard;
  Subscription: ISubscriptionData;
  candidate_id: number;
  country_id: number;
  Country: ICountry;
  Residency: IResidency;
  date_of_birth: string | null;
  email: string;
  firstname: string;
  lastname: string;
  phonenumber: string | null;
  gender: string | null;
  is_email_verified: number;
  is_number_verified: number;
  married: number;
  is_subscribed: number,
  is_subscription_active: number,
  is_verified: number,
  nationality: string | null;
  phone_alpha_2: string | null;
  phone_prefix: string | null;
  profile_image: string | null;
  profile_image_id: string | null;
  provider?: string;
  createdAt?: string;
  updatedAt?: string;
};
