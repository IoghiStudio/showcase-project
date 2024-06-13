'use client';
import '../Dropdown.scss';
import classNames from 'classnames';
import { useCallback, useEffect, useState } from 'react';
import { AxiosResponse } from 'axios';
import { getDrivingLicense } from '@/services/api/dropdownsData.service';
import { useRecoilState } from 'recoil';
import { DrivingStore} from '@/store/dropdownsDataStore';

type Props = {
  isOpen: boolean;
  onSelect: (license: string) => void;
};

export const DrivingDropdown: React.FC<Props> = ({
  isOpen,
  onSelect,
}) => {
  const [query, setQuery] = useState<string>('');
  const [drivingLicenses, setDrivingLicenses] = useRecoilState(DrivingStore);

  const fetchLicenses = useCallback(async () => {
    try {
      const resp: AxiosResponse<any, any> = await getDrivingLicense();
      setDrivingLicenses(resp.data.data.data);
    } catch (error) {}
  }, []);

  useEffect(() => {
    if (!drivingLicenses) fetchLicenses();
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
        {drivingLicenses && drivingLicenses
          .map((license) => {
            const { driving_licence_category_id, name } = license;

            return (
              <div
                key={driving_licence_category_id}
                className="dropdown__item"
                onClick={() => {
                  setQuery('');
                  onSelect(license.name);
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
