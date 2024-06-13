'use client'
import '../../Positions/PositionMenu/PositionMenu.scss';

type Props = {
  status: string;
  onDelete: () => void;
  onPause?:() => void;
  onActivate?: () => void;
};

export const PromotionMenu: React.FC<Props> = ({
  status,
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

      <div onClick={onDelete} className="position-menu__item">
        <div className="position-menu__icon position-menu__icon--delete"/>

        <div className="position-menu__text">
          Delete promotion
        </div>
      </div>
    </div>
  )
}
