'use client';
import '../Data.scss';
import classNames from 'classnames';
import { useRecoilState, useRecoilValue, useSetRecoilState } from 'recoil';
import { useCallback, useEffect } from 'react';
import { AxiosResponse } from 'axios';
import { FlowDataContainer, FlowDataIcon } from '../FlowDataContainer/FlowDataContainer';
import { UserLanguageIdStore, UserLanguagesStore } from '@/store/flowPagesData/userLanguagesStore';
import { IUserLanguage, getUserLanguages } from '@/services/api/userLanguages.service';
import { useRouter } from 'next/navigation';
import { DataEditIcon } from '@/components/utils/DataEditIcon';
import { ISearchWorkers } from '@/services/api/serachWorkers.service';
import { WorkerDataStore } from '@/store/searchWorkersStore';
import { ApplicantOneStore, IApplicant } from '@/store/applicantsStore';
import { JobDataStore } from '@/store/searchJobStore';
import { IJob } from '@/store/jobStore';

interface Props {
  forCompany?: boolean;
  forApplicant?: boolean;
  forViewJob?: boolean;
};

export const LanguagesData: React.FC<Props> = ({
  forCompany = false,
  forApplicant = false,
  forViewJob = false,
}) => {
  const [userLanguages, setUserLanguages] = useRecoilState(UserLanguagesStore);
  const setUserLanguageId = useSetRecoilState(UserLanguageIdStore);
  const router = useRouter();
  const workerData = useRecoilValue<ISearchWorkers | null>(WorkerDataStore);
  const applicantData = useRecoilValue<IApplicant | null>(ApplicantOneStore);
  const job = useRecoilValue<IJob | null>(JobDataStore);

  const fetchUserLanguages = useCallback(async () => {
    try {
      const resp: AxiosResponse<any, any> = await getUserLanguages();
      const data: IUserLanguage[] = resp.data.data.data;
      setUserLanguages(data);
    } catch (error) {}
  }, []);

  useEffect(() => {
    console.log(job);

    if (forCompany) {
      if (!workerData) router.push('/dashboard/search-workers/');
    } else if (forApplicant) {
      if (!applicantData) router.push('/dashboard/applicants/');
    } else if (forViewJob) {
      if (!job) return;
    } else {
      if (!userLanguages) fetchUserLanguages();
    }
  }, []);

  return (
    <FlowDataContainer
      icon={FlowDataIcon.Language}
      title={!forViewJob ? 'Languages' : 'Required Languages'}
      text='Your speaking & writing languages'
      btnText='Add language'
      forCompany={forCompany || forApplicant || forViewJob}
    >
      {forViewJob && (
        <div className="data">
          {job?.JobLanguages?.map(lng => {
            const {
              Language,
              proficiency,
              job_languague_id
            } = lng;

            return (
              <div key={job_languague_id} className="data__item-container">
                <div className="data__item">
                  <div className="data__item-content">
                    <div className="data__item-left data__item-left--stretched">
                      <div className="data__info data__info--stretched">
                        <div className="data__title">
                          {Language?.name || ''}
                        </div>

                        <div className="data__info-bottom">
                          <div className="data__bar-container">
                            <div className={classNames("data__bar", {
                              "data__bar--native": proficiency === 'NATIVE',
                              "data__bar--c2": proficiency === 'PROFICIENT (C2)',
                              "data__bar--c1": proficiency === 'ADVANCED (C1)',
                              "data__bar--b2": proficiency === 'UPPER_INTERMEDIATE (B2)',
                              "data__bar--b1": proficiency === 'INTERMEDIATE (B1)',
                              "data__bar--a2": proficiency === 'ELEMENTARY (A2)',
                              "data__bar--a1": proficiency === 'BEGINNER (A1)',
                            })}/>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="data__item-right data__item-right--no-mg">
                      <div className="data__date">
                        <div className="data__date-name">
                          Proficiency / Level
                        </div>

                        <div className="data__date-text">
                          {proficiency}
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
          {workerData?.Candidate.UserLanguages?.map(lng => {
            const {
              Language,
              proficiency,
              user_language_id
            } = lng;

            return (
              <div key={user_language_id} className="data__item-container">
                <div className="data__item">
                  <div className="data__item-content">
                    <div className="data__item-left data__item-left--stretched">
                      <div className="data__info data__info--stretched">
                        <div className="data__title">
                          {Language?.name || ''}
                        </div>

                        <div className="data__info-bottom">
                          <div className="data__bar-container">
                            <div className={classNames("data__bar", {
                              "data__bar--native": proficiency === 'NATIVE',
                              "data__bar--c2": proficiency === 'PROFICIENT (C2)',
                              "data__bar--c1": proficiency === 'ADVANCED (C1)',
                              "data__bar--b2": proficiency === 'UPPER_INTERMEDIATE (B2)',
                              "data__bar--b1": proficiency === 'INTERMEDIATE (B1)',
                              "data__bar--a2": proficiency === 'ELEMENTARY (A2)',
                              "data__bar--a1": proficiency === 'BEGINNER (A1)',
                            })}/>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="data__item-right data__item-right--no-mg">
                      <div className="data__date">
                        <div className="data__date-name">
                          Proficiency / Level
                        </div>

                        <div className="data__date-text">
                          {proficiency}
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

      {forApplicant && (
        <div className="data">
          {applicantData?.Candidate.UserLanguages?.map(lng => {
            const {
              Language,
              proficiency,
              user_language_id
            } = lng;

            return (
              <div key={user_language_id} className="data__item-container">
                <div className="data__item">
                  <div className="data__item-content">
                    <div className="data__item-left data__item-left--stretched">
                      <div className="data__info data__info--stretched">
                        <div className="data__title">
                          {Language?.name || ''}
                        </div>

                        <div className="data__info-bottom">
                          <div className="data__bar-container">
                            <div className={classNames("data__bar", {
                              "data__bar--native": proficiency === 'NATIVE',
                              "data__bar--c2": proficiency === 'PROFICIENT (C2)',
                              "data__bar--c1": proficiency === 'ADVANCED (C1)',
                              "data__bar--b2": proficiency === 'UPPER_INTERMEDIATE (B2)',
                              "data__bar--b1": proficiency === 'INTERMEDIATE (B1)',
                              "data__bar--a2": proficiency === 'ELEMENTARY (A2)',
                              "data__bar--a1": proficiency === 'BEGINNER (A1)',
                            })}/>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="data__item-right data__item-right--no-mg">
                      <div className="data__date">
                        <div className="data__date-name">
                          Proficiency / Level
                        </div>

                        <div className="data__date-text">
                          {proficiency}
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

      {!forCompany && !forApplicant && !forViewJob && (
        <div className="data">
          {userLanguages?.map(lng => {
            const {
              Language,
              proficiency,
              user_language_id
            } = lng;

            return (
              <div key={user_language_id} className="data__item-container">
                <div className="data__item">
                  <div className="data__item-content">
                    <div className="data__item-left data__item-left--stretched">
                      <div className="data__info data__info--stretched">
                        <div className="data__title">
                          {Language?.name || ''}
                        </div>

                        <div className="data__info-bottom">
                          <div className="data__bar-container">
                            <div className={classNames("data__bar", {
                              "data__bar--native": proficiency === 'NATIVE',
                              "data__bar--c2": proficiency === 'PROFICIENT (C2)',
                              "data__bar--c1": proficiency === 'ADVANCED (C1)',
                              "data__bar--b2": proficiency === 'UPPER_INTERMEDIATE (B2)',
                              "data__bar--b1": proficiency === 'INTERMEDIATE (B1)',
                              "data__bar--a2": proficiency === 'ELEMENTARY (A2)',
                              "data__bar--a1": proficiency === 'BEGINNER (A1)',
                            })}/>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="data__item-right data__item-right--no-mg">
                      <div className="data__date">
                        <div className="data__date-name">
                          Proficiency / Level
                        </div>

                        <div className="data__date-text">
                          {proficiency}
                        </div>
                      </div>
                    </div>
                  </div>

                  <div
                    className="data__options"
                    onClick={() => {
                      if (user_language_id) {
                        setUserLanguageId(user_language_id);
                        router.push("/candidates/dashboard/profile/languages-edit");
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
