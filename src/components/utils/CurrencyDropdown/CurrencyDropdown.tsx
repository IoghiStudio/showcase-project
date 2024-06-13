'use client';
import '../Dropdown.scss';
import classNames from 'classnames';
import { useCallback, useEffect, useState } from 'react';
import { AxiosResponse } from 'axios';
import { getCurrencies } from '@/services/api/dropdownsData.service';
import { useRecoilState } from 'recoil';
import { ICurrency } from '@/types/Currency';
import { CurrenciesStore } from '@/store/dropdownsDataStore';

type Props = {
  isOpen: boolean;
  onSelect: (currency: ICurrency) => void;
};

export const CurrencyDropdown: React.FC<Props> = ({
  isOpen,
  onSelect,
}) => {
  const [query, setQuery] = useState<string>('');
  const [currencies, setCurrencies] = useRecoilState(CurrenciesStore);

  const fetchCurrncies = useCallback(async () => {
    try {
      const resp: AxiosResponse<any, any> = await getCurrencies();
      setCurrencies(resp.data.data.data);
    } catch (error) {}
  }, []);

  useEffect(() => {
    if (!currencies) fetchCurrncies();
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
        {currencies && currencies
          .filter((currency) =>
            currency.code.toLowerCase().includes(query)
          )
          .map((currency) => {
            const { code, name } = currency;

            return (
              <div
                key={code}
                className="dropdown__item"
                onClick={() => {
                  setQuery('');
                  onSelect(currency);
                }}
              >
                <div className="dropdown__item-name">
                  {`${code} - ${name}`}
                </div>
              </div>
            )
          })}
      </div>
    </div>
  )
}
