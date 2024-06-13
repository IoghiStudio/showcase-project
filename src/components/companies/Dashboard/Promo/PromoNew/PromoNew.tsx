'use client';
import { useRecoilState, useRecoilValue, useSetRecoilState } from 'recoil';
import './PromoNew.scss';
import { AnnounceToPromoteStore, IPromoJob, PromoJobStatus, PromotedAnnounceStore, PromotedAnnouncesActiveStore, PromotedAnnouncesStore } from '@/store/promoAnnounceStore';
import { useRouter } from 'next/navigation';
import { useCallback, useEffect, useState } from 'react';
import { IPostPromoteJob, IUpdatePromotedJob, deletePromotedJob, getPromotedJobs, postPromoteJob, updatePromotedJob } from '@/services/api/promoteJob.service';
import { AnnouncesStore, IAnnounce } from '@/store/announceStore';
import { AxiosResponse } from 'axios';
import { ButtonIcon, ButtonWithIcon } from '@/components/candidates/Dashboard/utils/ButtonWihIcon';
import { ButtonColor } from '@/types/ButtonColor';
import { getAnnounces, getOneAnnounce } from '@/services/api/job.service';
import { Relocation } from '@/components/candidates/Flow/Relocation';
import { IGetPrivacy, IRelocation, getPrivacySettings } from '@/services/api/relocation.service';
import { CompanyDataStore } from '@/store/companyDataStore';
import { ICompanyData } from '@/types/CompanyData';
import { getCompanyData } from '@/services/api/authUser.service';
import { formatDateShort } from '@/components/utils/utils';

interface Props {
  forEdit?: boolean;
};

