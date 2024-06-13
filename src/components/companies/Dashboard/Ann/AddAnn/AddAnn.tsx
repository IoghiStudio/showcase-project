'use client';
import './AddAnn.scss';
import '../../SearchWorkers/SearchWorkers.scss';
import { useCallback, useEffect, useState } from 'react';
import { IJobTitle } from '@/types/JobTitle';
import { IIndustrySubcategory } from '@/types/Industry';
import { IDepartment } from '@/types/Department';
import { ICountry } from '@/types/Country';
import { ILanguage } from '@/types/Language';
import { Label } from '@/components/utils/Label';
import { InputArea } from '@/components/utils/InputArea';
import { ButtonIcon, ButtonWithIcon } from '@/components/candidates/Dashboard/utils/ButtonWihIcon';
import { ButtonColor } from '@/types/ButtonColor';
import { Select } from '@/components/utils/Select';
import { WorkplaceTypeDropdown } from '@/components/utils/WorkplaceTypeDropdown';
import { RecurrencyDropdown } from '@/components/utils/RecurrencyDropdown';
import { BenefitList, ProficiencyLevel, customNumberValidator } from '@/components/utils/utils';
import { InputField } from '@/components/utils/InputField';
import { JobTypeDropdown } from '@/components/utils/JobTypeDropdown';
import { ICurrency } from '@/types/Currency';
import { CurrencyDropdown } from '@/components/utils/CurrencyDropdown';
import { JobTitleDropdown } from '@/components/utils/JobTitleDropdown';
import { DepartmentDropdown } from '@/components/utils/DepartmentDropdown';
import { IndustryDropdown } from '@/components/utils/IndustryDropdown';
import { CountrySelect } from '@/components/utils/CountrySelect';
import { CountryDropdown } from '@/components/utils/CountryDropdown';
import { Checkbox } from '@/components/utils/Checkbox';
import classNames from 'classnames';
import { LanguageDropdown } from '@/components/utils/LanguageDropdown';
import { ProficiencyDropdown } from '@/components/utils/ProficiencyDropdown';
import { ContractDropdown } from '@/components/utils/ContractDropdown';
import { useRecoilState, useRecoilValue, useSetRecoilState } from 'recoil';
import { CompanyDataStore } from '@/store/companyDataStore';
import { AxiosResponse } from 'axios';
import { getCompanyData } from '@/services/api/authUser.service';
import { ICompanyData } from '@/types/CompanyData';
import { DrivingDropdown } from '@/components/utils/DrivingDropdown';
import { IPostAnnounce, IRequiredLanguage, IRequiredLicence, getAnnounces, postAnnounce, updateAnnounce } from '@/services/api/job.service';
import { useRouter } from 'next/navigation';
import { AnnounceOneStore, AnnouncesStore, IAnnounce } from '@/store/announceStore';
import { AnnounceToPromoteStore } from '@/store/promoAnnounceStore';

interface IRequiredLanguageState {
  language: ILanguage;
  proficiency: string;
};

type Props = {
  forEdit?: boolean;
};

