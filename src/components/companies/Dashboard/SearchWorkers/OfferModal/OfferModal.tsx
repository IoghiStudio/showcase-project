'use client';
import { WorkerDataStore } from '@/store/searchWorkersStore';
import './OfferModal.scss';
import { useRecoilValue } from 'recoil';
import { ISearchWorkers, ISendOffer, searchWorkers, sendOffer } from '@/services/api/serachWorkers.service';
import { IJobTitle } from '@/types/JobTitle';
import { useCallback, useEffect, useState } from 'react';
import { Label } from '@/components/utils/Label';
import { ICurrency } from '@/types/Currency';
import { Select } from '@/components/utils/Select';
import { JobTypeDropdown } from '@/components/utils/JobTypeDropdown';
import { InputField } from '@/components/utils/InputField';
import { BenefitList, customNumberValidator } from '@/components/utils/utils';
import { WorkplaceTypeDropdown } from '@/components/utils/WorkplaceTypeDropdown';
import { CurrencyDropdown } from '@/components/utils/CurrencyDropdown';
import { RecurrencyDropdown } from '@/components/utils/RecurrencyDropdown';
import { ContractDropdown } from '@/components/utils/ContractDropdown';
import { Checkbox } from '@/components/utils/Checkbox';
import { InputArea } from '@/components/utils/InputArea';
import classNames from 'classnames';
import { LoadingModal } from '@/components/utils/LoadingModal';

interface Props {
  onClose: () => void;
  worker?: ISearchWorkers | null;
  onRefetch?: () => void;
  resetStatus?: () => void;
  forView?: boolean;
};

