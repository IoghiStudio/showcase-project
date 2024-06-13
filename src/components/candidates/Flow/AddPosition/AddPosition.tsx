'use client';
import './AddPosition.scss';
import { FlowPageName, FlowPageText } from '@/types/FlowPage';
import { FlowContainer } from '../FlowContainer';
import { Label } from '@/components/utils/Label';
import { Checkbox } from '@/components/utils/Checkbox';
import { NextStep, NextStepInfo } from '../NextStep';
import { useCallback, useEffect, useState } from 'react';
import { InputField } from '@/components/utils/InputField';
import { customNumberValidator } from '@/components/utils/utils';
import { BenefitName } from '@/types/Benefits';
import { IJobTitle } from '@/types/JobTitle';
import { JobTitleDropdown } from '@/components/utils/JobTitleDropdown';
import { Select } from '@/components/utils/Select';
import { JobTypeDropdown } from '@/components/utils/JobTypeDropdown';
import { WorkplaceTypeDropdown } from '@/components/utils/WorkplaceTypeDropdown';
import { RecurrencyDropdown } from '@/components/utils/RecurrencyDropdown';
import { ICurrency } from '@/types/Currency';
import { CurrencyDropdown } from '@/components/utils/CurrencyDropdown';
import { IFullPosition, IPositionFromFlow, getPosition, postPositionFromFlow } from '@/services/api/jobPosition.service';
import { AxiosResponse } from 'axios';
import { ContractDropdown } from '@/components/utils/ContractDropdown';
import { JobPositionIdStore } from '@/store/jobPositionStore';
import { RecoilState, useSetRecoilState } from 'recoil';
import { useRouter } from 'next/navigation';

const infoTexts: FlowPageText[] = [
  {
    id: '1',
    text: 'The job position that you select should be in accordance with your education, training, and work experience.'
  },
  {
    id: '2',
    text: 'All employers who will seek workers for that job will see you and will be allowed to contact you.'
  },
  {
    id: '3',
    text: 'You will see all employers’ job openings, but you will be able to apply only to those for your job.'
  },
];

