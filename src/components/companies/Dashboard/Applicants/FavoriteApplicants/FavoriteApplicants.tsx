'use client';
import '../../SearchWorkers/SearchWorkers.scss';
import classNames from 'classnames';
import { AxiosResponse } from 'axios';
import { useCallback, useEffect, useState } from "react";
import { generateWorkerCV, searchOneWorker } from '@/services/api/serachWorkers.service';
import { CircleMenu } from '@/components/candidates/Dashboard/utils/MenuCircle/CircleMenu';
import { formatDateShort, formatMediaUrl } from '@/components/utils/utils';
import { useRecoilState, useSetRecoilState } from 'recoil';
import { MenuApplicantIdStore } from '@/store/menuOpenStore';
import { useRouter } from 'next/navigation';
import { ApplicantOneStore, IApplicant } from '@/store/applicantsStore';
import { JobApplyStatus } from '@/store/jobStore';
import { IChangeApplicantFavorite, applicantAccept, applicantReject, changeApplicantFavoriteStatus, getApplicantOne, getApplicants } from '@/services/api/applicants.service';
import { AcceptModal } from '@/components/candidates/Dashboard/Offers/AcceptModal';
import { CandidateHeaderMessageStore, CandidateHeaderMessages } from '@/store/headerStore';
import { getFavoriteApplicants } from '@/services/api/favorites.service';
import { VideoModal } from '../../SearchWorkers/VideoModal';
import { ApplicantMenu } from '../ApplicantMenu';

enum ApplicantFilter {
  All,
  Applied,
  Accepted,
  Rejected,
};

interface IApplicantFilter {
  id: number,
  text: string,
  filter: ApplicantFilter,
};

const applicantFilters: IApplicantFilter[] = [
  {
    id: 1,
    text: 'All applicants',
    filter: ApplicantFilter.All
  },
  {
    id: 2,
    text: 'New',
    filter: ApplicantFilter.Applied
  },
  {
    id: 3,
    text: 'Accepted',
    filter: ApplicantFilter.Accepted
  },
  {
    id: 4,
    text: 'Rejected',
    filter: ApplicantFilter.Rejected
  },
];

