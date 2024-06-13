'use client';
import '../../../../candidates/Dashboard/Profile/UserData/UserData.scss';
import Link from 'next/link';
import { useCallback, useEffect } from 'react';
import { AxiosResponse } from 'axios';
import { useRecoilState, useRecoilValue } from 'recoil';
import { getCompanyData, getUserData } from '@/services/api/authUser.service';
import { FlagIcon } from '@/components/utils/FlagIcon';
import { useRouter } from 'next/navigation';
import { CompanyDataStore } from '@/store/companyDataStore';
import { ICompanyData } from '@/types/CompanyData';
import { formatMediaUrl } from '@/components/utils/utils';
import { IViewEmployer } from '@/services/api/viewEmployer.service';
import { ViewEmployerStore } from '@/store/viewEmployerStore';
import { JobApplyStatus } from '@/store/jobStore';

interface Props {
  forViewEmployer?: boolean;
};

export const MyCompanyData: React.FC<Props> = ({ forViewEmployer=false }) => {
  const [companyData, setCompanyData] = useRecoilState(CompanyDataStore);
  const viewEmployer = useRecoilValue<IViewEmployer | null>(ViewEmployerStore);
  const router = useRouter();

  const fetchCompanyData = useCallback(async () => {
    try {
      const resp: AxiosResponse<any, any> = await getCompanyData();
      const companyDataFecthed: ICompanyData = resp.data.data.data;
      setCompanyData(companyDataFecthed);
    } catch (error) {}
  }, []);

  useEffect(() => {
    if (!forViewEmployer) {
      if (!companyData) fetchCompanyData();
    } else {
      if (!viewEmployer) {
        router.push('/candidates/dashboard/job-search/');
        return;
      }
    }
  }, []);

  return (
    <div className="container user-data">
      <div className="user-data__picture-container">
        {!forViewEmployer ? (
          <>
            <img
              src={companyData?.company_logo || formatMediaUrl(
                `flag-icon-${companyData?.Country.alpha_2.toLowerCase() || 'globe'}.svg`,
              )}
              alt="profile"
              className="user-data__picture"
            />

            {companyData?.company_logo && (<div className="user-data__flag">
              <FlagIcon
                code={companyData?.Country.alpha_2 || ''}
                size={34}
              />
            </div>)}
          </>
        ) : (
          <>
            <img
              src={viewEmployer?.employer.company_logo || formatMediaUrl(
                `flag-icon-${viewEmployer?.employer.Country.alpha_2.toLowerCase() || 'globe'}.svg`,
              )}
              alt="profile"
              className="user-data__picture"
            />

            {viewEmployer?.employer.company_logo && (<div className="user-data__flag">
              <FlagIcon
                code={viewEmployer?.employer.Country.alpha_2 || ''}
                size={34}
              />
            </div>)}
          </>
        )}
      </div>

      <div className="user-data__content">
        <div className="user-data__top">
          <div className="user-data__column">
            {!forViewEmployer ? (
              <div className="user-data__title">
                {companyData?.name}
              </div>
            ) : (
              <div className="user-data__title">
                {viewEmployer?.status === JobApplyStatus.Accepted ? (
                  <>
                    {viewEmployer?.employer.name}
                  </>
                ) : (
                  'Hidden'
                )}
              </div>
            )}

            <div className="user-data__row user-data__row--first">
              <div className="user-data__icon user-data__icon--location"/>

              {!forViewEmployer ? (
                <div className="user-data__text">
                  {`${companyData?.CompanyResidency?.town ? `${companyData?.CompanyResidency?.town} ,` : ''} ${companyData?.Country?.name || ''}`}
                </div>
              ) : (
                <div className="user-data__text">
                  {`${viewEmployer?.employer.CompanyResidency?.town ? `${viewEmployer?.employer.CompanyResidency?.town} ,` : ''} ${viewEmployer?.employer.Country?.name || ''}`}
                </div>
              )}
            </div>
          </div>

          {!forViewEmployer && (
            <Link href={'/dashboard/settings/company/'} className="user-data__edit"/>
          )}
        </div>

        <div className="user-data__bottom">
          <div className="user-data__bottom-row">
            <div className="user-data__row">
              <div className="user-data__icon user-data__icon--industry"/>

              <div className="user-data__text user-data__text--bold">
                Industry:
              </div>
              {!forViewEmployer ? (
                <div className="user-data__text">
                  {companyData?.IndustrySubcategory.name}
                </div>
              ) : (
                <div className="user-data__text">
                  {viewEmployer?.employer.IndustrySubcategory.name}
                </div>
              )}
            </div>

            <div className="user-data__row">
              <div className="user-data__icon user-data__icon--phone"/>

              <div className="user-data__text user-data__text--bold">
                Phone:
              </div>

              {!forViewEmployer ? (
                <div className="user-data__text">
                  {`${companyData?.phone_prefix || ''} ${companyData?.phonenumber || ''}`}
                </div>
              ) : (
                <div className="user-data__text">
                  {viewEmployer?.status === JobApplyStatus.Accepted ? (
                    <>
                      {`${viewEmployer?.employer.phone_prefix || ''} ${viewEmployer?.employer.phonenumber || ''}`}
                    </>
                  ) : (
                    <>
                      Hidden
                    </>
                  )}
                </div>
              )}
            </div>
          </div>

          <div className="user-data__bottom-row">
            <div className="user-data__row">
              <div className="user-data__icon user-data__icon--tax-id"/>

              <div className="user-data__text user-data__text--bold">
                Tax Id:
              </div>

              {!forViewEmployer ? (
                <div className="user-data__text">
                  {companyData?.tax_id}
                </div>
              ) : (
                <>
                  {viewEmployer?.status === JobApplyStatus.Accepted ? (
                    <div className="user-data__text">
                      {viewEmployer?.employer.tax_id}
                    </div>
                    ) : (
                      <>
                        <div className="user-data__text">
                          Hidden
                        </div>
                      </>
                    )}
                </>
              )}
            </div>

            <div className="user-data__row">
              <div className="user-data__icon user-data__icon--plic"/>

              <div className="user-data__text user-data__text--bold">
                Email:
              </div>

              {!forViewEmployer ? (
                <div className="user-data__text">
                  {companyData?.email}
                </div>
              ) : (
                <div className="user-data__text">
                  {viewEmployer?.status === JobApplyStatus.Accepted ? (
                    <>
                      {viewEmployer.employer?.email}
                    </>
                  ) : (
                    <>
                      Hidden
                    </>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
