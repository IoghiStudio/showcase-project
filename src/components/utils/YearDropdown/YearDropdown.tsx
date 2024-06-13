'use client';
import '../Dropdown.scss';
import classNames from 'classnames';
import { useState } from 'react';
import { createYearsArray } from '../utils';

type Props = {
  isOpen: boolean;
  onSelect: (year: string) => void;
};

export const YearDropdown: React.FC<Props> = ({
  isOpen,
  onSelect,
}) => {
  const [years] = useState<string[]>(createYearsArray(2023, 1923));

  return (
    <div className={classNames("dropdown", "dropdown--date", {
      "dropdown--active": isOpen
    })}>
      <div className="dropdown__list">
        {years && years
          .map((year) => (
            <div
              key={year}
              className="dropdown__item"
              onClick={() => onSelect(year)}
            >
              <div className="dropdown__item-name">
                {year}
              </div>
            </div>
          )
        )}
      </div>
    </div>
  )
}
