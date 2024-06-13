'use client';
import { IChangeOfferFavoriteStatus, IOfferReceived, IRejectOffer, acceptOffer, changeOfferFavoriteStatus, rejectOffer } from '@/services/api/offers.service';
import './OfferBox.scss';
import React, { useCallback, useEffect, useState } from 'react';
import { FlagIcon } from '@/components/utils/FlagIcon';
import { Button } from '@/components/utils/Button';
import { ButtonColor } from '@/types/ButtonColor';
import { CircleMenu } from '../../utils/MenuCircle/CircleMenu';
import { recurrencyNew } from '@/components/companies/Dashboard/SearchWorkers';
import { SentJobOfferStatus } from '@/services/api/serachWorkers.service';
import classNames from 'classnames';
import { calculatePercentageLeft, formatDateShort, formatMediaUrl } from '@/components/utils/utils';
import { CompanyAccountType } from '@/types/CompanyData';
import { useRecoilState, useSetRecoilState } from 'recoil';
import { MenuOfferIdStore } from '@/store/menuOpenStore';
import { OfferMenu } from '../OfferMenu';
import { AcceptModal } from '../AcceptModal';
import { useRouter } from 'next/navigation';
import { OfferReceivedStore } from '@/store/offerReceived';
import { IEmployer, IViewEmployer, viewEmployer } from '@/services/api/viewEmployer.service';
import { JobApplyStatus } from '@/store/jobStore';
import { AxiosResponse } from 'axios';
import { ViewEmployerStore } from '@/store/viewEmployerStore';
import { reportOffer } from '@/services/api/report.service';
import { ReportPanel } from '@/components/companies/Dashboard/SearchWorkers/ReportPanel';

interface Props {
  offer: IOfferReceived;
  refetch: () => void;
  favorite?: boolean;
};

