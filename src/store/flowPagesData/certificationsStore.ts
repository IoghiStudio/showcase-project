import { ICertification } from "@/services/api/certifications.service";
import { atom } from "recoil";


export const CertificationsStore = atom<ICertification[] | null>({
  default: null,
  key: 'certifications-store'
});

export const CertificationIdStore = atom<number | null>({
  default: null,
  key: 'certificationId-store'
});
