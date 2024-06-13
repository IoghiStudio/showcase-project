'use client';
import './Help.scss';
import { useSetRecoilState } from 'recoil';
import { Support } from './Support';
import { CandidateHeaderMessageStore, CandidateHeaderMessages } from '@/store/headerStore';
import { useEffect } from 'react';
import { Handbook } from './Handbook';

type Props = {
  forCompany?: boolean;
};

export const Help: React.FC<Props> = ({ forCompany = false }) => {
  const setCandidateHeaderMessage = useSetRecoilState(CandidateHeaderMessageStore);

  useEffect (() => {
    setCandidateHeaderMessage(CandidateHeaderMessages.Help);
  }, []);

  return (
    <div className="help">
      <div className="container help__handbook">
        <Handbook forCompany={forCompany} />
      </div>

      <div className="container help__support">
        <Support />
      </div>
    </div>
  )
}
