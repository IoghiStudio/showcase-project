'use client';
import { useRecoilState, useSetRecoilState } from 'recoil';
import '../../../candidates/Dashboard/Positions/Positions.scss';
import { CandidateHeaderMessageStore, CandidateHeaderMessages } from '@/store/headerStore';
import { useCallback, useEffect, useState } from 'react';
import { IPromoJob, PromoJobStatus, PromotedAnnouncesActiveStore, PromotedAnnouncesStore } from '@/store/promoAnnounceStore';
import { getPromotedJobs } from '@/services/api/promoteJob.service';
import { AxiosResponse } from 'axios';
import { useRouter } from 'next/navigation';
import { ButtonIcon, ButtonWithIcon } from '@/components/candidates/Dashboard/utils/ButtonWihIcon';
import { ButtonColor } from '@/types/ButtonColor';
import classNames from 'classnames';
import { PromoBox } from './PromoBox';
// import { PromoBox } from './PromoBox';

enum PromoAnnounceFilter {
  All,
  Active,
  Paused,
  Expired
};

interface IPromoAnnounceFilter {
  id: number,
  text: string,
  filter: PromoAnnounceFilter,
};

const promoAnnounceFilters: IPromoAnnounceFilter[] = [
  {
    id: 1,
    text: 'All Promotions',
    filter: PromoAnnounceFilter.All
  },
  {
    id: 2,
    text: 'Active',
    filter: PromoAnnounceFilter.Active
  },
  {
    id: 3,
    text: 'Paused',
    filter: PromoAnnounceFilter.Paused
  },
  {
    id: 4,
    text: 'Expired',
    filter: PromoAnnounceFilter.Expired
  },
];

export const Promo = () => {
  const setCandidateHeaderMessage = useSetRecoilState(CandidateHeaderMessageStore);
  const [promotions, setPromotions] = useRecoilState<IPromoJob[] | null>(PromotedAnnouncesStore);
  const [activePromotions, setActivePromotions] = useState<number>(0);
  const [filteredPromotions, setFilteredPromotions] = useState<IPromoJob[] | null>(null);
  const [currentFilter, setCurrentFilter] = useState<PromoAnnounceFilter>(PromoAnnounceFilter.All);
  const router = useRouter();

  const fetchPromotedAnnounces = useCallback(async () => {
    try {
      const resp: AxiosResponse<any, any> = await getPromotedJobs();
      const data: IPromoJob[] = resp.data.data.data;
      setPromotions(data);
      console.log(data);
      setActivePromotions(data.filter(an => an.status === PromoJobStatus.Active).length);
      setFilteredPromotions(data);
    } catch (error) {}
  }, []);

  useEffect(() => {
    setCandidateHeaderMessage(CandidateHeaderMessages.Promotion);
    if (!promotions) fetchPromotedAnnounces();
  }, []);

  useEffect(() => {
    console.log(currentFilter)
    if (currentFilter === PromoAnnounceFilter.All) {
      setFilteredPromotions(promotions);
    }

    if (currentFilter === PromoAnnounceFilter.Active) {
      const newPromotions = promotions?.filter(a => a.status === PromoJobStatus.Active) || [];
      setFilteredPromotions(newPromotions)
    }

    if (currentFilter === PromoAnnounceFilter.Paused) {
      const newAnnounces = promotions?.filter(a => a.status === PromoJobStatus.Paused) || [];
      setFilteredPromotions(newAnnounces)
    }

    if (currentFilter === PromoAnnounceFilter.Expired) {
      setFilteredPromotions([]);
    }
  }, [currentFilter, promotions]);

  return (
    <div className="positions">
      <div className="positions__top">
        <div className="positions__top-left positions__top-left--column">
          {promoAnnounceFilters.map(f => (
            <div
              key={f.id}
              onClick={() => setCurrentFilter(f.filter)}
              className={classNames("positions__filter", {
                "positions__filter--active": currentFilter === f.filter
              })}
            >
              {f.text}
            </div>
          ))}
        </div>

        <div className="positions__top-right">
          <div className="positions__active-info">
            <div className="positions__active-info-count">
              {activePromotions}
            </div>

            <div className="positions__active-info-text">
              Active promotions
            </div>
          </div>

          <div
            className="positions__button"
            onClick={() => router.push('/dashboard/announcements/')}
          >
            <ButtonWithIcon
              color={ButtonColor.White}
              bgColor={ButtonColor.Blue}
              borderColor={ButtonColor.Blue}
              icon={ButtonIcon.Plus}
              text='PROMOTE JOB'
            />
          </div>
        </div>
      </div>

      <div className="positions__list">
        {filteredPromotions?.map(promotion => (
          <div key={promotion.job_promotion_id} className="positions__item">
            <PromoBox promotion={promotion} />
          </div>
        ))}
      </div>
    </div>
  )
}
