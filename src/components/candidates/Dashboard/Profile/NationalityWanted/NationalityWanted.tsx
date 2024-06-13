'use client';
import '../Data.scss';
import { IJob } from '@/store/jobStore';
import { useRecoilValue } from 'recoil';
import { JobDataStore } from '@/store/searchJobStore';
import { FlowDataContainer, FlowDataIcon } from '../FlowDataContainer/FlowDataContainer';
import { FlagIcon } from '@/components/utils/FlagIcon';

export const NationalityWanted = () => {
  const job: IJob | null = useRecoilValue<IJob | null>(JobDataStore);

  return (
    <FlowDataContainer
      icon={FlowDataIcon.Nationality}
      title='Nationality prefered'
      text='No restrictions from applying.'
      btnText='ddwfwfw'
      forCompany
    >
      <div className="data">
        <div className="data__item-container">
          {job?.jobCountries.length ? (
            <>
              {job?.jobCountries.map(c => (
                <div className="data__item">
                  <div className="data__item-flag">
                    <FlagIcon
                      code={c.alpha_2}
                    />
                  </div>

                  <div className="data__item-text">
                    {c.name}
                  </div>
                </div>
              ))}
            </>
          ) : (
            <div className="data__item">
              <div className="data__item-flag">
                <FlagIcon
                  size={24}
                  code={'globe'}
                />
              </div>

              <div className="data__item-text">
                Worldwide
              </div>
            </div>
          )}
        </div>
      </div>
    </FlowDataContainer>
  )
}
