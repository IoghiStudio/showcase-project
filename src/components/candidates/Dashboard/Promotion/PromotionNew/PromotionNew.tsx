'use client';
import './PromotionNew.scss';
import { IFullPosition} from '@/services/api/jobPosition.service';
import { useRecoilState, useSetRecoilState } from 'recoil';
import { Label } from '@/components/utils/Label';
import { AxiosResponse } from 'axios';
import { useCallback, useEffect, useState } from 'react';
import { Select } from '@/components/utils/Select';
import { JobPositionsDropdown } from '@/components/utils/JobPositionsDropdown';
import { CountryDropdown } from '@/components/utils/CountryDropdown';
import { ICountry } from '@/types/Country';
import { FlagIcon } from '@/components/utils/FlagIcon';
import { ButtonWithIcon } from '../../utils/ButtonWihIcon';
import { IPostPromotedPosition, postPromotedPosition } from '@/services/api/promotedPositions.service';
import { useRouter } from 'next/navigation';
import { PositionToPromoteStore, PromotedPositionsStore } from '@/store/promotionsStore';

export const PromotionNew = () => {
  const [positionsDropdown, setPositionsDropdown] = useState<boolean>(false);
  const [countryDropdown, setCountryDropdown] = useState<boolean>(false);
  const [positionToPromote, setPositionToPromote] = useRecoilState(PositionToPromoteStore);
  const [countryList, setCountryList] = useState<ICountry[]>([]);
  const [positionError, setPositionError] = useState<boolean>(false);
  const [countryError, setCountryError] = useState<boolean>(false);
  const [query, setQuery] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [countryPrice, setCountryPrice] = useState<number>(3.99);
  const router = useRouter();
  const setPromotedPositions = useSetRecoilState(PromotedPositionsStore);

  const handlePositionClick = useCallback((position: IFullPosition) => {
    setPositionToPromote(position)
    setPositionError(false);
    setPositionsDropdown(false);
  }, []);

  const handleCountryClick = useCallback((country: ICountry) => {
    setCountryList(state => {
      if (state.some(c => c.country_id === country.country_id)) {
        return state;
      } else {
        setCountryError(false);
        setCountryDropdown(false);
        return [...state, country];
      }
    });
  }, []);

  const handleUnselectCountry = useCallback((country: ICountry) => {
    setCountryList(state => state.filter(c => c.country_id !== country.country_id))
  }, []);

  const handlePromote = async () => {
    let error: boolean = false;

    if (!countryList.length) {
      error = true;
      setCountryError(true);
    }

    if (!positionToPromote) {
      error = true;
      setPositionError(true);
    }

    if (error) return;
    if (!positionToPromote?.job_position_id) return;

    try {
      setIsLoading(true);

      const data: IPostPromotedPosition = {
        job_position_id: positionToPromote.job_position_id,
        countryIds: countryList.map(c => c.country_id),
      };

      const resp: AxiosResponse<any, any> = await postPromotedPosition(data);
      router.push(resp.data.data.data);
      setPromotedPositions(null);
      setIsLoading(false);
    } catch (error) {
      setIsLoading(false);
    }
  };

  return (
    <div className="promotion-new">
      <div className="container promotion-new__promote">
        <div className="container__title">
          Promote your job position
        </div>

        <div className="container__text">
          Select the countries in which you want better visibility
        </div>

        <div className="promotion-new__promote-content">
          <div className="promotion-new__fields">
            <div className="promotion-new__label">
              <Label title='JOB POSITION'>
                <div
                  className="add__select"
                  onClick={() => {
                    setPositionsDropdown(!positionsDropdown)
                    setCountryDropdown(false);
                  }}
                >
                  <Select
                    value={positionToPromote?.JobTitle?.name || ''}
                    error={positionError}
                  />
                </div>

                <JobPositionsDropdown
                  isOpen={positionsDropdown}
                  onSelect={handlePositionClick}
                />
              </Label>
            </div>

            <div className="promotion-new__label">
              <Label title='COUNTRY'>
                <div
                  className="add__select"
                  onClick={() => {
                    setPositionsDropdown(false)
                    setCountryDropdown(!countryDropdown);
                  }}
                >
                  <Select
                    value={''}
                    error={countryError}
                  />
                </div>

                <CountryDropdown
                  isOpen={countryDropdown}
                  onSelect={handleCountryClick}
                />
              </Label>
            </div>
          </div>

          <div className="promotion-new__countries">
            <div className="promotion-new__label">
              <Label title='SELECTED COUNTRIES'>
                {countryList.map(country => (
                  <div className="promotion-new__country">
                    <div className="promotion-new__country-left">
                      <div className="promotion-new__country-flag">
                        <FlagIcon code={country.alpha_2} size={20}/>
                      </div>

                      <div className="promotion-new__country-name">
                        {country.name}
                      </div>
                    </div>

                    <div className="promotion-new__cross" onClick={() => handleUnselectCountry(country)}>
                      <div className="promotion-new__cross-icon"/>
                    </div>
                  </div>
                ))}
              </Label>
            </div>
          </div>
        </div>
      </div>

      <div className="container promotion-new__info">
        <div className="promotion-new__info-headline">
          30 days of promoted listing in selected countries
        </div>

        <div className="promotion-new__info-title">
          Promote job position
        </div>

        <div className="promotion-new__info-green">
          <div className="promotion-new__info-green-icon"/>

          <div className="promotion-new__info-green-span">
            300%
          </div>
          more visibility in selected countries
        </div>

        <div className="promotion-new__pairs">
          <div className="promotion-new__pair">
            <div className="promotion-new__pair-title">
              Countries
            </div>

            <div className="promotion-new__pair-text">
              {`${countryList.length} selected`}
            </div>
          </div>

          <div className="promotion-new__pair">
            <div className="promotion-new__pair-title">
              {`$${(countryList.length * countryPrice).toFixed(2)}`}
            </div>

            <div className="promotion-new__pair-text">
              {`$${countryPrice}/country`}
            </div>
          </div>
        </div>

        <div className="promotion-new__pairs promotion-new__pairs--bottom">
          <div className="promotion-new__pair">
            <div className="promotion-new__pair-title promotion-new__pair-title--black">
              Pay today
            </div>
          </div>

          <div className="promotion-new__pair">
            <div className="promotion-new__pair-title promotion-new__pair-title--black">
              {`$${(countryList.length * countryPrice).toFixed(2)}`}
            </div>
          </div>
        </div>

        <div
          onClick={() => handlePromote()}
          className="promotion-new__promote-btn"
        >
          <ButtonWithIcon
            isLoading={isLoading}
            text='START TO PROMOTE'
          />
        </div>
      </div>
    </div>
  )
}
