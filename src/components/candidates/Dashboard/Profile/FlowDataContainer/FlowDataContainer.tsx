'use client';
import './FlowDataContainer.scss';
import classNames from 'classnames';
import { useRouter } from 'next/navigation';

export enum FlowDataIcon {
  Experience,
  Education,
  Course,
  Certification,
  Language,
  Driving,
  Skills,
  About,
  Nationality
};

type Props = {
  children: React.ReactNode;
  icon: FlowDataIcon;
  title: string;
  text: string;
  btnText: string;
  forCompany?: boolean;
};

export const FlowDataContainer: React.FC<Props> = ({
  children,
  icon,
  title,
  text,
  btnText,
  forCompany
}) => {
  const router = useRouter();

  const handleAdd = () => {
    switch(icon) {
      case FlowDataIcon.Experience:
        router.push('/candidates/dashboard/profile/experience-add/');
        break;

      case FlowDataIcon.Education:
        router.push('/candidates/dashboard/profile/education-add/');
        break;

      case FlowDataIcon.Course:
        router.push('/candidates/dashboard/profile/courses-add/');
        break;

      case FlowDataIcon.Certification:
        router.push('/candidates/dashboard/profile/certifications-add/');
        break;

      case FlowDataIcon.Language:
        router.push('/candidates/dashboard/profile/languages-add/');
        break;

      case FlowDataIcon.Driving:
        router.push('/candidates/dashboard/profile/driving-license-add/');
        break;

      default:
        break;
    }
  };

  return (
    <div className="container flow-data-container">
      <div className="flow-data-container__top">
        <div className="flow-data-container__left">
          <div className={classNames("flow-data-container__icon", {
            "flow-data-container__icon--experience": icon === FlowDataIcon.Experience,
            "flow-data-container__icon--education": icon === FlowDataIcon.Education,
            "flow-data-container__icon--course": icon === FlowDataIcon.Course,
            "flow-data-container__icon--certification": icon === FlowDataIcon.Certification,
            "flow-data-container__icon--driving": icon === FlowDataIcon.Driving,
            "flow-data-container__icon--language": icon === FlowDataIcon.Language,
            "flow-data-container__icon--skills": icon === FlowDataIcon.Skills,
            "flow-data-container__icon--about": icon === FlowDataIcon.About,
            "flow-data-container__icon--nationality": icon === FlowDataIcon.Nationality,
          })}/>

          <div className="flow-data-container__info">
            <h2 className="container__title">
              {title}
            </h2>

            <p className="container__text flow-data-container__text">
              {text}
            </p>
          </div>
        </div>
          {!forCompany && (
            <div onClick={handleAdd} className="flow-data-container__add-btn">
              {btnText}
            </div>
          )}
      </div>

      {children}
    </div>
  )
}
