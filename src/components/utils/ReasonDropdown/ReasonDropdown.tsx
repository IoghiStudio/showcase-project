'use client';
import '../Dropdown.scss';
import classNames from 'classnames';
import { useState } from 'react';

type Props = {
  isOpen: boolean;
  onSelect: (reason: string) => void;
};

const reasonList: string[] = [
  'The salary is too low',
  'No relocation benefits',
  'The type of employment is not for me',
  'The benefits aren\'t right for me',
  'I\'am not interested anymore',
  'I don\'t want this employer',
  'I don\'t like this country',
  'Other reason',
];

export const ReasonDropdown: React.FC<Props> = ({
  isOpen,
  onSelect,
}) => {
  const [reasons] = useState<string[]>(reasonList);

  return (
    <div className={classNames("dropdown", {
      "dropdown--active": isOpen
    })}>
      <div className="dropdown__list">
        {reasons.map((reason) => (
          <div
            key={reason}
            className="dropdown__item"
            onClick={() => onSelect(reason)}
          >
            <div className="dropdown__item-name">
              {reason}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
