'use client';
import './Subscription.scss';
import classNames from 'classnames';
import { FlowContainer } from "../FlowContainer";
import { useCallback, useState } from "react";
import { Arrows } from '@/components/utils/Arrows';
import { StepIcon } from '@/components/utils/StepIcon';
import { Switch } from '@/components/utils/Switch';
import { PlanDetails } from '../PlanDetails';
import { Checkbox } from '@/components/utils/Checkbox';
import { NextStep, NextStepInfo } from '../NextStep';
import { IGenerateSubscription, generateSubscriptionPage } from '@/services/api/stripe.service';
import { useRouter } from 'next/navigation';
import { AxiosResponse } from 'axios';

export enum PlanTime {
  Monthly = "MONTHLY",
  Yearly = "ANNUALLY",
};

enum PlanType {};

export interface IPlanDescription {
  name: string;
  text: string;
  subtitle: string;
  points: string[];
};

export interface IPlan {
  id: number;
  price_id: string;
  title: string;
  subtitle: string;
  description: IPlanDescription;
  price: number;
  perMonth?: number;
  save?: number;
};

export interface IDescriptionTypes {
  basic: IPlanDescription,
  standard: IPlanDescription,
  premium: IPlanDescription,
  professional: IPlanDescription,
  ultimate: IPlanDescription,
};

export const descriptionType: IDescriptionTypes =  {
  basic: {
    name: 'BASIC PLAN DETAILS',
    text: 'This plan is tailored for individuals focused on a singular job opportunity. I suits those seeking a targeted approach to their job search, centered around a specific role. With this plan, you gain the advantage of applying exclusively to job openings aligned with your chosen position, streamlining your job hunt effectively.',
    subtitle: 'The Basic Plan comprises:',
    points: [
      'Exploration of a single job position;',
      'Crafting of one customized CV to highlight your strenghts;',
      'Upload of a single skilled demo video showcasing your abilities;',
      'Unlimited application submissions to job listings according to your role*;',
      'Receive limitless job offers from employers tailored to your profile;',
      'Flexibility to apply on a global scale or a select preferred countries.'
    ]
  },
  standard: {
    name: 'STANDARD PLAN DETAILS',
    text: 'This plan is designed for individuals aspiring to explore a wider range of opportunities. This plan empowers you to target not just one, but two distinct job position. You\'ll receive the advantage of two custom-created CVs and two skilled dmeo videos, tailored to each position, enabling you to present your qualifications seamlessly and providing a comprehensive glimpse into your capabilities.',
    subtitle: 'Standard plan includes:',
    points: [
      'Pursuit of up to 2 jobs;',
      'Crafting of 2 custom CVs, each highlighting relevant skills;',
      'Upload 2 skilled demo video showcasing your talents;',
      'Unlimited application submission to job listings according to your chosen roles*;',
      'Reception of boundless job offersm meticulously matched to your profile;',
      'Flexibility to apply globaly or focus on specific countries.'
    ]
  },
  premium: {
    name: 'PREMIUM PLAN DETAILS',
    text: 'Experience the pinnacle of our services with this plan, meticulously curated for ambitious individuals seeking a comprehensive approach to their job search. With this plan, you\'ll have the opportunity to explore three distinct job positions, allowing you to cast a wider net in your pursuit of the perfect role.',
    subtitle: 'Premium plan includes:',
    points: [
      'Exploration of up to 3 job positions, expanding your horizons;',
      'Development of 3 custom CVs, strategically aligned with each position;',
      'Upload 3 skilled demo videos, offering an in-depth look at your skills;',
      'Unlimited application submissions to a diverse array of job listings according to your chosen roles*;',
      'Reception of a diverse range of job offers, precisely aligned with the job positions you have selected;',
      'Flexibility to apply across the globe or target specific countries.'
    ]
  },
  professional: {
    name: 'PROFESSIONAL PLAN DETAILS',
    text: 'Unlock the full spectrum of opportunities with our Professional Plan, designed for dynamic individuals ready to make a lasting impact in their job search. This plan allows you to delve into five distinct job positions, broadening your scope and honing your focus.',
    subtitle: 'Professional plan includes:',
    points: [
      'Exploration of up to 5 job positions, showcasing your adaptability;',
      'Development of 5 custom CVs, each attuned to the specific demands of your selected roles;',
      'Upload 5 skilled demo videos, providing a compelling insight into your capabilities;',
      'Unlimited application submissions to a wide array of job listings*;',
      'Receive a diverse array of job offers, thoughtfully tailored to your unique profile and the job positions you have selected;',
      'Flexibility to apply globally or direct your efforts to specific countries.'
    ]
  },
  ultimate: {
    name: 'ULTIMATE PLAN DETAILS',
    text: 'Unleash unparalleled potential with our Ultimate Plan, a comprehensive solution tailored for ambitious individuals poised to make their mark in the professional landscape. The Ultimate Plan empowers you to explore a remarkable ten distinct job positions, allowing you to tap into an expansive array of opportunities.',
    subtitle: 'Ultimate plan includes:',
    points: [
      'Exploration of up to 10 job positions, demonstrating your diverse skillset;',
      'Development of 10 custom CVs, each fine-tuned to align with the requirements of your chosen positions;',
      'Upload 10 skilled demo videos, offering an immersive presentation of your talents;',
      'Unlimited application submissions across a wide spectrum of job listings according to your chosen roles*;',
      'Reception of an extensive array of job offers, thoughtfully tailored to your profile and aligned with the positions you\'ve selected;',
      'Flexibility to apply globally or focus on specific countries;'
    ]
  },
};

