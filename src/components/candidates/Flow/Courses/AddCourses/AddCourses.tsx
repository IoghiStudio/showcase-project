'use client';
import '../../Add.scss';
import { SaveButtonType } from '@/types/SaveButtonType';
import { FlowContainer } from '../../FlowContainer';
import { SaveButtons } from '../../SaveButtons';
import { useRouter } from 'next/navigation';
import { useCallback, useEffect, useState } from 'react';
import { InputArea } from '@/components/utils/InputArea';
import { Label } from '@/components/utils/Label';
import { InputField } from '@/components/utils/InputField';
import { Select } from '@/components/utils/Select';
import { YearDropdown } from '@/components/utils/YearDropdown';
import { MonthType } from '@/types/Month';
import { MonthDropdown } from '@/components/utils/MonthDropdown';
import { ICourse, deleteCourse, getOneCourse, postCourse, updateCourse } from '@/services/api/courses.service';
import { useRecoilValue, useSetRecoilState } from 'recoil';
import { CourseIdStore, CoursesStore } from '@/store/flowPagesData/coursesStore';
import { AxiosResponse } from 'axios';
import { monthsArray } from '@/components/utils/utils';
import { DateError } from '@/types/DateError';

type Props = {
  forEdit?: boolean;
  fromDashboard?: boolean;
};

