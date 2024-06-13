'use client';
import '../../Add.scss';
import { SaveButtonType } from '@/types/SaveButtonType';
import { FlowContainer } from '../../FlowContainer';
import { SaveButtons } from '../../SaveButtons';
import { useRouter } from 'next/navigation';
import { useCallback, useEffect, useState } from 'react';
import { InputArea } from '@/components/utils/InputArea';
import { Label } from '@/components/utils/Label';
import { InputField } from '@/components/utils/InputField';
import { ICountry } from '@/types/Country';
import { CountrySelect } from '@/components/utils/CountrySelect';
import { CountryDropdown } from '@/components/utils/CountryDropdown';
import { MonthType } from '@/types/Month';
import { Select } from '@/components/utils/Select';
import { MonthDropdown } from '@/components/utils/MonthDropdown';
import { YearDropdown } from '@/components/utils/YearDropdown';
import { ICertification, deleteCertification, getOneCertification, postCertification, updateCertification } from '@/services/api/certifications.service';
import { CertificationIdStore, CertificationsStore } from '@/store/flowPagesData/certificationsStore';
import { useRecoilValue, useSetRecoilState } from 'recoil';
import { AxiosResponse } from 'axios';
import { monthsArray } from '@/components/utils/utils';
import { DateError } from '@/types/DateError';

type Props = {
  forEdit?: boolean;
  fromDashboard?: boolean;
};

