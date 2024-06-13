'use client';
import '../../../../Flow/Subscription/Subscription.scss';
import './Plans.scss';
import { useCallback, useEffect, useState } from 'react';
import {  PlanTime } from '@/components/candidates/Flow/Subscription';
import { useRouter } from 'next/navigation';
import { IGenerateSubscription, generateSubscriptionPage } from '@/services/api/stripe.service';
import { AxiosResponse } from 'axios';
import classNames from 'classnames';
import { Switch } from '@/components/utils/Switch';
import { Checkbox } from '@/components/utils/Checkbox';
import { Button } from '@/components/utils/Button';
import { ButtonColor } from '@/types/ButtonColor';
import { useRecoilState } from 'recoil';
import { UserDataStore } from '@/store/userDataStore';
import { getUserData } from '@/services/api/authUser.service';
import { IUserData } from '@/types/UserData';
import { formatDateShort } from '@/components/utils/utils';

interface IDashPlan {
  id: number;
  price_id: string;
  title: string;
  subtitle: string;
  price: number;
  perMonth?: number;
  save?: number;
};

export const monthlyPlans: IDashPlan[] = [
  {
    id: 1,
    price_id: 'price_1OOINkEuEtvQlixI7f2FvcuS',
    title: 'BASIC',
    subtitle: '1 job position to seek for',
    price: 27,
  },
  {
    id: 2,
    price_id: 'price_1OOINgEuEtvQlixIsmI13ECk',
    title: 'STANDARD',
    subtitle: '2 job positions to seek for',
    price: 42,
  },
  {
    id: 3,
    price_id: 'price_1OOINYEuEtvQlixIWUBjBoUM',
    title: 'PREMIUM',
    subtitle: '3 job positions to seek for',
    price: 57,
  },
  {
    id: 4,
    price_id: 'price_1OOINDEuEtvQlixIq0OgtElB',
    title: 'PROFESSIONAL',
    subtitle: '5 job positions to seek for',
    price: 87,
  },
  {
    id: 5,
    price_id: 'price_1OOIMMEuEtvQlixIbZsrLaAh',
    title: 'ULTIMATE',
    subtitle: '10 job positions to seek for',
    price: 147,
  }
];

export const yearlyPlans: IDashPlan[] = [
  {
    id: 6,
    price_id: 'price_1OOINkEuEtvQlixIhBh6J0j5',
    title: 'BASIC',
    subtitle: '1 job position to seek for',
    price: 90,
    perMonth: 8,
    save: 18
  },
  {
    id: 7,
    price_id: 'price_1OOINgEuEtvQlixI6z04XvJ6',
    title: 'STANDARD',
    subtitle: '2 job positions to seek for',
    price: 140,
    perMonth: 12,
    save: 28,
  },
  {
    id: 8,
    price_id: 'price_1OOINYEuEtvQlixILMj2klOM',
    title: 'PREMIUM',
    subtitle: '3 job positions to seek for',
    price: 190,
    perMonth: 16,
    save: 38
  },
  {
    id: 9,
    price_id: 'price_1OOINDEuEtvQlixIhi0CkZnQ',
    title: 'PROFESSIONAL',
    subtitle: '5 job positions to seek for',
    price: 270,
    perMonth: 23,
    save: 78
  },
  {
    id: 10,
    price_id: 'price_1OOIMMEuEtvQlixI6VXW5Poa',
    title: 'ULTIMATE',
    subtitle: '10 job positions to seek for',
    price: 490,
    perMonth: 41,
    save: 98
  }
];


