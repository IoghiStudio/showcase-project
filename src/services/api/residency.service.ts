import { IResidency } from "@/types/Residency";
import request from "../base.service";

export const getResidency = async () => await request.get('candidate/flow/residency');
export const postResidency = async (data: IResidency) => await request.post('candidate/flow/residency', data);
export const updateResidency = async (data: IResidency) => await request.put('candidate/flow/residency', data);