export const AddCertifications: React.FC<Props> = ({ forEdit = false, fromDashboard = false}) => {
  const [certification, setCertification] = useState<string>('');
  const [institution, setInstitution] = useState<string>('');
  const [country, setCountry] = useState<ICountry | null>(null);
  const [month, setMonth] = useState<MonthType | null>(null);
  const [year, setYear] = useState<string>('');
  const [details, setDetails] = useState<string>('');
  const [monthDropdown, setMonthDropdown] = useState<boolean>(false);
  const [yearDropdown, setYearDropdown] = useState<boolean>(false);
  const [countryDropdown, setCountryDropdown] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const router = useRouter();
  //fields errors
  const [certificationError, setCertificationError] = useState<boolean>(false);
  const [institutionError, setInstitutionError] = useState<boolean>(false);
  const [countryError, setCountryError] = useState<boolean>(false);
  const [monthError, setMonthError] = useState<boolean>(false);
  const [yearError, setYearError] = useState<boolean>(false);
  const [dateError, setDateError] = useState<boolean>(false);
  const [dateErrorMessage, setDateErrorMessage] = useState<DateError | string>('');

  const certificationId = useRecoilValue(CertificationIdStore);
  const setCertifications = useSetRecoilState(CertificationsStore);
  const handleGoBack = useCallback(() => {
    if (fromDashboard) {
      router.push('/candidates/dashboard/profile/');
      return;
    }

    router.push('/candidates/flow/certifications/');
  }, []);

  const fetchOneCertification = useCallback(async (id: number) => {
    try {
      const resp: AxiosResponse<any, any> = await getOneCertification(id);
      const certificationFetched: ICertification = resp.data.data.data;
      const date = new Date(certificationFetched.issued_date);
      const month: MonthType | undefined = monthsArray.find(
        (month) => +month.id === date.getMonth()
      );
      const year = date.getFullYear();
      setCertification(certificationFetched.title);
      setInstitution(certificationFetched.institution);
      setCountry(certificationFetched.Country || null);
      setDetails(certificationFetched.description || '');
      setMonth(month || null);
      setYear(String(year));
    } catch (error) {}
  }, []);

  const handleDelete = useCallback(async (id: number) => {
    try {
      await deleteCertification(id)
      setCertifications(null);
      handleGoBack();
    } catch (error) {}
  }, []);

  useEffect(() => {
    if (forEdit) {
      if (!certificationId) {
        handleGoBack();
      } else {
        fetchOneCertification(certificationId);
      }
    };
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
    setDateError(false);
  }, []);

  const handleYearClick = useCallback((year: string) => {
    setYearDropdown(false);
    setYear(year);
    setYearError(false);
    setDateError(false);
  }, []);

  const handleAddCertification = async () => {
    let errorAppeared: boolean = false;

    if (!certification) {
      setCertificationError(true);
      errorAppeared = true;
    };
    if (!institution) {
      setInstitutionError(true);
      errorAppeared = true;
    };
    if (!country) {
      setCountryError(true);
      errorAppeared = true;
    };
    if (!year) {
      setYearError(true);
      errorAppeared = true;
    };
    if (!month) {
      setMonthError(true);
      errorAppeared = true;
    };
    if (errorAppeared) return;
    if (!month) return;
    if (!country) return;

    const issuedDate = new Date(+year, +month.id);

    const currentYear = (new Date()).getFullYear();
    const currentMonth = (new Date()).getMonth();

    if (issuedDate.getFullYear() >= currentYear) {
      if (issuedDate.getMonth() > currentMonth) {
        setDateError(true);
        setDateErrorMessage(DateError.EndDateToEarly);
        return;
      }
    }

    const certificationData: ICertification = {
      title: certification,
      institution: institution,
      country_id: country?.country_id,
      issued_date: String(issuedDate),
      description: details || null,
    };

    try {
      setIsLoading(true);
      if (!forEdit) await postCertification(certificationData);
      else if (forEdit && certificationId) await updateCertification(certificationId, certificationData);
      setCertifications(null);
      handleGoBack();
    } catch (error: any) {
      setIsLoading(false);
    }
  };

  return (
    <FlowContainer
      title={forEdit ? 'EDIT CERTIFICATION' : 'ADD A NEW CERTIFICATION'}
      text={'Certification complement your studies and learning. By showing them on your CV, potential employers see that you are committed to your job.'}
      forAddEdit
    >
      <div className="add">
        <div className="add__content">
          <div className="add__left">
            <div className="add__form">
              <div className="add__row">
                <div className="add__label add__label--first">
                  <Label title='CERTIFIED TITLE / POSITION'>
                    <InputField
                      type='text'
                      name='certification'
                      value={certification}
                      onChange={(e) => {
                        setCertification(e.target.value);
                        setCertificationError(false);
                      }}
                      error={certificationError}
                    />
                  </Label>
                </div>

                <div className="add__label">
                  <Label title='NAME OF THE INSTITUTION'>
                    <InputField
                      type='text'
                      name='institution'
                      value={institution}
                      onChange={(e) => {
                        setInstitution(e.target.value);
                        setInstitutionError(false);
                      }}
                      error={institutionError}
                    />
                  </Label>
                </div>
              </div>

              <div className="add__row">
                <div className="add__label add__label--laptop-no-mb add__label--first">
                  <Label title='COUNTRY OBTAINED'>
                    <div
                      className="add__select"
                      onClick={() => {
                        setCountryDropdown(!countryDropdown);
                        setMonthDropdown(false);
                        setYearDropdown(false);
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

                <div className="add__label add__label--laptop-no-mb">
                  <Label title='ISSUED ON'>
                    <div className="add__dates">
                      <div className="add__date">
                        <div
                          className="add__select"
                          onClick={() => {
                            setMonthDropdown(!monthDropdown);
                            setYearDropdown(false);
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

                      <div className="add__date">
                        <div
                          className="add__select"
                          onClick={() => {
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

                      {dateError && (
                        <div className="add__dates--error add__dates--error--cert">
                          {dateErrorMessage}
                        </div>
                      )}
                    </div>
                  </Label>
                </div>
              </div>
            </div>
          </div>

          <div className="add__right">
            <div className="add__area">
              <Label
                title='DETAILS'
                secondTitle={`${details.length}/300`}
                forArea
              >
                <InputArea
                  name='details'
                  value={details}
                  onChange={(e) => {
                    if (e.target.value.length <= 300) setDetails(e.target.value);
                  }}
                  placeholder={`     Please say how you obtained the certification, if it was received by only taking part in some classes, or because you’ve graduated from a certain class in your school, or you had to pass an exam to get it.

    Also, please explain what motivated you to take this certification.`}
                />
              </Label>
            </div>
          </div>
        </div>

        <div className="add__bottom">
          <SaveButtons
            buttonsType={!forEdit ? SaveButtonType.Add : SaveButtonType.Update}
            onSave={handleAddCertification}
            onCancel={handleGoBack}
            isSaveLoading={isLoading}
            onDelete={() => {
              if (certificationId) handleDelete(certificationId);
            }}
          />
        </div>
      </div>
    </FlowContainer>
  )
}