export const OfferBox: React.FC<Props> = ({
  offer,
  refetch,
  favorite = false,
}) => {
  const [isFavorite, setIsFavorite] = useState<boolean>(false);
  const [percentageLeft, setPercentageLeft] = useState(0);
  const [menuOfferId, setMenuOfferId] = useRecoilState(MenuOfferIdStore);
  const [modalAccept, setModalAccept] = useState<boolean>(false);
  const [modalReject, setModalReject] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const router = useRouter();
  const setOfferReceived = useSetRecoilState(OfferReceivedStore);
  const setViewEmployer = useSetRecoilState<IViewEmployer | null>(ViewEmployerStore);
  const [reportPanel, setReportPanel] = useState<boolean>(false);
  const [reportId, setReportId] = useState<number>(0);

  useEffect(() => {
    setIsFavorite(Boolean(offer.favorite))
    return () => setMenuOfferId(0);
  }, []);

  useEffect(() => {
    // Initial calculation
    setPercentageLeft(calculatePercentageLeft(offer.due_date, 3));

    // Update every minute
    const interval = setInterval(() => {
      setPercentageLeft(calculatePercentageLeft(offer.due_date, 3));
    }, 60000);

    return () => clearInterval(interval);
  }, [offer]);

  useEffect(() => {
    if (!offer) return;
  }, []);

  const handleViewEmployer = useCallback(async (companyId: number, jobStatus: SentJobOfferStatus | null) => {
    try {
      const resp: AxiosResponse<any, any> = await viewEmployer(companyId);
      const employerFetched: IEmployer = resp.data.data.data;
      const viewEmployerCreated: IViewEmployer = {
        employer: employerFetched,
        status: jobStatus,
      };
      setViewEmployer(viewEmployerCreated);
      router.push('/candidates/dashboard/offers-received/view-employer');
    } catch (error) {}
  }, []);

  const handleFavoriteChange = useCallback(async () => {
    try {
      const data: IChangeOfferFavoriteStatus = {
        job_offer_id: offer.job_offer_id,
        favorite: !isFavorite ? 1 : 0,
      };

      if (favorite) {
        data.favorite = 0;
      }

      await changeOfferFavoriteStatus(data);
      refetch();
      setIsFavorite(!isFavorite);
    } catch (error) {}
  }, [isFavorite]);

  const handleAccept = useCallback(async () => {
    try {
      setIsLoading(true);
      await acceptOffer(offer.job_offer_id);
      refetch();
      setModalAccept(false);
      setIsLoading(false);
    } catch (error) {
      setIsLoading(false)
    }
  }, []);

  const handleReject = useCallback(async (reason: string) => {
    const data: IRejectOffer = {
      reason,
    };

    try {
      setIsLoading(true);
      await rejectOffer(offer.job_offer_id, data);
      refetch();
      setModalReject(false);
      setIsLoading(false);
    } catch (error) {
      setIsLoading(false)
    }
  }, []);

  const handleReportPosition = useCallback(async (description: string) => {
    if (!description) {
      return;
    }

    try {
      await reportOffer({ job_offer_id: reportId, description });
      setReportPanel(false);
    } catch (error) {}
  }, [reportId, reportPanel]);

  return (
    <div className="container offer-box">
      {reportPanel && (
        <ReportPanel
          title='Report offer'
          text='Our team will verify this soon as possible'
          onSubmit={handleReportPosition}
          onClose={() => setReportPanel(false)}
        />
      )}

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

      <div className="offer-box__top">
        <div className="offer-box__head">
          {!offer.isExpired && offer.status === SentJobOfferStatus.OfferSent && (
            <div className="offer-box__tag offer-box__tag--new">New</div>
          )}

          {offer.isExpired && offer.status === SentJobOfferStatus.OfferSent && (
            <div className="offer-box__tag offer-box__tag--red">Expired</div>
          )}

          {offer.status === SentJobOfferStatus.Accepted && (
            <div className="offer-box__tag">Accepted</div>
          )}

          {offer.status === SentJobOfferStatus.Rejected && (
            <div className="offer-box__tag offer-box__tag--red">Rejected</div>
          )}

          <div className="offer-box__icons">
            <div onClick={handleFavoriteChange} className={classNames("offer-box__favorite", {
              "offer-box__favorite--active": isFavorite || favorite
            })}/>

            <div
              onClick={() => {
                if (menuOfferId !== offer.job_offer_id) {
                  setMenuOfferId(offer.job_offer_id);
                  return;
                }

                setMenuOfferId(0);
              }}
              className="offer-box__menu"
            >
              <CircleMenu
                active={menuOfferId === offer.job_offer_id}
              />

              <div className={classNames("offer-box__menu-dropdown", {
                "offer-box__menu-dropdown--active": menuOfferId === offer.job_offer_id,
              })}>
                <OfferMenu
                  status={offer.status}
                  isExpired={offer.isExpired}
                  isFavorite={isFavorite || favorite}
                  onDetails= {() => {
                    setOfferReceived(offer);
                    router.push('/candidates/dashboard/offers-received/view-offer/');
                  }}
                  onReport={() => {
                    setReportId(offer.job_offer_id);
                    setReportPanel(true);
                  }}
                  onViewEmployer={() => {
                    handleViewEmployer(offer.Company.company_id , offer.status);
                  }}
                  onAccept={() => {
                    setModalAccept(true);
                  }}
                  onReject={() => {
                    setModalReject(true);
                  }}
                  onContact={() => router.push(`/candidates/dashboard/messages?chatRoomId=${offer.ChatToJobOffer?.chat_room_id}`)}
                  onFavoriteChange={handleFavoriteChange}
                />
              </div>
            </div>
          </div>
        </div>

        <div className="offer-box__text">
          {`Received on ${formatDateShort(offer.createdAt)}`}
        </div>

        <div className="offer-box__picture">
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

        <div className="offer-box__subline">
          <div className="offer-box__text">
            {`${offer.Company.name} - ${offer.Company.Country.name}`}
          </div>
        </div>

        <div className="offer-box__title">{offer.JobTitle.name}</div>

        <div className="offer-box__bar-container">
          <div
            style={offer.status === SentJobOfferStatus.OfferSent ? { width: `${percentageLeft}%`} : {}}
            className={classNames(
              "offer-box__bar",
              {
                "offer-box__bar--rejected": offer.status === SentJobOfferStatus.Rejected,
                "offer-box__bar--accepted": offer.status === SentJobOfferStatus.Accepted
              }
            )}
          />
        </div>

        <div className="offer-box__row">
          <div className="offer-box__pair">
            <div className="offer-box__text">Salary offered</div>
            <div className="offer-box__text offer-box__text--black">
              <span className="offer-box__text--bold">
                <span>{offer.salary.toLocaleString()}</span>
                {' '}
                <span>{offer.currency}</span>
              </span>
              <span>/</span>
              <span>{recurrencyNew[offer.recurrency]}</span>
            </div>
          </div>

          {((offer?.status === SentJobOfferStatus.OfferSent) && !offer.isExpired) && (
            <div className="offer-box__pair offer-box__pair--last">
              <div className="offer-box__text">Due date</div>
              <div className="offer-box__text">{formatDateShort(offer.due_date)}</div>
            </div>
          )}

          {((offer?.status === SentJobOfferStatus.OfferSent) && offer.isExpired) && (
            <div className="offer-box__pair offer-box__pair--last">
              <div className="offer-box__text">Expired on</div>
              <div className="offer-box__text">{formatDateShort(offer.due_date)}</div>
            </div>
          )}

          {(offer?.status === SentJobOfferStatus.Accepted) && (
            <div className="offer-box__pair offer-box__pair--last">
              <div className="offer-box__text">Accepted on</div>
              <div className="offer-box__text">{formatDateShort(offer.accepted_rejected_on || String(new Date()))}</div>
            </div>
          )}

          {(offer?.status === SentJobOfferStatus.Rejected ) && (
            <div className="offer-box__pair offer-box__pair--last">
              <div className="offer-box__text">Rejected on</div>
              <div className="offer-box__text">{formatDateShort(offer.accepted_rejected_on || String(new Date()))}</div>
            </div>
          )}
        </div>
      </div>

      <div className="offer-box__bottom">
        <div className="offer-box__btn">
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
      </div>
    </div>
  )
}