export const OfferModal: React.FC<Props> = ({
  onClose,
  worker,
  onRefetch,
  resetStatus = () => {},
  forView,
}) => {
  const workerData = useRecoilValue<ISearchWorkers | null>(WorkerDataStore);
  const [jobTitle, setJobTitle] = useState<IJobTitle | null>(null);
  const [locationType, setLocationType] = useState<string>('');
  const [employmentType, setEmploymentType] = useState<string>('');
  const [salary, setSalary] = useState<string>('');
  const [currency, setCurrency] = useState<ICurrency | null>(null);
  const [recurrency, setRecurrency] = useState<string>('');
  const [minimumContract, setMinimumContract] = useState<string>('');
  const [description, setDescription] = useState<string>('');
  const [benefits, setBenefits] = useState<string[]>([]);

  const [locationTypeDropdown, setLocationTypeDropdown] = useState<boolean>(false);
  const [employmentTypeDropdown, setEmploymentTypeDropdown] = useState<boolean>(false);
  const [currencyDropdown, setCurrencyDropdown] = useState<boolean>(false);
  const [recurrencyDropdown, setRecurrencyDropdown] = useState<boolean>(false);
  const [contractDropdown, setContractDropdown] = useState<boolean>(false);

  const [salaryError, setSalaryError] = useState<boolean>(false);
  const [descriptionError, setDescriptionError] = useState<boolean>(false);

  const [onlyPreview, setOnlyPreview] = useState<boolean>(true);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  useEffect(() => {
    if (!worker) {
      if (!workerData) {
        onClose();
        return;
      }

      setJobTitle(workerData.JobTitle);
      setLocationType(workerData.location_type);
      setEmploymentType(workerData.type_of_employment);
      setSalary(String(workerData.desired_salary));
      setCurrency(workerData.Currency);
      setRecurrency(workerData.recurrency);
      setMinimumContract(workerData.minimum_contract);
      setBenefits(workerData.benefits);
    } else {
      setJobTitle(worker.JobTitle);
      setLocationType(worker.location_type);
      setEmploymentType(worker.type_of_employment);
      setSalary(String(worker.desired_salary));
      setCurrency(worker.Currency);
      setRecurrency(worker.recurrency);
      setMinimumContract(worker.minimum_contract);
      setBenefits(worker.benefits);
    }
  }, []);

  const handleLocationTypeClick = useCallback((lt: string) => {
    setLocationTypeDropdown(false);
    setLocationType(lt);
  }, []);

  const handleEmploymentTypeClick = useCallback((jobType: string) => {
    setEmploymentTypeDropdown(false);
    setEmploymentType(jobType);
  }, []);

  const handleCurrencyClick = useCallback((currency: ICurrency) => {
    setCurrencyDropdown(false);
    setCurrency(currency);
  }, []);

  const handleRecurrencyClick = useCallback((recurrency: string) => {
    setRecurrencyDropdown(false);
    setRecurrency(recurrency);
  }, []);

  const handleContractClick = useCallback((contract: string) => {
    setContractDropdown(false);
    setMinimumContract(contract);
  }, []);

  useEffect(() => {
    if (onlyPreview) {
      setLocationTypeDropdown(false);
      setEmploymentTypeDropdown(false);
      setCurrencyDropdown(false);
      setRecurrencyDropdown(false);
      setContractDropdown(false);
    }
  }, [onlyPreview]);

  const sendJobOffer = async () => {
    let errorOccured = false;
    if (!currency) return;
    if (!jobTitle) return;
    if (!salary) {
      errorOccured = true;
      setSalaryError(true);
    };
    if (!description) {
      errorOccured = true;
      setDescriptionError(true);
    };
    if (errorOccured) return;

    const data: ISendOffer = {
      benefits,
      recurrency,
      description,
      currency: currency.code,
      salary: +salary,
      job_title_id: jobTitle.job_title_id,
      job_position_id:!worker ? workerData?.job_position_id || 1 : worker?.job_position_id || 1,
      candidate_id: !worker ? workerData?.Candidate.candidate_id || 1 : worker?.Candidate.candidate_id || 1,
      type_of_employment: employmentType,
      minimum_contract: minimumContract,
      workplace_type: locationType,
      job_experience:!worker ? workerData?.job_experience || 1: worker?.job_experience || 1,
      due_date: String(new Date(new Date().setDate(new Date().getDate() + 3)))
    };

    try {
      setIsLoading(true);
      await sendOffer(data);
      if (onRefetch) onRefetch();
      resetStatus();
      onClose();
      setIsLoading(false);
    } catch (error) {
      setIsLoading(false);
    }
  };

  return (
    <div onClick={onClose} className="offer-modal">
      <div onClick={e => e.stopPropagation()} className="container offer-modal__content">
        <div className="offer-modal__top">
          <div onClick={onClose} className="offer-modal__cross"/>

          {!forView ? (
            <div className="offer-modal__title">
              SEND A JOB OFFER
            </div>
          ) : (
            <div className="offer-modal__title">
              JOB OFFER SENT
            </div>
          )}

          {!forView ? (
            <div className="offer-modal__text">
              Only submit job offers for positions the candidate is intrested in
            </div>
          ) : (
            <div className="offer-modal__text">
              Preview the job offer sent
            </div>
          )}

          <div className="offer-modal__columns">
            <div className="offer-modal__column offer-modal__column--first">
              <div className="offer-modal__label">
                <Label title='Selected Position'>
                  <InputField
                    type='name'
                    name='name'
                    value={jobTitle?.name || ''}
                    onChange={e => {}}
                    isDisabled
                  />
                </Label>
              </div>

              <div className="offer-modal__label">
                <Label title='workplace type'>
                  <div
                    className="add__select"
                    onClick={() => {
                      if (onlyPreview) return;
                      setLocationTypeDropdown(!locationTypeDropdown);
                      setEmploymentTypeDropdown(false);
                      setCurrencyDropdown(false);
                      setRecurrencyDropdown(false);
                      setContractDropdown(false);
                    }}
                  >
                    <Select
                      value={locationType || ''}
                      error={false}
                      isDisabled={onlyPreview}
                    />
                  </div>

                  <WorkplaceTypeDropdown
                    isOpen={locationTypeDropdown}
                    onSelect={handleLocationTypeClick}
                  />
                </Label>
              </div>

              <div className="offer-modal__label">
                <Label title='type of employment'>
                  <div
                    className="add__select"
                    onClick={() => {
                      if (onlyPreview) return;
                      setLocationTypeDropdown(false);
                      setEmploymentTypeDropdown(!employmentTypeDropdown);
                      setCurrencyDropdown(false);
                      setRecurrencyDropdown(false);
                      setContractDropdown(false);
                    }}
                  >
                    <Select
                      value={employmentType || ''}
                      error={false}
                      isDisabled={onlyPreview}
                    />
                  </div>

                  <JobTypeDropdown
                    isOpen={employmentTypeDropdown}
                    onSelect={handleEmploymentTypeClick}
                  />
                </Label>
              </div>

              <div className="offer-modal__label">
                <Label title='salary offered'>
                  <InputField
                    type='text'
                    name='salary'
                    value={salary}
                    onChange={e => {
                      customNumberValidator(e, setSalary);
                      setSalaryError(false);
                    }}
                    error={salaryError}
                    isDisabled={onlyPreview}
                  />
                </Label>
              </div>

              <div className="offer-modal__label">
                <Label title='CONTRACT DURATION'>
                  <div
                    className="add__select"
                    onClick={() => {
                      if (onlyPreview) return;
                      setLocationTypeDropdown(false);
                      setEmploymentTypeDropdown(false);
                      setCurrencyDropdown(false);
                      setRecurrencyDropdown(false);
                      setContractDropdown(!contractDropdown);
                    }}
                  >
                    <Select
                      value={minimumContract || ''}
                      error={false}
                      isDisabled={onlyPreview}
                    />
                  </div>

                  <ContractDropdown
                    isOpen={contractDropdown}
                    onSelect={handleContractClick}
                  />
                </Label>
              </div>

              <div className="offer-modal__row">
                <div className="offer-modal__label offer-modal__label--first">
                  <Label title='currency'>
                    <div
                      className="add__select"
                      onClick={() => {
                        if (onlyPreview) return;
                        setLocationTypeDropdown(false);
                        setEmploymentTypeDropdown(false);
                        setCurrencyDropdown(!currencyDropdown);
                        setRecurrencyDropdown(false);
                        setContractDropdown(false);
                      }}
                    >
                      <Select
                        value={currency?.code || ''}
                        error={false}
                        isDisabled={onlyPreview}
                      />
                    </div>

                    <CurrencyDropdown
                      isOpen={currencyDropdown}
                      onSelect={handleCurrencyClick}
                    />
                  </Label>
                </div>

                <div className="offer-modal__label">
                  <Label title='recurrency'>
                    <div
                      className="add__select"
                      onClick={() => {
                        if (onlyPreview) return;
                        setLocationTypeDropdown(false);
                        setEmploymentTypeDropdown(false);
                        setCurrencyDropdown(false);
                        setRecurrencyDropdown(!recurrencyDropdown);
                        setContractDropdown(false);
                      }}
                    >
                      <Select
                        value={recurrency || ''}
                        error={false}
                        isDisabled={onlyPreview}
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

            <div className="offer-modal__column">
              <div className="offer-modal__label">
                <Label title='benefits offered'>
                  {!onlyPreview ? (
                    <div className="offer-modal__benefits">
                      {BenefitList.map(benefit => (
                        <div
                          key={benefit.id}
                          className="offer-modal__benefit"
                        >
                          <Checkbox
                            checked={benefits.includes(benefit.name)}
                            onClick={() => {
                              let newBenefits: string[] = [...benefits];

                              if (!benefits.includes(benefit.name)) {
                                newBenefits.push(benefit.name);
                              } else {
                                newBenefits = newBenefits.filter(b => b !== benefit.name);
                              }

                              setBenefits(newBenefits);
                            }}
                          />

                          <div className="offer-modal__benefit-name">{benefit.name}</div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="offer-modal__benefits">
                      {benefits.map(benefit => (
                        <div key={benefit} className="offer-modal__benefit">
                          <div className="offer-modal__benefit-icon"/>

                          <div className="offer-modal__benefit-name">{benefit}</div>
                        </div>
                      ))}
                    </div>
                  )}
                </Label>
              </div>

              <div className="offer-modal__label offer-modal__label--area">
                <Label
                  title='About job'
                  secondTitle={`${description.length}/3000`}
                  forArea
                >
                  <InputArea
                    name='about-me'
                    value={!forView ? description : workerData?.JobOffer?.description || ''}
                    onChange={(e) => {
                      if (forView) return;
                      if (e.target.value.length <= 3000) {
                        setDescription(e.target.value);
                        setDescriptionError(false);
                      };
                    }}
                    placeholder='Write a short description about this job'
                    error={descriptionError}
                  />
                </Label>
              </div>
            </div>
          </div>
        </div>

        {!forView && (
          <div className="offer-modal__bottom">
            <div
              className={classNames("offer-modal__btn offer-modal__btn--first", {
                "offer-modal__btn--adjust": onlyPreview,
                "offer-modal__btn--cancel": !onlyPreview
              })}
              onClick={() => setOnlyPreview(!onlyPreview)}
            >
              {onlyPreview ? 'Adjust offer' : 'Cancel'}
            </div>

            <div
              onClick={sendJobOffer}
              className={"offer-modal__btn offer-modal__btn--send"}
            >
              {!isLoading ? (
                `${onlyPreview ? 'Send job offer' : 'Send custom offer'}`
              ) : (
                <LoadingModal />
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
