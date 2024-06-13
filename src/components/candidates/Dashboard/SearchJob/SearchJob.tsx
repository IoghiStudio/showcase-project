'use client';
import '../../../companies/Dashboard/SearchWorkers/SearchWorkers.scss';
import '../Positions/Positions.scss';
import classNames from 'classnames';
import { AxiosResponse } from 'axios';
import { useCallback, useEffect, useState } from "react";
import { LoadingModal, LoadingModalColor } from '@/components/utils/LoadingModal';
import { CircleMenu } from '@/components/candidates/Dashboard/utils/MenuCircle/CircleMenu';
import { formatMediaUrl } from '@/components/utils/utils';
import { useRecoilState, useSetRecoilState } from 'recoil';
import { MenuJobIdStore } from '@/store/menuOpenStore';
import { useRouter } from 'next/navigation';
import { Label } from '@/components/utils/Label';
import { IJobTitle } from '@/types/JobTitle';
import { ICountry } from '@/types/Country';
import { Select } from '@/components/utils/Select';
import { JobTitleDropdown } from '@/components/utils/JobTitleDropdown';
import { JobTypeDropdown } from '@/components/utils/JobTypeDropdown';
import { CountrySelect } from '@/components/utils/CountrySelect';
import { CountryDropdown } from '@/components/utils/CountryDropdown';
import { Checkbox } from '@/components/utils/Checkbox';
import { WorkplaceTypeEnum, recurrencyNew } from '@/components/companies/Dashboard/SearchWorkers';
import { IJob, JobApplyStatus } from '@/store/jobStore';
import { IApplyJob, applyJob, getJobs, getOneJob, makeJobFavorite, makeJobUnfavorite } from '@/services/api/job.service';
import { JobDataStore } from '@/store/searchJobStore';
import { JobMenu } from './JobMenu';
import { IEmployer, IViewEmployer, viewEmployer } from '@/services/api/viewEmployer.service';
import { ViewEmployerStore } from '@/store/viewEmployerStore';
import { JobPopup } from './JobPopup';
import { IJobPositionLimitCreated, JobPositionsLimitCreatedStore } from '@/store/jobPositionStore';
import { getLimitCountPositions } from '@/services/api/jobPosition.service';
import { ButtonIcon, ButtonWithIcon } from '../utils/ButtonWihIcon';
import { ButtonColor } from '@/types/ButtonColor';
import { CandidateHeaderMessageStore, CandidateHeaderMessages } from '@/store/headerStore';
import { reportJob } from '@/services/api/report.service';
import { ReportPanel } from '@/components/companies/Dashboard/SearchWorkers/ReportPanel';

enum JobFilter {
  All,
  Applied,
  Accepted,
  Rejected,
};

interface IJobFilter {
  id: number,
  text: string,
  filter: JobFilter,
};

const jobFilters: IJobFilter[] = [
  {
    id: 1,
    text: 'All jobs',
    filter: JobFilter.All
  },
  {
    id: 2,
    text: 'Applied',
    filter: JobFilter.Applied
  },
  {
    id: 3,
    text: 'Accepted',
    filter: JobFilter.Accepted
  },
  {
    id: 4,
    text: 'Rejected',
    filter: JobFilter.Rejected
  },
];

