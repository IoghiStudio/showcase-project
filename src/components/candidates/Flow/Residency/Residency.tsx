'use client';
import './Residency.scss';
import { FlowPageName, FlowPageText } from '@/types/FlowPage';
import { Checkbox } from '@/components/utils/Checkbox';
import { NextStep, NextStepInfo } from '../NextStep';
import { useCallback, useEffect, useState } from 'react';
import { FlowContainer } from '../FlowContainer';
import { Label } from '@/components/utils/Label';
import { InputField } from '@/components/utils/InputField';
import { CountrySelect } from '@/components/utils/CountrySelect';
import { StepIcon } from '@/components/utils/StepIcon';
import { Arrows } from '@/components/utils/Arrows';
import { ICountry } from '@/types/Country';
import { CountryDropdown } from '@/components/utils/CountryDropdown';
import { useRouter } from 'next/navigation';
import { useRecoilState } from 'recoil';
import { ResidencyStore } from '@/store/flowPagesData/residencyStore';
import { AxiosResponse } from 'axios';
import { getResidency, postResidency, updateResidency } from '@/services/api/residency.service';
import { IResidency } from '@/types/Residency';

const infoTexts: FlowPageText[] = [
  {
    id: '1',
    text: 'There might be situations when hard-copy documents have to be received by candidates, so it is best to give the address where you get all your mail.'
  },
];

export const Residency = () => {
  const [street, setStreet] = useState<string>('');
  const [apartment, setApartment] = useState<string>('');
  const [city, setCity] = useState<string>('');
  const [state, setState] = useState<string>('');
  const [country, setCountry] = useState<ICountry | null>(null);
  const [verifiedInfo, setVerifiedInfo] = useState<boolean>(true);
  const [countryDropdown, setCountryDropdown] = useState<boolean>(false);
  const router = useRouter();
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [streetError, setStreetError] = useState<boolean>(false);
  const [cityError, setCityError] = useState<boolean>(false);
  const [stateError, setStateError] = useState<boolean>(false);
  const [countryError, setCountryError] = useState<boolean>(false);
  const [residencyData, setResidencyData] = useRecoilState(ResidencyStore);
  const [shouldUpdate, setShouldUpdate] = useState<boolean>(true);
  const [verifiedError, setVerifiedError] = useState<boolean>(false);
  const [dataChanged, setDataChanged] = useState<boolean>(false);


  const fetchResidency = useCallback(async () => {
    try {
      const resp: AxiosResponse<any, any> = await getResidency();
      const residencyFetched: IResidency = resp.data.data.data
      setResidencyData(residencyFetched);
      if (!resp.data.data.data) setShouldUpdate(false);
    } catch (error) {}
  }, []);

  useEffect(() => {
    if (!residencyData) fetchResidency();
  }, []);

  useEffect(() => {
    if (!residencyData) return;
    setApartment(residencyData?.appartment || '');
    setStreet(residencyData.street_address);
    setState(residencyData.province);
    setCity(residencyData.town);
    setCountry(residencyData.Country || null);
  }, [residencyData]);

  const handleCountryClick = useCallback((country: ICountry) => {
    setCountry(country);
    setCountryDropdown(false);
    setCountryError(false);
    setDataChanged(true);
  }, []);

  const handleSaveResidency = async () => {
    let errorAppeared: boolean = false;

    if (!street) {
      setStreetError(true);
      errorAppeared = true;
    }
    if (!city) {
      setCityError(true);
      errorAppeared = true;
    }
    if (!state) {
      setStateError(true);
      errorAppeared = true;
    }
    if (!country) {
      setCountryError(true);
      errorAppeared = true;
    }
    if (!verifiedInfo) {
      setVerifiedError(true);
      errorAppeared = true;
    }
    if(errorAppeared) return;
    if (!country) return;
    if (!dataChanged) {
      router.push('/candidates/flow/experience/')
      return;
    }

    const residencyData: IResidency = {
      country_id: country.country_id,
      street_address: street,
      province: state,
      town: city,
      appartment: apartment || null
    };

    try {
      setIsLoading(true);

      if (!shouldUpdate) {
        await postResidency(residencyData);
      } else {
        await updateResidency(residencyData);
      }

      setResidencyData(null);
      router.push('/candidates/flow/experience/');
    } catch (error) {
      setIsLoading(false);
    }
  };

  return (
    <>
      <FlowContainer
        title={'YOUR CURRENT RESIDENCY / ADDRESS'}
        text={'This information will be available to companies to help them search for candidates in a specific area, make decisions about the profile of the ideal candidate and inform themselves in advance of employment conditions and labor migration legislation.'}
        pageName={FlowPageName.Residency}
        infoTexts={infoTexts}
      >
        <div className="residency">
          <div className="residency__form">
            <div className="residency__row">
              <div className="residency__label residency__label--first">
                <Label title='STREET ADRESS'>
                  <InputField
                    type='text'
                    name='street-adress'
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

              <div className="residency__label">
                <Label title='BUILDING / APARTMENT'>
                  <InputField
                    type='text'
                    name='apartment'
                    value={apartment}
                    onChange={e => {
                      setApartment(e.target.value);
                      setDataChanged(true);
                    }}
                  />
                </Label>
              </div>
            </div>

            <div className="residency__row">
              <div className="residency__label residency__label--first">
                <Label title='TOWN / CITY'>
                  <InputField
                    type='text'
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

              <div className="residency__label">
                <Label title='STATE / PROVINCE'>
                  <InputField
                    type='text'
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

            <div className="residency__row">
              <div className="residency__label residency__label--first">
                <Label title='COUNTRY'>
                  <div
                    className="residency__select"
                    onClick={() => {
                      setCountryDropdown(!countryDropdown);
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

              <div className="residency__label"/>
            </div>
          </div>

          <div className="residency__checkbox">
            <Checkbox
              onClick={() => {
                setVerifiedInfo(!verifiedInfo);
                setVerifiedError(false);
              }}
              checked={verifiedInfo}
              required
              error={verifiedError}
            />

            <div className="residency__checkbox-title">
              I have verified the information and it is correct and complete.
            </div>
          </div>

          <div className="residency__bottom">
            <NextStep
              onClick={handleSaveResidency}
              nextStep={NextStepInfo.Experience}
              isLoading={isLoading}
            />
          </div>
        </div>
      </FlowContainer>

      <div className="steps steps--mobile">
        <StepIcon iconName={"info"} status={"done"} title={"Information"} />

        <div className="steps-arrows">
          <Arrows toRight={false} arrowsCount={3} />
        </div>

        <StepIcon
          iconName={"residency"}
          status={"current"}
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
          status={"done"}
          title={"Information"}
        />

        <div className="steps-arrows">
          <Arrows toRight={false} />
        </div>

        <StepIcon
          iconName={"residency"}
          status={"current"}
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

