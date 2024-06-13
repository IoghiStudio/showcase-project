'use client';
import './UserData.scss';
import Link from 'next/link';
import { useCallback, useEffect } from 'react';
import { AxiosResponse } from 'axios';
import { IUserData } from '@/types/UserData';
import { useRecoilState, useRecoilValue } from 'recoil';
import { UserDataStore } from '@/store/userDataStore';
import { getUserData } from '@/services/api/authUser.service';
import { FlagIcon } from '@/components/utils/FlagIcon';
import { ResidencyStore } from '@/store/flowPagesData/residencyStore';
import { getResidency } from '@/services/api/residency.service';
import { IResidency } from '@/types/Residency';
import { ISearchWorkers } from '@/services/api/serachWorkers.service';
import { WorkerDataStore } from '@/store/searchWorkersStore';
import { useRouter } from 'next/navigation';
import { SentJobOfferStatus } from '@/services/api/serachWorkers.service';
import { ApplicantOneStore, IApplicant } from '@/store/applicantsStore';
import { JobApplyStatus } from '@/store/jobStore';

interface Props {
  forCompany?: boolean;
  forApplicant?: boolean;
};

export const UserData: React.FC<Props> = ({ forCompany = false, forApplicant = false}) => {
  const [userData, setUserData] = useRecoilState(UserDataStore);
  const [userResidency, setUserResidency] = useRecoilState(ResidencyStore);
  const workerData = useRecoilValue<ISearchWorkers | null>(WorkerDataStore);
  const applicantData = useRecoilValue<IApplicant | null>(ApplicantOneStore);
  const router = useRouter();

  const fetchUserData = useCallback(async () => {
    try {
      const resp: AxiosResponse<any, any> = await getUserData();
      const userDataFecthed: IUserData = resp.data.data.data;
      setUserData(userDataFecthed);
    } catch (error) {}
  }, []);

  const fetchResidency = useCallback(async () => {
    try {
      const resp: AxiosResponse<any, any> = await getResidency();
      const residencyFetched: IResidency = resp.data.data.data;
      setUserResidency(residencyFetched);
    } catch (error) {}
  }, []);

  useEffect(() => {
    if (forCompany) {
      if (!workerData) router.push('/dashboard/search-workers/');
    } else if (forApplicant) {
      if (!applicantData) router.push('/dashboard/applicants/');
    } else {
      if (!userData) fetchUserData();
      if (!userResidency) fetchResidency();
    }
  }, []);

  return (
    <div className="container user-data">
      <div className="user-data__picture-container">
        {forCompany && (
          <img
            src={workerData?.Candidate.profile_image || ''}
            alt="profile"
            className="user-data__picture"
          />
        )}

        {forApplicant && (
          <img
            src={applicantData?.Candidate.profile_image || ''}
            alt="profile"
            className="user-data__picture"
          />
        )}

        {!forCompany && !forApplicant && (
          <img
            src={userData?.profile_image || ''}
            alt="profile"
            className="user-data__picture"
          />
        )}

        <div className="user-data__flag">
          {forCompany && (
            <FlagIcon
              code={workerData?.Candidate.Country.alpha_2 || ''}
              size={34}
            />
            )}

          {forApplicant && (
            <FlagIcon
              code={applicantData?.Candidate.Country.alpha_2 || ''}
              size={34}
            />
          )}

          {!forCompany && !forApplicant && (
            <FlagIcon
              code={userData?.Country.alpha_2 || ''}
              size={34}
            />
          )}
        </div>
      </div>

      <div className="user-data__content">
        <div className="user-data__top">
          <div className="user-data__column">
            <div className="user-data__title">
              {forCompany && (
                `${workerData?.Candidate.firstname || ''} ${workerData?.Candidate.lastname || ''}`
                )}

              {forApplicant && (
                `${applicantData?.Candidate.firstname || ''} ${applicantData?.Candidate.lastname || ''}`
              )}

              {!forCompany && !forApplicant && (
                `${userData?.firstname || ''} ${userData?.lastname || ''}`
              )}
            </div>

            <div className="user-data__row user-data__row--first">
              <div className="user-data__icon user-data__icon--location"/>

              <div className="user-data__text">
                {forCompany && (
                  `${workerData?.Candidate.Residency.town || ''}, ${workerData?.Candidate.Residency.Country?.name || ''}`

                  )}

                {forApplicant && (
                  `${applicantData?.Candidate.Residency.town || ''}, ${applicantData?.Candidate.Residency.Country?.name || ''}`
                )}

                {!forCompany && !forApplicant && (
                  `${userResidency?.town || ''}, ${userResidency?.Country?.name || ''}`

                )}
              </div>
            </div>
          </div>

          {!forCompany && !forApplicant && (
            <Link href={'/candidates/dashboard/settings/account/'} className="user-data__edit"/>
          )}
        </div>

        <div className="user-data__bottom">
          <div className="user-data__bottom-row">
            <div className="user-data__row">
              <div className="user-data__icon user-data__icon--birthday"/>

              <div className="user-data__text user-data__text--bold">
                Date of birth:
              </div>

              {forCompany && (
                <div className="user-data__text">
                  {workerData?.Candidate.date_of_birth}
                </div>
              )}

              {forApplicant && (
                <div className="user-data__text">
                  {applicantData?.Candidate.date_of_birth}
                </div>
              )}

              {!forCompany && !forApplicant && (
                <div className="user-data__text">
                  {userData?.date_of_birth || ''}
                </div>
              )}
            </div>

            <div className="user-data__row">
              <div className="user-data__icon user-data__icon--phone"/>

              <div className="user-data__text user-data__text--bold">
                Phone:
              </div>

              {forCompany && (
                <>
                  {workerData?.JobOffer?.status === SentJobOfferStatus.Accepted ? (
                    <div className="user-data__text">
                      {`${workerData?.Candidate?.phone_prefix || ''} ${workerData?.Candidate?.phonenumber || ''}`}
                    </div>
                  ) : (
                    <div className="user-data__text">
                      hidden
                    </div>
                  )}
                </>
              )}

              {forApplicant && (
                <>
                  {applicantData?.status === JobApplyStatus.Accepted ? (
                    <div className="user-data__text">
                      {`${applicantData?.Candidate?.phone_prefix || ''} ${applicantData?.Candidate?.phonenumber || ''}`}
                    </div>
                  ) : (
                    <div className="user-data__text">
                      hidden
                    </div>
                  )}
                </>
              )}

              {!forCompany && !forApplicant && (
                <div className="user-data__text">
                  {`${userData?.phone_prefix || ''} ${userData?.phonenumber || ''}`}
                </div>
              )}
            </div>
          </div>

          <div className="user-data__bottom-row">
            <div className="user-data__row">
              <div className="user-data__icon user-data__icon--nationality"/>

              <div className="user-data__text user-data__text--bold">
                Nationality:
              </div>

              {forCompany && (
                <div className="user-data__text">
                  {workerData?.Candidate.Country.name}
                </div>
              )}

              {forApplicant && (
                <div className="user-data__text">
                  {applicantData?.Candidate.Country.name}
                </div>
              )}

              {!forCompany && !forApplicant && (
                <div className="user-data__text">
                  {userData?.Country.name || ''}
                </div>
              )}
            </div>

            <div className="user-data__row">
              <div className="user-data__icon user-data__icon--plic"/>

              <div className="user-data__text user-data__text--bold">
                Email:
              </div>

              {forCompany && (
                <>
                  {workerData?.JobOffer?.status === SentJobOfferStatus.Accepted ? (
                    <div className="user-data__text">
                      {workerData?.Candidate?.email}
                    </div>
                  ) : (
                    <div className="user-data__text">
                      hidden
                    </div>
                  )}
                </>
              )}

              {forApplicant && (
                <>
                  {applicantData?.status === JobApplyStatus.Accepted ? (
                    <div className="user-data__text">
                      {applicantData?.Candidate?.email}
                    </div>
                  ) : (
                    <div className="user-data__text">
                      hidden
                    </div>
                  )}
                </>
              )}

              {!forCompany && !forApplicant && (
                <div className="user-data__text">
                  {userData?.email}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
