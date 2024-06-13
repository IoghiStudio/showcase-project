'use client';
import classNames from 'classnames';
import './Select.scss';

type Props = {
  value: string;
  error?: boolean;
  isDisabled?: boolean;
  flatRight?: boolean;
  flatLeft?: boolean;
};

export const Select: React.FC<Props> = ({
  value,
  error = false,
  isDisabled = false,
  flatRight = false,
  flatLeft = false,
}) => (
  <div className={classNames("select", {
    "select--disabled": isDisabled,
    "select--error": error,
    "select--flat-right": flatRight,
    "select--flat-left": flatLeft,
  })}>
    <div className="select__left">
      {value || "Select"}
    </div>

    <div className="select__arrow"/>
  </div>
);
