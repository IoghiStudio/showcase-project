'use client';
import './ActivePositions.scss';
import { useRecoilState } from 'recoil';
import { IJobPositionLimitCreated, JobPositionsLimitCreatedStore } from '@/store/jobPositionStore';
import { AxiosResponse } from 'axios';
import { getLimitCountPositions } from '@/services/api/jobPosition.service';
import { useEffect } from 'react';
import Link from 'next/link';

export const ActivePoitions = () => {
  const [positionsLimitCreated, setPositionsLimitCreated] = useRecoilState(JobPositionsLimitCreatedStore);

  const fetchLimitCountPositions = async () => {
    try {
      const resp: AxiosResponse<any, any> = await getLimitCountPositions();
      const data: IJobPositionLimitCreated = resp.data.data.data;
      setPositionsLimitCreated(data);
    } catch (error) {}
  };

  useEffect(() => {
    if (!positionsLimitCreated) fetchLimitCountPositions;
  }, [])


  return (
    <div className="container active-positions">
      <div className="active-positions__headline">
        Active Job Positions
      </div>

      <div className="active-positions__mid">
        <div className="active-positions__title">
          <span className='active-positions__title active-positions__title--bold'>
          {`${positionsLimitCreated?.active_job_position || 0}/${positionsLimitCreated?.limit || 1}`}
          </span>

          Job Position
        </div>

        <div className="active-positions__text">
          your are seeking for is active
        </div>
      </div>

      <Link href={'/candidates/dashboard/positions/'} className="active-positions__button">
        View your job positions
      </Link>
    </div>
  )
}
