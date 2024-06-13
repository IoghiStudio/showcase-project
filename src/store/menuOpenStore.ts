import { atom } from 'recoil';

export const MenuOpenStore = atom<boolean>({
  default: false,
  key: 'menu-open-store'
});

export const MenuPositionIdStore = atom<number>({
  default: 0,
  key: 'menu-position-id-store'
});

export const MenuPromotedPositionIdStore = atom<number>({
  default: 0,
  key: 'menu-promoted-position-id-store'
});

export const MenuWorkerIdStore = atom<number>({
  default: 0,
  key: 'menu-worker-id-store'
});

export const MenuOfferIdStore = atom<number>({
  default: 0,
  key: 'menu-offer-id-store'
});

export const MenuAnnounceIdStore = atom<number>({
  default: 0,
  key: 'menu-announce-id-store'
});

export const MenuPromoJobIdStore = atom<number>({
  default: 0,
  key: 'menu-promo-job-id-store'
});

export const MenuJobIdStore = atom<number>({
  default: 0,
  key: 'menu-job-id-store'
});

export const MenuApplicantIdStore = atom<number>({
  default: 0,
  key: 'menu-applicant-id-store'
});





