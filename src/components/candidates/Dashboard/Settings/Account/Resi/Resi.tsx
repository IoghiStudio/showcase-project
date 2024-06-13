'use client';
import { Button } from '@/components/utils/Button';
import './Resi.scss';
import { ButtonColor } from '@/types/ButtonColor';
import { useCallback, useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { ICountry } from '@/types/Country';
import { useRecoilState } from 'recoil';
import { ResidencyStore } from '@/store/flowPagesData/residencyStore';
import { AxiosResponse } from 'axios';
import { getResidency, postResidency, updateResidency } from '@/services/api/residency.service';
import { IResidency } from '@/types/Residency';
import { Label } from '@/components/utils/Label';
import { InputField } from '@/components/utils/InputField';
import { CountryDropdown } from '@/components/utils/CountryDropdown';
import { CountrySelect } from '@/components/utils/CountrySelect';

export const Resi = () => {
  const [street, setStreet] = useState<string>('');
  const [apartment, setApartment] = useState<string>('');
  const [city, setCity] = useState<string>('');
  const [state, setState] = useState<string>('');
  const [country, setCountry] = useState<ICountry | null>(null);
  const [countryDropdown, setCountryDropdown] = useState<boolean>(false);
  const router = useRouter();
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [streetError, setStreetError] = useState<boolean>(false);
  const [cityError, setCityError] = useState<boolean>(false);
  const [stateError, setStateError] = useState<boolean>(false);
  const [countryError, setCountryError] = useState<boolean>(false);
  const [residencyData, setResidencyData] = useRecoilState(ResidencyStore);
  const [shouldUpdate, setShouldUpdate] = useState<boolean>(true);
  const [dataChanged, setDataChanged] = useState<boolean>(false);
  const [dataSaved, setDataSaved] = useState<boolean>(false);

  useEffect(() => {
    if (!dataSaved) return;
    setTimeout(() => setDataSaved(false), 2000);
  }, [dataSaved]);

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
    if(errorAppeared) return;
    if (!country) return;
    if (!dataChanged) return;

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

      setDataChanged(false)
      setIsLoading(false);
      setDataSaved(true);
      fetchResidency();
    } catch (error) {
      setIsLoading(false);
    }
  };

  return (
    <div className="container resi">
      <div className="container__title">
        Current Residency
      </div>

      <div className="container__text">
        Your residence adress is important for the employement process.
      </div>

      <div className="container__form">
        <div className="container__form-row">
          <div className="container__label container__label--first">
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

          <div className="container__label">
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

        <div className="container__form-row">
          <div className="container__label container__label--first">
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

          <div className="container__label">
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

        <div className="container__form-row">
          <div className="container__label container__label--first">
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

          <div className="container__label container__label"/>
        </div>
      </div>

      <div className="container__save-btn">
        <Button
          color={ButtonColor.Green}
          onClick={handleSaveResidency}
          loading={isLoading}
          textSmall
        >
          Save changes
        </Button>

        {dataSaved && (
          <div className="resi__added-container">
            <div className="resi__added">
              Saved
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
