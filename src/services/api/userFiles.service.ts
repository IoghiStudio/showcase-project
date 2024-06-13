import request from "../base.service";

export interface IUploadImageApi {
  base64string: string
};

export const updateCompanyUserImage = async (data: IUploadImageApi) => await request.post('company/flow/profile/picture', data);
export const updateCompanyLogo = async (data: IUploadImageApi) => await request.post('company/flow/logo', data);
export const updateUserImage = async (data: IUploadImageApi) => await request.post('candidate/flow/profile/picture', data);
export const getUserImage = async () => await request.get('candidate/flow/profile/picture');
