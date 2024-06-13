'use client';
import '../../../candidates/Dashboard/Settings/Account/Info/Info.scss';
import '../../../candidates/Dashboard/Settings/Account/Account.scss';
import { AxiosResponse } from 'axios';
import { useCallback, useEffect, useState } from 'react';
import { useRecoilState } from 'recoil';
import { ICompanyUserInfo, getCompanyData, updateCompanyUserInfo } from '@/services/api/authUser.service';
import { ICountry } from '@/types/Country';
import { Label } from '@/components/utils/Label';
import { InputField } from '@/components/utils/InputField';
import { CountryDropdown } from '@/components/utils/CountryDropdown';
import { PhoneSelect } from '@/components/utils/PhoneSelect';
import { customNumberValidator } from '@/components/utils/utils';
import { Button } from '@/components/utils/Button';
import { ButtonColor } from '@/types/ButtonColor';
import { CompanyDataStore } from '@/store/companyDataStore';
import { ICompanyData } from '@/types/CompanyData';
import { Picture } from '@/components/candidates/Dashboard/Settings/Account/Picture';

export const User = () => {
  const [companyData, setCompanyData] = useRecoilState(CompanyDataStore);
  const [firstName, setFirstName] = useState<string>('');
  const [lastName, setLastName] = useState<string>('');
  const [email, setEmail] = useState<string>('');
  const [phonePrefix, setPhonePrefix] = useState<string | null>(null);
  const [phoneNumber, setPhoneNumber] = useState<string | null>(null);
  const [phoneAlpha2, setPhoneAlpha2] = useState<string | null>(null);
  const [phoneDropdown, setPhoneDropdown] = useState<boolean>(false);
  const [firstNameError, setFirstNameError] = useState<boolean>(false);
  const [lastNameError, setLastNameError] = useState<boolean>(false);
  const [phoneNumberError, setPhoneNumberError] = useState<boolean>(false);
  const [phonePrefixError, setPhonePrefixError] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [dataChanged, setDataChanged] = useState<boolean>(false);
  const [dataSaved, setDataSaved] = useState<boolean>(false);

  useEffect(() => {
    if (!dataSaved) return;
    setTimeout(() => setDataSaved(false), 2000);
  }, [dataSaved]);

  const fetchCompanyData = useCallback(async () => {
    try {
      const resp: AxiosResponse<any, any> = await getCompanyData();
      const companyDataFecthed: ICompanyData = resp.data.data.data;
      setCompanyData(companyDataFecthed);
    } catch (error) {}
  }, []);

  useEffect(() => {
    if (!companyData) fetchCompanyData();
  }, []);

  useEffect(() => {
    if (!companyData) return;
    setEmail(companyData.email);
    setFirstName(companyData.firstname);
    setLastName(companyData.lastname);
    setPhonePrefix(companyData?.phone_prefix);
    setPhoneNumber(companyData.phonenumber);
    setPhoneAlpha2(companyData.phone_alpha_2);
  }, [companyData]);

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
    if (!phoneNumber) return;
    if (!phoneAlpha2) return;
    if (!phonePrefix) return;
    if (!dataChanged) return;

    const infoCheckData: ICompanyUserInfo = {
      firstname: firstName,
      lastname: lastName,
      phonenumber: phoneNumber,
      phone_alpha_2: phoneAlpha2,
      phone_prefix: phonePrefix,
    };

    try {
      setIsLoading(true);
      await updateCompanyUserInfo(infoCheckData);
      fetchCompanyData();
      setDataSaved(true);
      setIsLoading(false);
      setDataChanged(false);
    } catch (error: any) {
      setIsLoading(false);
    }
  };

  return (
    <div className="account">
    <div className="account__picture">
      <Picture forCompany />
    </div>

    <div className="account__right">
      <div className="account__info">
        <div className="container info">
          <div className="container__title">
            User Information
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
                <Label title='BUSINESS PHONE'>
                  <div className="info__phone">
                    <div
                      className="info__phone-select"
                      onClick={() => {
                        setPhoneDropdown(!phoneDropdown);
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

              <div className="container__label container__label">
                <Label title='BUSINESS E-MAIL'>
                  <InputField
                    type='email'
                    name='email'
                    value={email}
                    onChange={e => {}}
                    isDisabled
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
      </div>
    </div>
  </div>
  )
}
