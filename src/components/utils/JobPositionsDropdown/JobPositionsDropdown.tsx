'use client';
import { IFullPosition, getPositions } from '@/services/api/jobPosition.service';
import '../Dropdown.scss';
import classNames from 'classnames';
import { useCallback, useEffect, useState } from 'react';
import { JobPositionsStore } from '@/store/jobPositionStore';
import { AxiosResponse } from 'axios';
import { useRecoilState } from 'recoil';

type Props = {
  isOpen: boolean;
  onSelect: (position: IFullPosition) => void;
};

export const JobPositionsDropdown: React.FC<Props> = ({
  isOpen,
  onSelect,
}) => {
  const [jobPositions, setJobPositions] = useState<IFullPosition[] | null>(null);

  const fetchPositions = useCallback(async () => {
    try {
      const resp: AxiosResponse<any, any> = await getPositions();
      const data: IFullPosition[] = resp.data.data.data;
      setJobPositions(data.filter(p => p.status === 'ACTIVE'));
    } catch (error) {}
  }, []);

  useEffect(() => {
    fetchPositions();
  }, []);

  return (
    <div className={classNames("dropdown dropdown--flexible", {
      "dropdown--active": isOpen
    })}>
      <div className="dropdown__list">
        {jobPositions && jobPositions
          .map((position) => (
            <div
              key={position.job_position_id}
              className="dropdown__item"
              onClick={() => onSelect(position)}
            >
              <div className="dropdown__item-name">
                {position.JobTitle?.name}
              </div>
            </div>
          )
        )}
      </div>
    </div>
  )
}
