'use client'
import './PositionMenu.scss';

type Props = {
  status: string;
  onPromote: () => void;
  onEdit: () => void;
  onDelete: () => void;
  onPause?:() => void;
  onActivate?: () => void;
};

export const PositionMenu: React.FC<Props> = ({
  status,
  onPromote,
  onEdit,
  onDelete,
  onActivate = () => {},
  onPause = () => {},
}) => {
  return (
    <div className="position-menu">
      {status === 'ACTIVE' && (
        <div onClick={onPromote} className="position-menu__item">
          <div className="position-menu__icon position-menu__icon--promote"/>

          <div className="position-menu__text">
            Promote job position
          </div>
        </div>
      )}

      <div onClick={onEdit} className="position-menu__item">
        <div className="position-menu__icon position-menu__icon--edit"/>

        <div className="position-menu__text">
          Edit job position
        </div>
      </div>

      {status === 'ACTIVE' && (
        <div onClick={onPause} className="position-menu__item">
          <div className="position-menu__icon position-menu__icon--pause"/>

          <div className="position-menu__text">
            Pause job position
          </div>
        </div>
      )}

      {status === 'PAUSED' && (
        <div onClick={onActivate} className="position-menu__item">
          <div className="position-menu__icon position-menu__icon--continue"/>

          <div className="position-menu__text">
            Activate job position
          </div>
        </div>
      )}

      <div onClick={onDelete} className="position-menu__item">
        <div className="position-menu__icon position-menu__icon--delete"/>

        <div className="position-menu__text">
          Delete job position
        </div>
      </div>
    </div>
  )
}
