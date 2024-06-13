'use client';
import { AnnouncesStore, IAnnounce } from '@/store/announceStore';
import './MainCompany.scss';
import { MessagesPreview } from './MessagesPreview/MessagesPreview';
import { useRecoilState, useRecoilValue, useSetRecoilState } from 'recoil';
import { useCallback, useEffect, useState } from 'react';
import { AxiosResponse } from 'axios';
import { getAnnounces } from '@/services/api/job.service';
import { useRouter } from 'next/navigation';
import { formatDateShort } from '@/components/utils/utils';
import { IApplicant } from '@/store/applicantsStore';
import { getApplicants } from '@/services/api/applicants.service';
import { FlagIcon } from '@/components/utils/FlagIcon';
import { CandidateHeaderMessageStore, CandidateHeaderMessages } from '@/store/headerStore';

export const MainCompany = () => {
  const [announces, setAnnounces] = useState<IAnnounce[] | null>(null);
  const [applicants, setApplicants] = useState<IApplicant[] | null>(null);
  const router = useRouter();
  const setCandidateHeaderMessage = useSetRecoilState(CandidateHeaderMessageStore);

  const fetchAnnounces = useCallback(async () => {
    try {
      const resp: AxiosResponse<any, any> = await getAnnounces(`?page=${1}&pageSize=${4}`);
      const data: IAnnounce[] = resp.data.data.data;
      setAnnounces(data);
    } catch (error) {}
  }, []);

  const fetchApplicants = useCallback(async () => {
    try {
      const resp: AxiosResponse<any, any> = await getApplicants();
      const data: IApplicant[] = resp.data.data.data;
      setApplicants(data);
    } catch (error) {}
  }, []);

  useEffect(() => {
    fetchAnnounces();
    setCandidateHeaderMessage(CandidateHeaderMessages.Dashboard);
    fetchApplicants();
  }, []);

  return (
    <div className="main-company">
      <div className="main-company__top">
        <div className="container main-company__announces">
          <div className="main-company__announces-top">
            <div className="container__title">
              Announcements
            </div>

            <div className="container__text">
              Active job listings
            </div>
          </div>

          {announces?.map(ann => (
            <div className="main-company__announces-item">
              <div className="main-company__announces-name">
                {ann.JobTitle.name}
              </div>

              <div className="main-company__announces-date">
                {`Expire on ${formatDateShort(ann.due_date || '')}`}
              </div>
            </div>
          ))}

          <div className="main-company__announces-bottom">
            <div onClick={() => router.push('/dashboard/announcements/')} className="main-company__see-all">
              SEE ALL
            </div>
          </div>
        </div>

        <div className="container main-company__offers">
          <div className="main-company__announces-top">
            <div className="container__title">
              Latest received CVs
            </div>

            <div className="container__text">
              This are the applicants
            </div>
          </div>

          {applicants?.slice(0, 2).map(ann => (
            <div className="main-company__announces-item">
              <div className="applicant-cv">
                <div className="applicant-cv__top">
                  <div className="applicant-cv__picture-container">
                    <img
                      src={ann.Candidate.profile_image || ''}
                      alt=''
                      className="applicant-cv__picture"
                    />

                    <div className="applicant-cv__flag">
                      <FlagIcon size={20} code={ann.Candidate.Country.alpha_2 || ''} />
                    </div>
                  </div>

                  <div className="applican-cv__right">
                    <div className="applicant-cv__name">
                      {`${ann.Candidate.firstname} ${ann.Candidate.lastname}`}
                    </div>

                    <div className="applicant-cv__job-title">
                      {ann.JobPosition.JobTitle?.name || ''}
                    </div>

                    <div className="applicant-cv__country-name">
                      {ann.Candidate.Country.name || ''}
                    </div>
                  </div>
                </div>

                <div className="applicant-cv__rows">
                  <div className="applicant-cv__pair">
                    <div className="applicant-cv__pair-title">
                      Job experience
                    </div>

                    <div className="applicant-cv__pair-text">
                      {`${ann.JobPosition.job_experience} years`}
                    </div>
                  </div>

                  <div className="applicant-cv__pair applicant-cv__pair--second">
                    <div className="applicant-cv__pair-title">
                      Desired location type
                    </div>

                    <div className="applicant-cv__pair-text">
                      {`${ann.JobPosition.location_type}`}
                    </div>
                  </div>
                </div>

                <div className="applicant-cv__rows">
                  <div className="applicant-cv__pair">
                    <div className="applicant-cv__pair-title">
                      Desired salary
                    </div>

                    <div className="applicant-cv__pair-text">
                      {`${ann.JobPosition.desired_salary} ${ann.JobPosition.Currency?.code}/${ann.JobPosition.recurrency}`}
                    </div>
                  </div>

                  <div className="applicant-cv__pair applicant-cv__pair--second">
                    <div className="applicant-cv__pair-title">
                      Desired employment type
                    </div>

                    <div className="applicant-cv__pair-text">
                      {`${ann.JobPosition.type_of_employment}`}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}

          <div className="main-company__announces-bottom">
            <div onClick={() => router.push('/dashboard/applicants/')} className="main-company__see-all">
              SEE ALL RECEIVED CVS
            </div>
          </div>
        </div>
      </div>

      <div className="main-company__bottom">
        <div className="main-company__messages">
          <MessagesPreview forCompany/>
        </div>

        <div className="main-company__immigration">
          <div className="container immigration">
            <div className="immigration__icon"/>

            <div className="immigration__right">
              <div className="immigration__headline">
                IMMIGRATION INFORMATIONS
              </div>

              <div className="immigration__title">
                Get Help Now
              </div>

              <div className="immigration__subtitle">
                with your immigration documents
              </div>

              <div className="immigration__text">
                Get more information & direct services.
              </div>

              <div className="immigration__button">
                <div className="immigration__button-icon"/>

                <div className="immigration__button-text">
                  GET HELP NOW
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
