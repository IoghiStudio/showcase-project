'use client';
import classNames from 'classnames';
import './Switch.scss';
import cn from 'classnames';

type Props = {
  isOpen: boolean
};

export const Switch: React.FC<Props> = ({ isOpen }) => {
  return (
    <div className={cn("switch", {
      "switch--active": isOpen,
    })}>
      <div className={cn("switch__dot", {
        "switch__dot--active": isOpen,
      })}/>
    </div>
  )
}
