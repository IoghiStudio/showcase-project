'use client';
import './About.scss';
import { FlowPageName, FlowPageText } from "@/types/FlowPage";
import { FlowContainer } from "../FlowContainer";
import { NextStep, NextStepInfo } from "../NextStep";
import { useState } from "react";
import { InputArea } from '@/components/utils/InputArea';
import { Label } from '@/components/utils/Label';
import { useRouter } from 'next/navigation';
import { IPositionAbout, updatePositionAbout } from '@/services/api/jobPosition.service';

const infoTexts: FlowPageText[] = [
  {
    id: '1',
    text: 'Highlight your work motivation, why you want to work in another country, if this is the case, and what are your short and long-term aspirations.'
  },
  {
    id: '2',
    text: "Don't mention your experience, training, or education again; these are already visible in your CV."
  },
];

export const About = () => {
  const [brief, setBrief] = useState<string>('');
  const [briefError, setBriefError] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const router = useRouter();

  const handleUpdateAbout = async () => {
    if (!brief.length) {
      setBriefError(true);
      return;
    }

    try {
      setIsLoading(true);
      const positionId: string | null = localStorage.getItem('flow_position_id');

      if (!positionId) {
        router.push('/candidates/flow/signin/');
        return;
      }

      const data: IPositionAbout = {
        about: brief,
      };

      await updatePositionAbout(+positionId, data);
      router.push('/candidates/steps/skills/');
    } catch (error) {
      setIsLoading(false);
    }
  };

  return (
    <FlowContainer
      title={'ABOUT YOURSELF'}
      text={"Make a brief description of yourself. Highlight your work motivation, why you want to work in another country, if this is the case, and what are your short and long-term aspirations. Don't mention your experience, training, or education again; these are already visible in your CV."}
      pageName={FlowPageName.About}
      infoTexts={infoTexts}
    >
      <div className="about">
        <div className={"about__content"}>
          <div className="about__input-area">
            <Label
              title=''
              secondTitle={`${brief.length}/300`}
              forArea
            >
              <InputArea
                name='about-me'
                value={brief}
                onChange={(e) => {
                  if (e.target.value.length <= 300) {
                    setBrief(e.target.value);
                    setBriefError(false);
                  };
                }}
                placeholder='Write a short description about yourself for companies'
                error={briefError}
              />
            </Label>
          </div>
        </div>

        <div className="about__bottom">
          <NextStep
            nextStep={NextStepInfo.Skills}
            onClick={handleUpdateAbout}
            isLoading={isLoading}
          />
        </div>
      </div>
    </FlowContainer>
  )
}
