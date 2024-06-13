'use client';
import '../Select/Select.scss';
import { FlagIcon } from '../FlagIcon';
import classNames from 'classnames';

type Props = {
  name: string | null;
  code: string | null;
  error?: boolean;
  disabled?: boolean;
  flatRight?: boolean;
};

export const CountrySelect: React.FC<Props> = ({
  name,
  code,
  error = false,
  disabled = false,
  flatRight = false,
}) =>  (
  <div className={classNames("select select--flag", {
    "select--error": error,
    "select--disabled": disabled,
    "select--flat-right": flatRight,
  })}>
    <div className="select__left">
      <div className="select__flag">
        <FlagIcon code={code}/>
      </div>

      {name || "Select"}
    </div>

    {!disabled && (
      <div className="select__arrow"/>
    )}
  </div>
)
