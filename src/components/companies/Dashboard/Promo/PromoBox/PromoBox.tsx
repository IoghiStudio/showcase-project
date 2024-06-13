'use client';
import '../../../../candidates/Dashboard/Positions/PositionBox/PositionBox.scss';
import { IFullPosition, IPositionStatus, deletePosition, getLimitCountPositions, getPositions, updatePositionStatus } from '@/services/api/jobPosition.service';
import { useCallback, useEffect, useState } from 'react';
import classNames from 'classnames';
import { useRecoilState, useSetRecoilState } from 'recoil';
import { MenuAnnounceIdStore, MenuPositionIdStore, MenuPromoJobIdStore } from '@/store/menuOpenStore';
import { IJobPositionLimitCreated, JobPositionIdStore, JobPositionsLimitCreatedStore, JobPositionsStore } from '@/store/jobPositionStore';
import { AxiosResponse } from 'axios';
import { useRouter } from 'next/navigation';
import { PositionToPromoteStore, PromotedPositionsStore } from '@/store/promotionsStore';
import { IPromotedPosition, getPromotedPositions } from '@/services/api/promotedPositions.service';
import { formatDateShort } from '@/components/utils/utils';
import { AnnounceOneStore, AnnounceStatus, AnnouncesActiveStore, AnnouncesStore, IAnnounce } from '@/store/announceStore';
import { deleteAnnounce, getAnnounces, updateAnnounceStatus } from '@/services/api/job.service';
import { IWarnModalButtonColor, WarnModal } from '@/components/candidates/Dashboard/utils/WarnModal/WarnModal';
import { Triple, TripleIcon } from '@/components/candidates/Dashboard/Positions/Triple';
import { CircleMenu } from '@/components/candidates/Dashboard/utils/MenuCircle/CircleMenu';
import { AnnounceToPromoteStore, IPromoJob, PromoJobStatus, PromotedAnnounceStore, PromotedAnnouncesActiveStore, PromotedAnnouncesStore } from '@/store/promoAnnounceStore';
import { deletePromotedJob, getPromotedJobs, updatePromotedJobStatus } from '@/services/api/promoteJob.service';
import { PromoMenu } from '../PromoMenu';
import { CandidateHeaderMessageStore, CandidateHeaderMessages } from '@/store/headerStore';

type Props = {
  promotion: IPromoJob;
};

export const PromoBox: React.FC<Props> = ({ promotion }) => {
  const setCandidateHeaderMessage = useSetRecoilState(CandidateHeaderMessageStore);
  const [menuPromoJobId, setMenuPromoJobId] = useRecoilState(MenuPromoJobIdStore);
  const setPromotions = useSetRecoilState(PromotedAnnouncesStore);
  const setPromotion = useSetRecoilState(PromotedAnnounceStore);
  const setActivePromotions = useSetRecoilState(PromotedAnnouncesActiveStore);
  // const setPromotion = useSetRecoilState(Promoted);
  const setAnnounces = useSetRecoilState<IAnnounce[] | null>(AnnouncesStore);
  const router = useRouter();

  useEffect(() => {
    setCandidateHeaderMessage(CandidateHeaderMessages.Promotion);
    return () => setMenuPromoJobId(0);
  }, []);

  const fetchAnnounces = useCallback(async () => {
    try {
      const resp: AxiosResponse<any, any> = await getAnnounces(`?page=${1}&pageSize=${10}`);
      const data: IAnnounce[] = resp.data.data.data;
      setAnnounces(data);
    } catch (error) {}
  }, []);

  const fetchPromotedAnnounces = useCallback(async () => {
    try {
      const resp: AxiosResponse<any, any> = await getPromotedJobs();
      const data: IPromoJob[] = resp.data.data.data;
      console.log(data);
      setPromotions(data);
      setActivePromotions(data.filter(an => an.status === PromoJobStatus.Active).length);
    } catch (error) {}
  }, []);

  const updateStatus = useCallback(async (id: number, status: PromoJobStatus) => {
    setMenuPromoJobId(0);

    try {
      await updatePromotedJobStatus(id, {status});
      fetchAnnounces();
      fetchPromotedAnnounces();
    } catch (error) {}
  }, []);

  const handleEdit = useCallback((promo: IPromoJob) => {
    setPromotion(promo);
    setMenuPromoJobId(0);
    router.push('/dashboard/promotion/edit/');
  }, []);

  const handleDeletePromotion = useCallback(async (promoId: number) => {
    try {
      setMenuPromoJobId(0);
      await deletePromotedJob(promoId);
      fetchPromotedAnnounces();
      fetchAnnounces();
    } catch (error) {}
  }, []);

  return (
    <div className="container position-box">
      <div className="position-box__left">
        <div className="position-box__date position-box__custom-name">
          {promotion.Job.custom_name}
        </div>

        <div className="position-box__title">
          {promotion.Job.JobTitle?.name || ''}
        </div>

        <div className="position-box__date">
          {`Expire on ${formatDateShort(promotion.expires_at || '')}`}
        </div>
      </div>

      <div className="position-box__mid">
        <div className="position-box__triple-container">
          <div className="position-box__triple">
            <Triple
              name={'Views'}
              count={promotion.Job.views || 0}
              icon={TripleIcon.Views}
              />
          </div>

          <div className="position-box__triple position-box__triple--second">
            <Triple
              name={'Clicks'}
              count={promotion.Job.clicks || 0}
              icon={TripleIcon.Clicks}
              />
          </div>
        </div>

        <div className="position-box__triple-container position-box__triple-container--last">
          <div className="position-box__triple">
            <Triple
              name={'Saved'}
              count={promotion.Job.saved || 0}
              icon={TripleIcon.Saved}
              />
          </div>

          <div className="position-box__triple position-box__triple--last position-box__triple--second">
            <Triple
              name={'Applied'}
              count={promotion.Job.applied || 0}
              icon={TripleIcon.Offers}
            />
          </div>
        </div>

      </div>

      <div className="position-box__right">
        <div className="position-box__tags">
          {false && (
            <div className="position-box__tag position-box__tag--promoted">PROMOTED</div>
          )}

          <div className={classNames("position-box__tag", {
            "position-box__tag--paused": promotion.status === PromoJobStatus.Paused
          })}>
            {promotion.status === PromoJobStatus.Active && (
              'ACTIVE'
            )}

            {promotion.status === PromoJobStatus.Paused && (
              'PAUSED'
            )}
          </div>
        </div>

        <div
          onClick={() => {
            if (menuPromoJobId !== promotion.job_promotion_id) {
              setMenuPromoJobId(promotion.job_promotion_id || 0);
              return;
            }

            setMenuPromoJobId(0);
          }}
          className="position-box__menu"
        >
          <CircleMenu
            active={menuPromoJobId === promotion.job_promotion_id}
          />

          <div className={classNames("position-box__menu-dropdown", {
            "position-box__menu-dropdown--active": menuPromoJobId === promotion.job_promotion_id,
          })}>
            <PromoMenu
              status={promotion.status || ''}
              onDelete={() => handleDeletePromotion(promotion.job_promotion_id)}
              onEdit={() => handleEdit(promotion)}
              onActivate={() => {
                updateStatus(promotion.job_promotion_id || 0, PromoJobStatus.Active);
              }}
              onPause={() => {
                updateStatus(promotion.job_promotion_id || 0, PromoJobStatus.Paused);
              }}
            />
          </div>
        </div>
      </div>
    </div>
  )
}
