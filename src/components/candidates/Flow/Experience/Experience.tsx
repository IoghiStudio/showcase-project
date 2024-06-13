'use client';
import './Experience.scss';
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
import { useRouter } from 'next/navigation';
import { ExperienceIdStore, ExperiencesStore } from '@/store/flowPagesData/experiencesStore';
import { useRecoilState, useSetRecoilState } from 'recoil';
import { AxiosResponse } from 'axios';
import { IExperience, getExperience } from '@/services/api/experience.service';
import { MonthType } from '@/types/Month';
import { getMonthsArray } from '@/components/utils/utils';
import { FlagIcon } from '@/components/utils/FlagIcon';

const infoTexts: FlowPageText[] = [
  {
    id: '1',
    text: 'Previous work experience demonstrates to employers your commitment to holding a job, adhering to a work schedule, and respecting authority and hierarchy in a company. Thus, any type of work experience is important to employers.'
  },
  {
    id: '2',
    text: 'If you want to apply for 3 jobs (e.g., a cook job, a waiter job, and a sales job) and you have previous work experience for all of them, make sure you include all relevant details in your CV.'
  },
  {
    id: '3',
    text: 'If you already have several years of work experience, having at least 2-3 years with the same employer can showcase loyalty and the ability to navigate challenging situations.'
  },
  {
    id: '4',
    text: "If you haven't been formally employed but have engaged in personal or freelance projects, it's important to include these experiences in your CV."
  },
];

export const Experience = () => {
  const [dontHave, setDontHave] = useState<boolean>(false);
  const router = useRouter();
  const [experiences, setExperiences] = useRecoilState(ExperiencesStore);
  const setExperienceId = useSetRecoilState(ExperienceIdStore);

  const fetchExperiences = useCallback(async () => {
    try {
      const resp: AxiosResponse<any, any> = await getExperience();
      const data: IExperience[] = resp.data.data.data;
      data.sort(
        (a, b) =>
          new Date(b.from_date).getTime() - new Date(a.from_date).getTime()
      );
      setExperiences(data);
    } catch (error) {}
  }, []);

  useEffect(() => {
    if (!experiences) fetchExperiences();
  }, []);

  return (
    <>
      <FlowContainer
        title={'MANAGE EXPERIENCE'}
        text={'Add as much experience as you have to be displayed to potential employers who will see your CV and, if you fit their needs, send you job offers. Is it important to be honest when you create your CV.'}
        pageName={FlowPageName.Experience}
        infoTexts={infoTexts}
      >
        <div className="experience">
          <div className={"experience__content"}>
            {experiences?.length ? (
              <div className="experience__data">
                <div className="experience__containers">
                  {experiences.map((experience) => {
                    const {
                      experience_id,
                      from_date,
                      to_date,
                      still_working,
                      company,
                      JobTitle,
                      job_type,
                      Country
                    } = experience;

                    const monthsArray = getMonthsArray();
                    const startDate = new Date(from_date);
                    const startMonth: MonthType | undefined = monthsArray.find(
                      (month) => +month.id === startDate.getMonth()
                    );
                    const startYear = startDate.getFullYear();

                    //we might not have an end date
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
                      <div key={experience_id} className="experience__container">
                        <div className="experience__container-left">
                          <div className="experience__flag">
                            <FlagIcon code={Country?.alpha_2 || null}/>
                          </div>

                          <div className="experience__job-info">
                            <div className="experience__job-title">
                              {JobTitle?.name}
                            </div>

                            <div className="experience__company">
                              {company}
                            </div>
                          </div>

                          <div className="experience__job-type">
                            {job_type}
                          </div>
                        </div>

                        <div className="experience__container-right">
                          <div className="experience__container-date-left">
                            <div className="experience__container-date">
                              <div className="experience__container-date-title">
                                Start Date
                              </div>

                              <div className="experience__container-date-text">
                                {startMonth?.name} {startYear}
                              </div>
                            </div>
                          </div>

                          <div className="experience__container-date-right">
                            <div className="experience__container-date">
                              <div className="experience__container-date-title">
                                End Date
                              </div>

                              {!still_working ? (
                                <div className="experience__container-date-text">
                                  {endMonth?.name} {endYear}
                                </div>
                              ) : (
                                <div className="experience__container-date-text">
                                  Current
                                </div>
                              )}
                            </div>

                            <div
                              className="experience__container-edit"
                              onClick={() => {
                                //we save the specific experience id for passing it to edit page
                                if (experience_id) {
                                  setExperienceId(experience_id);
                                  router.push("/candidates/flow/experience/edit/");
                                }
                              }}
                            ></div>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>

                <div className="experience__add-another">
                  <AddAnother
                    buttonText="Add another experience"
                    redirectPath="/candidates/flow/experience/add/"
                  />
                </div>
              </div>
            ) : (
              <div className="experience__no-data">
                <div className="experience__no-data-icon">
                  <NoDataIcon />
                </div>

                <div className="experience__no-data-title">
                  No experience added
                </div>

                <div className="experience__no-data-checkbox">
                  <Checkbox
                    onClick={() => setDontHave(!dontHave)}
                    checked={dontHave}
                  />

                  <div className="experience__no-data-checkbox-title">
                    I don't have any experience to add
                  </div>
                </div>
              </div>
            )}
          </div>

          <div className="experience__bottom">
            {experiences?.length || dontHave ? (
              <NextStep nextStep={NextStepInfo.Education}/>
            ) : (
              <AddData
                currentPage={AddDataPage.Experience}
                buttonName="Add Experience"
                redirectPath="/candidates/flow/experience/add/"
              />
            )}
          </div>
        </div>
      </FlowContainer>

      <div className="steps steps--mobile">
        <StepIcon
          iconName={"residency"}
          status={"done"}
          title={"Residency"}
        />

        <div className="steps-arrows">
          <Arrows toRight={false} arrowsCount={3} />
        </div>

        <StepIcon
          iconName={"experience"}
          status={"current"}
          title={"Experience"}
        />

        <div className="steps-arrows">
          <Arrows toRight={true} arrowsCount={3} />
        </div>

        <StepIcon
          iconName={"education"}
          status={"undone"}
          title={"Education"}
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
          status={"current"}
          title={"Experience"}
        />

        <div className="steps-arrows">
          <Arrows toRight={true} />
        </div>

        <StepIcon
          iconName={"education"}
          status={"undone"}
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
