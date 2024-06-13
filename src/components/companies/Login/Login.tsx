"use client";
import "../../candidates/CLogin/CLogin.scss";
import { useState, useEffect, useCallback } from "react";
import cn from "classnames";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ILogin } from "@/types/Login";
import { Label } from "@/components/utils/Label";
import { InputField } from "@/components/utils/InputField";
import { Button } from "@/components/utils/Button";
import { loginCompany, loginUser } from "@/services/api/authUser.service";
import { SetterOrUpdater, useSetRecoilState } from "recoil";
import { AxiosResponse } from "axios";
import { ICompanyData } from "@/types/CompanyData";
import { CompanyDataStore } from "@/store/companyDataStore";
import { EmailVerification } from "../EmailVerification";

export const Login = () => {
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [showError, setShowError] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  const router = useRouter();
  const [confirmModal, setConfirmModal] = useState<boolean>(false);

  const setCompanyData: SetterOrUpdater<ICompanyData | null> = useSetRecoilState(CompanyDataStore);

  const resetFields = useCallback(() => {
    setEmail('');
    setPassword('');
  } , [])

  useEffect(() => {
    let timeoutKey: NodeJS.Timeout | undefined;

    if (showError) {
      timeoutKey = setTimeout(() => {
        setShowError(false);
      }, 2000);
    }

    return () => clearTimeout(timeoutKey);
  }, [showError]);

  const handleLogin = useCallback(async (account: ILogin) => {
    try {
      setErrorMessage('');
      setShowError(false);
      setLoading(true);
      const resp: AxiosResponse<any, any> = await loginCompany(account);

      if (resp.status === 200) {
        resetFields();
        const responseData = resp.data.data;
        const token: string = responseData.token;
        const companyTableInfo: ICompanyData = responseData.data;
        localStorage.setItem('token', token);
        setCompanyData(companyTableInfo);
        console.log(companyTableInfo);

        if (companyTableInfo.is_verified) {
          router.push('/dashboard/');
        } else {
          router.push('/upload-documents/');
        }

        // wee will check for documents verification for correct redirect
      }

      setLoading(false);
    } catch (error: any) {
      setLoading(false);
      const errorTypeMessage = error.response.data.message;
      const errorWords = errorTypeMessage.split(' ');

      if (errorWords.includes('re-verification')) {
        setConfirmModal(true);
        return;
      };

      if (errorWords[0] === 'email') {
        if (errorWords.includes('pattern')) setErrorMessage('Wrong email format');
        if (errorWords.includes('empty')) setErrorMessage('Email can\'t be empty');
      };


      if (errorWords[0] === 'password') {
        if (errorWords.includes('empty')) setErrorMessage('Password can\'t be empty');
        if (errorWords.includes('length')) setErrorMessage('Password length must be at least 8');
      };

      if (errorTypeMessage === 'user not found') setErrorMessage('User not found');
      if (errorTypeMessage === 'Invalid Credentials') setErrorMessage('Invalid password');

      setShowError(true);
    }
  }, []);

  return (
    <div className="clogin clogin--company">
      {confirmModal && (
        <EmailVerification
          email={email}
          password={password}
        />
      )}
      <div className="clogin__header">
        <h1 className="clogin__title">
          Log In
        </h1>

        <h3 className="clogin__subtitle">
          <div className="clogin__subtitle-1">
            in your Bussines Account
          </div>

          <div className="clogin__subtitle-2">
            in your Bussines Account
          </div>
        </h3>

        <div className="clogin__text">
          {"Not a company? "}

          <Link href={"/candidates/signin"} className="clogin__to-company">
            Log in as a candidate
          </Link>
        </div>
      </div>

      <div className="clogin__form">
        <div className="clogin__label">
          <Label title={'E-MAIL'}>
            <InputField
              type="email"
              name="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </Label>
        </div>

        <div className="clogin__label">
          <Label title={'PASSWORD'}>
            <InputField
              type="password"
              name="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </Label>
        </div>

        <div className="clogin__submit">
          <div className={cn("clogin__wrong-input", {
              "clogin__wrong-input--active": showError,
          })}>
            {errorMessage}
          </div>

          <Button
            forAuth
            loading={loading}
            onClick={() => {
              const data: ILogin = {
                email,
                password,
              };

              handleLogin(data);
            }}
          >
            ENTER YOUR ACCOUNT
          </Button>
        </div>
      </div>

      <div className="clogin__no-account-text clogin__no-account-text--always-on">
        {"Don’t have an account? "}

        <span className="clogin__register">
          <Link href="/signup">
            Register
          </Link>
        </span>
      </div>

      <div className="clogin__reset">
        Forget your password? <Link href={"/verify-email-reset-password"}>Reset it</Link>
      </div>

      {/* <div className="clogin__social">
        <p className="clogin__social-text">
          or sign in with your social media account
        </p>

        <div className="clogin__social-buttons">
          <div
            onClick={() => {}}
            className="clogin__social-button clogin__social-button--fb"
            >
            Facebook
          </div>

          <div
            onClick={() => {}}
            className="clogin__social-button clogin__social-button--google"
          >
            Google
          </div>
        </div>
      </div> */}
    </div>
  );
};
