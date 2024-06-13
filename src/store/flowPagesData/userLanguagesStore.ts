import { IUserLanguage } from "@/services/api/userLanguages.service";
import { atom } from "recoil";

export const UserLanguagesStore = atom<IUserLanguage[] | null>({
  default: null,
  key: 'userLanguages-store'
});

export const UserLanguageIdStore = atom<number | null>({
  default: null,
  key: 'userLanguageId-store'
});
