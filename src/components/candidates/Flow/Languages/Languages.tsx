'use client';
import './Languages.scss';
import { FlowPageName, FlowPageText } from "@/types/FlowPage";
import { FlowContainer } from "../FlowContainer";
import { NextStep, NextStepInfo } from "../NextStep";
import { useCallback, useEffect } from "react";
import { AddData, AddDataPage } from "../AddData";
import { AddAnother } from "../AddAnother/AddAnother";
import { NoDataIcon } from "@/components/utils/NoDataIcon";
import { StepIcon } from '@/components/utils/StepIcon';
import { Arrows } from '@/components/utils/Arrows';
import { useRouter } from 'next/navigation';
import { useRecoilState, useSetRecoilState } from 'recoil';
import { UserLanguageIdStore, UserLanguagesStore } from '@/store/flowPagesData/userLanguagesStore';
import { AxiosResponse } from 'axios';
import { IUserLanguage, getUserLanguages } from '@/services/api/userLanguages.service';

const infoTexts: FlowPageText[] = [
  {
    id: '1',
    text: 'Knowing a widely internationally spoken foreign language, like English, French, Spanish, and others, can help you obtain a better job within your country or abroad.'
  },
  {
    id: '2',
    text: 'Depending on the type of job that you desire, the required proficiency in a foreign language may vary. For instance, for physically-oriented roles like farming or unskilled labor, conversational fluency in a foreign language may suffice. However, for office-based positions, proficiency in writing and reading in that foreign language might also be necessary.'
  },
];

export const Languages = () => {
  const router = useRouter();
  const [userLanguages, setUserLanguages] = useRecoilState(UserLanguagesStore);
  const setUserLanguageId = useSetRecoilState(UserLanguageIdStore);

  const fetchUserLanguages = useCallback(async () => {
    try {
      const resp: AxiosResponse<any, any> = await getUserLanguages();
      const data: IUserLanguage[] = resp.data.data.data;
      setUserLanguages(data);
    } catch (error) {}
  }, []);

  useEffect(() => {
    if (!userLanguages) fetchUserLanguages();
  }, []);

  return (
    <>
      <FlowContainer
        title={'MANAGE LANGUAGES'}
        text={'Add languages you know or may have studied. At least one native language should be added.'}
        pageName={FlowPageName.Languages}
        infoTexts={infoTexts}
      >
        <div className="languages">
          <div className={"languages__content"}>
            {userLanguages?.length ? (
              <div className="languages__data">
                <div className="languages__containers">
                  {userLanguages.map((userLanguage) => {
                    const {user_language_id, Language, proficiency } = userLanguage;

                    return (
                      <div key={user_language_id} className="languages__container">
                        <div className="languages__container-left">
                          <div className="languages__job-info">
                            <div className="languages__job-title">
                              {Language?.name}
                            </div>
                          </div>
                        </div>

                        <div className="languages__container-right">
                          <div className="languages__container-date">
                            <div className="languages__container-date-title">
                              Proficiency
                            </div>

                            <div className="languages__container-date-text">
                              {proficiency}
                            </div>
                          </div>

                          <div
                            className="languages__container-edit"
                            onClick={() => {
                              if (user_language_id) {
                                setUserLanguageId(user_language_id);
                                router.push("/candidates/flow/languages/edit/");
                              }
                            }}
                          />
                        </div>
                      </div>
                    );
                  })}
                </div>

                <div className="languages__add-another">
                  <AddAnother
                    buttonText="Add another language"
                    redirectPath="/candidates/flow/languages/add/"
                  />
                </div>
              </div>
            ) : (
              <div className="languages__no-data">
                <div className="languages__no-data-icon">
                  <NoDataIcon />
                </div>

                <div className="languages__no-data-title">
                  No language added
                </div>
              </div>
            )}
          </div>

          <div className="courses__bottom">
            {userLanguages?.length? (
              <NextStep nextStep={NextStepInfo.Driving}/>
            ) : (
              <AddData
                currentPage={AddDataPage.Language}
                buttonName="Add Language"
                redirectPath="/candidates/flow/languages/add/"
              />
            )}
          </div>
        </div>
      </FlowContainer>

      <div className="steps steps--mobile">
        <StepIcon
          iconName={"courses"}
          status={"done"}
          title={"Courses"}
        />

        <div className="steps-arrows">
          <Arrows toRight={false} arrowsCount={3} />
        </div>

        <StepIcon
          iconName={"language"}
          status={"current"}
          title={"Language"}
        />

        <div className="steps-arrows">
          <Arrows toRight={true} arrowsCount={3} />
        </div>

        <StepIcon
          iconName={"driving"}
          status={"undone"}
          title={"Driving"}
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
          status={"current"}
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
