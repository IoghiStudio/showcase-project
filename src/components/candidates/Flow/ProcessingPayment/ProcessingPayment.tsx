'use client';
import './ProcessingPayment.scss';
import { useCallback, useEffect } from 'react';
import { getUserData } from '@/services/api/authUser.service';
import { IUserData } from '@/types/UserData';
import { useRouter } from 'next/navigation';
import { LoadingModalText } from '@/components/utils/LoadingTextModal';

export const ProcessingPayment = () => {
  const router = useRouter();

  const fetchUserPayment = useCallback(async () => {
    try {
      const resp = await getUserData();
      const userData: IUserData = resp.data.data.data;
      const isSubscribed: boolean = Boolean(userData.is_subscription_active);
      if (isSubscribed) {
        router.push('/candidates/steps/info-note/');
      } else {
        router.push('/candidates/flow/subscription/');
      }

    } catch (error) {
      router.push('/candidates/signin');
    }
  }, []);

  useEffect(() => {
    fetchUserPayment();
  }, []);

  return (
    <div className="processing-payment">
      <LoadingModalText />
    </div>
  )
}