export const Plans = () => {
  const [userData, setUserData] = useRecoilState(UserDataStore);
  const [planTime, setPlanTime] = useState<PlanTime>(PlanTime.Monthly);
  const [selectedPlan, setSelectedPlan] = useState<IDashPlan>(monthlyPlans[0]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const router = useRouter();

  useEffect(() => {
    if (!userData) fetchUserData();
  }, []);

  const fetchUserData = useCallback(async () => {
    try {
      const resp: AxiosResponse<any, any> = await getUserData();
      const userDataFecthed: IUserData = resp.data.data.data;
      console.log(userDataFecthed);

      setUserData(userDataFecthed);
    } catch (error) {}
  }, []);

  const handlePlanClick = useCallback((plan: IDashPlan) => {
    setSelectedPlan(plan);
  }, []);

  const handlePlanRedirect = async () => {
    try {
      setIsLoading(true)
      const data: IGenerateSubscription = {
        priceId: selectedPlan.price_id,
      };

      const resp: AxiosResponse<any, any> = await generateSubscriptionPage(data);
      const checkoutLink: string = resp.data.data.data;
      router.push(checkoutLink);
    } catch (error) {
      setIsLoading(false);
    }
  };

  return (
    <div className="container plans">
      <div className="plans__top">
        <div className="container__title">Subscription Plans</div>
        <div className="container__text">Available plans for your account</div>
      </div>

      <div className="subscription__content subscription__content--dash">
        <div className="subscription__plans-container subscription__plans-container--dash">
          <div className="subscription__plan-type">
            <div className={classNames("subscription__plan-type-box", {
              "subscription__plan-type-box--active": planTime === PlanTime.Monthly
            })}>
              3 Months Plans
            </div>

            <div className="subscription__switch" onClick={() => {
              if (planTime === PlanTime.Monthly) {
                setPlanTime(PlanTime.Yearly);
                return;
              }

              setPlanTime(PlanTime.Monthly);
            }}>
              <Switch isOpen={planTime === PlanTime.Yearly}/>
            </div>

            <div className={classNames("subscription__plan-type-box", {
              "subscription__plan-type-box--active": planTime === PlanTime.Yearly
            })}>
              Annual Plans
            </div>
          </div>

          {planTime === PlanTime.Monthly ? (
            <div className="subscription__plans subscription__plans--dash">
              {monthlyPlans.map(plan => {
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
                        "plan--active": selectedPlan.id === id,
                      })}
                    >
                      <div className="plan__left">
                        <div className="plan__checkbox">
                          <Checkbox
                            forPlans
                            checked={selectedPlan.id === id}
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
                            "plan__currency--active": selectedPlan.id === id
                          })}>
                            $
                          </div>

                          <div className={classNames("plan__price", {
                            "plan__price--active": selectedPlan.id === id
                          })}>
                            {price}
                          </div>

                          <div className={classNames("plan__for", {
                            "plan__for--active": selectedPlan.id === id
                          })}>
                            for
                            <div className="plan__months">3 months</div>
                          </div>
                        </div>
                      </div>
                    </div>

                    {selectedPlan.id === id && (
                      <div className="plans__info">

                      </div>
                    )}
                  </>
                )
              })}
            </div>
          ) : (
            <div className="subscription__plans subscription__plans--dash">
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
                        "plan--active": selectedPlan.id === id,
                        "plan--first": id === 1,
                      })}
                    >
                      <div className="plan__tag plan__tag--yearly plan__tag--dash">
                        {`Save $${save}`}
                      </div>

                      <div className="plan__left">
                        <div className="plan__checkbox">
                          <Checkbox
                            forPlans
                            checked={selectedPlan.id === id}
                            onClick={() => {}}
                          />
                        </div>

                        <div className="plan__info">
                          <div className="plan__title">{title}</div>
                          <div className="plan__subtitle">{subtitle}</div>
                        </div>
                      </div>

                      <div className={classNames("plan__right  plan__right--anual", {
                        "plan__right--active": id === selectedPlan.id
                      })}>
                        <div className="plan__right-info">
                          <div className={classNames("plan__price-yearly", {
                            "plan__price-yearly--active": selectedPlan.id === id
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

                    {selectedPlan.id === id && (
                      <div className="plans__info">
                        <div className="plans__row">
                          <div className="plans__pair">
                            <div className="plans__pair-title">
                              Current Plan
                            </div>

                            <div className="plans__pair-text">
                              {userData?.Subscription && userData.Subscription.Payment.item_name.split(' ').slice(0, 1)}
                            </div>
                          </div>

                          <div className="plans__pair plans__pair--second">
                            <div className="plans__pair-title">
                              {`$${(userData?.Subscription.Payment.amount || 0) / 100}`}
                            </div>

                            {userData?.Subscription.Payment.duration === 'MONTHLY' ? (
                              <div className="plans__pair-text">
                                per 3 months
                              </div>
                            ) : (
                              <div className="plans__pair-text">
                                per year
                              </div>
                            )}
                          </div>
                        </div>

                        <div className="plans__row plans__row--second">
                          <div className="plans__pair">
                            <div className="plans__pair-title">
                              Selected Plan
                            </div>

                            <div className="plans__pair-text">
                              {selectedPlan.title}
                            </div>
                          </div>

                          <div className="plans__pair plans__pair--second">
                            <div className="plans__pair-title">
                              {`$${selectedPlan.price || 0}`}
                            </div>

                            {planTime !== PlanTime.Yearly ? (
                              <div className="plans__pair-text">
                                per 3 months
                              </div>
                            ) : (
                              <div className="plans__pair-text">
                                per year
                              </div>
                            )}
                          </div>
                        </div>

                        <div className="plans__btn">
                          <Button
                            textSmall
                            color={ButtonColor.Green}
                            onClick={() => handlePlanRedirect()}
                          >
                            Change plan
                          </Button>
                        </div>
                      </div>
                    )}
                  </>
                )
              })}
            </div>
          )}
        </div>

        <div className="plans__right">
          <div className="plans__info plans__info--right">
            <div className="plans__title">
              {`${selectedPlan.title} Plan`}
            </div>

            <div className="plans__text">
              <div className="plans__text-icon"/>
              {`${selectedPlan.subtitle}`}
            </div>

            <div className="plans__row">
              <div className="plans__pair">
                <div className="plans__pair-title">
                  Current Plan
                </div>

                <div className="plans__pair-text">
                  {userData?.Subscription && userData.Subscription.Payment.item_name.split(' ').slice(0, 1)}
                </div>
              </div>

              <div className="plans__pair plans__pair--second">
                <div className="plans__pair-title">
                  {`$${(userData?.Subscription.Payment.amount || 0) / 100}`}
                </div>

                {userData?.Subscription.Payment.duration === 'MONTHLY' ? (
                  <div className="plans__pair-text">
                    per 3 months
                  </div>
                ) : (
                  <div className="plans__pair-text">
                    per year
                  </div>
                )}
              </div>
            </div>

            <div className="plans__row plans__row--second">
              <div className="plans__pair">
                <div className="plans__pair-title">
                  Selected Plan
                </div>

                <div className="plans__pair-text">
                  {selectedPlan.title}
                </div>
              </div>

              <div className="plans__pair plans__pair--second">
                <div className="plans__pair-title">
                  {`$${selectedPlan.price || 0}`}
                </div>

                {planTime === PlanTime.Monthly ? (
                  <div className="plans__pair-text">
                    per 3 months
                  </div>
                ) : (
                  <div className="plans__pair-text">
                    per year
                  </div>
                )}
              </div>
            </div>

            <div className="plans__btn">
              <Button
                textSmall
                color={ButtonColor.Green}
                onClick={() => handlePlanRedirect()}
              >
                Change plan
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
};
