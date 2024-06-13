'use client';
import './InfoCheck.scss';
import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import React from 'react';
import { useRouter } from 'next/navigation';
import { FlowContainer } from '../FlowContainer';
import { FlowPageName, FlowPageText } from '@/types/FlowPage';
import { Label } from '@/components/utils/Label';
import { InputField } from '@/components/utils/InputField';
import { Checkbox } from '@/components/utils/Checkbox';
import { CountrySelect } from '@/components/utils/CountrySelect';
import { NextStep, NextStepInfo } from '../NextStep';
import { Arrows } from '@/components/utils/Arrows';
import { StepIcon } from '@/components/utils/StepIcon';
import { ICountry } from '@/types/Country';
import { getUserData, updateUserInfo } from '@/services/api/authUser.service';
import { useRecoilState } from 'recoil';
import { UserDataStore } from '@/store/userDataStore';
import { AxiosResponse } from 'axios';
import { CountryDropdown } from '@/components/utils/CountryDropdown';
import { PhoneSelect } from '@/components/utils/PhoneSelect';
import { customNumberValidator } from '@/components/utils/utils';
import { IInfoCheck } from '@/types/InfoCheck';
import { IUserData } from '@/types/UserData';

const infoTexts: FlowPageText[] = [
  {
    id: '1',
    text: 'Your contact details are the means through which you communicate with potential employers. If this line is broken, nobody will be able to reach you.'
  },
  {
    id: '2',
    text: 'We recommend using WhatsApp service on your phone number, as it is easier to communicate with employers.'
  }
];

