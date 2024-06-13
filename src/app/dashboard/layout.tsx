'use client';
import '../candidates/dashboard/layout.scss';
import classNames from 'classnames';
import { Header } from '@/components/candidates/Dashboard/Header';
import { Nav } from '@/components/candidates/Dashboard/Nav';
import { useRecoilValue, useSetRecoilState } from 'recoil';
import { MenuOpenStore } from '@/store/menuOpenStore';
import { Menu } from '@/components/candidates/Dashboard/Menu';
import { useCallback, useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { ICompanyData } from '@/types/CompanyData';
import { getCompanyData } from '@/services/api/authUser.service';
import { AxiosResponse } from 'axios';
import Head from 'next/head';
import Script from 'next/script';
import { hotjarScriptCompanies } from '@/components/utils/utils';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const menuOpen = useRecoilValue(MenuOpenStore);
  const [hideScroll, setHideScroll] = useState<boolean>(false);
  const router = useRouter();

  const checkCompanyVerification = useCallback(async () => {
    try {
      const resp: AxiosResponse<any, any> = await getCompanyData();
      const companyData: ICompanyData = resp.data.data.data;

      if (!companyData.is_verified) {
        router.push('/signin');
      }
    } catch (error) {}
  }, []);

  useEffect(() => {
    checkCompanyVerification();
  }, []);

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
          id={hotjarScriptCompanies}
          strategy="afterInteractive"
          dangerouslySetInnerHTML={{ __html: hotjarScriptCompanies }}
        />
      </Head>

      <div className={classNames("dashboard", {
        "dashboard--menu-open": hideScroll
      })}>
        <div className="dashboard__side-menu">
          <Menu forCompany/>
        </div>

        <div className="dashboard__right">
          <div className="dashboard__header">
            <Header forCompany />
          </div>

          <div className="dashboard__children">
            {children}
          </div>

          <div className="dashboard__nav">
            <Nav forCompany/>
          </div>
        </div>

        <div className={classNames("dashboard__menu", {
          "dashboard__menu--active": menuOpen
        })}>
          <Menu forCompany/>
        </div>
      </div>
    </div>
  )
}