export const monthlyPlans: IPlan[] = [
  {
    id: 1,
    price_id: 'price_1OOINkEuEtvQlixI7f2FvcuS',
    title: 'BASIC',
    subtitle: '1 job position to seek for',
    description: descriptionType.basic,
    price: 9.99,
  },
  {
    id: 2,
    price_id: 'price_1OOINgEuEtvQlixIsmI13ECk',
    title: 'STANDARD',
    subtitle: '2 job positions to seek for',
    description: descriptionType.standard,
    price: 42,
  },
  {
    id: 3,
    price_id: 'price_1OOINYEuEtvQlixIWUBjBoUM',
    title: 'PREMIUM',
    subtitle: '3 job positions to seek for',
    description: descriptionType.premium,
    price: 57,
  },
  {
    id: 4,
    price_id: 'price_1OOINDEuEtvQlixIq0OgtElB',
    title: 'PROFESSIONAL',
    subtitle: '5 job positions to seek for',
    description: descriptionType.professional,
    price: 87,
  },
  {
    id: 5,
    price_id: 'price_1OOIMMEuEtvQlixIbZsrLaAh',
    title: 'ULTIMATE',
    subtitle: '10 job positions to seek for',
    description: descriptionType.ultimate,
    price: 147,
  }
];

export const yearlyPlans: IPlan[] = [
  {
    id: 6,
    price_id: 'price_1OOINkEuEtvQlixIhBh6J0j5',
    title: 'BASIC',
    subtitle: '1 job position to seek for',
    description: descriptionType.basic,
    price: 90,
    perMonth: 8,
    save: 18
  },
  {
    id: 7,
    price_id: 'price_1OOINgEuEtvQlixI6z04XvJ6',
    title: 'STANDARD',
    subtitle: '2 job positions to seek for',
    description: descriptionType.standard,
    price: 140,
    perMonth: 12,
    save: 28,
  },
  {
    id: 8,
    price_id: 'price_1OOINYEuEtvQlixILMj2klOM',
    title: 'PREMIUM',
    subtitle: '3 job positions to seek for',
    description: descriptionType.premium,
    price: 190,
    perMonth: 16,
    save: 38
  },
  {
    id: 9,
    price_id: 'price_1OOINDEuEtvQlixIhi0CkZnQ',
    title: 'PROFESSIONAL',
    subtitle: '5 job positions to seek for',
    description: descriptionType.professional,
    price: 270,
    perMonth: 23,
    save: 78
  },
  {
    id: 10,
    price_id: 'price_1OOIMMEuEtvQlixI6VXW5Poa',
    title: 'ULTIMATE',
    subtitle: '10 job positions to seek for',
    description: descriptionType.ultimate,
    price: 490,
    perMonth: 41,
    save: 98
  }
];

