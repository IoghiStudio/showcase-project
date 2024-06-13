import { IFullPosition } from "@/services/api/jobPosition.service";
import { atom } from "recoil";

export interface IJobPositionLimitCreated {
  limit: number;
  created: number;
  active_job_position: number;
};

export const JobPositionsStore = atom<IFullPosition[] | null>({
  default: null,
  key: 'jobPositions-store'
});

export const JobPositionIdStore = atom<number | null>({
  default: null,
  key: 'jobPositioId-store'
});

export const JobPositionsLimitCreatedStore = atom<IJobPositionLimitCreated | null>({
  default: null,
  key: 'jobPositioLimit-store'
});

