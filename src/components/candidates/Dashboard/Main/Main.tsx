'use client';
import '../Offers/OfferBox/OfferBox.scss';
import '../Offers/ViewOffer/ViewOffer.scss';
import '../../../companies/Dashboard/MyCompany/MyCompany.scss';
import './Main.scss';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { PromoteBox } from './PromoteBox';
import { PlanBox } from './PlanBox';
import { IJobPositionLimitCreated, JobPositionsLimitCreatedStore } from '@/store/jobPositionStore';
import { getLimitCountPositions } from '@/services/api/jobPosition.service';
import { AxiosResponse } from 'axios';
import { useCallback, useEffect, useState } from 'react';
import { useRecoilState, useSetRecoilState } from 'recoil';
import { PromotedPositionsStore } from '@/store/promotionsStore';
import { IPromotedPosition, getPromotedPositions } from '@/services/api/promotedPositions.service';
import { calculatePercentageLeft, formatDateShort, formatMediaUrl, removeDuplicates } from '@/components/utils/utils';
import { CandidateHeaderMessageStore, CandidateHeaderMessages } from '@/store/headerStore';
import { IChatRoom, getCandidateChatRooms } from '@/services/api/chat.service';
import { MessagesPreview } from '@/components/companies/Dashboard/MainCompany/MessagesPreview/MessagesPreview';
import { IOfferReceived, getOffersReceived } from '@/services/api/offers.service';
import { SentJobOfferStatus } from '@/services/api/serachWorkers.service';
import { FlagIcon } from '@/components/utils/FlagIcon';
import { CompanyAccountType } from '@/types/CompanyData';
import { IJob } from '@/store/jobStore';
import { getJobs, getOneJob } from '@/services/api/job.service';
import { Button } from '@/components/utils/Button';
import { recurrencyNew } from '@/components/companies/Dashboard/SearchWorkers';
import { OfferReceivedStore } from '@/store/offerReceived';
import { ButtonColor } from '@/types/ButtonColor';
import classNames from 'classnames';
import { JobDataStore } from '@/store/searchJobStore';

