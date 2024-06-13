'use client';
import './MyCompany.scss';
import '../SearchWorkers/SearchWorkers.scss';
import { AnnounceStatus, IAnnounce } from '@/store/announceStore';
import { MyCompanyData } from './MyCompanyData/MyCompanyData';
import { useRecoilState, useRecoilValue, useSetRecoilState } from 'recoil';
import { useCallback, useEffect, useState } from 'react';
import { getAnnounces, getOneJob } from '@/services/api/job.service';
import { AxiosResponse } from 'axios';
import { formatMediaUrl } from '@/components/utils/utils';
import { recurrencyNew } from '../SearchWorkers';
import classNames from 'classnames';
import { Button } from '@/components/utils/Button';
import { useRouter } from 'next/navigation';
import { ICompanyData } from '@/types/CompanyData';
import { getCompanyData, updateCompanyDescription } from '@/services/api/authUser.service';
import { CompanyDataStore } from '@/store/companyDataStore';
import Link from 'next/link';
import { InputArea } from '@/components/utils/InputArea';
import { Label } from '@/components/utils/Label';
import { LoadingModal } from '@/components/utils/LoadingModal';
import { CandidateHeaderMessageStore, CandidateHeaderMessages } from '@/store/headerStore';
import { IViewEmployer, viewEmployer } from '@/services/api/viewEmployer.service';
import { ViewEmployerStore } from '@/store/viewEmployerStore';
import { IJob, JobApplyStatus } from '@/store/jobStore';
import { JobDataStore } from '@/store/searchJobStore';

interface Props {
  forViewEmployer?: boolean;
};

