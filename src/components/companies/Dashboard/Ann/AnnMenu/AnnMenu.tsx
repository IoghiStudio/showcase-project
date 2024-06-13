'use client'
import { AnnounceStatus } from '@/store/announceStore';
import '../../../../candidates/Dashboard/Positions/PositionMenu/PositionMenu.scss';

type Props = {
  status: string;
  isPromoted: boolean;
  onPreview: () => void;
  onPromote: () => void;
  onEdit: () => void;
  onDelete: () => void;
  onPause?:() => void;
  onActivate?: () => void;
};

export const AnnMenu: React.FC<Props> = ({
  status,
  isPromoted,
  onPreview,
  onPromote,
  onEdit,
  onDelete,
  onActivate = () => {},
  onPause = () => {},
}) => {
  return (
    <div className="position-menu position-menu--ann">
      {status === AnnounceStatus.Open && !isPromoted && (
        <div onClick={onPromote} className="position-menu__item">
          <div className="position-menu__icon position-menu__icon--promote"/>

          <div className="position-menu__text">
            Promote announcement
          </div>
        </div>
      )}

      <div onClick={onEdit} className="position-menu__item">
        <div className="position-menu__icon position-menu__icon--edit"/>

        <div className="position-menu__text">
          Edit announcement
        </div>
      </div>

      {status === AnnounceStatus.Open && (
        <div onClick={onPause} className="position-menu__item">
          <div className="position-menu__icon position-menu__icon--pause"/>

          <div className="position-menu__text">
            Pause announcement
          </div>
        </div>
      )}

      {status === AnnounceStatus.Closed && (
        <div onClick={onActivate} className="position-menu__item">
          <div className="position-menu__icon position-menu__icon--continue"/>

          <div className="position-menu__text">
            Activate announcement
          </div>
        </div>
      )}

      <div onClick={onDelete} className="position-menu__item">
        <div className="position-menu__icon position-menu__icon--delete"/>

        <div className="position-menu__text">
          Delete announcement
        </div>
      </div>
    </div>
  )
}
