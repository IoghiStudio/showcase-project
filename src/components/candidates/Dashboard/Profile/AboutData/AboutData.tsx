'use client';
import '../Data.scss';
import { useRecoilValue } from 'recoil';
import { FlowDataContainer, FlowDataIcon } from '../FlowDataContainer/FlowDataContainer';
import { ISearchWorkers } from '@/services/api/serachWorkers.service';
import { WorkerDataStore } from '@/store/searchWorkersStore';
import { ApplicantOneStore, IApplicant } from '@/store/applicantsStore';
import React from 'react';

interface Props {
  forApplicant?: boolean;
};

export const AboutData: React.FC<Props> = ({ forApplicant=false }) => {
  const workerData = useRecoilValue<ISearchWorkers | null>(WorkerDataStore);
  const applicantData = useRecoilValue<IApplicant | null>(ApplicantOneStore);

  return (
    <FlowDataContainer
      icon={FlowDataIcon.About}
      title='About me'
      text='Description for the job'
      btnText='ddwfwfw'
      forCompany
    >
      <div className="data">
        <div className="data__item-container">
          <div className="data__item">
            {!forApplicant ? (
              <div className="data__text">
                {workerData?.about.split('\n').map((line, index) => <div key={index}>{line}</div>)}
              </div>
            ) : (
              <div className="data__text">
                {applicantData?.JobPosition.about?.split('\n').map((line, index) => <div key={index}>{line}</div>)}
              </div>
            )}
          </div>
        </div>
      </div>
    </FlowDataContainer>
  )
}
