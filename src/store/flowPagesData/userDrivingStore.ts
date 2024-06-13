import { IUserDriving } from "@/services/api/userDriving.service";
import { atom } from "recoil";

export const UserDrivingStore = atom<IUserDriving[] | null>({
  default: null,
  key: 'userDriving-store'
});

export const UserDrivingIdStore = atom<number| null>({
  default: null,
  key: 'userDrivingId-store'
});
