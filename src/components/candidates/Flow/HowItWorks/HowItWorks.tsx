'use client';
import './HowItWorks.scss';
import { useState, useEffect, useCallback } from "react";
import classNames from 'classnames';
import { Button } from '@/components/utils/Button';
import { useRouter } from 'next/navigation';
import React from 'react';
import { UserDataStore } from '@/store/userDataStore';
import { useRecoilState } from 'recoil';
import { getUserData } from '@/services/api/authUser.service';
import { IUserData } from '@/types/UserData';
import { AxiosResponse } from 'axios';

interface InfoTip {
  id: string;
  icon: string;
  text: string;
};

export const InfoTips: InfoTip[] = [
  {
    id: '1',
    icon: 'profile',
    text: 'Answer a few questions and start building your profile and CV'
  },
  {
    id: '2',
    icon: 'camera',
    text: 'Show your skills on video and upload it on the platform'
  },
  {
    id: '3',
    icon: 'job',
    text: 'Start applying for different positions and receive job offers'
  },
];


export const HowItWorks = () => {
  const [userData, setUserData] = useRecoilState(UserDataStore);
  const router = useRouter();

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
    <div className="how-it-works">
      <h1 className="how-it-works__title">
        {`HEY ${userData?.firstname || ''}, YOU ARE ONE STEP CLOSER TO YOUR DREAM JOB.`}
      </h1>

      <div className="how-it-works__content">
        <div className="how-it-works__mid">
          {InfoTips.map(tip => {
            const {
              id,
              icon,
              text,
            } = tip;

            return (
              <React.Fragment key={id}>
                <div className="how-it-works__tip">
                  <div className={classNames(
                    "how-it-works__icon",
                    `how-it-works__icon--${icon}`)}>
                  </div>

                  <div className="how-it-works__text">
                    {text}
                  </div>
                </div>

                <div className="how-it-works__divider" />
              </React.Fragment>
            )
          })}

          <div className="how-it-works__bottom">
            <div className="how-it-works__button">
              <Button onClick={() => router.push('/candidates/flow/information-check/')}>
                Get Started
              </Button>
            </div>

            <div className="how-it-works__bottom-text">
              It only takes 5-10 minutes and you can edit it later. We’ll save as you go, you can take all the time you need.
            </div>
          </div>
        </div>

        <div className="how-it-works__image"/>
      </div>
    </div>
  );
};

