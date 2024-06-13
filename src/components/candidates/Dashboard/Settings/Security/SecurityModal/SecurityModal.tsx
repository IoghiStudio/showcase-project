'use client';
import { Label } from '@/components/utils/Label';
import '../SecurityModal/SecurityModal.scss';
import './SecurityModal.scss';
import { InputField } from '@/components/utils/InputField';
import { useCallback, useState } from 'react';
import { deactivateAccountCadidate, deactivateAccountCompany, deleteAccountCadidate, deleteAccountCompany } from '@/services/api/security.service';

interface Props {
  forDelete?: boolean;
  forCompany?: boolean;
  onClose: () => void;
};

export const SecurityModal: React.FC<Props> = ({
  forDelete = false,
  forCompany = false,
  onClose,
}) => {
  const [email, setEmail] = useState<string>('');

  const handleDeactivate = useCallback(async () => {
    try {
      if (!forCompany) {
        await deactivateAccountCadidate();
      } else {
        await deactivateAccountCompany();
      }

      onClose();
    } catch (error) {}
  }, []);

  const handleDelete = useCallback(async () => {
    try {
      if (!forCompany) {
        await deleteAccountCadidate();
      } else {
        await deleteAccountCompany();
      }

      onClose();
    } catch (error) {}
  }, []);

  return (
    <div className="security-modal">
      <div className="container security-modal__content">
        <div onClick={onClose} className="security-modal__cross"/>

        <div className="security-modal__title">
          {!forDelete ? (
            'Deactivate your account'
          ) : (
            'Delete your account'
          )}
        </div>

        <div className="security-modal__subtitle">
          {!forDelete ? (
            'Are you sure you want to deactivate this account ?'
          ) : (
            'Are you sure you want to delete this account ?'
          )}
        </div>

        <div className="security-modal__text">
          {!forDelete ? (
            'You have 5 years to reactivate your account, otherwise the acount will be permanently deleted and cannot be recovered.'
          ) : (
            'You have 30 days to reconsider your intention to delete your account, otherwise the removal will be final and the account cannot be recovered.'
          )}
        </div>

        <div className="security-modal__label">
          <Label title='your account email address'>
            <InputField
              type='text'
              name='email'
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </Label>
        </div>

        <div className="security-modal__txt">
          We will email you a link shortly. Follow this link to deactivate your account
        </div>

        <div className="security-modal__button">
          {!forDelete ? (
            <div onClick={handleDeactivate} className="security__button">
              DEACTIVATE ACCOUNT
            </div>
          ) : (
            <div onClick={handleDelete} className="security__button security__button--delete">
              DELETE ACCOUNT
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
