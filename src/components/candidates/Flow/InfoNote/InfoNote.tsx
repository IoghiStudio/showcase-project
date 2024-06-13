'use client';
import './InfoNote.scss';
import { useState, useEffect, useCallback } from "react";
import classNames from 'classnames';
import { Button } from '@/components/utils/Button';
import { useRouter } from 'next/navigation';
import React from 'react';
import { AxiosResponse } from 'axios';
import { IUserData } from '@/types/UserData';
import { getUserData } from '@/services/api/authUser.service';
import { useRecoilState } from 'recoil';
import { UserDataStore } from '@/store/userDataStore';

interface InfoTip {
  id: string;
  icon: string;
  text: string;
};

export const InfoTips: InfoTip[] = [
  {
    id: '1',
    icon: 'job',
    text: 'Choose a job position and countries you want to apply to'
  },
  {
    id: '2',
    icon: 'profile',
    text: 'Choose your desired salary and requested benefits'
  },
  {
    id: '3',
    icon: 'camera',
    text: 'Add a video with you demonstrating your skills in action'
  },
];


export const InfoNote = () => {
  const router = useRouter();

  const [userData, setUserData] = useRecoilState(UserDataStore);

  const fetchUserData = useCallback(async () => {
    try {
      const resp: AxiosResponse<any, any> = await getUserData();
      const userDataFetched: IUserData = resp.data.data.data
      setUserData(userDataFetched);
    } catch (error) {}
  } ,[]);

  useEffect(() => {
    if (!userData) fetchUserData();
  }, []);

  return (
    <div className="info-note">
      <h1 className="info-note__title">
        {`HEY ${userData?.firstname || ''}. ARE YOU READY FOR YOUR NEXT BIG JOB OPPORTUNITY?`}
      </h1>

      <div className="info-note__content">
        <div className="info-note__mid">
          {InfoTips.map(tip => {
            const {
              id,
              icon,
              text,
            } = tip;

            return (
              <React.Fragment key={id}>
                <div className="info-note__tip">
                  <div className={classNames(
                    "info-note__icon",
                    `info-note__icon--${icon}`)}>
                  </div>

                  <div className="info-note__text">
                    {text}
                  </div>
                </div>

                <div className="info-note__divider" />
              </React.Fragment>
            )
          })}

          <div className="info-note__bottom">
            <div className="info-note__button">
              <Button onClick={() => router.push('/candidates/steps/add-position/')}>
                Get Started
              </Button>
            </div>

            <div className="info-note__bottom-text">
              It only takes 3-5 minutes and you can edit it later. We’ll save as you go, you can take all the time you need.
            </div>
          </div>
        </div>

        <div className="info-note__image"/>
      </div>
    </div>
  );
};

