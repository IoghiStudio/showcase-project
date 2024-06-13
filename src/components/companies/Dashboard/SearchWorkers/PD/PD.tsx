'use client';
import './PD.scss';
import { ISearchWorkers, generateWorkerCV, updateWorkersToFavorite, updateWorkersToUnfavorite } from '@/services/api/serachWorkers.service';
import { WorkerDataStore } from '@/store/searchWorkersStore';
import { AxiosResponse } from 'axios';
import classNames from 'classnames';
import { useCallback, useEffect, useState } from 'react';
import { useRecoilValue } from 'recoil';
import { recurrencyNew } from '..';
import { Label } from '@/components/utils/Label';
import { formatDateShort } from '@/components/utils/utils';
import { ApplicantOneStore, IApplicant } from '@/store/applicantsStore';
import { changeApplicantFavoriteStatus } from '@/services/api/applicants.service';

interface Props {
  forApplicant?: boolean;
};

//POSITION DATA
export const PD: React.FC<Props> = ({ forApplicant=false}) => {
  const workerData = useRecoilValue<ISearchWorkers | null>(WorkerDataStore);
  const applicantData = useRecoilValue<IApplicant | null>(ApplicantOneStore);
  const [isFavorite, setIsFavorite] = useState<boolean>(false);

  useEffect(() => {
    if (!forApplicant) {
      if (!workerData) return;
      setIsFavorite(workerData.Favorite);
    } else {
      if (!applicantData) return;
      setIsFavorite(Boolean(applicantData.favorite))
    }
  }, [workerData, forApplicant]);

  const handleDownloadCV = useCallback(async (jobPositionId: number, candidateId: number) => {
    try {
      const resp: AxiosResponse<any, any> = await generateWorkerCV({ jobPositionId, candidateId });
      const pdfBlob: Blob = new Blob([resp?.data], { type: "application/pdf" });
      const blobUrl: HTMLAnchorElement = document?.createElement("a");
      blobUrl.href = window?.URL?.createObjectURL(pdfBlob);
      window?.open(blobUrl.href, "_blank");
    } catch (error) {
      console.log(error)
    }
  }, []);

  const updateToFavorite = useCallback(async (id: number) => {
    try {
      if (!forApplicant) {
        await updateWorkersToFavorite({jobPositionId: id});
      } else {
        await changeApplicantFavoriteStatus({applicant_id: id, favorite: 1});
      }
    } catch (error) {}
  }, []);

  const updateToUnfavorite = useCallback(async (id: number) => {
    try {
      if (!forApplicant) {
        await updateWorkersToUnfavorite({jobPositionId: id});
      } else {
        await changeApplicantFavoriteStatus({applicant_id: id, favorite: 0});
      }
    } catch (error) {}
  }, []);

  const handleFavoriteChange = useCallback((id: number) => {
    if(!isFavorite) {
      setIsFavorite(true);
      updateToFavorite(id);
    } else {
      setIsFavorite(false);
      updateToUnfavorite(id);
    }
  }, [isFavorite]);


  return (
    <div className="container pd">
      <div className="pd__container">
        <div className="pd__top">
          {!forApplicant ? (
            <div className="pd__top-left">
              <div className="container__title">{workerData?.JobTitle.name}</div>
              <div className="container__text">{`Listed on ${formatDateShort(workerData?.createdAt || '')}`}</div>
            </div>
          ): (
            <div className="pd__top-left">
              <div className="container__title">{applicantData?.JobPosition.JobTitle?.name || ''}</div>
              <div className="container__text">{`Listed on ${formatDateShort(applicantData?.JobPosition.createdAt || '')}`}</div>
            </div>
          )}

          <div className="pd__icons">
            <div
              onClick={() =>  {
                if (!forApplicant) {
                  handleFavoriteChange(workerData?.job_position_id || 0)
                } else {
                  handleFavoriteChange(applicantData?.applicant_id || 0)
                }
              }}
              className={classNames("pd__icon pd__icon--favorite", {
                "pd__icon--favorite--active": isFavorite
              })}
            />
            <div
              onClick={() => {
                if (!forApplicant) {
                  if (!workerData) return;
                  handleDownloadCV(workerData.job_position_id, workerData.Candidate.candidate_id);
                } else {
                  if (!applicantData) return;
                  handleDownloadCV(applicantData.job_position_id, applicantData.Candidate.candidate_id);
                }
              }}
              className="pd__icon pd__icon--cv"
            />
          </div>
        </div>

        <div className="pd__rows">
          <div className="pd__row">
            <div className="pd__pair">
              <div className="pd__text">Desired salary</div>
              {!forApplicant ? (
                <div className="pd__text pd__text--b">
                  <span>{workerData?.desired_salary.toLocaleString() || 0}</span>
                  {' '}
                  <span>{workerData?.Currency.code}</span>
                  {' '}
                  <span className='pd__text'>{`/${workerData && recurrencyNew[workerData.recurrency]}`}</span>
                </div>
              ) : (
                <div className="pd__text pd__text--b">
                  <span>{applicantData?.JobPosition.desired_salary.toLocaleString() || 0}</span>
                  {' '}
                  <span>{applicantData?.JobPosition.Currency?.code || ''}</span>
                  {' '}
                  <span className='pd__text'>{`/${applicantData && recurrencyNew[applicantData.JobPosition.recurrency]}`}</span>
                </div>
              )}
            </div>

            <div className="pd__pair pd__pair--second">
              <div className="pd__text">Minimum contract</div>
              {!forApplicant ? (
                <div className="pd__text pd__text--b">{workerData?.minimum_contract || '3 years'}</div>
              ) : (
                <div className="pd__text pd__text--b">{applicantData?.JobPosition.minimum_contract || '3 years'}</div>
              )}
            </div>
          </div>

          <div className="pd__row">
            <div className="pd__pair">
              <div className="pd__text">Job experience</div>
              {!forApplicant ? (
                <div className="pd__text pd__text--b">
                  {`${workerData?.job_experience || 0} ${(workerData?.job_experience || 0) > 1 ? 'years' : 'years'}`}
                </div>
              ) :(
                <div className="pd__text pd__text--b">
                  {`${applicantData?.JobPosition.job_experience || 0} ${(applicantData?.JobPosition.job_experience || 0) > 1 ? 'years' : 'years'}`}
                </div>
              )}
            </div>

            <div className="pd__pair pd__pair--second">
              <div className="pd__text">Desired location type</div>
              {!forApplicant ? (
                <div className="pd__text pd__text--b">{workerData?.location_type}</div>
                ) : (
                <div className="pd__text pd__text--b">{applicantData?.JobPosition.location_type}</div>
              )}
            </div>
          </div>

          <div className="pd__row">
            <div className="pd__pair">
              <div className="pd__text">Language</div>
              <div className="pd__text pd__text--b">English</div>
            </div>

            <div className="pd__pair pd__pair--second">
              <div className="pd__text">Desired employment type</div>

              {!forApplicant ? (
                <div className="pd__text pd__text--b">{workerData?.type_of_employment}</div>
              ) : (
                <div className="pd__text pd__text--b">{applicantData?.JobPosition.type_of_employment}</div>
              )}
            </div>
          </div>

        </div>
      </div>

      <div className="pd__mid">
        <div className="pd__video-container">
          <video  className='pd__video' width="400" controls>
            <source src={(!forApplicant? workerData?.video || '' : applicantData?.JobPosition.video || '')} type="video/mp4" />
              Your browser does not support the video tag.
            </video>
        </div>
      </div>

      <div className="pd__container">
        {!forApplicant ? (
          <Label title='benefits requested'>
            {workerData?.benefits.map(benefit => (
              <div className="pd__benefit">
                <div className="pd__benefit-icon"/>
                <div className="pd__benefit-text">{benefit}</div>
              </div>
            ))}
          </Label>
        ) : (
          <Label title='benefits requested'>
            {applicantData?.JobPosition.benefits && applicantData?.JobPosition.benefits.map(benefit => (
              <div className="pd__benefit">
                <div className="pd__benefit-icon"/>
                <div className="pd__benefit-text">{benefit}</div>
              </div>
            ))}
          </Label>
        )}
      </div>

    </div>
  )
}
