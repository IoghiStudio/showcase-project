'use client';
import '../Dropdown.scss';
import classNames from 'classnames';
import { useState } from 'react';
import { recurrenciesList } from '../utils';
import { IRecurrency } from '@/types/Currency';

type Props = {
  isOpen: boolean;
  onSelect: (recurrency: string) => void;
};

export const RecurrencyDropdown: React.FC<Props> = ({
  isOpen,
  onSelect,
}) => {
  const [recurrencies] = useState<IRecurrency[]>(recurrenciesList);

  return (
    <div className={classNames("dropdown", {
      "dropdown--active": isOpen
    })}>
      <div className="dropdown__list">
        {recurrencies && recurrencies
          .map((recurrency) => (
            <div
              key={recurrency.name}
              className="dropdown__item"
              onClick={() => onSelect(recurrency.name)}
            >
              <div className="dropdown__item-name">
                {recurrency.name}
              </div>
            </div>
          )
        )}
      </div>
    </div>
  )
}
