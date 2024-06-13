'use client';
import './AddAnother.scss';
import { useRouter } from 'next/navigation';

type Props = {
  buttonText: string;
  redirectPath: string;
};

export const AddAnother: React.FC<Props> = ({
  buttonText,
  redirectPath,
}) => {
  const router = useRouter();

  return (
    <div className="add-another" onClick={() => {
      router.push(redirectPath)
    }}>
      <div className="add-another__icon"/>

      <div className="add-another__text">
        {buttonText}
      </div>
    </div>
  )
}
