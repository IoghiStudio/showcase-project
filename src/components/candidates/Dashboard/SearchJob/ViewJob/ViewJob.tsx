'use client';
import '../../Offers/ViewOffer/ViewOffer.scss';
import './ViewJob.scss';
import classNames from 'classnames';
import { AboutJob } from '../../Profile/AboutJob';
import { ResponsabilitiesJob } from '../../Profile/ResponsabilitiesJob';
import { FlagIcon } from '@/components/utils/FlagIcon';
import { calculatePercentageLeft, formatDateShort, formatMediaUrl } from '@/components/utils/utils';
import { useRecoilState, useRecoilValue } from 'recoil';
import { IJob, JobApplyStatus } from '@/store/jobStore';
import { JobDataStore } from '@/store/searchJobStore';
import { useCallback, useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { LanguagesData } from '../../Profile/LanguagesData';
import { recurrencyNew } from '@/components/companies/Dashboard/SearchWorkers';
import { AxiosResponse } from 'axios';
import { IJobPositionLimitCreated, JobPositionsLimitCreatedStore } from '@/store/jobPositionStore';
import { getLimitCountPositions } from '@/services/api/jobPosition.service';
import { JobPopup } from '../JobPopup';
import { IApplyJob, applyJob } from '@/services/api/job.service';
import { NationalityWanted } from '../../Profile/NationalityWanted';

export const ViewJob = () => {
  const router = useRouter();
  const job = useRecoilValue<IJob | null>(JobDataStore);
  const [positionsLimitCreated, setPositionsLimitCreated] = useRecoilState(JobPositionsLimitCreatedStore);
  const [openModal, setOpenModal] = useState<boolean>(false);
  const [justApplied, setJustApplied] = useState<boolean>(false);

  useEffect(() => {
    if (!job) {
      router.push('/candidates/dashboard/job-search/');
      return;
    }

    if (job && !job.is_elligible_to_apply) fetchLimitCountPositions;
  }, []);

  const fetchLimitCountPositions = useCallback(async () => {
    try {
      const resp: AxiosResponse<any, any> = await getLimitCountPositions();
      const data: IJobPositionLimitCreated = resp.data.data.data;
      setPositionsLimitCreated(data);
    } catch (error) {}
  }, []);

  const handleCloseModal = useCallback(() => setOpenModal(false), []);

  const handleSendCandidature = useCallback(async (job_id: number) => {
    const data: IApplyJob = {
      jobId: job_id,
    };

    try {
      await applyJob(data);
      setJustApplied(true);
    } catch (error) {}
  }, []);

  const handleApply = useCallback((job_id: number) => {
    if (!job) return;
    if (!positionsLimitCreated) return;

    if (job.is_elligible_to_apply) {
      handleSendCandidature(job_id);
      //we apply
      return;
    }

    // if we reached this line that mean we are not eligible to apply and modal is needed
    setOpenModal(true);
  }, [positionsLimitCreated, job]);

  return (
    <div className="view-job">
      {openModal && (
        <JobPopup
          onClose={handleCloseModal}
          forAdd={(positionsLimitCreated && (positionsLimitCreated.active_job_position < positionsLimitCreated.limit)) || false}
        />
      )}

      <div className="view-job__left">
        <div className="view-job__profile">
          <div className="container view-offer">
            <div className="view-offer__picture-container">
              <img
                src={job?.Company.company_logo || formatMediaUrl(
                  `flag-icon-${job?.Company.Country.alpha_2?.toLowerCase() || 'globe'}.svg`,
                )}
                alt="profile"
                className="view-offer__picture"
              />

              <div className="view-offer__flag">
                {job?.Company.company_logo && (
                  <FlagIcon
                    code={job?.Company.Country.alpha_2 || ''}
                    size={34}
                  />
                )}
              </div>
            </div>

            <div className="view-offer__content">
              <div className="view-offer__top">
                <div className="view-offer__column">
                  <div className="view-offer__title">
                    {job?.JobTitle.name || ''}
                  </div>

                  <div className="view-offer__row view-offer__row--first">
                    <div className="view-offer__icon view-offer__icon--location"/>

                    <div className="view-offer__text">
                      {`${job?.Company.CompanyResidency?.town ? `${job.Company.CompanyResidency?.town}, ` : ''} ${job?.Company.Country.name || ''}`}
                    </div>
                  </div>
                </div>
              </div>

              <div className="view-offer__bottom">
                <div className="view-offer__bottom-row">
                  <div className="view-offer__row">
                    <div className="view-offer__icon view-offer__icon--openings"/>

                    <div className="view-offer__text view-offer__text--bold">
                      Openings:
                    </div>

                    <div className="view-offer__text">
                      {job && job.opening_positions ? (
                        <>
                          {job.opening_positions}
                        </>
                      ) : (
                        <div className="view-offer__text view-offer__text--italic">
                          Unspecified
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                <div className="view-offer__bottom-row">
                  <div className="view-offer__row">
                    <div className="view-offer__icon view-offer__icon--industry"/>

                    <div className="view-offer__text view-offer__text--bold">
                      Industry:
                    </div>

                    <div className="view-offer__text">
                      {`${job?.IndustrySubcategory.name || ''}`}
                    </div>
                  </div>

                  <div className="view-offer__row">
                    <div className="view-offer__icon view-offer__icon--contract"/>

                    <div className="view-offer__text view-offer__text--bold">
                      Contract duration:
                    </div>

                    {!job?.contract_duration && !job?.contract_duration_period ? (
                      <div className="view-offer__text view-offer__text--italic">
                        Unspecified
                      </div>
                    ) : (
                      <div className="view-offer__text">
                        {`${job?.contract_duration} ${job?.contract_duration_period}`}
                      </div>
                    )}
                  </div>
                </div>

                <div className="view-offer__bottom-row">
                  <div className="view-offer__row">
                    <div className="view-offer__icon view-offer__icon--department"/>

                    <div className="view-offer__text view-offer__text--bold">
                      Department:
                    </div>

                    <div className="view-offer__text">
                      {`${job?.Department.name || ''}`}
                    </div>
                  </div>

                  <div className="view-offer__row">
                    <div className="view-offer__icon view-offer__icon--car"/>

                    <div className="view-offer__text view-offer__text--bold">
                      Driving license:
                    </div>

                    {job?.JobDrivingPermits && job.JobDrivingPermits.length ? (
                      <div className="view-offer__text">
                        {job?.JobDrivingPermits.map(d => d.category).join(', ')}
                      </div>
                    ) : (
                      <div className="view-offer__text view-offer__text--italic">
                        Not required
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="view-job__lp-desk-lg">
          <div className="container offer-blue offer-blue--view">
            <div className="offer-blue__top">
              <div className="offer-blue__headline">
                Offered salary
              </div>

              <div className="offer-blue__title">
                {job?.salary.toLocaleString() || 0}
                {' '}

                <span className='offer-blue__title--thin'>
                  {`${job?.currency || ''}/${recurrencyNew[job?.recurrency || '']}`}
                </span>
              </div>

              <div className="offer-blue__subline">
                + listed benefits
              </div>

              <div className="offer-blue__columns">
                <div className="offer-blue__column">
                  {job?.benefits && job.benefits.map(benefit => (
                    <div className="offer-blue__row">
                      <div className="offer-blue__check"/>

                      <div className="offer-blue__text">
                        {benefit}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="offer-box__bar-container">
                <div
                  style={(job && !job.Applicant) ? { width: `${calculatePercentageLeft(job.due_date || '', 90)}%`} : {}}
                  className={classNames(
                    "offer-box__bar",
                    {
                      "offer-box__bar--rejected": job?.Applicant?.status === JobApplyStatus.Rejected,
                      "offer-box__bar--accepted": (job?.Applicant?.status === JobApplyStatus.Accepted) || (job?.Applicant?.status === JobApplyStatus.Applied) || justApplied,
                    }
                  )}
                />
              </div>

              <div className="offer-blue__due">
                {((job?.Applicant?.status === JobApplyStatus.Applied) || justApplied) && (
                  <div className="offer-blue__due-text">
                    {`Applied on: ${formatDateShort(job?.due_date || String(new Date()))}`}
                  </div>
                )}

                {(!job?.Applicant && !justApplied) && (
                  <div className="offer-blue__due-text">
                    {`Due date: ${formatDateShort(job?.due_date || String(new Date()))}`}
                  </div>
                )}

                {(job?.Applicant?.status === JobApplyStatus.Accepted) && (
                  <div className="offer-blue__due-text">
                    {`Accepted on ${formatDateShort(job?.Applicant.accepted_rejected_on || String(new Date()))}`}
                  </div>
                )}

                {(job?.Applicant?.status === JobApplyStatus.Rejected) && (
                  <div className="offer-blue__due-text">
                    {`Rejected on ${formatDateShort(job?.Applicant.accepted_rejected_on || String(new Date()))}`}
                  </div>
                )}
              </div>
            </div>

            {job?.Applicant?.status === JobApplyStatus.Accepted && (
              <div className="offer-blue__bottom">
                <div
                  onClick={() => router.push(`/candidates/dashboard/messages?chatRoomId=${job.Applicant?.ChatToApplicant?.chat_room_id}`)}
                  className="offer-blue__btn"
                >
                  Contact employer
                </div>
              </div>
            )}

            {((job?.Applicant?.status === JobApplyStatus.Applied) || justApplied) && (
              <div className="offer-blue__bottom">
                <div className="offer-blue__btn view-job__btn-review">
                  In review by this employer
                </div>
              </div>
            )}

            {(job && !job.Applicant && !justApplied) && (
              <div className="offer-blue__bottom">
                <div
                  onClick={() => handleApply(job.job_id)}
                  className="offer-blue__btn"
                >
                  Apply for this job
                </div>
              </div>
            )}
          </div>
        </div>

        <div className="view-job__about">
          <AboutJob forViewJob />
        </div>

        <div className="view-job__respons">
          <ResponsabilitiesJob />
        </div>
      </div>

      <div className="view-job__right">
        <div className="view-job__mb-desk">
          <div className="container offer-blue offer-blue--view">
            <div className="offer-blue__top">
              <div className="offer-blue__headline">
                Offered salary
              </div>

              <div className="offer-blue__title">
                {job?.salary.toLocaleString() || 0}
                {' '}

                <span className='offer-blue__title--thin'>
                  {`${job?.currency}/${recurrencyNew[job?.recurrency || '']}`}
                </span>
              </div>

              <div className="offer-blue__subline">
                + listed benefits
              </div>

              <div className="offer-blue__columns">
                <div className="offer-blue__column">
                  {job?.benefits && job.benefits.map(benefit => (
                    <div className="offer-blue__row">
                      <div className="offer-blue__check"/>

                      <div className="offer-blue__text">
                        {benefit}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="offer-box__bar-container">
                <div
                  style={(job && !job.Applicant) ? { width: `${calculatePercentageLeft(job.due_date || '', 90)}%`} : {}}
                  className={classNames(
                    "offer-box__bar",
                    {
                      "offer-box__bar--rejected": job?.Applicant?.status === JobApplyStatus.Rejected,
                      "offer-box__bar--accepted": (job?.Applicant?.status === JobApplyStatus.Accepted) || (job?.Applicant?.status === JobApplyStatus.Applied) || justApplied,
                    }
                  )}
                />
              </div>

              <div className="offer-blue__due">
                {((job?.Applicant?.status === JobApplyStatus.Applied) || justApplied) && (
                  <div className="offer-blue__due-text">
                    {`Applied on: ${formatDateShort(job?.due_date || String(new Date()))}`}
                  </div>
                )}

                {(!job?.Applicant && !justApplied) && (
                  <div className="offer-blue__due-text">
                    {`Due date: ${formatDateShort(job?.due_date || String(new Date()))}`}
                  </div>
                )}

                {(job?.Applicant?.status === JobApplyStatus.Accepted) && (
                  <div className="offer-blue__due-text">
                    {`Accepted on ${formatDateShort(job?.Applicant.accepted_rejected_on || String(new Date()))}`}
                  </div>
                )}

                {(job?.Applicant?.status === JobApplyStatus.Rejected) && (
                  <div className="offer-blue__due-text">
                    {`Rejected on ${formatDateShort(job?.Applicant.accepted_rejected_on || String(new Date()))}`}
                  </div>
                )}
              </div>
            </div>

            {job?.Applicant?.status === JobApplyStatus.Accepted && (
              <div className="offer-blue__bottom">
                <div
                  onClick={() => router.push(`/candidates/dashboard/messages?chatRoomId=${job.Applicant?.ChatToApplicant?.chat_room_id}`)}
                  className="offer-blue__btn"
                >
                  Contact employer
                </div>
              </div>
            )}

            {((job?.Applicant?.status === JobApplyStatus.Applied) || justApplied) && (
              <div className="offer-blue__bottom">
                <div className="offer-blue__btn view-job__btn-review">
                  In review by this employer
                </div>
              </div>
            )}

            {(job && !job.Applicant && !justApplied) && (
              <div className="offer-blue__bottom">
                <div
                  onClick={() => handleApply(job.job_id)}
                  className="offer-blue__btn"
                >
                  Apply for this job
                </div>
              </div>
            )}
          </div>
        </div>

        <div className="view-job__about">
          <LanguagesData forViewJob />
        </div>

        <div className="view-job__skills">
          <NationalityWanted />
        </div>
      </div>
    </div>
  )
}
