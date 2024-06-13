'use client'
import { SentJobOfferStatus } from '@/services/api/serachWorkers.service';
import '../../../../candidates/Dashboard/Positions/PositionMenu/PositionMenu.scss';
import classNames from 'classnames';

type Props = {
  status: string;
  isExpired: boolean;
  isFavorite: boolean;
  onProfile: () => void;
  onVideo: () => void;
  onDownloadCV: () => void;
  onReport: () => void;
  onFavoriteChange: () => void;
  //based on offer status
  onSendOffer?: () => void;
  onViewOffer?: () => void;
  onContact?: () => void;
};

export const WorkerMenu: React.FC<Props> = ({
  status,
  isExpired,
  isFavorite,
  onProfile,
  onVideo,
  onDownloadCV,
  onReport,
  onFavoriteChange,
  onSendOffer = () => {},
  onViewOffer = () => {},
  onContact = () => {},
}) => {
  return (
    <div className="position-menu">
      <div onClick={onProfile} className="position-menu__item">
        <div className="position-menu__icon position-menu__icon--profile"/>

        <div className="position-menu__text">
          View profile
        </div>
      </div>

      <div onClick={onVideo} className="position-menu__item">
        <div className="position-menu__icon position-menu__icon--video"/>

        <div className="position-menu__text">
          Watch video
        </div>
      </div>

      <div onClick={onDownloadCV} className="position-menu__item">
        <div className="position-menu__icon position-menu__icon--download-cv"/>

        <div className="position-menu__text">
          Download CV
        </div>
      </div>

      {((isExpired && (status === SentJobOfferStatus.OfferSent)) || status === 'null')
        && (
          <div onClick={onSendOffer} className="position-menu__item">
            <div className="position-menu__icon position-menu__icon--send-offer"/>

            <div className="position-menu__text">
              Send job offer
            </div>
          </div>
        )
      }

      {(!isExpired && status === SentJobOfferStatus.OfferSent
        || status === SentJobOfferStatus.Accepted
        || status === SentJobOfferStatus.Rejected)
        && (
          <div onClick={onViewOffer} className="position-menu__item">
            <div className="position-menu__icon position-menu__icon--view-offer"/>

            <div className="position-menu__text">
              View offer sent
            </div>
          </div>
        )
      }

      {status === SentJobOfferStatus.Accepted && (
        <div onClick={onContact} className="position-menu__item">
          <div className="position-menu__icon position-menu__icon--contact"/>

          <div className="position-menu__text">
            Contact candidate
          </div>
        </div>
      )}

      {status === SentJobOfferStatus.Rejected && (
        <div onClick={onSendOffer} className="position-menu__item">
          <div className="position-menu__icon position-menu__icon--send-offer"/>

          <div className="position-menu__text">
            Send a new job offer
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
          Report candidate
        </div>
      </div>
    </div>
  )
}