export const FavoriteApplicants = () => {
  const setApplicant = useSetRecoilState<IApplicant | null>(ApplicantOneStore);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [applicants, setApplicants] = useState<IApplicant[] | null>(null);
  const [applicantsCount, setApplicantsCount] = useState<number>(0);

  const [perPage] = useState<number>(10);
  const [totalPages, setTotalPages] = useState<number>(1);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [pages, setPages] = useState<number[]>([1, 2, 3]);
  const setCandidateHeaderMessage = useSetRecoilState(CandidateHeaderMessageStore);

  const [menuApplicantId, setMenuApplicantId] = useRecoilState(MenuApplicantIdStore);
  const [selectedVideoUrl, setSelectedVideoUrl] = useState<string>('');
  const [openVideo, setOpenVideo] = useState<boolean>(false);
  const [openSendOffer, setOpenSendOffer] = useState<boolean>(false);
  const [modalAccept, setModalAccept] = useState<boolean>(false);
  const [modalReject, setModalReject] = useState<boolean>(false);
  const router = useRouter();
  const [favorites, setFavorites] = useState<number[]>([]);
  const [currentApplicantId, setCurrentApplicandId] = useState<number>(0);

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
  }, [currentPage, pages, applicants, perPage]);

  const fetchApplicants = useCallback(async () => {
    try {
      setIsLoading(true);
      const resp: AxiosResponse<any, any> = await getFavoriteApplicants(`?page=${currentPage}&pageSize=10`);
      const applicantsFetched: IApplicant[] = resp.data.data.data.rows;
      setApplicants(applicantsFetched);
      setApplicantsCount(resp.data.data.data.count);
      const favoriteApplicants: IApplicant[] = applicantsFetched.filter(worker => worker.favorite === 1);
      setFavorites(favoriteApplicants.map(worker => worker.applicant_id));
      setIsLoading(false);
      setCurrentPage(1);
    } catch (error) {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchApplicants();
    setCandidateHeaderMessage(CandidateHeaderMessages.Favorites);

    return () => setMenuApplicantId(0);
  }, []);

  const updateFavoriteChange = useCallback(async (data: IChangeApplicantFavorite) => {
    try {
      await changeApplicantFavoriteStatus(data);
    } catch (error) {}
  }, []);

  const handleFavoriteChange = useCallback((applicant_id: number) => {
    if(!favorites.includes(applicant_id)) {
      setFavorites(state => {
        if (!state) {
          return [applicant_id];
        } else {
          return [...state, applicant_id];
        }
      })

      updateFavoriteChange({favorite : 1, applicant_id});
    } else {
      setFavorites(state => state.filter(id => id !== applicant_id));
      updateFavoriteChange({favorite : 0, applicant_id});
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

  const handleViewProfile = useCallback(async (applicant_id: number) => {
    try {
      const resp: AxiosResponse<any, any> = await getApplicantOne(applicant_id);
      const applicantFetched: IApplicant = resp.data.data.data;
      setApplicant(applicantFetched);
      router.push('/dashboard/applicants/profile');
    } catch (error) {}
  }, []);

  const handleOpenSendOffer = useCallback(async (candidateId: number, positionId: number) => {
    try {
      const resp: AxiosResponse<any, any> = await searchOneWorker(candidateId, positionId);
      const applicantFetched: IApplicant = resp.data.data.data;
      setApplicant(applicantFetched);
      setOpenSendOffer(true);
    } catch (error) {}
  }, []);

  const handleAcceptApplicant = useCallback(async (applicant_id: number) => {
    try {
      setIsLoading(true);
      await applicantAccept({ applicant_id });
      fetchApplicants();
      setModalAccept(false);
      setIsLoading(false);
    } catch (error) {
      setIsLoading(false);
    }
  }, []);

  const handleRejectApplicant = useCallback(async (reason: string, applicant_id: number) => {
    try {
      setIsLoading(true);
      await applicantReject({ applicant_id, reason });
      fetchApplicants();
      setModalReject(false);
      setIsLoading(false);
    } catch (error) {
      setIsLoading(false);
    }
  }, []);

  return (
    <div className="search-workers">
      {openVideo && (
        <VideoModal videoUrl={selectedVideoUrl || ''} onClose={handleCloseVideo}/>
      )}

      {modalAccept && (
        <AcceptModal
          isLoading={isLoading}
          onAccept={() => handleAcceptApplicant(currentApplicantId)}
          onClose={() => setModalAccept(false)}
          forApplicant
        />
      )}

      {modalReject && (
        <AcceptModal
          isLoading={isLoading}
          forReject
          onReject={(reason: string) => handleRejectApplicant(reason, currentApplicantId)}
          onClose={() => setModalReject(false)}
          forApplicant
        />
      )}

      <div className="search-workers__content">
        <div className="container search-workers__workers search-workers__workers--applicants">
          <div className="container__top">
            <div className="container__title">
              {`Applicants (${applicantsCount})`}
            </div>
          </div>

          <div className="container workers">
            <div className="workers__list">
              {applicants?.map(applicant => {
                const {
                  applicant_id,
                  status,
                  Candidate,
                  ChatToApplicant,
                  JobPosition,
                  accepted_rejected_on,
                  createdAt,
                  job_position_id,
                } = applicant;

                return (
                  <div key={applicant_id} className="workers__item">
                    <div className="workers__item-left workers__item-left--applicants">
                      <div className="workers__item-left-top">
                        <div className="workers__picture-container workers__picture-container--applicant">
                          <img
                              src={Candidate.profile_image || formatMediaUrl(
                              `flag-icon-${Candidate.Country.alpha_2.toLowerCase() || 'globe'}.svg`,
                              "flags/"
                            )}
                            alt='profile'
                            className="workers__picture"
                          />
                        </div>

                        <div className="workers__info">
                          <div className="workers__joob-title workers__job-title--aplicant">
                            {`${Candidate.firstname} ${Candidate.lastname}` || ''}
                          </div>

                          <div className="workers__details">
                            <div className="workers__details-row">
                              <div className="workers__details-text workers__details-text--subtitle">
                                {JobPosition?.JobTitle?.name || ''}
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>

                      {status === JobApplyStatus.Applied && (
                        <div className="workers__received-on">
                          {`Received on ${formatDateShort(createdAt)}`}
                        </div>
                      )}

                      {status === JobApplyStatus.Accepted && (
                        <div className="workers__received-on">
                          {`Accepted on ${formatDateShort(accepted_rejected_on || String(new Date()))}`}
                        </div>
                      )}

                      {status === JobApplyStatus.Rejected && (
                        <div className="workers__received-on">
                          {`Rejected on ${formatDateShort(accepted_rejected_on || String(new Date()))}`}
                        </div>
                      )}
                    </div>

                    <div className="workers__item-mid">
                      <div className="workers__item-mid-pair-container">
                        <div className="workers__item-mid-pair">
                          <div className="workers__item-mid-text workers__item-mid-text--bold">Desired salary</div>
                          <div className="workers__item-mid-text">
                            {`${JobPosition.desired_salary} ${JobPosition.Currency?.code}/${JobPosition.recurrency}`}
                          </div>
                        </div>

                        <div className="workers__item-mid-pair">
                          <div className="workers__item-mid-text workers__item-mid-text--bold">Job experiene</div>
                          <div className="workers__item-mid-text">{JobPosition.job_experience}</div>
                        </div>
                      </div>

                      <div className="workers__item-mid-pair-container">
                        <div className="workers__item-mid-pair">
                          <div className="workers__item-mid-text workers__item-mid-text--bold">Language</div>
                          <div className="workers__item-mid-text">English</div>
                        </div>

                        <div className="workers__item-mid-pair">
                          <div className="workers__item-mid-text workers__item-mid-text--bold">Minimum contract</div>
                          <div className="workers__item-mid-text">{JobPosition.minimum_contract}</div>
                        </div>
                      </div>

                      <div className="workers__item-mid-pair-container">
                        <div className="workers__item-mid-pair">
                          <div className="workers__item-mid-text workers__item-mid-text--bold">Desired location type</div>
                          <div className="workers__item-mid-text">{JobPosition.location_type}</div>
                        </div>

                        <div className="workers__item-mid-pair">
                          <div className="workers__item-mid-text workers__item-mid-text--bold">Desired employment type</div>
                          <div className="workers__item-mid-text">{JobPosition.type_of_employment}</div>
                        </div>
                      </div>
                    </div>

                    <div className="workers__item-right">
                      {status === JobApplyStatus.Applied && (
                        <div className="workers__tag workers__tag--new">
                          NEW
                        </div>
                      )}

                      {status === JobApplyStatus.Accepted && (
                        <div className="workers__tag">
                          ACCEPTED
                        </div>
                      )}

                      {status === JobApplyStatus.Rejected && (
                        <div className="workers__tag workers__tag--rejected">
                          REJECTED
                        </div>
                      )}

                      <div className="workers__item-icons">
                        {status === JobApplyStatus.Accepted && (
                          <div
                            className="workers__item-icon workers__item-icon--message"
                            onClick={() => router.push(`/dashboard/messages?chatRoomId=${ChatToApplicant.chat_room_id}`)}
                          />
                        )}

                        <div
                          className={classNames("workers__item-icon",
                            "workers__item-icon--favorite", {
                            "workers__item-icon--favorite--active": favorites.includes(applicant_id)
                          })}
                          onClick={() => handleFavoriteChange(applicant_id)}
                        />

                        <div
                          className="workers__item-icon workers__item-icon--video"
                          onClick={() => handleOpenVideo(JobPosition.video || '')}
                        />

                        <div
                          className="workers__item-icon workers__item-icon--cv"
                          onClick={() => handleDownloadCV(job_position_id, Candidate.candidate_id)}
                        />
                      </div>

                      <div
                        onClick={() => {
                          setCurrentApplicandId(applicant_id);

                          if (menuApplicantId !== applicant_id) {
                            setMenuApplicantId(applicant_id);
                            return;
                          }

                          setMenuApplicantId(0);
                        }}
                        className="workers__menu"
                      >
                        <CircleMenu
                          active={menuApplicantId === applicant_id}
                        />

                        <div className={classNames("workers__menu-dropdown", {
                          "workers__menu-dropdown--active": menuApplicantId === applicant_id,
                        })}>
                          <ApplicantMenu
                            status={status}
                            isFavorite={favorites.includes(applicant_id)}
                            onProfile={() => handleViewProfile(applicant_id)}
                            onVideo={() => handleOpenVideo(JobPosition.video || '')}
                            onDownloadCV={() => handleDownloadCV(job_position_id, Candidate.candidate_id)}
                            onBlock={() => {}}
                            onFavoriteChange= {() => handleFavoriteChange(applicant_id)}
                            onAccept={() => setModalAccept(true)}
                            onReject={() => setModalReject(true)}
                            onContact={() => router.push(`/dashboard/messages?chatRoomId=${ChatToApplicant.chat_room_id}`)}
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>

            <div className="workers__bottom">
              <div className="pagination">
                <div className="pagination__left">
                  <div className="pagination__text pagination__text--bold">{currentPage}</div>
                  <div className="pagination__text">-</div>
                  <div className="pagination__text pagination__text--bold">{totalPages}</div>
                  <div className="pagination__text">of</div>
                  <div className="pagination__text pagination__text--bold">{applicantsCount}</div>
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
                      "pagination__button--disabled": totalPages === currentPage
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
