import request from "../base.service";

export const deactivateAccountCadidate = async () => await request.get('settings/candidate/send/deactivate');
export const deleteAccountCadidate = async () => await request.get('settings/candidate/send/delete');
export const deactivateAccountCompany = async () => await request.get('settings/company/send/deactivate');
export const deleteAccountCompany = async () => await request.get('settings/company/send/delete');
