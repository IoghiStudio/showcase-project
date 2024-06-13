import { IOfferReceived } from '@/services/api/offers.service';
import { atom } from 'recoil';

export const OfferReceivedStore = atom<IOfferReceived | null>({
  default: null,
  key: 'offer-received-store'
});
