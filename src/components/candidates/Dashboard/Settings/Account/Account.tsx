'use client';
import './Account.scss';
import { CandidateHeaderMessageStore, CandidateHeaderMessages } from '@/store/headerStore';
import { Info } from './Info';
import { Picture } from './Picture';
import { Resi } from './Resi';
import { useEffect } from 'react';
import { useSetRecoilState } from 'recoil';

export const Account = () => {
  const setCandidateHeaderMessage = useSetRecoilState(CandidateHeaderMessageStore);

  useEffect(() => {
    setCandidateHeaderMessage(CandidateHeaderMessages.Account);
  }, []);

  return (
    <div className="account">
      <div className="account__picture">
        <Picture />
      </div>

      <div className="account__right">
        <div className="account__info">
          <Info />
        </div>

        <div className="account__residency">
          <Resi />
        </div>
      </div>
    </div>
  )
}
