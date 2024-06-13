'use client';
import '../Dropdown.scss';
import classNames from 'classnames';
import { useCallback, useEffect, useState } from 'react';
import { AxiosResponse } from 'axios';
import { getJobTitles } from '@/services/api/dropdownsData.service';
import { useRecoilState } from 'recoil';
import { JobTitlesStore } from '@/store/dropdownsDataStore';
import { IJobTitle } from '@/types/JobTitle';

type Props = {
  isOpen: boolean;
  onSelect: (jobTitle: IJobTitle) => void;
};

export const JobTitleDropdown: React.FC<Props> = ({
  isOpen,
  onSelect,
}) => {
  const [query, setQuery] = useState<string>('');
  const [jobTitles, setJobTitles] = useRecoilState(JobTitlesStore);

  const fetchJobTitle = useCallback(async () => {
    try {
      const resp: AxiosResponse<any, any> = await getJobTitles();
      const jobTitlesFetched: IJobTitle[] = resp.data.data.data;

      setJobTitles(jobTitlesFetched);
    } catch (error) {}
  }, []);

  useEffect(() => {
    if (!jobTitles) fetchJobTitle();
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
        {jobTitles && jobTitles
          .filter((jobTitle) =>
            jobTitle.name.toLowerCase().includes(query)
          )
          .map((jobTitle) => {
            const { job_title_id, name } = jobTitle;

            return (
              <div
                key={job_title_id}
                className="dropdown__item"
                onClick={() => {
                  setQuery('');
                  onSelect(jobTitle);
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
