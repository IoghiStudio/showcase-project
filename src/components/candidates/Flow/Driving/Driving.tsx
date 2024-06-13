'use client';
import './Driving.scss';
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
import { UserDrivingIdStore, UserDrivingStore } from '@/store/flowPagesData/userDrivingStore';
import { useRecoilState, useSetRecoilState } from 'recoil';
import { useRouter } from 'next/navigation';
import { AxiosResponse } from 'axios';
import { IUserDriving, getUserDriving } from '@/services/api/userDriving.service';
import { MonthType } from '@/types/Month';
import { FlagIcon } from '@/components/utils/FlagIcon';
import { getMonthsArray } from '@/components/utils/utils';

const infoTexts: FlowPageText[] = [
  {
    id: '1',
    text: "Highlight your driving skills and qualifications by adding any relevant licenses to your CV. Whether it's a standard driver's license or specialized endorsements, showcase your ability to navigate the road safely and efficiently."
  },
];

export const Driving = () => {
  const [dontHave, setDontHave] = useState<boolean>(false);
  const [userDrivings, setUserDrivings] = useRecoilState(UserDrivingStore);
  const router = useRouter();
  const setUserDrivingId = useSetRecoilState(UserDrivingIdStore);

  const fetchUserDrivings = useCallback(async () => {
    try {
      const resp: AxiosResponse<any, any> = await getUserDriving();
      const data: IUserDriving[] = resp.data.data.data;
      data.sort(
        (a, b) =>
          new Date(b.date_of_acquisition).getTime() - new Date(a.date_of_acquisition).getTime()
      );
      setUserDrivings(data);
    } catch (error) {}
  }, []);

  useEffect(() => {
    if (!userDrivings) fetchUserDrivings();
  }, []);

  return (
    <>
      <FlowContainer
        title={'MANAGE DRIVING LICENSES'}
        text={'Add, edit or delete your driving licenses'}
        pageName={FlowPageName.Driving}
        infoTexts={infoTexts}
      >
        <div className="driving">
          <div className={"driving__content"}>
            {userDrivings?.length ? (
              <div className="driving__data">
                <div className="driving__containers">
                  {userDrivings.map((license) => {
                    const {
                      driving_licence_id,
                      Country,
                      date_of_acquisition,
                      category
                    } = license;
                    const monthsArray = getMonthsArray();
                    const ourDate = new Date(date_of_acquisition);
                    const month: MonthType | undefined = monthsArray.find(
                      (month) => +month.id === ourDate.getMonth()
                    );
                    const year = ourDate.getFullYear();

                    return (
                      <div key={driving_licence_id} className="driving__container">
                        <div className="driving__container-left">
                          <div className="driving__flag">
                            <FlagIcon code={Country?.alpha_2 || ''} />
                          </div>

                          <div className="driving__job-info">
                            <div className="driving__job-title">
                              {category}
                            </div>
                          </div>
                        </div>

                        <div className="driving__container-right">
                          <div className="driving__container-date">
                            <div className="driving__container-date-title">
                              Date Optained
                            </div>

                            <div className="driving__container-date-text">
                              {month?.name} {year}
                            </div>
                          </div>

                          <div
                            className="driving__container-edit"
                            onClick={() => {
                              //we save the specific permit id for passing it to edit page
                              if (driving_licence_id) {
                                setUserDrivingId(driving_licence_id)
                                router.push("/candidates/flow/driving-license/edit/");
                              }
                            }}
                          ></div>
                        </div>
                      </div>
                    );
                  })}
                </div>

                <div className="driving__add-another">
                  <AddAnother
                    buttonText="Add another driving license"
                    redirectPath="/candidates/flow/driving-license/add/"
                  />
                </div>
              </div>
            ) : (
              <div className="driving__no-data">
                <div className="driving__no-data-icon">
                  <NoDataIcon />
                </div>

                <div className="driving__no-data-checkbox">
                  <Checkbox
                    onClick={() => setDontHave(!dontHave)}
                    checked={dontHave}
                  />

                  <div className="driving__no-data-checkbox-title">
                    I don't have any driving license
                  </div>
                </div>
              </div>
            )}
          </div>

          <div className="driving__bottom">
            {userDrivings?.length || dontHave ? (
              <NextStep nextStep={NextStepInfo.Picture}/>
            ) : (
              <AddData
                currentPage={AddDataPage.License}
                buttonName="Add License"
                redirectPath="/candidates/flow/driving-license/add/"
              />
            )}
          </div>
        </div>
      </FlowContainer>

      <div className="steps steps--mobile">
        <StepIcon
          iconName={"language"}
          status={"done"}
          title={"Language"}
        />

        <div className="steps-arrows">
          <Arrows toRight={false} arrowsCount={3} />
        </div>

        <StepIcon
          iconName={"driving"}
          status={"current"}
          title={"Driving"}
        />

        <div className="steps-arrows">
          <Arrows toRight={true} arrowsCount={3} />
        </div>

        <StepIcon
          iconName={"picture"}
          status={"undone"}
          title={"Picture"}
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
          status={"done"}
          title={"Courses"}
        />

        <div className="steps-arrows">
          <Arrows toRight={false} />
        </div>

        <StepIcon
          iconName={"language"}
          status={"done"}
          title={"Language"}
          />

        <div className="steps-arrows">
          <Arrows toRight={false} />
        </div>

        <StepIcon
          iconName={"driving"}
          status={"current"}
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
