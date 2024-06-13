'use client';
import './WorkerProfile.scss';
import '../../../../candidates/Dashboard/Profile/Profile.scss';
import { ISearchWorkers, SentJobOfferStatus } from '@/services/api/serachWorkers.service';
import { useRecoilState, useRecoilValue } from 'recoil';
import { WorkerDataStore } from '@/store/searchWorkersStore';
import { useCallback, useEffect, useState } from 'react';
import { UserData } from '@/components/candidates/Dashboard/Profile/UserData';
import { ExperienceData } from '@/components/candidates/Dashboard/Profile/ExperienceData';
import { EducationData } from '@/components/candidates/Dashboard/Profile/EducationData';
import { CertificationsData } from '@/components/candidates/Dashboard/Profile/CertificationsData';
import { CoursesData } from '@/components/candidates/Dashboard/Profile/CoursesData';
import { LanguagesData } from '@/components/candidates/Dashboard/Profile/LanguagesData';
import { DrivingData } from '@/components/candidates/Dashboard/Profile/DrivingData';
import { PD } from '../PD';
import { useRouter } from 'next/navigation';
import { AboutData } from '@/components/candidates/Dashboard/Profile/AboutData';
import { SkillsData } from '@/components/candidates/Dashboard/Profile/SkillsData';
import { OfferModal } from '../OfferModal';
import { ApplicantOneStore, IApplicant } from '@/store/applicantsStore';
import { AcceptModal } from '@/components/candidates/Dashboard/Offers/AcceptModal';
import { applicantAccept, applicantReject, getApplicantOne } from '@/services/api/applicants.service';
import { AxiosResponse } from 'axios';
import { JobApplyStatus } from '@/store/jobStore';

interface Props {
  forApplicant?: boolean;
};

