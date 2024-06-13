import { atom } from 'recoil';
import { IFullPosition } from '@/services/api/jobPosition.service';
import { IPromotedPosition } from '@/services/api/promotedPositions.service';

export const PromotedPositionsStore = atom<IPromotedPosition[] | null>({
  default: null,
  key: 'promoted-positions-store'
});

export const PromotedPositionIdStore = atom<number | null>({
  default: null,
  key: 'promoted-position-id-store'
});


export const PositionToPromoteStore = atom<IFullPosition | null>({
  default: null,
  key: 'position-to-promote-store'
});

