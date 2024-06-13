'use client';
import '../Dropdown.scss';
import classNames from 'classnames';
import { useState } from 'react';
import { degrees } from '../utils';

type Props = {
  isOpen: boolean;
  onSelect: (diploma: string) => void;
};

export const DiplomaDropdown: React.FC<Props> = ({
  isOpen,
  onSelect,
}) => {
  const [diplomas] = useState<string[]>(degrees);

  return (
    <div className={classNames("dropdown", {
      "dropdown--active": isOpen
    })}>
      <div className="dropdown__list">
        {diplomas && diplomas
          .map((diploma) => (
            <div
              key={diploma}
              className="dropdown__item"
              onClick={() => onSelect(diploma)}
            >
              <div className="dropdown__item-name">
                {diploma}
              </div>
            </div>
          )
        )}
      </div>
    </div>
  )
}
