'use client';
import '../Data.scss';
import { useRecoilState, useRecoilValue, useSetRecoilState } from 'recoil';
import { useCallback, useEffect } from 'react';
import { AxiosResponse } from 'axios';
import { FlowDataContainer, FlowDataIcon } from '../FlowDataContainer/FlowDataContainer';
import { UserDrivingIdStore, UserDrivingStore } from '@/store/flowPagesData/userDrivingStore';
import { IUserDriving, getUserDriving } from '@/services/api/userDriving.service';
import { monthsArray } from '@/components/utils/utils';
import { MonthType } from '@/types/Month';
import { FlagIcon } from '@/components/utils/FlagIcon';
import { useRouter } from 'next/navigation';
import { DataEditIcon } from '@/components/utils/DataEditIcon';
import { ISearchWorkers } from '@/services/api/serachWorkers.service';
import { WorkerDataStore } from '@/store/searchWorkersStore';
import { ApplicantOneStore, IApplicant } from '@/store/applicantsStore';

interface Props {
  forCompany?: boolean;
  forApplicant?: boolean;
};

export const DrivingData: React.FC<Props> = ({ forCompany = false, forApplicant = false}) => {
  const [userDrivings, setUserDrivings] = useRecoilState(UserDrivingStore);
  const setUserDrivingId = useSetRecoilState(UserDrivingIdStore);
  const router = useRouter();
  const workerData = useRecoilValue<ISearchWorkers | null>(WorkerDataStore);
  const applicantData = useRecoilValue<IApplicant | null>(ApplicantOneStore);

  const fetchUserDrivings = useCallback(async () => {
    try {
      const resp: AxiosResponse<any, any> = await getUserDriving();
      const data: IUserDriving[] = resp.data.data.data;
      data.sort(
        (a, b) =>
          new Date(b.date_of_acquisition).getTime() - new Date(a.date_of_acquisition).getTime()
      );
      setUserDrivings(data);
    } catch (error) {}
  }, []);

  useEffect(() => {
    if (forCompany) {
      if (!workerData) router.push('/dashboard/search-workers/');
    } else if (forApplicant) {
      if (!applicantData) router.push('/dashboard/applicants/');
    } else {
      if (!userDrivings) fetchUserDrivings();
    }
  }, []);

  return (
    <FlowDataContainer
      icon={FlowDataIcon.Driving}
      title='Driving Licenses'
      text='Your valid driving licenses'
      btnText='Add permit'
      forCompany={forCompany || forApplicant}
    >

      {forApplicant && (
        <div className="data">
          {applicantData?.Candidate.DrivingLicences?.map(drv => {
            const {
              driving_licence_id,
              Country,
              date_of_acquisition,
              category,
            } = drv;

            monthsArray;
            const dateOptained: Date = new Date(date_of_acquisition);
            const year: number = dateOptained.getFullYear();
            const month: MonthType | undefined = monthsArray.find(
              (month) => +month.id === dateOptained.getMonth()
            );

            return (
              <div key={driving_licence_id} className="data__item-container">
                <div className="data__item">
                  <div className="data__item-content">
                    <div className="data__item-left">
                      <div className="data__flag">
                        <FlagIcon size={20} code={Country?.alpha_2 || ''}/>
                      </div>

                      <div className="data__info">
                        <div className="data__title">
                          {category}
                        </div>

                        <div className="data__info-bottom">
                          <div className="data__text data__text--gray">
                            {Country?.name || ''}
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="data__item-right">
                      <div className="data__date">
                        <div className="data__date-name">
                          Date Aquired
                        </div>

                        <div className="data__date-text">
                          {month?.name.slice(0, 3)} {year}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="data__desc data__desc--ml">
                  {''}
                </div>
              </div>
            )
          })}
        </div>
      )}

      {forCompany && (
        <div className="data">
          {workerData?.Candidate.DrivingLicences?.map(drv => {
            const {
              driving_licence_id,
              Country,
              date_of_acquisition,
              category,
            } = drv;

            monthsArray;
            const dateOptained: Date = new Date(date_of_acquisition);
            const year: number = dateOptained.getFullYear();
            const month: MonthType | undefined = monthsArray.find(
              (month) => +month.id === dateOptained.getMonth()
            );

            return (
              <div key={driving_licence_id} className="data__item-container">
                <div className="data__item">
                  <div className="data__item-content">
                    <div className="data__item-left">
                      <div className="data__flag">
                        <FlagIcon size={20} code={Country?.alpha_2 || ''}/>
                      </div>

                      <div className="data__info">
                        <div className="data__title">
                          {category}
                        </div>

                        <div className="data__info-bottom">
                          <div className="data__text data__text--gray">
                            {Country?.name || ''}
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="data__item-right">
                      <div className="data__date">
                        <div className="data__date-name">
                          Date Aquired
                        </div>

                        <div className="data__date-text">
                          {month?.name.slice(0, 3)} {year}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="data__desc data__desc--ml">
                  {''}
                </div>
              </div>
            )
          })}
        </div>
      )}

      {!forCompany && !forApplicant && (
        <div className="data">
          {userDrivings?.map(drv => {
            const {
              driving_licence_id,
              Country,
              date_of_acquisition,
              category,
            } = drv;

            monthsArray;
            const dateOptained: Date = new Date(date_of_acquisition);
            const year: number = dateOptained.getFullYear();
            const month: MonthType | undefined = monthsArray.find(
              (month) => +month.id === dateOptained.getMonth()
            );

            return (
              <div key={driving_licence_id} className="data__item-container">
                <div className="data__item">
                  <div className="data__item-content">
                    <div className="data__item-left">
                      <div className="data__flag">
                        <FlagIcon size={20} code={Country?.alpha_2 || ''}/>
                      </div>

                      <div className="data__info">
                        <div className="data__title">
                          {category}
                        </div>

                        <div className="data__info-bottom">
                          <div className="data__text data__text--gray">
                            {Country?.name || ''}
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="data__item-right">
                      <div className="data__date">
                        <div className="data__date-name">
                          Date Aquired
                        </div>

                        <div className="data__date-text">
                          {month?.name.slice(0, 3)} {year}
                        </div>
                      </div>
                    </div>
                  </div>

                  <div
                    className="data__options"
                    onClick={() => {
                      if (driving_licence_id) {
                        setUserDrivingId(driving_licence_id);
                        router.push("/candidates/dashboard/profile/driving-license-edit");
                      }
                    }}
                  >
                    <DataEditIcon />
                  </div>
                </div>

                <div className="data__desc data__desc--ml">
                  {''}
                </div>
              </div>
            )
          })}
        </div>
      )}
    </FlowDataContainer>
  )
}
