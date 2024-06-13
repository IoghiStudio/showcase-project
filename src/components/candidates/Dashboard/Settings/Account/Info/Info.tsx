'use client';
import './Info.scss';
import { IUserData } from '@/types/UserData';
import { UserDataStore } from '@/store/userDataStore';
import { AxiosResponse } from 'axios';
import { useCallback, useEffect, useState } from 'react';
import { useRecoilState } from 'recoil';
import { getUserData, updateUserInfo } from '@/services/api/authUser.service';
import { ICountry } from '@/types/Country';
import { IInfoCheck } from '@/types/InfoCheck';
import { Label } from '@/components/utils/Label';
import { InputField } from '@/components/utils/InputField';
import { CountrySelect } from '@/components/utils/CountrySelect';
import { CountryDropdown } from '@/components/utils/CountryDropdown';
import { PhoneSelect } from '@/components/utils/PhoneSelect';
import { customNumberValidator } from '@/components/utils/utils';
import { Button } from '@/components/utils/Button';
import { ButtonColor } from '@/types/ButtonColor';

export const Info = () => {
  const [userData, setUserData] = useRecoilState(UserDataStore);
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
  const [firstNameError, setFirstNameError] = useState<boolean>(false);
  const [lastNameError, setLastNameError] = useState<boolean>(false);
  const [birthDateError, setBirthDateError] = useState<boolean>(false);
  const [nationalityError, setNationalityError] = useState<boolean>(false);
  const [phoneNumberError, setPhoneNumberError] = useState<boolean>(false);
  const [phonePrefixError, setPhonePrefixError] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [dataChanged, setDataChanged] = useState<boolean>(false);
  const [dataSaved, setDataSaved] = useState<boolean>(false);

  useEffect(() => {
    if (!dataSaved) return;
    setTimeout(() => setDataSaved(false), 2000);
  }, [dataSaved]);

  const fetchUserData = useCallback(async () => {
    try {
      const resp: AxiosResponse<any, any> = await getUserData();
      const userDataFecthed: IUserData = resp.data.data.data;
      setUserData(userDataFecthed);
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

    if (errorAppeared) return;
    if (!nationality) return;
    if (!birthDate) return;
    if (!phoneNumber) return;
    if (!phoneAlpha2) return;
    if (!phonePrefix) return;
    if (!dataChanged) return;

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
      fetchUserData();
      setDataSaved(true);
      setIsLoading(false);
      setDataChanged(false);
    } catch (error: any) {
      setIsLoading(false);
    }
  };

  return (
    <div className="container info">
      <div className="container__title">
        Account Information
      </div>

      <div className="container__text">
        Information about you
      </div>

      <div className="container__form">
        <div className="container__form-row">
          <div className="container__label container__label--first">
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

          <div className="container__label">
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

        <div className="container__form-row">
          <div className="container__label container__label--first">
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

          <div className="container__label">
            <Label title='NATIONALITY'>
              <div
                className="info__select"
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

        <div className="container__form-row">
          <div className="container__label container__label--first">
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

          <div className="container__label container__label">
            <Label title='PHONE ( WHATS APP )'>
              <div className="info__phone">
                <div
                  className="info__phone-select"
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

                <div className="info__phone-input">
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

      <div className="container__save-btn">
        <Button
          color={ButtonColor.Green}
          onClick={handleUpdateUserInfo}
          loading={isLoading}
          textSmall
        >
          Save changes
        </Button>

        {dataSaved && (
          <div className="info__added-container">
            <div className="info__added">
              Saved
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
