'use client';
import './ViewOffer.scss';
import { useCallback, useEffect, useState } from 'react';
import { useRecoilState, useRecoilValue } from 'recoil';
import { FlagIcon } from '@/components/utils/FlagIcon';
import { useRouter } from 'next/navigation';
import { OfferReceivedStore } from '@/store/offerReceived';
import { IOfferReceived, IRejectOffer, acceptOffer, getOfferReceived, rejectOffer } from '@/services/api/offers.service';
import { AboutJob } from '../../Profile/AboutJob';
import { recurrencyNew } from '@/components/companies/Dashboard/SearchWorkers';
import classNames from 'classnames';
import { SentJobOfferStatus } from '@/services/api/serachWorkers.service';
import { calculatePercentageLeft, formatDateShort, formatMediaUrl } from '@/components/utils/utils';
import { AcceptModal } from '../AcceptModal';
import { AxiosResponse } from 'axios';

interface Props {
  forCompany?: boolean;
};

export const ViewOffer: React.FC<Props> = ({ forCompany = false }) => {
  const [offerReceived, setOfferReceived] = useRecoilState<IOfferReceived | null>(OfferReceivedStore);
  const router = useRouter();
  const [percentageLeft, setPercentageLeft] = useState(0);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [modalAccept, setModalAccept] = useState<boolean>(false);
  const [modalReject, setModalReject] = useState<boolean>(false);

  const handleAccept = useCallback(async () => {
    try {
      setIsLoading(true);
      await acceptOffer(offerReceived?.job_offer_id || 0);
      fetchOfferReceived(offerReceived?.job_offer_id || 0);
      setModalAccept(false);
      setIsLoading(false);
    } catch (error) {
      setIsLoading(false)
    }
  }, []);

  const fetchOfferReceived = useCallback(async (id: number) => {
    try {
      const resp: AxiosResponse<any, any> = await getOfferReceived(id);
      console.log(resp.data.data.data);
      setOfferReceived(resp.data.data.data);
    } catch (error) {}
  }, []);

  const handleReject = useCallback(async (reason: string) => {
    const data: IRejectOffer = {
      reason,
    };

    try {
      setIsLoading(true);
      await rejectOffer(offerReceived?.job_offer_id || 0, data);
      setModalReject(false);
      fetchOfferReceived(offerReceived?.job_offer_id || 0);
      setIsLoading(false);
    } catch (error) {
      setIsLoading(false)
    }
  }, []);

  useEffect(() => {
    if(!offerReceived) return;
    // Initial calculation
    setPercentageLeft(calculatePercentageLeft(offerReceived?.due_date, 3));

    // Update every minute
    const interval = setInterval(() => {
      setPercentageLeft(calculatePercentageLeft(offerReceived?.due_date, 3));
    }, 60000);

    return () => clearInterval(interval);
  }, [offerReceived]);

  useEffect(() => {
    if (!forCompany) {
      if (!offerReceived) router.push('/candidates/dashboard/offers-received/');
    }
  }, []);

  return (
    <div className="view-offer-container">
      {modalAccept && (
        <AcceptModal
          isLoading={isLoading}
          onAccept={handleAccept}
          onClose={() => setModalAccept(false)}
          />
        )}

      {modalReject && (
        <AcceptModal
          isLoading={isLoading}
          forReject
          onReject={handleReject}
          onClose={() => setModalReject(false)}
        />
      )}

      <div className="view-offer-container__left">
        <div className="container view-offer">
          <div className="view-offer__picture-container">
            <img
              src={!forCompany ? offerReceived?.Company.company_logo || formatMediaUrl(
                `flag-icon-${offerReceived?.Company.Country.alpha_2?.toLowerCase() || 'globe'}.svg`,
              ) : ''}
              alt="profile"
              className="view-offer__picture"
            />

            {!forCompany ? (
              <div className="view-offer__flag">
                {offerReceived?.Company.company_logo && (
                  <FlagIcon
                    code={!forCompany ? offerReceived?.Company.Country.alpha_2 || '' : ''}
                    size={34}
                  />
                )}
              </div>
            ) : (
            <div className="view-offer__flag">
              <FlagIcon
                code={!forCompany ? offerReceived?.Company.Country.alpha_2 || '' : ''}
                size={34}
              />
            </div>
            )}
          </div>

          <div className="view-offer__content">
            <div className="view-offer__top">
              <div className="view-offer__column">
                <div className="view-offer__title">
                  {!forCompany ? offerReceived?.JobTitle.name || '' : ''}
                </div>

                <div className="view-offer__row view-offer__row--first">
                  <div className="view-offer__icon view-offer__icon--location"/>

                  <div className="view-offer__text">
                  {!forCompany ? (
                    `${offerReceived?.Company.CompanyResidency?.town ? `${offerReceived?.Company.CompanyResidency?.town}, ` : ''} ${offerReceived?.Company.Country.name || ''}`
                    ) : (
                      ''
                  )}
                  </div>
                </div>
              </div>
            </div>

            <div className="view-offer__bottom">
              <div className="view-offer__bottom-row">
                <div className="view-offer__row">
                  <div className="view-offer__icon view-offer__icon--workplace"/>

                  <div className="view-offer__text view-offer__text--bold">
                    Workplace type:
                  </div>

                  <div className="view-offer__text">
                    {`${!forCompany ? offerReceived?.workplace_type || '' : ''}`}
                  </div>
                </div>

                <div className="view-offer__row">
                  <div className="view-offer__icon view-offer__icon--jobType"/>

                  <div className="view-offer__text view-offer__text--bold">
                    Type of job:
                  </div>

                  <div className="view-offer__text">
                    {`${!forCompany ? offerReceived?.type_of_employment || '' : ''}`}
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
                    {`${!forCompany ? offerReceived?.Company.IndustrySubcategory.name || '' : ''}`}
                  </div>
                </div>

                <div className="view-offer__row">
                  <div className="view-offer__icon view-offer__icon--contract"/>

                  <div className="view-offer__text view-offer__text--bold">
                    Contract duration:
                  </div>

                  <div className="view-offer__text">
                    {`${!forCompany ? offerReceived?.minimum_contract || '' : ''}`}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="view-offer__lp-desk-lg">
          <div className="container offer-blue">
            <div className="offer-blue__top">
              <div className="offer-blue__headline">
                Offered salary
              </div>

              <div className="offer-blue__title">
                {offerReceived?.salary.toLocaleString() || 0}
                {' '}

                <span className='offer-blue__title--thin'>
                  {`${offerReceived?.currency}/${recurrencyNew[offerReceived?.recurrency || '']}`}
                </span>
              </div>

              <div className="offer-blue__subline">
                + listed benefits
              </div>

              <div className="offer-blue__columns">
                <div className="offer-blue__column">
                  {offerReceived?.benefits.map(benefit => (
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
                  style={offerReceived?.status === SentJobOfferStatus.OfferSent ? { width: `${percentageLeft}%`} : {}}
                  className={classNames(
                    "offer-box__bar",
                    {
                      "offer-box__bar--rejected": offerReceived?.status === SentJobOfferStatus.Rejected,
                      "offer-box__bar--accepted": offerReceived?.status === SentJobOfferStatus.Accepted
                    }
                  )}
                />
              </div>

              <div className="offer-blue__due">
                {((offerReceived?.status === SentJobOfferStatus.OfferSent) && !offerReceived.isExpired) && (
                  <div className="offer-blue__due-text">
                    {`Due date: ${formatDateShort(offerReceived?.due_date || String(new Date()))}`}
                  </div>
                )}

                {((offerReceived?.status === SentJobOfferStatus.OfferSent) && offerReceived.isExpired) && (
                  <div className="offer-blue__due-text">
                    {`Expired on ${formatDateShort(offerReceived?.due_date || String(new Date()))}`}
                  </div>
                )}

                {(offerReceived?.status === SentJobOfferStatus.Accepted) && (
                  <div className="offer-blue__due-text">
                    {`Accepted on ${formatDateShort(offerReceived.accepted_rejected_on || String(new Date()))}`}
                  </div>
                )}

                {(offerReceived?.status === SentJobOfferStatus.Rejected) && (
                  <div className="offer-blue__due-text">
                    {`Rejected on ${formatDateShort(offerReceived.accepted_rejected_on || String(new Date()))}`}
                  </div>
                )}
              </div>
            </div>

            {offerReceived?.status === SentJobOfferStatus.Accepted && (
              <div className="offer-blue__bottom">
                <div
                  onClick={() => router.push(`/candidates/dashboard/messages?chatRoomId=${offerReceived.ChatToJobOffer?.chat_room_id}`)}
                  className="offer-blue__btn"
                >
                  Contact employer
                </div>
              </div>
            )}

            {((offerReceived?.status === SentJobOfferStatus.OfferSent) && !offerReceived.isExpired)
              && (
              <div className="offer-blue__bottom">
                <div onClick={() => setModalAccept(true)} className="offer-blue__btn">
                  Accept
                </div>

                <div onClick={() => setModalReject(true)} className="offer-blue__btn offer-blue__btn--reject">
                  Reject
                </div>
              </div>
            )}
          </div>
        </div>

        <AboutJob />
      </div>

      <div className="view-offer__mb-desk">
        <div className="container offer-blue">
          <div className="offer-blue__top">
            <div className="offer-blue__headline">
              Offered salary
            </div>

            <div className="offer-blue__title">
              {offerReceived?.salary.toLocaleString() || 0}
              {' '}

              <span className='offer-blue__title--thin'>
                {`${offerReceived?.currency}/${recurrencyNew[offerReceived?.recurrency || '']}`}
              </span>
            </div>

            <div className="offer-blue__subline">
              + listed benefits
            </div>

            <div className="offer-blue__columns">
              <div className="offer-blue__column">
                {offerReceived?.benefits.map(benefit => (
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
                style={offerReceived?.status === SentJobOfferStatus.OfferSent ? { width: `${percentageLeft}%`} : {}}
                className={classNames(
                  "offer-box__bar",
                  {
                    "offer-box__bar--rejected": offerReceived?.status === SentJobOfferStatus.Rejected,
                    "offer-box__bar--accepted": offerReceived?.status === SentJobOfferStatus.Accepted
                  }
                )}
              />
            </div>

            <div className="offer-blue__due">
              {((offerReceived?.status === SentJobOfferStatus.OfferSent) && !offerReceived.isExpired) && (
                <div className="offer-blue__due-text">
                  {`Due date: ${formatDateShort(offerReceived?.due_date || String(new Date()))}`}
                </div>
              )}

              {((offerReceived?.status === SentJobOfferStatus.OfferSent) && offerReceived.isExpired) && (
                <div className="offer-blue__due-text">
                  {`Expired on ${formatDateShort(offerReceived?.due_date || String(new Date()))}`}
                </div>
              )}

              {(offerReceived?.status === SentJobOfferStatus.Accepted) && (
                <div className="offer-blue__due-text">
                  {`Accepted on ${formatDateShort(offerReceived.accepted_rejected_on || String(new Date()))}`}
                </div>
              )}

              {(offerReceived?.status === SentJobOfferStatus.Rejected) && (
                <div className="offer-blue__due-text">
                  {`Rejected on ${formatDateShort(offerReceived.accepted_rejected_on || String(new Date()))}`}
                </div>
              )}
            </div>
          </div>

          {offerReceived?.status === SentJobOfferStatus.Accepted && (
            <div className="offer-blue__bottom">
              <div
                onClick={() => router.push(`/candidates/dashboard/messages?chatRoomId=${offerReceived.ChatToJobOffer?.chat_room_id}`)}
                className="offer-blue__btn"
              >
                Contact employer
              </div>
            </div>
          )}

          {((offerReceived?.status === SentJobOfferStatus.OfferSent) && !offerReceived.isExpired)
            && (
            <div className="offer-blue__bottom">
              <div onClick={() => setModalAccept(true)} className="offer-blue__btn">
                Accept
              </div>

              <div onClick={() => setModalReject(true)} className="offer-blue__btn offer-blue__btn--reject">
                Reject
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