export const WorkerProfile: React.FC<Props> = ({ forApplicant = false }) => {
  const router = useRouter();
  const workerData = useRecoilValue<ISearchWorkers | null>(WorkerDataStore);
  const [applicantData, setApplicantData] = useRecoilState<IApplicant | null>(ApplicantOneStore);
  const [openSendOffer, setOpenSendOffer] = useState<boolean>(false);
  const [offerJustSent, setOfferJustSend] = useState<boolean>(false);
  const [modalAccept, setModalAccept] = useState<boolean>(false);
  const [modalReject, setModalReject] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  useEffect(() => {
    if (!forApplicant) {
      if (!workerData) router.push('/dashboard/search-workers/');
    } else {
      if (!applicantData) router.push('/dashboard/applicants/');
    }
    console.log(workerData)
  }, [workerData, applicantData]);

  const handleOpenSendOffer = useCallback(() => {
    setOpenSendOffer(true);
  }, []);

  const handleCloseSendOffer = useCallback(() => {
    setOpenSendOffer(false);
  }, []);

  const fetchApplicant = useCallback(async () => {
    try {
      const resp: AxiosResponse<any, any> = await getApplicantOne(applicantData?.applicant_id || 0);
      const applicantFetched: IApplicant = resp.data.data.data;
      setApplicantData(applicantFetched);
    } catch (error) {}
  }, []);

  const handleAcceptApplicant = useCallback(async (applicant_id: number) => {
    try {
      setIsLoading(true);
      await applicantAccept({ applicant_id });
      fetchApplicant();
      setModalAccept(false);
      setIsLoading(false);
    } catch (error) {
      setIsLoading(false);
    }
  }, []);

  const handleRejectApplicant = useCallback(async (reason: string, applicant_id: number) => {
    try {
      setIsLoading(true);
      await applicantReject({ applicant_id, reason });
      fetchApplicant();
      setModalReject(false);
      setIsLoading(false);
    } catch (error) {
      setIsLoading(false);
    }
  }, []);

  return (
    <div className="worker-profile">
      {openSendOffer && (
        <OfferModal
          resetStatus={() => {
            setOfferJustSend(true);
            console.log('offer sent');
          }}
          onClose={handleCloseSendOffer}
          worker={workerData}
        />
      )}

      {modalAccept && (
        <AcceptModal
          isLoading={isLoading}
          onAccept={() => handleAcceptApplicant(applicantData?.applicant_id || 0)}
          onClose={() => setModalAccept(false)}
          forApplicant
        />
      )}

      {modalReject && (
        <AcceptModal
          isLoading={isLoading}
          forReject
          onReject={(reason: string) => handleRejectApplicant(reason, applicantData?.applicant_id || 0)}
          onClose={() => setModalReject(false)}
          forApplicant
        />
      )}

      {!forApplicant ? (
        <>
          {(((!workerData?.JobOffer) || ((workerData.JobOffer.status === SentJobOfferStatus.OfferSent) && workerData.isExpired))
            && !offerJustSent
          ) && (
            <div className="worker-profile__buttons">
              <div className="worker-profile__btn worker-profile__btn--red">
                <div className="worker-profile__btn-icon worker-profile__btn-icon--cross"/>

                <div className="worker-profile__btn-text">
                  Block candidate
                </div>
              </div>

              <div onClick={handleOpenSendOffer} className="worker-profile__btn">
                <div className="worker-profile__btn-icon worker-profile__btn-icon--check"/>

                <div className="worker-profile__btn-text">
                  Send job offer
                </div>
              </div>
            </div>
          )}
        </>
      ) : (
        <>
          {applicantData?.status === JobApplyStatus.Applied && (
            <div className="worker-profile__buttons">
              <div onClick={() => setModalReject(true)} className="worker-profile__btn worker-profile__btn--red">
                <div className="worker-profile__btn-icon worker-profile__btn-icon--cross"/>

                <div className="worker-profile__btn-text">
                  Reject candidate
                </div>
              </div>

              <div onClick={() => setModalAccept(true)} className="worker-profile__btn">
                <div className="worker-profile__btn-icon worker-profile__btn-icon--check"/>

                <div className="worker-profile__btn-text">
                  Accept candidate
                </div>
              </div>
            </div>
          )}
        </>
      )}

      {!forApplicant ? (
        <>
          {workerData?.JobOffer?.status === SentJobOfferStatus.Accepted && (
            <div className="worker-profile__buttons">
              <div className="worker-profile__btn worker-profile__btn--red">
                <div className="worker-profile__btn-icon worker-profile__btn-icon--cross"/>

                <div className="worker-profile__btn-text">
                  Reject
                </div>
              </div>

              <div onClick={() => {
                router.push(`/dashboard/messages?chatRoomId=${workerData.JobOffer?.ChatToJobOffer.chat_room_id}`)
              }} className="worker-profile__btn">
                <div className="worker-profile__btn-icon worker-profile__btn-icon--chat"/>

                <div
                  className="worker-profile__btn-text">
                  Contact
                </div>
              </div>
            </div>
          )}
        </>
      ) : (
        <>
          {applicantData?.status === JobApplyStatus.Accepted && (
            <div className="worker-profile__buttons">
              <div className="worker-profile__btn worker-profile__btn--red">
                <div className="worker-profile__btn-icon worker-profile__btn-icon--cross"/>

                <div className="worker-profile__btn-text">
                  Delete candidature
                </div>
              </div>

              <div
                onClick={() => router.push(`/dashboard/messages?chatRoomId=${applicantData.ChatToApplicant.chat_room_id}`)}
                className="worker-profile__btn"
              >
                <div className="worker-profile__btn-icon worker-profile__btn-icon--chat"/>

                <div className="worker-profile__btn-text">
                  Contact
                </div>
              </div>
            </div>
          )}
        </>
      )}

      {!forApplicant ? (
        <>
          {workerData?.JobOffer?.status === SentJobOfferStatus.Rejected && (
            <div className="worker-profile__buttons">
              <div className="worker-profile__btn worker-profile__btn--blue">
                <div className="worker-profile__btn-icon worker-profile__btn-icon--info"/>

                <div className="worker-profile__btn-text">
                  {workerData.JobOffer.reason}
                </div>
              </div>

              <div onClick={handleOpenSendOffer} className="worker-profile__btn">
                <div className="worker-profile__btn-icon worker-profile__btn-icon--check"/>

                <div className="worker-profile__btn-text">
                  Send job offer
                </div>
              </div>
            </div>
          )}
        </>
      ) : (
        <>
          {/* we will be able to send an offer back */}
        </>
      )}

      <div className="profile">
        <div className="worker-profile__top">
          <div className="worker-profile__user-data">
            <div className="profile__data">
              <UserData forCompany={!forApplicant} forApplicant={forApplicant}/>
            </div>
          </div>

          <div className="profile__data">
            <PD forApplicant={forApplicant}/>
          </div>
        </div>

        <div className="profile__columns">
          <div className="profile__column worker-profile__column">
            <div className="profile__data worker-profile__user-data-column">
              <UserData forCompany={!forApplicant} forApplicant={forApplicant}/>
            </div>

            <div className="profile__data">
              <AboutData forApplicant={forApplicant}/>
            </div>

            <div className="profile__data">
              <ExperienceData forCompany={!forApplicant} forApplicant={forApplicant}/>
            </div>

            <div className="profile__data">
              <EducationData forCompany={!forApplicant} forApplicant={forApplicant}/>
            </div>

            <div className="profile__data">
              <CertificationsData forCompany={!forApplicant} forApplicant={forApplicant}/>
            </div>

            <div className="profile__data">
              <CoursesData forCompany={!forApplicant} forApplicant={forApplicant}/>
            </div>

            <div className="profile__data profile__data--disabled-lp">
              <LanguagesData forCompany={!forApplicant} forApplicant={forApplicant}/>
            </div>

            <div className="profile__data profile__data--driving profile__data--disabled-lp">
              <DrivingData forCompany={!forApplicant} forApplicant={forApplicant}/>
            </div>
          </div>

          <div className="profile__column profile__column--2 worker-profile__column">
            <div className="profile__data worker-profile__position-data-column">
              <PD forApplicant={forApplicant}/>
            </div>

            <div className="profile__data profile__data--disabled-lp">
              <ExperienceData forCompany={!forApplicant} forApplicant={forApplicant}/>
            </div>

            <div className="profile__data profile__data--disabled-lp">
              <EducationData forCompany={!forApplicant} forApplicant={forApplicant}/>
            </div>

            <div className="profile__data profile__data--disabled-lp">
              <CertificationsData forCompany={!forApplicant} forApplicant={forApplicant}/>
            </div>

            <div className="profile__data profile__data--disabled-lp">
              <CoursesData forCompany={!forApplicant} forApplicant={forApplicant}/>
            </div>

            <div className="profile__data">
              <LanguagesData forCompany={!forApplicant} forApplicant={forApplicant}/>
            </div>

            <div className="profile__data">
              <SkillsData forApplicant/>
            </div>

            <div className="profile__data profile__data--driving">
              <DrivingData forCompany={!forApplicant} forApplicant={forApplicant}/>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
};
