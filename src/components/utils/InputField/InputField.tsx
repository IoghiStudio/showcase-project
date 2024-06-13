'use client';
import cn from 'classnames';
import './InputField.scss';
import classNames from 'classnames';
import { useState } from 'react';

type Props = {
  type: string;
  name: string;
  value: string;
  max?: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void
  placeholder?: string;
  isDisabled?: boolean;
  error?: boolean;
  forPhone?: boolean;
};

export const InputField: React.FC<Props> = ({
  type,
  name,
  value,
  max = '',
  onChange,
  placeholder = '',
  isDisabled = false,
  forPhone = false,
  error = false,
}) => (
  <div className='input'>
    <input
      type={type}
      name={name}
      value={value}
      max={max}
      onChange={onChange}
      disabled={isDisabled}
      placeholder={placeholder}
      className={cn('input__field', {
        'input__field--phone': forPhone,
        'input__field--disabled': isDisabled,
        'input__field--error': error,
      })}
    />

    <div className={classNames('input__arrow', {
      "input__arrow--disabled": !max
    })}/>
  </div>
)



