import request from "../base.service";

export const getFavoriteApplicants = async (params: string) => await request.get(`favorite/applicants/${params}`);
export const getFavoriteWorkers = async (params: string) => await request.get(`favorite/candidates/${params}`);
