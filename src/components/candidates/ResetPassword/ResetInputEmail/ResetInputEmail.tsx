"use client";
import "../ResetPassword.scss";
import { useState, useEffect, useCallback } from "react";
import cn from "classnames";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Label } from "@/components/utils/Label";
import { InputField } from "@/components/utils/InputField";
import { Button } from "@/components/utils/Button";
import { IVerifyEmail, verifyCompanyEmailResetPassword, verifyEmailResetPassword } from "@/services/api/resetPassword.service";
import { AxiosResponse } from "axios";

type Props = {
  forCompany?: boolean;
};

export const ResetInputEmail: React.FC<Props> = ({ forCompany = false }) => {
  const [email, setEmail] = useState<string>('');
  const [showSuccess, setShowSuccess] = useState<boolean>(false);
  const [showError, setShowError] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [emailError, setEmailError] = useState<boolean>(false);
  const router = useRouter();

  useEffect(() => {
    let timeoutKey: NodeJS.Timeout | undefined;

    if (showError) {
      timeoutKey = setTimeout(() => {
        setShowError(false);
      }, 2000);
    }

    if (showSuccess) {
      timeoutKey = setTimeout(() => {
        setShowSuccess(false);
      }, 2000);

      setTimeout(() => {
        if (!forCompany) {
          router.push('/candidates/signin/')
        } else {
          router.push('signin/')
        }
      }, 3000);
    }

    return () => clearTimeout(timeoutKey);
  }, [showError, showSuccess]);

  const handleVerifyEmail = useCallback(async (verifyEmail: IVerifyEmail) => {
    try {
      setShowError(false);
      setShowSuccess(false);
      setErrorMessage('');
      setIsLoading(true);
      let resp: AxiosResponse<any, any>;

      if (!forCompany) {
        resp = await verifyEmailResetPassword(verifyEmail);
      } else {
        resp = await verifyCompanyEmailResetPassword(verifyEmail);
      }

      const message = resp.data.message;

      if (message === 'please check your email to reset your password') {
        setErrorMessage('please check your email');
        setShowSuccess(true);
        setIsLoading(false);
        setEmail('');
      }
    } catch (error: any) {
      setIsLoading(false);
      setEmailError(true);

      const errorTypeMessage = error.response.data.message;
      const errorWords = errorTypeMessage.split(' ');

      if (errorWords[0] === 'email') {
        if (errorWords.includes('pattern')) setErrorMessage('Wrong email format');
        if (errorWords.includes('empty')) setErrorMessage('Email can\'t be empty');
      };

      if (errorTypeMessage === 'user not found') setErrorMessage('User not found');
      setShowError(true);
    }
  }, []);

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
          <Label title={'EMAIL'}>
            <InputField
              type="email"
              name="email"
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
                setEmailError(false);
              }}
              error={emailError}
            />
          </Label>
        </div>

        <div className="reset-password__submit">
          <div className={cn("reset-password__wrong-input", {
              "reset-password__wrong-input--error": showError,
              "reset-password__wrong-input--success": showSuccess,
          })}>
            {errorMessage}
          </div>

          <Button
            forAuth
            loading={isLoading}
            onClick={() => {
              const data: IVerifyEmail = {
                email,
              };

              handleVerifyEmail(data);
            }}
          >
            RESET MY PASSWORD
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
          Enter your email address. If it is found in our system, we will send a reset link to your inbox.
        </div>
      </div>
    </div>
  );
};
