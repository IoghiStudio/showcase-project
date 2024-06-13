'use client';
import { useRouter } from 'next/navigation';
import './AcceptModal.scss';
import { useCallback, useState } from 'react';
import { Button } from '@/components/utils/Button';
import { ButtonColor } from '@/types/ButtonColor';
import { Label } from '@/components/utils/Label';
import { ReasonDropdown } from '@/components/utils/ReasonDropdown';
import { Select } from '@/components/utils/Select';

interface Props {
  isLoading: boolean;
  onClose: () => void;
  forReject?: boolean;
  onAccept?: () => void;
  onReject?: (reason: string) => void;
  forApplicant?: boolean;
};

export const AcceptModal: React.FC<Props> = ({
  isLoading,
  onClose,
  forReject = false,
  onAccept = () => {},
  onReject = () => {},
  forApplicant = false,
}) => {
  const router = useRouter();
  const [reasonSelected, setReasonSelected] = useState<string>('');
  const [reasonDropdown, setReasonDropdown] = useState<boolean>(false);
  const [reasonError, setReasonError] = useState<boolean>(false);

  const handleConnectionRedirect = useCallback(() => {
    if (!forApplicant) {
      router.push('/candidates/dashboard/settings/connection/');
    } else {
      router.push('/dashboard/settings/connection/');
    }
  }, []);

  const handleReject = useCallback(() => {
    if (!reasonSelected) {
      setReasonError(true);
      return;
    }

    onReject(reasonSelected)
  }, [reasonSelected]);

  const handleReasonClick = useCallback((reason: string) => {
    setReasonSelected(reason);
    setReasonDropdown(false);
    setReasonError(false);
  }, []);

  return (
    <div onClick={onClose} className="accept-modal">
      <div onClick={e => e.stopPropagation()} className="container accept-modal__content">
        <div onClick={onClose} className="accept-modal__cross"/>
        <div className="accept-modal__title">
          {!forReject ? 'Accept job offer' : 'Reject job offer'}
        </div>

        <div className="accept-modal__subtitle">
          {`You are about to ${!forReject ? 'accept' : 'decline'} this offer`}
        </div>

        {!forReject && (
          <>
            <div className="accept-modal__text">
              By accepting this job offer you will be put in contact with the employer for further details.
            </div>

            <div className="accept-modal__text">
              Prepare yourself to be contacted by the employer through messages, phone or email. In order to start the communication, the employer must initiate the first contact.
            </div>

            <div className="accept-modal__text">
              Also the employer may require video interviews through different communication channels like Zoom, Google Meet, Skype or WhatsApp. Be sure your WhatsApp is connected with VideoWorkers for faster communication. See <span
              onClick={handleConnectionRedirect}
              className="accept-modal__link"
              >connection settings</span>
            </div>
          </>
        )}

        {forReject && (
          <>
            <div className="accept-modal__text">
              By rejecting this job offer, you will notify the company that you do not agree to the terms offered. In some cases, employers may take the applicants' whishes into account and resubmit a new job offer.
            </div>

            <div className="accept-modal__text">
              <span className='accept-modal__ex'/> Select the reaon for the offer rejection and let the employer know why. Once declined, this job offer cannot be accepted anymore
            </div>

            <div className="accept-modal__label">
              <Label title='please select the reason'>
                <div
                  className="accept-modal__select"
                  onClick={() => setReasonDropdown(!reasonDropdown)}
                >
                  <Select
                    value={reasonSelected || ''}
                    error={reasonError}
                  />
                </div>

                <ReasonDropdown
                  isOpen={reasonDropdown}
                  onSelect={handleReasonClick}
                />
              </Label>
            </div>
          </>
        )}


        <div className="accept-modal__button">
          {!forReject ? (
            <Button
              onClick={onAccept}
              color={ButtonColor.Green}
              loading={isLoading}
            >
              Accept job offer
            </Button>
          ) : (
            <Button
              onClick={handleReject}
              color={ButtonColor.Red}
              loading={isLoading}
            >
              Reject job offer
            </Button>
          )}
        </div>
      </div>
    </div>
  )
};
