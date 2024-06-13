'use client';
import '../../Positions/PositionBox/PositionBox.scss';
import classNames from 'classnames';
import { getLimitCountPositions } from '@/services/api/jobPosition.service';
import { useCallback, useEffect } from 'react';
import { CircleMenu } from '../../utils/MenuCircle/CircleMenu';
import { useRecoilState, useSetRecoilState } from 'recoil';
import { MenuPromotedPositionIdStore } from '@/store/menuOpenStore';
import { IJobPositionLimitCreated, JobPositionsLimitCreatedStore} from '@/store/jobPositionStore';
import { AxiosResponse } from 'axios';
import { useRouter } from 'next/navigation';
import { IPromotedPosition, IPromotedPositionStatus, deletePromotedPosition, getPromotedPositions, updatePromotedPositionStatus } from '@/services/api/promotedPositions.service';
import { PromotionMenu } from '../PromotionMenu';
import { PromotedPositionsStore } from '@/store/promotionsStore';
import { FlagIcon } from '@/components/utils/FlagIcon';
import { addDaysToDate, formatDateShort } from '@/components/utils/utils';

type Props = {
  promotion: IPromotedPosition;
};

export const PromotionBox: React.FC<Props> = ({ promotion }) => {
  const [menuPromotedPositionId, setMenuPromotedPositionId] = useRecoilState(MenuPromotedPositionIdStore);
  const setPositionsLimitCreated = useSetRecoilState(JobPositionsLimitCreatedStore);
  const setPromotedPositions = useSetRecoilState(PromotedPositionsStore);
  const router = useRouter();

  const fetchPromotions = useCallback(async () => {
    try {
      const resp: AxiosResponse<any, any> = await getPromotedPositions();
      const data: IPromotedPosition[] = resp.data.data.data;
      setPromotedPositions(data);
    } catch (error) {}
  }, []);

  useEffect(() => {

    return () => setMenuPromotedPositionId(0);
  }, []);

  const updateStatus = useCallback(async (promoId: number, status: string,) => {
    setMenuPromotedPositionId(0);

    const data: IPromotedPositionStatus = {
      status: status
    };

    try {
      await updatePromotedPositionStatus(promoId, data);
      fetchPromotions();
    } catch (error) {}
  }, []);

  const fetchLimitCountPositions = useCallback(async () => {
    try {
      const resp: AxiosResponse<any, any> = await getLimitCountPositions();
      const data: IJobPositionLimitCreated = resp.data.data.data;
      setPositionsLimitCreated(data);
    } catch (error) {}
  }, []);

  const handleDeletePromotion = useCallback(async (promoId: number) => {
    try {
      setMenuPromotedPositionId(0);
      await deletePromotedPosition(promoId);
      fetchPromotions();
      fetchLimitCountPositions();
    } catch (error) {}
  }, []);

  return (
    <div className="container position-box position-box--promotion">
      <div className="position-box__left">
        <div className="position-box__title">
          {promotion.JobPosition.JobTitle?.name || ''}
        </div>

        <div className="position-box__date">
          {`Expire on ${formatDateShort(addDaysToDate(promotion.createdAt, 30))}`}
        </div>
      </div>

      <div className="position-box__mid">
        <div className="position-box__countries">
          <div className="position-box__countries-list">
            {promotion.countries.map((country, index) => (
              <div
                key={country.job_position_promotion_country_id}
                className={classNames("position-box__country", {
                  "position-box__country--0": index === 0,
                  "position-box__country--1": index === 1,
                  "position-box__country--2": index === 2,
                  "position-box__country--3": index === 3,
                  "position-box__country--4": index === 4,
                  "position-box__country--hidden": index > 4,
                })}
              >
                <div className="position-box__flag">
                  <FlagIcon code={country.Country.alpha_2} size={40}/>
                </div>
              </div>
            ))}
          </div>

          {promotion.countries.length > 5 && (
            <div className="position-box__country position-box__country--plus"/>
          )}

          <div className={classNames("position-box__countries-info", {
            "position-box__countries-info--0": promotion.countries.length === 0,
            "position-box__countries-info--1": promotion.countries.length === 1,
            "position-box__countries-info--2": promotion.countries.length === 2,
            "position-box__countries-info--3": promotion.countries.length === 3,
            "position-box__countries-info--4": promotion.countries.length === 4,
            "position-box__countries-info--5": promotion.countries.length === 5,
            "position-box__countries-info--plus": promotion.countries.length > 5,
          })}>
            <div className="position-box__countries-count">
              {promotion.countries.length}
            </div>

            <div className="position-box__countries-text">
              Countries
            </div>
          </div>
        </div>
      </div>

      <div className="position-box__right position-box__right--promo">
        <div className="position-box__tags">
          <div className={classNames("position-box__tag", {
            "position-box__tag--paused": promotion.status === 'PAUSED'
          })}>
            {promotion.status}
          </div>
        </div>

        <div
          onClick={() => {
            if (menuPromotedPositionId !== promotion.job_position_promotion_id) {
              setMenuPromotedPositionId(promotion.job_position_promotion_id || 0);
              return;
            }

            setMenuPromotedPositionId(0);
          }}
          className="position-box__menu"
        >
          <CircleMenu
            active={menuPromotedPositionId === promotion.job_position_promotion_id}
          />

          <div className={classNames("position-box__menu-dropdown", {
            "position-box__menu-dropdown--active": menuPromotedPositionId === promotion.job_position_promotion_id,
          })}>
            <PromotionMenu
              onDelete={() => handleDeletePromotion(promotion.job_position_promotion_id || 0)}
              onActivate={() => {
                updateStatus(promotion.job_position_promotion_id || 0, 'ACTIVE');
              }}
              onPause={() => {
                updateStatus(promotion.job_position_promotion_id || 0, 'PAUSED');
              }}
              status={promotion.status || ''}
            />
          </div>
        </div>
      </div>
    </div>
  )
}
