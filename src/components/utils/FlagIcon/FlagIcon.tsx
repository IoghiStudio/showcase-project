'use client';
import { formatMediaUrl } from '../utils';
import './FlagIcon.scss';
import classNames from 'classnames';

type Props = {
  code: string | null;
  size?: number;
};

export const FlagIcon: React.FC<Props> = ({ code, size = 24 }) => {
  const flagClasses: Record<string, boolean> = {
    'flag-icon': true,
  };

  for (let i = 18; i <= 50; i++) {
    flagClasses[`flag-icon--${i}` as string] = size === i;
  }

  return (
    <img
      src={formatMediaUrl(
        `flag-icon-${code?.toLowerCase() || 'globe'}.svg`,
      )}
      alt="country"
      className={classNames(flagClasses)}
    />
  )
}
