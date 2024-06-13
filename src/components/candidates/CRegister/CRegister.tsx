'use client';
import './CRegister.scss';
import cn from 'classnames';
import Link from 'next/link';
import { useCallback, useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Label } from '@/components/utils/Label';
import { InputField } from '@/components/utils/InputField';
import { Button } from '@/components/utils/Button';
import { Checkbox } from '@/components/utils/Checkbox';
import { IRegisterUser } from '@/types/Register';
import { registerUser } from '@/services/api/authUser.service';
import { isEmailCorrect } from '@/components/utils/utils';
import { ICountry } from '@/types/Country';
import { CountrySelect } from '@/components/utils/CountrySelect';
import { CountryDropdown } from '@/components/utils/CountryDropdown';


export const CRegister = () => {
  const [firstName, setFirstName] = useState<string>('');
  const [lastName, setLastName] = useState<string>('');
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [passwordVerification, setPasswordVerification] = useState<string>('');
  const [country, setCountry] = useState<ICountry | null>(null);
  const [subscribed, setSubscribed] = useState<boolean>(false);
  const [termsAccepted, setTermsAccepted] = useState<boolean>(true);

  const [dropdownActive, setDropdownActive] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const [firstNameError, setFirstNameError] = useState<boolean>(false);
  const [lastNameError, setLastNameError] = useState<boolean>(false);
  const [countryError, setCountryError] = useState<boolean>(false);
  const [emailError, setEmailError] = useState<boolean>(false);
  const [passwordError, setPasswordError] = useState<boolean>(false);
  const [passwordVerificationError, setPasswordVerificationError] = useState<boolean>(false);
  const [termsError, setTermsError] = useState<boolean>(false);
  const [showError, setShowError] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string>('');

  useEffect(() => {
    let timeoutKey: NodeJS.Timeout | undefined;

    if (showError) {
      timeoutKey = setTimeout(() => {
        setShowError(false);
      }, 2000);
    }

    return () => clearTimeout(timeoutKey);
  }, [showError]);


  const handleCountryClick = useCallback((country: ICountry) => {
    setCountry(country);
    setDropdownActive(false);
    setCountryError(false);
  }, []);

  const handleRegister = async () => {
    let errorAppeared: boolean = false;

    if (!firstName) {
      setFirstNameError(true);
      errorAppeared = true;
    };
    if (!lastName) {
      setLastNameError(true);
      errorAppeared = true;
    };
    if (!country) {
      setCountryError(true);
      errorAppeared = true;
    };
    if (!email || (email && !isEmailCorrect(email))) {
      setEmailError(true);
      errorAppeared = true;
    };
    if (password.length < 8) {
      setPasswordError(true);
      errorAppeared = true;
    };
    if ((passwordVerification.length < 8) ||
        (passwordVerification.length > 7 && passwordVerification !== password)) {
      setPasswordVerificationError(true);
      errorAppeared = true;
    };
    if(!termsAccepted) {
      setTermsError(true);
      return;
    }

    if (errorAppeared) return;
    if (!country) return;

    const data: IRegisterUser = {
      firstname: firstName,
      lastname: lastName,
      email,
      password,
      is_subscribed: subscribed ? 1 : 0,
      country_id: country?.country_id,
    };

    try {
      setErrorMessage('');
      setShowError(false);
      setIsLoading(true);
      await registerUser(data);
      router.push('/candidates/email-verification/');
      setIsLoading(false);
    } catch (error: any) {
      setIsLoading(false);

      if (error.response.data.message === 'email already exists') {
        setErrorMessage('Email already exists')
        setShowError(true);
      }

      if (error.response.data.message === 'we are unable to verify your email at this time. Please Try again later') {
        setErrorMessage('Error occured. Please Try again later')
        setShowError(true);
      }
    }
  };

  return (
    <div className="cregister">
      <div className="cregister__header">
        <h1 className="cregister__title">
          Register Account
        </h1>

        <div className="cregister__subtitle">
          Start your 3-months subscription at $3.33 per month
        </div>

        <div className="cregister__text">
          The payments are made for 3 months in advance at $9.99
        </div>

        <div className="cregister__text">
          {/* $27.00 / every 3 months after the promo period ends. Cancel anytime. */}
          The first video based recruitment platform in the world dedicated for work abroad
        </div>
      </div>

      <div className="cregister__form">
        <div className="cregister__labels">
          <div className="cregister__labels-section">
            <div className="cregister__label cregister__label--first">
              <Label title={'FIRST NAME'}>
                <InputField
                  type="text"
                  name="firstname"
                  value={firstName}
                  onChange={(e) => {
                    setFirstName(e.target.value);
                    setFirstNameError(false);
                  }}
                  error={firstNameError}
                />
              </Label>
            </div>

            <div className="cregister__label">
              <Label title={'LAST NAME'}>
                <InputField
                  type="text"
                  name="lastname"
                  value={lastName}
                  onChange={(e) => {
                    setLastName(e.target.value)
                    setLastNameError(false);
                  }}
                  error={lastNameError}
                />
              </Label>
            </div>
          </div>

          <div className="cregister__labels-section">
            <div className="cregister__label cregister__label--first">
              <div className={cn("cregister__wrong-input", {
                "cregister__wrong-input--active": showError,
              })}>
                {errorMessage}
              </div>

              <Label title={'E-MAIL'}>
                <InputField
                  type="email"
                  name="email"
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value);
                    setEmailError(false);
                  }}
                  placeholder={'example@email.com'}
                  error={emailError}
                />

                <div
                  className={cn("cregister__validate-icon", {
                    "cregister__validate-icon--invalid": email.length,
                    "cregister__validate-icon--valid": isEmailCorrect(email),
                  })}
                />
              </Label>
            </div>

            <div className="cregister__label">
              <Label title='COUNTRY / NATIONALITY'>
                <div
                  className="add__select"
                  onClick={() => {
                    setDropdownActive(!dropdownActive);
                  }}
                >
                  <CountrySelect
                    name={country?.name || null}
                    code={country?.alpha_2 || null}
                    error={countryError}
                  />
                </div>

                <CountryDropdown
                  isOpen={dropdownActive}
                  onSelect={handleCountryClick}
                />
              </Label>
            </div>
          </div>

          <div className="cregister__labels-section">
            <div className="cregister__label cregister__label--first">
              <Label title={'PASSWORD'} secondTitle={'8 symbols min'}>
                <InputField
                  type="password"
                  name="password"
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value);
                    setPasswordError(false);
                  }}
                  error={passwordError}
                />

                <div
                  className={cn("cregister__validate-icon", {
                    "cregister__validate-icon--invalid":
                      password.length > 0 && password.length < 8,
                    "cregister__validate-icon--valid": password.length >= 8,
                  })}
                />
              </Label>
            </div>

            <div className="cregister__label">
              <Label title={'PASSWORD VERIFICATION'}>
                <InputField
                  type="password"
                  name="password-verification"
                  value={passwordVerification}
                  onChange={(e) => {
                    setPasswordVerification(e.target.value);
                    setPasswordVerificationError(false);
                  }}
                  error={passwordVerificationError}
                />

                <div
                  className={cn("cregister__validate-icon", {
                    "cregister__validate-icon--invalid": (passwordVerification.length > 0
                      && passwordVerification.length < 8) || (passwordVerification.length > 7 && passwordVerification !== password),
                    "cregister__validate-icon--valid": passwordVerification.length > 7
                      && password === passwordVerification,
                  })}
                />
              </Label>
            </div>
          </div>
        </div>

        <div className="cregister__divider"/>

        <div className="cregister__conditions">
          <div className="cregister__checkbox">
            <Checkbox
              onClick={() => setSubscribed(!subscribed)}
              checked={subscribed}
            />

            <div className="cregister__checkbox-title">
              Subscribe to our newsletters. No spam!
            </div>
          </div>

          <div className="cregister__checkbox">
            <Checkbox
              onClick={() => {
                setTermsAccepted(!termsAccepted);
                setTermsError(false);
              }}
              checked={termsAccepted}
              required
              error={termsError}
            />

            <div className="cregister__checkbox-title">
              By creating an account on our website you agree to the
              <Link
                href="https://videoworkers.com/legal/terms"
                target="_blank"
                className="cregister__checkbox-link"
              >
                {" Terms of Service "}
              </Link>
              and
              <Link
                href="https://videoworkers.com/legal/privacy"
                target="_blank"
                className="cregister__checkbox-link"
              >
                {" Privacy Policy "}
              </Link>
            </div>
          </div>
        </div>

        <div className="cregister__bottom">
          <div className="cregister__submit">
            <Button
              loading={isLoading}
              forAuth
              onClick={handleRegister}
            >
              Register Your Account
            </Button>
          </div>

          <div className="cregister__safe">
            <div className="cregister__safe-icon"/>

            <div className="cregister__safe-text">
              This page uses 128-bit encryption. Your details are safe.
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