export const InfoCheck = () => {
  const [firstName, setFirstName] = useState<string>('');
  const [lastName, setLastName] = useState<string>('');
  const [email, setEmail] = useState<string>('');
  const [birthDate, setBirthDate] = useState<string | null>(null);
  const [nationality, setNationality] = useState<ICountry | null>(null);
  const [phonePrefix, setPhonePrefix] = useState<string | null>(null);
  const [phoneNumber, setPhoneNumber] = useState<string | null>(null);
  const [phoneAlpha2, setPhoneAlpha2] = useState<string | null>(null);
  const [countryDropdown, setCountryDropdown] = useState<boolean>(false);
  const [phoneDropdown, setPhoneDropdown] = useState<boolean>(false);
  const [privacy, setPrivacy] = useState<boolean>(true);
  const router = useRouter();

  const [firstNameError, setFirstNameError] = useState<boolean>(false);
  const [lastNameError, setLastNameError] = useState<boolean>(false);
  const [birthDateError, setBirthDateError] = useState<boolean>(false);
  const [nationalityError, setNationalityError] = useState<boolean>(false);
  const [phoneNumberError, setPhoneNumberError] = useState<boolean>(false);
  const [phonePrefixError, setPhonePrefixError] = useState<boolean>(false);
  const [privacyError, setPrivacyError] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [dataChanged, setDataChanged] = useState<boolean>(false);

  const [userData, setUserData] = useRecoilState(UserDataStore);

  const fetchUserData = useCallback(async () => {
    try {
      const resp: AxiosResponse<any, any> = await getUserData();
      const userDataFetched: IUserData = resp.data.data.data
      setUserData(userDataFetched);
    } catch (error) {}
  }, []);

  useEffect(() => {
    if (!userData) fetchUserData();
  }, []);

  useEffect(() => {
    if (!userData) return;
    setEmail(userData.email);
    setFirstName(userData.firstname);
    setLastName(userData.lastname);
    setBirthDate(userData.date_of_birth);
    setNationality(userData.Country);
    setPhonePrefix(userData?.phone_prefix);
    setPhoneNumber(userData.phonenumber);
    setPhoneAlpha2(userData.phone_alpha_2);
  }, [userData]);

  const handleCountryClick = useCallback((country: ICountry) => {
    setNationality(country);
    setCountryDropdown(false);
    setNationalityError(false);
    setDataChanged(true);
  }, []);

  const handlePrefixClick = useCallback((country: ICountry) => {
    setPhonePrefix(country.phone_code);
    setPhoneAlpha2(country.alpha_2);
    setPhoneDropdown(false);
    setPhonePrefixError(false);
    setDataChanged(true);
  }, []);

  const handleUpdateUserInfo = async () => {
    let errorAppeared: boolean = false;

    if (!firstName) {
      setFirstNameError(true);
      errorAppeared = true;
    };
    if (!lastName) {
      setLastNameError(true);
      errorAppeared = true;
    };
    if (!nationality) {
      setNationalityError(true);
      errorAppeared = true;
    };
    if (!birthDate) {
      setBirthDateError(true);
      errorAppeared = true;
    };
    if (!phonePrefix) {
      setPhonePrefixError(true);
      errorAppeared = true;
    };
    if (!phoneNumber) {
      setPhoneNumberError(true);
      errorAppeared = true;
    };

    if (phoneNumber) {
      if (phoneNumber?.length < 9 || phoneNumber?.length > 13) {
        setPhoneNumberError(true);
        errorAppeared = true;
      };
    }

    if(!privacy) {
      setPrivacyError(true);
      return;
    }

    if (errorAppeared) return;
    if (!nationality) return;
    if (!birthDate) return;
    if (!phoneNumber) return;
    if (!phoneAlpha2) return;
    if (!phonePrefix) return;

    if (!dataChanged) {
      router.push('/candidates/flow/residency/');
      return;
    }

    const infoCheckData: IInfoCheck = {
      firstname: firstName,
      lastname: lastName,
      date_of_birth: birthDate,
      phonenumber: phoneNumber,
      phone_alpha_2: phoneAlpha2,
      phone_prefix: phonePrefix,
      country_id: nationality.country_id,
    };

    try {
      setIsLoading(true);
      await updateUserInfo(infoCheckData);
      setUserData(null);
      router.push('/candidates/flow/residency/');
    } catch (error: any) {}
  };

  return (
    <>
      <FlowContainer
        title={'CHECK YOUR INFORMATION'}
        text={'Make sure this information details are correct and complete. This information will be available to companies in order to send you job offers, conduct interviews, and other subsequent employment communications.'}
        pageName={FlowPageName.Info}
        infoTexts={infoTexts}
      >
        <div className="info-check">
          <div className="info-check__form">
            <div className="info-check__row">
              <div className="info-check__label info-check__label--first">
                <Label title='FIRST NAME'>
                  <InputField
                    type='text'
                    name='firstname'
                    value={firstName}
                    onChange={(e) => {
                      setFirstName(e.target.value);
                      setFirstNameError(false);
                      setDataChanged(true);
                    }}
                    error={firstNameError}
                  />
                </Label>
              </div>

              <div className="info-check__label">
                <Label title='LAST NAME'>
                  <InputField
                    type='text'
                    name='lastname'
                    value={lastName}
                    onChange={(e) => {
                      setLastName(e.target.value);
                      setLastNameError(false);
                      setDataChanged(true);
                    }}
                    error={lastNameError}
                  />
                </Label>
              </div>
            </div>

            <div className="info-check__row">
              <div className="info-check__label info-check__label--first">
                <Label title='DATE OF BIRTH'>
                  <InputField
                    type='date'
                    name='birthdate'
                    value={birthDate || ''}
                    max={new Date(new Date().setFullYear(new Date().getFullYear() - 18)).toISOString().split('T')[0]}
                    onChange={(e) => {
                      setBirthDate(e.target.value);
                      setBirthDateError(false);
                      setDataChanged(true);
                    }}
                    error={birthDateError}
                  />
                </Label>
              </div>

              <div className="info-check__label">
                <Label title='NATIONALITY'>
                  <div
                    className="info-check__select"
                    onClick={() => {
                      setCountryDropdown(!countryDropdown);
                      setPhoneDropdown(false);
                    }}
                  >
                    <CountrySelect
                      name={nationality?.name || null}
                      code={nationality?.alpha_2 || null}
                      error={nationalityError}
                    />
                  </div>

                  <CountryDropdown
                    isOpen={countryDropdown}
                    onSelect={handleCountryClick}
                  />
                </Label>
              </div>
            </div>

            <div className="info-check__row">
              <div className="info-check__label info-check__label--first info-check__label--email">
                <Label title='E-MAIL'>
                  <InputField
                    type='email'
                    name='email'
                    value={email}
                    onChange={e => {}}
                    isDisabled
                  />
                </Label>
              </div>

              <div className="info-check__label">
                <Label title='PHONE ( WHATS APP )'>
                  <div className="info-check__phone">
                    <div
                      className="info-check__phone-select"
                      onClick={() => {
                        setPhoneDropdown(!phoneDropdown);
                        setCountryDropdown(false);
                      }}
                    >
                      <PhoneSelect
                        code={phoneAlpha2 || null}
                        error={phonePrefixError}
                      />
                    </div>

                    <div className="info-check__phone-input">
                      <InputField
                        type='text'
                        name='phoneNumber'
                        forPhone
                        value={phoneNumber || ''}
                        onChange={(e) => {
                          customNumberValidator(e, setPhoneNumber, true);
                          setPhoneNumberError(false);
                          setDataChanged(true);
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
          </div>

          <div className="info-check__checkbox">
            <Checkbox
              onClick={() => {
                setPrivacy(!privacy);
                setPrivacyError(false);
              }}
              checked={privacy}
              required
              error={privacyError}
            />

            <div className="info-check__checkbox-title">
              I consent my information to be used in accordance with the
                <Link
                  href="https://videoworkers.com/legal/terms"
                  target="_blank"
                  className="info-check__checkbox-link"
                >
                  {" Privacy Policy "}
                </Link>
            </div>
          </div>

          <div className="info-check__bottom">
            <NextStep
              onClick={handleUpdateUserInfo}
              isLoading={isLoading}
              nextStep={NextStepInfo.Residency}
            />
          </div>
        </div>
      </FlowContainer>

      <div className="steps steps--mobile">
        <StepIcon
          iconName={"info"}
          status={"current"}
          title={"Information"}
        />

        <div className="steps-arrows">
          <Arrows toRight={true} arrowsCount={3} />
        </div>

        <StepIcon
          iconName={"residency"}
          status={"undone"}
          title={"Residency"}
        />

        <div className="steps-arrows">
          <Arrows toRight={true} arrowsCount={3} />
        </div>

        <StepIcon
          iconName={"experience"}
          status={"undone"}
          title={"Experience"}
        />
      </div>

      <div className="steps steps--desktop">
        <StepIcon
          iconName={"info"}
          status={"current"}
          title={"Information"}
        />

        <div className="steps-arrows">
          <Arrows toRight={true} />
        </div>

        <StepIcon
          iconName={"residency"}
          status={"undone"}
          title={"Residency"}
        />

        <div className="steps-arrows">
          <Arrows toRight={true} />
        </div>

        <StepIcon
          iconName={"experience"}
          status={"undone"}
          title={"Experience"}
        />

        <div className="steps-arrows">
          <Arrows toRight={true} />
        </div>

        <StepIcon
          iconName={"education"}
          status={"undone"}
          title={"Education"}
        />

        <div className="steps-arrows">
          <Arrows toRight={true} />
        </div>

        <StepIcon
          iconName={"certifications"}
          status={"undone"}
          title={"Certification"}
        />

        <div className="steps-arrows">
          <Arrows toRight={true} />
        </div>

        <StepIcon
          iconName={"courses"}
          status={"undone"}
          title={"Courses"}
        />

        <div className="steps-arrows">
          <Arrows toRight={true} />
        </div>

        <StepIcon
          iconName={"language"}
          status={"undone"}
          title={"Language"}
          />

        <div className="steps-arrows">
          <Arrows toRight={true} />
        </div>

        <StepIcon
          iconName={"driving"}
          status={"undone"}
          title={"Driving"}
        />

        <div className="steps-arrows">
          <Arrows toRight={true} />
        </div>

        <StepIcon
          iconName={"picture"}
          status={"undone"}
          title={"Picture"}
        />

        <div className="steps-arrows">
          <Arrows toRight={true} />
        </div>

        <StepIcon
          iconName={"subscription"}
          status={"undone"}
          title={"Subscription"}
        />
      </div>
    </>
  )
}
