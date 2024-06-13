'use client';
import './Billing.scss';
import {  useSetRecoilState } from 'recoil';
import { CandidateHeaderMessageStore, CandidateHeaderMessages } from '@/store/headerStore';
import { useEffect } from 'react';
import { Plans } from './Plans';
import { CreditCard } from './CreditCard';
import { Invoices } from './Invoices';

type Props = {
  forCompany?: boolean;
};

export const Billing: React.FC<Props> = ({ forCompany = false }) => {
  const setCandidateHeaderMessage = useSetRecoilState(CandidateHeaderMessageStore);

  useEffect(() => {
    setCandidateHeaderMessage(CandidateHeaderMessages.Billing);
  }, []);

  return (
    <div className="billing">
      {!forCompany && (
        <div className="billing__plans">
          <Plans />
        </div>
      )}

      <div className="billing__bottom">
        <div className="container billing__history">
          <Invoices forCompany={forCompany}/>
        </div>

        <div className="container billing__card">
          <CreditCard forCompany={forCompany}/>
        </div>
      </div>
    </div>
  )
}
