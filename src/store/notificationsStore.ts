import { atom } from "recoil";


export interface INotification {
  candidate_id?: number;
  candidate_notification_id?: number;
  company_id?: number;
  company_notification_id?: number;
  createdAt: string;
  description: string;
  status: number;
  type: string;
  updatedAt: string;
};

export const NotificationsStore = atom<INotification[] | null>({
  default: [],
  key: 'notifications-store'
});
