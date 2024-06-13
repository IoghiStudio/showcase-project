'use client';
import '../Data.scss';
import { CourseIdStore, CoursesStore } from '@/store/flowPagesData/coursesStore';
import { useRecoilState, useRecoilValue, useSetRecoilState } from 'recoil';
import { useCallback, useEffect } from 'react';
import { AxiosResponse } from 'axios';
import { ICourse, getCourses } from '@/services/api/courses.service';
import { FlowDataContainer, FlowDataIcon } from '../FlowDataContainer/FlowDataContainer';
import { MonthType } from '@/types/Month';
import { monthsArray } from '@/components/utils/utils';
import { useRouter } from 'next/navigation';
import { DataEditIcon } from '@/components/utils/DataEditIcon';
import { ISearchWorkers } from '@/services/api/serachWorkers.service';
import { WorkerDataStore } from '@/store/searchWorkersStore';
import { ApplicantOneStore, IApplicant } from '@/store/applicantsStore';


interface Props {
  forCompany?: boolean;
  forApplicant?: boolean;
};

export const CoursesData: React.FC<Props> = ({ forCompany = false, forApplicant = false }) => {
  const [courses, setCourses] = useRecoilState(CoursesStore);
  const router = useRouter();
  const setCourseId = useSetRecoilState(CourseIdStore);
  const workerData = useRecoilValue<ISearchWorkers | null>(WorkerDataStore);
  const applicantData = useRecoilValue<IApplicant | null>(ApplicantOneStore);

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
    if (forCompany) {
      if (!workerData) router.push('/dashboard/search-workers/');
    } else if (forApplicant) {
      if (!applicantData) router.push('/dashboard/applicant/');
    } else {
      if (!courses) fetchCourses();
    }
  }, []);

  return (
    <FlowDataContainer
      icon={FlowDataIcon.Course}
      title='Training & Courses'
      text='Your have attended to'
      btnText='Add course'
      forCompany={forCompany || forApplicant}
    >
      {forCompany && (
        <div className="data">
          {workerData?.Candidate.TrainingCourses.map(crs => {
            const {
              training_course_id,
              course_name,
              institution,
              start_date,
              end_date,
              description,
            } = crs;

            monthsArray;
            const startDate: Date = new Date(start_date);
            const startMonth: MonthType | undefined = monthsArray.find(
              (month) => +month.id === startDate.getMonth()
            );
            const startYear: number = startDate.getFullYear();

            //we might not have an end date
            let endDate: Date | null = null;
            let endMonth: MonthType | undefined;
            let endYear;

            if (end_date) {
              endDate = new Date(end_date);
              endMonth = monthsArray.find(
                (month) => +month.id === endDate?.getMonth()
              );
              endYear = endDate.getFullYear();
            }

            return (
              <div key={training_course_id} className="data__item-container">
                <div className="data__item">
                  <div className="data__item-content">
                    <div className="data__item-left">
                      <div className="data__info">
                        <div className="data__title">
                          {course_name}
                        </div>

                        <div className="data__info-bottom">
                          <div className="data__text">
                            {institution}
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="data__item-right data__item-right--no-mg">
                      <div className="data__date data__date--start">
                        <div className="data__date-name">
                          Start Date
                        </div>

                        <div className="data__date-text">
                          {startMonth?.name.slice(0, 3)} {startYear}
                        </div>
                      </div>

                      <div className="data__date data__date--end">
                        <div className="data__date-name">
                          End Date
                        </div>

                        <div className="data__date-text">
                          {endMonth?.name.slice(0, 3)} {endYear}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="data__desc data__desc--ml">
                  {description}
                </div>
              </div>
            )
          })}
        </div>
      )}

      {forApplicant && (
        <div className="data">
          {applicantData?.Candidate.TrainingCourses.map(crs => {
            const {
              training_course_id,
              course_name,
              institution,
              start_date,
              end_date,
              description,
            } = crs;

            monthsArray;
            const startDate: Date = new Date(start_date);
            const startMonth: MonthType | undefined = monthsArray.find(
              (month) => +month.id === startDate.getMonth()
            );
            const startYear: number = startDate.getFullYear();

            //we might not have an end date
            let endDate: Date | null = null;
            let endMonth: MonthType | undefined;
            let endYear;

            if (end_date) {
              endDate = new Date(end_date);
              endMonth = monthsArray.find(
                (month) => +month.id === endDate?.getMonth()
              );
              endYear = endDate.getFullYear();
            }

            return (
              <div key={training_course_id} className="data__item-container">
                <div className="data__item">
                  <div className="data__item-content">
                    <div className="data__item-left">
                      <div className="data__info">
                        <div className="data__title">
                          {course_name}
                        </div>

                        <div className="data__info-bottom">
                          <div className="data__text">
                            {institution}
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="data__item-right data__item-right--no-mg">
                      <div className="data__date data__date--start">
                        <div className="data__date-name">
                          Start Date
                        </div>

                        <div className="data__date-text">
                          {startMonth?.name.slice(0, 3)} {startYear}
                        </div>
                      </div>

                      <div className="data__date data__date--end">
                        <div className="data__date-name">
                          End Date
                        </div>

                        <div className="data__date-text">
                          {endMonth?.name.slice(0, 3)} {endYear}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="data__desc">
                  {description}
                </div>
              </div>
            )
          })}
        </div>
      )}

      {!forCompany && !forApplicant && (
        <div className="data">
          {courses?.map(crs => {
            const {
              training_course_id,
              course_name,
              institution,
              start_date,
              end_date,
              description,
            } = crs;

            monthsArray;
            const startDate: Date = new Date(start_date);
            const startMonth: MonthType | undefined = monthsArray.find(
              (month) => +month.id === startDate.getMonth()
            );
            const startYear: number = startDate.getFullYear();

            //we might not have an end date
            let endDate: Date | null = null;
            let endMonth: MonthType | undefined;
            let endYear;

            if (end_date) {
              endDate = new Date(end_date);
              endMonth = monthsArray.find(
                (month) => +month.id === endDate?.getMonth()
              );
              endYear = endDate.getFullYear();
            }

            return (
              <div key={training_course_id} className="data__item-container">
                <div className="data__item">
                  <div className="data__item-content">
                    <div className="data__item-left">
                      <div className="data__info">
                        <div className="data__title">
                          {course_name}
                        </div>

                        <div className="data__info-bottom">
                          <div className="data__text">
                            {institution}
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="data__item-right data__item-right--no-mg">
                      <div className="data__date data__date--start">
                        <div className="data__date-name">
                          Start Date
                        </div>

                        <div className="data__date-text">
                          {startMonth?.name.slice(0, 3)} {startYear}
                        </div>
                      </div>

                      <div className="data__date data__date--end">
                        <div className="data__date-name">
                          End Date
                        </div>

                        <div className="data__date-text">
                          {endMonth?.name.slice(0, 3)} {endYear}
                        </div>
                      </div>
                    </div>
                  </div>

                  <div
                    className="data__options"
                    onClick={() => {
                      if (training_course_id) {
                        setCourseId(training_course_id);
                        router.push("/candidates/dashboard/profile/courses-edit");
                      }
                    }}
                  >
                    <DataEditIcon />
                  </div>
                </div>

                <div className="data__desc">
                  {description}
                </div>
              </div>
            )
          })}
        </div>
      )}
    </FlowDataContainer>
  )
}
