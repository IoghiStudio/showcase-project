import { IEducation } from "@/services/api/education.service";
import { atom } from "recoil";

export const EducationsStore = atom<IEducation[] | null>({
  default: null,
  key: 'educations-store'
});

export const EducationIdStore = atom<number | null>({
  default: null,
  key: 'educationId-store'
});
