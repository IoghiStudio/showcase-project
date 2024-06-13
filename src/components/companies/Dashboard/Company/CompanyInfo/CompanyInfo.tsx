'use client';
import '../../../../candidates/Dashboard/Settings/Account/Info/Info.scss'
import './CompanyInfo.scss';
import '../../../Register/Register.scss';
import { PhoneSelect } from '@/components/utils/PhoneSelect';
import { IUpdateCompanyInfo, getCompanyData, updateCompanyInfo } from "@/services/api/authUser.service";
import { CompanyDataStore } from "@/store/companyDataStore";
import { CompanyAccountType, ICompanyData } from "@/types/CompanyData";
import { ICountry } from "@/types/Country";
import { IIndustrySubcategory } from "@/types/Industry";
import { AxiosResponse } from "axios";
import { useCallback, useEffect, useState } from "react";
import { useRecoilState } from "recoil";
import { Label } from '@/components/utils/Label';
import { InputField } from '@/components/utils/InputField';
import { Button } from '@/components/utils/Button';
import { ButtonColor } from '@/types/ButtonColor';
import { CountryDropdown } from '@/components/utils/CountryDropdown';
import { customNumberValidator, isEmailCorrect } from '@/components/utils/utils';
import { CountrySelect } from '@/components/utils/CountrySelect';
import { IndustryDropdown } from '@/components/utils/IndustryDropdown';
import { Select } from '@/components/utils/Select';
import classNames from 'classnames';

