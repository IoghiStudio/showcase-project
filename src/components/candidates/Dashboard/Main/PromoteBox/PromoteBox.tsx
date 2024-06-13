'use client'
import { useRouter } from 'next/navigation';
import './PromoteBox.scss';

export const PromoteBox = () => {
  const router = useRouter();

  return (
    <div className="container promote-box">
      <div className="promote-box__part">
        <div className="promote-box__top">
          <div className="promote-box__title">
            <div className="promote-box__title-part">Promote your</div>
            <div className="promote-box__title-part">CV Listings</div>
          </div>

          <div className="promote-box__icon"/>
        </div>

        <div className="promote-box__text">
          Bring your CV in front of others to get more job opportunities
        </div>
      </div>

      <div onClick={() => router.push('/candidates/dashboard/promotion/')}  className="promote-box__button">
        Promote your position
      </div>
    </div>
  )
}