export const MyCompany: React.FC<Props> = ({ forViewEmployer=false }) => {
  const viewEmployer = useRecoilValue<IViewEmployer | null>(ViewEmployerStore);
  const [jobs, setJobs] = useState<IAnnounce[] | null>(null);
  const setJobData = useSetRecoilState<IJob | null>(JobDataStore);
  const [perPage] = useState<number>(5);
  const [totalPages, setTotalPages] = useState<number>(1);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [pages, setPages] = useState<number[]>([1, 2, 3]);
  const [companyData, setCompanyData] = useRecoilState<ICompanyData | null>(CompanyDataStore);
  const [openDescription, setOpenDescription] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [description, setDescription] = useState<string>('');
  const router = useRouter();
  const setCandidateHeaderMessage = useSetRecoilState(CandidateHeaderMessageStore);

  const handleViewJob = useCallback(async (jobId: number) => {
    try {
      const resp: AxiosResponse<any, any> = await getOneJob(jobId);
      const jobFetched: IJob = resp.data.data.data;
      setJobData(jobFetched);
      router.push('/candidates/dashboard/job-search/view-job/');
    } catch (error) {}
  }, []);

  const fetchCompanyData = useCallback(async () => {
    try {
      const resp: AxiosResponse<any, any> = await getCompanyData();
      const companyDataFetched: ICompanyData = resp.data.data.data;
      setCompanyData(companyDataFetched);
      setDescription(companyDataFetched.description || '');
    } catch (error) {}
  }, []);

  useEffect(() => {
    modifyPages();
    if (!forViewEmployer) {
      if (!description) fetchCompanyData();
    }
  }, [currentPage]);

  const modifyPages = useCallback(() => {
    if (currentPage > pages[pages.length - 1]) {
      const newPages = pages.map(page => page + 1);
      setPages(newPages);
    }

    if (currentPage < pages[0]) {
      const newPages = pages.map(page => page - 1);
      setPages(newPages);
    }
  }, [currentPage, pages, perPage]);

  const fetchJobs = useCallback(async () => {
    try {
      const resp: AxiosResponse<any, any> = await getAnnounces(`?page=${1}&pageSize=${perPage}`);
      const data: IAnnounce[] = resp.data.data.data;
      const dataActive: IAnnounce[] = data.filter(an => an.status === AnnounceStatus.Open);
      setJobs(dataActive);
      setTotalPages(Math.ceil((dataActive?.length || 0) / perPage));
    } catch (error) {}
  }, [perPage]);

  useEffect(() => {
    if (!forViewEmployer) {
      // fetchJobs()
      if (!companyData) fetchCompanyData();
      setCandidateHeaderMessage(CandidateHeaderMessages.MyCompany);
    } else {
      if (!viewEmployer) {
        router.push('/candidates/dashboard/job-search/');
        return;
      }
    }
  }, []);

  const handleUpdateDescription = useCallback(async (description: string) => {
    try {
      setIsLoading(true);
      await updateCompanyDescription({ description });
      fetchCompanyData();
      setOpenDescription(false);
      setIsLoading(false);
    } catch (error) {
      setIsLoading(false);
    }
  }, []);

  return (
    <div className="my-company">
      <div className="my-company__left">
        <div className="my-company__data">
          <MyCompanyData forViewEmployer={forViewEmployer}/>
        </div>

        <div className="my-company__left-mid">
          <div className="container my-company__about">
            {!forViewEmployer && (
              <div
                className="my-company__edit"
                onClick={() => setOpenDescription(!openDescription)}
              />
            )}

            <div className="container__title">
              About the company
            </div>

            <div className="container__text">
              Short description of the employer
            </div>

            {!forViewEmployer ? (
              <>
                {!companyData?.description ? (
                  <div className="my-company__about-description">
                    No description added
                  </div>
                ) : (
                  <div className="my-company__about-description">
                    {companyData.description}
                  </div>
                )}
              </>
            ) : (
              <>
                {!viewEmployer?.employer.description ? (
                  <div className="my-company__about-description">
                    No description added
                  </div>
                ) : (
                  <div className="my-company__about-description">
                    {viewEmployer.employer.description.split('\n').map((line, index) => <div key={index}>{line}</div>)}
                  </div>
                )}
              </>
            )}

            {openDescription && !forViewEmployer && (
              <div className="my-company__about-input">
                <Label
                  title=''
                  secondTitle={`${description.length}/300`}
                  forArea
                >
                  <InputArea
                    name='about-me'
                    value={description}
                    onChange={(e) => {
                      if (e.target.value.length <= 300) {
                        setDescription(e.target.value);
                      };
                    }}
                    placeholder='Write a short description about your company'
                  />
                </Label>

                <div
                  onClick={() => handleUpdateDescription(description)}
                  className="my-company__about-input-save"
                >
                  {!isLoading ? 'SAVE' : <LoadingModal />}
                </div>
              </div>
            )}
          </div>

          <div className="container my-company__admin">
            {!forViewEmployer && (
              <Link href={'/dashboard/settings/user/'} className="my-company__edit"/>
            )}

            <div className="container__title">
              Representatives
            </div>

            <div className="container__text">
              Persons in charge of this company
            </div>

            <div className="my-company__admin-person">
              <div className="my-company__admin-picture-container">
                {!forViewEmployer ? (
                  <img
                    src={companyData?.profile_image || formatMediaUrl(
                      `flag-icon-${'ro'}.svg`,
                    )}
                    alt='picture'
                    className="my-company__admin-picture"
                  />
                ) : (
                  <img
                    src={viewEmployer?.employer.profile_image || formatMediaUrl(
                      `flag-icon-${'ro'}.svg`,
                    )}
                    alt='picture'
                    className="my-company__admin-picture"
                  />
                )}

                <div className="my-company__admin-tag">
                  OWNER
                </div>
              </div>

              <div className="my-company__admin-right">
                {!forViewEmployer ? (
                  <div className="container__title">
                    {`${companyData?.firstname || ''} ${companyData?.lastname || ''}`}
                  </div>
                ) : (
                  <div className="container__title">
                    {viewEmployer?.status === JobApplyStatus.Accepted ? (
                      <>
                        {`${viewEmployer?.employer.firstname || ''} ${viewEmployer?.employer.lastname || ''}`}
                      </>
                    ) : (
                      <>
                        Hidden
                      </>
                    )}
                  </div>
                )}

                <div className="container__text">
                  Company Administrator
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="container my-company__jobs">
          <div className="my-company__jobs-top">
            <div className="container__title">
              Publicy available jobs <span className='my-company__jobs-count'>{`(${!forViewEmployer ? jobs?.length || 0 : viewEmployer?.employer.Jobs.length || 0})`}</span>
            </div>

            <div className="container__text">
              Job announcements that are public and candidates can apply to
            </div>
          </div>

          {!forViewEmployer ? (
            <>
              <div className="my-company__jobs-list">
                {jobs?.slice(perPage * (currentPage - 1), perPage * currentPage).map(job => {
                  const {
                    job_id,
                    JobTitle,
                    Country,
                    type_of_employment,
                    workplace_type,
                    salary,
                    currency,
                    recurrency,
                  } = job;

                  return (
                    <div key={job_id} className="my-company__jobs-item">
                      <div className="my-company__jobs-item-left">
                        <div className="my-company__jobs-picture-container">
                          <img
                              src={formatMediaUrl(
                              `flag-icon-${Country.alpha_2.toLowerCase() || 'globe'}.svg`,
                              "flags/"
                            )}
                            alt='profile'
                            className="my-company__jobs-picture"
                          />
                        </div>

                        <div className="my-company__jobs-info">
                          <div className="my-company__jobs-job-title">
                            {JobTitle.name}
                          </div>

                          <div className="my-company__jobs-details">
                            <div className="my-company__jobs-details-row">
                              <div className="my-company__jobs-details-text">{Country.name}</div>
                              <div className="my-company__jobs-details-dot"/>
                              <div className="my-company__jobs-details-text">{workplace_type}</div>
                              <div className="my-company__jobs-details-dot"/>
                            </div>

                            <div className="my-company__jobs-details-row">
                              <div className="my-company__jobs-details-text">{type_of_employment}</div>
                              <div className="my-company__jobs-details-dot"/>

                              <div className="my-company__jobs-details-text my-company__jobs__details-text--bold">
                                {`${salary.toLocaleString()} ${currency}`}
                              </div>

                              <div className="my-company__jobs-details-text">
                                {`/ ${recurrencyNew[recurrency]}`}
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>

                      <div className="my-company__jobs-item-right">
                        <div className="my-company__jobs-button">
                          <Button
                            textSmall
                            onClick={() => router.push('/dashboard/announcements/')}
                          >
                            DETAILS
                          </Button>
                        </div>
                      </div>
                    </div>
                  )
                })}
              </div>
            </>
          ) : (
            <>
              <div className="my-company__jobs-list">
                {viewEmployer?.employer.Jobs?.slice(perPage * (currentPage - 1), perPage * currentPage).map(job => {
                  const {
                    job_id,
                    JobTitle,
                    Country,
                    type_of_employment,
                    workplace_type,
                    salary,
                    currency,
                    recurrency,
                  } = job;

                  return (
                    <div key={job_id} className="my-company__jobs-item">
                      <div className="my-company__jobs-item-left">
                        <div className="my-company__jobs-picture-container">
                          <img
                              src={formatMediaUrl(
                              `flag-icon-${Country.alpha_2.toLowerCase() || 'globe'}.svg`,
                              "flags/"
                            )}
                            alt='profile'
                            className="my-company__jobs-picture"
                          />
                        </div>

                        <div className="my-company__jobs-info">
                          <div className="my-company__jobs-job-title">
                            {JobTitle.name}
                          </div>

                          <div className="my-company__jobs-details">
                            <div className="my-company__jobs-details-row">
                              <div className="my-company__jobs-details-text">{Country.name}</div>
                              <div className="my-company__jobs-details-dot"/>
                              <div className="my-company__jobs-details-text">{workplace_type}</div>
                              <div className="my-company__jobs-details-dot"/>
                            </div>

                            <div className="my-company__jobs-details-row">
                              <div className="my-company__jobs-details-text">{type_of_employment}</div>
                              <div className="my-company__jobs-details-dot"/>

                              <div className="my-company__jobs-details-text my-company__jobs__details-text--bold">
                                {`${salary.toLocaleString()} ${currency}`}
                              </div>

                              <div className="my-company__jobs-details-text">
                                {`/ ${recurrencyNew[recurrency]}`}
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>

                      <div className="my-company__jobs-item-right">
                        <div className="my-company__jobs-button">
                          <Button
                            textSmall
                            onClick={() => handleViewJob(job_id)}
                          >
                            DETAILS
                          </Button>
                        </div>
                      </div>
                    </div>
                  )
                })}
              </div>
            </>
          )}

          <div className="my-company__jobs-bottom">
            <div className="pagination">
              <div className="pagination__left">
                <div className="pagination__text pagination__text--bold">{currentPage}</div>
                <div className="pagination__text">-</div>
                <div className="pagination__text pagination__text--bold">{totalPages}</div>
                <div className="pagination__text">of</div>
                <div className="pagination__text pagination__text--bold">{jobs?.length}</div>
                <div className="pagination__text">job listings</div>
              </div>

              <div className="pagination__right">
                <div
                  onClick={() => {
                    if (currentPage === 1) return;
                    setCurrentPage(currPage => currPage - 1);
                  }}
                  className={classNames("pagination__button pagination__button--step", {
                    "pagination__button--disabled": currentPage === 1
                  })}
                >
                  previous page
                </div>

                <div className="pagination__pages">
                  {pages.map(page => (
                    <div
                      key={page}
                      onClick={() => {
                        if (page <= totalPages) {
                          setCurrentPage(page);
                        }
                      }}
                      className={classNames("pagination__button pagination__button--page", {
                        "pagination__button--active": page === currentPage,
                      })}
                    >
                      {page}
                    </div>
                  ))}
                </div>

                <div
                  onClick={() => {
                    if (currentPage === totalPages) return;
                    setCurrentPage(currPage => currPage + 1);
                  }}
                  className={classNames("pagination__button pagination__button--step", {
                    "pagination__button--disabled": totalPages <= currentPage
                  })}
                >
                  next page
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="my-company__right">
        <div className="container my-company__about">
          {!forViewEmployer && (
            <div
              className="my-company__edit"
              onClick={() => setOpenDescription(!openDescription)}
            />
          )}

          <div className="container__title">
            About the company
          </div>

          <div className="container__text">
            Short description of the employer
          </div>

          {!forViewEmployer ? (
            <>
              {!companyData?.description ? (
                <div className="my-company__about-description">
                  No description added
                </div>
              ) : (
                <div className="my-company__about-description">
                  {companyData.description}
                </div>
              )}
            </>
          ) : (
            <>
              {!viewEmployer?.employer.description ? (
                <div className="my-company__about-description">
                  No description added
                </div>
              ) : (
                <div className="my-company__about-description">
                  {viewEmployer.employer.description.split('\n').map((line, index) => <div key={index}>{line}</div>)}
                </div>
              )}
            </>
          )}

          {openDescription && !forViewEmployer && (
            <div className="my-company__about-input">
              <Label
                title=''
                secondTitle={`${description.length}/300`}
                forArea
              >
                <InputArea
                  name='about-me'
                  value={description}
                  onChange={(e) => {
                    if (e.target.value.length <= 300) {
                      setDescription(e.target.value);
                    };
                  }}
                  placeholder='Write a short description about your company'
                />
              </Label>

              <div
                onClick={() => handleUpdateDescription(description)}
                className="my-company__about-input-save"
              >
                {!isLoading ? 'SAVE' : <LoadingModal />}
              </div>
            </div>
          )}
        </div>

        <div className="container my-company__admin">
          {!forViewEmployer && (
            <Link href={'/dashboard/settings/user/'} className="my-company__edit"/>
          )}

          <div className="container__title">
            Representatives
          </div>

          <div className="container__text">
            Persons in charge of this company
          </div>

          <div className="my-company__admin-person">
            <div className="my-company__admin-picture-container">
              {!forViewEmployer ? (
                <img
                  src={companyData?.profile_image || formatMediaUrl(
                    `flag-icon-${'ro'}.svg`,
                  )}
                  alt='picture'
                  className="my-company__admin-picture"
                />
              ) : (
                <img
                  src={viewEmployer?.employer.profile_image || formatMediaUrl(
                    `flag-icon-${'ro'}.svg`,
                  )}
                  alt='picture'
                  className="my-company__admin-picture"
                />
              )}

              <div className="my-company__admin-tag">
                OWNER
              </div>
            </div>

            <div className="my-company__admin-right">
              {!forViewEmployer ? (
                <div className="container__title">
                  {`${companyData?.firstname || ''} ${companyData?.lastname || ''}`}
                </div>
              ) : (
                <div className="container__title">
                  {viewEmployer?.status === JobApplyStatus.Accepted ? (
                    <>
                      {`${viewEmployer?.employer.firstname || ''} ${viewEmployer?.employer.lastname || ''}`}
                    </>
                  ) : (
                    <>
                      Hidden
                    </>
                  )}
                </div>
              )}

              <div className="container__text">
                Company Administrator
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
