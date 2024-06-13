'use client';
import './Education.scss';
import { FlowPageName, FlowPageText } from "@/types/FlowPage";
import { FlowContainer } from "../FlowContainer";
import { NextStep, NextStepInfo } from "../NextStep";
import { Checkbox } from "@/components/utils/Checkbox";
import { useCallback, useEffect, useState } from "react";
import { AddData, AddDataPage } from "../AddData";
import { AddAnother } from "../AddAnother/AddAnother";
import { NoDataIcon } from "@/components/utils/NoDataIcon";
import { StepIcon } from '@/components/utils/StepIcon';
import { Arrows } from '@/components/utils/Arrows';
import { useRecoilState, useSetRecoilState } from 'recoil';
import { EducationIdStore, EducationsStore } from '@/store/flowPagesData/educationsStore';
import { useRouter } from 'next/navigation';
import { AxiosResponse } from 'axios';
import { IEducation, getEducations } from '@/services/api/education.service';
import { MonthType } from '@/types/Month';
import { getMonthsArray } from '@/components/utils/utils';
import { FlagIcon } from '@/components/utils/FlagIcon';

const infoTexts: FlowPageText[] = [
  {
    id: '1',
    text: 'List your high school experience only if you did not go to college.'
  },
  {
    id: '2',
    text: 'If you are still in school, note your major, and the type of degree you’ll be receiving.'
  },
  {
    id: '3',
    text: 'Feel free to mention any honors, awards, scholarships, or professional certifications or licenses you received during your school time.'
  },
];

export const Education = () => {
  const [dontHave, setDontHave] = useState<boolean>(false);
  const router = useRouter();
  const [educations, setEducations] = useRecoilState(EducationsStore);
  const setEducationId = useSetRecoilState(EducationIdStore);

  const fetchEducations = useCallback(async () => {
    try {
      const resp: AxiosResponse<any, any> = await getEducations();
      const data: IEducation[] = resp.data.data.data;
      data.sort(
        (a, b) =>
          new Date(b.from_date).getTime() - new Date(a.from_date).getTime()
      );
      setEducations(data);
    } catch (error) {}
  }, []);

  useEffect(() => {
    if (!educations) fetchEducations();
  }, []);

  return (
    <>
      <FlowContainer
        title={'MANAGE EDUCATION'}
        text={'Add, edit or delete your education'}
        pageName={FlowPageName.Education}
        infoTexts={infoTexts}
      >
        <div className="education">
          <div className={"education__content"}>
            {educations?.length ? (
              <div className="education__data">
                <div className="education__containers">
                  {educations.map((education) => {
                    const {
                      education_id,
                      from_date,
                      to_date,
                      in_progress,
                      degree,
                      institution_name,
                      profile,
                      Country,
                    } = education;
                    const monthsArray = getMonthsArray();

                    const startDate = new Date(from_date);
                    const startMonth: MonthType | undefined = monthsArray.find(
                      (month) => +month.id === startDate.getMonth()
                    );
                    const startYear = startDate.getFullYear();

                    let endDate: Date | null = null;
                    let endMonth: MonthType | undefined;
                    let endYear;

                    if (to_date) {
                      endDate = new Date(to_date);
                      endMonth = monthsArray.find(
                        (month) => +month.id === endDate?.getMonth()
                      );
                      endYear = endDate.getFullYear();
                    }

                    return (
                      <div key={education_id} className="education__container">
                        <div className="education__container-left">
                          <div className="education__flag">
                            <FlagIcon code={Country?.alpha_2 || null} />
                          </div>

                          <div className="education__job-info">
                            <div className="education__job-title">{profile}</div>

                            <div className="education__company">
                              {degree} &#x2022; {institution_name}
                            </div>
                          </div>
                        </div>

                        <div className="education__container-right">
                          <div className="education__container-date-left">
                            <div className="education__container-date">
                              <div className="education__container-date-title">
                                Start Date
                              </div>

                              <div className="education__container-date-text">
                                {startMonth?.name} {startYear}
                              </div>
                            </div>
                          </div>

                          <div className="education__container-date-right">
                            <div className="education__container-date">
                              <div className="education__container-date-title">
                                Graduation Date
                              </div>

                              {!in_progress ? (
                                <div className="education__container-date-text">
                                  {endMonth?.name} {endYear}
                                </div>
                              ) : (
                                <div className="education__container-date-text">
                                  Current
                                </div>
                              )}
                            </div>

                            <div
                              className="education__container-edit"
                              onClick={() => {
                                if (education_id) {
                                  setEducationId(education_id);
                                  router.push("/candidates/flow/education/edit/");
                                }
                              }}
                            ></div>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>

                <div className="education__add-another">
                  <AddAnother
                    buttonText="Add another education"
                    redirectPath="/candidates/flow/education/add/"
                  />
                </div>
              </div>
            ) : (
              <div className="education__no-data">
                <div className="education__no-data-icon">
                  <NoDataIcon />
                </div>

                <div className="education__no-data-title">
                  No education added
                </div>

                <div className="education__no-data-checkbox">
                  <Checkbox
                    onClick={() => setDontHave(!dontHave)}
                    checked={dontHave}
                  />

                  <div className="education__no-data-checkbox-title">
                    I don't have any education to add
                  </div>
                </div>
              </div>
            )}
          </div>

          <div className="education__bottom">
            {educations?.length || dontHave ? (
              <NextStep nextStep={NextStepInfo.Certifications}/>
            ) : (
              <AddData
                currentPage={AddDataPage.Education}
                buttonName="Add Education"
                redirectPath="/candidates/flow/education/add/"
              />
            )}
          </div>
        </div>
      </FlowContainer>

      <div className="steps steps--mobile">
        <StepIcon
          iconName={"experience"}
          status={"done"}
          title={"Experience"}
        />

        <div className="steps-arrows">
          <Arrows toRight={false} arrowsCount={3} />
        </div>

        <StepIcon
          iconName={"education"}
          status={"current"}
          title={"Education"}
        />

        <div className="steps-arrows">
          <Arrows toRight={true} arrowsCount={3} />
        </div>

        <StepIcon
          iconName={"certifications"}
          status={"undone"}
          title={"Certification"}
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
          status={"current"}
          title={"Education"}
        />

        <div className="steps-arrows">
          <Arrows toRight={true} />
        </div>

        <StepIcon
          iconName={"certifications"}
          status={"undone"}
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
