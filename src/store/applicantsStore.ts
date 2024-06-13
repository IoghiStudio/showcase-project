import { atom } from 'recoil';
import { IJob, JobApplyStatus } from './jobStore';
import { IUserData } from '@/types/UserData';
import { IFullPosition } from '@/services/api/jobPosition.service';
import { ICertification } from '@/services/api/certifications.service';
import { ICourse } from '@/services/api/courses.service';
import { IUserDriving, IUserLanguage } from '@/services/api/userDriving.service';
import { IEducation } from '@/services/api/education.service';
import { IExperience } from '@/services/api/experience.service';

export interface ICandidateWithFlowData extends IUserData {
  Certifications: ICertification[];
  TrainingCourses: ICourse[];
  UserLanguages: IUserLanguage[];
  DrivingLicences: IUserDriving[];
  Education: IEducation[];
  Experiences: IExperience[];
};

export interface IApplicant {
  applicant_id: number;
  status: JobApplyStatus;
  favorite: number;
  Candidate: ICandidateWithFlowData;
  ChatToApplicant: null | any;
  Job: IJob;
  JobPosition: IFullPosition;
  accepted_rejected_on: null | string;
  candidate_id: number;
  company_id: string;
  createdAt: string;
  job_id: number;
  job_position_id: number;
  reason: null | string;
  updatedAt: string;
  visible: number;
};

export const ApplicantOneStore = atom<IApplicant | null>({
  default: null,
  key: 'applicant-one-store'
});

