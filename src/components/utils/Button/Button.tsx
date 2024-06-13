'use client';
import { ButtonColor } from "@/types/ButtonColor";
import cn from "classnames";
import './Button.scss';
import { LoadingModal } from "../LoadingModal";

type Props = {
  children: React.ReactNode;
  onClick: () => void;
  forAuth?: boolean;
  loading?: boolean;
  textSmall?: boolean;
  color?: ButtonColor;
};

export const Button: React.FC<Props> = ({
  children,
  onClick,
  forAuth = false,
  loading = false,
  textSmall = false,
  color = ButtonColor.Blue,
}) => {
  return (
    <div
      onClick={onClick}
      className={cn("button", {
        "button--text-sm": textSmall,
        "button--auth": forAuth,
        "button--blue": color === ButtonColor.Blue,
        "button--green": color === ButtonColor.Green,
        "button--white": color === ButtonColor.White,
        "button--red": color === ButtonColor.Red,
      })}
    >
      {loading ? <LoadingModal /> : children}
    </div>
  )
}
