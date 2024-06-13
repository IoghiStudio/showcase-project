'use client';
import '../Data.scss';
import { useRecoilState, useRecoilValue, useSetRecoilState } from 'recoil';
import { useCallback, useEffect, useState } from 'react';
import { AxiosResponse } from 'axios';
import { FlowDataContainer, FlowDataIcon } from '../FlowDataContainer/FlowDataContainer';
import { IExperience, getExperience } from '@/services/api/experience.service';
import { ExperienceIdStore, ExperiencesStore } from '@/store/flowPagesData/experiencesStore';
import { FlagIcon } from '@/components/utils/FlagIcon';
import { monthsArray } from '@/components/utils/utils';
import { MonthType } from '@/types/Month';
import { useRouter } from 'next/navigation';
import { DataEditIcon } from '@/components/utils/DataEditIcon';
import { ISearchWorkers } from '@/services/api/serachWorkers.service';
import { WorkerDataStore } from '@/store/searchWorkersStore';
import { ApplicantOneStore, IApplicant } from '@/store/applicantsStore';

interface Props {
  forCompany?: boolean;
  forApplicant?: boolean;
};

export const ExperienceData: React.FC<Props> = ({ forCompany = false, forApplicant = false }) => {
  const setExperienceId = useSetRecoilState(ExperienceIdStore);
  const [experiences, setExperiences] = useRecoilState(ExperiencesStore);
  const router = useRouter();
  const workerData = useRecoilValue<ISearchWorkers | null>(WorkerDataStore);
  const applicantData = useRecoilValue<IApplicant | null>(ApplicantOneStore);

  const fetchExperiences = useCallback(async () => {
    try {
      const resp: AxiosResponse<any, any> = await getExperience();
      const data: IExperience[] = resp.data.data.data;
      data.sort(
        (a, b) =>
          new Date(b.from_date).getTime() - new Date(a.from_date).getTime()
      );
      setExperiences(data);
    } catch (error) {}
  }, []);

  useEffect(() => {
    if (forCompany) {
      if (!workerData) router.push('/dashboard/search-workers/');
    } else if (forApplicant) {
      if (!applicantData) router.push('/dashboard/applicants/');
    } else {
      if (!experiences) fetchExperiences();
    }
  }, []);

  return (
      <FlowDataContainer
        icon={FlowDataIcon.Experience}
        title='Job experience'
        text='Your work history'
        btnText='Add experience'
        forCompany={forCompany || forApplicant}
      >
        {forCompany && (
          <div className="data">
            {workerData?.Candidate.Experiences?.map(exp => {
              const {
                experience_id,
                JobTitle,
                Country,
                company,
                job_type,
                description,
                from_date,
                to_date,
                still_working
              } = exp;

              monthsArray;
              const startDate: Date = new Date(from_date);
              const startMonth: MonthType | undefined = monthsArray.find(
                (month) => +month.id === startDate.getMonth()
              );
              const startYear: number = startDate.getFullYear();

              //we might not have an end date
              let endDate: Date | null = null;
              let endMonth: MonthType | undefined;
              let endYear;

              if (to_date) {
                endDate = new Date(to_date);
                endMonth = monthsArray.find(
                  (month) => +month.id === endDate?.getMonth()
                );
                endYear = endDate.getFullYear();
              }

              return (
                <div key={experience_id} className="data__item-container">
                  <div className="data__item">
                    <div className="data__item-content">
                      <div className="data__item-left">
                        <div className="data__flag">
                          <FlagIcon size={20} code={Country?.alpha_2 || ''}/>
                        </div>

                        <div className="data__info">
                          <div className="data__title">
                            {JobTitle?.name || ''}
                          </div>

                          <div className="data__info-bottom">
                            <div className="data__text">
                              {company}
                            </div>

                            <div className="data__text data__text--gray">
                              &#x2022; {job_type}
                            </div>
                          </div>
                        </div>
                      </div>

                      <div className="data__item-right">
                        <div className="data__date data__date--start">
                          <div className="data__date-name">
                            Start Date
                          </div>

                          <div className="data__date-text">
                            {startMonth?.name.slice(0, 3)} {startYear}
                          </div>
                        </div>

                        <div className="data__date data__date--end">
                          <div className="data__date-name">
                            End Date
                          </div>

                          {still_working ? (
                            <div className="data__date-text">
                              Present
                            </div>
                          ) : (
                            <div className="data__date-text">
                              {endMonth?.name.slice(0, 3)} {endYear}
                            </div>
                          )}
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
            {applicantData?.Candidate.Experiences?.map(exp => {
              const {
                experience_id,
                JobTitle,
                Country,
                company,
                job_type,
                description,
                from_date,
                to_date,
                still_working
              } = exp;

              monthsArray;
              const startDate: Date = new Date(from_date);
              const startMonth: MonthType | undefined = monthsArray.find(
                (month) => +month.id === startDate.getMonth()
              );
              const startYear: number = startDate.getFullYear();

              //we might not have an end date
              let endDate: Date | null = null;
              let endMonth: MonthType | undefined;
              let endYear;

              if (to_date) {
                endDate = new Date(to_date);
                endMonth = monthsArray.find(
                  (month) => +month.id === endDate?.getMonth()
                );
                endYear = endDate.getFullYear();
              }

              return (
                <div key={experience_id} className="data__item-container">
                  <div className="data__item">
                    <div className="data__item-content">
                      <div className="data__item-left">
                        <div className="data__flag">
                          <FlagIcon size={20} code={Country?.alpha_2 || ''}/>
                        </div>

                        <div className="data__info">
                          <div className="data__title">
                            {JobTitle?.name || ''}
                          </div>

                          <div className="data__info-bottom">
                            <div className="data__text">
                              {company}
                            </div>

                            <div className="data__text data__text--gray">
                              &#x2022; {job_type}
                            </div>
                          </div>
                        </div>
                      </div>

                      <div className="data__item-right">
                        <div className="data__date data__date--start">
                          <div className="data__date-name">
                            Start Date
                          </div>

                          <div className="data__date-text">
                            {startMonth?.name.slice(0, 3)} {startYear}
                          </div>
                        </div>

                        <div className="data__date data__date--end">
                          <div className="data__date-name">
                            End Date
                          </div>

                          {still_working ? (
                            <div className="data__date-text">
                              Present
                            </div>
                          ) : (
                            <div className="data__date-text">
                              {endMonth?.name.slice(0, 3)} {endYear}
                            </div>
                          )}
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
            {experiences?.map(exp => {
              const {
                experience_id,
                JobTitle,
                Country,
                company,
                job_type,
                description,
                from_date,
                to_date,
                still_working
              } = exp;

              monthsArray;
              const startDate: Date = new Date(from_date);
              const startMonth: MonthType | undefined = monthsArray.find(
                (month) => +month.id === startDate.getMonth()
              );
              const startYear: number = startDate.getFullYear();

              //we might not have an end date
              let endDate: Date | null = null;
              let endMonth: MonthType | undefined;
              let endYear;

              if (to_date) {
                endDate = new Date(to_date);
                endMonth = monthsArray.find(
                  (month) => +month.id === endDate?.getMonth()
                );
                endYear = endDate.getFullYear();
              }

              return (
                <div key={experience_id} className="data__item-container">
                  <div className="data__item">
                    <div className="data__item-content">
                      <div className="data__item-left">
                        <div className="data__flag">
                          <FlagIcon size={20} code={Country?.alpha_2 || ''}/>
                        </div>

                        <div className="data__info">
                          <div className="data__title">
                            {JobTitle?.name || ''}
                          </div>

                          <div className="data__info-bottom">
                            <div className="data__text">
                              {company}
                            </div>

                            <div className="data__text data__text--gray">
                              &#x2022; {job_type}
                            </div>
                          </div>
                        </div>
                      </div>

                      <div className="data__item-right">
                        <div className="data__date data__date--start">
                          <div className="data__date-name">
                            Start Date
                          </div>

                          <div className="data__date-text">
                            {startMonth?.name.slice(0, 3)} {startYear}
                          </div>
                        </div>

                        <div className="data__date data__date--end">
                          <div className="data__date-name">
                            End Date
                          </div>

                          {still_working ? (
                            <div className="data__date-text">
                              Present
                            </div>
                          ) : (
                            <div className="data__date-text">
                              {endMonth?.name.slice(0, 3)} {endYear}
                            </div>
                          )}
                        </div>
                      </div>
                    </div>

                    <div
                      className="data__options"
                      onClick={() => {
                        if (experience_id) {
                          setExperienceId(experience_id);
                          router.push("/candidates/dashboard/profile/experience-edit/");
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