export const AddCourses: React.FC<Props> = ({ forEdit = false, fromDashboard = false }) => {
  const [courseName, setCourseName] = useState<string>('');
  const [heldBy, setHeldBy] = useState<string>('');
  const [details, setDetails] = useState<string>('');
  const [startMonth, setStartMonth] = useState<MonthType | null>(null);
  const [endMonth, setEndMonth] = useState<MonthType | null>(null);
  const [startYear, setStartYear] = useState<string>('');
  const [endYear, setEndYear] = useState<string>('');
  const [startMonthDropdown, setStartMonthDropdown] = useState<boolean>(false);
  const [endMonthDropdown, setEndMonthDropdown] = useState<boolean>(false);
  const [startYearDropdown, setStartYearDropdown] = useState<boolean>(false);
  const [endYearDropdown, setEndYearDropdown] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const router = useRouter();
  //fields errors
  const [courseNameError, setCourseNameError] = useState<boolean>(false);
  const [heldByError, setHeldByError] = useState<boolean>(false);
  const [startMonthError, setStartMonthError] = useState<boolean>(false);
  const [startYearError, setStartYearError] = useState<boolean>(false);
  const [endMonthError, setEndMonthError] = useState<boolean>(false);
  const [endYearError, setEndYearError] = useState<boolean>(false);
  const [dateError, setDateError] = useState<boolean>(false);
  const [dateErrorMessage, setDateErrorMessage] = useState<DateError | string>('');

  const courseId = useRecoilValue(CourseIdStore);
  const setCourses = useSetRecoilState(CoursesStore);

  const handleGoBack = useCallback(() => {
    if (fromDashboard) {
      router.push('/candidates/dashboard/profile/');
      return;
    }

    router.push('/candidates/flow/courses/');
  }, []);

  const fetchOneCourse = useCallback(async (id: number) => {
    try {
      const resp: AxiosResponse<any, any> = await getOneCourse(id);
      const courseFetched: ICourse = resp.data.data.data;
      const startDate = new Date(courseFetched.start_date);
      const endDate = new Date(courseFetched.end_date);
      const startMonth: MonthType | undefined = monthsArray.find(
        (month) => +month.id === startDate.getMonth()
      );
      const endMonth: MonthType | undefined = monthsArray.find(
        (month) => +month.id === endDate.getMonth()
      );
      const startYear = startDate.getFullYear();
      const endYear = endDate.getFullYear();
      setCourseName(courseFetched.course_name);
      setHeldBy(courseFetched.institution);
      setDetails(courseFetched.description || '');
      setStartMonth(startMonth || null);
      setStartYear(String(startYear));
      setEndMonth(endMonth || null);
      setEndYear(String(endYear));
    } catch (error) {}
  }, []);

  const handleDelete = useCallback(async (id: number) => {
    try {
      await deleteCourse(id)
      setCourses(null);
      handleGoBack();
    } catch (error) {}
  }, []);

  useEffect(() => {
    if (forEdit) {
      if (!courseId) {
        handleGoBack();
      } else {
        fetchOneCourse(courseId);
      }
    };
  }, []);

  const handleStartMonthClick = useCallback((month: MonthType) => {
    setStartMonthDropdown(false);
    setStartMonth(month);
    setStartMonthError(false);
    setDateError(false);
  }, []);

  const handleEndMonthClick = useCallback((month: MonthType) => {
    setEndMonthDropdown(false);
    setEndMonth(month);
    setEndMonthError(false);
    setDateError(false);
  }, []);

  const handleStartYearClick = useCallback((year: string) => {
    setStartYearDropdown(false);
    setStartYear(year);
    setStartYearError(false);
    setDateError(false);
  }, []);

  const handleEndYearClick = useCallback((year: string) => {
    setEndYearDropdown(false);
    setEndYear(year);
    setEndYearError(false);
    setDateError(false);
  }, []);

  const handleAddCourse = async () => {
    let errorAppeared: boolean = false;

    if (!courseName) {
      setCourseNameError(true);
      errorAppeared = true;
    };
    if (!heldBy) {
      setHeldByError(true);
      errorAppeared = true;
    };
    if (!startYear) {
      setStartYearError(true);
      errorAppeared = true;
    };
    if (!endYear) {
      setEndYearError(true);
      errorAppeared = true;
    };
    if (!startMonth) {
      setStartMonthError(true);
      errorAppeared = true;
    };
    if (!endMonth) {
      setEndMonthError(true);
      errorAppeared = true;
    };
    if (errorAppeared) return;
    if (!startMonth) return;
    if (!endMonth) return;

    const startDate = new Date(+startYear, +startMonth.id);
    const endDate = new Date(+endYear, +endMonth.id);

    if (endDate < startDate) {
      setDateError(true);
      setDateErrorMessage(DateError.EndDateToEarly);
      return;
    }

    const currentYear = (new Date()).getFullYear();
    const currentMonth = (new Date()).getMonth();

    if (endDate.getFullYear() >= currentYear) {
      if (endDate.getMonth() > currentMonth) {
        setDateError(true);
        setDateErrorMessage(DateError.EndDateToSoon);
        return;
      }
    }

    const courseData: ICourse = {
      course_name: courseName,
      start_date: String(startDate),
      end_date: String(endDate),
      institution: heldBy,
      description: details || null,
    };

    try {
      setIsLoading(true);
      if (!forEdit) await postCourse(courseData);
      else if (forEdit && courseId) await updateCourse(courseId, courseData);
      setCourses(null);
      handleGoBack();
    } catch (error: any) {
      setIsLoading(false);
    }
  };

  return (
    <FlowContainer
      title={forEdit ? 'EDIT TRAINING / COURSE' : 'ADD A NEW TRAINING / COURSE'}
      text={'The human brain needs to be trained like a muscle. Taking different courses after you finish your basic education shows that you are interested in evolving and growing from a professional point of view.'}
      forAddEdit
    >
      <div className="add">
        <div className="add__content">
          <div className="add__left">
            <div className="add__form">
              <div className="add__row">
                <div className="add__label add__label--first">
                  <Label title='TRAINING / COURSE NAME'>
                    <InputField
                      type='text'
                      name='courseName'
                      value={courseName}
                      onChange={(e) => {
                        setCourseName(e.target.value);
                        setCourseNameError(false);
                      }}
                      error={courseNameError}
                    />
                  </Label>
                </div>

                <div className="add__label">
                  <Label title='HELD BY'>
                    <InputField
                      type='text'
                      name='heldBy'
                      value={heldBy}
                      onChange={(e) => {
                        setHeldBy(e.target.value);
                        setHeldByError(false);
                      }}
                      error={heldByError}
                    />
                  </Label>
                </div>
              </div>

              <div className="add__row add__row--dates">
                <div className="add__label add__label--desktop-no-mb add__label--first">
                  <Label title='START DATE'>
                    <div className="add__dates">
                      <div className="add__date add__date--first add__date--course">
                        <div
                          className="add__select"
                          onClick={() => {
                            setStartYearDropdown(false);
                            setStartMonthDropdown(!startMonthDropdown);
                            setEndMonthDropdown(false);
                            setEndYearDropdown(false);
                          }}
                        >
                          <Select
                            value={startMonth?.name || 'month'}
                            error={startMonthError}
                          />
                        </div>

                        <MonthDropdown
                          isOpen={startMonthDropdown}
                          onSelect={handleStartMonthClick}
                        />
                      </div>

                      <div className="add__date add__date--course">
                        <div
                          className="add__select"
                          onClick={() => {
                            setStartYearDropdown(!startYearDropdown);
                            setStartMonthDropdown(false);
                            setEndMonthDropdown(false);
                            setEndYearDropdown(false);
                          }}
                        >
                          <Select
                            value={startYear || 'year'}
                            error={startYearError}
                          />
                        </div>

                        <YearDropdown
                          isOpen={startYearDropdown}
                          onSelect={handleStartYearClick}
                        />
                      </div>
                    </div>
                  </Label>
                </div>

                <div className="add__label add__label--laptop-no-mb">
                  <Label title='END DATE'>
                    <div className="add__dates">
                      <div className="add__date add__date--first add__date--course">
                        <div
                          className="add__select"
                          onClick={() => {
                            setStartYearDropdown(false);
                            setStartMonthDropdown(false);
                            setEndMonthDropdown(!endMonthDropdown);
                            setEndYearDropdown(false);
                          }}
                        >
                          <Select
                            value={endMonth?.name || 'month'}
                            error={endMonthError}
                          />
                        </div>

                        <MonthDropdown
                          isOpen={endMonthDropdown}
                          onSelect={handleEndMonthClick}
                        />
                      </div>

                      <div className="add__date add__date--course">
                        <div
                          className="add__select"
                          onClick={() => {
                            setStartYearDropdown(false);
                            setStartMonthDropdown(false);
                            setEndMonthDropdown(false);
                            setEndYearDropdown(!endYearDropdown);
                          }}
                        >
                          <Select
                            value={endYear || 'year'}
                            error={endYearError}
                          />
                        </div>

                        <YearDropdown
                          isOpen={endYearDropdown}
                          onSelect={handleEndYearClick}
                        />
                      </div>
                    </div>
                  </Label>
                </div>

                {dateError && (
                  <div className="add__dates--error add__dates--error--course">
                    {dateErrorMessage}
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className="add__right">
            <div className="add__area">
              <Label
                title='DETAILS'
                secondTitle={`${details.length}/300`}
                forArea
              >
                <InputArea
                  name='details'
                  value={details}
                  onChange={(e) => {
                    if (e.target.value.length <= 300) setDetails(e.target.value);
                  }}
                  placeholder={`     Please state the duration of the class. If it was a 3-hour course or 3 days, or 2 months or one year.

    Also, don’t forget to mention if the course was only theoretical or if you’ve also put into practice what you have learned.

    In case the course was in a foreign language or was taught by a foreign teacher, please mention it.`}
                />
              </Label>
            </div>
          </div>
        </div>

        <div className="add__bottom">
          <SaveButtons
            buttonsType={!forEdit ? SaveButtonType.Add : SaveButtonType.Update}
            onSave={handleAddCourse}
            onCancel={handleGoBack}
            isSaveLoading={isLoading}
            onDelete={() => {
              if (courseId) handleDelete(courseId);
            }}
          />
        </div>
      </div>
    </FlowContainer>
  )
}
