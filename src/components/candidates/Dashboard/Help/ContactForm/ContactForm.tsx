'use client';
import '../../../../companies/Register/Register.scss';
import './ContactForm.scss';
import { Label } from '@/components/utils/Label';
import { InputField } from '@/components/utils/InputField';
import { useState } from 'react';
import { InputArea } from '@/components/utils/InputArea';
import { Button } from '@/components/utils/Button';
import classNames from 'classnames';
import { isEmailCorrect } from '@/components/utils/utils';
import { IContactUs, contactUs } from '@/services/api/contact-us.service';

interface Props {
  onClose: () => void;
};

export const ContactForm: React.FC<Props> = ({ onClose }) => {
  const [firstname, setFirstname] = useState<string>('');
  const [lastname, setLastname] = useState<string>('');
  const [email, setEmail] = useState<string>('');
  const [message, setMessage] = useState<string>('');
  const [firstnameError, setFirstnameError] = useState<boolean>(false);
  const [lastnameError, setLastnameError] = useState<boolean>(false);
  const [emailError, setEmailError] = useState<boolean>(false);
  const [messageError, setMessageError] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const handleSubmitForm = async () => {
    let errorAppeared: boolean = false;

    if (!firstname) {
      errorAppeared = true;
      setFirstnameError(true);
    }

    if (!lastname) {
      errorAppeared = true;
      setLastnameError(true);
    }

    if (!email || (email && !isEmailCorrect(email))) {
      errorAppeared = true;
      setEmailError(true);
    }

    if (!message) {
      errorAppeared = true;
      setMessageError(true);
    }

    if (errorAppeared) return;

    const data: IContactUs = {
      firstname,
      lastname,
      email,
      message,
    };

    try {
      setIsLoading(true);
      await contactUs(data);
      setIsLoading(false);
      onClose();
    } catch (error) {
      setIsLoading(false);
    }
  };

  return (
    <div className="contact-form">
      <div className="container contact-form__content">
        <div onClick={onClose} className="contact-form__cross"/>

        <div className="contact-form__title">
          Contact us
        </div>

        <div className="container__form-row">
          <div className="container__label contact-form__first-label">
            <Label title='Firstname'>
              <InputField
                type='text'
                name='firstname'
                value={firstname}
                onChange={(e) =>{
                  setFirstname(e.target.value);
                  setFirstnameError(false);
                }}
                error={firstnameError}
                />
            </Label>
          </div>

          <div className="container__label">
            <Label title='Lastname'>
              <InputField
                type='text'
                name='lastname'
                value={lastname}
                onChange={(e) => {
                  setLastname(e.target.value);
                  setLastnameError(false);
                }}
                error={lastnameError}
              />
            </Label>
          </div>
        </div>

        <div className="container__label">
          <Label title='Email'>
            <InputField
              type='text'
              name='email'
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
                setEmailError(false);
              }}
              error={emailError}
            />
          </Label>

          <div
            className={classNames("register__validate-icon", {
              "register__validate-icon--invalid": email.length,
              "register__validate-icon--valid": isEmailCorrect(email),
            })}
          />
        </div>

        <div className="contact-form__input-area">
          <Label
            title='Message'
            secondTitle={`${message.length}/2000`}
            forArea
          >
            <InputArea
              name='message'
              value={message}
              onPaste={(e) => {
                setTimeout(() => {
                  const clipboardData = (window as any).clipboardData || e.clipboardData;
                  const pastedText = clipboardData?.getData('text/plain');

                  if (pastedText && pastedText.length <= 2000) {
                    setMessage(pastedText);
                    setMessageError(false);
                  }
                });
              }}
              onChange={(e) => {
                if (e.target.value.length <= 2000) {
                  setMessage(e.target.value);
                  setMessageError(false);
                };
              }}
              error={messageError}
            />
          </Label>
        </div>

        <div className="contact-form__button">
          <Button
            onClick={handleSubmitForm}
            loading={isLoading}
          >
            Contact us
          </Button>
        </div>
      </div>
    </div>
  )
}
