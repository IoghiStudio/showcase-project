import { ILanguage } from "@/types/Language";
import request from "../base.service";
import { ICountry } from "@/types/Country";

export interface IUserLanguage {
  language_id: number;
  proficiency: string;
  user_language_id?: number;
  createdAt?: string
  updateAt?: string
  Language?: ILanguage;
  candidate_id?: number;
};

export interface IUserDriving {
  country_id: number,
  category: string,
  date_of_acquisition: string,
  driving_licence_id?: number,
  candidate_id?: number,
  createdAt?: string,
  updatedAt?: string,
  Country?: ICountry,
};

export const getUserDriving = async () => await request.get('candidate/flow/driving/licence');
export const getOneUserDriving = async (id: number) => await request.get(`candidate/flow/driving/licence/${id}`);
export const postUserDriving = async (userDriving: IUserDriving) => await request.post('candidate/flow/driving/licence', userDriving);
export const updateUserDriving = async (id: number, userDriving: IUserDriving) => await request.put(`candidate/flow/driving/licence/update/${id}`, userDriving);
export const deleteUserDriving = async (id: number) => await request.delete(`candidate/flow/driving/licence/delete/${id}`);
