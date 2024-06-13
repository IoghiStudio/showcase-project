'use client';
import './StepIcon.scss';
import cn from 'classnames';
import { Object } from '@/types/Object';
import { useRouter } from 'next/navigation';

export type StepIconName = 'info' | 'residency' | 'experience' | 'education' | 'certifications' | 'courses' | 'language' | 'driving' | 'picture' | 'subscription'
export type StepIconStatus = 'done' | 'undone' | 'current';

type Props = {
  iconName: StepIconName;
  status: StepIconStatus;
  title: string;
};

const baseRoute = '/candidates/flow/'

const routes: Object = {
  info: `${baseRoute}information-check/`,
  residency: `${baseRoute}residency/`,
  experience: `${baseRoute}experience/`,
  education: `${baseRoute}education/`,
  certifications: `${baseRoute}certifications/`,
  courses: `${baseRoute}courses/`,
  language: `${baseRoute}languages/`,
  driving: `${baseRoute}driving-license/`,
  picture: `${baseRoute}profile-image/`,
  subscription: `${baseRoute}subscription/`
};

export const StepIcon: React.FC<Props> = ({
  iconName,
  status,
  title,
}) => {
  const router = useRouter();

  return (
    <div className="step">
      <div
        className={cn(
        "step-icon",
        `step-icon--${iconName}-${status}`,
        )}
        onClick={() => {
          if (status === 'done') {
            router.push(routes[iconName])
          }
        }}
      />

      <div className={cn(
        "step-title",
        `step-title--${status}`
      )}>
        {title}
      </div>
    </div>
  )
}