export const AddPosition = () => {
  const [jobTitle, setJobTitle] = useState<IJobTitle | null>(null);
  const [typeOfJob, setTypeOfJob] = useState<string>('');
  const [desiredSalary, setDesiredSalary] = useState<string>('');
  const [experienceYears, setExperienceYears] = useState<string>('');
  const [currency, setCurrency] = useState<ICurrency | null>(null);
  const [recurrency, setRecurrency] = useState<string>('');
  const [workplaceType, setWorkplaceType] = useState<string>('');
  const [minimumContract, setMinimumContract] = useState<string>('');

  const [jobTitleDropdown, setJobTitleDropdown] = useState<boolean>(false);
  const [typeOfJobDropdown, setTypeOfJobDropdown] = useState<boolean>(false);
  const [currencyDropdown, setCurrencyDropdown] = useState<boolean>(false);
  const [recurrencyDropdown, setRecurrencyDropdown] = useState<boolean>(false);
  const [workplaceTypeDropdown, setWorkplaceTypeDropdown] = useState<boolean>(false);
  const [minimumContractDropdown, setMinimumContractDropdown] = useState<boolean>(false);

  const [jobTitleError, setJobTitleError] = useState<boolean>(false);
  const [typeOfJobError, setTypeOfJobError] = useState<boolean>(false);
  const [experienceError, setExperienceError] = useState<boolean>(false);
  const [currencyError, setCurrencyError] = useState<boolean>(false);
  const [recurrencyError, setRecurrencyError] = useState<boolean>(false);
  const [workplaceTypeError, setWorkplaceTypeError] = useState<boolean>(false);
  const [minimumContractError, setMinimumContractError] = useState<boolean>(false);
  const [desiredSalaryError, setDesiredSalaryError] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const [benefits, setBenefits] = useState<string[]>([]);
  const [relocation, setRelocation] = useState<boolean>(false);
  const [meals, setMeals] = useState<boolean>(false);
  const [insurrance, setInsurrance] = useState<boolean>(false);
  const [training, setTraining] = useState<boolean>(false);
  const [airplane, setAirplane] = useState<boolean>(false);
  const [accommodation, setAccommodation] = useState<boolean>(false);
  const [pension, setPension] = useState<boolean>(false);
  const [bonuses, setBonuses] = useState<boolean>(false);

  const router = useRouter();

  const fetchJobPosition = useCallback(async(id: number) => {
      try {
        const resp: AxiosResponse<any, any> = await getPosition(id);
        const data: IFullPosition[] = resp.data.data.data;
      } catch (error) {}
  }, []);

  useEffect(() => {
    const id: string | null = localStorage.getItem('flow_position_id');

    if (id) fetchJobPosition(+id);
  }, [])


  const updateBenefits = (benefitToAdd: BenefitName) => {
    setBenefits((state) => [...state, benefitToAdd]);
  };

  const removeBenefit = (benefitToRemove: BenefitName) => {
    setBenefits((state) =>
      state.filter((benefit) => benefit !== benefitToRemove)
    );
  };

  const handleBenefitsClick = (
    benefitStateName: boolean,
    benefitMessage: BenefitName
  ) => {
    if (!benefitStateName) {
      updateBenefits(benefitMessage);
    } else {
      removeBenefit(benefitMessage);
    }
  };

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
    setCurrency(currency);
    setCurrencyDropdown(false);
    setCurrencyError(false);
  }, []);

  const handleMinimumContractClick = useCallback((contract: string) => {
    setMinimumContract(contract);
    setMinimumContractDropdown(false);
    setMinimumContractError(false);
  }, []);

  const handleAddPositinFromFlow = async () => {
    let errorAppeared: boolean = false;
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
    if (errorAppeared) return;
    if (!jobTitle) return;
    if (!currency) return;

    const data: IPositionFromFlow = {
      job_title_id: jobTitle?.job_title_id,
      type_of_employment: typeOfJob,
      currency_id: currency?.currency_id,
      recurrency: recurrency,
      desired_salary: Number(desiredSalary),
      job_experience: Number(experienceYears),
      minimum_contract: minimumContract,
      location_type: workplaceType,
      benefits: benefits,
    };

    try {
      setIsLoading(true);
      const resp: AxiosResponse<any, any> = await postPositionFromFlow(data);
      const positionReceived: IFullPosition = resp.data.data.data;
      localStorage.setItem('flow_position_id', String(positionReceived.job_position_id));
      router.push('/candidates/steps/relocation/');
    } catch (error) {
      setIsLoading(false);
    }
  };

  return (
    <FlowContainer
      title={'ADD THE FIRST JOB POSITION'}
      text={'Add your first job position for which you want to be listed on the platform. You can add more job positions later from your account.'}
      pageName={FlowPageName.AddJob}
      infoTexts={infoTexts}
    >
      <div className="add-position">
        <div className="add-position__form">
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
            <div className="add-position__label add-position__label--first">
              <Label title='DESIRED SALARY'>
                <InputField
                  type='text'
                  name='desiredSalary'
                  value={desiredSalary}
                  onChange={e => {
                    customNumberValidator(e, setDesiredSalary);
                    setDesiredSalaryError(false);
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
                  onChange={e => {
                    customNumberValidator(e, setExperienceYears);
                    setExperienceError(false);
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
              REQUESTED BENEFITS
            </div>

            <div className="add-position__benefits-columns">
              <div className="add-position__benefits-column">
                <div className="add-position__benefit">
                  <Checkbox
                    checked={relocation}
                    onClick={() => {
                      handleBenefitsClick(
                        relocation,
                        BenefitName.Relocation
                      );

                      setRelocation(!relocation);
                    }}
                  />

                  <div className="add-position__benefit-name">
                    {BenefitName.Relocation}
                  </div>
                </div>

                <div className="add-position__benefit">
                  <Checkbox
                    checked={meals}
                    onClick={() => {
                      handleBenefitsClick(
                        meals,
                        BenefitName.Meals
                      );

                      setMeals(!meals);
                    }}
                  />

                  <div className="add-position__benefit-name">
                    {BenefitName.Meals}
                  </div>
                </div>

                <div className="add-position__benefit">
                  <Checkbox
                    checked={insurrance}
                    onClick={() => {
                      handleBenefitsClick(
                        insurrance,
                        BenefitName.Insurrance
                      );

                      setInsurrance(!insurrance);
                    }}
                  />

                  <div className="add-position__benefit-name">
                    {BenefitName.Insurrance}
                  </div>
                </div>

                <div className="add-position__benefit">
                  <Checkbox
                    checked={training}
                    onClick={() => {
                      handleBenefitsClick(
                        training,
                        BenefitName.Training
                      );

                      setTraining(!training);
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
                    checked={airplane}
                    onClick={() => {
                      handleBenefitsClick(
                        airplane,
                        BenefitName.Airplane
                      );

                      setAirplane(!airplane);
                    }}
                  />

                  <div className="add-position__benefit-name">
                    {BenefitName.Airplane}
                  </div>
                </div>

                <div className="add-position__benefit">
                  <Checkbox
                    checked={accommodation}
                    onClick={() => {
                      handleBenefitsClick(
                        accommodation,
                        BenefitName.Accommodation
                      );

                      setAccommodation(!accommodation);
                    }}
                  />

                  <div className="add-position__benefit-name">
                    {BenefitName.Accommodation}
                  </div>
                </div>

                <div className="add-position__benefit">
                  <Checkbox
                    checked={pension}
                    onClick={() => {
                      handleBenefitsClick(
                        pension,
                        BenefitName.Pension
                      );

                      setPension(!pension);
                    }}
                  />

                  <div className="add-position__benefit-name">
                    {BenefitName.Pension}
                  </div>
                </div>

                <div className="add-position__benefit">
                  <Checkbox
                    checked={bonuses}
                    onClick={() => {
                      handleBenefitsClick(
                        bonuses,
                        BenefitName.Bonuses
                      );

                      setBonuses(!bonuses);
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

        <div className="add-position__bottom">
          <NextStep
            onClick={handleAddPositinFromFlow}
            nextStep={NextStepInfo.Relocation}
            isLoading={isLoading}
          />
        </div>
      </div>
    </FlowContainer>
  )
}
function useSetRecoilValue(JobPositionIdStore: RecoilState<number | null>) {
  throw new Error('Function not implemented.');
}

