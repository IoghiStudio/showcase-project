'use client';
import { ButtonColor } from '@/types/ButtonColor';
import './ButtonWithIcon.scss';
import classNames from 'classnames';
import { LoadingModal } from '@/components/utils/LoadingModal';

export enum ButtonIcon {
  Check,
  Plus,
  PlusBlue
}

type Props = {
  long?:boolean;
  bgColor?: ButtonColor;
  color?: ButtonColor;
  borderColor?: ButtonColor;
  text?: string;
  icon?:  ButtonIcon;
  isLoading?: boolean,
  noIcon?: boolean,
};

export const ButtonWithIcon: React.FC<Props> = ({
  long = false,
  bgColor = ButtonColor.Green,
  color = ButtonColor.White,
  borderColor = ButtonColor.Green,
  text = '',
  icon = ButtonIcon.Check,
  isLoading = false,
  noIcon = false
}) => {
  return (
    <div className={classNames("b-w-i", {
      "b-w-i--long": long,
      "b-w-i--bg-white": bgColor === ButtonColor.White,
      "b-w-i--bg-blue": bgColor === ButtonColor.Blue,
      "b-w-i--bg-green": bgColor === ButtonColor.Green,
      "b-w-i--bg-red": bgColor === ButtonColor.Red,
      "b-w-i--bg-gray": bgColor === ButtonColor.Gray,
      "b-w-i--color-white": color === ButtonColor.White,
      "b-w-i--color-blue": color === ButtonColor.Blue,
      "b-w-i--color-green": color === ButtonColor.Green,
      "b-w-i--color-red": color === ButtonColor.Red,
      "b-w-i--color-gray": color === ButtonColor.Gray,
      "b-w-i--border-white": borderColor === ButtonColor.White,
      "b-w-i--border-blue": borderColor === ButtonColor.Blue,
      "b-w-i--border-green": borderColor === ButtonColor.Green,
      "b-w-i--border-red": borderColor === ButtonColor.Red,
      "b-w-i--border-gray": borderColor === ButtonColor.Gray
    })}>
      {!isLoading ? (
        <>
          {!noIcon && (
            <div className={classNames("b-w-i__icon", {
              "b-w-i__icon--check": icon === ButtonIcon.Check,
              "b-w-i__icon--plus": icon === ButtonIcon.Plus,
              "b-w-i__icon--plus-blue": icon === ButtonIcon.PlusBlue,
            })} />
          )}

          <div className="b-w-i__text">
            {text}
          </div>
        </>
      ) : <LoadingModal />}
    </div>
  )
}
