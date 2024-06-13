'use client';
import classNames from 'classnames';
import './Positions.scss';
import { useRecoilState, useSetRecoilState } from 'recoil';
import { IJobPositionLimitCreated, JobPositionsLimitCreatedStore, JobPositionsStore } from '@/store/jobPositionStore';
import { IFullPosition, getLimitCountPositions, getPositions } from '@/services/api/jobPosition.service';
import { useCallback, useEffect, useState } from 'react';
import { AxiosResponse } from 'axios';
import { ButtonIcon, ButtonWithIcon } from '../utils/ButtonWihIcon';
import { ButtonColor } from '@/types/ButtonColor';
import { useRouter } from 'next/navigation';
import { PositionBox } from './PositionBox';
import { CandidateHeaderMessageStore, CandidateHeaderMessages } from '@/store/headerStore';

enum PositionsFilter {
  All,
  Active,
  Paused,
};

interface IPositionsFilter {
  id: number,
  text: string,
  filter: PositionsFilter,
};

const positionsFilters: IPositionsFilter[] = [
  {
    id: 1,
    text: 'All job positions',
    filter: PositionsFilter.All
  },
  {
    id: 2,
    text: 'Active',
    filter: PositionsFilter.Active
  },
  {
    id: 3,
    text: 'Paused',
    filter: PositionsFilter.Paused
  },
];

export const Positions = () => {
  const [jobPositions, setJobPositions] = useRecoilState(JobPositionsStore);
  const [filteredPositions, setFilteredPositions] = useState<IFullPosition[] | null>(null);
  const [currentFilter, setCurrentFilter] = useState<PositionsFilter>(PositionsFilter.All);
  const router = useRouter();
  const [positionsLimitCreated, setPositionsLimitCreated] = useRecoilState(JobPositionsLimitCreatedStore);
  const setCandidateHeaderMessage = useSetRecoilState(CandidateHeaderMessageStore);

  const fetchLimitCountPositions = useCallback(async () => {
    try {
      const resp: AxiosResponse<any, any> = await getLimitCountPositions();
      const data: IJobPositionLimitCreated = resp.data.data.data;
      setPositionsLimitCreated(data);
    } catch (error) {}
  }, []);

  const fetchPositions = useCallback(async () => {
    try {
      const resp: AxiosResponse<any, any> = await getPositions();
      const data: IFullPosition[] = resp.data.data.data;
      console.log(data);

      setJobPositions(data);
      setFilteredPositions(data);
    } catch (error) {}
  }, []);

  useEffect(() => {
    setCandidateHeaderMessage(CandidateHeaderMessages.Positions);
    if (!positionsLimitCreated) fetchLimitCountPositions();
    if (!jobPositions) fetchPositions();
  }, []);

  useEffect(() => {
    if (currentFilter === PositionsFilter.All) {
      setFilteredPositions(jobPositions);
    }

    if (currentFilter === PositionsFilter.Active) {
      const newPositions = jobPositions?.filter(p => p.status === 'ACTIVE') || [];
      setFilteredPositions(newPositions)
    }

    if (currentFilter === PositionsFilter.Paused) {
      const newPositions = jobPositions?.filter(p => p.status === 'PAUSED') || [];
      setFilteredPositions(newPositions)
    }
  }, [currentFilter, jobPositions]);

  return (
    <div className="positions">
      <div className="positions__top">
        <div className="positions__top-left">
          {positionsFilters.map(f => (
            <div
              key={f.id}
              onClick={() => setCurrentFilter(f.filter)}
              className={classNames("positions__filter", {
                "positions__filter--active": currentFilter === f.filter
              })}
            >
              {f.text}
            </div>
          ))
          }
        </div>

        <div className="positions__top-right">
          <div className="positions__active-info">
            <div className="positions__active-info-count">
              {`${positionsLimitCreated?.active_job_position || 0}/${positionsLimitCreated?.limit || 1}`}
            </div>

            <div className="positions__active-info-text">
              Active job positions
            </div>
          </div>

          {positionsLimitCreated && (positionsLimitCreated?.active_job_position < positionsLimitCreated?.limit) ? (
            <div
              className="positions__button"
              onClick={() => router.push('/candidates/dashboard/positions/add/')}
            >
              <ButtonWithIcon
                color={ButtonColor.White}
                bgColor={ButtonColor.Green}
                borderColor={ButtonColor.Green}
                icon={ButtonIcon.Plus}
                text='ADD JOB POSITION'
              />
            </div>
          ) : (
            <div
              className="positions__button"
              onClick={() => router.push('/candidates/dashboard/settings/billing/')}
            >
              <ButtonWithIcon
                color={ButtonColor.White}
                bgColor={ButtonColor.Blue}
                borderColor={ButtonColor.Blue}
                icon={ButtonIcon.Plus}
                text='UPGRADE PLAN'
              />
            </div>
          )}
        </div>
      </div>

      <div className="positions__list">
        {filteredPositions?.map(position => (
          <div key={position.job_position_id} className="positions__item">
            <PositionBox position={position} />
          </div>
        ))}
      </div>
    </div>
  )
}
