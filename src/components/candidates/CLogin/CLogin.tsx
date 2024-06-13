"use client";
import "./CLogin.scss";
import { useState, useEffect, useCallback } from "react";
import cn from "classnames";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ILogin } from "@/types/Login";
import { Label } from "@/components/utils/Label";
import { InputField } from "@/components/utils/InputField";
import { Button } from "@/components/utils/Button";
import { loginUser } from "@/services/api/authUser.service";
import { SetterOrUpdater, useSetRecoilState } from "recoil";
import { AxiosResponse } from "axios";
import { UserDataStore } from "@/store/userDataStore";
import { IUserData } from "@/types/UserData";

export const CLogin = () => {
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [showError, setShowError] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  const router = useRouter();

  const setUserData: SetterOrUpdater<IUserData | null> = useSetRecoilState(UserDataStore);

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
      const resp: AxiosResponse<any, any> = await loginUser(account);

      if (resp.status === 200) {
        resetFields();
        const responseData = resp.data.data;
        const token: string = responseData.token;
        const userTableInfo: IUserData = responseData.data;
        localStorage.setItem('token', token);
        setUserData(userTableInfo);

        const isSubscribed: boolean = Boolean(userTableInfo.is_subscription_active);

        if (isSubscribed) {
          router.push('/candidates/dashboard/');
        } else {
          router.push('/candidates/flow/how-it-works/')
        }
      }

      setLoading(false);
    } catch (error: any) {
      setLoading(false);
      console.log(error);

      const errorTypeMessage = error.response?.data.message;
      const errorWords = errorTypeMessage?.split(' ');

      if (errorWords[0] === 'email') {
        if (errorWords.includes('pattern')) setErrorMessage('Wrong email format');
        if (errorWords.includes('empty')) setErrorMessage('Email can\'t be empty');
      };

      if (errorWords.includes('re-verification')) {
        resetFields();
        setErrorMessage('Email unverified')
        router.push('/candidates/email-verification/');
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
    <div className="clogin">
      <div className="clogin__header">
        <h1 className="clogin__title">
          Log In
        </h1>

        <h3 className="clogin__subtitle">
          {/* switching text on large screen */}
          <div className="clogin__subtitle-1">
            to your Candidate Account
          </div>

          <div className="clogin__subtitle-2">
            Candidate Account
          </div>
        </h3>

        <div className="clogin__text">
          {"Not a candidate? "}

          <Link href={"/signin"} className="clogin__to-company">
            Log in as a company
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

      <div className="clogin__no-account-text">
        {"Don’t have an account? "}

        <span className="clogin__register">
          <Link href="/candidates/signup">
            Register
          </Link>
        </span>
      </div>

      <div className="clogin__reset">
        Forget your password? <Link href={"/candidates/verify-email-reset-password"}>Reset it</Link>
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
