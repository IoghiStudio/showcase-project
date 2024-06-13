'use client';
import { FC, useCallback, useEffect, useState } from 'react';
import './RegionModal.scss';
import { Button } from '@/components/utils/Button';
import { ButtonColor } from '@/types/ButtonColor';
import { Switch } from '@/components/utils/Switch';
import { ICountry } from '@/types/Country';
import { useRecoilState } from 'recoil';
import { AxiosResponse } from 'axios';
import { getRegionCountries, getSubregionCountries } from '@/services/api/relocation.service';
import { AfricaCountriesStore, AsiaCountriesStore, CaribbeanCountriesStore, CentralAmericaCountriesStore, EuropeCountriesStore, NorthAmericaCountriesStore, OceaniaCountriesStore, SouthAmericaCountriesStore } from '@/store/relocationStore';
import { FlagIcon } from '@/components/utils/FlagIcon';
import { Checkbox } from '@/components/utils/Checkbox';
import classNames from 'classnames';

type Props = {
  onSave: () => void;
  onSelectAll: (state: boolean) => void;
  isLoading?: boolean;
  onCountryClick: (country: ICountry) => void;
  selectedCountries: ICountry[];
  regionName: string;
  selectedRegionCountries: ICountry[];
  closeModal: () => void;
};

export const RegionModal: FC<Props> = ({
  onSave,
  onSelectAll,
  isLoading = false,
  onCountryClick,
  selectedCountries,
  regionName,
  selectedRegionCountries,
  closeModal,
}) => {
  const [asiaCountries, setAsiaCountries] = useRecoilState(AsiaCountriesStore);
  const [northCountries, setNorthCountries] = useRecoilState(NorthAmericaCountriesStore);
  const [southCountries, setSouthCountries] = useRecoilState(SouthAmericaCountriesStore);
  const [europeCountries, setEuropeCountries] = useRecoilState(EuropeCountriesStore);
  const [africaCountries, setAfricaCountries] = useRecoilState(AfricaCountriesStore);
  const [centralCountries, setCentralCountries] = useRecoilState(CentralAmericaCountriesStore);
  const [oceaniaCountries, setOceaniaCountries] = useRecoilState(OceaniaCountriesStore);
  const [caribbeanCountries, setCaribbeanCountries] = useRecoilState(CaribbeanCountriesStore);

  const [shouldUpdate, setShouldUpdate] = useState<boolean>(false);
  const [allSelected, setAllSelected] = useState<boolean>(false);

  useEffect(() => {
    setAllSelected(Boolean(selectedRegionCountries?.every(rc => selectedCountries.some(c => c.country_id === rc.country_id))));
  }, [selectedCountries]);

  const fetchAsiaCountries = useCallback(async () => {
    try {
      const resp: AxiosResponse<any, any> = await getRegionCountries('Asia');
      const countries: ICountry[] = resp.data.data.data;
      setAsiaCountries(countries);
    } catch (error) {}
  }, []);

  const fetchEuropeCountries = useCallback(async () => {
    try {
      const resp: AxiosResponse<any, any> = await getRegionCountries('Europe');
      const countries: ICountry[] = resp.data.data.data;
      setEuropeCountries(countries);
    } catch (error) {}
  }, []);

  const fetchAfricaCountries = useCallback(async () => {
    try {
      const resp: AxiosResponse<any, any> = await getRegionCountries('Africa');
      const countries: ICountry[] = resp.data.data.data;
      setAfricaCountries(countries);
    } catch (error) {}
  }, []);

  const fetchOceaniaCountries = useCallback(async () => {
    try {
      const resp: AxiosResponse<any, any> = await getRegionCountries('Oceania');
      const countries: ICountry[] = resp.data.data.data;
      setOceaniaCountries(countries);
    } catch (error) {}
  }, []);

  const fetchNorthCountries = useCallback(async () => {
    try {
      const resp: AxiosResponse<any, any> = await getSubregionCountries('Northern America');
      const countries: ICountry[] = resp.data.data.data;
      setNorthCountries(countries);
    } catch (error) {}
  }, []);

  const fetchCentralCountries = useCallback(async () => {
    try {
      const resp: AxiosResponse<any, any> = await getSubregionCountries('Central America');
      const countries: ICountry[] = resp.data.data.data;
      setCentralCountries(countries);
    } catch (error) {}
  }, []);

  const fetchSouthCountries = useCallback(async () => {
    try {
      const resp: AxiosResponse<any, any> = await getSubregionCountries('South America');
      const countries: ICountry[] = resp.data.data.data;
      setSouthCountries(countries);
    } catch (error) {}
  }, []);

  const fetchCaribbeanCountries = useCallback(async () => {
    try {
      const resp: AxiosResponse<any, any> = await getSubregionCountries('Caribbean');
      const countries: ICountry[] = resp.data.data.data;
      setCaribbeanCountries(countries);
    } catch (error) {}
  }, []);

  useEffect(() => {
    if (!asiaCountries) fetchAsiaCountries();
    if (!europeCountries) fetchEuropeCountries();
    if (!africaCountries) fetchAfricaCountries();
    if (!oceaniaCountries) fetchOceaniaCountries();
    if (!northCountries) fetchNorthCountries();
    if (!centralCountries) fetchCentralCountries();
    if (!southCountries) fetchSouthCountries();
    if (!caribbeanCountries) fetchCaribbeanCountries();
  }, []);

  return (
    <div className="region-modal">
      <div className="region-modal__top">
        <div className="region-modal__info">
          <div className="region-modal__title">
            {regionName}
          </div>

          <div className="region-modal__text">
            Select countries in wich you are willing to work and relocate.
          </div>
        </div>

        <div className="region-modal__select-all">
          <div className="region-modal__select-all-text">
            {`All ${regionName}`}
          </div>

          <div
            onClick={() => {
              onSelectAll(allSelected);
              setShouldUpdate(true);
            }}
            className="region-modal__select-all-switch"
          >
            <Switch
              isOpen={allSelected}
            />
          </div>
        </div>
      </div>

      <div className="region-modal__countries">
        {selectedRegionCountries.map(country => {
          const {
            country_id,
            alpha_2,
            name,
          } = country;

          return (
            <div
              key={country_id}
              className={classNames("region-modal__country", {
                "region-modal__country--selected": selectedCountries.some(c => c.country_id === country_id),
              })}
              onClick={() => {
                onCountryClick(country);
                setShouldUpdate(true);
              }}
            >
              <div className="region-modal__country-left">
                <div className="region-modal__flag">
                  <FlagIcon code={alpha_2} />
                </div>

                <div className="region-modal__country-name">
                  {name}
                </div>
              </div>

              <div className="region-modal__checkbox">
                <Checkbox
                  checked={selectedCountries.some(c => c.country_id === country_id)}
                  onClick={() => {}}
                />
              </div>
            </div>
          )
        })}
      </div>

      <div className="region-modal__bottom">
        <div className="region-modal__button">
          <Button
            color={ButtonColor.Green}
            onClick={() => {
              if (shouldUpdate) {
                onSave();
                return;
              }

              closeModal();
            }}
            loading={isLoading}
          >
            Save
          </Button>
        </div>
      </div>
    </div>
  )
}
