'use client'
import { useRouter } from 'next/navigation';
import './PlanBox.scss';
import { ButtonIcon, ButtonWithIcon } from '../../utils/ButtonWihIcon';
import { ButtonColor } from '@/types/ButtonColor';
import { useCallback, useEffect } from 'react';
import { getUserData } from '@/services/api/authUser.service';
import { useRecoilState } from 'recoil';
import { UserDataStore } from '@/store/userDataStore';
import { IUserData } from '@/types/UserData';
import { AxiosResponse } from 'axios';

export const PlanBox = () => {
  const router = useRouter();
  const [userData, setUserData] = useRecoilState(UserDataStore);

  const fetchUserData = useCallback(async () => {
    try {
      const resp: AxiosResponse<any, any> = await getUserData();
      const data: IUserData = resp.data.data.data;
      setUserData(data);
    } catch (error) {}
  }, []);

  useEffect(() => {
    if (!userData) fetchUserData();
  }, []);

  return (
    <div className="container plan-box">
      <div className="plan-box__part">
        <div className="plan-box__headline">
          Current Plan
        </div>

        <div className="plan-box__title">
          {userData?.Subscription.Payment.item_name || 'Basic plan'}
        </div>

        <div className="plan-box__text">
          <div className="plan-box__text-icon"/>
            {`${userData?.Subscription.job_position_limit || '1'} job ${Number(userData?.Subscription.job_position_limit) > 1 ? 'positions' : 'position'} to seek for`}
        </div>
      </div>

      <div className="plan-box__part">
        <div onClick={() => router.push('/candidates/dashboard/settings/billing/')} className="plan-box__button">
          <ButtonWithIcon
            color={ButtonColor.Blue}
            bgColor={ButtonColor.White}
            borderColor={ButtonColor.Blue}
            icon={ButtonIcon.PlusBlue}
            text='UPGRADE PLAN'
          />
        </div>

        <div className="plan-box__subline">
          Upgrade your plan for more job positions.
        </div>
      </div>

    </div>
  )
}
