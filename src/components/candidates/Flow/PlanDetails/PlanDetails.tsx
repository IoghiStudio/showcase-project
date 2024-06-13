'use client';
import { IPlanDescription } from '../Subscription';
import './PlanDetails.scss';

type Props = {
  description: IPlanDescription;
};

export const PlanDetails: React.FC<Props> = ({
  description
}) => {
  const {
    name,
    text,
    subtitle,
    points
  } = description;
  return (
    <div className="plan-details">
      <h3 className="plan-details__title">
        {name}
      </h3>

      <div className="plan-details__text">
        {text}
      </div>

      <div className="plan-details__subtitle">
        {subtitle}
      </div>

      <div className="plan-details__points">
        {points.map(point => (
          <p key={point} className="plan-details__point">
            &#x2022; {point}
          </p>
        ))}
      </div>

      <div className="plan-details__bottom-line">
        *Unlimited applies within the parameters of our offerings and available job opportunities
      </div>
    </div>
  )
}
