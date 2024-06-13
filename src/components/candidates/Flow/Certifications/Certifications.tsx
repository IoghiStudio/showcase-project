'use client';
import './Certifications.scss';
import { FlowPageName, FlowPageText } from "@/types/FlowPage";
import { FlowContainer } from "../FlowContainer";
import { NextStep, NextStepInfo } from "../NextStep";
import { Checkbox } from "@/components/utils/Checkbox";
import { useCallback, useEffect, useState } from "react";
import { AddData, AddDataPage } from "../AddData";
import { AddAnother } from "../AddAnother/AddAnother";
import { NoDataIcon } from "@/components/utils/NoDataIcon";
import { Arrows } from '@/components/utils/Arrows';
import { StepIcon } from '@/components/utils/StepIcon';
import { useRecoilState, useSetRecoilState } from 'recoil';
import { CertificationIdStore, CertificationsStore } from '@/store/flowPagesData/certificationsStore';
import { useRouter } from 'next/navigation';
import { getMonthsArray } from '@/components/utils/utils';
import { MonthType } from '@/types/Month';
import { FlagIcon } from '@/components/utils/FlagIcon';
import { AxiosResponse } from 'axios';
import { ICertification, getCertifications } from '@/services/api/certifications.service';

const infoTexts: FlowPageText[] = [
  {
    id: '1',
    text: 'The certifications could be achieved during your studies or after. They can relate to your activity or your organizing and communication skills and have to be issued or recognized by an educational institution or an independent third party.'
  },
];

export const Certifications = () => {
  const [dontHave, setDontHave] = useState<boolean>(false);
  const router = useRouter();
  const setCertificationId = useSetRecoilState(CertificationIdStore);
  const [certifications, setCertifications] = useRecoilState(CertificationsStore);

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
    if (!certifications) fetchCertifications();
  }, [])

  return (
    <>
      <FlowContainer
        title={'MANAGE CERTIFICATIONS'}
        text={'Add, edit or delete your certifications'}
        pageName={FlowPageName.Certifications}
        infoTexts={infoTexts}
      >
        <div className="certifications">
          <div className={"certifications__content"}>
            {certifications?.length ? (
              <div className="certifications__data">
                <div className="certifications__containers">
                  {certifications.map((certification) => {
                    const {
                      certification_id,
                      institution,
                      title,
                      issued_date,
                      Country
                    } = certification;

                    const monthsArray = getMonthsArray();
                    const ourDate = new Date(issued_date);
                    const month: MonthType | undefined = monthsArray.find(
                      (month) => +month.id === ourDate.getMonth()
                    );
                    const year = ourDate.getFullYear();

                    return (
                      <div key={certification_id} className="certifications__container">
                        <div className="certifications__container-left">
                          <div className="certifications__flag">
                            <FlagIcon code={Country?.alpha_2 || null}/>
                          </div>

                          <div className="certifications__job-info">
                            <div className="certifications__job-title">
                              {title}
                            </div>

                            <div className="certifications__company">
                              {institution}
                            </div>
                          </div>
                        </div>

                        <div className="certifications__container-right">
                          <div className="certifications__container-date">
                            <div className="certifications__container-date-title">
                              Date Obtained
                            </div>

                            <div className="certifications__container-date-text">
                              {month?.name} {year}
                            </div>
                          </div>

                          <div
                            className="certifications__container-edit"
                            onClick={() => {
                              if (certification_id) {
                                setCertificationId(certification_id);
                                router.push(
                                  "/candidates/flow/certifications/edit/"
                                );
                              }
                            }}
                          ></div>
                        </div>
                      </div>
                    );
                  })}
                </div>

                <div className="certifications__add-another">
                  <AddAnother
                    buttonText="Add another certification"
                    redirectPath="/candidates/flow/certifications/add/"
                  />
                </div>
              </div>
            ) : (
              <div className="certifications__no-data">
                <div className="certifications__no-data-icon">
                  <NoDataIcon />
                </div>

                <div className="certifications__no-data-title">
                  No certification added
                </div>

                <div className="certifications__no-data-checkbox">
                  <Checkbox
                    onClick={() => setDontHave(!dontHave)}
                    checked={dontHave}
                  />

                  <div className="certifications__no-data-checkbox-title">
                    I don't have any certification to add
                  </div>
                </div>
              </div>
            )}
          </div>

          <div className="certifications__bottom">
            {certifications?.length || dontHave ? (
              <NextStep nextStep={NextStepInfo.Courses}/>
            ) : (
              <AddData
                currentPage={AddDataPage.Certification}
                buttonName="Add Certification"
                redirectPath="/candidates/flow/certifications/add/"
              />
            )}
          </div>
        </div>
      </FlowContainer>

      <div className="steps steps--mobile">
        <StepIcon
          iconName={"education"}
          status={"done"}
          title={"Education"}
        />

        <div className="steps-arrows">
          <Arrows toRight={false} arrowsCount={3} />
        </div>

        <StepIcon
          iconName={"certifications"}
          status={"current"}
          title={"Certification"}
        />

        <div className="steps-arrows">
          <Arrows toRight={true} arrowsCount={3} />
        </div>

        <StepIcon
          iconName={"courses"}
          status={"undone"}
          title={"Courses"}
        />
      </div>

      <div className="steps steps--desktop">
        <StepIcon
          iconName={"info"}
          status={"done"}
          title={"Information"}
        />

        <div className="steps-arrows">
          <Arrows toRight={false} />
        </div>

        <StepIcon
          iconName={"residency"}
          status={"done"}
          title={"Residency"}
        />

        <div className="steps-arrows">
          <Arrows toRight={false} />
        </div>

        <StepIcon
          iconName={"experience"}
          status={"done"}
          title={"Experience"}
        />

        <div className="steps-arrows">
          <Arrows toRight={false} />
        </div>

        <StepIcon
          iconName={"education"}
          status={"done"}
          title={"Education"}
        />

        <div className="steps-arrows">
          <Arrows toRight={false} />
        </div>

        <StepIcon
          iconName={"certifications"}
          status={"current"}
          title={"Certification"}
        />

        <div className="steps-arrows">
          <Arrows toRight={true} />
        </div>

        <StepIcon
          iconName={"courses"}
          status={"undone"}
          title={"Courses"}
        />

        <div className="steps-arrows">
          <Arrows toRight={true} />
        </div>

        <StepIcon
          iconName={"language"}
          status={"undone"}
          title={"Language"}
          />

        <div className="steps-arrows">
          <Arrows toRight={true} />
        </div>

        <StepIcon
          iconName={"driving"}
          status={"undone"}
          title={"Driving"}
        />

        <div className="steps-arrows">
          <Arrows toRight={true} />
        </div>

        <StepIcon
          iconName={"picture"}
          status={"undone"}
          title={"Picture"}
        />

        <div className="steps-arrows">
          <Arrows toRight={true} />
        </div>

        <StepIcon
          iconName={"subscription"}
          status={"undone"}
          title={"Subscription"}
        />
      </div>
    </>
  )
}
