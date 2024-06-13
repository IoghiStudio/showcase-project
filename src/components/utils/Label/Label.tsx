'use client';
import classNames from 'classnames';
import './Label.scss';

type Props = {
  title: string;
  secondTitle?: string;
  children: React.ReactNode;
  forArea?: boolean;
};

export const Label: React.FC<Props> = ({
  title,
  secondTitle = '',
  children,
  forArea = false
}) => {
  return (
    <div className={classNames("label", {
      "label--stretch": forArea
    })}>
      <div className="label__title">
        <div>
          {title}
        </div>

        <div>
          {secondTitle}
        </div>
      </div>

      {children}
    </div>
  )
}
