'use client';
import './CreditCard.scss';
import { getCompanyData, getUserData } from '@/services/api/authUser.service';
import { IUserData } from '@/types/UserData';
import { AxiosResponse } from 'axios';
import { useCallback, useEffect } from 'react';
import { useRecoilState } from 'recoil';
import { UserDataStore } from '@/store/userDataStore';
import { CompanyDataStore } from '@/store/companyDataStore';
import { ICompanyData } from '@/types/CompanyData';

type Props = {
  forCompany?: boolean;
};

export const CreditCard: React.FC<Props> = ({ forCompany = false }) => {
  const [userData, setUserData] = useRecoilState(UserDataStore);
  const [companyData, setCompanyData] = useRecoilState(CompanyDataStore);

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
      const companyFecthed: ICompanyData = resp.data.data.data;
      console.log(companyFecthed);

      setCompanyData(companyFecthed);
    } catch (error) {}
  }, []);

  useEffect(() => {
    if (!forCompany) {
      if (!userData) fetchUserData();
    } else {
      if (!companyData) fetchCompanyData();
    }
  }, []);

  const addLeadingZero = useCallback((number: number) => (number < 10 ? '0' : '') + number, []);

  return (
    <div className="container credit-card">
    <div className="credit-card__top">
      <div className="container__title credit-card__title">
        Billing Information
      </div>

    {!forCompany ? (
      <>
        <div className="credit-card__text">
          {`${userData?.CandidateCard?.card_type.toUpperCase() || 'VISA'} ending in`}

          <span className="credit-card__number">
            {userData?.CandidateCard?.card_number || '0000'}
          </span>
        </div>

        <div className="credit-card__text-sm">
          {`Expires ${addLeadingZero(Number(userData?.CandidateCard?.exp_month) || 1) || '01'}/${userData?.CandidateCard?.exp_year || 2028}`}
        </div>
      </>
    ) : (
      <>
        <div className="credit-card__text">
          {`${companyData?.CompanyCard?.card_type.toUpperCase() || 'VISA'} ending in`}

          <span className="credit-card__number">
            {companyData?.CompanyCard?.card_number || '0000'}
          </span>
        </div>

        <div className="credit-card__text-sm">
          {`Expires ${addLeadingZero(Number(companyData?.CompanyCard?.exp_month) || 1) || '01'}/${companyData?.CompanyCard?.exp_year || 2028}`}
        </div>
      </>
    )}
    </div>

    <div className="credit-card__bottom">
      <div className="credit-card__bottom-line">
        Payment Secured by
      </div>

      <div className="credit-card__stripe">stripe</div>
    </div>
  </div>
  )
}

