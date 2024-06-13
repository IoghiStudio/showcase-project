'use client';
import '../../../../candidates/Dashboard/Positions/PositionBox/PositionBox.scss';
import { useCallback, useEffect, useState } from 'react';
import classNames from 'classnames';
import { useRecoilState, useSetRecoilState } from 'recoil';
import { MenuAnnounceIdStore, MenuPositionIdStore } from '@/store/menuOpenStore';
import { AxiosResponse } from 'axios';
import { useRouter } from 'next/navigation';
import { formatDateShort } from '@/components/utils/utils';
import { AnnounceOneStore, AnnounceStatus, AnnouncesActiveStore, AnnouncesStore, IAnnounce } from '@/store/announceStore';
import { deleteAnnounce, getAnnounces, updateAnnounceStatus } from '@/services/api/job.service';
import { IWarnModalButtonColor, WarnModal } from '@/components/candidates/Dashboard/utils/WarnModal/WarnModal';
import { Triple, TripleIcon } from '@/components/candidates/Dashboard/Positions/Triple';
import { CircleMenu } from '@/components/candidates/Dashboard/utils/MenuCircle/CircleMenu';
import { AnnMenu } from '../AnnMenu';
import { AnnounceToPromoteStore, IPromoJob, PromotedAnnouncesStore } from '@/store/promoAnnounceStore';
import { getPromotedJobs } from '@/services/api/promoteJob.service';

type Props = {
  announce: IAnnounce;
  pageSize: number;
  currentPage: number;
};

