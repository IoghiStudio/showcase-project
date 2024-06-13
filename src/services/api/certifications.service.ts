import { ICountry } from "@/types/Country";
import request from "../base.service";

export interface ICertification {
  certification_id?: number,
  country_id: number,
  candidate_id?: number,
  title: string,
  issued_date: string,
  institution: string,
  visible?: number,
  description?: string | null,
  createdAt?: string,
  updatedAt?: string,
  Country?: ICountry,
};

export const getCertifications = async () => await request.get('candidate/flow/certification');
export const getOneCertification = async (id: number) => await request.get(`candidate/flow/certification/${id}`);
export const postCertification = async (certification: ICertification) => await request.post('candidate/flow/certification', certification);
export const updateCertification = async (id: number, certification: ICertification) => await request.put(`candidate/flow/certification/update/${id}`, certification);
export const deleteCertification = async (id: number) => await request.delete(`candidate/flow/certification/delete/${id}`);
