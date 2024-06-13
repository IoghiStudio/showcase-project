'use client';
import './Notifi.scss';
import { useSetRecoilState } from 'recoil';
import { CandidateHeaderMessageStore, CandidateHeaderMessages } from '@/store/headerStore';
import { useEffect, useState } from 'react';
import { Switch } from '@/components/utils/Switch';

interface Props {
  forCompany?: boolean;
};

export const Notifi: React.FC<Props> = ({ forCompany }) => {
  const setCandidateHeaderMessage = useSetRecoilState(CandidateHeaderMessageStore);
  const [marketing, setMarketing] = useState<boolean>(true);
  const [appMessagesFromCompanies, setAppMessagesFromCompanies] = useState<boolean>(true);
  const [appJobOffersReceived, setAppJobOffersReceived] = useState<boolean>(true);
  const [appNewJobListings, setAppNewJobsListings] = useState<boolean>(true);
  const [emailMessagesFromCompanies, setEmailMessagesFromCompanies] = useState<boolean>(true);
  const [emailJobOffersReceived, setEmailJobOffersReceived] = useState<boolean>(true);
  const [emailNewJobListings, setEmailNewJobsListings] = useState<boolean>(true);

  //for companies
  const [appMessagesFromCandidates, setAppMessagesFromCandidates] = useState<boolean>(true);
  const [appAplications, setAppApplications] = useState<boolean>(true);
  const [emailMessagesFromCandidates, setEmailMessagesFromCandidates] = useState<boolean>(true);
  const [emailAplications, setEmailApplications] = useState<boolean>(true);

  useEffect(() => {
    setCandidateHeaderMessage(CandidateHeaderMessages.Notification);
  }, []);

  return (
    <div className="notifi">
      <div className="notifi__left">
        <div className="container notifi__container notifi__container--first">
          <div className="notifi__container-top">
            <div className="container__title">App Notifications</div>
            <div className="container__text">Get notified on the platform</div>
          </div>

          {!forCompany ? (
            <div className="notifi__row">
              <div className="notifi__row-left">
                <div className="notifi__title">New messages from companies</div>
                <div className="notifi__text">Notify me when you receive a new message</div>
              </div>

              <div
                className="notifi__switch"
                onClick={() => setAppMessagesFromCompanies(!appMessagesFromCompanies)}
              >
                <Switch
                  isOpen={appMessagesFromCompanies}
                />
              </div>
            </div>
          ) : (
            <div className="notifi__row" >
              <div className="notifi__row-left">
                <div className="notifi__title">New messages from candidates</div>
                <div className="notifi__text">Notify me when you receive a new message</div>
              </div>

              <div
                onClick={() => setAppMessagesFromCandidates(!appMessagesFromCandidates)}
                className="notifi__switch"
              >
                <Switch
                  isOpen={appMessagesFromCandidates}
                />
              </div>
            </div>
          )}

          {!forCompany ? (
            <div className="notifi__row">
              <div className="notifi__row-left">
                <div className="notifi__title">New job offers received</div>
                <div className="notifi__text">Notify me when i receive new job offers from companies or agencies</div>
              </div>

              <div
                onClick={() => setAppJobOffersReceived(!appJobOffersReceived)}
                className="notifi__switch"
              >
                <Switch
                  isOpen={appJobOffersReceived}
                />
              </div>
            </div>
          ) : (
            <div className="notifi__row">
              <div className="notifi__row-left">
                <div className="notifi__title">New jobs application received</div>
                <div className="notifi__text">Notify me when i receive new job applications from candidates</div>
              </div>

              <div
                onClick={() => setAppApplications(!appAplications)}
                className="notifi__switch"
              >
                <Switch
                  isOpen={appAplications}
                />
              </div>
            </div>
          )}

          {!forCompany && (
            <div className="notifi__row">
              <div className="notifi__row-left">
                <div className="notifi__title">New job listing matching you</div>
                <div className="notifi__text">Notify me when companies list new jobs matching my interest and experience</div>
              </div>

              <div
                onClick={() => setAppNewJobsListings(!appNewJobListings)}
                className="notifi__switch"
              >
                <Switch
                  isOpen={appNewJobListings}
                />
              </div>
            </div>
          )}
        </div>

        <div className="container notifi__container">
          <div className="notifi__container-top">
            <div className="container__title">Email Notifications</div>
            <div className="container__text">Get notified on email address</div>
          </div>

          {!forCompany ? (
            <div className="notifi__row">
              <div className="notifi__row-left">
                <div className="notifi__title">New messages from companies</div>
                <div className="notifi__text">Receive an email if you not respond to your messages in more than 24 hours</div>
              </div>

              <div
                className="notifi__switch"
                onClick={() => setEmailMessagesFromCompanies(!emailMessagesFromCompanies)}
              >
                <Switch
                  isOpen={emailMessagesFromCompanies}
                />
              </div>
            </div>
          ) : (
            <div className="notifi__row" >
              <div className="notifi__row-left">
                <div className="notifi__title">New messages from candidates</div>
                <div className="notifi__text">Receive an email if you not respond to your messages in more than 24 hours</div>
              </div>

              <div
                onClick={() => setEmailMessagesFromCandidates(!emailMessagesFromCandidates)}
                className="notifi__switch"
              >
                <Switch
                  isOpen={emailMessagesFromCandidates}
                />
              </div>
            </div>
          )}

          {!forCompany ? (
            <div className="notifi__row">
              <div className="notifi__row-left">
                <div className="notifi__title">New job offers received</div>
                <div className="notifi__text">Receive an email if you not respond to job offers by more than 24 hours</div>
              </div>

              <div
                onClick={() => setEmailJobOffersReceived(!emailJobOffersReceived)}
                className="notifi__switch"
              >
                <Switch
                  isOpen={emailJobOffersReceived}
                />
              </div>
            </div>
          ) : (
            <div className="notifi__row">
              <div className="notifi__row-left">
                <div className="notifi__title">New jobs application received</div>
                <div className="notifi__text">Receive an email when i receive new job applications from candidates</div>
              </div>

              <div
                onClick={() => setEmailApplications(!emailAplications)}
                className="notifi__switch"
              >
                <Switch
                  isOpen={emailAplications}
                />
              </div>
            </div>
          )}

          {!forCompany && (
            <div className="notifi__row">
              <div className="notifi__row-left">
                <div className="notifi__title">New job listing matching you</div>
                <div className="notifi__text">Receive an email when companies list new jobs matching my interest and experience</div>
              </div>

              <div
                onClick={() => setEmailNewJobsListings(!emailNewJobListings)}
                className="notifi__switch"
              >
                <Switch
                  isOpen={emailNewJobListings}
                />
              </div>
            </div>
          )}
        </div>
      </div>

      <div className="container notifi__container notifi__mail-chimp">
        <div className="notifi__container-top">
          <div className="container__title">Email Marketing</div>
          <div className="container__text">Stay informed with latet news</div>
        </div>

        <div className="notifi__row">
          <div className="notifi__row-left">
            <div className="notifi__title">Receive marketing emails</div>
            <div className="notifi__text">We will not spam you. We promise!</div>
          </div>

          <div
            className="notifi__switch"
            onClick={() => setMarketing(!marketing)}
          >
            <Switch
              isOpen={marketing}
            />
          </div>
        </div>

        <div className="notifi__mail-chimp-bottom">
          <div className="notifi__mail-chimp-italic">
            Secure email marketing by
          </div>

          <div className="notifi__mail-chimp-name">
            mailchimp
          </div>

          <div className="notifi__mail-chimp-icon"/>
        </div>
      </div>
    </div>
  )
}
