import request from "../base.service";

export interface IChangeApplicantFavorite {
  favorite: number;
  applicant_id: number;
};

export interface IAcceptApplication {
  applicant_id: number;
};

export interface IRejectApplication extends IAcceptApplication {
  reason: string;
};

export const getApplicants = async () => await request.get('applicants');
export const getApplicantOne = async (id: number) => await request.get(`applicant/one/${id}`);
export const changeApplicantFavoriteStatus = async (data: IChangeApplicantFavorite) => await request.post('favorite/applicants', data);
export const applicantAccept = async (data: IAcceptApplication) => await request.post('applicant/accept', data);
export const applicantReject = async (data: IRejectApplication) => await request.post('applicant/reject', data);