export const CompanyInfo = () => {
  const [companyData, setCompanyData] = useRecoilState(CompanyDataStore);
  const [name, setName] = useState<string>('');
  const [country, setCountry] = useState<ICountry | null>(null);
  const [taxId, setTaxId] = useState<string>('');
  const [companyEmail, setCompanyEmail] = useState<string>('');
  const [companyPhonenumber, setCompanyPhonenumber] = useState<string>('');
  const [companyPhonePrefix, setCompanyPhonePrefix] = useState<string>('');
  const [companyPhoneAlpha2, setCompanyPhoneAlpha2] = useState<string>('');
  const [appartment, setAppartment] = useState<string>('');
  const [city, setCity] = useState<string>('');
  const [state, setState] = useState<string>('');
  const [street, setStreet] = useState<string>('');
  const [industry, setIndustry] = useState<IIndustrySubcategory | null>(null);

  const [companyEmailError, setCompanyEmailError] = useState<boolean>(false);
  const [companyPhonenumberError, setCompanyPhonenumberError] = useState<boolean>(false);
  const [companyPhonePrefixError, setCompanyPhonePrefixError] = useState<boolean>(false);
  const [appartmentError, setAppartmentError] = useState<boolean>(false);
  const [cityError, setCityError] = useState<boolean>(false);
  const [stateError, setStateError] = useState<boolean>(false);
  const [streetError, setStreetError] = useState<boolean>(false);
  const [industryError, setIndustryError] = useState<boolean>(false);

  const [phoneDropdown, setPhoneDropdown] = useState<boolean>(false);
  const [industryDropdown, setIndustryDropdown] = useState<boolean>(false);

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
      const companyDataFetched: ICompanyData = resp.data.data.data;
      setCompanyData(companyDataFetched);
      console.log(companyDataFetched);

    } catch (error) {}
  }, []);

  useEffect(() => {
    if (!companyData) fetchCompanyData();
  }, []);

  useEffect(() => {
    if (!companyData) return;
    setCompanyEmail(companyData.company_email || '');
    setCompanyPhonenumber(companyData.company_phonenumber || '');
    setCompanyPhonePrefix(companyData.company_phone_prefix || '');
    setCompanyPhoneAlpha2(companyData.company_phone_alpha_2 || '');
    setTaxId(companyData.tax_id);
    setName(companyData.name);
    setCountry(companyData.Country);
    setIndustry(companyData.IndustrySubcategory);
    setStreet(companyData.CompanyResidency?.street_address || '');
    setAppartment(companyData.CompanyResidency?.appartment || '');
    setState(companyData.CompanyResidency?.province || '');
    setCity(companyData.CompanyResidency?.town || '');
  }, [companyData]);

  const handlePrefixClick = useCallback((country: ICountry) => {
    setCompanyPhonePrefix(country.phone_code);
    setCompanyPhoneAlpha2(country.alpha_2);
    setPhoneDropdown(false);
    setCompanyPhonePrefixError(false);
    setDataChanged(true);
  }, []);

  const handleIndustryClick = useCallback((industry: IIndustrySubcategory) => {
    setIndustry(industry);
    setIndustryDropdown(false);
    setIndustryError(false);
    setDataChanged(true);
  }, []);

  const handleUpdateCompanyInfo = async () => {
    let errorAppeared: boolean = false;
    if (!dataChanged) return;

    if (!street) {
      setStreetError(true);
      errorAppeared = true;
    };
    if (!city) {
      setCityError(true);
      errorAppeared = true;
    };
    if (!appartment) {
      setAppartmentError(true);
      errorAppeared = true;
    };
    if (!state) {
      setStateError(true);
      errorAppeared = true;
    };
    if (!companyEmail || !isEmailCorrect(companyEmail)) {
      setCompanyEmailError(true);
      errorAppeared = true;
    };
    if (!companyPhonePrefix) {
      setCompanyPhonePrefixError(true);
      errorAppeared = true;
    };
    if (!companyPhonenumber) {
      setCompanyPhonenumberError(true);
      errorAppeared = true;
    };
    if (companyPhonenumber) {
      if (companyPhonenumber?.length < 9 || companyPhonenumber?.length > 13) {
        setCompanyPhonenumberError(true);
        errorAppeared = true;
      };
    }
    if (!industry) {
      setIndustryError(true);
      errorAppeared = true;
    };

    if (errorAppeared) return;
    if (!companyPhonenumber) return;
    if (!companyPhoneAlpha2) return;
    if (!companyPhonePrefix) return;
    if (!industry) return;
    if (!country) return;

    const companyData: IUpdateCompanyInfo = {
      industry_id: industry.industry_id,
      industry_subcategory_id: industry.industry_subcategory_id,
      company_email: companyEmail,
      company_phonenumber: companyPhonenumber,
      company_phone_alpha_2: companyPhoneAlpha2,
      company_phone_prefix: companyPhonePrefix,
      country_id: country.country_id,
      street_address: street,
      province: state,
      town: city,
      appartment: appartment,
    };

    try {
      setIsLoading(true);
      await updateCompanyInfo(companyData);
      fetchCompanyData();
      setDataSaved(true);
      setIsLoading(false);
      setDataChanged(false);
    } catch (error: any) {
      setIsLoading(false);
    }
  };

  return (
    <div className="container info">
      <div className="company-info-type">
        {companyData?.account_type === CompanyAccountType.Agency && (
          'Recruitment Agency'
        )}

        {companyData?.account_type === CompanyAccountType.Employeer && (
          'Direct Employer'
        )}
      </div>

      <div className="container__title">
        Company Information
      </div>

      <div className="container__text">
        Details about your company
      </div>

      <div className="container__form">
        <div className="container__form-row">
          <div className="container__label container__label--first">
            <Label title='COMPANY NAME'>
              <InputField
                type='name'
                name='name'
                value={name}
                onChange={e => {}}
                isDisabled
              />
            </Label>
          </div>

          <div className="container__label container__label">
            <Label title='STREET ADDRESS'>
              <InputField
                type='street'
                name='street'
                value={street}
                onChange={(e) => {
                  setStreet(e.target.value);
                  setStreetError(false);
                  setDataChanged(true);
                }}
                error={streetError}
              />
            </Label>
          </div>
        </div>

        <div className="container__form-row">
          <div className="container__label container__label--first">
            <Label title='TAX ID / VAT NUMBER'>
              <InputField
                type='taxid'
                name='taxid'
                value={taxId}
                onChange={e => {}}
                isDisabled
              />
            </Label>
          </div>

          <div className="container__label container__label">
            <Label title='BUILDING / APPARTMENT'>
              <InputField
                type='appartment'
                name='appartment'
                value={appartment}
                onChange={(e) => {
                  setAppartment(e.target.value);
                  setAppartmentError(false);
                  setDataChanged(true);
                }}
                error={appartmentError}
              />
            </Label>
          </div>
        </div>

        <div className="container__form-row">
          <div className="container__label container__label--first">
            <Label title='INDUSTRY'>
              <div
                className="add__select"
                onClick={() => {
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

          <div className="container__label container__label">
            <Label title='TOWN / CITY'>
              <InputField
                type='city'
                name='city'
                value={city}
                onChange={(e) => {
                  setCity(e.target.value);
                  setCityError(false);
                  setDataChanged(true);
                }}
                error={cityError}
              />
            </Label>
          </div>
        </div>

        <div className="container__form-row">
          <div className="container__label container__label--first">
            <Label title='COMPANY PHONE NUMBER'>
              <div className="info__phone">
                <div
                  className="info__phone-select"
                  onClick={() => {
                    setPhoneDropdown(!phoneDropdown);
                    setIndustryDropdown(false);
                  }}
                >
                  <PhoneSelect
                    code={companyPhoneAlpha2 || null}
                    error={companyPhonePrefixError}
                  />
                </div>

                <div className="info__phone-input">
                  <InputField
                    type='text'
                    name='phoneNumber'
                    forPhone
                    value={companyPhonenumber || ''}
                    onChange={(e) => {
                      customNumberValidator(e, setCompanyPhonenumber, true);
                      setCompanyPhonenumberError(false);
                      setDataChanged(true);
                    }}
                    error={companyPhonenumberError}
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

          <div className="container__label">
            <Label title='STATE / PROVINCE'>
              <InputField
                type='state'
                name='state'
                value={state}
                onChange={(e) => {
                  setState(e.target.value);
                  setStateError(false);
                  setDataChanged(true);
                }}
                error={stateError}
              />
            </Label>
          </div>
        </div>

        <div className="container__form-row">
          <div className="container__label container__label--first">
            <Label title='COMPANY EMAIL ADDRESS'>
              <InputField
                type='companyEmail'
                name='companyEmail'
                value={companyEmail}
                onChange={(e) => {
                  setCompanyEmail(e.target.value);
                  setCompanyEmailError(false);
                  setDataChanged(true);
                }}
                error={companyEmailError}
              />
            </Label>

            <div
              className={classNames("register__validate-icon", {
                "register__validate-icon--invalid": companyEmail.length,
                "register__validate-icon--valid": isEmailCorrect(companyEmail),
              })}
            />
          </div>

          <div className="container__label">
            <Label title='COUNTRY OF REGISTRATION'>
              <CountrySelect
                name={country?.name || null}
                code={country?.alpha_2 || null}
                disabled
              />
            </Label>
          </div>
        </div>
      </div>

      <div className="container__save-btn">
        <Button
          color={ButtonColor.Green}
          onClick={handleUpdateCompanyInfo}
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
