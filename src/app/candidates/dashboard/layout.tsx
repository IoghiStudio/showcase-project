'use client';
import './layout.scss';
import classNames from 'classnames';
import { Header } from '@/components/candidates/Dashboard/Header';
import { Nav } from '@/components/candidates/Dashboard/Nav';
import { useRecoilValue, useSetRecoilState } from 'recoil';
import { MenuOpenStore } from '@/store/menuOpenStore';
import { Menu } from '@/components/candidates/Dashboard/Menu';
import { useCallback, useEffect, useState } from 'react';
import { UserDataStore } from '@/store/userDataStore';
import { useRouter } from 'next/navigation';
import { getUserData } from '@/services/api/authUser.service';
import { IUserData } from '@/types/UserData';
import { AxiosResponse } from 'axios';
import Head from 'next/head';
import Script from 'next/script';
import { hotjarScriptCandidates } from '@/components/utils/utils';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const menuOpen = useRecoilValue(MenuOpenStore);
  const [hideScroll, setHideScroll] = useState<boolean>(false);
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

  useEffect(() => {
    if (menuOpen) {
      setTimeout(()=> setHideScroll(true), 600);
    } else {
      setHideScroll(false);
    }
  }, [menuOpen]);

  return (
    <div className="dashboard-container">
      <Head>
        <Script
          id={hotjarScriptCandidates}
          strategy="afterInteractive"
          dangerouslySetInnerHTML={{ __html: hotjarScriptCandidates }}
        />
      </Head>

      <div className={classNames("dashboard", {
        "dashboard--menu-open": hideScroll
      })}>
        <div className="dashboard__side-menu">
          <Menu />
        </div>

        <div className="dashboard__right">
          <div className="dashboard__header">
            <Header />
          </div>

          <div className="dashboard__children">
            {children}
          </div>

          <div className="dashboard__nav">
            <Nav />
          </div>
        </div>

        <div className={classNames("dashboard__menu", {
          "dashboard__menu--active": menuOpen
        })}>
          <Menu />
        </div>
      </div>
    </div>
  )
}