export const SearchJob = () => {
  const setJobData = useSetRecoilState<IJob | null>(JobDataStore);
  const setViewEmployer = useSetRecoilState<IViewEmployer | null>(ViewEmployerStore);
  const [currentFilter, setCurrentFilter] = useState<JobFilter>(JobFilter.All);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [jobs, setJobs] = useState<IJob[] | null>(null);
  const [perPage] = useState<number>(10);
  const [totalPages, setTotalPages] = useState<number>(1);
  const [announcesFound, setAnnouncesFound] = useState<number>(0);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [pages, setPages] = useState<number[]>([1, 2, 3]);
  const [menuJobId, setMenuJobId] = useRecoilState(MenuJobIdStore);
  const router = useRouter();
  const [favorites, setFavorites] = useState<number[]>([]);

  const [jobTitle, setJobTitle] = useState<IJobTitle | null>(null);
  const [country, setCountry] = useState<ICountry | null>(null);
  const [typeOfJob, setTypeOfJob] = useState<string>('');
  const [workplaceType, setWorkplaceType] = useState<WorkplaceTypeEnum | null>(null);

  const [jobTitleDropdown, setJobTitleDropdown] = useState<boolean>(false);
  const [countryDropdown, setCountryDropdown] = useState<boolean>(false);
  const [typeOfJobDropdown, setTypeOfJobDropdown] = useState<boolean>(false);
  const [openModal, setOpenModal] = useState<boolean>(false);
  const [positionsLimitCreated, setPositionsLimitCreated] = useRecoilState(JobPositionsLimitCreatedStore);
  const setCandidateHeaderMessage = useSetRecoilState(CandidateHeaderMessageStore);

  const [reportPanel, setReportPanel] = useState<boolean>(false);
  const [reportId, setReportId] = useState<number>(0);
  const [alreadyRunned, setAlreadyRunned] = useState<boolean>(false);

  useEffect(() => {
    setCandidateHeaderMessage(CandidateHeaderMessages.JobSearch);
  }, []);

  const fetchLimitCountPositions = useCallback(async () => {
    try {
      const resp: AxiosResponse<any, any> = await getLimitCountPositions();
      const data: IJobPositionLimitCreated = resp.data.data.data;
      setPositionsLimitCreated(data);
    } catch (error) {}
  }, []);

  useEffect(() => {
    fetchJobsWithFilters(1);
    if (!positionsLimitCreated) fetchLimitCountPositions();

    return () => setMenuJobId(0);
  }, []);

  useEffect(() => {
    setMenuJobId(0);

    if (currentFilter === JobFilter.All) {
      fetchJobsWithFilters(1);
    }

    if (currentFilter === JobFilter.Applied) {
      fetchJobsWithFilters(1, JobApplyStatus.Applied);
    }

    if (currentFilter === JobFilter.Accepted) {
      fetchJobsWithFilters(1, JobApplyStatus.Accepted);
    }

    if (currentFilter === JobFilter.Rejected) {
      fetchJobsWithFilters(1, JobApplyStatus.Rejected);
    }

    setCurrentPage(1);
    setPages([1, 2, 3]);
  }, [currentFilter, perPage]);

  useEffect(() => {
    modifyPages();
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

  const fetchJobs = useCallback(async (params?: string) => {
    try {
      setIsLoading(true);
      const resp: AxiosResponse<any, any> = await getJobs(params || '');
      const jobsFetched: IJob[] = resp.data.data.data;
      setJobs(jobsFetched);
      setTotalPages(Math.ceil((resp.data.data.count || 0) / perPage));
      setAnnouncesFound(resp.data.data.count);

      const favoritesJobs: IJob[] = jobsFetched.filter(job => job.favorite);
      setFavorites(favoritesJobs.map(job => job.job_id));
      setIsLoading(false);
    } catch (error) {
      setIsLoading(false);
    }
  }, []);

  const fetchJobsWithFilters = useCallback((pageNumber: number, status?: JobApplyStatus, firstCallParams?: string) => {
    let params: string = `?page=${pageNumber}&pageSize=${perPage}`;

    if (!firstCallParams?.length) {
      if (country) {
        params += `&country_id=${country.country_id}`;
      }

      if (status) params+= `&status=${status}`;

      if (typeOfJob) {
        params += `&type_of_employment=${typeOfJob}`;
      }

      if (workplaceType) {
        params += `&workplace_type=${workplaceType}`;
      }

      if (jobTitle) {
        params += `&job_title_id=${jobTitle.job_title_id}`;
      }

      router.push(`/candidates/search-jobs/${params}`);
    } else {
      setAlreadyRunned(true);
      params = firstCallParams;
    }

    fetchJobs(params);
  }, [
    workplaceType,
    country,
    typeOfJob,
    jobTitle,
  ]);

  const updateToFavorite = useCallback(async (job_id: number) => {
    try {
      await makeJobFavorite({job_id});
    } catch (error) {}
  }, []);

  const updateToUnfavorite = useCallback(async (job_id: number) => {
    try {
      await makeJobUnfavorite({job_id});
    } catch (error) {}
  }, []);

  const handleFavoriteChange = useCallback((job_id: number) => {
    if(!favorites.includes(job_id)) {
      setFavorites(state => {
        if (!state) {
          return [job_id];
        } else {
          return [...state, job_id];
        }
      })

      updateToFavorite(job_id);
    } else {
      setFavorites(state => state.filter(id => id !== job_id));
      updateToUnfavorite(job_id);
    }
  }, [favorites]);

  const handleViewJob = useCallback(async (jobId: number) => {
    try {
      const resp: AxiosResponse<any, any> = await getOneJob(jobId);
      const jobFetched: IJob = resp.data.data.data;
      setJobData(jobFetched);
      router.push('/candidates/dashboard/job-search/view-job/');
    } catch (error) {}
  }, []);

  const handleViewEmployer = useCallback(async (companyId: number, jobStatus: JobApplyStatus | null) => {
    try {
      const resp: AxiosResponse<any, any> = await viewEmployer(companyId);
      const employerFetched: IEmployer = resp.data.data.data;
      const viewEmployerCreated: IViewEmployer = {
        employer: employerFetched,
        status: jobStatus,
      };
      setViewEmployer(viewEmployerCreated);
      router.push('/candidates/dashboard/job-search/view-employer/');
    } catch (error) {}
  }, []);

  const handleJobTitleClick = useCallback((jobTitle: IJobTitle) => {
    setJobTitle(jobTitle);
    setJobTitleDropdown(false);
  }, []);

  const handleTypeOfJobClick = useCallback((jobType: string) => {
    setTypeOfJob(jobType);
    setTypeOfJobDropdown(false);
  }, []);

  const handleCountryClick = useCallback((country: ICountry) => {
    setCountry(country);
    setCountryDropdown(false);
  }, []);

  const handleSendCandidature = useCallback(async (job_id: number) => {
    const data: IApplyJob = {
      jobId: job_id,
    };

    try {
      await applyJob(data);
      fetchJobsWithFilters(currentPage);
    } catch (error) {}
  }, [currentPage]);

  const handleCloseModal = useCallback(() => setOpenModal(false), []);

  const handleReportPosition = useCallback(async (description: string) => {
    if (!description) {
      return;
    }

    try {
      await reportJob({ job_id: reportId, description });
      setReportPanel(false);
    } catch (error) {}
  }, [reportId, reportPanel]);

  return (
    <div className="search-workers">
      {openModal && (
        <JobPopup
          onClose={handleCloseModal}
          forAdd={(positionsLimitCreated && (positionsLimitCreated.active_job_position < positionsLimitCreated.limit)) || false}
        />
      )}

      {reportPanel && (
        <ReportPanel
          title='Report employer'
          text='Our team will verify this soon as possible'
          onSubmit={handleReportPosition}
          onClose={() => setReportPanel(false)}
        />
      )}

      <div className="search-workers__top">
        <div className="search-workers__top-filters">
          {jobFilters.map(w => (
            <div
              key={w.id}
              onClick={() => setCurrentFilter(w.filter)}
              className={classNames("search-workers__top-filter", {
                "search-workers__top-filter--active": currentFilter === w.filter
              })}
            >
              {w.text}
            </div>
          ))}
        </div>

        <div className="positions__top-right">
          <div className="positions__active-info">
            <div className="positions__active-info-count">
              {`${positionsLimitCreated?.active_job_position || 0}/${positionsLimitCreated?.limit || 1}`}
            </div>

            <div className="positions__active-info-text">
              Active job positions
            </div>
          </div>

          {positionsLimitCreated && (positionsLimitCreated?.active_job_position < positionsLimitCreated?.limit) ? (
            <div
              className="positions__button"
              onClick={() => router.push('/candidates/dashboard/positions/add')}
            >
              <ButtonWithIcon
                color={ButtonColor.White}
                bgColor={ButtonColor.Green}
                borderColor={ButtonColor.Green}
                icon={ButtonIcon.Plus}
                text='ADD JOB POSITION'
              />
            </div>
          ) : (
            <div
              className="positions__button"
              onClick={() => router.push('/candidates/dashboard/settings/billing/')}
            >
              <ButtonWithIcon
                color={ButtonColor.White}
                bgColor={ButtonColor.Blue}
                borderColor={ButtonColor.Blue}
                icon={ButtonIcon.Plus}
                text='UPGRADE PLAN'
              />
            </div>
          )}
        </div>
      </div>

      <div className="search-workers__content">
        <div className="container search-workers__filter">
          <div className="container filter">
            <div className="filter__top">
              <div className="container__title">
                Search for jobs
              </div>

              <div className="container__text">
                In your domain of activity
              </div>

              <div className="container__label">
                <Label title='Job position'>
                  <div onClick={() => setJobTitle(null)} className="filter__clear">
                    RESET
                  </div>

                  <div
                    className="container__select"
                    onClick={() => {
                      setJobTitleDropdown(!jobTitleDropdown);
                      setTypeOfJobDropdown(false);
                      setCountryDropdown(false);
                    }}
                  >
                    <Select
                      value={jobTitle?.name || ''}
                      error={false}
                    />
                  </div>

                  <JobTitleDropdown
                    isOpen={jobTitleDropdown}
                    onSelect={handleJobTitleClick}
                  />
                </Label>
              </div>

              <div className="container__label">
                <Label title='Country'>
                  <div onClick={() => setCountry(null)} className="filter__clear">
                    RESET
                  </div>

                  <div
                    className="container__select"
                    onClick={() => {
                      setCountryDropdown(!countryDropdown);
                      setJobTitleDropdown(false);
                      setTypeOfJobDropdown(false);
                    }}
                  >
                    <CountrySelect
                      name={country?.name || 'Worldwide'}
                      code={country?.alpha_2 || null}
                      error={false}
                    />
                  </div>

                  <CountryDropdown
                    isOpen={countryDropdown}
                    onSelect={handleCountryClick}
                  />
                </Label>
              </div>

              <div className="container__label">
                <Label title='Type of employment'>
                  <div onClick={() => setTypeOfJob('')} className="filter__clear">
                    RESET
                  </div>

                  <div
                    className="container__select"
                    onClick={() => {
                      setJobTitleDropdown(false);
                      setTypeOfJobDropdown(!typeOfJobDropdown);
                      setCountryDropdown(false);
                    }}
                  >
                    <Select
                      value={typeOfJob || ''}
                      error={false}
                    />
                  </div>

                  <JobTypeDropdown
                    isOpen={typeOfJobDropdown}
                    onSelect={handleTypeOfJobClick}
                  />
                </Label>
              </div>

              <div className="container__label">
                <Label title='Workplace type'>
                  <div className="filter__checks">
                    <div className="filter__check">
                      <Checkbox
                        checked={workplaceType === WorkplaceTypeEnum.OnSite}
                        onClick={() => {
                          if (workplaceType === WorkplaceTypeEnum.OnSite) {
                            setWorkplaceType(null);
                          } else {
                            setWorkplaceType(WorkplaceTypeEnum.OnSite);
                          }
                        }}
                      />

                      <div className="filter__check-text">
                        On-site
                      </div>
                    </div>

                    <div className="filter__check">
                      <Checkbox
                        checked={workplaceType === WorkplaceTypeEnum.Hybrid}
                        onClick={() => {
                          if (workplaceType === WorkplaceTypeEnum.Hybrid) {
                            setWorkplaceType(null);
                          } else {
                            setWorkplaceType(WorkplaceTypeEnum.Hybrid);
                          }
                        }}
                      />

                      <div className="filter__check-text">
                        Hybrid
                      </div>
                    </div>

                    <div className="filter__check">
                      <Checkbox
                        checked={workplaceType === WorkplaceTypeEnum.Remote}
                        onClick={() => {
                          if (workplaceType === WorkplaceTypeEnum.Remote) {
                            setWorkplaceType(null);
                          } else {
                            setWorkplaceType(WorkplaceTypeEnum.Remote);
                          }
                        }}
                      />

                      <div className="filter__check-text">
                        Remote
                      </div>
                    </div>
                  </div>
                </Label>
              </div>
            </div>

            <div className="container filter__bottom">
              <div
                onClick={() => {
                  if (currentFilter === JobFilter.All) {
                    // fetchJobsWithFilters(1, )
                  }
                }}
                className="filter__btn"
              >
                {!isLoading ? 'SEARCH' : (
                  <LoadingModal color={LoadingModalColor.Gray}/>
                )}
              </div>
            </div>
          </div>
        </div>

        <div className="container search-workers__workers">
          <div className="container workers">
            <div className="workers__top">
              <div className="container__title">
                Available jobs <span className='workers__count'>{`(${announcesFound || 0})`}</span>
              </div>

              <div className="container__text">
                Search jobs
              </div>
            </div>

            {isLoading ? (
              <div className="loading-state">
                <LoadingModal color={LoadingModalColor.Gray}/>
              </div>
            ) : (
              <div className="workers__list">
                {jobs?.map(worker => {
                  const {
                    is_elligible_to_apply,
                    promoted,
                    job_id,
                    JobTitle,
                    Country,
                    workplace_type,
                    type_of_employment,
                    salary,
                    currency,
                    recurrency,
                    Applicant,
                    Company
                  } = worker;

                  return (
                    <div
                      key={job_id}
                      className="workers__item"
                      onClick={() => handleViewJob(job_id)}
                    >
                      <div className="workers__item-left">
                        <div className="workers__picture-container">
                          <img
                              src={Company.company_logo || formatMediaUrl(
                              `flag-icon-${Country.alpha_2.toLowerCase() || 'globe'}.svg`,
                              "flags/"
                            )}
                            alt='profile'
                            className="workers__picture"
                          />
                          {promoted && (
                            <div className="workers__promoted-container">
                              <div className="workers__promoted">P</div>
                            </div>
                          )}
                        </div>

                        <div className="workers__info">
                          <div className="workers__job-title">
                            {JobTitle.name}
                          </div>

                          <div className="workers__details">
                            <div className="workers__details-row">
                              <div className="workers__details-text">{Country.name}</div>
                              <div className="workers__details-dot"/>
                              <div className="workers__details-text">{workplace_type}</div>
                              <div className="workers__details-dot"/>
                            </div>

                            <div className="workers__details-row">
                              <div className="workers__details-text">{type_of_employment}</div>
                              <div className="workers__details-dot"/>

                              <div className="workers__details-text workers__details-text--bold">
                                {`${salary.toLocaleString()} ${currency}`}
                              </div>

                              <div className="workers__details-text">
                                {`/ ${recurrencyNew[recurrency]}`}
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>

                      <div className="workers__item-right">
                        {Applicant?.status === JobApplyStatus.Applied && (
                          <div className="workers__tag workers__tag--offer-sent">
                            APPLIED
                          </div>
                        )}

                        {Applicant?.status === JobApplyStatus.Accepted && (
                          <div className="workers__tag">
                            ACCEPTED
                          </div>
                        )}

                        {Applicant?.status === JobApplyStatus.Rejected && (
                          <div className="workers__tag workers__tag--rejected">
                            REJECTED
                          </div>
                        )}

                        <div className="workers__item-icons workers__item-icons--jobs">
                          {Applicant && Applicant.status === JobApplyStatus.Accepted && (
                            <div
                              className={classNames("workers__item-icon", {
                                "workers__item-icon--message": favorites.includes(job_id)
                              })}
                              onClick={() => router.push(`/candidates/dashboard/messages?chatRoomId=${Applicant?.ChatToApplicant.chat_room_id}`)}
                            />
                          )}

                          <div
                            className={classNames("workers__item-icon",
                              "workers__item-icon--favorite", {
                              "workers__item-icon--favorite--active": favorites.includes(job_id)
                            })}
                            onClick={(e) => {
                              e.stopPropagation();
                              handleFavoriteChange(job_id);
                            }}
                          />
                        </div>

                        <div
                          onClick={(e) => {
                            e.stopPropagation();
                            if (menuJobId !== job_id) {
                              setMenuJobId(job_id);
                              return;
                            }

                            setMenuJobId(0);
                          }}
                          className="workers__menu"
                        >
                          <CircleMenu
                            active={menuJobId === job_id}
                          />

                          <div className={classNames("workers__menu-dropdown", {
                            "workers__menu-dropdown--active": menuJobId === job_id,
                          })}>
                            <JobMenu
                              isEligibleToApply={is_elligible_to_apply}
                              status={!Applicant ? 'null' : Applicant.status}
                              isFavorite={favorites.includes(job_id)}
                              onViewJob={() => handleViewJob(job_id)}
                              onViewEmployer={() => handleViewEmployer(Company.company_id, Applicant?.status || null)}
                              onReport={() => {
                                setReportId(job_id);
                                setReportPanel(true);
                              }}
                              onFavoriteChange= {() => handleFavoriteChange(job_id)}
                              onSendCandidature={() => {
                                if (is_elligible_to_apply) {
                                  handleSendCandidature(job_id);
                                } else {
                                  setOpenModal(true);
                                }
                              }}
                              onContact={() => router.push(`/candidates/dashboard/messages?chatRoomId=${Applicant?.ChatToApplicant.chat_room_id}`)}
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                  )
                })}
              </div>
            )}

            <div className="workers__bottom">
              <div className="pagination">
                <div className="pagination__left">
                  <div className="pagination__text pagination__text--bold">{currentPage}</div>
                  <div className="pagination__text">-</div>
                  <div className="pagination__text pagination__text--bold">{totalPages}</div>
                  <div className="pagination__text">of</div>
                  <div className="pagination__text pagination__text--bold">{announcesFound}</div>
                  <div className="pagination__text">job listings</div>
                </div>

                <div className="pagination__right">
                  <div
                    onClick={() => {
                      if (currentPage === 1) return;
                      fetchJobsWithFilters(currentPage - 1);
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
                            fetchJobsWithFilters(page);
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
                      fetchJobsWithFilters(currentPage + 1);
                      setCurrentPage(currPage => currPage + 1);
                    }}
                    className={classNames("pagination__button pagination__button--step", {
                      "pagination__button--disabled": currentPage === totalPages
                    })}
                  >
                    next page
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
