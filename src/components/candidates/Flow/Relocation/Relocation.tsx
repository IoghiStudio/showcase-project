'use client';
import './Relocation.scss';
import { FlowPageName, FlowPageText } from '@/types/FlowPage';
import { FlowContainer } from '../FlowContainer';
import { NextStep, NextStepInfo } from '../NextStep';
import { Switch } from '@/components/utils/Switch';
import { useCallback, useEffect, useState } from 'react';
import { Checkbox } from '@/components/utils/Checkbox';
import { ICountry } from '@/types/Country';
import { AfricaCountriesStore, AsiaCountriesStore, CaribbeanCountriesStore, CentralAmericaCountriesStore, EuropeCountriesStore, NorthAmericaCountriesStore, OceaniaCountriesStore, SouthAmericaCountriesStore } from '@/store/relocationStore';
import { useRecoilState, useSetRecoilState } from 'recoil';
import { IRelocation, getPrivacySettings, getRegionCountries, getRelocationSettings, getSubregionCountries, postPrivacySettings, postRelocationSettings, updatePrivacySettings, updateRelocationSettings } from '@/services/api/relocation.service';
import { AxiosResponse } from 'axios';
import { ResidencyStore } from '@/store/flowPagesData/residencyStore';
import { getResidency } from '@/services/api/residency.service';
import { RegionModal } from '../RegionModal';
import { useRouter } from 'next/navigation';
import classNames from 'classnames';
import { CompanyDataStore } from '@/store/companyDataStore';
import { ICompanyData } from '@/types/CompanyData';
import { getCompanyData } from '@/services/api/authUser.service';

const infoTexts: FlowPageText[] = [
  {
    id: '1',
    text: 'You can select to be visible worldwide or only in the countries or areas which are of great interest to you.'
  },
  {
    id: '2',
    text: 'When you decide what country to select, make sure that you know the working conditions and average pay in that country.'
  },
  {
    id: '3',
    text: 'Also, it is recommended to check if there is a demand for foreign workers in that specific country for your job.'
  },
];

export enum Regions {
  Africa = 'Africa',
  Asia = 'Asia',
  Europe = 'Europe',
  Oceania = 'Oceania',
  CentralAmerica = 'Central America',
  NorthAmerica = 'North America',
  SouthAmerica = 'South America',
  Caribbean = 'Caribbean'
};

enum RegionType {
  Region,
  Subregion,
};

type Props = {
  forSettings?: boolean;
  forCompany?: boolean;
  forPromotion?: boolean;
};

