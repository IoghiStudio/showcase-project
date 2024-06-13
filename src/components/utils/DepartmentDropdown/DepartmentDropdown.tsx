'use client';
import '../Dropdown.scss';
import { useCallback, useEffect, useState } from 'react';
import { AxiosResponse } from 'axios';
import { getDepartments } from '@/services/api/dropdownsData.service';
import { useRecoilState } from 'recoil';
import { DepartmentsStore } from '@/store/dropdownsDataStore';
import classNames from 'classnames';
import { IDepartment } from '@/types/Department';

type Props = {
  isOpen: boolean;
  onSelect: (department: IDepartment) => void;
};

export const DepartmentDropdown: React.FC<Props> = ({
  isOpen,
  onSelect,
}) => {
  const [query, setQuery] = useState<string>('');
  const [departments, setDepartments] = useRecoilState(DepartmentsStore);

  const fetchDepartments = useCallback(async () => {
    try {
      const resp: AxiosResponse<any, any> = await getDepartments();
      const departmentsFetched: IDepartment[] = resp.data.data.data;
      const defaultOne = departmentsFetched.find(dep => dep.name === 'Not Specified');

      departmentsFetched.sort((a, b) => {
        if (a === defaultOne) return -1;
        if (b === defaultOne) return 1;
        return 0;
      });
      console.log(defaultOne);
      setDepartments(departmentsFetched);
    } catch (error) {}
  }, []);

  useEffect(() => {
    if (!departments) fetchDepartments();
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
        {departments && departments
          .filter((department) =>
            department.name.toLowerCase().includes(query)
          )
          .map((department) => {
            const { department_id, name } = department;

            return (
              <div
                key={department_id}
                className="dropdown__item"
                onClick={() => {
                  setQuery('');
                  onSelect(department);
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
