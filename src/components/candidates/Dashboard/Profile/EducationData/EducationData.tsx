'use client';
import '../Data.scss';
import { useRecoilState, useRecoilValue, useSetRecoilState } from 'recoil';
import { useCallback, useEffect } from 'react';
import { AxiosResponse } from 'axios';
import { FlowDataContainer, FlowDataIcon } from '../FlowDataContainer/FlowDataContainer';
import { EducationIdStore, EducationsStore } from '@/store/flowPagesData/educationsStore';
import { IEducation, getEducations } from '@/services/api/education.service';
import { monthsArray } from '@/components/utils/utils';
import { FlagIcon } from '@/components/utils/FlagIcon';
import { useRouter } from 'next/navigation';
import { DataEditIcon } from '@/components/utils/DataEditIcon';
import { WorkerDataStore } from '@/store/searchWorkersStore';
import { ISearchWorkers } from '@/services/api/serachWorkers.service';
import { ApplicantOneStore, IApplicant } from '@/store/applicantsStore';

interface Props {
  forCompany?: boolean;
  forApplicant?: boolean;
};

export const EducationData: React.FC<Props> = ({ forCompany = false, forApplicant = false }) => {
  const [educations, setEducations] = useRecoilState(EducationsStore);
  const setEducationId = useSetRecoilState(EducationIdStore);
  const router = useRouter();
  const workerData = useRecoilValue<ISearchWorkers | null>(WorkerDataStore);
  const applicantData = useRecoilValue<IApplicant | null>(ApplicantOneStore);

  const fetchEducations = useCallback(async () => {
    try {
      const resp: AxiosResponse<any, any> = await getEducations();
      const data: IEducation[] = resp.data.data.data;
      data.sort(
        (a, b) =>
          new Date(b.from_date).getTime() - new Date(a.from_date).getTime()
      );
      setEducations(data);
    } catch (error) {}
  }, []);

  useEffect(() => {
    if (forCompany) {
      if (!workerData) router.push('/dashboard/search-workers/');
    } else if (forApplicant) {
      if (!applicantData) router.push('/dashboard/applicants/');
    }
    else {
      if (!educations) fetchEducations();
    }
  }, []);

  return (
    <FlowDataContainer
      icon={FlowDataIcon.Education}
      title='Your Education'
      text='Your main education'
      btnText='Add education'
      forCompany={forCompany || forApplicant}
    >
      {forCompany && (
        <div className="data">
          {workerData?.Candidate.Education?.map(edc => {
            const {
              education_id,
              Country,
              profile,
              degree,
              institution_name,
              description,
              from_date,
              to_date,
              in_progress
            } = edc;

            monthsArray;
            const startDate: Date = new Date(from_date);
            const startYear: number = startDate.getFullYear();

            //we might not have an end date
            let endDate: Date | null = null;
            let endYear;

            if (to_date) {
              endDate = new Date(to_date);
              endYear = endDate.getFullYear();
            }

            return (
              <div key={education_id} className="data__item-container">
                <div className="data__item">
                  <div className="data__item-content">
                    <div className="data__item-left">
                      <div className="data__flag">
                        <FlagIcon size={20} code={Country?.alpha_2 || ''}/>
                      </div>

                      <div className="data__info">
                        <div className="data__title">
                          {profile}
                        </div>

                        <div className="data__info-bottom">
                          <div className="data__text">
                            {institution_name}
                          </div>

                          <div className="data__text data__text--gray">
                            &#x2022; {Country?.name || ''}
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="data__item-right">
                      <div className="data__date">
                        <div className="data__date-name">
                          {degree}
                        </div>

                        <div className="data__date-text">
                          {`${startYear} - ${!in_progress ? endYear : 'Present'}`}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="data__desc data__desc--ml">
                  {description}
                </div>
              </div>
            )
          })}
        </div>
      )}

      {forApplicant && (
        <div className="data">
          {applicantData?.Candidate.Education?.map(edc => {
            const {
              education_id,
              Country,
              profile,
              degree,
              institution_name,
              description,
              from_date,
              to_date,
              in_progress
            } = edc;

            monthsArray;
            const startDate: Date = new Date(from_date);
            const startYear: number = startDate.getFullYear();

            //we might not have an end date
            let endDate: Date | null = null;
            let endYear;

            if (to_date) {
              endDate = new Date(to_date);
              endYear = endDate.getFullYear();
            }

            return (
              <div key={education_id} className="data__item-container">
                <div className="data__item">
                  <div className="data__item-content">
                    <div className="data__item-left">
                      <div className="data__flag">
                        <FlagIcon size={20} code={Country?.alpha_2 || ''}/>
                      </div>

                      <div className="data__info">
                        <div className="data__title">
                          {profile}
                        </div>

                        <div className="data__info-bottom">
                          <div className="data__text">
                            {institution_name}
                          </div>

                          <div className="data__text data__text--gray">
                            &#x2022; {Country?.name || ''}
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="data__item-right">
                      <div className="data__date">
                        <div className="data__date-name">
                          {degree}
                        </div>

                        <div className="data__date-text">
                          {`${startYear} - ${!in_progress ? endYear : 'Present'}`}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="data__desc data__desc--ml">
                  {description}
                </div>
              </div>
            )
          })}
        </div>
      )}

      {!forCompany && !forApplicant && (
        <div className="data">
          {educations?.map(edc => {
            const {
              education_id,
              Country,
              profile,
              degree,
              institution_name,
              description,
              from_date,
              to_date,
              in_progress
            } = edc;

            monthsArray;
            const startDate: Date = new Date(from_date);
            const startYear: number = startDate.getFullYear();

            //we might not have an end date
            let endDate: Date | null = null;
            let endYear;

            if (to_date) {
              endDate = new Date(to_date);
              endYear = endDate.getFullYear();
            }

            return (
              <div key={education_id} className="data__item-container">
                <div className="data__item">
                  <div className="data__item-content">
                    <div className="data__item-left">
                      <div className="data__flag">
                        <FlagIcon size={20} code={Country?.alpha_2 || ''}/>
                      </div>

                      <div className="data__info">
                        <div className="data__title">
                          {profile}
                        </div>

                        <div className="data__info-bottom">
                          <div className="data__text">
                            {institution_name}
                          </div>

                          <div className="data__text data__text--gray">
                            &#x2022; {Country?.name || ''}
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="data__item-right">
                      <div className="data__date">
                        <div className="data__date-name">
                          {degree}
                        </div>

                        <div className="data__date-text">
                          {`${startYear} - ${!in_progress ? endYear : 'Present'}`}
                        </div>
                      </div>
                    </div>
                  </div>

                  <div
                    className="data__options"
                    onClick={() => {
                      if (education_id) {
                        setEducationId(education_id);
                        router.push("/candidates/dashboard/profile/education-edit");
                      }
                    }}
                  >
                    <DataEditIcon />
                  </div>
                </div>

                <div className="data__desc data__desc--ml">
                  {description}
                </div>
              </div>
            )
          })}
        </div>
      )}
    </FlowDataContainer>
  )
}
