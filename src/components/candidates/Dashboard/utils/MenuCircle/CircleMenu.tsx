'use client';
import classNames from 'classnames';
import './CircleMenu.scss';

type Props = {
  active: boolean;
};

export const CircleMenu: React.FC<Props> = ({ active }) => {
  return (
    <div className={classNames("circle-menu", {
      "circle-menu--active": active
    })}>
      MENU
    </div>
  )
}
