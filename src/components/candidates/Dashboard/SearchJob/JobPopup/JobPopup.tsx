'use client';
import './JobPopup.scss';
import { useRouter } from 'next/navigation';
import { useCallback } from 'react';
import { Button } from '@/components/utils/Button';
import { ButtonColor } from '@/types/ButtonColor';

interface Props {
  onClose: () => void;
  forAdd: boolean;
};

export const JobPopup: React.FC<Props> = ({
  onClose,
  forAdd
}) => {
  const router = useRouter();

  const handleUpgradeRedirect = useCallback(() => {
    router.push('/candidates/dashboard/settings/billing/');
  }, []);

  const handleAddRedirect = useCallback(() => {
    router.push('/candidates/dashboard/positions/add/');
  }, []);

  return (
    <div onClick={onClose} className="job-popup">
      <div onClick={e => e.stopPropagation()} className="container job-popup__content">
        <div onClick={onClose} className="job-popup__cross"/>
        <div className="job-popup__title">
          ADD A NEW JOB POSITION
        </div>

        <div className="job-popup__subtitle">
          In order to apply on this job announcement
        </div>

        <div className="job-popup__text">
          In order to apply to this job announcement, you need to activate a job position, create a new CV and add relevant skill video.
        </div>

        <div className="job-popup__text">
          By adding a new job position, you will be able to apply to related job announcements with this job position and be found by companies in their process of direct searching for workers.
        </div>

        {forAdd ? (
          <div className="job-popup__text">
            Be sure you have enough experience in order to apply and be selected by companies and add a skill video presentation relevant to this job position.
          </div>
        ) : (
          <div className="job-popup__text">
            You have reach to number of job positions included in your subscription plan. In order to add more job positions, please follow the next steps and upgrade your plan.
          </div>
        )}

        <div className="job-popup__button">
          {forAdd ? (
            <Button
              onClick={handleAddRedirect}
              color={ButtonColor.Green}
            >
              Add job position
            </Button>
          ) : (
            <Button
              onClick={handleUpgradeRedirect}
              color={ButtonColor.Blue}
            >
              upgrade plan
            </Button>
          )}
        </div>
      </div>
    </div>
  )
};
