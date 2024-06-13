'use client';
import '../../Positions/Positions.scss';
import '../Offers.scss';
import { useCallback, useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useRecoilState, useSetRecoilState } from 'recoil';
import { IJobPositionLimitCreated, JobPositionsLimitCreatedStore } from '@/store/jobPositionStore';
import { AxiosResponse } from 'axios';
import { getLimitCountPositions } from '@/services/api/jobPosition.service';
import classNames from 'classnames';
import { ButtonColor } from '@/types/ButtonColor';
import { IOfferReceived, getOffersReceived } from '@/services/api/offers.service';
import { SentJobOfferStatus } from '@/services/api/serachWorkers.service';
import { CandidateHeaderMessageStore, CandidateHeaderMessages } from '@/store/headerStore';
import { ButtonIcon, ButtonWithIcon } from '../../utils/ButtonWihIcon';
import { OfferBox } from '../OfferBox';

export const FavoriteOffers = () => {
  const [offers, setOffers] = useState<IOfferReceived[] | null>(null);
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
      const resp: AxiosResponse<any, any> = await getOffersReceived(`?favorite=1`);
      const data: IOfferReceived[]  = resp.data.data.data;
      setOffers(data.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()));
    } catch (error) {}
  }, []);

  useEffect(() => {
    setCandidateHeaderMessage(CandidateHeaderMessages.Favorites);
    if (!positionsLimitCreated) fetchLimitCountPositions();
    if (!offers) fetchOffers();
  }, []);

  return (
    <div className="offers">
      <div className="positions">
        <div className="positions__top">
          <div className="positions__top-left"/>

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
          {offers?.map(offer => (
            <div key={offer.job_offer_id} className="offers__item">
              <OfferBox favorite refetch={fetchOffers} offer={offer} />
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

