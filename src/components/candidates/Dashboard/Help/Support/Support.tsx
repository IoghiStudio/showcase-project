'use client';
import { useState } from 'react';
import './Support.scss';
import { ContactForm } from '../ContactForm';

export const Support = () => {
  const [formOpened, setFormOpened] = useState<boolean>(false);

  return (
    <div className="container support">
      {formOpened && (
        <ContactForm onClose={() => setFormOpened(false)}/>
      )}

      <div className="support__top">
        <div className="support__headline">
          Contact Support
        </div>

        <div className="support__title">
          Get help now
        </div>

        <div className="support__subline">
          in the following ways
        </div>

        <div className="support__columns">
          <div className="support__column">
            <div className="support__row">
              <div className="support__check"/>

              <div className="support__text">
                Account Settings
              </div>
            </div>

            <div className="support__row">
              <div className="support__check"/>

              <div className="support__text">
                Privacy and Security
              </div>
            </div>
          </div>

          <div className="support__column">
            <div className="support__row">
              <div className="support__check"/>

              <div className="support__text">
                Subscription & Payments
              </div>
            </div>

            <div className="support__row">
              <div className="support__check"/>

              <div className="support__text">
                Trobleshooting
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="support__bottom">
        <div onClick={() => setFormOpened(true)} className="support__btn">
          Contact customer support
        </div>
      </div>
    </div>
  )
}
