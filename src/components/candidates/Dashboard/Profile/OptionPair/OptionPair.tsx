'use client';
import './OptionPair.scss';

type Props = {
  onEdit: () => void;
  onDelete: () => void;
};

export const OptionPair: React.FC<Props> = ({
  onEdit,
  onDelete
}) => {
  return (
    <div className="option-pair">
      <div onClick={onEdit} className="option-pair__btn">
        Edit
      </div>

      <div onClick={onDelete} className="option-pair__btn option-pair__btn--delete">
        Delete
      </div>
    </div>
  )
}
