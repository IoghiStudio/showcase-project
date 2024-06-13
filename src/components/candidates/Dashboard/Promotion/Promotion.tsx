'use client';
import '../Positions/Positions.scss';
import classNames from 'classnames';
import { useRecoilState, useSetRecoilState } from 'recoil';
import { useCallback, useEffect, useState } from 'react';
import { AxiosResponse } from 'axios';
import { ButtonIcon, ButtonWithIcon } from '../utils/ButtonWihIcon';
import { ButtonColor } from '@/types/ButtonColor';
import { useRouter } from 'next/navigation';
import { PromotedPositionsStore } from '@/store/promotionsStore';
import { IPromotedPosition, getPromotedPositions } from '@/services/api/promotedPositions.service';
import { PromotionBox } from './PromotionBox';
import { IJobPositionLimitCreated, JobPositionsLimitCreatedStore } from '@/store/jobPositionStore';
import { getLimitCountPositions } from '@/services/api/jobPosition.service';
import { removeDuplicates } from '@/components/utils/utils';
import { CandidateHeaderMessageStore, CandidateHeaderMessages } from '@/store/headerStore';

enum PromotionFilter {
  All,
  Active,
  Paused,
  Ended,
};

interface IPromotionsFilter {
  id: number,
  text: string,
  filter: PromotionFilter,
};

const promotionsFilters: IPromotionsFilter[] = [
  {
    id: 1,
    text: 'All promotions',
    filter: PromotionFilter.All
  },
  {
    id: 2,
    text: 'Active',
    filter: PromotionFilter.Active
  },
  {
    id: 3,
    text: 'Paused',
    filter: PromotionFilter.Paused
  },
  {
    id: 4,
    text: 'Ended',
    filter: PromotionFilter.Ended
  },
]

export const Promotion = () => {
  const [promotedPositions, setPromotedPositions] = useRecoilState(PromotedPositionsStore);
  const [filteredPromotions, setFilteredPromotions] = useState<IPromotedPosition[] | null>(null);
  const [currentFilter, setCurrentFilter] = useState<PromotionFilter>(PromotionFilter.All);
  const [positionsLimitCreated, setPositionsLimitCreated] = useRecoilState(JobPositionsLimitCreatedStore);
  const router = useRouter();
  const setCandidateHeaderMessage = useSetRecoilState(CandidateHeaderMessageStore);

  const fetchPromotedPositions = async () => {
    try {
      const resp: AxiosResponse<any, any> = await getPromotedPositions();
      const data: IPromotedPosition[] = resp.data.data.data;
      setPromotedPositions(data);
      console.log(data);
    } catch (error) {}
  };

    const fetchLimitCountPositions = useCallback(async () => {
    try {
      const resp: AxiosResponse<any, any> = await getLimitCountPositions();
      const data: IJobPositionLimitCreated = resp.data.data.data;
      setPositionsLimitCreated(data);
    } catch (error) {}
  }, []);

  useEffect(() => {
    setCandidateHeaderMessage(CandidateHeaderMessages.Promotion);
    if (!positionsLimitCreated) fetchLimitCountPositions();
    if (!promotedPositions) fetchPromotedPositions();
  }, []);

  useEffect(() => {
    if (currentFilter === PromotionFilter.All) {
      setFilteredPromotions(promotedPositions);
    }

    if (currentFilter === PromotionFilter.Active) {
      const newPromotions = promotedPositions?.filter(p => p.status === 'ACTIVE') || [];
      setFilteredPromotions(newPromotions)
    }

    if (currentFilter === PromotionFilter.Paused) {
      const newPromotions = promotedPositions?.filter(p => p.status === 'PAUSED') || [];
      setFilteredPromotions(newPromotions)
    }

    if (currentFilter === PromotionFilter.Ended) {
      const newPromotions = promotedPositions?.filter(p => p.status === 'ENDED') || [];
      setFilteredPromotions(newPromotions)
    }
  }, [currentFilter, promotedPositions]);

  return (
    <div className="positions">
      <div className="positions__top">
        <div className="positions__top-left">
          {promotionsFilters.map(p => (
            <div
              key={p.id}
              onClick={() => setCurrentFilter(p.filter)}
              className={classNames("positions__filter", {
                "positions__filter--active": currentFilter === p.filter
              })}
            >
              {p.text}
            </div>
          ))}
        </div>

        <div className="positions__top-right">
          <div className="positions__active-info">
            <div className="positions__active-info-count">
              {`${removeDuplicates((promotedPositions?.filter(p => p.status === 'ACTIVE') || []), 'job_position_id').length || 0}/${positionsLimitCreated?.active_job_position || 0}`}
            </div>

            <div className="positions__active-info-text">
              Active promoted jobs
            </div>
          </div>


          <div
            onClick={() => router.push('/candidates/dashboard/promotion/new/')}
            className="positions__button"
          >
            <ButtonWithIcon
              color={ButtonColor.White}
              bgColor={ButtonColor.Blue}
              borderColor={ButtonColor.Blue}
              icon={ButtonIcon.Plus}
              text='PROMOTE A JOB'
            />
          </div>
        </div>
      </div>

      <div className="positions__list">
        {filteredPromotions?.map(promotion => (
          <div key={promotion.job_position_promotion_id} className="positions__item">
            <PromotionBox promotion={promotion} />
          </div>
        ))}
      </div>
    </div>
  )
}
