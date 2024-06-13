'use client';
import { Button } from '@/components/utils/Button';
import './EmailVerification.scss';
import { useCallback, useState } from 'react';
import { loginCompany } from '@/services/api/authUser.service';
import { ILogin } from '@/types/Login';

type Props = {
  email: string;
  password: string;
};

export const EmailVerification: React.FC<Props> = ({ email, password }) => {
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const handleResend = useCallback(async () => {
    try {
      setIsLoading(true);
      const data: ILogin = {
        email,
        password
      };

      await loginCompany(data);
      setIsLoading(false);
    } catch (error) {
      setIsLoading(false);
    }
  }, []);

  return (
    <div className="email-verification-container">
      <div className="email-verification">
        <div className="email-verification__top">
          <div className="email-verification__logo"/>

          <div className="email-verification__title">
            Verify your email to proceed
          </div>

          <div className="email-verification__text">
            We just sent an email to the address: <span className='email-verification__text--bold'>{email}</span>
          </div>

          <div className="email-verification__text">
            Please check your email and click on the link provided to verify your address.
          </div>
        </div>

        <div className="email-verification__blue">
          <div className="email-verification__pair">
            <div className="email-verification__text email-verification__text--bold">
              Why do we ask for email confirmation?
            </div>

            <div className="email-verification__text">
              Email confirmation is an important security check that helps prevent other people from signing up for a VideoWorkers account using your email address.
            </div>
          </div>

          <div className="email-verification__pair">
            <div className="email-verification__text email-verification__text--bold">
              How do I confirm my email address?
            </div>

            <div className="email-verification__text">
              We sent you an email with a link to click on. If you aren't able to click the link, copy the full URL from the email and paste it into a new web browser window.
            </div>
          </div>

          <div className="email-verification__pair">
            <div className="email-verification__text email-verification__text--bold">
              If you haven't received the confirmation email, please:
            </div>

            <div className="email-verification__text">
              Check the junk mail folder or spam filter in your email account. Make sure your email address is entered correctly.
            </div>
          </div>
        </div>

        <div className="email-verification__bottom">
          <div className="email-verification__button">
            <Button
              textSmall
              loading={isLoading}
              onClick={handleResend}
            >
              Resend verification email
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
