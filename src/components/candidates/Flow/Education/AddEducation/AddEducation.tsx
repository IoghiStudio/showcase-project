'use client';
import '../../Add.scss';
import { SaveButtonType } from '@/types/SaveButtonType';
import { FlowContainer } from '../../FlowContainer';
import { SaveButtons } from '../../SaveButtons';
import { useRouter } from 'next/navigation';
import { useCallback, useEffect, useState } from 'react';
import { InputArea } from '@/components/utils/InputArea';
import { Label } from '@/components/utils/Label';
import { Checkbox } from '@/components/utils/Checkbox';
import { InputField } from '@/components/utils/InputField';
import { Select } from '@/components/utils/Select';
import { ICountry } from '@/types/Country';
import { CountrySelect } from '@/components/utils/CountrySelect';
import { CountryDropdown } from '@/components/utils/CountryDropdown';
import { DiplomaDropdown } from '@/components/utils/DiplomaDropdown';
import { MonthType } from '@/types/Month';
import { MonthDropdown } from '@/components/utils/MonthDropdown';
import { YearDropdown } from '@/components/utils/YearDropdown';
import { IEducation, deleteEducation, getOneEducation, postEducation, updateEducation } from '@/services/api/education.service';
import { useRecoilValue, useSetRecoilState } from 'recoil';
import { EducationIdStore, EducationsStore } from '@/store/flowPagesData/educationsStore';
import { AxiosResponse } from 'axios';
import { monthsArray } from '@/components/utils/utils';
import { DateError } from '@/types/DateError';

type Props = {
  forEdit?: boolean;
  fromDashboard?: boolean;
};

