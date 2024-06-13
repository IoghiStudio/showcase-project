'use client'
import '../../../../candidates/Dashboard/Positions/PositionMenu/PositionMenu.scss';

type Props = {
  status: string;
  onEdit: () => void;
  onDelete: () => void;
  onPause?:() => void;
  onActivate?: () => void;
};

export const PromoMenu: React.FC<Props> = ({
  status,
  onEdit,
  onDelete,
  onActivate = () => {},
  onPause = () => {},
}) => {
  return (
    <div className="position-menu">
      {status === 'ACTIVE' && (
        <div onClick={onPause} className="position-menu__item">
          <div className="position-menu__icon position-menu__icon--pause"/>

          <div className="position-menu__text">
            Pause promotion
          </div>
        </div>
      )}

      {status === 'PAUSED' && (
        <div onClick={onActivate} className="position-menu__item">
          <div className="position-menu__icon position-menu__icon--continue"/>

          <div className="position-menu__text">
            Activate promotion
          </div>
        </div>
      )}

      <div onClick={onEdit} className="position-menu__item">
        <div className="position-menu__icon position-menu__icon--edit"/>

        <div className="position-menu__text">
          Edit promotion
        </div>
      </div>

      <div onClick={onDelete} className="position-menu__item">
        <div className="position-menu__icon position-menu__icon--delete"/>

        <div className="position-menu__text">
          Delete promotion
        </div>
      </div>
    </div>
  )
}
