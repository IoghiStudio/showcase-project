'use client';
import '../Dropdown.scss';
import { useCallback, useEffect, useState } from 'react';
import { AxiosResponse } from 'axios';
import { getCountries } from '@/services/api/dropdownsData.service';
import { useRecoilState } from 'recoil';
import { CountriesStore } from '@/store/dropdownsDataStore';
import { FlagIcon } from '../FlagIcon';
import classNames from 'classnames';
import { ICountry } from '@/types/Country';

type Props = {
  isOpen: boolean;
  onSelect: (country: ICountry) => void;
  forPhone?: boolean;
};

export const CountryDropdown: React.FC<Props> = ({
  isOpen,
  onSelect,
  forPhone = false
}) => {
  const [query, setQuery] = useState<string>('');
  const [countries, setCountries] = useRecoilState(CountriesStore);

  const fetchCountries = useCallback(async () => {
    try {
      const resp: AxiosResponse<any, any> = await getCountries();
      const data: ICountry[] = resp.data.data.data;
      setCountries(data);
    } catch (error) {}
  }, []);


  useEffect(() => {
    if (!countries) fetchCountries();
  }, []);

  return (
    <div className={classNames("dropdown", {
      "dropdown--active": isOpen
    })}>
      <input
        type="text"
        className={`dropdown__input`}
        value={query}
        onChange={(e) => {
          setQuery(e.target.value.toLowerCase());
        }}
      />

      <div className="dropdown__cross-container" onClick={() => setQuery('')}>
        <div className="dropdown__cross"/>
      </div>

      <div className="dropdown__list">
        {countries && countries
          .filter((country) =>
            country.name.toLowerCase().includes(query)
          )
          .map((country) => {
            const { country_id, name, alpha_2, phone_code } = country;

            return (
              <div
                key={country_id}
                className="dropdown__item dropdown__item--with-flag"
                onClick={() => {
                  setQuery('');
                  onSelect(country);
                }}
              >
                <div className="dropdown__flag">
                  <FlagIcon
                    code={alpha_2}
                  />
                </div>

                <div className="dropdown__item-name">
                  {!forPhone ? `${name}` : `${phone_code} - ${name}`}
                </div>
              </div>
            )
          })}
      </div>
    </div>
  )
}