export const AddAnn: React.FC<Props> = ({ forEdit = false }) => {
  const router = useRouter();
  const [companyData, setCompanyData] = useRecoilState(CompanyDataStore);
  const [proficiency, setProficiency] = useState<string>();
  const [language, setLanguage] = useState<ILanguage | null>(null);
  const [languages, setLanguages] = useState<IRequiredLanguageState[]>([]);
  const [category, setCategory] = useState<string>('');
  const [categories, setCategories] = useState<string[]>([]);
  const [about, setAbout] = useState<string>('');
  const [responsabilities, setResponsabilities] = useState<string>('');
  const [customName, setCustomName] = useState<string>('');
  const [salary, setSalary] = useState<string>('');
  const [positionsAvailable, setPositionsAvailable] = useState<string>('');
  const [position, setPosition] = useState<IJobTitle | null>(null);
  const [industry, setIndustry] = useState<IIndustrySubcategory | null>(null);
  const [department, setDepartment] = useState<IDepartment | null>(null);
  const [workplaceType, setWorkplaceType] = useState<string>('');
  const [typeOfEmployment, setTypeOfEmployment] = useState<string>('');
  const [country, setCountry] = useState<ICountry | null>(null);
  const [contractDuration, setContractDuration] = useState<string>('');
  const [contractDurationType, setContractDurationType] = useState<string>('');
  const [currency, setCurrency] = useState<string>('');
  const [recurrency, setRecurrency] = useState<string>('');
  const [benefitList, setBenefitList] = useState<string[]>([]);
  const [experience, setExperience] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [nationalityWanted, setNationalityWanted] = useState<ICountry | null>(null);
  const [nationalitiesWanted, setNationalitiesWanted] = useState<ICountry[]>([]);

  const [positionDropdown, setPositionDropdown] = useState<boolean>(false);
  const [industryDropdown, setIndustryDropdown] = useState<boolean>(false);
  const [departmentDropdown, setDepartmentDropdown] = useState<boolean>(false);
  const [workplaceTypeDropdown, setWorkplaceTypeDropdown] = useState<boolean>(false);
  const [typeOfEmploymentDropdown, setTypeOfEmploymentDropdown] = useState<boolean>(false);
  const [countryDropdown, setCountryDropdown] = useState<boolean>(false);
  const [nationalityWantedDropdown, setNationalityWantedDropdown] = useState<boolean>(false);
  const [contractDurationTypeDropdown, setContractDurationTypeDropdown] = useState<boolean>(false);
  const [currencyDropdown, setCurrencyDropdown] = useState<boolean>(false);
  const [recurrencyDropdown, setRecurrencyDropdown] = useState<boolean>(false);
  const [languageDropdown, setLanguageDropdown] = useState<boolean>(false);
  const [proficiencyDropdown, setProficiencyDropdown] = useState<boolean>(false);
  const [categoryDropdown, setCategoryDropdown] = useState<boolean>(false);

  const [positionsAvailableError, setPositionsAvailableError] = useState<boolean>(false);
  const [aboutError, setAboutError] = useState<boolean>(false);
  const [responsabilitiesError, setResponsabilitiesError] = useState<boolean>(false);
  const [customNameError, setCustomNameError] = useState<boolean>(false);
  const [salaryError, setSalaryError] = useState<boolean>(false);
  const [positionError, setPositionError] = useState<boolean>(false);
  const [industryError, setIndustryError] = useState<boolean>(false);
  const [departmentError, setDepartmentError] = useState<boolean>(false);
  const [workplaceTypeError, setWorkplaceTypeError] = useState<boolean>(false);
  const [typeOfEmploymentError, setTypeOfEmploymentError] = useState<boolean>(false);
  const [currencyError, setCurrencyError] = useState<boolean>(false);
  const [recurrencyError, setRecurrencyError] = useState<boolean>(false);
  const [experienceError, setExperienceError] = useState<boolean>(false);
  const setAnnounces = useSetRecoilState(AnnouncesStore);
  const announce: IAnnounce | null = useRecoilValue(AnnounceOneStore);
  const setAnounceToPromote = useSetRecoilState<number| null>(AnnounceToPromoteStore);

  useEffect(() => {
    if (!forEdit) return;
    if (!announce) {
      router.push('/dashboard/announcements/');
      return;
    }

    setPosition(announce.JobTitle);
    setAbout(announce.description);
    setResponsabilities(announce.responsabilities);
    setRecurrency(announce.recurrency);
    setCurrency(announce.currency);
    setRecurrency(announce.recurrency);
    setCountry(announce.Country);
    setBenefitList(announce.benefits || []);
    setCustomName(announce.custom_name);
    setIndustry(announce.IndustrySubcategory);
    setDepartment(announce.Department);
    setTypeOfEmployment(announce.type_of_employment);
    setWorkplaceType(announce.workplace_type);
    setCategories(announce.JobDrivingPermits.map(obj => obj.category));
    setNationalitiesWanted(announce.JobCountries.map(jc => jc.Country));
    if (announce.opening_positions) {
      setPositionsAvailable('' + announce.opening_positions);
    }
    setLanguages(announce.JobLanguages.map(obj => ({
      language: obj.Language,
      proficiency: obj.proficiency
    })));
    if (announce.experience) setExperience(String(announce.experience));
    if (announce.contract_duration) setContractDuration(String(announce.contract_duration));
    setContractDurationType(announce.contract_duration_period || '');
    setSalary('' + announce.salary);
  }, [])

  const fetchCompanyData = useCallback(async () => {
    try {
      const resp: AxiosResponse<any, any> = await getCompanyData();
      const companyDataFecthed: ICompanyData = resp.data.data.data;
      setCompanyData(companyDataFecthed);
    } catch (error) {}
  }, []);

  useEffect(() => {
    if (!companyData) fetchCompanyData();

    if (!forEdit) {
      if (companyData) setCountry(companyData.Country);
    }
  }, [companyData]);

  const handleCategoryClick = useCallback((license: string) => {
    setCategory(license);
    setCategoryDropdown(false);
  }, []);

  const handlePositionClick = useCallback((jobTitle: IJobTitle) => {
    setPosition(jobTitle);
    setPositionDropdown(false);
    setPositionError(false);
  }, []);

  const handleTypeOfEmploymentClick = useCallback((jobType: string) => {
    setTypeOfEmployment(jobType);
    setTypeOfEmploymentDropdown(false);
    setTypeOfEmploymentError(false);
  }, []);

  const handleWorkplaceTypeClick = useCallback((workplaceType: string) => {
    setWorkplaceType(workplaceType);
    setWorkplaceTypeDropdown(false);
    setWorkplaceTypeError(false);
  }, []);

  const handleRecurrencyClick = useCallback((recurrency: string) => {
    setRecurrency(recurrency);
    setRecurrencyDropdown(false);
    setRecurrencyError(false);
  }, []);

  const handleCurrencyClick = useCallback((currency: ICurrency) => {
    setCurrency(currency.code);
    setCurrencyDropdown(false);
    setCurrencyError(false);
  }, []);

  const handleCountryClick = useCallback((country: ICountry) => {
    setCountry(country);
    setCountryDropdown(false);
  }, []);

  const handleNationalityWantedClick = useCallback((country: ICountry) => {
    setNationalityWanted(country);
    setNationalityWantedDropdown(false);
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

  const handleLanguageClick = useCallback((language: ILanguage) => {
    setLanguage(language);
    setLanguageDropdown(false);
  }, []);

  const handleProficiencyClick = useCallback((level: ProficiencyLevel) => {
    setProficiency(level);
    setProficiencyDropdown(false);
  }, []);

  const handleContractDurationTypeClick = useCallback((contract: string) => {
    setContractDurationType(contract);
    setContractDurationTypeDropdown(false);
  }, []);

  const handlePostAnnounce = async () => {
    let errorOccured: boolean = false;
    if (!customName) {
      errorOccured = true;
      setCustomNameError(true);
    }
    if (!position) {
      errorOccured = true;
      setPositionError(true);
    }
    if (!workplaceType) {
      errorOccured = true;
      setWorkplaceTypeError(true);
    }
    if (!typeOfEmployment) {
      errorOccured = true;
      setTypeOfEmploymentError(true);
    }
    if (!salary) {
      errorOccured = true;
      setSalaryError(true);
    }
    if (!positionsAvailable) {
      errorOccured = true;
      setPositionsAvailableError(true);
    }
    if (!currency) {
      errorOccured = true;
      setCurrencyError(true);
    }
    if (!recurrency) {
      errorOccured = true;
      setRecurrencyError(true);
    }
    if (!about) {
      errorOccured = true;
      setAboutError(true);
    }
    if (!responsabilities) {
      errorOccured = true;
      setResponsabilitiesError(true);
    }
    if (errorOccured) return;
    if (!position) return;
    if (!country) return;
    if (!currency) return;

    const data: IPostAnnounce = {
      custom_name: customName,
      job_title_id: position?.job_title_id,
      country_id: country?.country_id,
      industry_subcategory_id: industry?.industry_subcategory_id || 687,
      department_id: department?.department_id || 18,
      salary: salary,
      workplace_type: workplaceType,
      type_of_employment: typeOfEmployment,
      currency: currency,
      recurrency: recurrency,
      description: about,
      responsabilities: responsabilities,
      benefits: benefitList,
      due_date: new Date(new Date().getTime() + 30 * 24 * 60 * 60 * 1000).toISOString(),
      opening_positions: +positionsAvailable,
      jobCountry: nationalitiesWanted.map(n => n.country_id),
    };

    if (languages.length) {
      const newLanguages: IRequiredLanguage[] = languages.map(lang => ({
        language_id: lang.language.language_id,
        proficiency: lang.proficiency,
      }));

      data.languages = newLanguages;
    }

    if (categories.length) {
      const newCategories: IRequiredLicence[] = categories.map(cat => ({
        category: cat,
        driving_experience: 1,
      }));

      data.drivingPermit = newCategories;
    }

    if (contractDurationType || contractDuration) {
      data.contract_duration = contractDuration;
      data.contract_duration_period = contractDurationType;
    }

    if (experience) data.experience = +experience;

    try {
      setIsLoading(true);
      let resp: AxiosResponse<any, any>;

      if (!forEdit) {
        resp = await postAnnounce(data);
        const announceCreated: IAnnounce = resp.data.data.data;
        setAnounceToPromote(announceCreated.job_id);
      } else {
        if (!announce) return;
        await updateAnnounce(announce.job_id, data);
        setAnounceToPromote(announce.job_id);
      }

      router.push('/dashboard/promotion/new/');
      setAnnounces(null);
      setIsLoading(false);
    } catch (error) {
      setIsLoading(false);
    }
  };

  return (
    <div className="add-ann">
      <div
        onClick={() => {
          if (forEdit) {
            if (announce) {
              handlePostAnnounce();
            }
          } else {
            handlePostAnnounce();
          }
        }}
        className="add-ann__call-api"
      >
        <ButtonWithIcon
          bgColor={ButtonColor.Green}
          color={ButtonColor.White}
          borderColor={ButtonColor.Green}
          icon={ButtonIcon.Check}
          text={!forEdit ? 'SAVE & PUBLISH' : 'SAVE JOB ANNOUNCEMENT'}
          isLoading={isLoading}
          long={forEdit}
        />
      </div>

      <div className="add-ann__columns">
        <div className="add-ann__column">
          <div className="container add-ann__container announce">
            <div className="announce__top">
              <div className="container__title">Add Job Announcement</div>
              <div className="container__text">Add a new job announcement</div>
            </div>

            <div className="announce__content">
              <div className="announce__column">
                <div className="container__label">
                  <Label title='custom name'>
                    <InputField
                      type='text'
                      name='companyName'
                      value={customName}
                      onChange={(e) => {
                        setCustomName(e.target.value);
                        setCustomNameError(false);
                      }}
                      placeholder='for your reference only'
                      error={customNameError}
                    />
                  </Label>
                </div>

                <div className="container__label">
                  <Label title='job position'>
                    <div
                      className="container__select"
                      onClick={() => {
                        if (forEdit) {
                          setPositionDropdown(false);
                        } else {
                          setPositionDropdown(!positionDropdown);
                        }
                        setIndustryDropdown(false);
                        setDepartmentDropdown(false);
                        setWorkplaceTypeDropdown(false);
                        setTypeOfEmploymentDropdown(false);
                        setCountryDropdown(false);
                        setCurrencyDropdown(false);
                        setRecurrencyDropdown(false);
                        setLanguageDropdown(false);
                        setProficiencyDropdown(false);
                        setCategoryDropdown(false);
                        setContractDurationTypeDropdown(false);
                        setNationalityWantedDropdown(false);
                      }}
                    >
                      <Select
                        value={position?.name || ''}
                        error={positionError}
                        isDisabled={forEdit}
                      />
                    </div>

                    <JobTitleDropdown
                      isOpen={positionDropdown}
                      onSelect={handlePositionClick}
                    />
                  </Label>
                </div>

                <div className="container__label">
                  <Label title='industry'>
                    <div
                      className="container__select"
                      onClick={() => {
                        setNationalityWantedDropdown(false);
                        setPositionDropdown(false);
                        setIndustryDropdown(!industryDropdown);
                        setDepartmentDropdown(false);
                        setWorkplaceTypeDropdown(false);
                        setTypeOfEmploymentDropdown(false);
                        setCountryDropdown(false);
                        setCurrencyDropdown(false);
                        setRecurrencyDropdown(false);
                        setLanguageDropdown(false);
                        setProficiencyDropdown(false);
                        setCategoryDropdown(false);
                        setContractDurationTypeDropdown(false);
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

                <div className="container__label">
                  <Label title='department'>
                    <div
                      className="container__select"
                      onClick={() => {
                        setNationalityWantedDropdown(false);
                        setPositionDropdown(false);
                        setIndustryDropdown(false);
                        setDepartmentDropdown(!departmentDropdown);
                        setWorkplaceTypeDropdown(false);
                        setTypeOfEmploymentDropdown(false);
                        setCountryDropdown(false);
                        setCurrencyDropdown(false);
                        setRecurrencyDropdown(false);
                        setLanguageDropdown(false);
                        setProficiencyDropdown(false);
                        setCategoryDropdown(false);
                        setContractDurationTypeDropdown(false);
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

                <div className="container__label">
                  <Label title='workplace type'>
                    <div
                      className="container__select"
                      onClick={() => {
                        setNationalityWantedDropdown(false);
                        setPositionDropdown(false);
                        setIndustryDropdown(false);
                        setDepartmentDropdown(false);
                        setWorkplaceTypeDropdown(!workplaceTypeDropdown);
                        setTypeOfEmploymentDropdown(false);
                        setCountryDropdown(false);
                        setCurrencyDropdown(false);
                        setRecurrencyDropdown(false);
                        setLanguageDropdown(false);
                        setProficiencyDropdown(false);
                        setCategoryDropdown(false);
                        setContractDurationTypeDropdown(false);
                      }}
                    >
                      <Select
                        value={workplaceType || ''}
                        error={workplaceTypeError}
                      />
                    </div>

                    <WorkplaceTypeDropdown
                      isOpen={workplaceTypeDropdown}
                      onSelect={handleWorkplaceTypeClick}
                    />
                  </Label>
                </div>

                <div className="container__label">
                  <Label title='type of employment'>
                    <div
                      className="container__select"
                      onClick={() => {
                        setNationalityWantedDropdown(false);
                        setPositionDropdown(false);
                        setIndustryDropdown(false);
                        setDepartmentDropdown(false);
                        setWorkplaceTypeDropdown(false);
                        setTypeOfEmploymentDropdown(!typeOfEmploymentDropdown);
                        setCountryDropdown(false);
                        setCurrencyDropdown(false);
                        setRecurrencyDropdown(false);
                        setLanguageDropdown(false);
                        setProficiencyDropdown(false);
                        setCategoryDropdown(false);
                        setContractDurationTypeDropdown(false);
                      }}
                    >
                      <Select
                        value={typeOfEmployment || ''}
                        error={typeOfEmploymentError}
                      />
                    </div>

                    <JobTypeDropdown
                      isOpen={typeOfEmploymentDropdown}
                      onSelect={handleTypeOfEmploymentClick}
                    />
                  </Label>
                </div>

                <div className="container__label">
                  <Label title='job country'>
                    <div
                      className="container__select"
                      onClick={() => {
                        setNationalityWantedDropdown(false);
                        setPositionDropdown(false);
                        setIndustryDropdown(false);
                        setDepartmentDropdown(false);
                        setWorkplaceTypeDropdown(false);
                        setTypeOfEmploymentDropdown(false);
                        setCountryDropdown(!countryDropdown);
                        setCurrencyDropdown(false);
                        setRecurrencyDropdown(false);
                        setLanguageDropdown(false);
                        setProficiencyDropdown(false);
                        setCategoryDropdown(false);
                        setContractDurationTypeDropdown(false);
                      }}
                    >
                      <CountrySelect
                        name={country?.name || null}
                        code={country?.alpha_2 || null}
                        error={false}
                      />
                    </div>

                    <CountryDropdown
                      isOpen={countryDropdown}
                      onSelect={handleCountryClick}
                    />
                  </Label>
                </div>

                <div className="container__label">
                  <Label title='contract duration'>
                    <div className="container__form-row">
                      <div className="announce__currency">
                        <InputField
                          type='text'
                          name='contractDuration'
                          value={contractDuration}
                          onChange={(e) => {
                            customNumberValidator(e, setContractDuration);
                          }}
                          placeholder='number'
                        />
                      </div>

                      <div className="announce__contract">
                        <div
                          className="container__select"
                          onClick={() => {
                            setNationalityWantedDropdown(false);
                            setPositionDropdown(false);
                            setIndustryDropdown(false);
                            setDepartmentDropdown(false);
                            setWorkplaceTypeDropdown(false);
                            setTypeOfEmploymentDropdown(false);
                            setCountryDropdown(false);
                            setCurrencyDropdown(false);
                            setRecurrencyDropdown(false);
                            setLanguageDropdown(false);
                            setProficiencyDropdown(false);
                            setCategoryDropdown(false);
                            setContractDurationTypeDropdown(!contractDurationTypeDropdown);
                          }}
                        >
                          <Select
                            value={contractDurationType || ''}
                            error={false}
                          />
                        </div>

                        <ContractDropdown
                          forCompany
                          isOpen={contractDurationTypeDropdown}
                          onSelect={handleContractDurationTypeClick}
                        />
                      </div>
                    </div>
                  </Label>
                </div>

                <div className="announce__benefit announce__benefit--flat">
                  <Checkbox
                    checked={!contractDuration || !contractDurationType}
                    onClick={() => {
                      setContractDuration('');
                      setContractDurationType('');
                    }}
                  />

                  <div className="announce__benefit-name">
                    Not specified / unlimited contract duration
                  </div>
                </div>
              </div>

              <div className="announce__column">
                <div className="announce__column-top">
                  <div className="container__label">
                    <Label title='Available opening positions'>
                      <InputField
                        type='text'
                        name='positionsAvailable'
                        value={positionsAvailable}
                        onChange={(e) => {
                          customNumberValidator(e, setPositionsAvailable);
                          setPositionsAvailableError(false);
                        }}
                        error={positionsAvailableError}
                        placeholder='positions in number'
                      />
                    </Label>
                  </div>

                  <div className="container__label">
                    <Label title='salary offered'>
                      <InputField
                        type='text'
                        name='salary'
                        value={salary}
                        onChange={(e) => {
                          customNumberValidator(e, setSalary);
                          setSalaryError(false);
                        }}
                        error={salaryError}
                        placeholder='revenue in number'
                      />
                    </Label>
                  </div>

                  <div className="container__form-row">
                    <div className="container__label announce__currency">
                      <Label title='currency'>
                        <div
                          className="container__select"
                          onClick={() => {
                            setNationalityWantedDropdown(false);
                            setPositionDropdown(false);
                            setIndustryDropdown(false);
                            setDepartmentDropdown(false);
                            setWorkplaceTypeDropdown(false);
                            setTypeOfEmploymentDropdown(false);
                            setCountryDropdown(false);
                            setCurrencyDropdown(!currencyDropdown);
                            setRecurrencyDropdown(false);
                            setLanguageDropdown(false);
                            setProficiencyDropdown(false);
                            setCategoryDropdown(false);
                            setContractDurationTypeDropdown(false);
                          }}
                        >
                          <Select
                            value={currency || ''}
                            error={currencyError}
                          />
                        </div>

                        <CurrencyDropdown
                          isOpen={currencyDropdown}
                          onSelect={handleCurrencyClick}
                        />
                      </Label>
                    </div>

                    <div className="container__label">
                      <Label title='recurrency'>
                        <div
                          className="container__select"
                          onClick={() => {
                            setNationalityWantedDropdown(false);
                            setPositionDropdown(false);
                            setIndustryDropdown(false);
                            setDepartmentDropdown(false);
                            setWorkplaceTypeDropdown(false);
                            setTypeOfEmploymentDropdown(false);
                            setCountryDropdown(false);
                            setCurrencyDropdown(false);
                            setRecurrencyDropdown(!recurrencyDropdown);
                            setLanguageDropdown(false);
                            setProficiencyDropdown(false);
                            setCategoryDropdown(false);
                            setContractDurationTypeDropdown(false);
                          }}
                        >
                          <Select
                            value={recurrency || ''}
                            error={recurrencyError}
                          />
                        </div>

                        <RecurrencyDropdown
                          isOpen={recurrencyDropdown}
                          onSelect={handleRecurrencyClick}
                        />
                      </Label>
                    </div>
                  </div>
                </div>

                <div className="announce__column-bottom">
                  <div className="container__label">
                    <Label title='Benefits offered'>
                      {BenefitList.map(benefit => (
                        <div
                          key={benefit.id}
                          className="announce__benefit"
                        >
                          <Checkbox
                            checked={benefitList.includes(benefit.name)}
                            onClick={() => {
                              let newBenefits: string[] = [...benefitList];

                              if (!benefitList.includes(benefit.name)) {
                                newBenefits.push(benefit.name);
                              } else {
                                newBenefits = newBenefits.filter(b => b !== benefit.name);
                              }

                              setBenefitList(newBenefits);
                            }}
                          />

                          <div className="announce__benefit-name">{benefit.name}</div>
                        </div>
                      ))}
                    </Label>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="container add-ann__container add-ann__padding">
            <div className="container__title">About the Job</div>
            <div className="container__text">Description of this job position</div>

            <div className="add-ann__input-area">
              <Label
                title=''
                secondTitle={`${about.length}/2000 characters`}
                forArea
              >
                <InputArea
                  name='about-me'
                  value={about}
                  onPaste={(e) => {
                    setTimeout(() => {
                      const clipboardData = (window as any).clipboardData || e.clipboardData;
                      const pastedText = clipboardData?.getData('text/plain');

                      if (pastedText && pastedText.length <= 2000) {
                        setAbout(pastedText);
                        setAboutError(false);
                      }
                    });
                  }}
                  onChange={(e) => {
                    if (e.target.value.length <= 2000) {
                      setAbout(e.target.value);
                      setAboutError(false);
                    };
                  }}
                  placeholder='Write a short description about this job'
                  error={aboutError}
                />
              </Label>
            </div>
          </div>

          <div className="container add-ann__padding">
            <div className="container__title">Job Responsability</div>
            <div className="container__text">Add the main responsabilities for this job position</div>

            <div className="add-ann__input-area">
              <Label
                title=''
                secondTitle={`${responsabilities.length}/2000 characters`}
                forArea
              >
                <InputArea
                  name='about-me-2'
                  value={responsabilities}
                  onPaste={(e) => {
                    setTimeout(() => {
                      const clipboardData = (window as any).clipboardData || e.clipboardData;
                      const pastedText = clipboardData?.getData('text/plain');

                      if (pastedText && pastedText.length <= 2000) {
                        setResponsabilities(pastedText);
                        setResponsabilitiesError(false);
                      }
                    });
                  }}
                  onChange={(e) => {
                    if (e.target.value.length <= 2000) {
                      setResponsabilities(e.target.value);
                      setResponsabilitiesError(false);
                    };
                  }}
                  placeholder='List the main responsabilities for this job'
                  error={responsabilitiesError}
                />
              </Label>
            </div>
          </div>
        </div>

        <div className="add-ann__column">
          <div className="container add-ann__container add-ann__padding">
            <div className="container__title">Required Experience</div>
            <div className="container__text">Relevant experience in this job position</div>

            <Label title='minimum experience'>
              <div className="filter__experience">
                <input
                  type='text'
                  className={classNames("filter__experience-input", {
                    'filter__experience-input': experienceError
                  })}
                  placeholder='type a number'
                  value={experience}
                  onChange={e => {
                    customNumberValidator(e, setExperience);
                  }}
                />

                <div className="filter__experience-text">
                  years of experience
                </div>
              </div>

              <div className="announce__benefit">
                <Checkbox
                  checked={!experience}
                  onClick={() => setExperience('')}
                />

                <div className="announce__benefit-name">
                  No experience required
                </div>
              </div>
            </Label>
          </div>

          <div className="container add-ann__container alien-language">
            <div className="alien-language__top">
              <div className="container__title">Nationality wanted</div>
              <div className="container__text">Where do you prefer your candidates</div>

              <div className="container__form-row container__form-row--row-only">
                <Label title='category'>
                  <div
                    className="container__select"
                    onClick={() => {
                      setPositionDropdown(false);
                      setIndustryDropdown(false);
                      setDepartmentDropdown(false);
                      setWorkplaceTypeDropdown(false);
                      setTypeOfEmploymentDropdown(false);
                      setCountryDropdown(false);
                      setCurrencyDropdown(false);
                      setRecurrencyDropdown(false);
                      setLanguageDropdown(false);
                      setProficiencyDropdown(false);
                      setCategoryDropdown(false);
                      setNationalityWantedDropdown(!nationalityWantedDropdown);
                      setContractDurationTypeDropdown(false);
                    }}
                  >
                    <CountrySelect
                      code={nationalityWanted?.alpha_2 || ''}
                      name={nationalityWanted?.name || 'Select'}
                      error={false}
                      flatRight
                    />
                  </div>

                  <CountryDropdown
                    isOpen={nationalityWantedDropdown}
                    onSelect={handleNationalityWantedClick}
                  />
                </Label>

                <div
                  onClick={() => {
                    if (nationalityWanted) {
                      if (nationalitiesWanted.includes(nationalityWanted)) return;
                      setNationalitiesWanted(state => [...state, nationalityWanted]);
                      setNationalityWanted(null);
                    }
                  }}
                  className="alien-language__add alien-language__add--category"
                >
                  ADD
                </div>
              </div>
            </div>

            <div className="alien-language__bottom">
              <Label title={!nationalitiesWanted.length ? 'WORLD WIDE'
                : `${nationalitiesWanted.length > 1 ? `${nationalitiesWanted.length} NATIONALITiES` : `${nationalitiesWanted.length} NATIONALITY`} WANTED`}>
                {nationalitiesWanted.map(c => (
                  <div key={c.country_id} className="alien-language__item">
                    <div className="alien-language__item-container alien-language__item-lang">
                      {c.name}
                    </div>

                    <div
                      onClick={() => setNationalitiesWanted(state => state.filter(x => x.country_id !== c.country_id))}
                      className="alien-language__item-container alien-language__item-cross-container"
                    >
                      <div className="alien-language__item-cross"/>
                    </div>
                  </div>
                ))}
              </Label>
            </div>
          </div>

          <div className="container add-ann__container alien-language">
            <div className="alien-language__top">
              <div className="container__title">Required Languages</div>
              <div className="container__text">Speaking & wiring languages by the candidate</div>

              <div className="alien-language__row">
                <div className="alien-language__label">
                  <Label title='language'>
                    <div
                      className="alien-language__language-select"
                      onClick={() => {
                        setNationalityWantedDropdown(false);
                        setPositionDropdown(false);
                        setIndustryDropdown(false);
                        setDepartmentDropdown(false);
                        setWorkplaceTypeDropdown(false);
                        setTypeOfEmploymentDropdown(false);
                        setCountryDropdown(false);
                        setCurrencyDropdown(false);
                        setRecurrencyDropdown(false);
                        setLanguageDropdown(!languageDropdown);
                        setProficiencyDropdown(false);
                        setCategoryDropdown(false);
                        setContractDurationTypeDropdown(false);
                      }}
                    >
                      <Select
                        value={language?.name || ''}
                        flatRight
                      />
                    </div>

                    <LanguageDropdown
                      forCompany
                      isOpen={languageDropdown}
                      onSelect={handleLanguageClick}
                    />
                  </Label>
                </div>

                <div className="alien-language__label">
                  <Label title='proficiency'>
                    <div
                      className="alien-language__proficiency-select"
                      onClick={() => {
                        setPositionDropdown(false);
                        setIndustryDropdown(false);
                        setDepartmentDropdown(false);
                        setWorkplaceTypeDropdown(false);
                        setTypeOfEmploymentDropdown(false);
                        setCountryDropdown(false);
                        setCurrencyDropdown(false);
                        setRecurrencyDropdown(false);
                        setLanguageDropdown(false);
                        setProficiencyDropdown(!proficiencyDropdown);
                        setCategoryDropdown(false);
                        setContractDurationTypeDropdown(false);
                      }}
                    >
                      <Select
                        value={proficiency || ''}
                        flatRight
                        flatLeft
                      />
                    </div>

                    <ProficiencyDropdown
                      isOpen={proficiencyDropdown}
                      onSelect={handleProficiencyClick}
                    />
                  </Label>
                </div>

                <div
                  onClick={() => {
                    if (language && proficiency) {
                      if (languages.some(reqLang => reqLang.language.name === language.name)) return;

                      setLanguages(state => [...state, {
                        language: language,
                        proficiency: proficiency,
                      }]);

                      setLanguage(null);
                      setProficiency('');
                    }
                  }}
                  className="alien-language__add"
                >
                  ADD
                </div>
              </div>
            </div>

            <div className="alien-language__bottom">
              <Label title={!languages.length ? 'NO LANGUAGE REQUIRED' : `${languages.length} ${languages.length > 1 ? 'LANGUAGES' : 'LANGUAGE'} REQUIRED`}>
                {languages.map(lang => (
                  <div key={lang.language.language_id} className="alien-language__item">
                    <div className="alien-language__item-container alien-language__item-lang">
                      {lang.language.name}
                    </div>

                    <div className="alien-language__item-container alien-language__item-prof">
                      {lang.proficiency}
                    </div>

                    <div
                      onClick={() => setLanguages(state => state.filter(l => l.language.name !== lang.language.name))}
                      className="alien-language__item-container alien-language__item-cross-container">
                      <div className="alien-language__item-cross"/>
                    </div>
                  </div>
                ))}
              </Label>
            </div>
          </div>

          <div className="container alien-language">
            <div className="alien-language__top">
              <div className="container__title">Driving license</div>
              <div className="container__text">Driver's license held by the candidate</div>

              <div className="container__form-row container__form-row--row-only">
                <Label title='category'>
                  <div
                    className="container__select"
                    onClick={() => {
                      setNationalityWantedDropdown(false);
                      setPositionDropdown(false);
                      setIndustryDropdown(false);
                      setDepartmentDropdown(false);
                      setWorkplaceTypeDropdown(false);
                      setTypeOfEmploymentDropdown(false);
                      setCountryDropdown(false);
                      setCurrencyDropdown(false);
                      setRecurrencyDropdown(false);
                      setLanguageDropdown(false);
                      setProficiencyDropdown(false);
                      setCategoryDropdown(!categoryDropdown);
                      setContractDurationTypeDropdown(false);
                    }}
                  >
                    <Select
                      value={category || ''}
                      error={false}
                      flatRight
                    />
                  </div>

                  <DrivingDropdown
                    isOpen={categoryDropdown}
                    onSelect={handleCategoryClick}
                  />
                </Label>

                <div
                  onClick={() => {
                    if (category) {
                      if (categories.includes(category)) return;
                      setCategories(state => [...state, category]);
                      setCategory('');
                    }
                  }}
                  className="alien-language__add alien-language__add--category"
                >
                  ADD
                </div>
              </div>
            </div>

            <div className="alien-language__bottom">
              <Label title={!categories.length ? 'NO DRVING LICENSE REQUIRED'
                : `${categories.length > 1 ? `${categories.length} DRIVING LICENSES` : `${categories.length} DRIVING LICENSE`} REQUIRED`}>
                {categories.map(cat => (
                  <div key={cat} className="alien-language__item">
                    <div className="alien-language__item-container alien-language__item-lang">
                      {cat}
                    </div>

                    <div
                      onClick={() => setCategories(state => state.filter(c => c !== cat))}
                      className="alien-language__item-container alien-language__item-cross-container"
                    >
                      <div className="alien-language__item-cross"/>
                    </div>
                  </div>
                ))}
              </Label>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
