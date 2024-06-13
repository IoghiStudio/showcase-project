'use client';
import '../Dropdown.scss';
import classNames from 'classnames';
import { useCallback, useEffect, useState } from 'react';
import { AxiosResponse } from 'axios';
import { getIndustries } from '@/services/api/dropdownsData.service';
import { useRecoilState } from 'recoil';
import { IndustriesStore } from '@/store/dropdownsDataStore';
import { IIndustrySubcategory } from '@/types/Industry';

type Props = {
  isOpen: boolean;
  onSelect: (industry: IIndustrySubcategory) => void;
};

export const IndustryDropdown: React.FC<Props> = ({
  isOpen,
  onSelect,
}) => {
  const [query, setQuery] = useState<string>('');
  const [industries, setIndustries] = useRecoilState(IndustriesStore);

  const fetchIndustries = useCallback(async () => {
    try {
      const resp: AxiosResponse<any, any> = await getIndustries();
      const industriesFetched: IIndustrySubcategory[] = resp.data.data.data;
      const defaultOne = industriesFetched.find(ind => ind.name === 'Not Specified');
      console.log(defaultOne);
      industriesFetched.sort((a, b) => {
        if (a === defaultOne) return -1;
        if (b === defaultOne) return 1;
        return 0;
      });

      setIndustries(industriesFetched);
    } catch (error) {}
  }, []);

  useEffect(() => {
    if (!industries) fetchIndustries();
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
        {industries && industries
          .filter((industry) =>
            industry.name.toLowerCase().includes(query)
          )
          .map((industry) => {
            const { industry_subcategory_id, name } = industry;

            return (
              <div
                key={industry_subcategory_id}
                className="dropdown__item"
                onClick={() => {
                  setQuery('');
                  onSelect(industry);
                }}
              >
                <div className="dropdown__item-name">
                  {name}
                </div>
              </div>
            )
          })}
      </div>
    </div>
  )
}
