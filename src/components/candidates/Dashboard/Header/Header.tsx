'use client';
import './Header.scss';
import Link from 'next/link';
import { useRecoilState, useRecoilValue } from 'recoil';
import { useCallback, useEffect, useState } from 'react';
import { UserDataStore } from '@/store/userDataStore';
import { getCompanyData, getUserData } from '@/services/api/authUser.service';
import { IUserData } from '@/types/UserData';
import { AxiosResponse } from 'axios';
import { CandidateHeaderMessageStore, CandidateHeaderMessages } from '@/store/headerStore';
import { CompanyDataStore } from '@/store/companyDataStore';
import { formatMediaUrl } from '@/components/utils/utils';
import { ICompanyData } from '@/types/CompanyData';
import { useRouter } from 'next/navigation';
import { Notifications } from '@/components/Notifications';

type Props = {
  forCompany?: boolean;
};

export const Header: React.FC<Props> = ({ forCompany = false }) => {
  const router = useRouter();
  const [userData, setUserData] = useRecoilState(UserDataStore);
  const [companyData, setCompanyData] = useRecoilState(CompanyDataStore);
  const candidateHeaderMessage = useRecoilValue(CandidateHeaderMessageStore);
  const [notifyOpen, setNotifyOpen] = useState<boolean>(false);

  const fetchUserData = useCallback(async () => {
    try {
      const resp: AxiosResponse<any, any> = await getUserData();
      const userDataFecthed: IUserData = resp.data.data.data;
      setUserData(userDataFecthed);
    } catch (error) {}
  }, []);

  const fetchCompanyData = useCallback(async () => {
    try {
      const resp: AxiosResponse<any, any> = await getCompanyData();
      const companyDataFecthed: ICompanyData = resp.data.data.data;
      setCompanyData(companyDataFecthed);
    } catch (error) {}
  }, []);

  useEffect(() => {
    if (!forCompany) {
      if (!userData) fetchUserData();
    } else {
      if (!companyData) fetchCompanyData();
    }
  }, []);

  return (
    <div className="header">
      <div className="header__left">
        <div className="header__logo"/>

        <div className="header__info">
          {!forCompany ? (
            <div className="header__title">
              Candidate's Dashboard
            </div>
          ) : (
            <div className="header__title">
              Company's Dashboard
            </div>
          )}

          <div className="header__subtitle">
            {candidateHeaderMessage === CandidateHeaderMessages.Dashboard && (
              <>
                {`Welcome back, ${!forCompany ? userData?.firstname || '' : companyData?.firstname || ''}`}
              </>
            )}

            {candidateHeaderMessage}
          </div>
        </div>
      </div>

      <div className="header__search"></div>

      <div className="header__right">
        <div className="header__icons">
          <div
            className="header__icon header__icon--star"
            onClick={() => {
              if (!forCompany) {
                router.push('/candidates/dashboard/favorites/jobs/');
              } else {
                router.push('/dashboard/favorites/workers/');
              }
            }}
          />

          <div className="header__icon header__icon--chat">
            <div className="header__status header__status--green"/>
          </div>

          <div onClick={() => setNotifyOpen(!notifyOpen)} className="header__icon header__icon--bell">
            <div className="header__status header__status--red"/>

            {notifyOpen && (
              <div className="header__notify">
                <Notifications forCompany={forCompany} />
              </div>
            )}
          </div>
        </div>

        <Link
          href={!forCompany
            ? '/candidates/dashboard/settings/account/'
            : '/dashboard/settings/company/'
          }
          className={!forCompany
            ? "header__profile-container"
            : "header__profile-container header__profile-container--company"
          }
        >
          {!forCompany ? (
            <img
              src={userData?.profile_image || ''}
              alt="picture"
              className="header__profile"
            />
          ) : (
            <img
              src={companyData?.company_logo || formatMediaUrl(
                `flag-icon-${companyData?.Country.alpha_2.toLowerCase() || 'globe'}.svg`,
              )}
              alt="picture"
              className="header__profile header__profile--company"
            />
          )}
        </Link>
      </div>
    </div>
  )
}
