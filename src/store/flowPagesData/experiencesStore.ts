import { IExperience } from "@/services/api/experience.service";
import { atom } from "recoil";

export const ExperiencesStore = atom<IExperience[] | null>({
  default: null,
  key: 'experiences-store'
});

export const ExperienceIdStore = atom<number | null>({
  default: null,
  key: 'experienceId-store'
});
