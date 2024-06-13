'use client';
import './Courses.scss';
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
import { CourseIdStore, CoursesStore } from '@/store/flowPagesData/coursesStore';
import { ICourse, getCourses } from '@/services/api/courses.service';
import { AxiosResponse } from 'axios';
import { MonthType } from '@/types/Month';
import { getMonthsArray } from '@/components/utils/utils';
import { useRouter } from 'next/navigation';

const infoTexts: FlowPageText[] = [
  {
    id: '1',
    text: "Training courses may be organized or required by your employers, or you can choose to enroll independently, either physically or online. It's crucial to demonstrate your enthusiasm for learning and your commitment to self-improvement."
  },
  {
    id: '2',
    text: 'These courses can be free, such as those available online, or paid. They can improve your skills, such as problem-solving, time management, and public speaking. They can also improve job-related activities, such as safety measures, learning new welding techniques, add a new category of vehicle to your driving license, and the list can go on.'
  },
];

export const Courses = () => {
  const [dontHave, setDontHave] = useState<boolean>(false);
  const router = useRouter();
  const setCourseId = useSetRecoilState(CourseIdStore);
  const [courses, setCourses] = useRecoilState(CoursesStore);

  const fetchCourses = useCallback(async () => {
    try {
      const resp: AxiosResponse<any, any> = await getCourses();
      const data: ICourse[] = resp.data.data.data;
      data.sort(
        (a, b) =>
          new Date(b.start_date).getTime() - new Date(a.start_date).getTime()
      );
      setCourses(data);
    } catch (error) {}
  }, []);

  useEffect(() => {
    if (!courses) fetchCourses();
  }, []);

  return (
    <>
      <FlowContainer
        title={'MANAGE COURSES'}
        text={'Add, edit or delete your courses'}
        pageName={FlowPageName.Courses}
        infoTexts={infoTexts}
      >
        <div className="courses">
          <div className={"courses__content"}>
            {courses?.length ? (
              <div className="courses__data">
                <div className="courses__containers">
                  {courses.map(course => {
                    const {
                      training_course_id,
                      course_name,
                      start_date,
                      end_date,
                      institution
                    } = course;
                    const monthsArray = getMonthsArray();

                    const startDate = new Date(start_date);
                    const endDate = new Date(end_date);
                    const startMonth: MonthType | undefined = monthsArray.find(
                      (month) => +month.id === startDate.getMonth()
                    );
                    const endMonth: MonthType | undefined = monthsArray.find(
                      (month) => +month.id === endDate.getMonth()
                    );
                    const startYear = startDate.getFullYear();
                    const endYear = endDate.getFullYear();

                    return (
                      <div key={training_course_id} className="courses__container">
                        <div className="courses__container-left">
                          <div className="courses__job-info">
                            <div className="courses__job-title">
                              {course_name}
                            </div>

                            <div className="courses__company">{institution}</div>
                          </div>
                        </div>

                        <div className="courses__container-right">
                          <div className="courses__container-date-left">
                            <div className="courses__container-date">
                              <div className="courses__container-date-title">
                                Start Date
                              </div>

                              <div className="courses__container-date-text">
                                {startMonth?.name} {startYear}
                              </div>
                            </div>
                          </div>

                          <div className="courses__container-date-right">
                            <div className="courses__container-date">
                              <div className="courses__container-date-title">
                                End Date
                              </div>

                              <div className="courses__container-date-text">
                                {endMonth?.name} {endYear}
                              </div>
                            </div>

                            <div
                              className="courses__container-edit"
                              onClick={() => {
                                if (training_course_id) {
                                  setCourseId(training_course_id);
                                  router.push('/candidates/flow/courses/edit/');
                                }
                              }}
                            ></div>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>

                <div className="courses__add-another">
                  <AddAnother
                    buttonText="Add another course"
                    redirectPath="/candidates/flow/courses/add/"
                  />
                </div>
              </div>
            ) : (
              <div className="courses__no-data">
                <div className="courses__no-data-icon">
                  <NoDataIcon />
                </div>

                <div className="courses__no-data-title">
                  No course added
                </div>

                <div className="courses__no-data-checkbox">
                  <Checkbox
                    onClick={() => setDontHave(!dontHave)}
                    checked={dontHave}
                  />

                  <div className="courses__no-data-checkbox-title">
                    I DON’T HAVE ANY TRAINING OR COURSE TO ADD
                  </div>
                </div>
              </div>
            )}
          </div>

          <div className="courses__bottom">
            {courses?.length || dontHave ? (
              <NextStep nextStep={NextStepInfo.Languages}/>
            ) : (
              <AddData
                currentPage={AddDataPage.Course}
                buttonName="Add Course"
                redirectPath="/candidates/flow/courses/add/"
              />
            )}
          </div>
        </div>
      </FlowContainer>

      <div className="steps steps--mobile">
        <StepIcon
          iconName={"certifications"}
          status={"done"}
          title={"Certification"}
        />

        <div className="steps-arrows">
          <Arrows toRight={false} arrowsCount={3} />
        </div>

        <StepIcon
          iconName={"courses"}
          status={"current"}
          title={"Courses"}
        />

        <div className="steps-arrows">
          <Arrows toRight={true} arrowsCount={3} />
        </div>

        <StepIcon
          iconName={"language"}
          status={"undone"}
          title={"Language"}
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
          status={"done"}
          title={"Certification"}
        />

        <div className="steps-arrows">
          <Arrows toRight={false} />
        </div>

        <StepIcon
          iconName={"courses"}
          status={"current"}
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
