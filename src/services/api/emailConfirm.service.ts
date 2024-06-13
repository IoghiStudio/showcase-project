import request from "../base.service";

export interface ITokenData {
  token: string;
};

export const emailConfirm = async (tokenData: ITokenData) => await request.put('candidate/verify/email', tokenData);
export const emailConfirmCompany = async (tokenData: ITokenData) => await request.put('company/verify/email', tokenData);
