'use client';
import './Profile.scss';
import { ActivePoitions } from './ActivePositions';
import { FlowDataContainer, FlowDataIcon } from './FlowDataContainer';
import { UserData } from './UserData';
import { CoursesData } from './CoursesData';
import { ExperienceData } from './ExperienceData';
import { EducationData } from './EducationData';
import { CertificationsData } from './CertificationsData';
import { LanguagesData } from './LanguagesData';
import { DrivingData } from './DrivingData';
import { CandidateHeaderMessageStore, CandidateHeaderMessages } from '@/store/headerStore';
import { useEffect } from 'react';
import { useSetRecoilState } from 'recoil';

export const Profile = () => {
  const setCandidateHeaderMessage = useSetRecoilState(CandidateHeaderMessageStore);

  useEffect(() => {
    setCandidateHeaderMessage(CandidateHeaderMessages.Profie);
  }, []);

  return (
    <div className="profile">
      <div className="profile__top">
        <div className="profile__user-data">
          <UserData />
        </div>

        <div className="profile__positions">
          <ActivePoitions />
        </div>
      </div>

      <div className="profile__columns">
        <div className="profile__column">
          <div className="profile__data">
            <ExperienceData />
          </div>

          <div className="profile__data profile__data--disabled-lp">
            <EducationData />
          </div>

          <div className="profile__data profile__data--disabled-lp">
            <CertificationsData />
          </div>

          <div className="profile__data profile__data--disabled-lp">
            <CoursesData />
          </div>

          <div className="profile__data">
            <LanguagesData />
          </div>

          <div className="profile__data profile__data--driving">
            <DrivingData />
          </div>
        </div>

        <div className="profile__column profile__column--2">
          <div className="profile__data profile__data--disabled-lp">
            <ExperienceData />
          </div>

          <div className="profile__data">
            <EducationData />
          </div>

          <div className="profile__data">
            <CertificationsData />
          </div>

          <div className="profile__data">
            <CoursesData />
          </div>

          <div className="profile__data profile__data--disabled-lp">
            <LanguagesData />
          </div>

          <div className="profile__data profile__data--driving profile__data--disabled-lp">
            <DrivingData />
          </div>
        </div>
      </div>
    </div>
  )
}
