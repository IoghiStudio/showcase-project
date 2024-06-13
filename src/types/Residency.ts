import { ICountry } from "./Country";

export interface IResidency {
  residency_id?: number;
  candidate_id?: number,
  country_id: number,
  street_address: string,
  province: string,
  town: string,
  appartment?: string | null,
  createdAt?: string,
  updatedAt?: string,
  Country?: ICountry
};
