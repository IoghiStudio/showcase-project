'use client';
import '../Data.scss';
import { useRecoilValue } from 'recoil';
import { FlowDataContainer, FlowDataIcon } from '../FlowDataContainer/FlowDataContainer';
import { OfferReceivedStore } from '@/store/offerReceived';
import { IOfferReceived } from '@/services/api/offers.service';
import { IJob } from '@/store/jobStore';
import { JobDataStore } from '@/store/searchJobStore';

interface Props {
  forViewJob?: boolean;
};

export const AboutJob: React.FC<Props> = ({
  forViewJob = false,
}) => {
  const offerReceived = useRecoilValue<IOfferReceived | null>(OfferReceivedStore);
  const job = useRecoilValue<IJob | null>(JobDataStore);

  return (
    <FlowDataContainer
      icon={FlowDataIcon.Experience}
      title='About the job'
      text='Description for the job'
      btnText='ddwfwfw'
      forCompany
    >
      <div className="data">
        <div className="data__item-container">
          <div className="data__item">
            <div className="data__text">
              {!forViewJob ? offerReceived?.description.split('\n').map((line, index) => <div key={index}>{line}</div>) : job?.description.split('\n').map((line, index) => <div key={index}>{line}</div>)}
            </div>
          </div>
        </div>
      </div>
    </FlowDataContainer>
  )
}
