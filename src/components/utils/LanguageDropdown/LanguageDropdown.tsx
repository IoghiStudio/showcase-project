'use client';
import '../Dropdown.scss';
import classNames from 'classnames';
import { useCallback, useEffect, useState } from 'react';
import { AxiosResponse } from 'axios';
import { getIndustries, getLanguages } from '@/services/api/dropdownsData.service';
import { useRecoilState } from 'recoil';
import { ILanguage } from '@/types/Language';
import { LanguagesStore } from '@/store/dropdownsDataStore';
import { IUserLanguage } from '@/services/api/userDriving.service';
import { UserLanguagesStore } from '@/store/flowPagesData/userLanguagesStore';
import { getUserLanguages } from '@/services/api/userLanguages.service';

type Props = {
  isOpen: boolean;
  onSelect: (language: ILanguage) => void;
  forCompany?: boolean;
};

export const LanguageDropdown: React.FC<Props> = ({
  isOpen,
  onSelect,
  forCompany = false,
}) => {
  const [query, setQuery] = useState<string>('');
  const [userLanguages, setUserLanguages] = useRecoilState(UserLanguagesStore);
  const [languages, setLanguages] = useRecoilState(LanguagesStore);
  const [allLanguages, setAllLanguages] = useRecoilState(LanguagesStore);

  const fetchUserLanguages = useCallback(async () => {
    try {
      const resp: AxiosResponse<any, any> = await getUserLanguages();
      const data: IUserLanguage[] = resp.data.data.data;
      setUserLanguages(data);
    } catch (error) {}
  }, []);

  const fetchLanguages = useCallback(async () => {
    try {
      const resp: AxiosResponse<any, any> = await getLanguages();
      const fetchedLanguages: ILanguage[] = resp.data.data.data;
      const newLanguagesOnly: ILanguage[] = fetchedLanguages.filter(lang => !userLanguages?.some(lg => lang.language_id === lg.Language?.language_id));
      setLanguages(newLanguagesOnly);
    } catch (error) {}
  }, [userLanguages]);

  const fetchAllLanguages = useCallback(async () => {
    try {
      const resp: AxiosResponse<any, any> = await getLanguages();
      const fetchedLanguages: ILanguage[] = resp.data.data.data;
      setAllLanguages(fetchedLanguages);
    } catch (error) {}
  }, [userLanguages]);

  useEffect(() => {
    setUserLanguages(null);
  }, []);

  useEffect(() => {
    if (!forCompany) {
      if (!userLanguages) fetchUserLanguages();
      else fetchLanguages();
    } else {
      fetchAllLanguages();
    }
  }, [userLanguages]);

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

      {!forCompany ? (
      <div className="dropdown__list">
        {languages && languages
          .filter((language) =>
            language.name.toLowerCase().includes(query)
          )
          .map((language) => {
            const { language_id, name } = language;

            return (
              <div
                key={language_id}
                className="dropdown__item"
                onClick={() => {
                  setQuery('');
                  onSelect(language);
                }}
              >
                <div className="dropdown__item-name">
                  {name}
                </div>
              </div>
            )
          })}
      </div>
      ) : (
      <div className="dropdown__list">
        {allLanguages && allLanguages
          .filter((language) =>
            language.name.toLowerCase().includes(query)
          )
          .map((language) => {
            const { language_id, name } = language;

            return (
              <div
                key={language_id}
                className="dropdown__item"
                onClick={() => {
                  setQuery('');
                  onSelect(language);
                }}
              >
                <div className="dropdown__item-name">
                  {name}
                </div>
              </div>
            )
          })}
      </div>
      )}
    </div>
  )
}
