'use client';
import './SearchWorkers.scss';
import { AxiosResponse } from 'axios';
import { useCallback, useEffect, useState } from "react";
import { ISearchWorkers, SentJobOfferStatus, generateWorkerCV, searchOneWorker, searchWorkers, updateWorkersToFavorite, updateWorkersToUnfavorite } from '@/services/api/serachWorkers.service';
import { LoadingModal, LoadingModalColor } from '@/components/utils/LoadingModal';
import { CircleMenu } from '@/components/candidates/Dashboard/utils/MenuCircle/CircleMenu';
import { Object } from '@/types/Object';
import classNames from 'classnames';
import { customNumberValidator, formatMediaUrl } from '@/components/utils/utils';
import { useRecoilState, useSetRecoilState } from 'recoil';
import { MenuWorkerIdStore } from '@/store/menuOpenStore';
import { WorkerMenu } from './WorkerMenu';
import { VideoModal } from './VideoModal';
import { useRouter } from 'next/navigation';
import { WorkerDataStore } from '@/store/searchWorkersStore';
import { OfferModal } from './OfferModal';
import { Label } from '@/components/utils/Label';
import { IJobTitle } from '@/types/JobTitle';
import { ICountry } from '@/types/Country';
import { Select } from '@/components/utils/Select';
import { JobTitleDropdown } from '@/components/utils/JobTitleDropdown';
import { JobTypeDropdown } from '@/components/utils/JobTypeDropdown';
import { CountrySelect } from '@/components/utils/CountrySelect';
import { CountryDropdown } from '@/components/utils/CountryDropdown';
import { Checkbox } from '@/components/utils/Checkbox';
import { CandidateHeaderMessageStore, CandidateHeaderMessages } from '@/store/headerStore';
import { ReportPanel } from './ReportPanel';
import { reportPosition } from '@/services/api/report.service';

export const recurrencyNew: Object = {
  Hourly: 'hour',
  Daily: 'day',
  Weekly: 'week',
  Monthly: 'month',
  Yearly: 'year',
};

enum WorkerFilter {
  All,
  OfferSent,
  Accepted,
  Rejected,
};

interface IWorkerFilter {
  id: number,
  text: string,
  filter: WorkerFilter,
};

const workerFilters: IWorkerFilter[] = [
  {
    id: 1,
    text: 'All job positions',
    filter: WorkerFilter.All
  },
  {
    id: 2,
    text: 'Offer Sent',
    filter: WorkerFilter.OfferSent
  },
  {
    id: 3,
    text: 'Accepted',
    filter: WorkerFilter.Accepted
  },
  {
    id: 4,
    text: 'Rejected',
    filter: WorkerFilter.Rejected
  },
];

export enum WorkplaceTypeEnum {
  Hybrid = 'Hybrid',
  Remote = 'Remote',
  OnSite = 'On Site',
};

