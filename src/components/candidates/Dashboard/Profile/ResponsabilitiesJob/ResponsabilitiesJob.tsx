'use client';
import '../Data.scss';
import { IJob } from '@/store/jobStore';
import { useRecoilValue } from 'recoil';
import { JobDataStore } from '@/store/searchJobStore';
import { FlowDataContainer, FlowDataIcon } from '../FlowDataContainer/FlowDataContainer';

interface Props {
  forViewJob?: boolean;
};

export const ResponsabilitiesJob: React.FC<Props> = ({
  forViewJob = false,
}) => {
  const job = useRecoilValue<IJob | null>(JobDataStore);

  return (
    <FlowDataContainer
      icon={FlowDataIcon.Experience}
      title='Job responsability'
      text='Your main responsabilities for the job'
      btnText='ddwfwfw'
      forCompany
    >
      <div className="data">
        <div className="data__item-container">
          <div className="data__item">
            <div className="data__text">
              {job?.responsabilities.split('\n').map((line, index) => <div key={index}> &bull; {line}</div>)}
            </div>
          </div>
        </div>
      </div>
    </FlowDataContainer>
  )
}
