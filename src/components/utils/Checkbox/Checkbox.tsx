'use client';
import './Checkbox.scss';
import cn from 'classnames';

type Props = {
  checked: boolean;
  onClick: () => void;
  required?: boolean;
  error?: boolean;
  forPlans?: boolean;
};

export const Checkbox: React.FC<Props> = ({
  checked,
  onClick,
  required,
  error = false,
  forPlans = false,
}) => {
  return (
    <label className="checkbox">
      <input
        type="checkbox"
        onClick={onClick}
        className={cn("checkbox__input", {
          "checkbox__input--required": required,
          "checkbox__input--error": error,
          "checkbox__input--blue-border": forPlans,
          "checkbox__input--checked": checked,
        })}
      />
    </label>
  )
}