export const Main = () => {
  const router = useRouter();
  const [positionsLimitCreated, setPositionsLimitCreated] = useRecoilState(JobPositionsLimitCreatedStore);
  const [promotedPositions, setPromotedPositions] = useRecoilState(PromotedPositionsStore);
  const setCandidateHeaderMessage = useSetRecoilState(CandidateHeaderMessageStore);
  const [chatRooms, setChatRooms] = useState<IChatRoom[] | null>(null);
  const [unseenMessages, setUnseenMessages] = useState<number>(0);
  const [offers, setOffers] = useState<IOfferReceived[] | null>(null);
  const [jobs, setJobs] = useState<IJob[] | null>(null);
  const setJobData = useSetRecoilState<IJob | null>(JobDataStore);
  const setOfferReceived = useSetRecoilState(OfferReceivedStore);

  const fetchJobs = useCallback(async (params?: string) => {
    try {
      const resp: AxiosResponse<any, any> = await getJobs(params || '');
      const jobsFetched: IJob[] = resp.data.data.data;
      setJobs(jobsFetched.slice(0, 6));
    } catch (error) {}
  }, []);

  const fetchOffers = useCallback(async () => {
    try {
      const resp: AxiosResponse<any, any> = await getOffersReceived(`?page=1&pageSize=6`);
      const data: IOfferReceived[]  = resp.data.data.data;
      const filteredData: IOfferReceived[] = data.filter(offer => offer.status === SentJobOfferStatus.OfferSent);
      setOffers(filteredData.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()));
    } catch (error) {}
  }, []);

  const fetchCandidateChatRooms = useCallback(async () => {
    try {
      const resp: AxiosResponse<any, any> = await getCandidateChatRooms();
      const fetchedRooms: IChatRoom[] = resp.data.data.data;
      const count = fetchedRooms.reduce((acc, obj) => acc + ('unseenMessages' in obj ? obj['unseenMessages'] : 0), 0);
      setChatRooms(fetchedRooms);
      setUnseenMessages(count);
    } catch (error) {}
  }, []);

  const fetchLimitCountPositions = useCallback(async () => {
    try {
      const resp: AxiosResponse<any, any> = await getLimitCountPositions();
      const data: IJobPositionLimitCreated = resp.data.data.data;
      setPositionsLimitCreated(data);
    } catch (error) {}
  }, []);

  const fetchPromotedPositions = async () => {
    try {
      const resp: AxiosResponse<any, any> = await getPromotedPositions();
      const data: IPromotedPosition[] = resp.data.data.data;
      setPromotedPositions(data);
    } catch (error) {}
  };

  useEffect(() => {
    setCandidateHeaderMessage(CandidateHeaderMessages.Dashboard);
    fetchCandidateChatRooms();
    fetchOffers();
    fetchJobs();
    if (!positionsLimitCreated) fetchLimitCountPositions();
    if (!promotedPositions) fetchPromotedPositions();

    const refetchChats = setInterval(() => {
      fetchCandidateChatRooms();
    }, 3000);

    const refetchOffers = setInterval(() => {
      fetchOffers();
    }, 60000);

    return () => {
      clearInterval(refetchChats);
      clearInterval(refetchOffers);
    };
  }, []);

  const handleViewJob = useCallback(async (jobId: number) => {
    try {
      const resp: AxiosResponse<any, any> = await getOneJob(jobId);
      const jobFetched: IJob = resp.data.data.data;
      setJobData(jobFetched);
      router.push('/candidates/dashboard/job-search/view-job/');
    } catch (error) {}
  }, []);

  return (
    <div className="main">
      <div className="main__top">
        <div className="main__promote">
          <PromoteBox />
        </div>

        <div className="main__boxes">
          <div className="main__boxes-row">
            <div className="container main__container main__box">
              <div className="main__box-text">
                Job offers received
              </div>

              <div className="main__box-title">
                {offers?.length || 0}
              </div>

              {!offers?.length ? (
                <div className="main__box-text main__box-text--gray main__box-text--italic">
                  No job offers received
                </div>
              ) : (
                <div
                  onClick={() => router.push('/candidates/dashboard/offers-received/')}
                  className="main__box-text main__box-text--offers"
                >
                  See all job ffers
                </div>
              )}

              <div className="main__box-icon main__box-icon--offers"/>
            </div>

            <div className="container main__container main__box main__box--last">
              <div className="main__box-text">
                Open discutions
              </div>

              <div className="main__box-text main__box-text--gray">
                {`${unseenMessages} new messages`}
              </div>

              <div className="main__box-title">
                {chatRooms?.length || 0}
              </div>

              <div className="main__box-icon main__box-icon--messages"/>
            </div>
          </div>

          <div className="main__boxes-row main__boxes-row--last">
            <div className="container main__container main__box">
              <div className="main__box-title">
              {`${removeDuplicates((promotedPositions?.filter(p => p.status === 'ACTIVE') || []), 'job_position_id').length || 0}/${positionsLimitCreated?.active_job_position || 0}`}
              </div>

              <div className="main__box-text">
                Active promoted CVs
              </div>

              <div className="main__box-text main__box-text--gray">
                <span className='main__box-green'>+300%</span> more visibility
              </div>

              <div className="main__box-icon main__box-icon--promotions"/>
            </div>

            <div className="container main__container main__box main__box--last">
              <div className="main__box-title">
                {`${positionsLimitCreated?.active_job_position || 0}/${positionsLimitCreated?.limit || 1}`}
              </div>

              <div className="main__box-text">
                Active job positions
              </div>

              <div className="main__box-text main__box-text--gray">
                <div className="main__box-add-job">
                  <div className="main__box-add-icon"/>

                  <Link
                    href={'/candidates/dashboard/positions/'}
                    className='main__box-green'
                  >
                    Add another job position
                  </Link>
                </div>
              </div>

              <div className="main__box-icon main__box-icon--positions"/>
            </div>
          </div>
        </div>

        <div className="main__plan">
          <PlanBox />
        </div>
      </div>

      <div className="main__bottom">
        <div className="main__bottom-column main__bottom-column--first">
          {!offers || offers?.length < 1 ? (
            <div className="container main__container main__offers">
              <div className="container__title">
                Latest job offers received
              </div>

              <div className="container__text">
                Review received job opportunities
              </div>

              <div className="main__container-icon"/>

              <div className="main__container-text">
                Your job offers will appear here soon.
              </div>

              <div className="main__container-text main__container-text--gi">
                In the meantime, you can promote your job position to increase your chances or to add a new job position for more opportunities.
              </div>
            </div>
          ) : (
            <div className="container main__container main__offers">
              <div className="container__title">
                Latest job offers received
              </div>

              <div className="container__text">
                Review received job opportunities
              </div>

              {offers.filter(offer => offer.status === SentJobOfferStatus.OfferSent).slice(0, 3).map(offer => {
                return (
                  <div className="main__offer">
                    <div className="main__offer-top">
                      <div className="offer-box__picture main__offer-picture">
                        <img
                          src={offer.Company.company_logo || formatMediaUrl(
                          `flag-icon-${offer.Company.Country.alpha_2.toLowerCase() || 'globe'}.svg`,
                          "flags/")}
                          alt=""
                          className="offer-box__logo"
                        />

                        <div className="offer-box__flag">
                          {offer.Company.company_logo ? (
                            <FlagIcon size={24} code={offer.Company.Country.alpha_2}/>
                          ) : (
                            ''
                          )}
                        </div>

                        {offer.Company.account_type === CompanyAccountType.Agency && (
                          <div className="offer-box__agency-tag">
                            AGENCY
                          </div>
                        )}
                      </div>

                      <div className="main__offer-top-right">
                        <div className="main__offer-title">{offer.JobTitle.name}</div>
                        <div className="main__offer-text">{offer.Company.name}</div>
                      </div>
                    </div>

                    <div className="main__offer-details">
                      {offer.description}
                    </div>

                    <div className="offer-box__btn main__offer-btn">
                      <Button
                        onClick={() => {
                          setOfferReceived(offer);
                          router.push('/candidates/dashboard/offers-received/view-offer/');
                        }}
                        textSmall
                        color={ButtonColor.Blue}
                      >
                        Details
                      </Button>
                    </div>

                    <div className="offer-box__bar-container">
                      <div
                        style={{ width: `${calculatePercentageLeft(offer.due_date, 3)}%`}}
                        className="offer-box__bar"
                      />
                    </div>

                    <div className="offer-blue__due main__offer-due-date">
                      <div className="offer-blue__due-text">
                        {`Due date: ${formatDateShort(offer.due_date || String(new Date()))}`}
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
          )}
        </div>

        <div className="main__bottom-column">
          {!chatRooms?.length ? (
            <div className="main__bottom-container container main__container">
              <div className="container__title">
                New messages
              </div>

              <div className="container__text">
                Keep in touch with the employees
              </div>

              <div className="main__container-icon"/>

              <div className="main__container-text">
                New messages will appear here soon.
              </div>

              <div className="main__container-text main__container-text--gi">
                In the meantime, you can promote your job position to increase your chances or to add a new job position for more opportunities.
              </div>
            </div>
          ) : (
            <div className="main__bottom-container container main__container main__messages">
              <MessagesPreview />
            </div>
          )}


          <div className="container main__container main__jobs">
            <div className="container__title">
              New jobs available
            </div>

            <div className="container__text">
              in your domain of activity
            </div>

            {!jobs || !jobs.length ? (
              <>
                <div className="main__container-icon"/>

                <div className="main__container-text">
                  New available jobs will appear here soon.
                </div>

                <div className="main__container-text main__container-text--gi">
                  In the meantime, you can promote your job position to increase your chances or to add a new job position for more opportunities.
                </div>
              </>
            ) : (
              <div className="my-company__jobs-list">
                {jobs?.map(job => {
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
                    <div
                      key={job_id}
                      onClick={() => handleViewJob(job_id)}
                      className="my-company__jobs-item"
                    >
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
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
