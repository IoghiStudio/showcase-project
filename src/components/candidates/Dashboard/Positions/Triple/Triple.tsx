'use client';
import classNames from 'classnames';
import './Triple.scss';

export enum TripleIcon {
  Views,
  Clicks,
  Saved,
  Offers,
};

type Props = {
  icon: TripleIcon
  name: string;
  count: number;
};

export const Triple: React.FC<Props> = ({
  name,
  count,
  icon,
}) => {
  return (
    <div className="triple">
      <div className={classNames("triple__icon", {
        "triple__icon--views": icon === TripleIcon.Views,
        "triple__icon--clicks": icon === TripleIcon.Clicks,
        "triple__icon--saved": icon === TripleIcon.Saved,
        "triple__icon--offers": icon === TripleIcon.Offers,
      })}/>

      <div className="triple__data">
        <div className="triple__name">
          {name}
        </div>

        <div className="triple__count">
          {count}
        </div>
      </div>
    </div>
  )
}
