'use client';
import '../Notifi/Notifi.scss';
import './Security.scss';
import { Switch } from '@/components/utils/Switch';
import { useEffect, useState } from 'react';
import { SecurityModal } from './SecurityModal/SecurityModal';
import { useSetRecoilState } from 'recoil';
import { CandidateHeaderMessageStore, CandidateHeaderMessages } from '@/store/headerStore';

interface Props {
  forCompany?: boolean;
};

export const Security: React.FC<Props> = ({ forCompany = false }) => {
  const [authEnabled, setAuthEnabled] = useState<boolean>(false);
  const [deactivateModal, setDeactivateModal] = useState<boolean>(false);
  const [deleteModal, setDeleteModal] = useState<boolean>(false);
  const setCandidateHeaderMessage = useSetRecoilState(CandidateHeaderMessageStore);

  useEffect(() => {
    setCandidateHeaderMessage(CandidateHeaderMessages.Security)
  }, []);

  return (
    <div className="security">
      {deactivateModal && (
        <SecurityModal
          forCompany={forCompany}
          onClose={() => setDeactivateModal(false)}
        />
      )}

      {deleteModal && (
        <SecurityModal
          forCompany={forCompany}
          onClose={() => setDeleteModal(false)}
          forDelete
        />
      )}

      <div className="security__left">
        <div className="container security__container security__container--first">
          <div className="container__title">
            Deactivate your account
          </div>

          <div className="container__text">
            This can be temporary.
          </div>

          {!forCompany ? (
            <div className="security__container-text">
              Your account will be disabled and your profile and job announcements will not be visible anymore. All your open message discutions will be closed and the candidates will be informed that you are not available and they will not be able to contact you anymore trough the platform.
            </div>
          ) : (
            <div className="security__container-text">
              Your account will be disabled and your profile and job positions will not be visible anymore. Your subscription will be canceled and your account cannot be reopened after the expiration of the current subscription until a new subscription is requested. All your open message discutions will be closed and the companies will be informed that you are not available and they will not be able to contact you anymore trough the platform.
            </div>
          )}

          <div className="security__container-text">
            Your account will be archived for a period of 5 years in which time you are able to reconsider reopening it. After this perios, your account will be removed permanently.
          </div>

          <div onClick={() => setDeactivateModal(true)} className="security__button">
            DEACTIVATE ACCOUNT
          </div>
        </div>

        <div className="container security__container">
          <div className="container__title">
            Delete your account
          </div>

          <div className="container__text">
            This is permanent.
          </div>

          {!forCompany ? (
            <div className="security__container-text">
              When you delete your VideoWorkers account, you won't be able to retrive the content you've shared on VideoWorkers. Your profile, job positions and related video and content, and all of your messages will be deleted.
            </div>
          ) : (
            <div className="security__container-text">
              When you delete your VideoWorkers account, you won't be able to retrive the content you've shared on VideoWorkers. Your profile, job announcements, candidature applications, and all of your messages will be deleted.
            </div>
          )}

          <div className="security__container-text">
            You have 30 days to reconsider your intention to delete your account, otherwise the removal will be final and the account cannot be recovered.
          </div>

          <div onClick={() => setDeleteModal(true)} className="security__button security__button--delete">
            DELETE ACCOUNT
          </div>
        </div>
      </div>

      <div className="container security__auth">
        <div className="security__auth-top">
          <div className="container__title">Authentification</div>
          <div className="container__text">Keep your account secure</div>
        </div>

        <div className="notifi__row security__auth-row">
          <div className="notifi__row-left">
            <div className="notifi__title">2-step verification</div>
            <div className="notifi__text">{`Two-factor authentification (2FA)`}</div>
          </div>

          <div
            onClick={() => setAuthEnabled(!authEnabled)}
            className="notifi__switch"
          >
            <Switch
              isOpen={authEnabled}
            />
          </div>
        </div>

        <div className="notifi__mail-chimp-bottom">
          <div className="notifi__mail-chimp-italic">
            Secure your account with
          </div>

          <div className="notifi__mail-chimp-name">
            Google Authentificator
          </div>

          <div className="notifi__mail-chimp-icon notifi__mail-chimp-icon--auth"/>
        </div>
      </div>
    </div>
  )
}
