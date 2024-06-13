'use client';
import './Register.scss';
import '../../candidates/Dashboard/Settings/Account/Info/Info.scss';
import cn from 'classnames';
import Link from 'next/link';
import { useCallback, useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Label } from '@/components/utils/Label';
import { InputField } from '@/components/utils/InputField';
import { Button } from '@/components/utils/Button';
import { Checkbox } from '@/components/utils/Checkbox';
import { IRegisterCompany } from '@/types/Register';
import { registerCompany } from '@/services/api/authUser.service';
import { customNumberValidator, isEmailCorrect } from '@/components/utils/utils';
import { ICountry } from '@/types/Country';
import { CountrySelect } from '@/components/utils/CountrySelect';
import { CountryDropdown } from '@/components/utils/CountryDropdown';
import { CompanyAccountType } from '@/types/CompanyData';
import { PhoneSelect } from '@/components/utils/PhoneSelect';
import { EmailVerification } from '../EmailVerification';
import { IIndustrySubcategory } from '@/types/Industry';
import { IndustryDropdown } from '@/components/utils/IndustryDropdown';
import { Select } from '@/components/utils/Select';


export const Register = () => {
  const [firstName, setFirstName] = useState<string>('');
  const [lastName, setLastName] = useState<string>('');
  const [companyName, setCompanyName] = useState<string>('');
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [passwordVerification, setPasswordVerification] = useState<string>('');
  const [phoneNumber, setPhoneNumber] = useState<string>('');
  const [phonePrefix, setPhonePrefix] = useState<string>('');
  const [phoneAlpha2, setPhoneAlpha2] = useState<string>('');
  const [accountType, setAccountType] = useState<CompanyAccountType | null>(null);
  const [country, setCountry] = useState<ICountry | null>(null);
  const [taxId, setTaxId] = useState<string>('');
  const [subscribed, setSubscribed] = useState<boolean>(false);
  const [termsAccepted, setTermsAccepted] = useState<boolean>(true);
  const [industry, setIndustry] = useState<IIndustrySubcategory | null>(null);

  const [countryDropdown, setCountryDropdown] = useState(false);
  const [phoneDropdown, setPhoneDropdown] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [industryDropdown, setIndustryDropdown] = useState(false);

  const [industryError, setIndustryError] = useState<boolean>(false);
  const [firstNameError, setFirstNameError] = useState<boolean>(false);
  const [lastNameError, setLastNameError] = useState<boolean>(false);
  const [companyNameError, setCompanyNameError] = useState<boolean>(false);
  const [emailError, setEmailError] = useState<boolean>(false);
  const [passwordError, setPasswordError] = useState<boolean>(false);
  const [passwordVerificationError, setPasswordVerificationError] = useState<boolean>(false);
  const [phoneNumberError, setPhoneNumberError] = useState<boolean>(false);
  const [phonePrefixError, setPhonePrefixError] = useState<boolean>(false);
  const [accountTypeError, setAccountTypeError] = useState<boolean>(false);
  const [countryError, setCountryError] = useState<boolean>(false);
  const [taxIdError, setTaxIdError] = useState<boolean>(false);
  const [termsError, setTermsError] = useState<boolean>(false);
  const [showError, setShowError] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string>('');
  const [confirmModal, setConfirmModal] = useState<boolean>(false);

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
    setCountryError(false);
    setCountryDropdown(false);
  }, []);

  const handlePrefixClick = useCallback((country: ICountry) => {
    setPhonePrefix(country.phone_code);
    setPhoneAlpha2(country.alpha_2);
    setPhonePrefixError(false);
    setPhoneDropdown(false);
  }, []);

  const handleIndustryClick = useCallback((industry: IIndustrySubcategory) => {
    setIndustry(industry);
    setIndustryDropdown(false);
    setIndustryError(false);
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
    if (!companyName) {
      setCompanyNameError(true);
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
    if (!phoneNumber) {
      setPhoneNumberError(true);
      errorAppeared = true;
    };
    if (!phonePrefix) {
      setPhonePrefixError(true);
      errorAppeared = true;
    };
    if (!accountType) {
      setAccountTypeError(true);
      errorAppeared = true;
    };
    if (!country) {
      setCountryError(true);
      errorAppeared = true;
    };
    if (!taxId) {
      setTaxIdError(true);
      errorAppeared = true;
    };
    if (!industry) {
      setIndustryError(true);
      errorAppeared = true;
    };
    if(!termsAccepted) {
      setTermsError(true);
      return;
    }

    if (phoneNumber) {
      if (phoneNumber?.length < 9 || phoneNumber?.length > 13) {
        setPhoneNumberError(true);
        errorAppeared = true;
      };
    }

    if (errorAppeared) return;
    if (!accountType) return;
    if (!country) return;
    if (!industry) return;


    const data: IRegisterCompany = {
      firstname: firstName,
      lastname: lastName,
      name: companyName,
      email,
      password,
      is_subscribed: subscribed ? 1 : 0,
      phonenumber: phoneNumber,
      phone_alpha_2: phoneAlpha2,
      phone_prefix: phonePrefix,
      country_id: country?.country_id,
      account_type: accountType,
      tax_id: taxId,
      industry_subcategory_id: industry?.industry_subcategory_id,
    };

    try {
      setErrorMessage('');
      setShowError(false);
      setIsLoading(true);
      await registerCompany(data);
      setConfirmModal(true);
      setIsLoading(false);
    } catch (error: any) {
      setIsLoading(false);
      console.log(error.response.data);


      if (error.response.data.message === 'email already exists') {
        setErrorMessage('Email already exists')
        setShowError(true);
      }

      if (error.response.data.message === 'we are unable to verify your email at this time. Please Try again later') {
        setErrorMessage('Error occured. Please try again later');
        setShowError(true);
      }

      if (error.response.data.message === 'phone number already exists') {
        setErrorMessage('Phone number already exists')
        setShowError(true);
      }
    }
  };

  return (
    <div className="register">
      {confirmModal && (
        <EmailVerification
          email={email}
          password={password}
        />
      )}

      <div className="register__header">
        <h1 className="register__title">
          Sign Up your company
        </h1>

        <div className="register__subtitle">
          Free unlimited access. No credit card required.
        </div>
      </div>

      <div className="register__form">
        <div className="register__labels-parent">
          <div className="register__labels register__labels--first">
            <div className="register__labels-section">
              <div className="register__label register__label--first">
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

              <div className="register__label">
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

            <div className="register__labels-section">
              <div className="register__label register__label--first">
                <div className={cn("register__wrong-input", {
                  "register__wrong-input--active": showError,
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
                    className={cn("register__validate-icon", {
                      "register__validate-icon--invalid": email.length,
                      "register__validate-icon--valid": isEmailCorrect(email),
                    })}
                  />
                </Label>
              </div>

              <div className="register__label">
                <Label title='PHONE ( WHATS APP )'>
                  <div className="info__phone">
                    <div
                      className="info__phone-select"
                      onClick={() => {
                        setPhoneDropdown(!phoneDropdown);
                        setCountryDropdown(false);
                        setIndustryDropdown(false);
                      }}
                    >
                      <PhoneSelect
                        code={phoneAlpha2 || null}
                        error={phonePrefixError}
                      />
                    </div>

                    <div className="info__phone-input">
                      <InputField
                        type='text'
                        name='phoneNumber'
                        forPhone
                        value={phoneNumber || ''}
                        onChange={(e) => {
                          customNumberValidator(e, setPhoneNumber, true);
                          setPhoneNumberError(false);
                        }}
                        error={phoneNumberError}
                      />
                    </div>
                  </div>

                  <CountryDropdown
                    isOpen={phoneDropdown}
                    onSelect={handlePrefixClick}
                    forPhone
                  />
                </Label>
              </div>
            </div>

            <div className="register__labels-section">
              <div className="register__label register__label--first">
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
                    className={cn("register__validate-icon", {
                      "register__validate-icon--invalid":
                        password.length > 0 && password.length < 8,
                      "register__validate-icon--valid": password.length >= 8,
                    })}
                  />
                </Label>
              </div>

              <div className="register__label">
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
                    className={cn("register__validate-icon", {
                      "register__validate-icon--invalid": (passwordVerification.length > 0
                        && passwordVerification.length < 8) || (passwordVerification.length > 7 && passwordVerification !== password),
                      "register__validate-icon--valid": passwordVerification.length > 7
                        && password === passwordVerification,
                    })}
                  />
                </Label>
              </div>
            </div>

            <div className="register__types-1">
              <div className="register__label register__label--types">
                <Label title={'ACCOUNT TYPE'}>
                  <div className="register__checkbox register__checkbox--direct">
                    <Checkbox
                      onClick={() => {
                        setAccountType(CompanyAccountType.Employeer);
                        setAccountTypeError(false);
                      }}
                      checked={accountType === CompanyAccountType.Employeer}
                      error={accountTypeError}
                    />

                    <div className="register__checkbox-title">
                      Direct Employer
                    </div>
                  </div>

                  <div className="register__checkbox">
                    <Checkbox
                      onClick={() => {
                        setAccountType(CompanyAccountType.Agency);
                        setAccountTypeError(false);
                      }}
                      checked={accountType === CompanyAccountType.Agency}
                      error={accountTypeError}
                    />

                    <div className="register__checkbox-title">
                      Recruitment Agency
                    </div>
                  </div>
                </Label>
              </div>
            </div>
          </div>

          <div className="register__labels register__labels--right">
            <div className="register__labels-section register__labels-section--right">
              <div className="register__label register__label--first">
                <Label title='COUNTRY OF REGISTRATION'>
                  <div
                    className="add__select"
                    onClick={() => {
                      setCountryDropdown(!countryDropdown);
                      setPhoneDropdown(false);
                      setIndustryDropdown(false);
                    }}
                  >
                    <CountrySelect
                      name={country?.name || null}
                      code={country?.alpha_2 || null}
                      error={countryError}
                    />
                  </div>

                  <CountryDropdown
                    isOpen={countryDropdown}
                    onSelect={handleCountryClick}
                  />
                </Label>
              </div>

              <div className="register__label">
                <Label title={'COMPANY NAME'}>
                  <InputField
                    type="text"
                    name="company"
                    value={companyName}
                    onChange={(e) => {
                      setCompanyName(e.target.value);
                      setCompanyNameError(false);
                    }}
                    error={companyNameError}
                  />
                </Label>
              </div>
            </div>

            <div className="register__labels-section register__labels-section--right">
              <div className="register__label register__label--first register__label--tax-id">
                <Label title={'TAX ID | VAT NUMBER'}>
                  <InputField
                    type="text"
                    name="taxid"
                    value={taxId}
                    onChange={(e) => {
                      setTaxId(e.target.value);
                      setTaxIdError(false);
                    }}
                    error={taxIdError}
                  />
                </Label>
              </div>

              <div className="register__label">
                <Label title='INDUSTRY'>
                  <div
                    className="add__select"
                    onClick={() => {
                      setCountryDropdown(false);
                      setIndustryDropdown(!industryDropdown);
                      setPhoneDropdown(false);
                    }}
                  >
                    <Select
                      value={industry?.name || ''}
                      error={industryError}
                    />
                  </div>

                  <IndustryDropdown
                    isOpen={industryDropdown}
                    onSelect={handleIndustryClick}
                  />
                </Label>
              </div>

              {/* <div className="register__label register__label--types">
                <Label title={'ACCOUNT TYPE'}>
                  <div className="register__checkbox register__checkbox--direct">
                    <Checkbox
                      onClick={() => {
                        setAccountType(CompanyAccountType.Employeer);
                        setAccountTypeError(false);
                      }}
                      checked={accountType === CompanyAccountType.Employeer}
                      error={accountTypeError}
                    />

                    <div className="register__checkbox-title">
                      Direct Employer
                    </div>
                  </div>

                  <div className="register__checkbox">
                    <Checkbox
                      onClick={() => {
                        setAccountType(CompanyAccountType.Agency);
                        setAccountTypeError(false);
                      }}
                      checked={accountType === CompanyAccountType.Agency}
                      error={accountTypeError}
                    />

                    <div className="register__checkbox-title">
                      Recruitment Agency
                    </div>
                  </div>
                </Label>
              </div> */}
            </div>

            <div className="register__types-2">
              <div className="register__labels-section register__labels-section--right">
                <div className="register__label register__label--types">
                  <Label title={'ACCOUNT TYPE'}>
                    <div className="register__checkbox register__checkbox--direct">
                      <Checkbox
                        onClick={() => {
                          setAccountType(CompanyAccountType.Employeer);
                          setAccountTypeError(false);
                        }}
                        checked={accountType === CompanyAccountType.Employeer}
                        error={accountTypeError}
                      />

                      <div className="register__checkbox-title">
                        Direct Employer
                      </div>
                    </div>

                    <div className="register__checkbox">
                      <Checkbox
                        onClick={() => {
                          setAccountType(CompanyAccountType.Agency);
                          setAccountTypeError(false);
                        }}
                        checked={accountType === CompanyAccountType.Agency}
                        error={accountTypeError}
                      />

                      <div className="register__checkbox-title">
                        Recruitment Agency
                      </div>
                    </div>
                  </Label>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="register__divider"/>

        <div className="register__bottom-container">
          <div className="register__conditions">
            <div className="register__checkbox">
              <Checkbox
                onClick={() => setSubscribed(!subscribed)}
                checked={subscribed}
              />

              <div className="register__checkbox-title">
                Subscribe to our newsletters. No spam!
              </div>
            </div>

            <div className="register__checkbox">
              <Checkbox
                onClick={() => {
                  setTermsAccepted(!termsAccepted);
                  setTermsError(false);
                }}
                checked={termsAccepted}
                required
                error={termsError}
              />

              <div className="register__checkbox-title">
                By creating an account on our website you agree to the
                <Link
                  href="https://videoworkers.com/legal/terms"
                  target="_blank"
                  className="register__checkbox-link"
                >
                  {" Terms of Service "}
                </Link>
                and
                <Link
                  href="https://videoworkers.com/legal/privacy"
                  target="_blank"
                  className="register__checkbox-link"
                >
                  {" Privacy Policy "}
                </Link>
              </div>
            </div>
          </div>

          <div className="register__bottom">
            <div className="register__submit">
              <Button
                loading={isLoading}
                forAuth
                onClick={handleRegister}
              >
                Register Your Account
              </Button>
            </div>

            <div className="register__safe">
              <div className="register__safe-icon"/>

              <div className="register__safe-text">
                This page uses 128-bit encryption. Your details are safe.
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
