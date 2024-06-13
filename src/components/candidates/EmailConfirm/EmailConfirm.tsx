'use client';
import './EmailConfirm.scss';
import { useCallback, useEffect, useState } from 'react';
import classNames from 'classnames';
import { useRouter } from 'next/navigation';
import { SetterOrUpdater, useSetRecoilState } from 'recoil';
import { ITokenData, emailConfirm, emailConfirmCompany } from '@/services/api/emailConfirm.service';
import { AxiosResponse } from 'axios';
import { IUserData } from '@/types/UserData';
import { UserDataStore } from '@/store/userDataStore';
import { CompanyDataStore } from '@/store/companyDataStore';
import { ICompanyData } from '@/types/CompanyData';

enum MessageText {
  Default = 'A confirmation email has been sent to your inbox. Please open the email and follow the instructions to confirm your email address.',
  TokenWrong = 'Confirmation token does not match the one from you email, please resend code and try again.',
  Success = 'Success! Your email is verified!',
};

type Props = {
  forCompany?: boolean;
};

export const EmailConfirm: React.FC<Props> = ({ forCompany = false }) => {
  const [messageText, setMessageText] = useState<MessageText>(MessageText.Default);
  const [messageTitle, setMessageTitle] = useState<string>('');
  const router = useRouter();
  const setUserData: SetterOrUpdater<IUserData | null> = useSetRecoilState(UserDataStore);
  const setCompanyData: SetterOrUpdater<ICompanyData | null> = useSetRecoilState(CompanyDataStore);

  useEffect(() => {
    const token = new URLSearchParams(window.location.search).get('token');

    if (!token) {
      return;
    };

    const tokenData: ITokenData = {
      token,
    };

    handleConfirmEmail(tokenData);
  }, []);

  const handleConfirmEmail = useCallback(async (tokenData: ITokenData) => {
    try {
      let resp: AxiosResponse<any, any>;

      if (!forCompany) {
        resp = await emailConfirm(tokenData);
      } else {
        resp = await emailConfirmCompany(tokenData);
      }

      setMessageText(MessageText.Success);
      setMessageTitle('Redirecting..');
      const responseData = resp.data.data;
      const token: string = responseData.token;
      localStorage.setItem('token', token);

      if (!forCompany) {
        const userTableInfo: IUserData = responseData.data;
        setUserData(userTableInfo);
        router.push('/candidates/flow/how-it-works/');
      } else {
        const companyTableInfo: ICompanyData = responseData.data;
        setCompanyData(companyTableInfo);
        router.push('/upload-documents/');
      }
    } catch (error: any) {
      if (error.response.data.status === 401) {
        console.log('Invalid token');
        setMessageText(MessageText.TokenWrong);
      }
    }
  }, []);

  return (
    <div className="email">
      <div className="email__headline">
        Thank you for registering!
      </div>

      <h1 className="email__title">
        {!messageTitle ? (
          <>
            <div className='email__title-part'>
              Please verify
            </div>

            <div className='email__title-part'>
              {' your email'}
            </div>
          </>
        ): (
          <div className='email__title-part'>
            {messageTitle}
          </div>
        )}
      </h1>

      <p className="email__text">
        {messageText}
      </p>
    </div>
  )
}
