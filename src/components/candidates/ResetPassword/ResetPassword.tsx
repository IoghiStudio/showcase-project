"use client";
import "./ResetPassword.scss";
import { useState, useEffect, useCallback } from "react";
import cn from "classnames";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Label } from "@/components/utils/Label";
import { InputField } from "@/components/utils/InputField";
import { Button } from "@/components/utils/Button";
import { SetterOrUpdater, useSetRecoilState } from "recoil";
import { IUserData } from "@/types/UserData";
import { AxiosResponse } from "axios";
import { IResetPassword, resetCompanyPassword, resetPassword } from "@/services/api/resetPassword.service";
import { UserDataStore } from "@/store/userDataStore";
import { ICompanyData } from "@/types/CompanyData";
import { CompanyDataStore } from "@/store/companyDataStore";

type Props = {
  forCompany?: boolean;
};

export const ResetPassword: React.FC<Props> = ({ forCompany = false }) => {
  const [password, setPassword] = useState<string>('');
  const [passwordVerification, setPasswordVerification] = useState<string>('');
  const [showSuccess, setShowSuccess] = useState<boolean>(false);
  const [showError, setShowError] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const router = useRouter();

  const setUserData: SetterOrUpdater<IUserData | null> = useSetRecoilState(UserDataStore);
  const setCompanyData: SetterOrUpdater<ICompanyData | null> = useSetRecoilState(CompanyDataStore);

  useEffect(() => {
    const token = new URLSearchParams(window.location.search).get('token');

    if (!token) {
      if (!forCompany) {
        router.push('/candidates/signin/');
      } else {
        router.push('/signin/');
      }
    }
  }, []);

  const resetFields = useCallback(() => {
    setPassword('');
    setPasswordVerification('');
  } , []);

  useEffect(() => {
    let timeoutKey: NodeJS.Timeout | undefined;

    if (showError) {
      timeoutKey = setTimeout(() => {
        setShowError(false);
      }, 2000);

      if (errorMessage === 'Unauthorized') {
        setTimeout(() => {
          if (!forCompany) {
            router.push('/candidates/signin/');
          } else {
            // router.push('/signin/');
          }
        }, 1000);
      }
    }

    if (showSuccess) {
      timeoutKey = setTimeout(() => {
        setShowSuccess(false);
      }, 2000);

      setTimeout(() => {
        if (!forCompany) {
          router.push('/candidates/flow/how-it-works/')
        } else {
          router.push('/dashboard/')
        }
      }, 3000);
    }

    return () => clearTimeout(timeoutKey);
  }, [showError, showSuccess]);

  const handleUpdatePassword = async () => {
    if (password !== passwordVerification) return;

    const token = new URLSearchParams(window.location.search).get('token');
    if (!token) return;

    const resetData: IResetPassword = {
      token,
      password
    };

    try {
      setShowError(false);
      setShowSuccess(false);
      setErrorMessage('');
      setIsLoading(true);
      let resp: AxiosResponse<any, any>;

      if (!forCompany) {
        resp = await resetPassword(resetData);
        const userTableInfo: IUserData = resp.data.data.data;
        setUserData(userTableInfo);
      } else {
        resp = await resetCompanyPassword(resetData);
        const companyTableInfo: ICompanyData = resp.data.data.data;
        setCompanyData(companyTableInfo);
      }

      const token: string = resp.data.data.token;
      const message = resp.data.message;

      localStorage.setItem('token', token);
      if (!forCompany) {
        resp = await resetPassword(resetData);
      } else {
      }

      if (message === 'request was successfull ') {
        setErrorMessage('Success! Your password was updated.');
        setShowSuccess(true);
        setIsLoading(false);
        resetFields();
      }
    } catch (error: any) {
      setIsLoading(false);

      const errorTypeMessage = error.response.data.message;
      const errorWords = errorTypeMessage.split(' ');

      if (errorTypeMessage === 'Unauthorized') {
        setErrorMessage('Unauthorized');
      }

      if (errorWords[0] === 'password') {
        if (errorWords.includes('length')) setErrorMessage('Password length must be at least 8');
        if (errorWords.includes('empty')) setErrorMessage('Password can\'t be empty');
      };

      if (errorTypeMessage === 'user not found') setErrorMessage('User not found');

      console.log(errorTypeMessage);
      setShowError(true);
    }
  }

  return (
    <div className="reset-password">
      <div className="reset-password__header">
        <h1 className="reset-password__title">
          Reset password
        </h1>

        <h3 className="reset-password__subtitle">
          of your VideoWorkers account
        </h3>
      </div>

      <div className="reset-password__form">
        <div className="reset-password__label">
          <Label title={'PASSWORD'} secondTitle={'8 symbols min'}>
            <InputField
              type="password"
              name="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />

            <div
              className={cn("reset-password__validate-icon", {
                "reset-password__validate-icon--invalid":
                  password.length > 0 && password.length < 8,
                "reset-password__validate-icon--valid": password.length >= 8,
              })}
            />
          </Label>
        </div>

        <div className="reset-password__label">
          <Label title={'PASSWORD VERIFICATION'}>
            <InputField
              type="password"
              name="password-verification"
              value={passwordVerification}
              onChange={(e) => setPasswordVerification(e.target.value)}
            />

            <div
              className={cn("reset-password__validate-icon", {
                "reset-password__validate-icon--invalid": (passwordVerification.length > 0
                  && passwordVerification.length < 8) || (passwordVerification.length > 7 && passwordVerification !== password),
                "reset-password__validate-icon--valid": passwordVerification.length > 7 && password === passwordVerification,
              })}
            />
          </Label>
        </div>

        <div className="reset-password__submit">
          <div className={cn("reset-password__wrong-input", {
              "reset-password__wrong-input--error": showError,
              "reset-password__wrong-input--error--2": showError,
              "reset-password__wrong-input--success": showSuccess,
              "reset-password__wrong-input--success--2": showSuccess,
          })}>
            {errorMessage}
          </div>

          <Button
            forAuth
            loading={isLoading}
            onClick={handleUpdatePassword}
          >
            CHANGE MY PASSWORD
          </Button>
        </div>
      </div>

      <div className="reset-password__no-account-text">
        {"Change your mind? "}

        <span className="reset-password__register">
          <Link href={!forCompany ? "/candidates/signin" : "/signin"}>
            Cancel process
          </Link>
        </span>
      </div>

      <div className="reset-password__bottom">
        <div className="reset-password__no-account-text">
          Choose a strong password and don't reuse it for other accounts. You may been signed out of your account on some devices.
        </div>
      </div>
    </div>
  );
};
