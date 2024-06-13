import { Button } from '@/components/utils/Button'
import { useRouter } from 'next/navigation';
import './NextStep.scss'
import { LoadingModal } from '@/components/utils/LoadingModal';

export enum NextStepInfo {
  Residency,
  Experience,
  Education,
  Courses,
  Certifications,
  Languages,
  Payment,
  Driving,
  Picture,
  Relocation,
  Video,
  About,
  Skills,
  Dashboard,
};

type Props = {
  nextStep: NextStepInfo;
  isLoading?: boolean;
  onClick?: null | (() => Promise<void>) | (() => void);
};

export const NextStep: React.FC<Props> = ({
  nextStep,
  isLoading = false,
  onClick = null
}) => {
  const router = useRouter();

  return (
    <div className="next-step">
      <div className="next-step__button">
        <Button
          onClick={() => {
            if (onClick) {
              onClick();
              return;
            }

            const baseFlowUrl = '/candidates/flow';
            const baseStepsUrl = '/candidates/steps';

            switch(nextStep) {
              case NextStepInfo.Residency:
                router.push(`${baseFlowUrl}/residency/`);
                break;

              case NextStepInfo.Experience:
                router.push(`${baseFlowUrl}/experience/`);
                break;

              case NextStepInfo.Education:
                router.push(`${baseFlowUrl}/education/`);
                break;

              case NextStepInfo.Courses:
                router.push(`${baseFlowUrl}/courses/`);
                break;

              case NextStepInfo.Certifications:
                router.push(`${baseFlowUrl}/certifications/`);
                break;

              case NextStepInfo.Languages:
                router.push(`${baseFlowUrl}/languages/`);
                break;

              case NextStepInfo.Driving:
                router.push(`${baseFlowUrl}/driving-license/`);
                break;

              case NextStepInfo.Picture:
                router.push(`${baseFlowUrl}/profile-image/`);
                break;

              case NextStepInfo.Relocation:
                router.push(`${baseStepsUrl}/relocation/`);
                break;

              case NextStepInfo.Video:
                router.push(`${baseStepsUrl}/demo-video/`);
                break;

              case NextStepInfo.About:
                router.push(`${baseStepsUrl}/about/`);
                break;

              case NextStepInfo.Skills:
                router.push(`${baseStepsUrl}/skills/`);
                break;

              case NextStepInfo.Dashboard:
                router.push(`/candidates/dashboard/`);
                break;

              default:
                null
            }
          }}
        >
          {isLoading ? <LoadingModal /> : 'Continue'}
        </Button>
      </div>

      <div className="next-step__text">
        <div className="next-step__text next-step__text--bold">
          Next step:
        </div>

        {nextStep === NextStepInfo.Residency && (
          'Add your current residency'
        )}

        {nextStep === NextStepInfo.Experience && (
          'Add your experience'
        )}

        {nextStep === NextStepInfo.Education && (
          'Add your education'
        )}

        {nextStep === NextStepInfo.Certifications && (
          'Add certifications'
        )}

        {nextStep === NextStepInfo.Courses && (
          'Add courses'
        )}

        {nextStep === NextStepInfo.Languages && (
          'Add languages'
        )}

        {nextStep === NextStepInfo.Driving && (
          'Add driving license'
        )}

        {nextStep === NextStepInfo.Picture && (
          'Add profile image'
        )}

        {nextStep === NextStepInfo.Payment && (
          'Payment'
        )}

        {nextStep === NextStepInfo.Relocation && (
          'Relocation settings'
        )}

        {nextStep === NextStepInfo.Video && (
          'Add video presentation'
        )}

        {nextStep === NextStepInfo.About && (
          'About me'
        )}

        {nextStep === NextStepInfo.Skills && (
          'Add your skills'
        )}

        {nextStep === NextStepInfo.Dashboard && (
          'Access the dashboard and explore'
        )}
      </div>
    </div>
  )
}
