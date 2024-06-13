'use client';
import { useCallback, useEffect } from 'react';
import './layout.scss';
import { UserDataStore } from '@/store/userDataStore';
import { useRecoilState, useSetRecoilState } from 'recoil';
import { AxiosResponse } from 'axios';
import { getUserData } from '@/services/api/authUser.service';
import { IUserData } from '@/types/UserData';
import { useRouter } from 'next/navigation';
import Script from 'next/script';
import Head from 'next/head';
import { hotjarScriptCandidates } from '@/components/utils/utils';

//here will be the middleware to check user data before access
export default function StepsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const setUserData = useSetRecoilState(UserDataStore);
  const router = useRouter();

  const fetchUserPayment = useCallback(async () => {
    try {
      const resp: AxiosResponse<any, any> = await getUserData();
      const userDataFecthed: IUserData = resp.data.data.data;
      setUserData(userDataFecthed);

      if (Boolean(userDataFecthed.is_subscription_active)) {
        return;
      }

      router.push('/candidates/flow/subscription/');
    } catch (error) {}
  }, []);

  useEffect(() => {
    fetchUserPayment();
  } , []);

  return (
    <div className="steps-layout">
      <Head>
        <Script
          id={hotjarScriptCandidates}
          strategy="afterInteractive"
          dangerouslySetInnerHTML={{ __html: hotjarScriptCandidates }}
        />
      </Head>

      {children}
    </div>
  )
}
