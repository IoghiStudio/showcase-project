'use client';
import '../Dropdown.scss';
import classNames from 'classnames';
import { useState } from 'react';
import { createYearsArray, getMonthsArray } from '../utils';
import { MonthType } from '@/types/Month';

type Props = {
  isOpen: boolean;
  onSelect: (month: MonthType) => void;
};

export const MonthDropdown: React.FC<Props> = ({
  isOpen,
  onSelect,
}) => {
  const [months] = useState<MonthType[]>(getMonthsArray());

  return (
    <div className={classNames("dropdown", "dropdown--date", {
      "dropdown--active": isOpen
    })}>
      <div className="dropdown__list">
        {months && months
          .map((month) => (
            <div
              key={month.id}
              className="dropdown__item"
              onClick={() => onSelect(month)}
            >
              <div className="dropdown__item-name">
                {month.name}
              </div>
            </div>
          )
        )}
      </div>
    </div>
  )
}
