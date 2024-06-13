'use client';
import '../Dropdown.scss';
import classNames from 'classnames';
import { useState } from 'react';
import { jobTypeData } from '../utils';

type Props = {
  isOpen: boolean;
  onSelect: (jobType: string) => void;
};

export const JobTypeDropdown: React.FC<Props> = ({
  isOpen,
  onSelect,
}) => {
  const [jobTypes] = useState<string[]>(jobTypeData);

  return (
    <div className={classNames("dropdown", {
      "dropdown--active": isOpen
    })}>
      <div className="dropdown__list">
        {jobTypes && jobTypes
          .map((jobType) => (
            <div
              key={jobType}
              className="dropdown__item"
              onClick={() => onSelect(jobType)}
            >
              <div className="dropdown__item-name">
                {jobType}
              </div>
            </div>
          )
        )}
      </div>
    </div>
  )
}
