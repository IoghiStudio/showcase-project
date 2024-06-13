'use client';
import './PositionBox.scss';
import { IFullPosition, IPositionStatus, deletePosition, getLimitCountPositions, getPositions, updatePositionStatus } from '@/services/api/jobPosition.service';
import { Triple, TripleIcon } from '../Triple';
import { useCallback, useEffect, useState } from 'react';
import { CircleMenu } from '../../utils/MenuCircle/CircleMenu';
import { PositionMenu } from '../PositionMenu';
import classNames from 'classnames';
import { useRecoilState, useRecoilValue, useSetRecoilState } from 'recoil';
import { MenuPositionIdStore } from '@/store/menuOpenStore';
import { IJobPositionLimitCreated, JobPositionIdStore, JobPositionsLimitCreatedStore, JobPositionsStore } from '@/store/jobPositionStore';
import { AxiosResponse } from 'axios';
import { useRouter } from 'next/navigation';
import { PositionToPromoteStore, PromotedPositionsStore } from '@/store/promotionsStore';
import { IWarnModalButtonColor, WarnModal } from '../../utils/WarnModal/WarnModal';
import { IPromotedPosition, getPromotedPositions } from '@/services/api/promotedPositions.service';
import { formatDateShort } from '@/components/utils/utils';
import { generateWorkerCV } from '@/services/api/serachWorkers.service';
import { UserDataStore } from '@/store/userDataStore';

type Props = {
  position: IFullPosition;
};

