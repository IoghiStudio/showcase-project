import request from "../base.service";

export const getCandidateNotifications = async (params: string) => await request.get(`notification/candidate/${params}`);
export const getOneCandidateNotification = async (id: string) => await request.get(`notification/candidate/one/${id}`);
export const deleteOneCandidateNotification = async (id: string) => await request.delete(`notification/candidate/${id}`);

export const getCompanyNotifications = async (params: string) => await request.get(`notification/company/${params}`);
export const getOneCompanyNotification = async (id: string) => await request.get(`notification/company/one/${id}`);
export const deleteOneCompanyNotification = async (id: string) => await request.delete(`notification/company/${id}`);


