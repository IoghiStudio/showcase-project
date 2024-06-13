import request from "../base.service";

export interface IVerifyEmail {
  email: string;
};

export interface IResetPassword {
  password: string,
  token: string;
};

export const verifyEmailResetPassword = async (email: IVerifyEmail) => await request.post('candidate/password/reset', email);
export const verifyCompanyEmailResetPassword = async (email: IVerifyEmail) => await request.post('company/password/reset', email);
export const resetPassword = async (resetPassword: IResetPassword) => await request.put('candidate/password/update', resetPassword);
export const resetCompanyPassword = async (resetPassword: IResetPassword) => await request.put('company/password/update', resetPassword);
