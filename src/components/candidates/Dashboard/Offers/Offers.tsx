'use client';
import '../../../candidates/Dashboard/Positions/Positions.scss';
import './Offers.scss';
import { useCallback, useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useRecoilState, useSetRecoilState } from 'recoil';
import { IJobPositionLimitCreated, JobPositionsLimitCreatedStore } from '@/store/jobPositionStore';
import { AxiosResponse } from 'axios';
import { getLimitCountPositions } from '@/services/api/jobPosition.service';
import classNames from 'classnames';
import { ButtonIcon, ButtonWithIcon } from '../utils/ButtonWihIcon';
import { ButtonColor } from '@/types/ButtonColor';
import { IOfferReceived, getOffersReceived } from '@/services/api/offers.service';
import { SentJobOfferStatus } from '@/services/api/serachWorkers.service';
import { OfferBox } from './OfferBox';
import { CandidateHeaderMessageStore, CandidateHeaderMessages } from '@/store/headerStore';
import { ReportPanel } from '@/components/companies/Dashboard/SearchWorkers/ReportPanel';
import { reportOffer } from '@/services/api/report.service';

enum OfferFilter {
  All,
  New,
  Accepted,
  Rejected,
  Expired,
};

interface IOfferFilter {
  id: number,
  text: string,
  filter: OfferFilter,
};

const offerFilters: IOfferFilter[] = [
  {
    id: 1,
    text: 'All job offers',
    filter: OfferFilter.All
  },
  {
    id: 2,
    text: 'New',
    filter: OfferFilter.New
  },
  {
    id: 3,
    text: 'Accepted',
    filter: OfferFilter.Accepted
  },
  {
    id: 4,
    text: 'Rejected',
    filter: OfferFilter.Rejected
  },
  {
    id: 5,
    text: 'Expired',
    filter: OfferFilter.Expired
  },
];

export const Offers = () => {
  const [offers, setOffers] = useState<IOfferReceived[] | null>(null);
  const [filteredOffers, setFilteredOffers] = useState<IOfferReceived[] | null>(null);
  const [currentFilter, setCurrentFilter] = useState<OfferFilter>(OfferFilter.All);
  const router = useRouter();
  const [positionsLimitCreated, setPositionsLimitCreated] = useRecoilState(JobPositionsLimitCreatedStore);
  const setCandidateHeaderMessage = useSetRecoilState(CandidateHeaderMessageStore);

  const fetchLimitCountPositions = useCallback(async () => {
    try {
      const resp: AxiosResponse<any, any> = await getLimitCountPositions();
      const data: IJobPositionLimitCreated = resp.data.data.data;
      setPositionsLimitCreated(data);
    } catch (error) {}
  }, []);

  const fetchOffers = useCallback(async () => {
    try {
      const resp: AxiosResponse<any, any> = await getOffersReceived('');
      const data: IOfferReceived[]  = resp.data.data.data;
      console.log(data);
      setOffers(data.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()));
    } catch (error) {}
  }, []);

  useEffect(() => {
    setCandidateHeaderMessage(CandidateHeaderMessages.Offers)
    if (!positionsLimitCreated) fetchLimitCountPositions();
    if (!offers) fetchOffers();
  }, []);

  useEffect(() => {
    if (currentFilter === OfferFilter.All) {
      setFilteredOffers(offers);
    }

    if (currentFilter === OfferFilter.New) {
      const newOffers = offers?.filter(o => o.status === SentJobOfferStatus.OfferSent && !o.isExpired) || [];
      setFilteredOffers(newOffers);
    }

    if (currentFilter === OfferFilter.Expired) {
      const newOffers = offers?.filter(o => o.status === SentJobOfferStatus.OfferSent && o.isExpired) || [];
      setFilteredOffers(newOffers);
    }

    if (currentFilter === OfferFilter.Accepted) {
      const newOffers = offers?.filter(o => o.status === SentJobOfferStatus.Accepted) || [];
      setFilteredOffers(newOffers);
    }

    if (currentFilter === OfferFilter.Rejected) {
      const newOffers = offers?.filter(o => o.status === SentJobOfferStatus.Rejected) || [];
      setFilteredOffers(newOffers);
    }

  }, [currentFilter, offers]);

  return (
    <div className="offers">
      <div className="positions">
        <div className="positions__top">
          <div className="positions__top-left">
            {offerFilters.map(f => (
              <div
                key={f.id}
                onClick={() => setCurrentFilter(f.filter)}
                className={classNames("positions__filter", {
                  "positions__filter--active": currentFilter === f.filter
                })}
              >
                {f.text}
              </div>
            ))
            }
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
              <div className="positions__button">
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

        <div className="offers__list">
          {filteredOffers?.map(offer => (
            <div key={offer.job_offer_id} className="offers__item">
              <OfferBox refetch={fetchOffers} offer={offer} />
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

