import { atom } from 'recoil';

export enum CandidateHeaderMessages {
  Dashboard = '',
  Profie = 'User Profile',
  Positions = 'Job positions',
  Promotion = 'Promotion',
  Offers = 'Offers received',
  Messages = 'Messages',
  Account = 'Account settings',
  Billing = 'Billing & Invoices',
  Affiliate = 'Affiliate settings',
  Notification = 'Notification settings',
  Connection = 'Connection settings',
  Privacy = 'Privacy settings',
  Security = 'Security settings',
  Help = 'Help Desk',
  JobAnnouncements = 'Your Job Announcements',
  Applicants = 'Applicants',
  MyCompany = 'My Company',
  SearchWorkers = 'Search Workers',
  JobSearch = 'Jobs posted by companies',
  Favorites = 'Favorites',
};

//we should name it just HeaderMessages but we leave like this to not broke things

export const CandidateHeaderMessageStore = atom<CandidateHeaderMessages>({
  default: CandidateHeaderMessages.Dashboard,
  key: 'c-h-m-store'
});
