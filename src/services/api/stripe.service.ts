import request from "../base.service";

export interface IGenerateSubscription {
  priceId : string;
};

export enum InvoiceQueries {
  '30Days' = 'Last 30 days',
  '90Days' = 'Last 90 days',
  '6Months' = 'Last 6 months',
  'YearToDate' = 'Year to date',
  'LastYear' = 'Last year'
};

export const generateSubscriptionPage = async (data: IGenerateSubscription) => await request.post('checkout', data);
export const getInvoices = async (query: InvoiceQueries) => await request.get(`payment/candidate/?order=${query}`);
export const getInvoicesCompanies = async (query: InvoiceQueries) => await request.get(`payment/company/?order=${query}`);