export const AnnBox: React.FC<Props> = ({
  announce,
  pageSize,
  currentPage,
}) => {
  const [menuAnnounceId, setMenuAnnounceId] = useRecoilState(MenuAnnounceIdStore);
  const setPromotedAnnounces = useSetRecoilState(PromotedAnnouncesStore);
  const setAnnounceToPromote = useSetRecoilState(AnnounceToPromoteStore);
  const setAnnounce = useSetRecoilState(AnnounceOneStore);
  const setAnnounces = useSetRecoilState(AnnouncesStore);
  const setActiveAnnounces = useSetRecoilState<number>(AnnouncesActiveStore);
  const router = useRouter();

  const [pauseModal, setPauseModal] = useState<boolean>(false);
  const [deleteModal, setDeleteModal] = useState<boolean>(false);

  useEffect(() => {
    return () => setMenuAnnounceId(0);
  }, []);

  const fetchPromotedAnnounces = async () => {
    try {
      const resp: AxiosResponse<any, any> = await getPromotedJobs();
      const data: IPromoJob[] = resp.data.data.data;
      setPromotedAnnounces(data);
    } catch (error) {}
  };

  const fetchAnnounces = useCallback(async () => {
    try {
      const resp: AxiosResponse<any, any> = await getAnnounces(`?page=${currentPage}&pageSize=${pageSize}`);
      const data: IAnnounce[] = resp.data.data.data;
      setAnnounces(data);
      setActiveAnnounces(resp.data.data.count);
      // CHANGE TO COUNT_ACTIVE
    } catch (error) {}
  }, []);

  const updateStatus = useCallback(async (annId: number, status: AnnounceStatus) => {
    setMenuAnnounceId(0);
    setPauseModal(false);

    try {
      await updateAnnounceStatus(annId, status);
      fetchAnnounces();
      fetchPromotedAnnounces();
    } catch (error) {}
  }, []);

  const handleEdit = useCallback((announce: IAnnounce) => {
    setAnnounce(announce);
    setMenuAnnounceId(0);
    router.push('/dashboard/announcements/edit/');
  }, []);

  const handleDeleteAnnounce = useCallback(async (annId: number) => {
    try {
      setMenuAnnounceId(0);
      await deleteAnnounce(annId);
      fetchAnnounces();
      fetchPromotedAnnounces();
      setAnnounceToPromote(null);
    } catch (error) {}
  }, []);

  const handlePromotion = useCallback((announce: IAnnounce) => {
    setAnnounceToPromote(announce.job_id);
    router.push('/dashboard/promotion/new/');
    setMenuAnnounceId(0);
  }, []);

  return (
    <div className="container position-box position-box--ann">
      {deleteModal && (
        <WarnModal
          title='Delete announce ?'
          text='If you promoted this announce, the promotion will also be deleted with no refund.'
          cancelText='cancel'
          confirmText='delete'
          onCancel={() => setDeleteModal(false)}
          onConfirm={() => handleDeleteAnnounce(announce.job_id || 0)}
          buttonColor={IWarnModalButtonColor.Red}
          />
        )}

      {pauseModal && (
        <WarnModal
          title='Pause announce ?'
          text='If you have a promotion associated with this announcement, the promotion will also be paused. But you can re-activate them at any time!'
          cancelText='cancel'
          confirmText='pause'
          onCancel={() => setPauseModal(false)}
          onConfirm={() => updateStatus(announce.job_id || 0, AnnounceStatus.Closed)}
          buttonColor={IWarnModalButtonColor.Yellow}
        />
      )}

      <div className="position-box__left">
        <div className="position-box__date position-box__custom-name">
          {announce.custom_name}
        </div>

        <div className="position-box__title">
          {announce.JobTitle?.name || ''}
        </div>

        <div className="position-box__date">
          {`Created on ${formatDateShort(announce.createdAt || '')}`}
        </div>
      </div>

      <div className="position-box__mid">
        <div className="position-box__triple-container">
          <div className="position-box__triple">
            <Triple
              name={'Views'}
              count={announce.views || 0}
              icon={TripleIcon.Views}
              />
          </div>

          <div className="position-box__triple position-box__triple--second">
            <Triple
              name={'Clicks'}
              count={announce.clicks || 0}
              icon={TripleIcon.Clicks}
              />
          </div>
        </div>

        <div className="position-box__triple-container position-box__triple-container--last">
          <div className="position-box__triple">
            <Triple
              name={'Saved'}
              count={announce.saved || 0}
              icon={TripleIcon.Saved}
              />
          </div>

          <div className="position-box__triple position-box__triple--last position-box__triple--second">
            <Triple
              name={'Applied'}
              count={announce.applied || 0}
              icon={TripleIcon.Offers}
            />
          </div>
        </div>

      </div>

      <div className="position-box__right">
        <div className="position-box__tags">
          {announce.promoted && (
            <div className="position-box__tag position-box__tag--promoted">PROMOTED</div>
          )}

          <div className={classNames("position-box__tag", {
            "position-box__tag--paused": announce.status === AnnounceStatus.Closed
          })}>
            {announce.status === AnnounceStatus.Open && (
              'ACTIVE'
            )}

            {announce.status === AnnounceStatus.Closed && (
              'PAUSED'
            )}
          </div>
        </div>

        <div
          onClick={() => {
            if (menuAnnounceId !== announce.job_id) {
              setMenuAnnounceId(announce.job_id || 0);
              return;
            }

            setMenuAnnounceId(0);
          }}
          className="position-box__menu"
        >
          <CircleMenu
            active={menuAnnounceId === announce.job_id}
          />

          <div className={classNames("position-box__menu-dropdown", {
            "position-box__menu-dropdown--active": menuAnnounceId === announce.job_id,
          })}>
            <AnnMenu
              isPromoted={announce.promoted}
              onPreview={() => {}}
              onPromote={() => handlePromotion(announce)}
              onEdit={() => handleEdit(announce)}
              onDelete={() => {
                setDeleteModal(true);
              }}
              onActivate={() => {
                updateStatus(announce.job_id || 0, AnnounceStatus.Open);
              }}
              onPause={() => {
                setPauseModal(true);
              }}
              status={announce.status || ''}
            />
          </div>
        </div>
      </div>
    </div>
  )
}
