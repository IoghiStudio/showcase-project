'use client';
import '../Dropdown.scss';
import classNames from 'classnames';
import { useState } from 'react';
import { workPlaceTypes } from '../utils';

type Props = {
  isOpen: boolean;
  onSelect: (workplaceType: string) => void;
};

export const WorkplaceTypeDropdown: React.FC<Props> = ({
  isOpen,
  onSelect,
}) => {
  const [workplaceTypes] = useState<string[]>(workPlaceTypes);

  return (
    <div className={classNames("dropdown dropdown--workplace", {
      "dropdown--active": isOpen
    })}>
      <div className="dropdown__list">
        {workplaceTypes && workplaceTypes
          .map((workplaceType) => (
            <div
              key={workplaceType}
              className="dropdown__item"
              onClick={() => onSelect(workplaceType)}
            >
              <div className="dropdown__item-name">
                {workplaceType}
              </div>
            </div>
          )
        )}
      </div>
    </div>
  )
}
