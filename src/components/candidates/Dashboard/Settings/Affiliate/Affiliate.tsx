'use client';
import './Affiliate.scss'
import { useEffect } from 'react';
import { CandidateHeaderMessageStore, CandidateHeaderMessages } from '@/store/headerStore';
import { useSetRecoilState } from 'recoil';

export const Affiliate = () => {
  const setCandidateHeaderMessage = useSetRecoilState(CandidateHeaderMessageStore);

  useEffect(() => {
    setCandidateHeaderMessage(CandidateHeaderMessages.Affiliate);
  }, []);

  return (
    <div className="container affiliate">
      <div className="affiliate__icon"/>

      <div className="container__title affiliate__title">
        This section is under development
      </div>

      <div className="container__text affiliate__text">
        Soon this functionality will help you obtain credits for free. Use these free credits to gain more visibility for your candidature in selected countries.
      </div>
    </div>
  )
}