export const PositionBox: React.FC<Props> = ({ position }) => {
  const [menuPositionId, setMenuPositionId] = useRecoilState(MenuPositionIdStore);
  const setPromotedPositions = useSetRecoilState(PromotedPositionsStore);
  const setPositionToPromote = useSetRecoilState(PositionToPromoteStore);
  const setJobPositionId = useSetRecoilState(JobPositionIdStore);
  const setPositionsLimitCreated = useSetRecoilState(JobPositionsLimitCreatedStore);
  const setJobPositions = useSetRecoilState(JobPositionsStore);
  const router = useRouter();
  const userData = useRecoilValue(UserDataStore);

  const [pauseModal, setPauseModal] = useState<boolean>(false);
  const [deleteModal, setDeleteModal] = useState<boolean>(false);

  useEffect(() => {
    return () => setMenuPositionId(0);
  }, []);

  const fetchPromotedPositions = async () => {
    try {
      const resp: AxiosResponse<any, any> = await getPromotedPositions();
      const data: IPromotedPosition[] = resp.data.data.data;
      setPromotedPositions(data);
    } catch (error) {}
  };

  const fetchPositions = useCallback(async () => {
    try {
      const resp: AxiosResponse<any, any> = await getPositions();
      const data: IFullPosition[] = resp.data.data.data;
      setJobPositions(data);
    } catch (error) {}
  }, []);

  useEffect(() => {
    if (!position.createdAt) return;
  }, []);

  const updateStatus = useCallback(async (posId: number, status: string,) => {
    setMenuPositionId(0);
    setPauseModal(false);

    const data: IPositionStatus = {
      status: status
    };

    try {
      await updatePositionStatus(posId, data);
      fetchPositions();
      fetchPromotedPositions();
      fetchLimitCountPositions();
    } catch (error) {}
  }, []);

  const fetchLimitCountPositions = useCallback(async () => {
    try {
      const resp: AxiosResponse<any, any> = await getLimitCountPositions();
      const data: IJobPositionLimitCreated = resp.data.data.data;
      setPositionsLimitCreated(data);
    } catch (error) {}
  }, []);

  const handleEdit = useCallback((posId: number) => {
    setJobPositionId(posId);
    setMenuPositionId(0);
    router.push('/candidates/dashboard/positions/edit/');
  }, []);

  const handleDeletePosition = useCallback(async (posId: number) => {
    try {
      setMenuPositionId(0);
      await deletePosition(posId);
      fetchPositions();
      fetchPromotedPositions();
      setPositionToPromote(null);
      fetchLimitCountPositions();
    } catch (error) {}
  }, []);

  const handlePromotion = useCallback((position: IFullPosition) => {
    setPositionToPromote(position);
    router.push('/candidates/dashboard/promotion/new/');
    setMenuPositionId(0);
  }, []);

  const handleDownloadCV = useCallback(async () => {
    if (!position) return;
    if (!userData) return;

    try {
      const resp: AxiosResponse<any, any> = await generateWorkerCV({ jobPositionId: position.job_position_id || 0, candidateId: userData.candidate_id});
      const pdfBlob: Blob = new Blob([resp?.data], { type: "application/pdf" });
      const blobUrl: HTMLAnchorElement = document?.createElement("a");
      blobUrl.href = window?.URL?.createObjectURL(pdfBlob);
      window?.open(blobUrl.href, "_blank");
    } catch (error) {}
  }, [position, userData]);


  return (
    <div className="container position-box">
      {deleteModal && (
        <WarnModal
          title='Delete position ?'
          text='If you promoted this position, the promotion will also be deleted with no refund.'
          cancelText='cancel'
          confirmText='delete'
          onCancel={() => setDeleteModal(false)}
          onConfirm={() => handleDeletePosition(position.job_position_id || 0)}
          buttonColor={IWarnModalButtonColor.Red}
          />
          )}

      {pauseModal && (
        <WarnModal
          title='Pause position ?'
          text='If you have a promotion associated with this position, the promotion will also be paused. But you can re-activate them at any time!'
          cancelText='cancel'
          confirmText='pause'
          onCancel={() => setPauseModal(false)}
          onConfirm={() => updateStatus(position.job_position_id || 0, 'PAUSED')}
          buttonColor={IWarnModalButtonColor.Yellow}
        />
      )}

      <div onClick={handleDownloadCV} className="position-box__preview-cv">
        Preview CV
      </div>

      <div className="position-box__left">
        <div className="position-box__title">
          {position.JobTitle?.name || ''}
        </div>

        <div className="position-box__date">
          {`Created on ${formatDateShort(position.createdAt || '')}`}
        </div>
      </div>

      <div className="position-box__mid">
        <div className="position-box__triple-container">
          <div className="position-box__triple">
            <Triple
              name={'Views'}
              count={position.views || 0}
              icon={TripleIcon.Views}
              />
          </div>

          <div className="position-box__triple position-box__triple--second">
            <Triple
              name={'Clicks'}
              count={position.clicked || 0}
              icon={TripleIcon.Clicks}
              />
          </div>
        </div>

        <div className="position-box__triple-container position-box__triple-container--last">
          <div className="position-box__triple">
            <Triple
              name={'Saved'}
              count={position.saved || 0}
              icon={TripleIcon.Saved}
              />
          </div>

          <div className="position-box__triple position-box__triple--last position-box__triple--second">
            <Triple
              name={'Offers'}
              count={position.offers || 0}
              icon={TripleIcon.Offers}
            />
          </div>
        </div>
      </div>

      <div className="position-box__right">
        <div className="position-box__tags">
          {position.promoted && (
            <div className="position-box__tag position-box__tag--promoted">PROMOTED</div>
          )}

          <div className={classNames("position-box__tag", {
            "position-box__tag--paused": position.status === 'PAUSED'
          })}>
            {position.status}
          </div>
        </div>

        <div
          onClick={() => {
            if (menuPositionId !== position.job_position_id) {
              setMenuPositionId(position.job_position_id || 0);
              return;
            }

            setMenuPositionId(0);
          }}
          className="position-box__menu"
        >
          <CircleMenu
            active={menuPositionId === position.job_position_id}
          />

          <div className={classNames("position-box__menu-dropdown", {
            "position-box__menu-dropdown--active": menuPositionId === position.job_position_id,
          })}>
            <PositionMenu
              onPromote={() => handlePromotion(position)}
              onEdit={() => handleEdit(position.job_position_id || 0)}
              onDelete={() => {
                setDeleteModal(true);
              }}
              onActivate={() => {
                updateStatus(position.job_position_id || 0, 'ACTIVE');
              }}
              onPause={() => {
                setPauseModal(true);
              }}
              status={position.status || ''}
            />
          </div>
        </div>
      </div>
    </div>
  )
}
