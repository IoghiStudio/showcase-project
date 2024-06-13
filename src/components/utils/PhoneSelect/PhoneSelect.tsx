'use client';
import '../Select/Select.scss';
import { FlagIcon } from '../FlagIcon';
import classNames from 'classnames';

type Props = {
  code: string | null;
  error?: boolean;
};

export const PhoneSelect: React.FC<Props> = ({
  code,
  error = false
}) =>  (
  <div className={classNames("select select--phone", {
    "select--error": error
  })}>
    <div className="select__flag">
      <FlagIcon code={code}/>
    </div>

    <div className="select__arrow"/>
  </div>
)