export const AddEducation: React.FC<Props> = ({ forEdit = false, fromDashboard = false}) => {
  const [diploma, setDiploma] = useState<string>('');
  const [institutionName, setInstitutionName] = useState<string>('');
  const [profile, setProfile] = useState<string>('');
  const [city, setCity] = useState<string>('');
  const [state, setState] = useState<string>('');
  const [country, setCountry] = useState<ICountry | null>(null);
  const [observations, setObservations] = useState<string>('');
  const [startMonth, setStartMonth] = useState<MonthType | null>(null);
  const [endMonth, setEndMonth] = useState<MonthType | null>(null);
  const [startYear, setStartYear] = useState<string>('');
  const [endYear, setEndYear] = useState<string>('');
  const [stillStudying, setStillStudying] = useState<boolean>(false);
  const [diplomaDropdown, setDiplomaDropdown] = useState<boolean>(false);
  const [countryDropdown, setCountryDropdown] = useState<boolean>(false);
  const [startMonthDropdown, setStartMonthDropdown] = useState<boolean>(false);
  const [endMonthDropdown, setEndMonthDropdown] = useState<boolean>(false);
  const [startYearDropdown, setStartYearDropdown] = useState<boolean>(false);
  const [endYearDropdown, setEndYearDropdown] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const router = useRouter();

  const [diplomaError, setDiplomaError] = useState<boolean>(false);
  const [institutionNameError, setInstitutionNameError] = useState<boolean>(false);
  const [profileError, setProfileError] = useState<boolean>(false);
  const [countryError, setCountryError] = useState<boolean>(false);
  const [startMonthError, setStartMonthError] = useState<boolean>(false);
  const [startYearError, setStartYearError] = useState<boolean>(false);
  const [endMonthError, setEndMonthError] = useState<boolean>(false);
  const [endYearError, setEndYearError] = useState<boolean>(false);
  const [dateError, setDateError] = useState<boolean>(false);
  const [dateErrorMessage, setDateErrorMessage] = useState<DateError | string>('');

  const educationId = useRecoilValue(EducationIdStore);
  const setEducations = useSetRecoilState(EducationsStore);

  const handleGoBack = useCallback(() => {
    if (fromDashboard) {
      router.push('/candidates/dashboard/profile/')
      return;
    }

    router.push('/candidates/flow/education/');
  }, []);

  const fetchOneEducation = useCallback(async (id: number) => {
    try {
      const resp: AxiosResponse<any, any> = await getOneEducation(id);
      const educationFetched: IEducation = resp.data.data.data;
      const startDate = new Date(educationFetched.from_date);
      const startMonth: MonthType | undefined = monthsArray.find(
        (month) => +month.id === startDate.getMonth()
        );
      const startYear = startDate.getFullYear();

      if (!educationFetched.in_progress && educationFetched.to_date) {
        const endDate = new Date(educationFetched.to_date);
        let endMonth: MonthType | undefined = monthsArray.find(
          (month) => +month.id === endDate.getMonth()
        );
        let endYear: number = endDate.getFullYear();
        setEndMonth(endMonth || null);
        setEndYear(String(endYear));
      }

      setDiploma(educationFetched.degree);
      setInstitutionName(educationFetched.institution_name);
      setProfile(educationFetched.profile);
      setCity(educationFetched.city || '');
      setState(educationFetched.state || '');
      setCountry(educationFetched.Country || null)
      setObservations(educationFetched.description || '');
      setStartMonth(startMonth || null);
      setStartYear(String(startYear));
      setStillStudying(Boolean(educationFetched.in_progress));
    } catch (error) {}
  } , []);

  const handleDelete = useCallback(async (id: number) => {
    try {
      await deleteEducation(id)
      setEducations(null);
      handleGoBack();
    } catch (error) {}
  }, []);

  useEffect(() => {
    if (forEdit) {
      if (!educationId) {
        handleGoBack();
      } else {
        fetchOneEducation(educationId);
      }
    };
  }, []);

  const handleCountryClick = useCallback((country: ICountry) => {
    setCountry(country);
    setCountryDropdown(false);
    setCountryError(false);
  }, []);

  const handleDiplomaClick = useCallback((diploma: string) => {
    setDiploma(diploma);
    setDiplomaDropdown(false);
    setDiplomaError(false);
  }, []);

  const handleStartMonthClick = useCallback((month: MonthType) => {
    setStartMonthDropdown(false);
    setStartMonth(month);
    setStartMonthError(false);
    setDateError(false);
  }, []);

  const handleEndMonthClick = useCallback((month: MonthType) => {
    setEndMonthDropdown(false);
    setEndMonth(month);
    setEndMonthError(false);
    setDateError(false);
  }, []);

  const handleStartYearClick = useCallback((year: string) => {
    setStartYearDropdown(false);
    setStartYear(year);
    setStartYearError(false);
    setDateError(false);
  }, []);

  const handleEndYearClick = useCallback((year: string) => {
    setEndYearDropdown(false);
    setEndYear(year);
    setEndYearError(false);
    setDateError(false);
  }, []);

  const handleAddEducation = async () => {
    let errorAppeared: boolean = false;
    if (!diploma) {
      setDiplomaError(true);
      errorAppeared = true;
    };
    if (!institutionName) {
      setInstitutionNameError(true);
      errorAppeared = true;
    };
    if (!profile) {
      setProfileError(true);
      errorAppeared = true;
    };
    if (!country) {
      setCountryError(true);
      errorAppeared = true;
    };
    if (!startMonth) {
      setStartMonthError(true);
      errorAppeared = true;
    };
    if (!startYear) {
      setStartYearError(true);
      errorAppeared = true;
    };
    if (!stillStudying) {
      if (!endMonth) {
        setEndMonthError(true);
        errorAppeared = true;
      };
      if (!endYear) {
        setEndYearError(true);
        errorAppeared = true;
      };
    }
    if (errorAppeared) return;
    if (!startMonth) return;
    if (!startYear) return;
    if (!country) return;

    const startDate = new Date(+startYear, +startMonth.id);

    const educationData: IEducation = {
      degree: diploma,
      institution_name: institutionName,
      profile: profile,
      city: city || null,
      state: state || null,
      country_id: country?.country_id,
      from_date: String(startDate),
      description: observations || null,
      in_progress: stillStudying ? 1 : 0,
    };

    if (endMonth && endYear && !stillStudying) {
      const endDate = new Date(+endYear, +endMonth?.id);
      if (endDate < startDate) {
        setDateError(true);
        setDateErrorMessage(DateError.EndDateToEarly)
        return;
      }
      educationData.to_date = String(endDate);

      const currentYear = (new Date()).getFullYear();
      const currentMonth = (new Date()).getMonth();

      if (endDate.getFullYear() >= currentYear) {
        if (endDate.getMonth() > currentMonth) {
          setDateError(true);
          setDateErrorMessage(DateError.EndDateToSoon);
          return;
        }
      }
    }

    try {
      setIsLoading(true);
      if (!forEdit) await postEducation(educationData);
      else if (forEdit && educationId) await updateEducation(educationId, educationData);
      setEducations(null);
      handleGoBack();
    } catch (error: any) {
      setIsLoading(false);
    }
  };

  return (
    <FlowContainer
      title={forEdit ?'EDIT EDUCATION' : 'ADD A NEW EDUCATION'}
      text={'List your high school experience only if you did not go to college. If you are still in school, note your major, and the type of degree you’ll be receiving.'}
      forAddEdit
    >
      <div className="add">
        <div className="add__content">
          <div className="add__left">
            <div className="add__form">
              <div className="add__row">
                <div className="add__label add__label--first">
                  <Label title='TYPE OF DIPLOMA / DEGREE'>
                    <div
                      className="add__select"
                      onClick={() => {
                        setCountryDropdown(false);
                        setDiplomaDropdown(!diplomaDropdown);
                        setStartMonthDropdown(false);
                        setStartYearDropdown(false);
                        setEndMonthDropdown(false);
                        setEndYearDropdown(false);
                      }}
                    >
                      <Select
                        value={diploma || ''}
                        error={diplomaError}
                      />
                    </div>

                    <DiplomaDropdown
                      isOpen={diplomaDropdown}
                      onSelect={handleDiplomaClick}
                    />
                  </Label>
                </div>

                <div className="add__label">
                  <Label title='NAME OF THE INSTITUTION'>
                    <InputField
                      type='text'
                      name='institution'
                      value={institutionName}
                      onChange={(e) => {
                        setInstitutionName(e.target.value);
                        setInstitutionNameError(false);
                      }}
                      error={institutionNameError}
                    />
                  </Label>
                </div>
              </div>

              <div className="add__row">
                <div className="add__label add__label--first">
                  <Label title='PROFILE / SPECIALIZATION'>
                    <InputField
                      type='text'
                      name='profile'
                      value={profile}
                      onChange={(e) => {
                        setProfile(e.target.value);
                        setProfileError(false);
                      }}
                      error={profileError}
                    />
                  </Label>
                </div>

                <div className="add__label">
                  <Label title='TOWN / CITY'>
                    <InputField
                      type='text'
                      name='city'
                      value={city}
                      onChange={e => setCity(e.target.value)}
                    />
                  </Label>
                </div>
              </div>

              <div className="add__row">
                <div className="add__label add__label--first">
                  <Label title='STATE / PROVINCE'>
                    <InputField
                      type='text'
                      name='state'
                      value={state}
                      onChange={e => setState(e.target.value)}
                    />
                  </Label>
                </div>

                <div className="add__label">
                  <Label title='COUNTRY'>
                    <div
                      className="add__select"
                      onClick={() => {
                        setCountryDropdown(!countryDropdown);
                        setDiplomaDropdown(false);
                        setStartMonthDropdown(false);
                        setStartYearDropdown(false);
                        setEndMonthDropdown(false);
                        setEndYearDropdown(false);
                      }}
                    >
                      <CountrySelect
                        name={country?.name || null}
                        code={country?.alpha_2 || null}
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

              <div className="add__row add__row--dates">
                <div className="add__label add__label--first">
                  <Label title='START DATE'>
                    <div className="add__dates">
                      <div className="add__date add__date--course add__date--first">
                        <div
                          className="add__select"
                          onClick={() => {
                            setCountryDropdown(false);
                            setDiplomaDropdown(false);
                            setStartMonthDropdown(!startMonthDropdown);
                            setStartYearDropdown(false);
                            setEndMonthDropdown(false);
                            setEndYearDropdown(false);
                          }}
                        >
                          <Select
                            value={startMonth?.name || 'month'}
                            error={startMonthError}
                          />
                        </div>

                        <MonthDropdown
                          isOpen={startMonthDropdown}
                          onSelect={handleStartMonthClick}
                        />
                      </div>

                      <div className="add__date add__date--course">
                        <div
                          className="add__select"
                          onClick={() => {
                            setCountryDropdown(false);
                            setDiplomaDropdown(false);
                            setStartMonthDropdown(false);
                            setStartYearDropdown(!startYearDropdown);
                            setEndMonthDropdown(false);
                            setEndYearDropdown(false);
                          }}
                        >
                          <Select
                            value={startYear || 'year'}
                            error={startYearError}
                          />
                        </div>

                        <YearDropdown
                          isOpen={startYearDropdown}
                          onSelect={handleStartYearClick}
                        />
                      </div>
                    </div>
                  </Label>
                </div>

                <div className="add__label">
                  <Label title='END DATE'>
                    {!stillStudying ? (
                      <div className="add__dates">
                        <div className="add__date add__date--course add__date--first">
                          <div
                            className="add__select"
                            onClick={() => {
                              setCountryDropdown(false);
                              setDiplomaDropdown(false);
                              setStartMonthDropdown(false);
                              setStartYearDropdown(false);
                              setEndMonthDropdown(!endMonthDropdown);
                              setEndYearDropdown(false);
                            }}
                          >
                            <Select
                              value={endMonth?.name || 'month'}
                              error={endMonthError}
                            />
                          </div>

                          <MonthDropdown
                            isOpen={endMonthDropdown}
                            onSelect={handleEndMonthClick}
                          />
                        </div>

                        <div className="add__date add__date--course">
                          <div
                            className="add__select"
                            onClick={() => {
                              setCountryDropdown(false);
                              setDiplomaDropdown(false);
                              setStartMonthDropdown(false);
                              setStartYearDropdown(false);
                              setEndMonthDropdown(false);
                              setEndYearDropdown(!endYearDropdown);
                            }}
                          >
                            <Select
                              value={endYear || 'year'}
                              error={endYearError}
                            />
                          </div>

                          <YearDropdown
                            isOpen={endYearDropdown}
                            onSelect={handleEndYearClick}
                          />
                        </div>
                      </div>
                    ) : (
                      <div className="add__present">Present</div>
                    )}
                  </Label>
                </div>

                {dateError && (
                  <div className="add__dates--error">
                    {dateErrorMessage}
                  </div>
                )}
              </div>

              <div className="add__checkbox">
                <Checkbox
                  checked={stillStudying}
                  onClick={() => setStillStudying(!stillStudying)}
                />

                <div className="add__checkbox-title">
                  I AM CURRENTLY STUDYING AT THIS SCHOOL.
                </div>
              </div>
            </div>
          </div>

          <div className="add__right">
            <div className="add__area">
              <Label
                title='OBSERVATIONS'
                secondTitle={`${observations.length}/300`}
                forArea
              >
                <InputArea
                  name='observations'
                  value={observations}
                  onChange={(e) => {
                    if (e.target.value.length <= 300) setObservations(e.target.value);
                  }}
                  placeholder={`     Feel free to mention any honors, awards, scholarships, or professional certifications or licenses you acquired during this study.

    Mention if you were involved in any volunteering activities, if you were involved in making the institution’s newspaper, part of a sports team, part of a debate program, or received awards in local, national, or international contests.

    Also, besides the theoretical knowledge you can say what classes you’ve liked more and why, and what else you’ve learned, like better communication, conflict solving, sharing with others, caring for others, etc. `}
                />
              </Label>
            </div>
          </div>
        </div>

        <div className="add__bottom">
          <SaveButtons
            buttonsType={!forEdit ? SaveButtonType.Add : SaveButtonType.Update}
            onSave={handleAddEducation}
            onCancel={handleGoBack}
            isSaveLoading={isLoading}
            onDelete={() => {
              if (educationId) handleDelete(educationId);
            }}
          />
        </div>
      </div>
    </FlowContainer>
  )
}
