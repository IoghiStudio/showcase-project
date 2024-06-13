'use client';
import classNames from 'classnames';
import './InputArea.scss';

type Props = {
  name: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void
  onPaste?: (e: React.ClipboardEvent<HTMLTextAreaElement>) => void
  placeholder?: string;
  error?: boolean;
  isDisabled?: boolean;
};

export const InputArea: React.FC<Props> = ({
  name,
  value,
  onChange,
  onPaste,
  placeholder = '',
  error = false,
  isDisabled = false,
}) => {
  return (
    <textarea
      className={classNames('input-area', {
        'input-area--disabled': isDisabled,
        'input-area--error': error,
      })}
      name={name}
      value={value}
      onChange={onChange}
      onPaste={onPaste}
      placeholder={placeholder}
      disabled={isDisabled}
    />
  )
}

