'use client';
import './Skills.scss';
import cn from 'classnames';
import { FlowPageName, FlowPageText } from "@/types/FlowPage";
import { FlowContainer } from "../FlowContainer";
import { NextStep, NextStepInfo } from "../NextStep";
import { useCallback, useEffect, useState } from "react";
import { Label } from '@/components/utils/Label';
import { JobPositionIdStore } from '@/store/jobPositionStore';
import { useRecoilValue } from 'recoil';
import { IPositionSkills, updatePositionSkills } from '@/services/api/jobPosition.service';
import classNames from 'classnames';
import { useRouter } from 'next/navigation';

const infoTexts: FlowPageText[] = [
  {
    id: '1',
    text: 'Please mention the skills that you consider most important for the job you are pursuing.'
  },
  {
    id: '2',
    text: "Most of the hard skills can be already observed from your experience, education, and training, so it would be better to mention here more soft skills, like teamwork, the ability to work in stressful situations, time management, etc."
  },
];

export const Skills = () => {
  const [query, setQuery] = useState<string>('');
  const [skillList, setSkillList] = useState<string[]>([]);
  const [labelTitle, setLabelTitle] = useState<string>('add new skill');
  const [showError, setShowError] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [listError, setListError] = useState<boolean>(false);
  const router = useRouter();

  useEffect(() => {
    if (!skillList.length) {
      setLabelTitle('add new skill');
      return;
    };

    if (skillList.length === 5) {
      setLabelTitle('SKILLS ADDED');
      return;
    };

    const remainToAdd = 5 - skillList.length;

    if (skillList.length < 5) {
      setLabelTitle(`ADD ${remainToAdd} MORE SKILL(S)`)
    }
  }, [skillList]);

  const handleAddSkill = useCallback((skillName: string, skillListReceived: string[]) => {
    if (skillListReceived.includes(skillName)) {
      handleErrorMessage("Already added")
      return;
    }

    const newSkills = [...skillListReceived, skillName];
    setSkillList(newSkills);
    setQuery('');
  }, []);

  const handleRemoveSkill = useCallback((skillName: string, skillListReceived: string[]) => {
    const newSkills = skillListReceived.filter(skill => skill !== skillName);
    setSkillList(newSkills);
  }, []);

  const handleErrorMessage = useCallback((errorName: string) => {
    setErrorMessage(errorName);
    setShowError(true);
    setTimeout(() => setShowError(false), 2000);
  }, []);

  const handleUpdateSkills = async () => {
    if (skillList.length < 5) {
      setListError(true);
      return;
    }

    try {
      setIsLoading(true);
      const positionId: string | null = localStorage.getItem('flow_position_id');

      if (!positionId) {
        router.push('/candidates/flow/signin/');
        return;
      }

      const data: IPositionSkills = {
        skills: skillList
      };

      await updatePositionSkills(+positionId, data);
      router.push('/candidates/steps/demo-video/');
    } catch (error) {
      setIsLoading(false);
    }
  };

  return (
    <FlowContainer
      title={'MY SKILLS'}
      text={"Please mention the skills that you consider most important for the job you are pursuing. Most of the hard skills can be already observed from your experience, education, and training, so it would be better to mention here more soft skills, like teamwork, the ability to work in stressful situations, time management, etc. You need to add at least 5 skills."}
      pageName={FlowPageName.Skills}
      infoTexts={infoTexts}
    >
      <div className="skills">
        <div className={"skills__content"}>
          <div className="skills__columns">
            <div className="skills__column">
              <Label title='add new skill' >
                <div className="skills__skill">
                  <input
                    type="text"
                    value={query}
                    onChange={(e) => {
                      if (e.target.value.length < 28) {
                        setQuery(e.target.value);
                        setListError(false);
                      }
                    }}
                    placeholder='type your top skills'
                    className={classNames('skills__input',{
                      'skills__input--error': listError
                    })}
                  />

                  <div
                    className={cn("skills__add", {
                      "skills__add--disabled": skillList.length > 15
                    })}
                    onClick={() => {
                      if (!query.length) {
                        setListError(true);
                        return;
                      }

                      if (skillList.length < 16) {
                        handleAddSkill(query, skillList);
                        return;
                      }
                    }}
                  >
                    Add
                  </div>
                </div>
              </Label>

              {showError && (
                <div className="skills__error-message">
                  {errorMessage}
                </div>
              )}
            </div>

            <div className="skills__column">
              <Label title={labelTitle} >
                {skillList.map(skill => (
                  <div key={skill} className ="skills__skill">
                    <div className="skills__skill-name">
                      {skill}
                    </div>

                    <div
                      className="skills__cross"
                      onClick={() => handleRemoveSkill(skill, skillList)}
                    >
                      <div className="skills__cross-icon"/>
                    </div>
                  </div>
                ))}
              </Label>
            </div>
          </div>
        </div>

        <div className="skills__bottom">
          <NextStep
            nextStep={NextStepInfo.Video}
            isLoading={isLoading}
            onClick={handleUpdateSkills}
          />
        </div>
      </div>
    </FlowContainer>
  )
}
