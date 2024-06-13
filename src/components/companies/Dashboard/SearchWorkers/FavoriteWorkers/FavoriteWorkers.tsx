
'use client';
import '../../SearchWorkers/SearchWorkers.scss';
import { AxiosResponse } from 'axios';
import { useCallback, useEffect, useState } from "react";
import { ISearchWorkers, SentJobOfferStatus, generateWorkerCV, searchOneWorker, searchWorkers, updateWorkersToFavorite, updateWorkersToUnfavorite } from '@/services/api/serachWorkers.service';
import { LoadingModal, LoadingModalColor } from '@/components/utils/LoadingModal';
import { CircleMenu } from '@/components/candidates/Dashboard/utils/MenuCircle/CircleMenu';
import classNames from 'classnames';
import { formatMediaUrl } from '@/components/utils/utils';
import { useRecoilState, useSetRecoilState } from 'recoil';
import { MenuWorkerIdStore } from '@/store/menuOpenStore';
import { useRouter } from 'next/navigation';
import { WorkerDataStore } from '@/store/searchWorkersStore';
import { CandidateHeaderMessageStore, CandidateHeaderMessages } from '@/store/headerStore';
import { VideoModal } from '../VideoModal';
import { OfferModal } from '../OfferModal';
import { WorkerMenu } from '../WorkerMenu';
import { getFavoriteWorkers } from '@/services/api/favorites.service';
import { recurrencyNew } from '..';
import { ReportPanel } from '../ReportPanel';
import { reportPosition } from '@/services/api/report.service';

export const FavoriteWorkers = () => {
  const setWorkerData = useSetRecoilState<ISearchWorkers | null>(WorkerDataStore);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [workers, setWorkers] = useState<ISearchWorkers[] | null>(null);

  const [perPage] = useState<number>(10);
  const [workersCount, setWorkersCount] = useState<number>(0);
  const [totalPages, setTotalPages] = useState<number>(1);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [pages, setPages] = useState<number[]>([1, 2, 3]);

  const [menuWorkerId, setMenuWorkerId] = useRecoilState(MenuWorkerIdStore);
  const [selectedVideoUrl, setSelectedVideoUrl] = useState<string>('');
  const [openVideo, setOpenVideo] = useState<boolean>(false);
  const [openSendOffer, setOpenSendOffer] = useState<boolean>(false);
  const [openViewOffer, setOpenViewOffer] = useState<boolean>(false);
  const router = useRouter();
  const setCandidateHeaderMessage = useSetRecoilState(CandidateHeaderMessageStore);

  const [reportPanel, setReportPanel] = useState<boolean>(false);
  const [reportId, setReportId] = useState<number>(0);

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
  }, [currentPage, pages, workers, perPage]);

  const fetchWorkers = useCallback(async () => {
    try {
      setIsLoading(true);
      const resp: AxiosResponse<any, any> = await getFavoriteWorkers(`?page=${currentPage}&pageSize=${perPage}`);
      const workersFetched: ISearchWorkers[] = resp.data.data.data;
      setWorkers(workersFetched);
      setWorkersCount(resp.data.data.count);
      setTotalPages(Math.ceil(resp.data.data.count / perPage));
      setIsLoading(false);
      setCurrentPage(1);
    } catch (error) {
      setIsLoading(false);
    }
  }, [currentPage]);

  useEffect(() => {
    fetchWorkers();
    setCandidateHeaderMessage(CandidateHeaderMessages.Favorites);

    return () => setMenuWorkerId(0);
  }, []);

  const updateToUnfavorite = useCallback(async (jobPositionId: number) => {
    try {
      await updateWorkersToUnfavorite({jobPositionId});
      fetchWorkers();
    } catch (error) {}
  }, [currentPage]);

  const handleFavoriteChange = useCallback((job_position_id: number) => {
    updateToUnfavorite(job_position_id);
  }, []);

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
          onRefetch={fetchWorkers}
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

      <div className="search-workers__content">
        <div className="container search-workers__workers">
          <div className="container workers">
            <div className="workers__top">
              <div className="container__title">
                Matched found candidates <span className='workers__count'>{`(${workersCount || 0})`}</span>
              </div>

              <div className="container__text">
                Search candidates and sent them offers
              </div>
            </div>

            {!isLoading ? (
              <div className="workers__list">
                {workers?.map(worker => {
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
                            src={Candidate.profile_image || formatMediaUrl(
                              `flag-icon-${Candidate.Country.alpha_2.toLowerCase() || 'globe'}.svg`,
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
                              <div className="workers__details-text">{Candidate.Country?.name || ''}</div>
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
                              "workers__item-icon--favorite--active": true
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
                              isFavorite={true}
                              onProfile={() => handleViewProfile(Candidate.candidate_id, job_position_id)}
                              onVideo={() => handleOpenVideo(video)}
                              onDownloadCV={() => handleDownloadCV(job_position_id, Candidate.candidate_id)}
                              onReport={() => {}}
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
                  <div className="pagination__text pagination__text--bold">{totalPages || 1}</div>
                  <div className="pagination__text">of</div>
                  <div className="pagination__text pagination__text--bold">{workersCount}</div>
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
