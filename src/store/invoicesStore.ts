import { atom } from 'recoil';

export interface IInvoice {
  amount: number;
  candidate_id: number;
  createdAt: string;
  currency: string;
  duration: string;
  invoice_number: string | null;
  invoice_url: string | null;
  item_name: string;
  payment_id: number;
  status: string;
  stripe_id: string;
  stripe_product: string;
  type: string;
  updatedAt: string;
};

export const InvoicesStore = atom<IInvoice[] | null>({
  default: null,
  key: 'invoices--store'
});