export const Subscription = () => {
  const [planTime, setPlanTime] = useState<PlanTime>(PlanTime.Monthly);
  const [selectedPlanId, setSelectedPlanId] = useState<number>(1);
  const [selectedDescription, setSelectedDescription] = useState<IPlanDescription>(monthlyPlans[0].description);
  const [selectedPriceId, setSelectedPriceId] = useState<string>(monthlyPlans[0].price_id);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const router = useRouter();

  const handlePlanClick = useCallback((plan: IPlan) => {
    setSelectedPriceId(plan.price_id);
    setSelectedPlanId(plan.id);
    setSelectedDescription(plan.description);
  }, []);

  const handlePlanRedirect = async () => {
    try {
      setIsLoading(true)
      const data: IGenerateSubscription = {
        priceId: selectedPriceId,
        // priceId: 'price_1OOIMMEuEtvQlixI6VXW5Poa',
      };

      const resp: AxiosResponse<any, any> = await generateSubscriptionPage(data);
      const checkoutLink: string = resp.data.data.data;
      router.push(checkoutLink);
    } catch (error) {
      setIsLoading(false);
    }
  };

  return (
    <>
      <FlowContainer
        title={'ADD SUBSCRIPTION'}
        text={"VideoWorkers charges a subscription for the active accounts on the platform. In order to be seen by employers worldwide or in the countries you wish, you have to pay a subscription. Select below the desired package, with a monthly or annual payment plan."}
        forAddEdit
      >
        <div className="subscription">
          <div className="subscription__mid">
            <div className="subscription__content">
              <div className="subscription__plans-container">
              {/* Plan types were there */}

                {planTime === PlanTime.Monthly ? (
                  <div className="subscription__plans">
                    {monthlyPlans.slice(0, 1).map(plan => {
                      const {
                        id,
                        title,
                        subtitle,
                        price,
                      } = plan;

                      return (
                        <>
                          <div
                            key={id}
                            onClick={() => handlePlanClick(plan)}
                            className={classNames("plan", {
                              "plan--active": selectedPlanId === id,
                              "plan--first": id === 1,
                            })}
                          >
                            {id === 1 && (
                              <div className="plan__tag">
                                PROMO PLAN
                              </div>
                            )}

                            <div className="plan__left">
                              <div className="plan__checkbox">
                                <Checkbox
                                  forPlans
                                  checked={selectedPlanId === id}
                                  onClick={() => {}}
                                />
                              </div>

                              <div className="plan__info">
                                <div className="plan__title">{title}</div>
                                <div className="plan__subtitle">{subtitle}</div>
                              </div>
                            </div>

                            <div className="plan__right">
                              <div className="plan__right-info">
                                <div className={classNames("plan__currency", {
                                  "plan__currency--active": selectedPlanId === id
                                })}>
                                  $
                                </div>

                                <div className={classNames("plan__price", {
                                  "plan__price--active": selectedPlanId === id
                                })}>
                                  {price}
                                </div>

                                {id !== 1 ? (
                                    <div className={classNames("plan__for", {
                                      "plan__for--active": selectedPlanId === id
                                    })}>
                                      for
                                      <div className="plan__months">3 months</div>
                                    </div>
                                ) : (
                                  <div className={classNames("plan__first-plan-info", {
                                    "plan__first-plan-info--active": id === selectedPlanId
                                  })}>
                                    for the first

                                    <div className="plan__first-plan-info-months">
                                      3 months
                                    </div>
                                  </div>
                                )}
                              </div>

                              {id === 1 && (
                                <div className={classNames("plan__right-text", {
                                  "plan__right-text--active": id === selectedPlanId
                                })}>
                                  {`($27 for 3 months, after the trial end)`}
                                </div>
                              )}
                            </div>
                          </div>

                          {selectedPlanId === id && (
                            <div className="subscription__description">
                              <PlanDetails description={selectedDescription} />
                            </div>
                          )}
                        </>
                      )
                    })}
                  </div>
                ) : (
                  <div className="subscription__plans">
                    {yearlyPlans.map(plan => {
                      const {
                        id,
                        title,
                        subtitle,
                        price,
                        perMonth,
                        save
                      } = plan;

                      return (
                        <>
                          <div
                            key={id}
                            onClick={() => handlePlanClick(plan)}
                            className={classNames("plan", {
                              "plan--active": selectedPlanId === id,
                              "plan--first": id === 1,
                            })}
                          >
                            <div className="plan__tag plan__tag--yearly">
                              {`Save $${save}`}
                            </div>

                            <div className="plan__left">
                              <div className="plan__checkbox">
                                <Checkbox
                                  forPlans
                                  checked={selectedPlanId === id}
                                  onClick={() => {}}
                                  />
                              </div>

                              <div className="plan__info">
                                <div className="plan__title">{title}</div>
                                <div className="plan__subtitle">{subtitle}</div>
                              </div>
                            </div>

                            <div className={classNames("plan__right  plan__right--anual", {
                              "plan__right--active": id === selectedPlanId
                            })}>
                              <div className="plan__right-info">
                                <div className={classNames("plan__price-yearly", {
                                  "plan__price-yearly--active": selectedPlanId === id
                                })}>
                                  {`$${perMonth}`}
                                </div>

                                <div className="plan__text--italic plan__per">
                                  per month
                                </div>
                              </div>

                              <div className="plan__text">
                                {`1 year commitment, pay $${price} upfront`}
                              </div>
                            </div>
                          </div>

                          {selectedPlanId === id && (
                            <div className="subscription__description">
                              <PlanDetails description={selectedDescription} />
                            </div>
                          )}
                        </>
                      )
                    })}
                  </div>
                )}

                <div className="under-text">
                  $3.33 per month. Pay 3 months upfront. Cancel anytime!
                </div>
              </div>
            </div>

            <div className="subscription__right">
              <PlanDetails
                description={selectedDescription}
              />
            </div>
          </div>

          <div className="subscription__bottom">
            <NextStep
              onClick={handlePlanRedirect}
              nextStep={NextStepInfo.Payment}
              isLoading={isLoading}
            />
          </div>
        </div>
      </FlowContainer>

      <div className="steps steps--mobile">
        <StepIcon iconName={"driving"} status={"done"} title={"Driving"} />

        <div className="steps-arrows">
          <Arrows toRight={false} arrowsCount={3} />
        </div>

        <StepIcon
          iconName={"picture"}
          status={"done"}
          title={"Picture"}
        />

        <div className="steps-arrows">
          <Arrows toRight={false} arrowsCount={3} />
        </div>

        <StepIcon
          iconName={"subscription"}
          status={"current"}
          title={"Subscription"}
        />
      </div>

      <div className="steps steps--desktop">
        <StepIcon
          iconName={"info"}
          status={"done"}
          title={"Information"}
        />

        <div className="steps-arrows">
          <Arrows toRight={false} />
        </div>

        <StepIcon
          iconName={"residency"}
          status={"done"}
          title={"Residency"}
        />

        <div className="steps-arrows">
          <Arrows toRight={false} />
        </div>

        <StepIcon
          iconName={"experience"}
          status={"done"}
          title={"Experience"}
        />

        <div className="steps-arrows">
          <Arrows toRight={false} />
        </div>

        <StepIcon
          iconName={"education"}
          status={"done"}
          title={"Education"}
        />

        <div className="steps-arrows">
          <Arrows toRight={false} />
        </div>

        <StepIcon
          iconName={"certifications"}
          status={"done"}
          title={"Certification"}
        />

        <div className="steps-arrows">
          <Arrows toRight={false} />
        </div>

        <StepIcon
          iconName={"courses"}
          status={"done"}
          title={"Courses"}
        />

        <div className="steps-arrows">
          <Arrows toRight={false} />
        </div>

        <StepIcon
          iconName={"language"}
          status={"done"}
          title={"Language"}
          />

        <div className="steps-arrows">
          <Arrows toRight={false} />
        </div>

        <StepIcon
          iconName={"driving"}
          status={"done"}
          title={"Driving"}
        />

        <div className="steps-arrows">
          <Arrows toRight={false} />
        </div>

        <StepIcon
          iconName={"picture"}
          status={"done"}
          title={"Picture"}
        />

        <div className="steps-arrows">
          <Arrows toRight={false} />
        </div>

        <StepIcon
          iconName={"subscription"}
          status={"current"}
          title={"Subscription"}
        />
      </div>
    </>
  )
}

