'use client'
import '../../../../candidates/Dashboard/Positions/PositionMenu/PositionMenu.scss';
import { SentJobOfferStatus } from '@/services/api/serachWorkers.service';
import classNames from 'classnames';

type Props = {
  status: string;
  isExpired: boolean;
  isFavorite: boolean;
  onDetails: () => void;
  onViewEmployer: () => void;
  onAccept?: () => void;
  onReject?: () => void;
  onContact?: () => void;
  onReport: () => void;
  onFavoriteChange: () => void;
};

export const OfferMenu: React.FC<Props> = ({
  status,
  isExpired,
  isFavorite,
  onReport,
  onDetails,
  onViewEmployer,
  onAccept,
  onReject,
  onContact,
  onFavoriteChange
}) => {
  return (
    <div className="position-menu">
      <div onClick={onDetails} className="position-menu__item">
        <div className="position-menu__icon position-menu__icon--view-offer"/>

        <div className="position-menu__text">
          Job details
        </div>
      </div>

      <div onClick={onViewEmployer} className="position-menu__item">
        <div className="position-menu__icon position-menu__icon--company"/>

        <div className="position-menu__text">
          View employer
        </div>
      </div>


      {status === SentJobOfferStatus.Accepted && (
        <div onClick={onContact} className="position-menu__item">
          <div className="position-menu__icon position-menu__icon--contact"/>

          <div className="position-menu__text">
            Contact employer
          </div>
        </div>
      )}

      {((!isExpired && (status === SentJobOfferStatus.OfferSent)))
        && (
          <div onClick={onAccept} className="position-menu__item">
            <div className="position-menu__icon position-menu__icon--accept"/>

            <div className="position-menu__text">
              Accept job offer
            </div>
          </div>
        )
      }

      {((!isExpired && (status === SentJobOfferStatus.OfferSent)) || (status === SentJobOfferStatus.Accepted))
        && (
          <div onClick={onReject} className="position-menu__item">
            <div className="position-menu__icon position-menu__icon--block"/>

            <div className="position-menu__text">
              Reject job offer
            </div>
          </div>
        )
      }

      <div onClick={onFavoriteChange} className="position-menu__item">
        <div className={classNames("position-menu__icon position-menu__icon--favorite-2", {
          "position-menu__icon--favorite-2--active": isFavorite,
        })}/>

        <div className="position-menu__text">
          {!isFavorite ? 'Add to favorites' : 'Remove from favorites'}
        </div>
      </div>

      <div onClick={onReport} className="position-menu__item">
        <div className="position-menu__icon position-menu__icon--block"/>

        <div className="position-menu__text">
          Report offer
        </div>
      </div>
    </div>
  )
}
