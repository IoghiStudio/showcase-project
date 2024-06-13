'use client'
import { FlowPageName, FlowPageText } from '@/types/FlowPage';
import './FlowContainer.scss';
import cn from 'classnames';

type Props = {
  children: React.ReactNode
  title: string;
  text: string;
  infoTexts?: FlowPageText[] | null;
  pageName?: FlowPageName;
  forAddEdit?: boolean;
};

export const FlowContainer: React.FC<Props> = ({
  children,
  title,
  text,
  infoTexts = null,
  pageName,
  forAddEdit = false
}) => {
  return (
    <div className="flow-container">
      <h1 className="flow-container__title">
        {title}
      </h1>

      <p className="flow-container__text">
        {text}
      </p>

      <div className="flow-container__content">
        {!forAddEdit && (
          <div className="flow-container__info">
            <div className={cn("flow-container__info-image", {
              "flow-container__info-image--info": pageName === FlowPageName.Info,
              "flow-container__info-image--residency": pageName === FlowPageName.Residency,
              "flow-container__info-image--experience": pageName === FlowPageName.Experience,
              "flow-container__info-image--education": pageName === FlowPageName.Education,
              "flow-container__info-image--courses": pageName === FlowPageName.Courses,
              "flow-container__info-image--certifications": pageName === FlowPageName.Certifications,
              "flow-container__info-image--languages": pageName === FlowPageName.Languages,
              "flow-container__info-image--driving": pageName === FlowPageName.Driving,
              "flow-container__info-image--picture": pageName === FlowPageName.Picture,
              "flow-container__info-image--video": pageName === FlowPageName.DemoVideo,
              "flow-container__info-image--add-job": pageName === FlowPageName.AddJob,
              "flow-container__info-image--relocation": pageName === FlowPageName.Relocation,
              "flow-container__info-image--about": pageName === FlowPageName.About,
              "flow-container__info-image--skills": pageName === FlowPageName.Skills,
            })}/>

            <div className='flow-container__info-texts'>
              {infoTexts && infoTexts.map(infoText => (
                <div key={infoText.id} className="flow-container__info-text">
                  &#x2022; {infoText.text}
                </div>
              ))}
            </div>
          </div>
        )}

        <div className={cn("flow-container__children", {
          "flow-container__children--full": forAddEdit
        })}>
          {children}
        </div>
      </div>
    </div>
  )
};
