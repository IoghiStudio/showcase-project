import request from "../base.service";

export const getCountries = async () => await request.get('countries');
export const getDepartments = async () => await request.get('departments');
export const getIndustries = async () => await request.get('industry/subcategories');
export const getJobTitles = async () => await request.get('job_titles');
export const getLanguages = async () => await request.get('languages');
export const getCurrencies = async () => await request.get('currencies');
export const getDrivingLicense = async () => await request.get('licence/categories');