export const SearchWorkers = () => {
  const setWorkerData = useSetRecoilState<ISearchWorkers | null>(WorkerDataStore);
  const [currentFilter, setCurrentFilter] = useState<WorkerFilter>(WorkerFilter.All);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [workers, setWorkers] = useState<ISearchWorkers[] | null>(null);
  const [filteredWorkers, setFilteredWorkers] = useState<ISearchWorkers[] | null>(null);
  const [perPage] = useState<number>(10);
  const [totalPages, setTotalPages] = useState<number>(1);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [pages, setPages] = useState<number[]>([1, 2, 3]);
  const [menuWorkerId, setMenuWorkerId] = useRecoilState(MenuWorkerIdStore);
  const [selectedVideoUrl, setSelectedVideoUrl] = useState<string>('');
  const [openVideo, setOpenVideo] = useState<boolean>(false);
  const [openSendOffer, setOpenSendOffer] = useState<boolean>(false);
  const [openViewOffer, setOpenViewOffer] = useState<boolean>(false);
  const router = useRouter();
  const [jobTitle, setJobTitle] = useState<IJobTitle | null>(null);
  const [nationality, setNationality] = useState<ICountry | null>(null);
  const [typeOfJob, setTypeOfJob] = useState<string>('');
  const [experienceYears, setExperienceYears] = useState<string>('');
  const [workplaceType, setWorkplaceType] = useState<WorkplaceTypeEnum | null>(null);
  const [jobTitleDropdown, setJobTitleDropdown] = useState<boolean>(false);
  const [typeOfJobDropdown, setTypeOfJobDropdown] = useState<boolean>(false);
  const [nationalityDropdown, setNationalityDropdown] = useState<boolean>(false);
  const setCandidateHeaderMessage = useSetRecoilState(CandidateHeaderMessageStore);
  const [favorites, setFavorites] = useState<number[]>([]);

  const [reportPanel, setReportPanel] = useState<boolean>(false);
  const [reportId, setReportId] = useState<number>(0);

  useEffect(() => {
    setMenuWorkerId(0);

    if (currentFilter === WorkerFilter.All) {
      setFilteredWorkers(workers);
      setTotalPages(Math.ceil((workers?.length || 0) / perPage));
    }

    if (currentFilter === WorkerFilter.OfferSent) {
      const newPositions = workers?.filter(w => w.JobOffer?.status === SentJobOfferStatus.OfferSent && !w.isExpired) || [];
      setFilteredWorkers(newPositions);
      setTotalPages(Math.ceil((newPositions.length) / perPage));
    }

    if (currentFilter === WorkerFilter.Accepted) {
      const newPositions = workers?.filter(w => w.JobOffer?.status  === SentJobOfferStatus.Accepted) || [];
      setFilteredWorkers(newPositions);
      setTotalPages(Math.ceil((newPositions.length) / perPage));
    }

    if (currentFilter === WorkerFilter.Rejected) {
      const newPositions = workers?.filter(w => w.JobOffer?.status  === SentJobOfferStatus.Rejected) || [];
      setFilteredWorkers(newPositions);
      setTotalPages(Math.ceil((newPositions.length) / perPage));
    }

    setCurrentPage(1);
    setPages([1, 2, 3]);
  }, [currentFilter, workers, perPage]);


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
  }, [currentPage, pages, filteredWorkers, perPage]);

  const fetchWorkers = useCallback(async (params?: string) => {
    try {
      setIsLoading(true);
      const resp: AxiosResponse<any, any> = await searchWorkers(params || '');
      const workersFetched: ISearchWorkers[] = resp.data.data.data.data;
      setWorkers(workersFetched);
      const favoritesWorkers: ISearchWorkers[] = workersFetched.filter(worker => worker.Favorite);
      setFavorites(favoritesWorkers.map(worker => worker.job_position_id));
      setIsLoading(false);
      setCurrentPage(1);
    } catch (error) {
      setIsLoading(false);
    }
  }, []);

  const fetchWorkersWithFilters = useCallback(() => {
    let params: string = '';
    const paramList = [];

    if (nationality) {
      paramList.push(`country_id=${nationality.country_id}`);
    }

    if (experienceYears) {
      paramList.push(`job_experience=${experienceYears}`);
    }

    if (typeOfJob) {
      paramList.push(`type_of_employment=${typeOfJob}`);
    }

    if (workplaceType) {
      paramList.push(`location_type=${workplaceType}`);
    }

    if (jobTitle) {
      paramList.push(`job_title_id=${jobTitle.job_title_id}`);
    }

    if (paramList.length) {
      const filterParams = paramList.join('&');
      params = `?${filterParams}`;
    };

    fetchWorkers(params);
  }, [
    workplaceType,
    experienceYears,
    nationality,
    typeOfJob,
    jobTitle
  ]);

  useEffect(() => {
    fetchWorkers();
    setCandidateHeaderMessage(CandidateHeaderMessages.SearchWorkers);

    return () => setMenuWorkerId(0);
  }, []);

  const updateToFavorite = useCallback(async (jobPositionId: number) => {
    try {
      await updateWorkersToFavorite({jobPositionId});
    } catch (error) {}
  }, []);

  const updateToUnfavorite = useCallback(async (jobPositionId: number) => {
    try {
      await updateWorkersToUnfavorite({jobPositionId});
    } catch (error) {}
  }, []);

  const handleFavoriteChange = useCallback((job_position_id: number) => {
    if(!favorites.includes(job_position_id)) {
      setFavorites(state => {
        if (!state) {
          return [job_position_id];
        } else {
          return [...state, job_position_id];
        }
      })

      updateToFavorite(job_position_id);
    } else {
      setFavorites(state => state.filter(id => id !== job_position_id));
      updateToUnfavorite(job_position_id);
    }
  }, [favorites]);

  const handleDownloadCV = useCallback(async (jobPositionId: number, candidateId: number) => {
    try {
      const resp: AxiosResponse<any, any> = await generateWorkerCV({ jobPositionId, candidateId });
      const pdfBlob: Blob = new Blob([resp?.data], { type: "application/pdf" });
      const blobUrl: HTMLAnchorElement = document?.createElement("a");
      blobUrl.href = window?.URL?.createObjectURL(pdfBlob);
      window?.open(blobUrl.href, "_blank");
    } catch (error) {}
  }, []);

  const handleOpenVideo = useCallback((videoUrl: string) => {
    setSelectedVideoUrl(videoUrl);
    setOpenVideo(true);
  }, []);

  const handleCloseVideo = useCallback(() => {
    setOpenVideo(false);
    setSelectedVideoUrl('');
  }, []);

  const handleCloseSendOffer = useCallback(() => {
    setOpenSendOffer(false);
  }, []);

  const handleViewProfile = useCallback(async (candidateId: number, positionId: number) => {
    try {
      const resp: AxiosResponse<any, any> = await searchOneWorker(candidateId, positionId);
      const workerFetched: ISearchWorkers = resp.data.data.data;
      setWorkerData(workerFetched);
      router.push('/dashboard/search-workers/profile');
    } catch (error) {}
  }, []);

  const handleOpenSendOffer = useCallback(async (candidateId: number, positionId: number) => {
    try {
      const resp: AxiosResponse<any, any> = await searchOneWorker(candidateId, positionId);
      const workerFetched: ISearchWorkers = resp.data.data.data;
      setWorkerData(workerFetched);
      setOpenSendOffer(true);
    } catch (error) {}
  }, []);

  const handleOpenViewOffer = useCallback((worker: ISearchWorkers) => {
    setWorkerData(worker);
    setOpenViewOffer(true);
  }, []);

  const handleJobTitleClick = useCallback((jobTitle: IJobTitle) => {
    setJobTitle(jobTitle);
    setJobTitleDropdown(false);
  }, []);

  const handleTypeOfJobClick = useCallback((jobType: string) => {
    setTypeOfJob(jobType);
    setTypeOfJobDropdown(false);
  }, []);

  const handleNationalityClick = useCallback((country: ICountry) => {
    setNationality(country);
    setNationalityDropdown(false);
  }, []);
