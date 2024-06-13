import request from "../base.service";

export interface IContactUs {
  firstname: string;
  lastname: string;
  email: string;
  message: string;
};

export const contactUs = async (data: IContactUs) => await request.post('contact-us', data);
