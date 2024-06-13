'use client'
import '../../../../candidates/Dashboard/Positions/PositionMenu/PositionMenu.scss';
import { JobApplyStatus } from '@/store/jobStore';
import classNames from 'classnames';

type Props = {
  isExpired?: boolean;
  status: string;
  isFavorite: boolean;
  onProfile: () => void;
  onVideo: () => void;
  onDownloadCV: () => void;
  onBlock: () => void;
  onAccept?: () => void;
  onReject?: () => void;
  onContact?: () => void;
  onFavoriteChange: () => void;
};

export const ApplicantMenu: React.FC<Props> = ({
  isExpired = false,
  status,
  isFavorite,
  onProfile,
  onVideo,
  onDownloadCV,
  onBlock,
  onAccept = () => {},
  onReject = () => {},
  onContact = () => {},
  onFavoriteChange,
}) => {
  return (
    <div className="position-menu">
      <div onClick={onProfile} className="position-menu__item">
        <div className="position-menu__icon position-menu__icon--profile"/>

        <div className="position-menu__text">
          Candidate profile
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

      {status === JobApplyStatus.Applied && (
        <div onClick={onAccept} className="position-menu__item">
          <div className="position-menu__icon position-menu__icon--accept"/>

          <div className="position-menu__text">
            Accept candidate
          </div>
        </div>
      )}

      {status === JobApplyStatus.Applied && (
        <div onClick={onReject} className="position-menu__item">
          <div className="position-menu__icon position-menu__icon--block"/>

          <div className="position-menu__text">
            Reject candidate
          </div>
        </div>
      )}

      {status === JobApplyStatus.Accepted && (
        <div onClick={onContact} className="position-menu__item">
          <div className="position-menu__icon position-menu__icon--contact"/>

          <div className="position-menu__text">
            Contact candidate
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

      {status === JobApplyStatus.Accepted ? (
        <div onClick={() => {}} className="position-menu__item">
          <div className="position-menu__icon position-menu__icon--delete"/>

          <div className="position-menu__text">
            Delete candidature
          </div>
        </div>
      ) : (
        <div onClick={onBlock} className="position-menu__item">
          <div className="position-menu__icon position-menu__icon--delete"/>

          <div className="position-menu__text">
            Delete candidate
          </div>
        </div>
      )}
    </div>
  )
}