3
  const handleReportPosition = useCallback(async (description: string) => {
    if (!description) {
      return;
    }

    try {
      await reportPosition({ job_position_id: reportId, description });
      setReportPanel(false);
    } catch (error) {}
  }, [reportId, reportPanel]);

  return (
    <div className="search-workers">
      {openVideo && (
        <VideoModal videoUrl={selectedVideoUrl || ''} onClose={handleCloseVideo}/>
      )}

      {openSendOffer && (
        <OfferModal
          onRefetch={fetchWorkersWithFilters}
          onClose={handleCloseSendOffer}
        />
      )}

      {openViewOffer && (
        <OfferModal
          forView
          onClose={() => setOpenViewOffer(false)}
        />
      )}

      {reportPanel && (
        <ReportPanel
          title='Report candidate'
          text='Our team will verify this soon as possible'
          onSubmit={handleReportPosition}
          onClose={() => setReportPanel(false)}
        />
      )}

      <div className="search-workers__top-filters">
        {workerFilters.map(w => (
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

      <div className="search-workers__content">
        <div className="container search-workers__filter">
          <div className="container filter">
            <div className="filter__top">
              <div className="container__title">
                Search for candidates
              </div>

              <div className="container__text">
                Finding matching candidate all around the globe
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
                      setNationalityDropdown(false);
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
                <Label title='NATIONALITY'>
                  <div onClick={() => setNationality(null)} className="filter__clear">
                    RESET
                  </div>

                  <div
                    className="container__select"
                    onClick={() => {
                      setNationalityDropdown(!nationalityDropdown);
                      setJobTitleDropdown(false);
                      setTypeOfJobDropdown(false);
                    }}
                  >
                    <CountrySelect
                      name={nationality?.name || 'Worldwide'}
                      code={nationality?.alpha_2 || null}
                      error={false}
                    />
                  </div>

                  <CountryDropdown
                    isOpen={nationalityDropdown}
                    onSelect={handleNationalityClick}
                  />
                </Label>
              </div>

              <div className="container__label">
                <Label title='Experience'>
                  <div className="filter__experience">
                    <input
                      type='text'
                      className="filter__experience-input"
                      placeholder='type a number'
                      value={experienceYears}
                      onChange={e => {
                        customNumberValidator(e, setExperienceYears);
                      }}
                    />

                    <div className="filter__experience-text">
                      years of experience
                    </div>
                  </div>
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
                      setNationalityDropdown(false);
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
                onClick={fetchWorkersWithFilters}
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
                Matched found candidates <span className='workers__count'>{`(${filteredWorkers?.length || 0})`}</span>
              </div>

              <div className="container__text">
                Search candidates and sent them offers
              </div>
            </div>

            {!isLoading ? (
              <div className="workers__list">
                {filteredWorkers?.slice(perPage * (currentPage - 1), perPage * currentPage).map(worker => {
                  const {
                    promoted,
                    isExpired,
                    JobOffer,
                    job_position_id,
                    JobTitle,
                    Candidate,
                    Country,
                    location_type,
                    type_of_employment,
                    desired_salary,
                    Currency,
                    recurrency,
                    video,
                  } = worker;

                  return (
                    <div
                      key={job_position_id}
                      className="workers__item"
                      onClick={() => handleViewProfile(Candidate.candidate_id, job_position_id)}
                    >
                      <div className="workers__item-left">
                        <div className="workers__picture-container">
                          <img
                            // src={formatMediaUrl(
                            src={Candidate.profile_image || formatMediaUrl(
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
                              <div className="workers__details-text">{location_type}</div>
                              <div className="workers__details-dot"/>
                            </div>

                            <div className="workers__details-row">
                              <div className="workers__details-text">{type_of_employment}</div>
                              <div className="workers__details-dot"/>

                              <div className="workers__details-text workers__details-text--bold">
                                {`${desired_salary.toLocaleString()} ${Currency.code}`}
                              </div>

                              <div className="workers__details-text">
                                {`/ ${recurrencyNew[recurrency]}`}
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>

                      <div className="workers__item-right">
                        {!isExpired && JobOffer?.status === SentJobOfferStatus.OfferSent && (
                          <div className="workers__tag workers__tag--offer-sent">
                            OFFER SENT
                          </div>
                        )}

                        {JobOffer?.status === SentJobOfferStatus.Accepted && (
                          <div className="workers__tag">
                            ACCEPTED
                          </div>
                        )}

                        {JobOffer?.status === SentJobOfferStatus.Rejected && (
                          <div className="workers__tag workers__tag--rejected">
                            REJECTED
                          </div>
                        )}

                        <div className="workers__item-icons">
                          {JobOffer?.status === SentJobOfferStatus.Accepted && (
                            <div
                              className={classNames("workers__item-icon", {
                                "workers__item-icon--message": true
                              })}
                              onClick={(e) => {
                                e.stopPropagation();
                                router.push(`/dashboard/messages?chatRoomId=${JobOffer.ChatToJobOffer.chat_room_id}`)
                              }}
                            />
                          )}

                          <div
                            className={classNames("workers__item-icon",
                              "workers__item-icon--favorite", {
                              "workers__item-icon--favorite--active": favorites.includes(job_position_id)
                            })}
                            onClick={(e) => {
                              e.stopPropagation();
                              handleFavoriteChange(job_position_id)}
                            }
                          />

                          <div
                            className="workers__item-icon workers__item-icon--video"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleOpenVideo(video)}
                            }
                          />

                          <div
                            className="workers__item-icon workers__item-icon--cv"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleDownloadCV(job_position_id, Candidate.candidate_id)}
                            }
                          />
                        </div>

                        <div
                          onClick={(e) => {
                            e.stopPropagation();
                            if (menuWorkerId !== job_position_id) {
                              setMenuWorkerId(job_position_id);
                              return;
                            }

                            setMenuWorkerId(0);
                          }}
                          className="workers__menu"
                        >
                          <CircleMenu
                            active={menuWorkerId === job_position_id}
                          />

                          <div className={classNames("workers__menu-dropdown", {
                            "workers__menu-dropdown--active": menuWorkerId === job_position_id,
                          })}>
                            <WorkerMenu
                              status={!JobOffer ? 'null' : JobOffer.status}
                              isExpired={isExpired}
                              isFavorite={favorites.includes(job_position_id)}
                              onProfile={() => handleViewProfile(Candidate.candidate_id, job_position_id)}
                              onVideo={() => handleOpenVideo(video)}
                              onDownloadCV={() => handleDownloadCV(job_position_id, Candidate.candidate_id)}
                              onReport={() => {
                                setReportId(job_position_id);
                                setReportPanel(true);
                              }}
                              onFavoriteChange= {() => handleFavoriteChange(job_position_id)}
                              onSendOffer={() => handleOpenSendOffer(Candidate.candidate_id, job_position_id)}
                              onViewOffer={() => handleOpenViewOffer(worker)}
                              onContact={() => router.push(`/dashboard/messages?chatRoomId=${JobOffer?.ChatToJobOffer.chat_room_id}`)}
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                  )
                })}
              </div>
            ) : (
              <div className="loading-state">
                <LoadingModal color={LoadingModalColor.Gray}/>
              </div>
            )}

            <div className="workers__bottom">
              <div className="pagination">
                <div className="pagination__left">
                  <div className="pagination__text pagination__text--bold">{currentPage}</div>
                  <div className="pagination__text">-</div>
                  <div className="pagination__text pagination__text--bold">{totalPages}</div>
                  <div className="pagination__text">of</div>
                  <div className="pagination__text pagination__text--bold">{filteredWorkers?.length}</div>
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
                        onClick={() => {
                          if (page <= totalPages) {
                            setCurrentPage(page);
                          }
                        }}
                        key={page}
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
      </div>
    </div>
  )
}
