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
import { IDepartment } from '@/types/Department';
import { IIndustrySubcategory } from '@/types/Industry';
import { IJobTitle } from '@/types/JobTitle';
import { DepartmentDropdown } from '@/components/utils/DepartmentDropdown';
import { IndustryDropdown } from '@/components/utils/IndustryDropdown';
import { JobTitleDropdown } from '@/components/utils/JobTitleDropdown';
import { JobTypeDropdown } from '@/components/utils/JobTypeDropdown';
import { ExperienceIdStore, ExperiencesStore } from '@/store/flowPagesData/experiencesStore';
import { useRecoilValue, useSetRecoilState } from 'recoil';
import { MonthType } from '@/types/Month';
import { MonthDropdown } from '@/components/utils/MonthDropdown';
import { YearDropdown } from '@/components/utils/YearDropdown';
import { IExperience, deleteExperience, getOneExperience, postExperience, updateExperience } from '@/services/api/experience.service';
import { AxiosResponse } from 'axios';
import { monthsArray } from '@/components/utils/utils';
import { DateError } from '@/types/DateError';

type Props = {
  forEdit?: boolean;
  fromDashboard?: boolean;
};

export const AddExperience: React.FC<Props> = ({ forEdit = false, fromDashboard = false}) => {
  const [jobTitle, setJobTitle] = useState<IJobTitle | null>(null);
  const [companyName, setCompanyName] = useState<string>('');
  const [department, setDepartment] = useState<IDepartment | null>(null);
  const [industry, setIndustry] = useState<IIndustrySubcategory | null>(null);
  const [typeOfJob, setTypeOfJob] = useState<string>('');
  const [country, setCountry] = useState<ICountry | null>(null);
  const [startMonth, setStartMonth] = useState<MonthType | null>(null);
  const [endMonth, setEndMonth] = useState<MonthType | null>(null);
  const [startYear, setStartYear] = useState<string>('');
  const [endYear, setEndYear] = useState<string>('');
  const [description, setDescription] = useState<string>('');
  const [stillWorking, setStillWorking] = useState<boolean>(false);
  const [jobTitleDropdown, setJobTitleDropdown] = useState<boolean>(false);
  const [departmentDropdown, setDepartmentDropdown] = useState<boolean>(false);
  const [industryDropdown, setIndustryDropdown] = useState<boolean>(false);
  const [typeOfJobDropdown, setTypeOfJobDropdown] = useState<boolean>(false);
  const [countryDropdown, setCountryDropdown] = useState<boolean>(false);
  const [startMonthDropdown, setStartMonthDropdown] = useState<boolean>(false);
  const [endMonthDropdown, setEndMonthDropdown] = useState<boolean>(false);
  const [startYearDropdown, setStartYearDropdown] = useState<boolean>(false);
  const [endYearDropdown, setEndYearDropdown] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const router = useRouter();

  const [jobTitleError, setJobTitleError] = useState<boolean>(false);
  const [typeOfJobError, setTypeOfJobError] = useState<boolean>(false);
  const [companyNameError, setCompanyNameError] = useState<boolean>(false);
  const [departmentError, setDepartmentError] = useState<boolean>(false);
  const [industryError, setIndustryError] = useState<boolean>(false);
  const [countryError, setCountryError] = useState<boolean>(false);
  const [startMonthError, setStartMonthError] = useState<boolean>(false);
  const [startYearError, setStartYearError] = useState<boolean>(false);
  const [endMonthError, setEndMonthError] = useState<boolean>(false);
  const [endYearError, setEndYearError] = useState<boolean>(false);
  const [dateError, setDateError] = useState<boolean>(false);
  const [dateErrorMessage, setDateErrorMessage] = useState<DateError | string>('');

  const experienceId = useRecoilValue(ExperienceIdStore)
  const setExperiences = useSetRecoilState(ExperiencesStore);

  const handleGoBack = useCallback(() => {
    if (!fromDashboard) {
      router.push('/candidates/flow/experience/');
      return;
    }

    router.push('/candidates/dashboard/profile/')
  }, []);

  const fetchOneExperience = useCallback(async (id: number) => {
    try {
      const resp: AxiosResponse<any, any> = await getOneExperience(id);
      const experienceFetched: IExperience = resp.data.data.data;
      const startDate = new Date(experienceFetched.from_date);
      const startMonth: MonthType | undefined = monthsArray.find(
        (month) => +month.id === startDate.getMonth()
        );
      const startYear = startDate.getFullYear();

      if (!experienceFetched.still_working && experienceFetched.to_date) {
        const endDate = new Date(experienceFetched.to_date);
        let endMonth: MonthType | undefined = monthsArray.find(
          (month) => +month.id === endDate.getMonth()
        );
        let endYear: number = endDate.getFullYear();
        setEndMonth(endMonth || null);
        setEndYear(String(endYear));
      }

      setDepartment(experienceFetched.Department || null);
      setIndustry(experienceFetched.IndustrySubcategory || null);
      setJobTitle(experienceFetched.JobTitle || null);
      setCompanyName(experienceFetched.company);
      setCountry(experienceFetched.Country || null);
      setTypeOfJob(experienceFetched.job_type);
      setDescription(experienceFetched.description || '');
      setStartMonth(startMonth || null);
      setStartYear(String(startYear));
      setStillWorking(Boolean(experienceFetched.still_working));
    } catch (error) {}
  } , []);

  const handleDelete = useCallback(async (id: number) => {
    try {
      await deleteExperience(id)
      setExperiences(null);
      handleGoBack();
    } catch (error) {}
  }, []);

  useEffect(() => {
    if (forEdit) {
      if (!experienceId) {
        handleGoBack();
      } else {
        fetchOneExperience(experienceId);
      }
    };
  }, []);

  const handleCountryClick = useCallback((country: ICountry) => {
    setCountry(country);
    setCountryDropdown(false);
    setCountryError(false);
  }, []);

  const handleDepartmentClick = useCallback((department: IDepartment) => {
    setDepartment(department);
    setDepartmentDropdown(false);
    setDepartmentError(false);
  }, []);

  const handleIndustryClick = useCallback((industry: IIndustrySubcategory) => {
    setIndustry(industry);
    setIndustryDropdown(false);
    setIndustryError(false);
  }, []);

  const handleJobTitleClick = useCallback((jobTitle: IJobTitle) => {
    setJobTitle(jobTitle);
    setJobTitleDropdown(false);
    setJobTitleError(false);
  }, []);

  const handleTypeOfJobClick = useCallback((jobType: string) => {
    setTypeOfJob(jobType);
    setTypeOfJobDropdown(false);
    setTypeOfJobError(false);
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

  const handleAddExperience = async () => {
    let errorAppeared: boolean = false;

    if (!jobTitle) {
      setJobTitleError(true);
      errorAppeared = true;
    };
    if (!companyName) {
      setCompanyNameError(true);
      errorAppeared = true;
    };
    if (!typeOfJob) {
      setTypeOfJobError(true);
      errorAppeared = true;
    };
    if (!country) {
      setCountryError(true);
      errorAppeared = true;
    };
    if (!startYear) {
      setStartYearError(true);
      errorAppeared = true;
    };
    if (!startMonth) {
      setStartMonthError(true);
      errorAppeared = true;
    };
    if (!stillWorking) {
      if (!endYear) {
        setEndYearError(true);
        errorAppeared = true;
      };
      if (!endMonth) {
        setEndMonthError(true);
        errorAppeared = true;
      };
    }
    if (errorAppeared) return;
    if (!startMonth) return;
    if (!country) return;
    if (!jobTitle) return;

    const startDate = new Date(+startYear, +startMonth.id);

    const experienceData: IExperience = {
      company: companyName,
      job_title_id: jobTitle.job_title_id,
      department_id: department?.department_id || 19,
      industry_subcategory_id: industry?.industry_subcategory_id || 687,
      industry_id: industry?.industry_id || 18,
      job_type: typeOfJob,
      country_id: country.country_id,
      from_date: String(startDate),
      description: description || null,
      still_working: stillWorking ? 1 : 0,
    };

    if (endMonth && endYear && !stillWorking) {
      const endDate = new Date(+endYear, +endMonth?.id);
      if (endDate < startDate) {
        setDateError(true);
        setDateErrorMessage(DateError.EndDateToEarly);
        return;
      }

      const currentYear = (new Date()).getFullYear();
      const currentMonth = (new Date()).getMonth();

      if (endDate.getFullYear() >= currentYear) {
        if (endDate.getMonth() > currentMonth) {
          setDateError(true);
          setDateErrorMessage(DateError.EndDateToSoon);
          return;
        }
      }
      experienceData.to_date = String(endDate);
    }

    try {
      setIsLoading(true);
      if (!forEdit) await postExperience(experienceData);
      else if (forEdit && experienceId) updateExperience(experienceId, experienceData);
      setExperiences(null);
      handleGoBack();
    } catch (error: any) {
      setIsLoading(false);
    }
  };

  return (
    <FlowContainer
      title={forEdit ? 'EDIT JOB EXPERIENCE' : 'ADD A NEW JOB EXPERIENCE'}
      text={'Add as much experience as you have to be displayed to potential employers who will see your CV and, if you fit their needs, send you job offers. Is it important to be honest when you create your CV'}
      forAddEdit
    >
      <div className="add">
        <div className="add__content">
          <div className="add__left">
            <div className="add__form">
              <div className="add__row">
                <div className="add__label add__label--first">
                  <Label title='JOB TITLE'>
                    <div
                      className="add__select"
                      onClick={() => {
                        setCountryDropdown(false);
                        setDepartmentDropdown(false);
                        setJobTitleDropdown(!jobTitleDropdown);
                        setIndustryDropdown(false);
                        setTypeOfJobDropdown(false);
                        setStartMonthDropdown(false);
                        setStartYearDropdown(false);
                        setEndMonthDropdown(false);
                        setEndYearDropdown(false);
                      }}
                    >
                      <Select
                        value={jobTitle?.name || ''}
                        error={jobTitleError}
                      />
                    </div>

                    <JobTitleDropdown
                      isOpen={jobTitleDropdown}
                      onSelect={handleJobTitleClick}
                    />
                  </Label>
                </div>

                <div className="add__label">
                  <Label title='COMPANY'>
                    <InputField
                      type='text'
                      name='companyName'
                      value={companyName}
                      onChange={(e) => {
                        setCompanyName(e.target.value);
                        setCompanyNameError(false);
                      }}
                      error={companyNameError}
                    />
                  </Label>
                </div>
              </div>

              <div className="add__row">
                <div className="add__label add__label--first">
                  <Label title='DEPARTMENT'>
                    <div
                      className="add__select"
                      onClick={() => {
                        setCountryDropdown(false);
                        setDepartmentDropdown(!departmentDropdown);
                        setJobTitleDropdown(false);
                        setIndustryDropdown(false);
                        setTypeOfJobDropdown(false);
                        setStartMonthDropdown(false);
                        setStartYearDropdown(false);
                        setEndMonthDropdown(false);
                        setEndYearDropdown(false);
                      }}
                    >
                      <Select
                        value={department?.name || 'Not Specified'}
                        error={departmentError}
                      />
                    </div>

                    <DepartmentDropdown
                      isOpen={departmentDropdown}
                      onSelect={handleDepartmentClick}
                    />
                  </Label>
                </div>

                <div className="add__label">
                  <Label title='INDUSTRY'>
                    <div
                      className="add__select"
                      onClick={() => {
                        setCountryDropdown(false);
                        setDepartmentDropdown(false);
                        setJobTitleDropdown(false);
                        setIndustryDropdown(!industryDropdown);
                        setTypeOfJobDropdown(false);
                        setStartMonthDropdown(false);
                        setStartYearDropdown(false);
                        setEndMonthDropdown(false);
                        setEndYearDropdown(false);
                      }}
                    >
                      <Select
                        value={industry?.name || 'Not Specified'}
                        error={industryError}
                      />
                    </div>

                    <IndustryDropdown
                      isOpen={industryDropdown}
                      onSelect={handleIndustryClick}
                    />
                  </Label>
                </div>
              </div>

              <div className="add__row">
                <div className="add__label add__label--first">
                  <Label title='TYPE OF JOB'>
                    <div
                      className="add__select"
                      onClick={() => {
                        setCountryDropdown(false);
                        setDepartmentDropdown(false);
                        setJobTitleDropdown(false);
                        setIndustryDropdown(false);
                        setTypeOfJobDropdown(!typeOfJobDropdown);
                        setStartMonthDropdown(false);
                        setStartYearDropdown(false);
                        setEndMonthDropdown(false);
                        setEndYearDropdown(false);
                      }}
                    >
                      <Select
                        value={typeOfJob || ''}
                        error={typeOfJobError}
                      />
                    </div>

                    <JobTypeDropdown
                      isOpen={typeOfJobDropdown}
                      onSelect={handleTypeOfJobClick}
                    />
                  </Label>
                </div>

                <div className="add__label">
                  <Label title='COUNTRY'>
                    <div
                      className="add__select"
                      onClick={() => {
                        setCountryDropdown(!countryDropdown);
                        setJobTitleDropdown(false);
                        setDepartmentDropdown(false);
                        setIndustryDropdown(false);
                        setTypeOfJobDropdown(false);
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
                            setDepartmentDropdown(false);
                            setJobTitleDropdown(false);
                            setIndustryDropdown(false);
                            setTypeOfJobDropdown(false);
                            setStartMonthDropdown(!startMonthDropdown);
                            setStartYearDropdown(false);
                            setEndMonthDropdown(false);
                            setEndYearDropdown(false);
                          }}
                        >
                          <Select
                            value={startMonth?.name || ''}
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
                            setDepartmentDropdown(false);
                            setJobTitleDropdown(false);
                            setIndustryDropdown(false);
                            setTypeOfJobDropdown(false);
                            setStartMonthDropdown(false);
                            setStartYearDropdown(!startYearDropdown);
                            setEndMonthDropdown(false);
                            setEndYearDropdown(false);
                          }}
                        >
                          <Select
                            value={startYear || ''}
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
                  {!stillWorking ? (
                    <div className="add__dates">
                      <div className="add__date add__date--course add__date--first">
                        <div
                          className="add__select"
                          onClick={() => {
                            setCountryDropdown(false);
                            setDepartmentDropdown(false);
                            setJobTitleDropdown(false);
                            setIndustryDropdown(false);
                            setTypeOfJobDropdown(false);
                            setStartMonthDropdown(false);
                            setStartYearDropdown(false);
                            setEndMonthDropdown(!endMonthDropdown);
                            setEndYearDropdown(false);
                          }}
                        >
                          <Select
                            value={endMonth?.name || ''}
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
                            setDepartmentDropdown(false);
                            setJobTitleDropdown(false);
                            setIndustryDropdown(false);
                            setTypeOfJobDropdown(false);
                            setStartMonthDropdown(false);
                            setStartYearDropdown(false);
                            setEndMonthDropdown(false);
                            setEndYearDropdown(!endYearDropdown);
                          }}
                        >
                          <Select
                            value={endYear || ''}
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
                  checked={stillWorking}
                  onClick={() => setStillWorking(!stillWorking)}
                />

                <div className="add__checkbox-title">
                  I am curently working in this position
                </div>
              </div>
            </div>
          </div>

          <div className="add__right">
            <div className="add__area">
              <Label
                title='Job description'
                secondTitle={`${description.length}/300`}
                forArea
              >
                <InputArea
                  name='description'
                  value={description}
                  onChange={(e) => {
                    if (e.target.value.length <= 300) setDescription(e.target.value);
                  }}
                  placeholder={`     In case you received “employer of the month” awards or other bonuses or distinctions at work, please state it here, along with the criteria that made you receive it.

    Also, it is better to mention the activity you are proud of, like making the smoothest weld for a certain object, picking fruits from 25 trees in a day, taking care for 5 months of 40 pigs, 80 birds, or 30 horses, or cooking for 130 persons in one evening, or serving food and drinks for 200 persons in one evening, etc.`}
                />
              </Label>
            </div>
          </div>
        </div>

        <div className="add__bottom">
          <SaveButtons
            buttonsType={!forEdit ? SaveButtonType.Add : SaveButtonType.Update}
            onSave={handleAddExperience}
            onCancel={handleGoBack}
            isSaveLoading={isLoading}
            onDelete={() => {
              if (experienceId) handleDelete(experienceId);
            }}
          />
        </div>
      </div>
    </FlowContainer>
  )
}
