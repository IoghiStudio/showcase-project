'use client';
import '../Data.scss';
import { useRecoilValue } from 'recoil';
import { FlowDataContainer, FlowDataIcon } from '../FlowDataContainer/FlowDataContainer';
import { ISearchWorkers } from '@/services/api/serachWorkers.service';
import { WorkerDataStore } from '@/store/searchWorkersStore';
import { ApplicantOneStore, IApplicant } from '@/store/applicantsStore';
import { IJob } from '@/store/jobStore';
import { JobDataStore } from '@/store/searchJobStore';
import { useEffect, useState } from 'react';
interface Props {
  forApplicant?: boolean;
};

export const SkillsData: React.FC<Props> = ({ forApplicant=false}) => {
  const workerData = useRecoilValue<ISearchWorkers | null>(WorkerDataStore);
  const applicantData = useRecoilValue<IApplicant | null>(ApplicantOneStore);
  const [ourSkills, setOurSkills] = useState<string[]>([]);

  useEffect(() => {
    if (workerData) setOurSkills(workerData.skills);
    if (applicantData) setOurSkills(applicantData.JobPosition.skills || []);
  }, []);

  return (
    <FlowDataContainer
      icon={FlowDataIcon.Skills}
      title='My Skills'
      text='Related o this job position'
      btnText='ddwfwfw'
      forCompany
    >
      <div className="data">
        {ourSkills.map(skill => (
          <div className="data__item-container">
            <div className="data__item">
              <div className="data__text">
                {skill}
              </div>
            </div>
          </div>
        ))}
      </div>
    </FlowDataContainer>
  )
}
