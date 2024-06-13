'use client';
import '../Data.scss';
import { useRecoilState, useRecoilValue, useSetRecoilState } from 'recoil';
import { useCallback, useEffect } from 'react';
import { AxiosResponse } from 'axios';
import { FlowDataContainer, FlowDataIcon } from '../FlowDataContainer/FlowDataContainer';
import { ICertification, getCertifications } from '@/services/api/certifications.service';
import { CertificationIdStore, CertificationsStore } from '@/store/flowPagesData/certificationsStore';
import { FlagIcon } from '@/components/utils/FlagIcon';
import { monthsArray } from '@/components/utils/utils';
import { MonthType } from '@/types/Month';
import { useRouter } from 'next/navigation';
import { DataEditIcon } from '@/components/utils/DataEditIcon';
import { ISearchWorkers } from '@/services/api/serachWorkers.service';
import { WorkerDataStore } from '@/store/searchWorkersStore';
import { ApplicantOneStore, IApplicant } from '@/store/applicantsStore';

interface Props {
  forCompany?: boolean;
  forApplicant?: boolean;
};

export const CertificationsData: React.FC<Props> = ({ forCompany = false, forApplicant = false }) => {
  const [certifications, setCertifications] = useRecoilState(CertificationsStore);
  const router = useRouter();
  const setCertificationId = useSetRecoilState(CertificationIdStore);
  const workerData = useRecoilValue<ISearchWorkers | null>(WorkerDataStore);
  const applicantData = useRecoilValue<IApplicant | null>(ApplicantOneStore);

  const fetchCertifications = useCallback(async () => {
    try {
      const resp: AxiosResponse<any, any> = await getCertifications();
      const data: ICertification[] = resp.data.data.data;
      data.sort(
        (a, b) =>
          new Date(b.issued_date).getTime() - new Date(a.issued_date).getTime()
      );
      setCertifications(resp.data.data.data);
    } catch (error) {}
  }, []);

  useEffect(() => {
    if (forCompany) {
      if (!workerData) router.push('/dashboard/search-workers/');
    } else if (forApplicant) {
      if (!applicantData) router.push('/dashboard/applicants/');
    } else {
      if (!certifications) fetchCertifications();
    }
  }, []);

  return (
    <FlowDataContainer
      icon={FlowDataIcon.Certification}
      title='Cerifications'
      text='Other earned certifications'
      btnText='Add certification'
      forCompany={forCompany}
    >
    {forCompany && (
      <div className="data">
        {workerData?.Candidate.Certifications?.map(cert => {
          const {
            certification_id,
            Country,
            issued_date,
            title,
            institution,
            description,
          } = cert;

          monthsArray;
          const dateOptained: Date = new Date(issued_date);
          const year: number = dateOptained.getFullYear();
          const month: MonthType | undefined = monthsArray.find(
            (month) => +month.id === dateOptained.getMonth()
          );

          return (
            <div key={certification_id} className="data__item-container">
              <div className="data__item">
                <div className="data__item-content">
                  <div className="data__item-left">
                    <div className="data__flag">
                      <FlagIcon size={20} code={Country?.alpha_2 || ''}/>
                    </div>

                    <div className="data__info">
                      <div className="data__title">
                        {title}
                      </div>

                      <div className="data__info-bottom">
                        <div className="data__text">
                          {institution}
                        </div>

                        <div className="data__text data__text--gray">
                          &#x2022; {Country?.name || ''}
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="data__item-right">
                    <div className="data__date">
                      <div className="data__date-name">
                        Date Optained
                      </div>

                      <div className="data__date-text">
                        {month?.name.slice(0, 3)} {year}
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="data__desc data__desc--ml">
                {description}
              </div>
            </div>
          )
        })}
      </div>
    )}

    {forApplicant && (
      <div className="data">
        {applicantData?.Candidate.Certifications?.map(cert => {
          const {
            certification_id,
            Country,
            issued_date,
            title,
            institution,
            description,
          } = cert;

          monthsArray;
          const dateOptained: Date = new Date(issued_date);
          const year: number = dateOptained.getFullYear();
          const month: MonthType | undefined = monthsArray.find(
            (month) => +month.id === dateOptained.getMonth()
          );

          return (
            <div key={certification_id} className="data__item-container">
              <div className="data__item">
                <div className="data__item-content">
                  <div className="data__item-left">
                    <div className="data__flag">
                      <FlagIcon size={20} code={Country?.alpha_2 || ''}/>
                    </div>

                    <div className="data__info">
                      <div className="data__title">
                        {title}
                      </div>

                      <div className="data__info-bottom">
                        <div className="data__text">
                          {institution}
                        </div>

                        <div className="data__text data__text--gray">
                          &#x2022; {Country?.name || ''}
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="data__item-right">
                    <div className="data__date">
                      <div className="data__date-name">
                        Date Optained
                      </div>

                      <div className="data__date-text">
                        {month?.name.slice(0, 3)} {year}
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="data__desc data__desc--ml">
                {description}
              </div>
            </div>
          )
        })}
      </div>
    )}

    {!forCompany && !forApplicant && (
      <div className="data">
        {certifications?.map(cert => {
          const {
            certification_id,
            Country,
            issued_date,
            title,
            institution,
            description,
          } = cert;

          monthsArray;
          const dateOptained: Date = new Date(issued_date);
          const year: number = dateOptained.getFullYear();
          const month: MonthType | undefined = monthsArray.find(
            (month) => +month.id === dateOptained.getMonth()
          );

          return (
            <div key={certification_id} className="data__item-container">
              <div className="data__item">
                <div className="data__item-content">
                  <div className="data__item-left">
                    <div className="data__flag">
                      <FlagIcon size={20} code={Country?.alpha_2 || ''}/>
                    </div>

                    <div className="data__info">
                      <div className="data__title">
                        {title}
                      </div>

                      <div className="data__info-bottom">
                        <div className="data__text">
                          {institution}
                        </div>

                        <div className="data__text data__text--gray">
                          &#x2022; {Country?.name || ''}
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="data__item-right">
                    <div className="data__date">
                      <div className="data__date-name">
                        Date Optained
                      </div>

                      <div className="data__date-text">
                        {month?.name.slice(0, 3)} {year}
                      </div>
                    </div>
                  </div>
                </div>

                <div
                  className="data__options"
                  onClick={() => {
                    if (certification_id) {
                      setCertificationId(certification_id);
                      router.push("/candidates/dashboard/profile/certifications-edit");
                    }
                  }}
                >
                  <DataEditIcon />
                </div>
              </div>

              <div className="data__desc data__desc--ml">
                {description}
              </div>
            </div>
          )
        })}
      </div>
    )}
    </FlowDataContainer>
  )
}
