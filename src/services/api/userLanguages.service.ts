import { ILanguage } from "@/types/Language";
import request from "../base.service";

export interface IUserLanguage {
  language_id: number;
  proficiency: string;
  user_language_id?: number;
  createdAt?: string
  updateAt?: string
  Language?: ILanguage;
  candidate_id?: number;
};

export const getUserLanguages = async () => await request.get('candidate/flow/user/language');
export const getOneUserLanguage = async (id: number) => await request.get(`candidate/flow/user/language/${id}`);
export const postUserLanguage = async (userLanguage: IUserLanguage) => await request.post('candidate/flow/user/language', userLanguage);
export const updateUserLanguage = async (id: number, userLanguage: IUserLanguage) => await request.put(`candidate/flow/user/language/update/${id}`, userLanguage);
export const deleteUserLanguage = async (id: number) => await request.delete(`candidate/flow/user/language/delete/${id}`);
