'use client';
import { Label } from '@/components/utils/Label';
import '../../Add.scss';
import { FlowContainer } from '../../FlowContainer';
import { Select } from '@/components/utils/Select';
import { SaveButtons } from '../../SaveButtons';
import { SaveButtonType } from '@/types/SaveButtonType';
import { useRecoilValue, useSetRecoilState } from 'recoil';
import { UserDrivingIdStore, UserDrivingStore } from '@/store/flowPagesData/userDrivingStore';
import { useCallback, useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { MonthType } from '@/types/Month';
import { ICountry } from '@/types/Country';
import { IUserDriving, deleteUserDriving, getOneUserDriving, postUserDriving, updateUserDriving } from '@/services/api/userDriving.service';
import { CountrySelect } from '@/components/utils/CountrySelect';
import { CountryDropdown } from '@/components/utils/CountryDropdown';
import { MonthDropdown } from '@/components/utils/MonthDropdown';
import { YearDropdown } from '@/components/utils/YearDropdown';
import { DrivingDropdown } from '@/components/utils/DrivingDropdown';
import { AxiosResponse } from 'axios';
import { monthsArray } from '@/components/utils/utils';

type Props = {
  forEdit?: boolean;
  fromDashboard?: boolean;
};

export const AddDriving: React.FC<Props> = ({ forEdit = false, fromDashboard = false })  => {
  const [category, setCategory] = useState<string | null>(null);
  const [country, setCountry] = useState<ICountry | null>(null);
  const [month, setMonth] = useState<MonthType | null>(null);
  const [year, setYear] = useState<string>('')
  const [categoryDropdown, setCategoryDropdown] = useState<boolean>(false);
  const [countryDropdown, setCountryDropdown] = useState<boolean>(false);
  const [monthDropdown, setMonthDropdown] = useState<boolean>(false);
  const [yearDropdown, setYearDropdown] = useState<boolean>(false);
  const [categoryError, setCategoryError] = useState<boolean>(false);
  const [countryError, setCountryError] = useState<boolean>(false);
  const [monthError, setMonthError] = useState<boolean>(false);
  const [yearError, setYearError] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const router = useRouter();

  const userDrivingId = useRecoilValue(UserDrivingIdStore);
  const setUserDrivings = useSetRecoilState(UserDrivingStore);
  const handleGoBack = useCallback(() => {
    if (!fromDashboard) {
      router.push('/candidates/flow/driving-license/');
      return;
    }

    router.push('/candidates/dashboard/profile/');
  }, []);

  const fetchOneUserDriving = useCallback(async (id: number) => {
    try {
      const resp: AxiosResponse<any, any> = await getOneUserDriving(id);
      const userDrivingFetched: IUserDriving = resp.data.data.data;
      const date = new Date(userDrivingFetched.date_of_acquisition);
      const month: MonthType | undefined = monthsArray.find(
        (month) => +month.id === date.getMonth()
      );
      const year = date.getFullYear();
      setCategory(userDrivingFetched.category);
      setCountry(userDrivingFetched.Country || null);
      setMonth(month || null);
      setYear(String(year));
    } catch (error) {}
  }, []);

  const handleDelete = useCallback(async (id: number) => {
    try {
      await deleteUserDriving(id)
      setUserDrivings(null);
      handleGoBack();
    } catch (error) {}
  }, []);

  useEffect(() => {
    if (forEdit) {
      if (!userDrivingId) {
        handleGoBack();
      } else {
        fetchOneUserDriving(userDrivingId);
      }
    };
  }, []);

  const handleCategoryClick = useCallback((license: string) => {
    setCategory(license);
    setCategoryDropdown(false);
    setCategoryError(false);
  }, []);

  const handleCountryClick = useCallback((country: ICountry) => {
    setCountry(country);
    setCountryDropdown(false);
    setCountryError(false);
  }, []);

  const handleMonthClick = useCallback((month: MonthType) => {
    setMonthDropdown(false);
    setMonth(month);
    setMonthError(false);
  }, []);

  const handleYearClick = useCallback((year: string) => {
    setYearDropdown(false);
    setYear(year);
    setYearError(false);
  }, []);

  const handleAddDriving = async () => {
    let errorAppeared = false;
    if (!year) {
      setYearError(true);
      errorAppeared = true;
    }
    if (!month) {
      setMonthError(true);
      errorAppeared = true;
    }
    if (!category) {
      setCategoryError(true);
      errorAppeared = true;
    }
    if (!country) {
      setCountryError(true);
      return;
    }
    if (!category) return;
    if (!month) return;
    if (errorAppeared) return;

    const dateObtained = new Date(+year, +month.id);

    const data: IUserDriving = {
      country_id: country?.country_id,
      date_of_acquisition: String(dateObtained),
      category: category,
    };

    try {
      setIsLoading(true);
      if (!forEdit) await postUserDriving(data);
      else if (forEdit && userDrivingId) await updateUserDriving(userDrivingId, data);
      setUserDrivings(null);
      handleGoBack();
    } catch (error) {
      setIsLoading(false);
    }
  };

  return (
    <FlowContainer
      title={forEdit ? 'EDIT DRIVING LICENSE' : 'ADD A NEW DRIVING LICENSE'}
      text={forEdit ? 'Edit your driving license.' : 'Add a driving license if you have one for each category. Otherwise, you can also skip this step for now.'}
      forAddEdit
    >
      <div className="add">
        <div className="add__content">
          <div className="add__form add__form--driving">
            <div className="add__row add__row--driving">
              <div className="add__label add__label--first">
                <Label title='Category'>
                  <div
                    className="add__select"
                    onClick={() => {
                      setCategoryDropdown(!categoryDropdown);
                      setYearDropdown(false);
                      setMonthDropdown(false);
                      setCountryDropdown(false);
                    }}
                  >
                    <Select
                      value={category || ''}
                      error={categoryError}
                    />
                  </div>

                  <DrivingDropdown
                    isOpen={categoryDropdown}
                    onSelect={handleCategoryClick}
                  />
                </Label>
              </div>

              <div className="add__label">
                <Label title='COUNTRY OBTAINED'>
                  <div
                    className="add__select"
                    onClick={() => {
                      setCategoryDropdown(false);
                      setYearDropdown(false);
                      setMonthDropdown(false);
                      setCountryDropdown(!countryDropdown);
                    }}
                  >
                    <CountrySelect
                      code={country?.alpha_2 || ''}
                      name={country?.name || ''}
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

            <div className="add__label">
              <Label title='DATE OBTAINED'>
                <div className="add__dates">
                  <div className="add__date add__date--driving first-date">
                    <div
                      className="add__select"
                      onClick={() => {
                        setCategoryDropdown(false);
                        setYearDropdown(false);
                        setMonthDropdown(!monthDropdown);
                        setCountryDropdown(false);
                      }}
                    >
                      <Select
                        value={month?.name || 'month'}
                        error={monthError}
                      />
                    </div>

                    <MonthDropdown
                      isOpen={monthDropdown}
                      onSelect={handleMonthClick}
                    />
                  </div>

                  <div className="add__date add__date--driving">
                    <div
                      className="add__select"
                      onClick={() => {
                        setCategoryDropdown(false);
                        setYearDropdown(!yearDropdown);
                        setMonthDropdown(false);
                        setCountryDropdown(false);
                      }}
                    >
                      <Select
                        value={year || 'year'}
                        error={yearError}
                      />
                    </div>

                    <YearDropdown
                      isOpen={yearDropdown}
                      onSelect={handleYearClick}
                    />
                  </div>
                </div>
              </Label>
            </div>
          </div>
        </div>

        <div className="add__bottom">
          <SaveButtons
            buttonsType={!forEdit ? SaveButtonType.Add : SaveButtonType.Update}
            onSave={handleAddDriving}
            onCancel={handleGoBack}
            isSaveLoading={isLoading}
            onDelete={() => {
              if (userDrivingId) handleDelete(userDrivingId);
            }}
          />
        </div>
      </div>
    </FlowContainer>
  )
}