export const Relocation: React.FC<Props> = ({
  forSettings = false,
  forCompany = false,
  forPromotion = false,
}) => {
  const [selectedCountries, setSelectedCountries] = useState<ICountry[]>([]);
  const [onlyResidency, setOnlyResidency] = useState<boolean>(false);
  const [residency, setResidency] = useRecoilState(ResidencyStore);
  const [worldWide, setWorldWide] = useState<boolean>(false);
  const [modalOpen, setModalOpen] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [shouldUpdate, setShouldUpdate] = useState<boolean>(true);
  const [regionName, setRegionName] = useState<string>('');
  const [selectedRegionCountries, setSelectedRegionCountries] = useState<ICountry[]>([]);
  const [companyData, setCompanyData] = useRecoilState(CompanyDataStore);

  const [asiaCountries, setAsiaCountries] = useRecoilState(AsiaCountriesStore);
  const [northCountries, setNorthCountries] = useRecoilState(NorthAmericaCountriesStore);
  const [southCountries, setSouthCountries] = useRecoilState(SouthAmericaCountriesStore);
  const [europeCountries, setEuropeCountries] = useRecoilState(EuropeCountriesStore);
  const [africaCountries, setAfricaCountries] = useRecoilState(AfricaCountriesStore);
  const [centralCountries, setCentralCountries] = useRecoilState(CentralAmericaCountriesStore);
  const [oceaniaCountries, setOceaniaCountries] = useRecoilState(OceaniaCountriesStore);
  const [caribbeanCountries, setCaribbeanCountries] = useRecoilState(CaribbeanCountriesStore);
  const router = useRouter();

  const [asiaCount, setAsiaCount] = useState<number>(0);
  const [africaCount, setAfricaCount] = useState<number>(0);
  const [europeCount, setEuropeCount] = useState<number>(0);
  const [oceaniaCount, setOceaniaCount] = useState<number>(0);
  const [caribbeanCount, setCaribbeanCount] = useState<number>(0);
  const [northCount, setNorthCount] = useState<number>(0);
  const [southCount, setSouthCount] = useState<number>(0);
  const [centralCount, setCentralCount] = useState<number>(0);

  const fetchCompanyData = useCallback(async () => {
    try {
      const resp: AxiosResponse<any, any> = await getCompanyData();
      const companyDataFetched: ICompanyData = resp.data.data.data;
      setCompanyData(companyDataFetched);
      console.log(companyDataFetched);

    } catch (error) {}
  }, []);

  useEffect(() => {
    if (!asiaCountries) return;
    if (!europeCountries) return;
    if (!africaCountries) return;
    if (!oceaniaCountries) return;
    if (!northCountries) return;
    if (!centralCountries) return;
    if (!southCountries) return;
    if (!caribbeanCountries) return;

    if (worldWide && selectedCountries.length === 0) {
      const countriesId = [
        ...asiaCountries,
        ...caribbeanCountries,
        ...oceaniaCountries,
        ...africaCountries,
        ...northCountries,
        ...centralCountries,
        ...southCountries,
        ... europeCountries,
      ];

      setSelectedCountries(countriesId);
    }
  }, [
    asiaCountries,
    caribbeanCountries,
    oceaniaCountries,
    africaCountries,
    northCountries,
    centralCountries,
    southCountries,
    europeCountries,
    worldWide,
  ]);

  useEffect(() => {
    if (worldWide) {
      handleSave();
    }
  }, [worldWide]);

  useEffect(() => {
    if (onlyResidency) {
      handleSave();
    }

    if (!forCompany) {
      if (residency && residency.Country) {
        if (selectedCountries.length === 1) {
          if (selectedCountries[0].country_id === residency.Country.country_id) {
            console.log('tr');
            console.log(selectedCountries);
            setOnlyResidency(true);
          } else {
            setOnlyResidency(false);
          }
        } else if (!selectedCountries.length && !worldWide) {
          setOnlyResidency(true);
        } else {
          setOnlyResidency(false);
        }
      }
    } else {
      if (companyData) {
        if (selectedCountries.length === 1) {
          if (selectedCountries[0].country_id === companyData.Country.country_id) {
            console.log('tr');
            console.log(selectedCountries);
            setOnlyResidency(true);
          } else {
            setOnlyResidency(false);
          }
        } else if (!selectedCountries.length && !worldWide) {
          setOnlyResidency(true);
        } else {
          setOnlyResidency(false);
        }
      }
    }

    if (selectedCountries.length === 236) {
      setWorldWide(true);
    }

    setAsiaCount(selectedCountries.filter(c => c.region === 'Asia').length);
    setCentralCount(selectedCountries.filter(c => c.subregion === 'Central America').length);
    setNorthCount(selectedCountries.filter(c => c.subregion === 'Northern America').length);
    setSouthCount(selectedCountries.filter(c => c.subregion === 'South America').length);
    setCaribbeanCount(selectedCountries.filter(c => c.subregion === 'Caribbean').length);
    setAfricaCount(selectedCountries.filter(c => c.region === 'Africa').length);
    setEuropeCount(selectedCountries.filter(c => c.region === 'Europe').length);
    setOceaniaCount(selectedCountries.filter(c => c.region === 'Oceania').length);
  }, [selectedCountries, residency]);

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
    if (!forCompany) {
      if (!residency) fetchResidency();
    } else {
      if (!companyData) fetchCompanyData();
    }
    fetchRelocationSettings();
  }, []);

  const handleCountryClick = (country: ICountry) => {
    let newCountries: ICountry[];

    if (selectedCountries.some(x => x.country_id === country.country_id)) {
      newCountries = selectedCountries.filter(x => x.country_id !== country.country_id);
      setWorldWide(false);
    } else {
      newCountries = [...selectedCountries, country];
      setOnlyResidency(false);
      if (newCountries.length === 236) setWorldWide(true);
    }

    setSelectedCountries(newCountries);
  };

  const handleRegionClick = useCallback((name: string, regionCountries: ICountry[] | null) => {
    setSelectedRegionCountries(regionCountries || []);
    setRegionName(name);
    setModalOpen(true);
  }, []);

  const closeModal = useCallback(() => {
    setModalOpen(false);
  }, []);

  const handleSelectAll = (state: boolean) => {
    let newCountries: ICountry[] = [];

    newCountries = selectedCountries.filter(x => !selectedRegionCountries.some(rc => rc.country_id === x.country_id));
    //these are the countries without the region countries selected

    if (state) {
      setSelectedCountries(newCountries);
      setWorldWide(false);
    } else {
      setOnlyResidency(false);
      setSelectedCountries([
        ...newCountries,
        ...selectedRegionCountries,
      ])
    }
  };

  const handleWorldWideClick = useCallback((worldwide: boolean) => {
    if (!asiaCountries) return;
    if (!europeCountries) return;
    if (!africaCountries) return;
    if (!oceaniaCountries) return;
    if (!northCountries) return;
    if (!centralCountries) return;
    if (!southCountries) return;
    if (!caribbeanCountries) return;

    if (worldwide) {
      setWorldWide(false);
      setSelectedCountries([]);
      setOnlyResidency(true);
    } else {
      setWorldWide(true);
      setOnlyResidency(false);
      setSelectedCountries([
        ...asiaCountries,
        ...africaCountries,
        ...oceaniaCountries,
        ...europeCountries,
        ...northCountries,
        ...southCountries,
        ...caribbeanCountries,
        ...centralCountries
      ]);
    }
  }, [
    asiaCountries,
    caribbeanCountries,
    oceaniaCountries,
    africaCountries,
    northCountries,
    centralCountries,
    southCountries,
    europeCountries,
  ]);

  const fetchRelocationSettings = useCallback(async () => {
    try {
      if (!forCompany) {
        const resp: AxiosResponse<any, any> = await getRelocationSettings();
        const relocationFetched: IRelocation = resp.data.data.data;
        console.log(relocationFetched);

        if (!Boolean(relocationFetched.worldwide)) {
          setSelectedCountries(relocationFetched.countries || []);
        }

        setWorldWide(Boolean(relocationFetched.worldwide));

        console.log('fetched data', relocationFetched);
      } else {
        const resp: AxiosResponse<any, any> = await getPrivacySettings();
        const relocationFetched: IRelocation = resp.data.data.data;
        console.log(relocationFetched);

        if (!Boolean(relocationFetched.worldwide)) {
          setSelectedCountries(relocationFetched.countries || []);
        }

        setWorldWide(Boolean(relocationFetched.worldwide));

        console.log('fetched data', relocationFetched);
      }
    } catch (error) {
      setShouldUpdate(false);
    }
  }, []);

  const fetchResidency = useCallback(async () => {
    try {
      const resp: AxiosResponse<any, any> = await getResidency();
      setResidency(resp.data.data.data);
    } catch (error) {}
  }, []);

  const handleSave = useCallback(async () => {
    const data: IRelocation = {
      countryIds: selectedCountries.map(x => x.country_id),
      worldwide: worldWide ? 1 : 0,
      name: 'relocation extra usefull key!'
    };

    if (!selectedCountries.length && !worldWide) {
      if (!forCompany) {
        if (residency && residency.Country) {
          data.countryIds = [
            residency.Country.country_id
          ];
        }
      } else {
        if (companyData) {
          data.countryIds = [
            companyData.Country.country_id
          ];
        }
      }
    }

    console.log('data before sending', data);

    try {
      setIsLoading(true);
      if (!forCompany) {
        if (!shouldUpdate) {
          console.log('add');
          const resp = await postRelocationSettings(data);
          console.log('resp add', resp.data.data.data);
          setShouldUpdate(true);
        } else {
          console.log('update');
          const resp = await updateRelocationSettings(data);
          console.log('resp update', resp.data.data.data);
        }
      } else {
        if (!shouldUpdate) {
          console.log('add');
          const resp = await postPrivacySettings(data);
          console.log('resp add', resp.data.data.data);
          setShouldUpdate(true);
        } else {
          console.log('update');
          const resp = await updatePrivacySettings(data);
          console.log('resp update', resp.data.data.data);
        }
      }
      setModalOpen(false);
      setIsLoading(false);
    } catch (error) {
      setIsLoading(false);
    }
  }, [selectedCountries, worldWide, shouldUpdate, onlyResidency]);

  return (
    <>
      {!forSettings ? (
        <FlowContainer
          title={'RELOCATION SETTINGS'}
          text={'Select the areas and countries are you willing to relocate and work in. The more areas and countries you select, the more chances are to get job offers from companies.'}
          pageName={FlowPageName.Relocation}
          infoTexts={infoTexts}
        >
          <div className="relocation">
            <div className="relocation__content">
              <div className="relocation__header">
                <div className="relocation__title">
                  GEOGRAPHIC REGIONS
                </div>

                <div className="relocation__world-wide">
                  <div className="relocation__world-wide-text">
                    Worldwide
                  </div>

                  <div onClick={() => handleWorldWideClick(worldWide)} className="relocation__switch">
                    <Switch isOpen={worldWide} />
                  </div>
                </div>
              </div>

              <div className="relocation__columns">
                <div className="relocation__column">
                  <div className="relocation__region">
                    <Checkbox
                      checked={worldWide || africaCount > 0}
                      onClick={() => {
                        handleRegionClick(Regions.Africa, africaCountries);
                      }}
                    />

                    <div className="relocation__region-name">
                      {Regions.Africa}
                    </div>

                    {worldWide && (
                      <div className="relocation__region-name relocation__region-name--italic">
                        {`(${africaCountries?.length} countries selected)`}
                      </div>
                    )}

                    {!worldWide && africaCount > 0 && (
                      <div className="relocation__region-name relocation__region-name--italic">
                        {`(${africaCount} countries selected)`}
                      </div>
                    )}
                  </div>

                  <div className="relocation__region">
                    <Checkbox
                      checked={worldWide || caribbeanCount > 0}
                      onClick={() => {
                        handleRegionClick(Regions.Caribbean, caribbeanCountries);
                      }}
                    />

                    <div className="relocation__region-name">
                      {Regions.Caribbean}
                    </div>

                    {worldWide && (
                      <div className="relocation__region-name relocation__region-name--italic">
                        {`(${caribbeanCountries?.length} countries selected)`}
                      </div>
                    )}

                    {!worldWide && caribbeanCount > 0 && (
                      <div className="relocation__region-name relocation__region-name--italic">
                        {`(${caribbeanCount} countries selected)`}
                      </div>
                    )}
                  </div>

                  <div className="relocation__region">
                    <Checkbox
                      checked={worldWide || europeCount > 0}
                      onClick={() => {
                        handleRegionClick(Regions.Europe, europeCountries);
                      }}
                    />

                    <div className="relocation__region-name">
                      {Regions.Europe}
                    </div>

                    {worldWide && (
                      <div className="relocation__region-name relocation__region-name--italic">
                        {`(${europeCountries?.length} countries selected)`}
                      </div>
                    )}

                    {!worldWide && europeCount > 0 && (
                      <div className="relocation__region-name relocation__region-name--italic">
                        {`(${europeCount} countries selected)`}
                      </div>
                    )}
                  </div>

                  <div className="relocation__region">
                    <Checkbox
                      checked={worldWide || oceaniaCount > 0}
                      onClick={() => {
                        handleRegionClick(Regions.Oceania, oceaniaCountries);
                      }}
                    />

                    <div className="relocation__region-name">
                      {Regions.Oceania}
                    </div>

                    {worldWide && (
                      <div className="relocation__region-name relocation__region-name--italic">
                        {`(${oceaniaCountries?.length} countries selected)`}
                      </div>
                    )}

                    {!worldWide && oceaniaCount > 0 && (
                      <div className="relocation__region-name relocation__region-name--italic">
                        {`(${oceaniaCount} countries selected)`}
                      </div>
                    )}
                  </div>
                </div>

                <div className="relocation__column">
                  <div className="relocation__region">
                    <Checkbox
                      checked={worldWide || asiaCount > 0}
                      onClick={() => {
                        handleRegionClick(Regions.Asia, asiaCountries);
                      }}
                    />

                    <div className="relocation__region-name">
                      {Regions.Asia}
                    </div>

                    {worldWide && (
                      <div className="relocation__region-name relocation__region-name--italic">
                        {`(${asiaCountries?.length} countries selected)`}
                      </div>
                    )}

                    {!worldWide && asiaCount > 0 && (
                      <div className="relocation__region-name relocation__region-name--italic">
                        {`(${asiaCount} countries selected)`}
                      </div>
                    )}
                  </div>

                  <div className="relocation__region">
                    <Checkbox
                      checked={worldWide || northCount > 0}
                      onClick={() => {
                        handleRegionClick(Regions.NorthAmerica, northCountries);
                      }}
                    />

                    <div className="relocation__region-name">
                      {Regions.NorthAmerica}
                    </div>

                    {worldWide && (
                      <div className="relocation__region-name relocation__region-name--italic">
                        {`(${northCountries?.length} countries selected)`}
                      </div>
                    )}

                    {!worldWide && northCount > 0 && (
                      <div className="relocation__region-name relocation__region-name--italic">
                        {`(${northCount} countries selected)`}
                      </div>
                    )}
                  </div>

                  <div className="relocation__region">
                    <Checkbox
                      checked={worldWide || centralCount > 0}
                      onClick={() => {
                        handleRegionClick(Regions.CentralAmerica, centralCountries);
                      }}
                    />

                    <div className="relocation__region-name">
                      {Regions.CentralAmerica}
                    </div>

                    {worldWide && (
                      <div className="relocation__region-name relocation__region-name--italic">
                        {`(${centralCountries?.length} countries selected)`}
                      </div>
                    )}

                    {!worldWide && centralCount > 0 && (
                      <div className="relocation__region-name relocation__region-name--italic">
                        {`(${centralCount} countries selected)`}
                      </div>
                    )}
                  </div>

                  <div className="relocation__region">
                    <Checkbox
                      checked={worldWide || southCount > 0}
                      onClick={() => {
                        handleRegionClick(Regions.SouthAmerica, southCountries);
                      }}
                    />

                    <div className="relocation__region-name">
                      {Regions.SouthAmerica}
                    </div>

                    {worldWide && (
                      <div className="relocation__region-name relocation__region-name--italic">
                        {`(${southCountries?.length} countries selected)`}
                      </div>
                    )}

                    {!worldWide && southCount > 0 && (
                      <div className="relocation__region-name relocation__region-name--italic">
                        {`(${southCount} countries selected)`}
                      </div>
                    )}
                  </div>
                </div>
              </div>

              <div className="relocation__only-residency relocation__region">
                <Checkbox
                  checked={onlyResidency}
                  onClick={() => {
                    if (onlyResidency) {
                      setWorldWide(true);
                      setOnlyResidency(false);
                    } else {
                      setOnlyResidency(true);
                      setSelectedCountries([]);
                      setWorldWide(false);
                    }
                  }}
                />

                <div className="relocation__region-name">
                  I don’t want to relocate. Only current residency will be selected.
                </div>
              </div>
            </div>

            {modalOpen && (
              <div className="relocation__modal">
                <RegionModal
                  onSave={handleSave}
                  onSelectAll={handleSelectAll}
                  isLoading={isLoading}
                  selectedCountries={selectedCountries}
                  onCountryClick={handleCountryClick}
                  regionName={regionName}
                  selectedRegionCountries={selectedRegionCountries}
                  closeModal={closeModal}
                />
              </div>
            )}

            <div className="relocation__bottom">
              <NextStep
                nextStep={NextStepInfo.About}
                onClick={() => {
                  handleSave();
                  router.push('/candidates/steps/about/');
                }}
              />
            </div>
          </div>
        </FlowContainer>
      ) : (
        <div className="container relocation">
          <div className="relocation__content relocation__content--settings">
            <div className={classNames("relocation__header relocation__header--settings", {
              "relocation__header--promotion": forPromotion
            })}>
              <div className="relocation__header-left">
                <div className="container__title">
                  {!forPromotion ? (
                    'Visibility by country'
                  ) : (
                    'Promote in countries'
                  )}
                </div>

                <div className="container__text">
                  {!forPromotion ? (
                    'Countries in which your profile will be visible'
                  ) : (
                    'Where your job listings are available'
                  )}
                </div>
              </div>

              <div className={classNames("relocation__world-wide relocation__world-wide--settings", {
                "relocation__world-wide--promotion": forPromotion
              })}>
                <div className="relocation__world-wide-text">
                  Worldwide
                </div>

                <div onClick={() => handleWorldWideClick(worldWide)} className="relocation__switch">
                  <Switch isOpen={worldWide} />
                </div>
              </div>
            </div>

            <div className="relocation__column-settings">
              {forPromotion && (
                <div className="relocation__only-residency relocation__item">
                  <div className="relocation__item-info">
                    <Checkbox
                      checked={onlyResidency}
                      onClick={() => {
                        if (onlyResidency) {
                          setWorldWide(true);
                          setOnlyResidency(false);
                        } else {
                          setOnlyResidency(true);
                          setSelectedCountries([]);
                          setWorldWide(false);
                        }
                      }}
                    />

                    <div className="relocation__item-column">
                      <div className="relocation__item-title">
                        Only job location country.
                      </div>

                      <div className={classNames("relocation__item-text relocation__item-text--italic", {
                        "relocation__item-text": onlyResidency
                      })}>
                        {`Only for ${companyData?.Country.name} residents`}
                      </div>
                    </div>
                  </div>

                  {onlyResidency ? (
                    <div className="relocation__status">
                      Visible
                    </div>
                  ) : (
                    <div className="relocation__status relocation__status--disabled">
                      Not visible
                    </div>
                  )}
                </div>
              )}

              <div className="relocation__item">
                <div className="relocation__item-info">
                  <Checkbox
                    checked={worldWide || africaCount > 0}
                    onClick={() => {
                      handleRegionClick(Regions.Africa, africaCountries);
                    }}
                  />

                  <div className="relocation__item-column">
                    <div className="relocation__item-title">
                      {Regions.Africa}
                    </div>

                      {worldWide && (
                        <div className="relocation__item-text">
                          {`${africaCountries?.length} countries selected`}
                        </div>
                      )}

                      {!worldWide && africaCount > 0 && (
                        <div className="relocation__item-text">
                          {`${africaCount} countries selected`}
                        </div>
                      )}

                      {!worldWide && africaCount < 1 && (
                        <div className="relocation__item-text relocation__item-text--italic">
                          {`No countries selected`}
                        </div>
                      )}
                  </div>
                </div>

                {africaCount ? (
                  <div className="relocation__status">
                    Visible
                  </div>
                ) : (
                  <div className="relocation__status relocation__status--disabled">
                    Not visible
                  </div>
                )}
              </div>

              <div className="relocation__item">
                <div className="relocation__item-info">
                  <Checkbox
                    checked={worldWide || caribbeanCount > 0}
                    onClick={() => {
                      handleRegionClick(Regions.Caribbean, caribbeanCountries);
                    }}
                  />

                  <div className="relocation__item-column">
                    <div className="relocation__item-title">
                      {Regions.Caribbean}
                    </div>

                    {worldWide && (
                      <div className="relocation__item-text">
                        {`${caribbeanCountries?.length} countries selected`}
                      </div>
                    )}

                    {!worldWide && caribbeanCount > 0 && (
                      <div className="relocation__item-text">
                        {`${caribbeanCount} countries selected`}
                      </div>
                    )}

                    {!worldWide && caribbeanCount < 1 && (
                      <div className="relocation__item-text relocation__item-text--italic">
                        {`No countries selected`}
                      </div>
                    )}
                  </div>
                </div>

                {caribbeanCount ? (
                  <div className="relocation__status">
                    Visible
                  </div>
                ) : (
                  <div className="relocation__status relocation__status--disabled">
                    Not visible
                  </div>
                )}
              </div>

              <div className="relocation__item">
                <div className="relocation__item-info">
                  <Checkbox
                    checked={worldWide || europeCount > 0}
                    onClick={() => {
                      handleRegionClick(Regions.Europe, europeCountries);
                    }}
                  />

                  <div className="relocation__item-column">
                    <div className="relocation__item-title">
                      {Regions.Europe}
                    </div>

                    {worldWide && (
                      <div className="relocation__item-text">
                        {`${europeCountries?.length} countries selected`}
                      </div>
                    )}

                    {!worldWide && europeCount > 0 && (
                      <div className="relocation__item-text">
                        {`${europeCount} countries selected`}
                      </div>
                    )}

                    {!worldWide && europeCount < 1 && (
                      <div className="relocation__item-text relocation__item-text--italic">
                        {`No countries selected`}
                      </div>
                    )}
                  </div>
                </div>

                {europeCount ? (
                  <div className="relocation__status">
                    Visible
                  </div>
                ) : (
                  <div className="relocation__status relocation__status--disabled">
                    Not visible
                  </div>
                )}
              </div>

              <div className="relocation__item">
                <div className="relocation__item-info">
                  <Checkbox
                    checked={worldWide || oceaniaCount > 0}
                    onClick={() => {
                      handleRegionClick(Regions.Oceania, oceaniaCountries);
                    }}
                  />

                  <div className="relocation__item-column">
                    <div className="relocation__item-title">
                      {Regions.Oceania}
                    </div>

                    {worldWide && (
                      <div className="relocation__item-text">
                        {`${oceaniaCountries?.length} countries selected`}
                      </div>
                    )}

                    {!worldWide && oceaniaCount > 0 && (
                      <div className="relocation__item-text">
                        {`${oceaniaCount} countries selected`}
                      </div>
                    )}

                    {!worldWide && oceaniaCount < 1 && (
                      <div className="relocation__item-text relocation__item-text--italic">
                        {`No countries selected`}
                      </div>
                    )}
                  </div>
                </div>

                {oceaniaCount ? (
                  <div className="relocation__status">
                    Visible
                  </div>
                ) : (
                  <div className="relocation__status relocation__status--disabled">
                    Not visible
                  </div>
                )}
              </div>

              <div className="relocation__item">
                <div className="relocation__item-info">
                  <Checkbox
                    checked={worldWide || asiaCount > 0}
                    onClick={() => {
                      handleRegionClick(Regions.Asia, asiaCountries);
                    }}
                  />

                  <div className="relocation__item-column">
                    <div className="relocation__item-title">
                      {Regions.Asia}
                    </div>

                    {worldWide && (
                      <div className="relocation__item-text">
                        {`${asiaCountries?.length} countries selected`}
                      </div>
                    )}

                    {!worldWide && asiaCount > 0 && (
                      <div className="relocation__item-text">
                        {`${asiaCount} countries selected`}
                      </div>
                    )}

                    {!worldWide && asiaCount < 1 && (
                      <div className="relocation__item-text relocation__item-text--italic">
                        {`No countries selected`}
                      </div>
                    )}
                  </div>
                </div>

                {asiaCount ? (
                  <div className="relocation__status">
                    Visible
                  </div>
                ) : (
                  <div className="relocation__status relocation__status--disabled">
                    Not visible
                  </div>
                )}
              </div>

              <div className="relocation__item">
                <div className="relocation__item-info">
                  <Checkbox
                    checked={worldWide || northCount > 0}
                    onClick={() => {
                      handleRegionClick(Regions.NorthAmerica, northCountries);
                    }}
                  />

                  <div className="relocation__item-column">
                    <div className="relocation__item-title">
                      {Regions.NorthAmerica}
                    </div>

                    {worldWide && (
                      <div className="relocation__item-text">
                        {`${northCountries?.length} countries selected`}
                      </div>
                    )}

                    {!worldWide && northCount > 0 && (
                      <div className="relocation__item-text">
                        {`${northCount} countries selected`}
                      </div>
                    )}

                    {!worldWide && northCount < 1 && (
                      <div className="relocation__item-text relocation__item-text--italic">
                        {`No countries selected`}
                      </div>
                    )}
                  </div>
                </div>

                {northCount ? (
                  <div className="relocation__status">
                    Visible
                  </div>
                ) : (
                  <div className="relocation__status relocation__status--disabled">
                    Not visible
                  </div>
                )}
              </div>

              <div className="relocation__item">
                <div className="relocation__item-info">
                  <Checkbox
                    checked={worldWide || centralCount > 0}
                    onClick={() => {
                      handleRegionClick(Regions.CentralAmerica, centralCountries);
                    }}
                  />

                  <div className="relocation__item-column">
                    <div className="relocation__item-title">
                      {Regions.CentralAmerica}
                    </div>

                    {worldWide && (
                      <div className="relocation__item-text">
                        {`${centralCountries?.length} countries selected`}
                      </div>
                    )}

                    {!worldWide && centralCount > 0 && (
                      <div className="relocation__item-text">
                        {`${centralCount} countries selected`}
                      </div>
                    )}

                    {!worldWide && centralCount < 1 && (
                      <div className="relocation__item-text relocation__item-text--italic">
                        {`No countries selected`}
                      </div>
                    )}
                  </div>
                </div>

                {centralCount ? (
                  <div className="relocation__status">
                    Visible
                  </div>
                ) : (
                  <div className="relocation__status relocation__status--disabled">
                    Not visible
                  </div>
                )}
              </div>

              <div className="relocation__item">
                <div className="relocation__item-info">
                  <Checkbox
                    checked={worldWide || southCount > 0}
                    onClick={() => {
                      handleRegionClick(Regions.SouthAmerica, southCountries);
                    }}
                  />

                  <div className="relocation__item-column">
                    <div className="relocation__item-title">
                      {Regions.SouthAmerica}
                    </div>

                    {worldWide && (
                      <div className="relocation__item-text">
                        {`${southCountries?.length} countries selected`}
                      </div>
                    )}

                    {!worldWide && southCount > 0 && (
                      <div className="relocation__item-text">
                        {`${southCount} countries selected`}
                      </div>
                    )}

                    {!worldWide && southCount < 1 && (
                      <div className="relocation__item-text relocation__item-text--italic">
                        {`No countries selected`}
                      </div>
                    )}
                  </div>
                </div>

                {southCount ? (
                  <div className="relocation__status">
                    Visible
                  </div>
                ) : (
                  <div className="relocation__status relocation__status--disabled">
                    Not visible
                  </div>
                )}
              </div>

              {!forPromotion && (
                <div className="relocation__only-residency relocation__item">
                  <div className="relocation__item-info">
                    <Checkbox
                      checked={onlyResidency}
                      onClick={() => {
                        if (onlyResidency) {
                          setWorldWide(true);
                          setOnlyResidency(false);
                        } else {
                          setOnlyResidency(true);
                          setSelectedCountries([]);
                          setWorldWide(false);
                        }
                      }}
                    />

                    <div className="relocation__item-column">
                      <div className="relocation__item-title">
                        I don’t want to relocate.
                      </div>

                      <div className={classNames("relocation__item-text relocation__item-text--italic", {
                        "relocation__item-text": onlyResidency
                      })}>
                        Only current residency will be selected.
                      </div>
                    </div>
                  </div>

                  {onlyResidency ? (
                    <div className="relocation__status">
                      Visible
                    </div>
                  ) : (
                    <div className="relocation__status relocation__status--disabled">
                      Not visible
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>

          {modalOpen && (
            <div className="relocation__modal">
              <RegionModal
                onSave={handleSave}
                onSelectAll={handleSelectAll}
                isLoading={isLoading}
                selectedCountries={selectedCountries}
                onCountryClick={handleCountryClick}
                regionName={regionName}
                selectedRegionCountries={selectedRegionCountries}
                closeModal={closeModal}
              />
            </div>
          )}
        </div>
      )}
    </>
  )
}
