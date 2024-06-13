'use client'
import './MPosition.scss';
import '../../../Flow/AddPosition/AddPosition.scss';
import '../../../Flow/About/About.scss';
import '../../../Flow/Skills/Skills.scss';
import '../../../Flow/DemoVideo/DemoVideo.scss';
import '../../../Flow/FlowContainer/FlowContainer.scss';
import classNames from 'classnames';
import { ChangeEvent, useCallback, useEffect, useState } from 'react';
import { IJobTitle } from '@/types/JobTitle';
import { ICurrency } from '@/types/Currency';
import { BenefitName } from '@/types/Benefits';
import { AxiosResponse } from 'axios';
import { IFullPosition, IPosition, getLimitCountPositions, getPosition, getPositions, postPosition, updatePosition } from '@/services/api/jobPosition.service';
import { useRouter } from 'next/navigation';
import { Checkbox } from '@/components/utils/Checkbox';
import { Label } from '@/components/utils/Label';
import { ContractDropdown } from '@/components/utils/ContractDropdown';
import { Select } from '@/components/utils/Select';
import { customNumberValidator } from '@/components/utils/utils';
import { InputField } from '@/components/utils/InputField';
import { RecurrencyDropdown } from '@/components/utils/RecurrencyDropdown';
import { CurrencyDropdown } from '@/components/utils/CurrencyDropdown';
import { WorkplaceTypeDropdown } from '@/components/utils/WorkplaceTypeDropdown';
import { JobTypeDropdown } from '@/components/utils/JobTypeDropdown';
import { JobTitleDropdown } from '@/components/utils/JobTitleDropdown';
import { InputArea } from '@/components/utils/InputArea';
import { SetterOrUpdater, useRecoilState, useRecoilValue, useSetRecoilState } from 'recoil';
import { IJobPositionLimitCreated, JobPositionIdStore, JobPositionsLimitCreatedStore, JobPositionsStore } from '@/store/jobPositionStore';
import { ButtonIcon, ButtonWithIcon } from '../../utils/ButtonWihIcon';
import { ButtonColor } from '@/types/ButtonColor';
import { infoTexts } from '@/components/candidates/Flow/DemoVideo';
import { IPromotedPosition, getPromotedPositions } from '@/services/api/promotedPositions.service';
import { PromotedPositionsStore } from '@/store/promotionsStore';

type Props = {
  forEdit?: boolean;
};

