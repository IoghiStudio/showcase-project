'use client';
import '../Notifi/Notifi.scss';
import './Privacy.scss';
import { useSetRecoilState } from 'recoil';
import { CandidateHeaderMessageStore, CandidateHeaderMessages } from '@/store/headerStore';
import { useEffect, useState } from 'react';
import { Relocation } from '@/components/candidates/Flow/Relocation';
import { Switch } from '@/components/utils/Switch';

interface Props {
  forCompany?: boolean;
};

export const Privacy: React.FC<Props> = ({ forCompany=false }) => {
  const setCandidateHeaderMessage = useSetRecoilState(CandidateHeaderMessageStore);
  const [fromAgencies, setFromAgencies] = useState<boolean>(true);
  const [seeEmail, setSeeEmail] = useState<boolean>(false);
  const [seeNumber, setSeeNumber] = useState<boolean>(false);

  useEffect(() => {
    setCandidateHeaderMessage(CandidateHeaderMessages.Privacy);
  }, []);

  return (
    <div className="privacy">
      <div className="privacy__visibility">
        <Relocation forSettings forCompany={forCompany}/>
      </div>

      {!forCompany ? (
        <div className="container privacy__right">
          <div className="privacy__right-top">
            <div className="container__title">
              Visible for agencies
            </div>

            <div className="container__text">
              Get more jobs from recruiting agencies
            </div>
          </div>

          <div className="notifi__row">
            <div className="notifi__row-left">
              <div className="notifi__title">Your account is visible</div>
              <div className="notifi__text">To get job offers from agencies</div>
            </div>

            <div
              onClick={() => setFromAgencies(!fromAgencies)}
              className="notifi__switch"
            >
              <Switch
                isOpen={fromAgencies}
              />
            </div>
          </div>

          <div className="privacy__right-bottom">
            Be aware that some agencies may request comissions from your side. We do not recommend paying those aginecies any fee, but is out of our control.
          </div>
        </div>
      ) : (
        <div className="container privacy__right">
          <div className="privacy__right-top">
            <div className="container__title">
              Contact info display
            </div>

            <div className="container__text">
              Display contact informations on your page
            </div>
          </div>

          <div className="notifi__row">
            <div className="notifi__row-left">
              <div className="notifi__title">Company email address</div>
              <div className="notifi__text">to be seen by candidates</div>
            </div>

            <div
              onClick={() => setSeeEmail(!seeEmail)}
              className="notifi__switch"
            >
              <Switch
                isOpen={seeEmail}
              />
            </div>
          </div>

          <div className="notifi__row">
            <div className="notifi__row-left">
              <div className="notifi__title">Company phone number</div>
              <div className="notifi__text">to be seen by candidates</div>
            </div>

            <div
              onClick={() => setSeeNumber(!seeNumber)}
              className="notifi__switch"
            >
              <Switch
                isOpen={seeNumber}
              />
            </div>
          </div>

          <div className="privacy__right-bottom">
            Be aware that if you make this informations available, candidates can contact you with unwanted job requests by email or phone.
          </div>
        </div>
      )}
    </div>
  )
}
