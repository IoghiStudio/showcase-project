'use client'
import '../../../../candidates/Dashboard/Positions/PositionMenu/PositionMenu.scss';
import classNames from 'classnames';
import { JobApplyStatus } from '@/store/jobStore';

type Props = {
  isEligibleToApply: boolean;
  status: string;
  isFavorite: boolean;
  onViewJob: () => void;
  onReport: () => void;
  onFavoriteChange: () => void;
  onSendCandidature: () => void;
  onViewEmployer: () => void;
  onContact: () => void;
};

export const JobMenu: React.FC<Props> = ({
  isEligibleToApply,
  status,
  isFavorite,
  onViewJob,
  onReport,
  onFavoriteChange,
  onSendCandidature,
  onViewEmployer,
  onContact,
}) => {
  return (
    <div className="position-menu">
      <div onClick={onViewJob} className="position-menu__item">
        <div className="position-menu__icon position-menu__icon--view-offer"/>

        <div className="position-menu__text">
          View job
        </div>
      </div>

      <div onClick={onViewEmployer} className="position-menu__item">
        <div className="position-menu__icon position-menu__icon--company"/>

        <div className="position-menu__text">
          View employer
        </div>
      </div>

      {status === 'null' && (
        <div onClick={onSendCandidature} className="position-menu__item">
          <div className="position-menu__icon position-menu__icon--send-offer"/>

          <div className="position-menu__text">
            Send candidature
          </div>
        </div>
      )}

      {status === JobApplyStatus.Accepted && (
        <div onClick={onContact} className="position-menu__item">
          <div className="position-menu__icon position-menu__icon--contact"/>

          <div className="position-menu__text">
            Contact employer
          </div>
        </div>
      )}

      {status === JobApplyStatus.Rejected && isEligibleToApply && (
        <div onClick={onSendCandidature} className="position-menu__item">
          <div className="position-menu__icon position-menu__icon--send-offer"/>

          <div className="position-menu__text">
            Send a new candidature
          </div>
        </div>
      )}

      <div onClick={onFavoriteChange} className="position-menu__item">
        <div className={classNames("position-menu__icon position-menu__icon--favorite", {
          "position-menu__icon--favorite--active": isFavorite,
        })}/>

        <div className="position-menu__text">
          {!isFavorite ? 'Add to favorites' : 'Remove from favorites'}
        </div>
      </div>

      <div onClick={onReport} className="position-menu__item">
        <div className="position-menu__icon position-menu__icon--block"/>

        <div className="position-menu__text">
          Report employer
        </div>
      </div>
    </div>
  )
}
