'use client';
import classNames from 'classnames';
import './WarnModal.scss';

export enum IWarnModalButtonColor {
  Red,
  Yellow,
  Green,
};

type Props = {
  title: string;
  text: string;
  cancelText: string;
  confirmText: string;
  onCancel: () => void;
  onConfirm: () => void;
  buttonColor: IWarnModalButtonColor
};

export const WarnModal: React.FC<Props> = ({
  title,
  text,
  cancelText,
  confirmText,
  onCancel,
  onConfirm,
  buttonColor
}) => {
  return (
    <div className="warn-modal">
      <div className="container warn-modal__content">
        <div className="warn-modal__title">{title}</div>
        <div className="warn-modal__text">{text}</div>

        <div className="warn-modal__buttons">
          <div onClick={onCancel} className="warn-modal__button warn-modal__button--first">
            {cancelText}
          </div>

          <div onClick={onConfirm} className={classNames("warn-modal__button", {
            "warn-modal__button--red": buttonColor === IWarnModalButtonColor.Red,
            "warn-modal__button--yellow": buttonColor === IWarnModalButtonColor.Yellow,
            "warn-modal__button--green": buttonColor === IWarnModalButtonColor.Green
          })}>
            {confirmText}
          </div>
        </div>
      </div>
    </div>
  )
}
