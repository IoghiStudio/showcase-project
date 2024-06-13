'use client';
import './Arrows.scss';
import cn from 'classnames';

type Props = {
  toRight?: boolean;
  arrowsCount?: number;
}

export const Arrows: React.FC<Props> = ({ toRight = false, arrowsCount = 0 }) => {
  return (
    <div className={cn("arrows", {
      "arrows--toRight": toRight
    })}>
      <div className="arrows__arrow"/>
      <div className="arrows__arrow"/>
      <div className="arrows__arrow"/>
    </div>
  )
}