export const MPosition: React.FC<Props> = ({ forEdit }) => {
  const jobPositionId: number | null = useRecoilValue(JobPositionIdStore);
  const setJobPositions: SetterOrUpdater<IFullPosition[] | null> = useSetRecoilState(JobPositionsStore);
  const setPositionsLimitCreated: SetterOrUpdater<IJobPositionLimitCreated | null> = useSetRecoilState(JobPositionsLimitCreatedStore);
  const [jobTitle, setJobTitle] = useState<IJobTitle | null>(null);
  const [typeOfJob, setTypeOfJob] = useState<string>('');
  const [experienceYears, setExperienceYears] = useState<string>('');
  const [workplaceType, setWorkplaceType] = useState<string>('');
  const [desiredSalary, setDesiredSalary] = useState<string>('');
  const [currency, setCurrency] = useState<ICurrency | null>(null);
  const [recurrency, setRecurrency] = useState<string>('');
  const [minimumContract, setMinimumContract] = useState<string>('');
  const [jobTitleDropdown, setJobTitleDropdown] = useState<boolean>(false);
  const [typeOfJobDropdown, setTypeOfJobDropdown] = useState<boolean>(false);
  const [workplaceTypeDropdown, setWorkplaceTypeDropdown] = useState<boolean>(false);
  const [currencyDropdown, setCurrencyDropdown] = useState<boolean>(false);
  const [recurrencyDropdown, setRecurrencyDropdown] = useState<boolean>(false);
  const [minimumContractDropdown, setMinimumContractDropdown] = useState<boolean>(false);
  const [jobTitleError, setJobTitleError] = useState<boolean>(false);
  const [typeOfJobError, setTypeOfJobError] = useState<boolean>(false);
  const [experienceError, setExperienceError] = useState<boolean>(false);
  const [currencyError, setCurrencyError] = useState<boolean>(false);
  const [recurrencyError, setRecurrencyError] = useState<boolean>(false);
  const [workplaceTypeError, setWorkplaceTypeError] = useState<boolean>(false);
  const [minimumContractError, setMinimumContractError] = useState<boolean>(false);
  const [desiredSalaryError, setDesiredSalaryError] = useState<boolean>(false);
  const [benefits, setBenefits] = useState<string[]>([]);
  const router = useRouter();
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [brief, setBrief] = useState<string>('');
  const [briefError, setBriefError] = useState<boolean>(false);
  const [query, setQuery] = useState<string>('');
  const [skillList, setSkillList] = useState<string[]>([]);
  const [labelTitle, setLabelTitle] = useState<string>('add new skill');
  const [showError, setShowError] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string>('');
  const [listError, setListError] = useState<boolean>(false);
  const [videoFile, setVideoFile] = useState<File | null>(null);
  const [videoLink, setVideoLink] = useState<string | null>(null);
  const [isModelOpen, setIsModelOpen] = useState<boolean>(false);
  const [videoEmptyError, setVideoEmptyError] = useState<boolean>(false);
  const [dataChanged, setDataChanged] = useState<boolean>(false);
  const setPromotedPositions = useSetRecoilState(PromotedPositionsStore);
  const [fieldsError, setFieldsError] = useState<boolean>(false);

  const fetchLimitCountPositions = async () => {
    try {
      const resp: AxiosResponse<any, any> = await getLimitCountPositions();
      const data: IJobPositionLimitCreated = resp.data.data.data;
      setPositionsLimitCreated(data);
    } catch (error) {}
  };

  useEffect(() => {
    if (!skillList.length) {
      setLabelTitle('add new skill');
      return;
    };

    if (skillList.length === 5) {
      setLabelTitle('SKILLS ADDED');
      return;
    };

    const remainToAdd = 5 - skillList.length;

    if (skillList.length < 5) {
      setLabelTitle(`ADD ${remainToAdd} MORE SKILL(S)`)
    }
  }, [skillList]);

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length) {
      setDataChanged(true);
      setVideoEmptyError(false);
      const file = e.target.files[0];
      if ((file.size / 1_000_000) > 200) {
        setShowError(true);
        setVideoFile(null);
        e.target.value = '';
        return;
      }

      setVideoFile(file);
      e.target.value = '';
    }
  };

  const handleAddSkill = useCallback((skillName: string, skillListReceived: string[]) => {
    setDataChanged(true);

    if (skillListReceived.includes(skillName)) {
      handleErrorMessage("Already added")
      return;
    }

    const newSkills = [...skillListReceived, skillName];
    setSkillList(newSkills);
    setQuery('');
  }, []);

  const handleRemoveSkill = useCallback((skillName: string, skillListReceived: string[]) => {
    const newSkills = skillListReceived.filter(skill => skill !== skillName);
    setSkillList(newSkills);
    setDataChanged(true);
  }, []);

  const handleErrorMessage = useCallback((errorName: string) => {
    setErrorMessage(errorName);
    setShowError(true);
    setTimeout(() => setShowError(false), 2000);
  }, []);

  const fetchPositions = async () => {
    try {
      const resp: AxiosResponse<any, any> = await getPositions();
      const data: IFullPosition[] = resp.data.data.data;
      setJobPositions(data);
    } catch (error) {}
  };

  const fetchJobPosition = useCallback(async(id: number) => {
    try {
      const resp: AxiosResponse<any, any> = await getPosition(id);
      const data: IFullPosition = resp.data.data.data;
      setCurrency(data.Currency || null);
      setJobTitle(data.JobTitle || null);
      setRecurrency(data.recurrency);
      setExperienceYears('' + data.job_experience);
      setDesiredSalary('' + data.desired_salary);
      setMinimumContract(data.minimum_contract);
      setTypeOfJob(data.type_of_employment);
      setWorkplaceType(data.location_type);
      setBenefits(data.benefits || []);
      setBrief(data.about || '');
      setSkillList(data.skills || []);
      setVideoLink(data.video || null);
    } catch (error) {}
  }, []);

  useEffect(() => {
    if (forEdit) {
      if (!jobPositionId) {
        router.push('/candidates/dashboard/positions/');
      } else {
        fetchJobPosition(jobPositionId);
      }
    };
  }, []);

  const updateBenefits = (benefitToAdd: BenefitName) => {
    setBenefits((state) => [...state, benefitToAdd]);
  };

  const removeBenefit = (benefitToRemove: BenefitName) => {
    setBenefits((state) =>
      state.filter((benefit) => benefit !== benefitToRemove)
    );
  };

  const handleBenefitsClick = (
    benefitMessage: BenefitName
  ) => {
    setDataChanged(true);

    if (!benefits.includes(benefitMessage)) {
      updateBenefits(benefitMessage);
    } else {
      removeBenefit(benefitMessage);
    }
  };

  const handleJobTitleClick = useCallback((jobTitle: IJobTitle) => {
    setJobTitle(jobTitle);
    setJobTitleDropdown(false);
    setJobTitleError(false);
    setDataChanged(true);
  }, []);

  const handleTypeOfJobClick = useCallback((jobType: string) => {
    setTypeOfJob(jobType);
    setTypeOfJobDropdown(false);
    setTypeOfJobError(false);
    setDataChanged(true);
  }, []);

  const handleWorkplaceTypeClick = useCallback((workplaceType: string) => {
    setWorkplaceType(workplaceType);
    setWorkplaceTypeDropdown(false);
    setWorkplaceTypeError(false);
    setDataChanged(true);
  }, []);

  const handleRecurrencyClick = useCallback((recurrency: string) => {
    setRecurrency(recurrency);
    setRecurrencyDropdown(false);
    setRecurrencyError(false);
    setDataChanged(true);
  }, []);

  const handleCurrencyClick = useCallback((currency: ICurrency) => {
    setCurrency(currency);
    setCurrencyDropdown(false);
    setCurrencyError(false);
    setDataChanged(true);
  }, []);

  const handleMinimumContractClick = useCallback((contract: string) => {
    setMinimumContract(contract);
    setMinimumContractDropdown(false);
    setMinimumContractError(false);
    setDataChanged(true);
  }, []);

  const fetchPromotedPositions = async () => {
    try {
      const resp: AxiosResponse<any, any> = await getPromotedPositions();
      const data: IPromotedPosition[] = resp.data.data.data;
      setPromotedPositions(data);
    } catch (error) {}
  };

  const handleAddPosition = async () => {
    let errorAppeared: boolean = false;
    if (forEdit && !dataChanged) {
      router.push('/candidates/dashboard/positions/')
      return;
    }
    if (!videoFile && !videoLink) {
      errorAppeared = true;
      setVideoEmptyError(true);
    }
    if (!jobTitle) {
      errorAppeared = true;
      setJobTitleError(true);
    }
    if (!typeOfJob) {
      errorAppeared = true;
      setTypeOfJobError(true);
    }
    if (!currency) {
      errorAppeared = true;
      setCurrencyError(true);
    }
    if (!recurrency) {
      errorAppeared = true;
      setRecurrencyError(true);
    }
    if (!desiredSalary) {
      errorAppeared = true;
      setDesiredSalaryError(true);
    }
    if (!experienceYears) {
      errorAppeared = true;
      setExperienceError(true);
    }
    if (!minimumContract) {
      errorAppeared = true;
      setMinimumContractError(true);
    }
    if (!workplaceType) {
      errorAppeared = true;
      setWorkplaceTypeError(true);
    }
    if (!brief.length) {
      errorAppeared = true;
      setBriefError(true);
    }
    if (skillList.length < 5) {
      errorAppeared = true;
      setListError(true);
    }
    if (errorAppeared) {
      setFieldsError(true);
      return;
    };
    if (!jobTitle) return;
    if (!currency) return;
    console.log(1);

    const data: IPosition = {
      job_title_id: jobTitle?.job_title_id,
      type_of_employment: typeOfJob,
      currency_id: currency?.currency_id,
      recurrency: recurrency,
      desired_salary: Number(desiredSalary),
      job_experience: Number(experienceYears),
      minimum_contract: minimumContract,
      location_type: workplaceType,
      benefits: benefits,
      skills: skillList,
      about: brief,
    };

    if (videoFile) {
      const base64string = await new Promise<string>((resolve) => {
        const reader = new FileReader();
        reader.onload = (event) => resolve((event.target?.result as string)?.split(',')[1]);
        reader.readAsDataURL(videoFile);
      });

      data.video = base64string;
    }

    try {
      setIsLoading(true);

      if (forEdit && jobPositionId) {
        await updatePosition(jobPositionId, data);
        fetchPromotedPositions();
      } else if (!forEdit) {
        await postPosition(data);
        fetchLimitCountPositions();
      }

      fetchPositions();
      router.push('/candidates/dashboard/positions/');
      setIsLoading(false);
    } catch (error) {
      setIsLoading(false);
    }
  };

  return (
    <div className="m-position">
      {fieldsError && (
        <div className="m-position__field-error">
          All required fields must be filled.
        </div>
      )}
      <div onClick={handleAddPosition} className="m-position__call-api">
        <ButtonWithIcon
          bgColor={ButtonColor.Green}
          color={ButtonColor.White}
          borderColor={ButtonColor.Green}
          icon={ButtonIcon.Check}
          text='SAVE & PUBLISH'
          isLoading={isLoading}
        />
      </div>

      <div className="m-position__content">
        <div className="m-position__column">
          <div className="container m-position__container m-position__new-job">
            <div className="container__title">
              {!forEdit ? 'New job position' : 'Edit job position'}
            </div>

            <div className="container__text">
              Add a job you are qualified for and want to candidate on the platform
            </div>

            <div className="add-position__row">
              <div className="add-position__label add-position__label--first">
                <Label title='JOB TITLE'>
                  <div
                    className="add__select"
                    onClick={() => {
                      setJobTitleDropdown(!jobTitleDropdown);
                      setTypeOfJobDropdown(false);
                      setWorkplaceTypeDropdown(false);
                      setCurrencyDropdown(false);
                      setRecurrencyDropdown(false);
                      setMinimumContractDropdown(false);
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

              <div className="add-position__label">
                <Label title='TYPE OF EMPLOYMENT'>
                  <div
                    className="add__select"
                    onClick={() => {
                      setJobTitleDropdown(false);
                      setTypeOfJobDropdown(!typeOfJobDropdown);
                      setWorkplaceTypeDropdown(false);
                      setCurrencyDropdown(false);
                      setRecurrencyDropdown(false);
                      setMinimumContractDropdown(false);
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
            </div>

            <div className="add-position__row">
              <div className="add-position__label add-position__label--first add-position__label--salary">
                <Label title='DESIRED SALARY'>
                  <InputField
                    type='text'
                    name='desiredSalary'
                    value={desiredSalary}
                    onChange={e => {
                      customNumberValidator(e, setDesiredSalary);
                      setDesiredSalaryError(false);
                      setDataChanged(true);
                    }}
                    error={desiredSalaryError}
                  />
                </Label>
              </div>

              <div className="add-position__label">
                <Label title='WORKPLACE TYPE'>
                  <div
                    className="add__select"
                    onClick={() => {
                      setJobTitleDropdown(false);
                      setTypeOfJobDropdown(false);
                      setWorkplaceTypeDropdown(!workplaceTypeDropdown);
                      setCurrencyDropdown(false);
                      setRecurrencyDropdown(false);
                      setMinimumContractDropdown(false);
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
            </div>

            <div className="add-position__row">
              <div className="add-position__label add-position__label--first">
                <Label title='CURRENCY'>
                  <div
                    className="add__select"
                    onClick={() => {
                      setJobTitleDropdown(false);
                      setTypeOfJobDropdown(false);
                      setWorkplaceTypeDropdown(false);
                      setCurrencyDropdown(!currencyDropdown);
                      setRecurrencyDropdown(false);
                      setMinimumContractDropdown(false);
                    }}
                  >
                    <Select
                      value={currency?.code || ''}
                      error={currencyError}
                    />
                  </div>

                  <CurrencyDropdown
                    isOpen={currencyDropdown}
                    onSelect={handleCurrencyClick}
                  />
                </Label>
              </div>

              <div className="add-position__label">
                <Label title='RECURRENCY'>
                  <div
                    className="add__select"
                    onClick={() => {
                      setJobTitleDropdown(false);
                      setTypeOfJobDropdown(false);
                      setWorkplaceTypeDropdown(false);
                      setCurrencyDropdown(false);
                      setRecurrencyDropdown(!recurrencyDropdown);
                      setMinimumContractDropdown(false);
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

            <div className="add-position__row">
              <div className="add-position__label add-position__label--first">
                <Label title='YEARS OF EXPERIENCE'>
                  <InputField
                    type='text'
                    name='experience'
                    value={experienceYears}
                    onChange={(e) => {
                      customNumberValidator(e, setExperienceYears);
                      setExperienceError(false);
                      setDataChanged(true);
                    }}
                    error={experienceError}
                  />
                </Label>
              </div>

              <div className="add-position__label">
                <Label title='MINIMUM CONTRACT'>
                  <div
                    className="add__select"
                    onClick={() => {
                      setJobTitleDropdown(false);
                      setTypeOfJobDropdown(false);
                      setWorkplaceTypeDropdown(false);
                      setCurrencyDropdown(false);
                      setRecurrencyDropdown(false);
                      setMinimumContractDropdown(!minimumContractDropdown);
                    }}
                  >
                    <Select
                      value={minimumContract || ''}
                      error={minimumContractError}
                    />
                  </div>

                  <ContractDropdown
                    isOpen={minimumContractDropdown}
                    onSelect={handleMinimumContractClick}
                  />
                </Label>
              </div>
            </div>

            <div className="add-position__benefits">
              <div className="add-position__benefits-title">
                <div className="m-position__new-job-benefits-title">
                  REQUESTED BENEFITS
                </div>
              </div>

              <div className="add-position__benefits-columns">
                <div className="add-position__benefits-column">
                  <div className="add-position__benefit">
                    <Checkbox
                      checked={benefits.includes(BenefitName.Relocation)}
                      onClick={() => {
                        handleBenefitsClick(
                          BenefitName.Relocation
                        );
                      }}
                    />

                    <div className="add-position__benefit-name">
                      {BenefitName.Relocation}
                    </div>
                  </div>

                  <div className="add-position__benefit">
                    <Checkbox
                      checked={benefits.includes(BenefitName.Meals)}
                      onClick={() => {
                        handleBenefitsClick(
                          BenefitName.Meals
                        );
                      }}
                    />

                    <div className="add-position__benefit-name">
                      {BenefitName.Meals}
                    </div>
                  </div>

                  <div className="add-position__benefit">
                    <Checkbox
                      checked={benefits.includes(BenefitName.Insurrance)}
                      onClick={() => {
                        handleBenefitsClick(
                          BenefitName.Insurrance
                        );
                      }}
                    />

                    <div className="add-position__benefit-name">
                      {BenefitName.Insurrance}
                    </div>
                  </div>

                  <div className="add-position__benefit">
                    <Checkbox
                      checked={benefits.includes(BenefitName.Training)}
                      onClick={() => {
                        handleBenefitsClick(
                          BenefitName.Training
                        );
                      }}
                    />

                    <div className="add-position__benefit-name">
                      {BenefitName.Training}
                    </div>
                  </div>
                </div>

                <div className="add-position__benefits-column">
                  <div className="add-position__benefit">
                    <Checkbox
                      checked={benefits.includes(BenefitName.Airplane)}
                      onClick={() => {
                        handleBenefitsClick(
                          BenefitName.Airplane
                        );
                      }}
                    />

                    <div className="add-position__benefit-name">
                      {BenefitName.Airplane}
                    </div>
                  </div>

                  <div className="add-position__benefit">
                    <Checkbox
                      checked={benefits.includes(BenefitName.Accommodation)}
                      onClick={() => {
                        handleBenefitsClick(
                          BenefitName.Accommodation
                        );
                      }}
                    />

                    <div className="add-position__benefit-name">
                      {BenefitName.Accommodation}
                    </div>
                  </div>

                  <div className="add-position__benefit">
                    <Checkbox
                      checked={benefits.includes(BenefitName.Pension)}
                      onClick={() => {
                        handleBenefitsClick(
                          BenefitName.Pension
                        );
                      }}
                    />

                    <div className="add-position__benefit-name">
                      {BenefitName.Pension}
                    </div>
                  </div>

                  <div className="add-position__benefit">
                    <Checkbox
                      checked={benefits.includes(BenefitName.Bonuses)}
                      onClick={() => {
                        handleBenefitsClick(
                          BenefitName.Bonuses
                        );
                      }}
                    />

                    <div className="add-position__benefit-name">
                      {BenefitName.Bonuses}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="container m-position__container m-position__about">
            <div className="container__title">
              About me
            </div>

            <div className="container__text">
              Type a few words about you and why the companies should select you for this job
            </div>

            <div className="about__input-area">
              <Label
                title=''
                secondTitle={`${brief.length}/1000`}
                forArea
              >
                <InputArea
                  name='about-me'
                  value={brief}
                  onPaste={(e) => {
                    setTimeout(() => {
                      const clipboardData = (window as any).clipboardData || e.clipboardData;
                      const pastedText = clipboardData?.getData('text/plain');

                      if (pastedText && pastedText.length <= 1000) {
                        setDataChanged(true);
                        setBrief(pastedText);
                        setBriefError(false);
                      }
                    });
                  }}
                  onChange={(e) => {
                    if (e.target.value.length <= 1000) {
                      setDataChanged(true);
                      setBrief(e.target.value);
                      setBriefError(false);
                    };
                  }}
                  placeholder='Write a short description about yourself for companies'
                  error={briefError}
                />
              </Label>
            </div>
          </div>

          <div className="container m-position__container m-position__skills">
            <div className="container__title">
              Your skills
            </div>

            <div className="container__text">
              Add skills that you have relevant for the selected job position
            </div>

            <div className="skills__columns">
              <div className="skills__column">
                <Label title='add new skill' >
                  <div className="skills__skill">
                    <input
                      type="text"
                      value={query}
                      onChange={(e) => {
                        if (e.target.value.length < 28) {
                          setQuery(e.target.value);
                          setListError(false);
                        }
                      }}
                      placeholder='type your top skills'
                      className={classNames('skills__input',{
                        'skills__input--error': listError
                      })}
                    />

                    <div
                      className={classNames("skills__add", {
                        "skills__add--disabled": skillList.length > 15
                      })}
                      onClick={() => {
                        if (!query.length) {
                          setListError(true);
                          return;
                        }

                        if (skillList.length < 16) {
                          handleAddSkill(query, skillList);
                          return;
                        }
                      }}
                    >
                      Add
                    </div>
                  </div>
                </Label>

                {/* {showError && ( */}
                {true && (
                  <div className="skills__error-message">
                    {errorMessage}
                  </div>
                )}
              </div>

              <div className="skills__column">
                <Label title={labelTitle} >
                  {skillList.map(skill => (
                    <div key={skill} className ="skills__skill">
                      <div className="skills__skill-name">
                        {skill}
                      </div>

                      <div
                        className="skills__cross"
                        onClick={() => handleRemoveSkill(skill, skillList)}
                      >
                        <div className="skills__cross-icon"/>
                      </div>
                    </div>
                  ))}
                </Label>
              </div>
            </div>
          </div>
        </div>

        <div className="container m-position__container m-position__video">
          <div className="container__title">
            Video presentation
          </div>

          <div className="container__text">
            Add a skill video demo
          </div>

          <div className="flow-container__info-image flow-container__info-image--video"/>

          <div className="m-position__video-texts">
            <div className='flow-container__info-texts'>
              {infoTexts && infoTexts.map(infoText => (
                <div key={infoText.id} className="flow-container__info-text">
                  <div className="m-position__video--text">
                    &#x2022; {infoText.text}
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className={"m-position__video-field"}>
            {(!forEdit && !videoFile) || (forEdit && (!videoLink && !videoFile)) ? (
              <div className={classNames("demo-video__field demo-video__field--radius", {
                "demo-video__field--error": videoEmptyError
              })}>
                <input
                  type="file"
                  accept="video/*"
                  className={classNames("demo-video__drag-drop", {
                    "upload__input--drag-drop--disbled": isModelOpen,
                  })}
                  onChange={handleFileChange}
                />

                <div className="demo-video__field-icon"/>

                <div className="demo-video__field-title">
                  Add Video File
                </div>

                <div className="demo-video__field-text">
                  or drag & drop
                </div>
              </div>
            ) : (
              <video className='demo-video__video' width="400" controls>
                <source src={(videoFile && URL.createObjectURL(videoFile)) || (videoLink || '')} type="video/mp4" />
                Your browser does not support the video tag.
              </video>
            )}
          </div>

          {showError && (
            <div className="demo-video__error">
              MAXIMUM SIZE 200MB
            </div>
          )}

          <div className="m-position__video-bottom">
            {(!forEdit && !videoFile) || (forEdit && (!videoLink && !videoFile)) ? (
              <label htmlFor="upload-file" className="demo-video__upload-label">
                <input
                  type="file"
                  accept="video/*"
                  id="upload-file"
                  className="demo-video__upload-input"
                  onChange={handleFileChange}
                  onClick={(event) => {
                    const element = event.target as HTMLInputElement;
                    element.value = "";
                  }}
                />

                <div className="m-position__video-demo-video">
                  <ButtonWithIcon
                    text='UPLOAD VIDEO'
                    bgColor={ButtonColor.White}
                    color={ButtonColor.Green}
                    borderColor={ButtonColor.Green}
                    noIcon
                  />
                </div>
              </label>
            ) : (
              <div onClick={() => {
                setVideoFile(null);
                setVideoLink(null);
                setDataChanged(true);
              }}>
                <ButtonWithIcon
                  text='CHANGE VIDEO'
                  bgColor={ButtonColor.White}
                  color={ButtonColor.Blue}
                  borderColor={ButtonColor.Blue}
                  noIcon
                />
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