export const PromoNew: React.FC<Props> = ({ forEdit = false }) => {
  const router = useRouter();
  const announceToPromoteId = useRecoilValue<number | null>(AnnounceToPromoteStore);
  const [announceToPromote, setAnnounceToPromote] = useState<IAnnounce | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [companyData, setCompanyData] = useRecoilState(CompanyDataStore);
  const promotion = useRecoilValue(PromotedAnnounceStore);
  const setPromotions = useSetRecoilState(PromotedAnnouncesStore);
  const setActivePromotions = useSetRecoilState(PromotedAnnouncesActiveStore);
  const setAnnounces = useSetRecoilState<IAnnounce[] | null>(AnnouncesStore);

  const fetchCompanyData = useCallback(async () => {
    try {
      const resp: AxiosResponse<any, any> = await getCompanyData();
      const companyDataFetched: ICompanyData = resp.data.data.data;
      setCompanyData(companyDataFetched);
      console.log(companyDataFetched);

    } catch (error) {}
  }, []);

  useEffect(() => {
    if (!companyData) fetchCompanyData();

    if (!forEdit) {
      if (!announceToPromoteId) {
        router.push('/dashboard/announcements/');
        return;
      } else {
        fetchAnnounceToPromote();
      }
    } else {
      if (!promotion) {
        router.push('/dashboard/promotion/');
      }
    }
  }, []);

  const fetchAnnounceToPromote = useCallback(async () => {
    if (!announceToPromoteId) return;

    try {
      const resp: AxiosResponse<any, any> = await getOneAnnounce(announceToPromoteId);
      const data: IAnnounce = resp.data.data.data;
      setAnnounceToPromote(data);
    } catch (error) {}
  }, [announceToPromoteId]);

  const handlePromoteJob = useCallback(async () => {
    if (!announceToPromote) return;

    const data: IPostPromoteJob = {
      price_id: 'price_1O5u5pEuEtvQlixIdrA9GhRr',
      countryIds: [],
      job_id: announceToPromote.job_id,
      worldwide: 1,
    };

    try {
      setIsLoading(true);
      const respOne: AxiosResponse<any, any> = await getPrivacySettings();
      const relocationFetched: IGetPrivacy = respOne.data.data.data;

      if (relocationFetched.countries.length) {
        data.countryIds = relocationFetched.countries.map(c => c.country_id);
      } else {
        if (companyData) {
          data.countryIds = [
            companyData?.Country.country_id
          ];
        }
      }

      data.worldwide = relocationFetched.worldwide;

      const resp: AxiosResponse<any, any> = await postPromoteJob(data);
      router.push(resp.data.data.data);
      setIsLoading(false);
    } catch (error) {
      setIsLoading(false);
    }
  }, [announceToPromote]);

  const handleUpdatePromotedJob = useCallback(async () => {
    if (!promotion) return;

    const data: IUpdatePromotedJob = {
      countryIds: [],
      job_promotion_id: promotion.job_promotion_id,
      worldwide: 1,
    };

    try {
      setIsLoading(true);
      const respOne: AxiosResponse<any, any> = await getPrivacySettings();
      const relocationFetched: IGetPrivacy = respOne.data.data.data;

      if (relocationFetched.countries.length) {
        data.countryIds = relocationFetched.countries.map(c => c.country_id);
      } else {
        if (companyData) {
          data.countryIds = [
            companyData?.Country.country_id
          ];
        }
      }

      data.worldwide = relocationFetched.worldwide;
      await updatePromotedJob(data);
      router.push('/dashboard/promotion')
      setIsLoading(false);
    } catch (error) {

    }
  }, [promotion]);

  const fetchAnnounces = useCallback(async () => {
    try {
      const resp: AxiosResponse<any, any> = await getAnnounces(`?page=${1}&pageSize=${10}`);
      const data: IAnnounce[] = resp.data.data.data;
      setAnnounces(data);
    } catch (error) {}
  }, []);

  const fetchPromotedAnnounces = useCallback(async () => {
    try {
      const resp: AxiosResponse<any, any> = await getPromotedJobs();
      const data: IPromoJob[] = resp.data.data.data;
      setPromotions(data);
      console.log(data);
      setActivePromotions(data.filter(an => an.status === PromoJobStatus.Active).length);
    } catch (error) {}
  }, []);

  const handleDeletePromotion = useCallback(async (promoId: number) => {
    try {
      await deletePromotedJob(promoId);
      fetchPromotedAnnounces();
      fetchAnnounces();
      router.push('/dashboard/promotion/')
    } catch (error) {}
  }, []);

  return (
    <div className="promo-new">
      <div className="promo-new__top">
        <div className="promo-new__top-left">
          <div className="promo-new__title">
            {announceToPromote?.JobTitle.name || ''}
          </div>

          <div className="promo-new__custom-name">
            {announceToPromote?.custom_name || ''}
          </div>
        </div>


        {!forEdit ? (
          <div className="promo-new__buttons">
            <div
              onClick={() => router.push('/dashboard/announcements/')}
              className="promo-new__save-no-promo"
            >
              SAVE WITHOUT PROMOTING
            </div>

            <div
              onClick={() => handlePromoteJob()}
              className="promo-new__button"
            >
              <ButtonWithIcon
                color={ButtonColor.White}
                bgColor={ButtonColor.Blue}
                borderColor={ButtonColor.Blue}
                icon={ButtonIcon.Plus}
                text='PROMOTE JOB'
                isLoading={isLoading}
              />
            </div>
          </div>
        ) : (
          <div className="promo-new__buttons">
            <div
              onClick={() => handleDeletePromotion(promotion?.job_promotion_id || 0)}
              className="promo-new__save-no-promo promo-new__save-no-promo--red"
            >
              DELETE PROMOTION
            </div>

            <div
              onClick={() => handleUpdatePromotedJob()}
              className="promo-new__button"
            >
              <ButtonWithIcon
                color={ButtonColor.White}
                bgColor={ButtonColor.Green}
                borderColor={ButtonColor.Green}
                icon={ButtonIcon.Plus}
                text='PROMOTE & SAVE'
                isLoading={isLoading}
              />
            </div>
          </div>
        )}
      </div>

      <div className="promo-new__content">
        <div className="container promo-new__info">
          {!forEdit ? (
            <div className="container__title">
              Promote this job announcement
            </div>
          ) : (
            <div className="container__title">
              Promotion active
            </div>
          )}

          {!forEdit ? (
            <div className="container__text">
              Make this job announcements publicly available for job seekers around the globe
            </div>
          ) : (
            <div className="container__text">
              Your job announcements is publicly available for job seekers around the globe
            </div>
          )}

          {!forEdit ? (
            <>
            <div className="promo-new__info-row">
              <div className="promo-new__info-icon"/>

              <div className="promo-new__info-text">
                Feature your job in top listings jobs
              </div>
            </div>

            <div className="promo-new__info-row">
              <div className="promo-new__info-icon"/>

              <div className="promo-new__info-text">
                Sent to matching candidates in weekly newsletter.
              </div>
            </div>

            <div className="promo-new__info-row">
              <div className="promo-new__info-icon"/>

              <div className="promo-new__info-text">
                {`Promoted in social media channels (trough millions of our audience on social media, Newsletter, Youtube).`}
              </div>
            </div>

            <div className="promo-new__info-cost">
              Cost: <span className='promo-new__info-cost-bold'>$129</span> / 30 days
            </div>

            <div className="promo-new__info-cost promo-new__info-cost--sm">
              One time payment
            </div>
            </>
          ) : (
            <div className="promo-new__mid">
              <div className="promo-new__mid-column">
                <div className="promo-new__expire-date">
                  {`Expire on ${formatDateShort(promotion?.expires_at || '')}`}
                </div>

                <div className="promo-new__iconera">

                </div>
              </div>

              <div className="promo-new__mid-column">
                <div className="promo-new__info-row">
                  <div className="promo-new__info-icon"/>

                  <div className="promo-new__info-text">
                    Feature your job in top listings jobs
                  </div>
                </div>

                <div className="promo-new__info-row">
                  <div className="promo-new__info-icon"/>

                  <div className="promo-new__info-text">
                    Sent to matching candidates in weekly newsletter.
                  </div>
                </div>

                <div className="promo-new__info-row">
                  <div className="promo-new__info-icon"/>

                  <div className="promo-new__info-text">
                    {`Promoted in social media channels (trough millions of our audience on social media, Newsletter, Youtube).`}
                  </div>
                </div>
              </div>
            </div>
          )}


          {!forEdit ? (
            <div className="promo-new__info-bottom">
              By clicking promote job, you agree to the VideoWorkers Terms and Conditions including our policies prohibiting discriminatory job posts and the refund policy. Please read the Privacy Policy for payment processing and data storage informations
            </div>
          ) : (
            <div className="promo-new__info-bottom">
              By clicking cancel promotions, you agree to the VideoWorkers Terms and Conditions including our refund policy.
            </div>
          )}
        </div>

        <div className="container promo-new__privacy">
          <Relocation
            forSettings
            forCompany
            forPromotion
          />
        </div>
      </div>
    </div>
  )
}
